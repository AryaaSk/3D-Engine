"use strict";
linkCanvas("renderingWindow");
const cube = new Box(100, 100, 100);
cube.rotation = { x: -30, y: -5, z: 0 };
cube.scale = 1;
cube.position = { x: 0, y: 200, z: 0 };
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
cube2.position = { x: 0, y: 0, z: 500 };
cube2.updateMatrices();
const camera = new Camera();
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -500;
camera.worldRotation.x = -30;
camera.worldRotation.y = 0;
camera.worldRotation.z = 0;
camera.updateRotationMatrix();
setInterval(() => {
    /*
    cube.rotation.x += 1;
    cube2.rotation.x += 1;
    cube.updateMatrices();
    cube2.updateMatrices();
    */
    clearCanvas();
    camera.renderGrid();
    camera.render(cube);
    camera.render(cube2);
});
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowleft") {
        camera.position.x -= 10;
    }
    else if (key == "arrowright") {
        camera.position.x += 10;
    }
    else if (key == "arrowup") {
        camera.position.y += 10;
    }
    else if (key == "arrowdown") {
        camera.position.y -= 10;
    }
    else if (key == "w") {
        camera.zoom += 0.1;
    }
    else if (key == "s") {
        camera.zoom -= 0.1;
    }
    else if (key == "a") {
        camera.worldRotation.y -= 5;
        camera.updateRotationMatrix();
    }
    else if (key == "d") {
        camera.worldRotation.y += 5;
        camera.updateRotationMatrix();
    }
};
