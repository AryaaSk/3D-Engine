class Camera {
    position: {x: number, y: number} = { x: 0, y: 0 };
    zoom = 1;

    worldRotation: {x: number, y: number, z: number} = { x: 0, y: 0, z: 0 };
    worldRotationMatrix = new matrix();

    render(objects: Shape[], showPoints?: boolean) {  

        const objectData: { object: Shape, screenPoints: matrix, center: number[] }[] = [];
        for (let objectIndex = 0; objectIndex != objects.length; objectIndex += 1)
        {
            //transform the object's physicalMatrix to how the camera would see it:
            const object = objects[objectIndex];
            let cameraObjectMatrix = object.physicalMatrix.copy();

            cameraObjectMatrix.scaleUp(this.zoom); //scale from zoom
            cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation

            //translate object relative to grid origin, since the object's position is relative to the origin, it can also be considered as a vector from the origin
            const gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };
            let originObjectVector = new matrix();
            originObjectVector.addColumn([object.position.x, object.position.y, object.position.z]);
            originObjectVector = multiplyMatrixs(this.worldRotationMatrix, originObjectVector);
            const originObjectTranslation = originObjectVector.getColumn(0);

            //move the object in the correct position based on zoom, calculate vector from zoom point (0, 0, 0), to object
            const screenOriginObjectVector = new matrix();
            screenOriginObjectVector.addColumn([(gridOrigin.x + originObjectTranslation[0]), (gridOrigin.y + originObjectTranslation[1]), (gridOrigin.z + originObjectTranslation[2])]);
            screenOriginObjectVector.scaleUp(this.zoom);

            const ultimateTranslation = screenOriginObjectVector.getColumn(0); //screenOriginObjectVector contains the originObjectTranslation inside it
            cameraObjectMatrix.translateMatrix(ultimateTranslation[0], ultimateTranslation[1], ultimateTranslation[2]);

            //work out center of shape by finding average of all points
            let [totalX, totalY, totalZ] = [0, 0, 0];
            for (let i = 0; i != cameraObjectMatrix.width; i += 1) {
                const point = cameraObjectMatrix.getColumn(i);
                totalX += point[0]; totalY += point[1]; totalZ += point[2];
            }
            const [averageX, averageY, averageZ] = [totalX / cameraObjectMatrix.width, totalY / cameraObjectMatrix.width, totalZ / cameraObjectMatrix.width];
            const center = [averageX, averageY, averageZ];

            objectData.push( { object: object, screenPoints: cameraObjectMatrix, center: center} )
        }

        //sort objects based on distance to the position point:
        const positionPoint = [0, 0, -50000];
        const sortedObjects: { object: Shape, screenPoints: matrix, center: number[] }[] = this.sortFurthestDistanceTo(objectData, "center", positionPoint);

        for (let objectIndex = 0; objectIndex != sortedObjects.length; objectIndex += 1 )
        {
            const object = sortedObjects[objectIndex].object;
            const screenPoints = sortedObjects[objectIndex].screenPoints;

            //draw faces of shape in correct order, by finding the center and sorting based on distance to the position point
            let objectFaces: { points: number[][], center: number[], colour: string, faceIndex: number }[] = [];

            //populate the array
            for (let i = 0; i != object.faces.length; i += 1)
            {
                let points: number[][] = [];
                for (let a = 0; a != object.faces[i].pointIndexes.length; a += 1)
                { points.push(screenPoints.getColumn(object.faces[i].pointIndexes[a])); }

                //find center by getting average of all points
                let [totalX, totalY, totalZ] = [0, 0, 0];
                for (let a = 0; a != points.length; a += 1) { totalX += points[a][0]; totalY += points[a][1]; totalZ += points[a][2]; }
                const [averageX, averageY, averageZ] = [totalX / points.length, totalY / points.length, totalZ / points.length]
                const center = [averageX, averageY, averageZ];
                objectFaces.push( { points: points, center: center, colour: object.faces[i].colour, faceIndex: i } );
            }

            const sortedFaces = this.sortFurthestDistanceTo(objectFaces, "center", positionPoint); //sort based on distance from center to (0, 0, -50000)

            //draw the faces as a quadrilateral, later I will change the drawQuadrilateral function to a drawShape function, which can take as many points as it needs
            for (let i = 0; i != sortedFaces.length; i += 1)
            {
                const facePoints = sortedFaces[i].points;
                let colour = sortedFaces[i].colour;
                if (colour != "") { drawShape(facePoints, colour, object.showOutline); } //if face is transparent then just don't render it
                
                if (object.showFaceIndexes == true)
                { plotPoint(sortedFaces[i].center, "#000000", String(sortedFaces[i].faceIndex)); }
            }

            //draw points last so you can see them through the faces
            if (showPoints == true)
            {
                for (let i = 0; i != screenPoints.width; i += 1)
                {
                    const point = screenPoints.getColumn(i);
                    plotPoint(point, "#000000", String(i));
                }
            }
        }

        return sortedObjects;
    }
    private sortFurthestDistanceTo(list: any[], positionKey: string, positionPoint: number[])
    {
        const sortedList: any[] = [];
        const listCopy = list;
        while (listCopy.length != 0)
        {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != listCopy.length; i += 1) {
                if (distanceBetween(positionPoint, listCopy[i][positionKey]) > distanceBetween(positionPoint, listCopy[furthestDistanceIndex][positionKey])) { furthestDistanceIndex = i; }
            }
            sortedList.push(listCopy[furthestDistanceIndex]);
            listCopy.splice(furthestDistanceIndex, 1);
        }
        return sortedList
    }

    updateRotationMatrix() //rotate entire world
    {
        const [rX, rY, rZ] = [(this.worldRotation.x % 360), (this.worldRotation.y % 360), (this.worldRotation.z % 360)]
        this.worldRotationMatrix = calculateRotationMatrix(rX, rY, rZ);
    }

    renderGrid()
    {
        const gridLength = 1000 * this.zoom;

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

        for (let i = 0; i != startPointMatrix.width; i += 1) //draw grid lines in
        {
            const point1 = startPointMatrix.getColumn(i);
            const point2 = endPointMatrix.getColumn(i);
            drawLine(point1, point2, "#000000");
        }
    }

    enableMovementControls(canvasID: string, rotation: boolean, movement: boolean, zoom: boolean)
    {
        let mouseDown = false;
        let altDown = false;
        let previousX = 0;
        let previousY = 0;
        document.getElementById(canvasID)!.onmousedown = ($e) => { mouseDown = true; previousX = $e.clientX; previousY = $e.clientY; }
        document.getElementById(canvasID)!.onmouseup = () => { mouseDown = false; }
        document.getElementById(canvasID)!.onmousemove = ($e) => {
            if (mouseDown == false) { return; }

            let [differenceX, differenceY] = [$e.clientX - previousX, $e.clientY - previousY];
            if (altDown == true && movement == true) {
                this.position.x -= differenceX / this.zoom;
                this.position.y += differenceY / this.zoom;
            }
            else if (rotation == true) {
                const absX = Math.abs(this.worldRotation.x) % 360
                if (absX > 90 && absX < 270)  { differenceX *= -1; }
                this.worldRotation.x -= differenceY / 5;
                this.worldRotation.y -= differenceX / 5;
                this.updateRotationMatrix()
            }
            [previousX, previousY] = [$e.clientX, $e.clientY];
        }
        document.addEventListener('keydown', ($e) => { //don't need to use event listeners on the mouse since it is attached to the canvas element
            const key = $e.key.toLowerCase();
            if (key == "alt") { altDown = true; }
        });
        document.addEventListener('keyup', ($e) => {
            const key = $e.key.toLowerCase();
            if (key == "alt") { altDown = false; }
        });

        //Zooming in/out
        document.getElementById(canvasID)!.onwheel = ($e: any) => {
            if (zoom == false) { return; }
            if (this.zoom < 0) { this.zoom = $e.wheelDeltaY / 1000; }
            this.zoom -= $e.wheelDeltaY / 1000;
        }
    }

    constructor() { 
        this.updateRotationMatrix();
    };
}