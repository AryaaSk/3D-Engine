class Camera {
    position: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };
    rotation: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };

    zoom = 1;

    render(box: Box, outline?: boolean) {

        /*
        const iHat = [cos(rY) * cos(rZ), cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ), sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ)];
        const jHat = [-(cos(rY)) * sin(rZ), cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ), sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ)];
        const kHat = [sin(rY), -(sin(rX)) * cos(rY), cos(rX) * cos(rY)];
        */

        //The box's physicalMatrix tells us where the box is located in the 3D world
        //You cannot physically move the camera, since the user sees through it through their screen, so you have to move the objects in the opposite direction to the camera
        let cameraObjectMatrix = box.physicalMatrix.copy();

        //we set the object's position based on the difference between it and the camera
        const distanceX = -(this.position.x - box.position.x);
        const distanceY = -(this.position.y - box.position.y);
        const distanceZ = -(this.position.z - box.position.z);

        //apply translations to matrix
        for (let i = 0; i != cameraObjectMatrix.width; i += 1)
        {
            const point = cameraObjectMatrix.getColumn(i);
            cameraObjectMatrix.setValue(i, 0, point[0] + distanceX);
            cameraObjectMatrix.setValue(i, 1, point[1] + distanceY);
            cameraObjectMatrix.setValue(i, 2, point[2] + distanceZ);
        }

        //finally we can simulate the z-axis, by scalling the object down the further away it is (this also creates a parallax effect since the object's further away get moved less)
        const unitScaleFactor = canvasHeight / box.dimensions.height; //this is effectively the scale factor which makes the object fill up the whole screen, or if the camera was position right in front of it
        const objectScaleFactor = unitScaleFactor / (distanceZ / 10);
        cameraObjectMatrix.scaleUp(objectScaleFactor);


        //finally we need to make it look like the object is rotated inversly to the camera
        //TODO: IMPLEMENT OBJECT ROTATION



        cameraObjectMatrix.scaleUp(this.zoom); //finally to zoom into objects we can scale up their physical matrix


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
 
        //sort faces based on distance to camera from center (Not entirely accurate, not sure how to fix), so the furthest away get rendered first
        //instead of using the camera's position, I will position the z-axis very far away to simulate an actual person watching
        const positionPoint = [this.position.x, this.position.y, -5000];
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
            let colour = "";
            if ( facingAxis == "-x") { colour = "#ff0000"; }
            else if ( facingAxis == "-y") { colour = "#00ff00"; }
            else if ( facingAxis == "-z") { colour = "#0000ff"; }
            else if ( facingAxis == "+x") { colour = "#ffff00"; }
            else if ( facingAxis == "+y") { colour = "#00ffff"; }
            else if ( facingAxis == "+z") { colour = "#ff00ff"; }
            else { continue; }

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

    constructor() { };
}