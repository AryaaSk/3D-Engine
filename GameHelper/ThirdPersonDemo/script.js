"use strict";
const localScope = () => {
    linkCanvas("renderingWindow");
    //Constants
    const playerProperties = {
        speed: 10,
        rotationSensitivity: 0.1,
        jumpHeight: 30,
        jumpCurve: [5, 4, 3, 2, 1, 0.5, 0.25, 0.125], //Imagine these points plot on the y-axis, x axis is the index, I am just re-creating an animation curve
    };
    const gravityCurve = [0.25, 0.5, 1, 2, 2, 2, 2, 2, 2];
    const camera = new Camera();
    camera.absPosition.y = 200; //to move camera up
    camera.showScreenOrigin = true;
    camera.worldRotation.x = -10; //inital rotation to look down onto player
    camera.zoom = 1;
    camera.updateRotationMatrix();
    //Game Helper Functions
    enableKeyListeners();
    //OBJECTS:
    //Player Object
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
    //Rotate player based on mouse movement
    let mousedown = false;
    document.onmousedown = () => {
        mousedown = true;
    };
    document.onmouseup = () => {
        mousedown = false;
    };
    document.onmousemove = ($e) => {
        if (mousedown == false) {
            return;
        }
        player.rotation.y += $e.movementX * playerProperties.rotationSensitivity;
        player.updateQuaternion();
        player.updateMatrices();
        camera.worldRotation.x -= $e.movementY * playerProperties.rotationSensitivity; //only rotating world and not player
        if (camera.worldRotation.x < -90) {
            camera.worldRotation.x = -90;
        } //limit rotation ourselves, since we disabled rotation in enableMovementControls()
        else if (camera.worldRotation.x > 0) {
            camera.worldRotation.x = 0;
        }
        camera.updateRotationMatrix();
    };
    //can now render other objects here, just like a normal scene, the player can move around and the camera follows in third person
    console.log("WASD to move\nDrag mouse to rotate");
    setInterval(() => {
        //Handle keydowns
        let movementVector = { x: 0, y: 0, z: 0 };
        keysDown.forEach(key => {
            if (key == "w") {
                movementVector.z += playerProperties.speed;
            }
            else if (key == "s") {
                movementVector.z -= playerProperties.speed;
            }
            else if (key == "a") {
                movementVector.x -= playerProperties.speed;
            }
            else if (key == "d") {
                movementVector.x += playerProperties.speed;
            }
            else if (key == " ") {
                jump();
            }
        });
        player.translateLocal(movementVector.x, movementVector.y, movementVector.z);
        syncCamera(camera, player);
        clearCanvas();
        camera.renderGrid();
        camera.render([plane, planeTop]); //plane will always be below the other objects
        camera.render([player, house1, house2]);
    }, 16);
    let playerInAir = false;
    const jump = () => {
        if (playerInAir == true) {
            return;
        }
        playerInAir = true;
        jumpUp(playerProperties.jumpCurve).then(() => {
            jumpDown(gravityCurve).then(() => { playerInAir = false; });
        });
    };
    const jumpUp = (jumpCurve) => {
        const promise = new Promise((resolve) => {
            const jumpCurveTotal = jumpCurve.reduce((partialSum, a) => partialSum + a, 0);
            const tickMultiplier = playerProperties.jumpHeight / jumpCurveTotal;
            let counter = 0;
            const interval = setInterval(() => {
                if (counter == jumpCurve.length - 1) {
                    clearInterval(interval);
                    resolve("Finished animation");
                }
                player.translateLocal(0, jumpCurve[counter] * tickMultiplier, 0);
                counter += 1;
            }, 1);
        });
        return promise;
    };
    const jumpDown = (jumpCurve) => {
        const promise = new Promise((resolve) => {
            const jumpCurveTotal = jumpCurve.reduce((partialSum, a) => partialSum + a, 0);
            const tickMultiplier = playerProperties.jumpHeight / jumpCurveTotal;
            let counter = 0;
            const interval = setInterval(() => {
                if (counter == jumpCurve.length - 1) {
                    clearInterval(interval);
                    resolve("Finished animation");
                }
                player.translateLocal(0, -(jumpCurve[counter] * tickMultiplier), 0);
                counter += 1;
            }, 1);
        });
        return promise;
    };
};
localScope();
