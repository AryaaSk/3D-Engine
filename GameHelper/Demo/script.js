"use strict";
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
camera.absPosition.y = 200;
camera.showScreenOrigin = true;
camera.worldRotation.x = -10; //inital rotation to look down onto player
camera.updateRotationMatrix();
camera.zoom = 1.5;
//Game Helper Functions
enableKeyListeners();
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
player.showOutline = true;
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
    camera.render([player]);
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
