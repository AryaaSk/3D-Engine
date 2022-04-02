class Camera {
    scale = 1;
    position = [0, 0, 0];

    render(box: Box, outline?: boolean) {

        //create new object, with scaled up matrix:
        const scaledPhysicalMatrix = box.physicalMatrix.scaledUp(this.scale);

        //the first thing to do is to calculate the centers of the faces
        for (let i = 0; i != box.faces.length; i += 1)
        {
            //we can just calculate the midpoint of one of the diagonals, since that is where it should cross
            const point1 = scaledPhysicalMatrix.getColumn(box.faces[i].diagonal1.p1Index);
            const point2 = scaledPhysicalMatrix.getColumn(box.faces[i].diagonal1.p2Index);

            const averageX = (point1[0] + point2[0]) / 2;
            const averageY = (point1[1] + point2[1]) / 2;
            const averageZ = (point1[2] + point2[2]) / 2;
            box.faces[i].center = [averageX, averageY, averageZ];
        }

        const scaledPosition = [this.position[0] * this.scale, this.position[1] * this.scale, this.position[2] * this.scale]

        //sort faces based on distance to camera from center (Not entirely accurate, not sure how to fix), so the furthest away get rendered first
        let sortedFaces: { diagonal1: { p1Index: number, p2Index: number }, diagonal2: { p1Index: number, p2Index: number }, facingAxis: string, center: number[] }[] = [];
        const facesCopy = JSON.parse(JSON.stringify(box.faces))
        while (facesCopy.length != 0) {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != facesCopy.length; i += 1) {
                if (distanceBetween(scaledPosition, facesCopy[i].center) > distanceBetween(scaledPosition, facesCopy[furthestDistanceIndex].center)) { furthestDistanceIndex = i; }
            }
            sortedFaces.push(facesCopy[furthestDistanceIndex]);
            facesCopy.splice(furthestDistanceIndex, 1);
        }

        //TODO: To minimize overlapping of faces, I can calculate which faces are facing the camera, then just hide the ones which arent

        //and finally we can draw the faces with the box's faces object
        for (let i = 0; i != sortedFaces.length; i += 1) {
            const point1 = scaledPhysicalMatrix.getColumn(sortedFaces[i].diagonal1.p1Index);
            const point2 = scaledPhysicalMatrix.getColumn(sortedFaces[i].diagonal2.p1Index);
            const point3 = scaledPhysicalMatrix.getColumn(sortedFaces[i].diagonal1.p2Index);
            const point4 = scaledPhysicalMatrix.getColumn(sortedFaces[i].diagonal2.p2Index);

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

        //Don't want to see points
        /*
        //use the object's physicalMatrix, and just plot the points, the physicalMatrix will actually contain 3 rows, but the third one is the z-axis, so we just ignore it
        for (let i = 0; i != scaledPhysicalMatrix.width; i += 1) { 
            const point = scaledPhysicalMatrix.getColumn(i); 
            plotPoint(point, "#000000");
        }
        */

        if (outline == true)
        {
            //use the object's edges, with the physicalMatrix, to draw the edges of the box
            for (let i = 0; i != box.edges.length; i += 1) {
                const point1 = scaledPhysicalMatrix.getColumn(box.edges[i].p1Index);
                const point2 = scaledPhysicalMatrix.getColumn(box.edges[i].p2Index);
                drawLine(point1, point2, "#606060");
            }
        }
    }

    constructor() { };
}