"use strict";
linkCanvas("renderingWindow");
const cube = new Box(100, 100, 100);
cube.rotation = { x: 0, y: 0, z: 0 };
cube.scale = 1;
cube.position = { x: 0, y: 0, z: 0 };
cube.updateMatrices();
cube.faceColours = {
    "-z": "#d90000",
    "-y": "#ff0000",
    "-x": "#ad0000",
    "+x": "#ad0000",
    "+y": "#ff0000",
    "+z": "#d90000",
};
const cube2 = new Box(200, 100, 100);
cube2.rotation = { x: 0, y: 0, z: 0 };
cube2.scale = 1;
cube2.position = { x: 0, y: 0, z: 300 };
cube2.updateMatrices();
const camera = new Camera();
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -500;
camera.worldRotation.x = 0;
camera.worldRotation.y = 0;
camera.worldRotation.z = 0;
camera.updateRotationMatrix();
setInterval(() => {
    clearCanvas();
    camera.render(cube2);
    camera.render(cube);
    camera.renderGrid();
});
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowleft") {
        camera.position.x -= 20;
    }
    else if (key == "arrowright") {
        camera.position.x += 20;
    }
    else if (key == "arrowup") {
        camera.position.y += 20;
    }
    else if (key == "arrowdown") {
        camera.position.y -= 20;
    }
    else if (key == "w") {
        camera.worldRotation.x -= 10;
        camera.updateRotationMatrix();
    }
    else if (key == "s") {
        camera.worldRotation.x += 10;
        camera.updateRotationMatrix();
    }
    else if (key == "a") {
        camera.worldRotation.y -= 10;
        camera.updateRotationMatrix();
    }
    else if (key == "d") {
        camera.worldRotation.y += 10;
        camera.updateRotationMatrix();
    }
};
