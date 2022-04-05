"use strict";
class Camera {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.zoom = 1;
        this.worldRotation = { x: 0, y: 0, z: 0 };
        this.worldRotationMatrix = new matrix();
        this.worldRotationMatrix.addColumn([1, 0, 0]);
        this.worldRotationMatrix.addColumn([0, 1, 0]);
        this.worldRotationMatrix.addColumn([0, 0, 1]);
        this.updateRotationMatrix();
    }
    render(objects) {
        const objectData = [];
        for (let objectIndex = 0; objectIndex != objects.length; objectIndex += 1) {
            const object = objects[objectIndex];
            let cameraObjectMatrix = object.physicalMatrix.copy();
            //transform the object's physicalMatrix to how the camera would see it:
            cameraObjectMatrix.scaleUp(this.zoom); //scale from zoom
            cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation
            //translate object relative to grid origin, since the object's position is relative to the origin, it can also be considered as a vector from the origin
            const gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };
            let originObjectVector = new matrix();
            originObjectVector.addColumn([object.position.x, object.position.y, object.position.z]);
            originObjectVector = multiplyMatrixs(this.worldRotationMatrix, originObjectVector);
            const originObjectTranslation = originObjectVector.getColumn(0);
            //move the object in the correct position based on zoom, calculate vector from screen origin (0, 0, 0), to object
            const screenOriginObjectVector = new matrix();
            screenOriginObjectVector.addColumn([gridOrigin.x + originObjectTranslation[0], gridOrigin.y + originObjectTranslation[1], gridOrigin.z + originObjectTranslation[2]]);
            screenOriginObjectVector.scaleUp(this.zoom);
            const ultimateTranslation = screenOriginObjectVector.getColumn(0); //screenOriginObjectVector contains the originObjectTranslation inside it
            cameraObjectMatrix.translateMatrix(ultimateTranslation[0], ultimateTranslation[1], ultimateTranslation[2]);
            //work out center of shape by finding average of all points
            let totalX = 0;
            let totalY = 0;
            let totalZ = 0;
            for (let i = 0; i != cameraObjectMatrix.width; i += 1) {
                const point = cameraObjectMatrix.getColumn(i);
                totalX += point[0];
                totalY += point[1];
                totalZ += point[2];
            }
            const averageX = totalX / cameraObjectMatrix.width;
            const averageY = totalY / cameraObjectMatrix.width;
            const averageZ = totalZ / cameraObjectMatrix.width;
            const center = [averageX, averageY, averageZ];
            objectData.push({ object: object, screenPoints: cameraObjectMatrix, center: center });
        }
        //sort objects based on distance to the position point:
        const positionPoint = [0, 0, -50000];
        const sortedObjects = [];
        while (objectData.length != 0) {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != objectData.length; i += 1) {
                if (distanceBetween(positionPoint, objectData[i].center) > distanceBetween(positionPoint, objectData[furthestDistanceIndex].center)) {
                    furthestDistanceIndex = i;
                }
            }
            sortedObjects.push(objectData[furthestDistanceIndex]);
            objectData.splice(furthestDistanceIndex, 1);
        }
        for (let objectIndex = 0; objectIndex != sortedObjects.length; objectIndex += 1) {
            const object = sortedObjects[objectIndex].object;
            const screenPoints = sortedObjects[objectIndex].screenPoints;
            //draw faces of shape in correct order, by finding the center and sorting based on distance to the position point
            let objectFaces = [];
            //populate the array
            for (let i = 0; i != object.faces.length; i += 1) {
                let points = [];
                for (let a = 0; a != object.faces[i].pointIndexes.length; a += 1) {
                    points.push(screenPoints.getColumn(object.faces[i].pointIndexes[a]));
                }
                //find center by getting average of all points
                let totalX = 0;
                let totalY = 0;
                let totalZ = 0;
                for (let i = 0; i != points.length; i += 1) {
                    totalX += points[i][0];
                    totalY += points[i][1];
                    totalZ += points[i][2];
                }
                const averageX = totalX / points.length;
                const averageY = totalY / points.length;
                const averageZ = totalZ / points.length;
                const center = [averageX, averageY, averageZ];
                objectFaces.push({ points: points, center: center, colour: object.faces[i].colour });
            }
            //sort based on distance from center to (0, 0, -50000)
            let sortedFaces = [];
            while (objectFaces.length != 0) {
                let furthestDistanceIndex = 0;
                for (let i = 0; i != objectFaces.length; i += 1) {
                    if (distanceBetween(positionPoint, objectFaces[i].center) > distanceBetween(positionPoint, objectFaces[furthestDistanceIndex].center)) {
                        furthestDistanceIndex = i;
                    }
                }
                sortedFaces.push(objectFaces[furthestDistanceIndex]);
                objectFaces.splice(furthestDistanceIndex, 1);
            }
            //draw the faces as a quadrilateral, later I will change the drawQuadrilateral function to a drawShape function, which can take as many points as it needs
            for (let i = 0; i != sortedFaces.length; i += 1) {
                const facePoints = sortedFaces[i].points;
                let colour = sortedFaces[i].colour;
                if (colour == "") {
                    continue;
                } //transparent face
                drawShape(facePoints, colour);
            }
            //draw the edges if outline is true
            if (object.outline == true) {
                for (let i = 0; i != object.edgeIndexes.length; i += 1) {
                    const point1 = screenPoints.getColumn(object.edgeIndexes[i][0]);
                    const point2 = screenPoints.getColumn(object.edgeIndexes[i][1]);
                    drawLine(point1, point2, "#000000");
                }
            }
        }
    }
    updateRotationMatrix() {
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
        this.worldRotationMatrix.setValue(0, 2, worldiHat[2]);
        this.worldRotationMatrix.setValue(1, 0, worldjHat[0]);
        this.worldRotationMatrix.setValue(1, 1, worldjHat[1]);
        this.worldRotationMatrix.setValue(1, 2, worldjHat[2]);
        this.worldRotationMatrix.setValue(2, 0, worldkHat[0]);
        this.worldRotationMatrix.setValue(2, 1, worldkHat[1]);
        this.worldRotationMatrix.setValue(2, 2, worldkHat[2]);
    }
    renderGrid() {
        const gridLength = 500 * this.zoom;
        //create 2 points for each axis, then transform them using the worldRotationMatrix, then just plot them
        let startPointMatrix = new matrix();
        startPointMatrix.addColumn([-gridLength, 0, 0]); //x-axis
        startPointMatrix.addColumn([0, -gridLength, 0]); //y-axis
        startPointMatrix.addColumn([0, 0, -gridLength]); //z-axis
        let endPointMatrix = new matrix();
        endPointMatrix.addColumn([gridLength, 0, 0]);
        endPointMatrix.addColumn([0, gridLength, 0]);
        endPointMatrix.addColumn([0, 0, gridLength]);
        startPointMatrix = multiplyMatrixs(this.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(this.worldRotationMatrix, endPointMatrix);
        //we also want to offset this grid by the camera's position, and also the zoom
        const gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };
        //move grid based on zoom
        const absoluteOriginObjectVector = new matrix();
        absoluteOriginObjectVector.addColumn([gridOrigin.x, gridOrigin.y, gridOrigin.z]);
        absoluteOriginObjectVector.scaleUp(this.zoom);
        const zoomTranslationVector = absoluteOriginObjectVector.getColumn(0);
        startPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        endPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        for (let i = 0; i != startPointMatrix.width; i += 1) {
            const point1 = startPointMatrix.getColumn(i);
            const point2 = endPointMatrix.getColumn(i);
            drawLine(point1, point2, "#000000");
        }
    }
    ;
}
