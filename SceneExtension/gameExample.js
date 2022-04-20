"use strict";
linkCanvas("renderingWindow");
const scene = new Scene();
const cube = new Box(100, 100, 100);
cube.showOutline = true;
scene.addObject(cube);
scene.camera.worldRotation.x = -20;
scene.camera.worldRotation.y = 20;
scene.camera.updateRotationMatrix();
scene.camera.enableMovementControls("renderingWindow", true, false, true);
scene.showGrid = true;
scene.startAnimationLoop();
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    const speed = 10;
    if (key == "w") {
        scene.cameraPosition.z += speed;
    }
    else if (key == "s") {
        scene.cameraPosition.z -= speed;
    }
    else if (key == "a") {
        scene.cameraPosition.x -= speed;
    }
    else if (key == "d") {
        scene.cameraPosition.x += speed;
    }
};
