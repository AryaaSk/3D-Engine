class Camera {
    position: {x: number, y: number} = { x: 0, y: 0 };
    zoom = 1;

    worldRotation: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };
    worldRotationMatrix = new matrix();

    render(objects: Shape[]) {

        const objectData: { object: Shape, cameraObjectMatrix: matrix, center: number[] }[] = [];

        //CALCULATING OBJECTS' POSITION ON THE 2D SCREEN:
        for (let objectIndex = 0; objectIndex != objects.length; objectIndex += 1)
        {
            const object = objects[objectIndex];

            //You cannot physically move the camera, since the user sees through it through their screen, so you have to move the objects in the opposite direction to the camera
            let cameraObjectMatrix = object.physicalMatrix.copy();

            cameraObjectMatrix.scaleUp(this.zoom); //scale first to prevent it from affecting other translations

            cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation

            //I wasn't able to implement 3D camera position, so it's just 2D
            const gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };

            //translate object relative to grid origin, since the object's position is relative to the origin, it can also be considered as a vector from the origin
            const distanceX = object.position.x;
            const distanceY = object.position.y;
            const distanceZ = object.position.z;
            let gridMiddleObjectVectorMatrix = new matrix();
            gridMiddleObjectVectorMatrix.addColumn([distanceX, distanceY, distanceZ]);
            gridMiddleObjectVectorMatrix = multiplyMatrixs(this.worldRotationMatrix, gridMiddleObjectVectorMatrix);
            const translationVector = gridMiddleObjectVectorMatrix.getColumn(0);

            //finally we will move the object in the correct position based on zoom
            //calculate vector from actual screen origin (0, 0, 0), to the shape
            const absoluteOriginObjectVector = new matrix();
            absoluteOriginObjectVector.addColumn([gridOrigin.x + translationVector[0], gridOrigin.y + translationVector[1], gridOrigin.z + translationVector[2]]);
            absoluteOriginObjectVector.scaleUp(this.zoom);
            const zoomTranslationVector = absoluteOriginObjectVector.getColumn(0) //now we have the new coordinates of the object, but we need to find the difference between this and the old one
            cameraObjectMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
            
            //finally we find the center point, which is just the middle of the diagonal between point 1 and point7 add this to the objectData list
            const point1 = cameraObjectMatrix.getColumn(0);
            const point7 = cameraObjectMatrix.getColumn(6);
            const centerPoint = [(point1[0] + point7[0]) / 2, (point1[1] + point7[1]) / 2, (point1[2] + point7[2]) / 2]
            objectData.push({object: object, cameraObjectMatrix: cameraObjectMatrix, center: centerPoint});
        }

        //now sort objectData based on distance to the position point (furthest first)
        const positionPoint = [0, 0, -50000];
        let sortedObjects: { object: Shape, cameraObjectMatrix: matrix, center: number[] }[] = [];
        while (objectData.length != 0)
        {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != objectData.length; i += 1)
            {
                if (distanceBetween(positionPoint, objectData[i].center) > distanceBetween(positionPoint, objectData[furthestDistanceIndex].center))
                { furthestDistanceIndex = i; }
            }
            sortedObjects.push(objectData[furthestDistanceIndex]);
            objectData.splice(furthestDistanceIndex, 1);
        }


        //now render objects from sortedObjects to render the furthest ones first
        //ACTUALLY RENDERING THE OBJECTS:
        for (let objectIndex = 0; objectIndex != sortedObjects.length; objectIndex += 1)
        {
            const object = sortedObjects[objectIndex].object;
            const cameraObjectMatrix = sortedObjects[objectIndex].cameraObjectMatrix;

            //calculate the centers of the faces
            for (let i = 0; i != object.faces.length; i += 1)
            {
                //we can just calculate the midpoint of one of the diagonals, since that is where it should cross
                const point1 = cameraObjectMatrix.getColumn(object.faces[i].diagonal1.p1Index);
                const point2 = cameraObjectMatrix.getColumn(object.faces[i].diagonal1.p2Index);

                const averageX = (point1[0] + point2[0]) / 2;
                const averageY = (point1[1] + point2[1]) / 2;
                const averageZ = (point1[2] + point2[2]) / 2;
                object.faces[i].center = [averageX, averageY, averageZ];
            }
    
            //if we use the cameraObjectMatrix, then the camera is actually located at 0, 0, 0, so we will sort out faces based on their distance to the origin
            //however I need to use a z-axis of -50000, in order make the differences between object's insignificant
            let sortedFaces: { diagonal1: { p1Index: number, p2Index: number }, diagonal2: { p1Index: number, p2Index: number }, facingAxis: string, center: number[] }[] = [];
            const facesCopy = JSON.parse(JSON.stringify(object.faces))
            while (facesCopy.length != 0) {
                let furthestDistanceIndex = 0;
                for (let i = 0; i != facesCopy.length; i += 1) {
                    if (distanceBetween(positionPoint, facesCopy[i].center) > distanceBetween(positionPoint, facesCopy[furthestDistanceIndex].center)) { furthestDistanceIndex = i; }
                }
                sortedFaces.push(facesCopy[furthestDistanceIndex]);
                facesCopy.splice(furthestDistanceIndex, 1);
            }

            //TODO: To minimize overlapping of faces, I can calculate which faces are facing the camera, then just hide the ones which arent

            //and finally we can draw the faces with the object's faces object
            for (let i = 0; i != sortedFaces.length; i += 1) {
                const point1 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p1Index);
                const point2 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p1Index);
                const point3 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p2Index);
                const point4 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p2Index);

                const facingAxis = sortedFaces[i].facingAxis;
                let colour = object.faceColours[facingAxis];
                if (colour == "") { continue; }

                drawQuadrilateral(point1, point2, point3, point4, colour);
            }
            if (object.outline == true)
            {
                //use the object's edges, with the physicalMatrix, to draw the edges of the object
                for (let i = 0; i != object.edges.length; i += 1) {
                    const point1 = cameraObjectMatrix.getColumn(object.edges[i].p1Index);
                    const point2 = cameraObjectMatrix.getColumn(object.edges[i].p2Index);
                    drawLine(point1, point2, "#606060");
                }
            }
            
        }
    }

    updateRotationMatrix() //rotate entire world
    {
        const rX = (this.worldRotation.x % 360);
        const rY = (this.worldRotation.y % 360);
        const rZ = (this.worldRotation.z % 360);

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
        const gridLength = 500 * this.zoom;

        //create 2 points for each axis, then transform them using the worldRotationMatrix, then just plot them
        let startPointMatrix = new matrix();
        startPointMatrix.addColumn([-gridLength, 0, 0]) //x-axis
        startPointMatrix.addColumn([0, -gridLength, 0]) //y-axis
        startPointMatrix.addColumn([0, 0, -gridLength]) //z-axis

        let endPointMatrix = new matrix();
        endPointMatrix.addColumn([gridLength, 0, 0])
        endPointMatrix.addColumn([0, gridLength, 0])
        endPointMatrix.addColumn([0, 0, gridLength])

        startPointMatrix = multiplyMatrixs(this.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(this.worldRotationMatrix, endPointMatrix);

        //we also want to offset this grid by the camera's position, and also the zoom
        const gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };

        //move grid based on zoom
        const absoluteOriginObjectVector = new matrix();
        absoluteOriginObjectVector.addColumn([gridOrigin.x, gridOrigin.y, gridOrigin.z]);
        absoluteOriginObjectVector.scaleUp(this.zoom);
        const zoomTranslationVector = absoluteOriginObjectVector.getColumn(0)

        startPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        endPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);

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