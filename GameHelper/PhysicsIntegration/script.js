"use strict";
linkCanvas("renderingWindow");
const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow");
const player = new Box(100, 100, 100);
player.showOutline = true;
setInterval(() => {
    clearCanvas();
    camera.renderGrid();
    camera.render([player]);
}, 16);
