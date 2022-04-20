"use strict";
linkCanvas("renderingWindow");
const rotationSpeed = 5;
const speed = 10;
const player = new Box(50, 200, 50);
player.rotation.y = 5;
player.updateMatrices();
const camera = new Camera();
camera.showScreenOrigin = true;
camera.worldRotation.x = -20; //inital x rotation
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", false, false, true);
const syncCamera = () => {
    const playerPosition = JSON.parse(JSON.stringify(player.position));
    camera.position = playerPosition;
    const playerYRotation = player.rotation.y;
    camera.worldRotation.y = -playerYRotation;
    camera.updateRotationMatrix();
};
setInterval(() => {
    //Handle keydowns
    keysDown.forEach(key => {
        if (key == "arrowleft") {
            player.rotation.y -= rotationSpeed;
            player.updateMatrices();
        }
        else if (key == "arrowright") {
            player.rotation.y += rotationSpeed;
            player.updateMatrices();
        }
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
