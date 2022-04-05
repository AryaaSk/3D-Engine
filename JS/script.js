"use strict";
linkCanvas("renderingWindow");
const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
const cube = new Box(100, 100, 100);
cube.scale = 1;
cube.position.x = 50;
cube.updateMatrices();
cube.faces[5].colour = ""; //back face is transparent
const pyramid = new SquareBasedPyramid(50, 100);
pyramid.position.x = -150;
pyramid.scale = 2;
pyramid.updateMatrices();
pyramid.outline = true;
setInterval(() => {
    clearCanvas();
    camera.renderGrid();
    camera.render([cube, pyramid]);
    plotPoint([0, 0], "#000000"); //a visual marker of where it will zoom into
}, 16);
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
    else if (key == "1") {
        camera.zoom += 0.1;
    }
    else if (key == "2") {
        camera.zoom -= 0.1;
    }
};
