"use strict";
//basically just want to be able to add objects, and show the lines going into the camera
//also want to show the point where they intersect the viewport (optional: draw lines on the viewport to show resulting image)
//will be done in absolute mode since it is easier to understand and work with.
const localVisualisationScope = () => {
    //CONSTANTS
    const nearDistance = 1000;
    const visualiseRays = (object, cameraPosition, options) => {
        let [showRays, showIntersection, showImage] = [true, true, true];
        if (options?.showIntersection == false) {
            showIntersection = false;
        }
        if (options?.showRays == false) {
            showRays = false;
        }
        if (options?.showImage == false) {
            showImage = false;
        }
        const objectPoints = object.physicalMatrix.copy();
        objectPoints.translateMatrix(object.position.x, object.position.y, object.position.z);
        const cameraPoint = [cameraPosition.x, cameraPosition.y, cameraPosition.z];
        //prepare the points
        let pointsInFrontOfCamera = false;
        for (let i = 0; i != objectPoints.width; i += 1) {
            const vertex = objectPoints.getColumn(i);
            if (vertex[2] > cameraPoint[2]) {
                pointsInFrontOfCamera = true;
            }
            if (vertex[2] <= cameraPoint[2]) {
                objectPoints.setValue(i, 2, cameraPoint[2] + 1); //clip point to the camera'z so it doesn't get inverted
            }
        }
        if (pointsInFrontOfCamera == false) {
            return;
        } //no point rendering if all the points are behind the camera
        const intersectionPoints = [];
        for (let i = 0; i != objectPoints.width; i += 1) {
            const vertex = objectPoints.getColumn(i);
            //calculate intersection, normalize z-axis to (camera.position.z + nearDistance), the position of the viewport
            const vector = [vertex[0] - cameraPoint[0], vertex[1] - cameraPoint[1], vertex[2] - cameraPoint[2]];
            const zScaleFactor = nearDistance / vector[2];
            const intersectionVector = [vector[0] * zScaleFactor, vector[1] * zScaleFactor, vector[2] * zScaleFactor]; //keep z position since I need to plot it in the 3D world
            const intersectionPoint = [cameraPoint[0] + intersectionVector[0], cameraPoint[1] + intersectionVector[1], cameraPoint[2] + intersectionVector[2]];
            const packageMatrix = new matrix(); //wrapping the ray and intersection into 1 matrix to get transformed into 2D points to plot
            packageMatrix.addColumn(vertex);
            packageMatrix.addColumn(cameraPoint);
            packageMatrix.addColumn(intersectionPoint);
            const transformedMatrix = camera.transformPoints(packageMatrix);
            intersectionPoints.push(transformedMatrix.getColumn(2)); //to create the image later
            if (showRays == true) {
                drawLine(transformedMatrix.getColumn(0), transformedMatrix.getColumn(1), "lime"); //camera -> object
            }
            if (showIntersection == true) {
                plotPoint(transformedMatrix.getColumn(2), "red");
            }
        }
        if (showImage == true) {
            for (const face of object.faces) {
                const points = [];
                for (const pointIndex of face.pointIndexes) {
                    points.push(intersectionPoints[pointIndex]);
                }
                drawShape(points, "#ffffff00", true);
            }
        }
    };
    linkCanvas("renderingWindow");
    //Objects:
    class PlayerObject extends Shape {
        constructor() {
            super();
            this.pointMatrix = new matrix();
            const points = [[-30, 0, 30], [30, 0, 30], [30, 0, -30], [-30, 0, -30], [-30, 10, 30], [30, 10, 30], [30, 10, -30], [-30, 10, -30], [-25, 20, 25], [25, 20, 25], [25, 20, -25], [-25, 20, -25], [-10, 35, 10], [10, 35, 10], [10, 35, -10], [-10, 35, -10], [-10, 100, 10], [10, 100, 10], [10, 100, -10], [-10, 100, -10], [-25, 110, 25], [25, 110, 25], [25, 110, -25], [-25, 110, -25], [-25, 130, 25], [25, 130, 25], [25, 130, -25], [-25, 130, -25], [-10, 120, 10], [10, 120, 10], [10, 120, -10], [-10, 120, -10]];
            for (let i = 0; i != points.length; i += 1) {
                this.pointMatrix.addColumn(points[i]);
            }
            const [centeringX, centeringY, centeringZ] = [0, 0, 0];
            this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
            this.setFaces();
            this.updateMatrices();
        }
        setFaces() {
            this.faces = [{ pointIndexes: [1, 0, 4, 5], colour: "#c4c4c4" }, { pointIndexes: [0, 3, 7, 4], colour: "#c4c4c4" }, { pointIndexes: [3, 2, 6, 7], colour: "#c4c4c4" }, { pointIndexes: [2, 1, 5, 6], colour: "#c4c4c4" }, { pointIndexes: [6, 10, 9, 5], colour: "#c4c4c4" }, { pointIndexes: [5, 9, 8, 4], colour: "#c4c4c4" }, { pointIndexes: [4, 8, 11, 7], colour: "#c4c4c4" }, { pointIndexes: [10, 11, 7, 6], colour: "#c4c4c4" }, { pointIndexes: [11, 15, 14, 10], colour: "#c4c4c4" }, { pointIndexes: [10, 14, 13, 9], colour: "#c4c4c4" }, { pointIndexes: [9, 13, 12, 8], colour: "#c4c4c4" }, { pointIndexes: [8, 12, 15, 11], colour: "#c4c4c4" }, { pointIndexes: [12, 15, 19, 16], colour: "#c4c4c4" }, { pointIndexes: [15, 14, 18, 19], colour: "#c4c4c4" }, { pointIndexes: [14, 18, 17, 13], colour: "#c4c4c4" }, { pointIndexes: [13, 17, 16, 12], colour: "#c4c4c4" }, { pointIndexes: [18, 22, 21, 17], colour: "#c4c4c4" }, { pointIndexes: [21, 17, 16, 20], colour: "#c4c4c4" }, { pointIndexes: [20, 16, 19, 23], colour: "#c4c4c4" }, { pointIndexes: [23, 19, 18, 22], colour: "#c4c4c4" }, { pointIndexes: [27, 23, 22, 26], colour: "#c4c4c4" }, { pointIndexes: [26, 22, 21, 25], colour: "#c4c4c4" }, { pointIndexes: [25, 21, 20, 24], colour: "#c4c4c4" }, { pointIndexes: [24, 20, 23, 27], colour: "#c4c4c4" }, { pointIndexes: [24, 28, 31, 27], colour: "#c4c4c4" }, { pointIndexes: [27, 31, 30, 26], colour: "#c4c4c4" }, { pointIndexes: [26, 30, 29, 25], colour: "#c4c4c4" }, { pointIndexes: [25, 29, 28, 24], colour: "#c4c4c4" }, { pointIndexes: [30, 31, 28, 29], colour: "#c4c4c4" }];
        }
    }
    const player = new PlayerObject();
    player.showOutline();
    //Houses
    class House extends Shape {
        constructor() {
            super();
            this.pointMatrix = new matrix();
            const points = [[0, 0, 0], [200, 0, 0], [200, 0, 100], [0, 0, 100], [0, 100, 0], [200, 100, 0], [200, 100, 100], [0, 100, 100], [40, 140, 50], [160, 140, 50], [85, 0, 0], [115, 0, 0], [85, 50, 0], [115, 50, 0], [85, 0, -10], [115, 0, -10], [85, 50, -10], [115, 50, -10], [30, 80, 0], [50, 80, 0], [30, 60, 0], [50, 60, 0], [30, 80, -10], [50, 80, -10], [30, 60, -10], [50, 60, -10], [150, 80, 0], [170, 80, 0], [150, 60, 0], [170, 60, 0], [150, 80, -10], [170, 80, -10], [150, 60, -10], [170, 60, -10]];
            for (let i = 0; i != points.length; i += 1) {
                this.pointMatrix.addColumn(points[i]);
            }
            const [centeringX, centeringY, centeringZ] = [-100, 0, 0];
            this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
            this.setFaces();
            this.updateMatrices();
        }
        setFaces() {
            this.faces = [{ pointIndexes: [5, 6, 2, 1], colour: "#c2600f" }, { pointIndexes: [6, 2, 3, 7], colour: "#c2600f" }, { pointIndexes: [7, 4, 0, 3], colour: "#c2600f" }, { pointIndexes: [5, 9, 6], colour: "#0593ff" }, { pointIndexes: [4, 8, 9, 5], colour: "#0593ff" }, { pointIndexes: [6, 9, 8, 7], colour: "#0593ff" }, { pointIndexes: [7, 8, 4], colour: "#0593ff" }, { pointIndexes: [12, 16, 14, 10], colour: "#ffce47" }, { pointIndexes: [12, 16, 17, 13], colour: "#ffce47" }, { pointIndexes: [17, 13, 11, 15], colour: "#ffce47" }, { pointIndexes: [16, 17, 15, 14], colour: "#ffce47" }, { pointIndexes: [18, 19, 23, 22], colour: "#0b07f2" }, { pointIndexes: [18, 22, 24, 20], colour: "#0b07f2" }, { pointIndexes: [24, 25, 21, 20], colour: "#0b07f2" }, { pointIndexes: [23, 19, 21, 25], colour: "#0b07f2" }, { pointIndexes: [22, 23, 25, 24], colour: "#0b07f2" }, { pointIndexes: [26, 27, 31, 30], colour: "#0b07f2" }, { pointIndexes: [31, 27, 29, 33], colour: "#0b07f2" }, { pointIndexes: [26, 30, 32, 28], colour: "#0b07f2" }, { pointIndexes: [32, 33, 29, 28], colour: "#0b07f2" }, { pointIndexes: [30, 31, 33, 32], colour: "#0b07f2" }, { pointIndexes: [4, 18, 20, 0], colour: "#c2600f" }, { pointIndexes: [0, 20, 21, 10], colour: "#c2600f" }, { pointIndexes: [21, 10, 12], colour: "#c2600f" }, { pointIndexes: [13, 11, 28], colour: "#c2600f" }, { pointIndexes: [11, 28, 29, 1], colour: "#c2600f" }, { pointIndexes: [1, 29, 27, 5], colour: "#c2600f" }, { pointIndexes: [19, 26, 28, 13, 12, 21], colour: "#c2600f" }, { pointIndexes: [5, 27, 26, 19, 18, 4], colour: "#c2600f" }];
        }
    }
    const [house1, house2] = [new House(), new House()];
    house1.position = { x: -400, y: 0, z: 200 };
    house2.position = { x: 400, y: 0, z: 200 };
    [house1.scale, house2.scale] = [2, 2];
    house1.updateMatrices();
    house2.updateMatrices();
    //Plane
    class PlaneTop extends Shape {
        constructor() {
            super();
            this.pointMatrix = new matrix();
            const points = [[0, 0, 0], [100, 0, 0], [100, 0, 100], [0, 0, 100], [0, 0, 200], [100, 0, 200], [100, 0, 300], [0, 0, 300], [0, 0, 400], [100, 0, 400], [100, 0, 500], [0, 0, 500], [0, 0, 600], [100, 0, 600], [100, 0, 700], [0, 0, 700], [0, 0, 800], [100, 0, 800], [200, 0, 0], [300, 0, 0], [300, 0, 100], [200, 0, 100], [200, 0, 200], [300, 0, 200], [300, 0, 300], [200, 0, 300], [200, 0, 400], [300, 0, 400], [300, 0, 500], [200, 0, 500], [200, 0, 600], [300, 0, 600], [300, 0, 700], [200, 0, 700], [200, 0, 800], [300, 0, 800], [400, 0, 0], [500, 0, 0], [500, 0, 100], [400, 0, 100], [400, 0, 200], [500, 0, 200], [500, 0, 300], [400, 0, 300], [400, 0, 400], [500, 0, 400], [500, 0, 500], [400, 0, 500], [400, 0, 600], [500, 0, 600], [500, 0, 700], [400, 0, 700], [400, 0, 800], [500, 0, 800], [600, 0, 0], [700, 0, 0], [700, 0, 100], [600, 0, 100], [600, 0, 200], [700, 0, 200], [700, 0, 300], [600, 0, 300], [600, 0, 400], [700, 0, 400], [700, 0, 500], [600, 0, 500], [600, 0, 600], [700, 0, 600], [700, 0, 700], [600, 0, 700], [600, 0, 800], [700, 0, 800], [800, 0, 0], [800, 0, 100], [800, 0, 200], [800, 0, 300], [800, 0, 400], [800, 0, 500], [800, 0, 600], [800, 0, 700], [800, 0, 800]];
            for (let i = 0; i != points.length; i += 1) {
                this.pointMatrix.addColumn(points[i]);
            }
            const [centeringX, centeringY, centeringZ] = [-400, 0, -400];
            this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
            this.setFaces();
            this.updateMatrices();
        }
        setFaces() {
            this.faces = [{ pointIndexes: [0, 1, 2, 3], colour: "#c4c4c4" }, { pointIndexes: [1, 18, 21, 2], colour: "#c4c4c4" }, { pointIndexes: [18, 19, 20, 21], colour: "#c4c4c4" }, { pointIndexes: [19, 36, 39, 20], colour: "#c4c4c4" }, { pointIndexes: [36, 37, 38, 39], colour: "#c4c4c4" }, { pointIndexes: [37, 54, 57, 38], colour: "#c4c4c4" }, { pointIndexes: [54, 55, 56, 57], colour: "#c4c4c4" }, { pointIndexes: [55, 72, 73, 56], colour: "#c4c4c4" }, { pointIndexes: [3, 2, 5, 4], colour: "#c4c4c4" }, { pointIndexes: [2, 21, 22, 5], colour: "#c4c4c4" }, { pointIndexes: [21, 20, 23, 22], colour: "#c4c4c4" }, { pointIndexes: [20, 39, 40, 23], colour: "#c4c4c4" }, { pointIndexes: [39, 38, 41, 40], colour: "#c4c4c4" }, { pointIndexes: [38, 57, 58, 41], colour: "#c4c4c4" }, { pointIndexes: [57, 56, 59, 58], colour: "#c4c4c4" }, { pointIndexes: [56, 73, 74, 59], colour: "#c4c4c4" }, { pointIndexes: [4, 5, 6, 7], colour: "#c4c4c4" }, { pointIndexes: [5, 22, 25, 6], colour: "#c4c4c4" }, { pointIndexes: [22, 23, 24, 25], colour: "#c4c4c4" }, { pointIndexes: [23, 40, 43, 24], colour: "#c4c4c4" }, { pointIndexes: [40, 41, 42, 43], colour: "#c4c4c4" }, { pointIndexes: [41, 58, 61, 42], colour: "#c4c4c4" }, { pointIndexes: [58, 59, 60, 61], colour: "#c4c4c4" }, { pointIndexes: [59, 74, 75, 60], colour: "#c4c4c4" }, { pointIndexes: [7, 6, 9, 8], colour: "#c4c4c4" }, { pointIndexes: [6, 25, 26, 9], colour: "#c4c4c4" }, { pointIndexes: [25, 24, 27, 26], colour: "#c4c4c4" }, { pointIndexes: [24, 43, 44, 27], colour: "#c4c4c4" }, { pointIndexes: [43, 42, 45, 44], colour: "#c4c4c4" }, { pointIndexes: [42, 61, 62, 45], colour: "#c4c4c4" }, { pointIndexes: [61, 60, 63, 62], colour: "#c4c4c4" }, { pointIndexes: [60, 75, 76, 63], colour: "#c4c4c4" }, { pointIndexes: [8, 9, 10, 11], colour: "#c4c4c4" }, { pointIndexes: [9, 26, 29, 10], colour: "#c4c4c4" }, { pointIndexes: [26, 27, 28, 29], colour: "#c4c4c4" }, { pointIndexes: [27, 44, 47, 28], colour: "#c4c4c4" }, { pointIndexes: [44, 45, 46, 47], colour: "#c4c4c4" }, { pointIndexes: [45, 62, 65, 46], colour: "#c4c4c4" }, { pointIndexes: [62, 63, 64, 65], colour: "#c4c4c4" }, { pointIndexes: [63, 76, 77, 64], colour: "#c4c4c4" }, { pointIndexes: [11, 10, 13, 12], colour: "#c4c4c4" }, { pointIndexes: [10, 29, 30, 13], colour: "#c4c4c4" }, { pointIndexes: [29, 28, 31, 30], colour: "#c4c4c4" }, { pointIndexes: [28, 47, 48, 31], colour: "#c4c4c4" }, { pointIndexes: [47, 46, 49, 48], colour: "#c4c4c4" }, { pointIndexes: [46, 65, 66, 49], colour: "#c4c4c4" }, { pointIndexes: [65, 64, 67, 66], colour: "#c4c4c4" }, { pointIndexes: [64, 77, 78, 67], colour: "#c4c4c4" }, { pointIndexes: [12, 13, 14, 15], colour: "#c4c4c4" }, { pointIndexes: [13, 30, 33, 14], colour: "#c4c4c4" }, { pointIndexes: [30, 31, 32, 33], colour: "#c4c4c4" }, { pointIndexes: [31, 48, 51, 32], colour: "#c4c4c4" }, { pointIndexes: [48, 49, 50, 51], colour: "#c4c4c4" }, { pointIndexes: [49, 66, 69, 50], colour: "#c4c4c4" }, { pointIndexes: [66, 67, 68, 69], colour: "#c4c4c4" }, { pointIndexes: [67, 78, 79, 68], colour: "#c4c4c4" }, { pointIndexes: [15, 14, 17, 16], colour: "#c4c4c4" }, { pointIndexes: [14, 33, 34, 17], colour: "#c4c4c4" }, { pointIndexes: [33, 32, 35, 34], colour: "#c4c4c4" }, { pointIndexes: [32, 51, 52, 35], colour: "#c4c4c4" }, { pointIndexes: [51, 50, 53, 52], colour: "#c4c4c4" }, { pointIndexes: [50, 69, 70, 53], colour: "#c4c4c4" }, { pointIndexes: [69, 68, 71, 70], colour: "#c4c4c4" }, { pointIndexes: [68, 79, 80, 71], colour: "#c4c4c4" }];
        }
    }
    const planeSize = 1500;
    const planeHeight = 25;
    const plane = new Box(planeSize, planeHeight, planeSize);
    plane.position.y = -(planeHeight / 2);
    plane.showOutline();
    const planeTop = new PlaneTop();
    planeTop.showOutline();
    planeTop.scale = planeSize / 800;
    planeTop.updateMatrices();
    /*
    plane.setColour("");
    player.setColour("");
    house1.setColour("");
    house2.setColour("");
    */
    const cameraObject = new Sphere(25);
    cameraObject.name = "camera";
    cameraObject.setColour("#c4c4c4");
    cameraObject.showOutline();
    cameraObject.position = Vector(50, 50, -600);
    const viewport = new Box(1280, 720, 1);
    viewport.setColour("#d1e6ff40");
    viewport.showOutline();
    const updateViewport = () => {
        viewport.position = JSON.parse(JSON.stringify(cameraObject.position));
        viewport.position.z = cameraObject.position.z + nearDistance;
    };
    updateViewport();
    const camera = new AbsoluteCamera();
    camera.worldRotation = Euler(-20, 20, 0);
    camera.updateRotationMatrix();
    camera.enableMovementControls("renderingWindow");
    //zoom based on device height / width
    const cameraZoomWidth = (window.innerWidth) / 1850;
    const cameraZoomHeight = (window.innerHeight) / 1100;
    camera.zoom = cameraZoomWidth; //set to lowest
    if (cameraZoomHeight < cameraZoomWidth) {
        camera.zoom = cameraZoomHeight;
    }
    setInterval(() => {
        clearCanvas();
        camera.render([plane]);
        camera.render([cameraObject, viewport, player, house1, house2]);
        visualiseRays(plane, cameraObject.position, { showRays: false, showIntersection: false });
        visualiseRays(player, cameraObject.position, { showRays: false, showIntersection: false });
        visualiseRays(house1, cameraObject.position, { showRays: false, showIntersection: false });
        visualiseRays(house2, cameraObject.position, { showRays: false, showIntersection: false });
    }, 16);
    document.onkeydown = ($e) => {
        const key = $e.key.toLowerCase();
        if (key == "arrowup") {
            cameraObject.position.y += 5;
        }
        else if (key == "arrowdown") {
            cameraObject.position.y -= 5;
        }
        else if (key == "arrowleft") {
            cameraObject.position.x -= 50;
            player.position.x -= 50;
        }
        else if (key == "arrowright") {
            cameraObject.position.x += 50;
            player.position.x += 50;
        }
        else if (key == "w") {
            cameraObject.position.z += 50;
            player.position.z += 50;
        }
        else if (key == "s") {
            cameraObject.position.z -= 50;
            player.position.z -= 50;
        }
        else if (key == "1") {
            cameraObject.setColour("#c4c4c4");
        }
        else if (key == "2") {
            cameraObject.setColour("");
        }
        updateViewport();
    };
    console.log("Arrow keys to move camera x and y, w and s to move camera z, press 1 or 2 to show or hide camera");
    document.getElementById("moveLeft").onclick = () => {
        cameraObject.position.z -= 20;
        updateViewport();
    };
    document.getElementById("moveRight").onclick = () => {
        cameraObject.position.z += 20;
        updateViewport();
    };
};
localVisualisationScope();
