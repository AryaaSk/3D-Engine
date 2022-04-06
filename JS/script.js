"use strict";
linkCanvas("renderingWindow");
const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
const cube = new Box(100, 100, 100);
cube.scale = 1;
cube.position.x = 300;
cube.faces[5].colour = ""; //back face is transparent
cube.updateMatrices();
cube.showFaceIndexes = true;
const pyramid = new SquareBasedPyramid(50, 100);
pyramid.position.x = -150;
pyramid.scale = 2;
pyramid.outline = true;
pyramid.updateMatrices();
const triangularPrism = new TriangularPrism(100, 100, 400);
triangularPrism.outline = true;
setInterval(() => {
    cube.rotation.y += 1;
    cube.rotation.z += 1;
    cube.updateMatrices();
    clearCanvas();
    camera.renderGrid();
    camera.render([cube, pyramid, triangularPrism]);
    plotPoint([0, 0], "#000000"); //a visual marker of where it will zoom into
}, 16);
//CONTROLS:
let mouseDown = false;
let altDown = false;
let previousX = 0;
let previousY = 0;
document.onmousedown = ($e) => { mouseDown = true; previousX = $e.clientX; previousY = $e.clientY; };
document.onmouseup = () => { mouseDown = false; };
document.onmousemove = ($e) => {
    if (mouseDown == false) {
        return;
    }
    let [differenceX, differenceY] = [$e.clientX - previousX, $e.clientY - previousY];
    if (altDown == true) {
        camera.position.x -= differenceX / camera.zoom;
        camera.position.y += differenceY / camera.zoom;
    }
    else {
        const absX = Math.abs(camera.worldRotation.x) % 360;
        if (absX > 90 && absX < 270) {
            differenceX *= -1;
        }
        camera.worldRotation.x -= differenceY / 5;
        camera.worldRotation.y -= differenceX / 5;
        camera.updateRotationMatrix();
    }
    [previousX, previousY] = [$e.clientX, $e.clientY];
};
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "alt") {
        altDown = true;
    }
};
document.onkeyup = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "alt") {
        altDown = false;
    }
};
//Zooming in/out
document.onwheel = ($e) => {
    if (camera.zoom < 0) {
        camera.zoom = $e.wheelDeltaY / 1000;
    }
    camera.zoom -= $e.wheelDeltaY / 1000;
};
