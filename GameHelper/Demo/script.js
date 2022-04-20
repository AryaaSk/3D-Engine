"use strict";
linkCanvas("renderingWindow");
const rotationSensitivity = 0.1;
const speed = 10;
const player = new Box(50, 200, 50);
player.updateMatrices();
const camera = new Camera();
camera.showScreenOrigin = true;
camera.worldRotation.x = -20; //inital x rotation
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", false, false, true);
//Rotate player based on mouse movement
let mousedown = false;
let [previousX] = [0];
document.onmousedown = ($e) => {
    mousedown = true;
    [previousX] = [$e.clientX];
};
document.onmouseup = () => {
    mousedown = false;
};
document.onmousemove = ($e) => {
    if (mousedown == false) {
        return;
    }
    const movementX = previousX - $e.clientX;
    previousX = $e.clientX;
    player.rotation.y -= movementX * rotationSensitivity;
    player.updateMatrices();
};
console.log("WASD to move\nDrag mouse to rotate");
setInterval(() => {
    //Handle keydowns
    keysDown.forEach(key => {
        let movementVector = { x: 0, y: 0, z: 0 };
        if (key == "w") {
            movementVector.z += speed;
        }
        else if (key == "s") {
            movementVector.z -= speed;
        }
        else if (key == "a") {
            movementVector.x -= speed;
        }
        else if (key == "d") {
            movementVector.x += speed;
        }
        player.translateLocal(movementVector.x, movementVector.y, movementVector.z);
    });
    syncCamera();
    clearCanvas();
    camera.renderGrid();
    camera.render([player]);
}, 16);
const syncCamera = () => {
    const playerPosition = JSON.parse(JSON.stringify(player.position));
    camera.position = playerPosition;
    const playerYRotation = player.rotation.y;
    camera.worldRotation.y = -playerYRotation;
    camera.updateRotationMatrix();
};
