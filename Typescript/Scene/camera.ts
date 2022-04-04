class Camera {
    position: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };
    zoom = 2;

    worldRotation: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };
    worldRotationMatrix = new matrix();

    render(box: Box, outline?: boolean) {
        //CALCULATING OBJECT'S POSITION ON THE 2D SCREEN:

        //The box's physicalMatrix tells us how where the point on the box are located relative to the origin, but we still need to position it
        //You cannot physically move the camera, since the user sees through it through their screen, so you have to move the objects in the opposite direction to the camera
        let cameraObjectMatrix = box.physicalMatrix.copy();

        cameraObjectMatrix.scaleUp(this.zoom); //scale first to prevent it from affecting other translations, however this means it is not a real zoom, instead just looks like you are englarging objects

        cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation

        const gridMiddle = { x: -(this.position.x), y: -(this.position.y), z: -(this.position.z) };
        //we set the object's position based on the difference between it and the grid (which is calculated with the camera)
        //the position would be the gridMiddle + object's position, but we need to get the translation from the origin (that is where the object would be located now), these are the positions in the absolute 3D World, so they can also be considered translations from origin
        const objectPositionX = gridMiddle.x + box.position.x;
        const objectPositionY = gridMiddle.y + box.position.y;
        const objectPositionZ = gridMiddle.z + box.position.z;

        //however since those are the positions in the 3D, we need to find the vector of gridMiddle -> Object, transform that with the rotation matrix, and then translate it by that instead
        const distanceX = objectPositionX - gridMiddle.x;
        const distanceY = objectPositionY - gridMiddle.y;
        const distanceZ = objectPositionZ - gridMiddle.z;
        let gridMiddleObjectVectorMatrix = new matrix();
        gridMiddleObjectVectorMatrix.addColumn([distanceX, distanceY, distanceZ]);
        gridMiddleObjectVectorMatrix = multiplyMatrixs(this.worldRotationMatrix, gridMiddleObjectVectorMatrix);
        gridMiddleObjectVectorMatrix.scaleUp(this.zoom); //need to add zoom before we translate it to avoid the shape from rotating around the wrong point
        
        //now we have the translation vector from the gridMiddle, but we want it from the origin of the screen, so we just need to translate it by the gridMiddle
        gridMiddleObjectVectorMatrix.translateMatrix(gridMiddle.x, gridMiddle.y, gridMiddle.z);

        const translationVector = gridMiddleObjectVectorMatrix.getColumn(0);
        cameraObjectMatrix.translateMatrix(translationVector[0], translationVector[1], translationVector[2]);


        //ACTUALLY RENDERING THE OBJECT:
        //calculate the centers of the faces
        for (let i = 0; i != box.faces.length; i += 1)
        {
            //we can just calculate the midpoint of one of the diagonals, since that is where it should cross
            const point1 = cameraObjectMatrix.getColumn(box.faces[i].diagonal1.p1Index);
            const point2 = cameraObjectMatrix.getColumn(box.faces[i].diagonal1.p2Index);

            const averageX = (point1[0] + point2[0]) / 2;
            const averageY = (point1[1] + point2[1]) / 2;
            const averageZ = (point1[2] + point2[2]) / 2;
            box.faces[i].center = [averageX, averageY, averageZ];
        }
 
        //if we use the cameraObjectMatrix, then the camera is actually located at 0, 0, 0, so we will sort out faces based on their distance to the origin
        //however I need to use a z-axis of -50000, in order make the differences between object's insignificant
        const positionPoint = [0, 0, -50000];
        let sortedFaces: { diagonal1: { p1Index: number, p2Index: number }, diagonal2: { p1Index: number, p2Index: number }, facingAxis: string, center: number[] }[] = [];
        const facesCopy = JSON.parse(JSON.stringify(box.faces))
        while (facesCopy.length != 0) {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != facesCopy.length; i += 1) {
                if (distanceBetween(positionPoint, facesCopy[i].center) > distanceBetween(positionPoint, facesCopy[furthestDistanceIndex].center)) { furthestDistanceIndex = i; }
            }
            sortedFaces.push(facesCopy[furthestDistanceIndex]);
            facesCopy.splice(furthestDistanceIndex, 1);
        }

        //TODO: To minimize overlapping of faces, I can calculate which faces are facing the camera, then just hide the ones which arent

        //and finally we can draw the faces with the box's faces object
        for (let i = 0; i != sortedFaces.length; i += 1) {
            const point1 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p1Index);
            const point2 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p1Index);
            const point3 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p2Index);
            const point4 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p2Index);

            const facingAxis = sortedFaces[i].facingAxis;
            let colour = box.faceColours[facingAxis];
            if (colour == "") { continue; }

            drawQuadrilateral(point1, point2, point3, point4, colour);
        }
        if (outline == true)
        {
            //use the object's edges, with the physicalMatrix, to draw the edges of the box
            for (let i = 0; i != box.edges.length; i += 1) {
                const point1 = cameraObjectMatrix.getColumn(box.edges[i].p1Index);
                const point2 = cameraObjectMatrix.getColumn(box.edges[i].p2Index);
                drawLine(point1, point2, "#606060");
            }
        }
    }

    updateRotationMatrix() //rotate entire world
    {
        const rX = this.worldRotation.x % 360;
        const rY = this.worldRotation.y % 360;
        const rZ = this.worldRotation.z % 360;

        const worldiHat = [1, 0, 0];
        const worldjHat = [0, 1, 0];
        const worldkHat = [0, 0, 1];

        worldiHat[0] = cos(rY) * cos(rZ);
        worldiHat[1] = cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ);
        worldiHat[2] = sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ);
        worldjHat[0] = -(cos(rY)) * sin(rZ);
        worldjHat[1] = cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ);
        worldjHat[2] = sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ);
        worldkHat[0] = sin(rY);
        worldkHat[1] = -(sin(rX)) * cos(rY);
        worldkHat[2] = cos(rX) * cos(rY);

        this.worldRotationMatrix.setValue(0, 0, worldiHat[0]);
        this.worldRotationMatrix.setValue(0, 1, worldiHat[1]);
        this.worldRotationMatrix.setValue(0, 2, worldiHat[2])
        this.worldRotationMatrix.setValue(1, 0, worldjHat[0]);
        this.worldRotationMatrix.setValue(1, 1, worldjHat[1]);
        this.worldRotationMatrix.setValue(1, 2, worldjHat[2]);
        this.worldRotationMatrix.setValue(2, 0, worldkHat[0]);
        this.worldRotationMatrix.setValue(2, 1, worldkHat[1]);
        this.worldRotationMatrix.setValue(2, 2, worldkHat[2]);
    }

    renderGrid()
    {
        //create 2 points for each axis, then transform them using the worldRotationMatrix, then just plot them
        let startPointMatrix = new matrix();
        startPointMatrix.addColumn([-500, 0, 0]) //x-axis
        startPointMatrix.addColumn([0, -500, 0]) //y-axis
        startPointMatrix.addColumn([0, 0, -500]) //z-axis

        let endPointMatrix = new matrix();
        endPointMatrix.addColumn([500, 0, 0])
        endPointMatrix.addColumn([0, 500, 0])
        endPointMatrix.addColumn([0, 0, 500])

        startPointMatrix = multiplyMatrixs(this.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(this.worldRotationMatrix, endPointMatrix);

        //we also want to offset this grid by the camera's position
        startPointMatrix.translateMatrix(-this.position.x, -this.position.y, -this.position.z);
        endPointMatrix.translateMatrix(-this.position.x, -this.position.y, -this.position.z);

        /*
        const point1 = startPointMatrix.getColumn(0);
        const point2 = endPointMatrix.getColumn(0);
        const avX = (point1[0] + point2[0]) / 2;
        const avY = (point1[1] + point2[1]) / 2;
        const avZ = (point1[2] + point2[2]) / 2;
        const gridMiddle = { x: avX, y: avY, z: avZ }; //this is the middle of the grid
        */

        for (let i = 0; i != startPointMatrix.width; i += 1)
        {
            const point1 = startPointMatrix.getColumn(i);
            const point2 = endPointMatrix.getColumn(i);
            drawLine(point1, point2, "#000000");
        }
    }

    constructor() { 
        this.worldRotationMatrix.addColumn([1, 0, 0]);
        this.worldRotationMatrix.addColumn([0, 1, 0]);
        this.worldRotationMatrix.addColumn([0, 0, 1]);

        this.updateRotationMatrix();
    };
}