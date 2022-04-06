"use strict";
//Example Scene
linkCanvas("renderingWindow");
const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", true, true, true);
const cube = new Box(100, 100, 100);
cube.scale = 1;
cube.position.x = 300;
cube.faces[5].colour = ""; //back face is transparent
cube.updateMatrices();
const pyramid = new SquareBasedPyramid(50, 100);
pyramid.position.x = -300;
pyramid.scale = 2;
pyramid.showOutline = true;
pyramid.showFaceIndexes = true;
pyramid.updateMatrices();
const triangularPrism = new TriangularPrism(100, 100, 400);
triangularPrism.showOutline = true;
triangularPrism.position.z = 600;
const elongatedOctahedron = new ElongatedOctahedron(200, 200, 200);
elongatedOctahedron.showOutline = true;
elongatedOctahedron.faces[8].colour = ""; //top half is transparent, now it looks like a bowl
elongatedOctahedron.faces[9].colour = "";
elongatedOctahedron.faces[10].colour = "";
elongatedOctahedron.faces[11].colour = "";
setInterval(() => {
    cube.rotation.y += 1;
    cube.rotation.z += 1;
    cube.updateMatrices();
    clearCanvas();
    camera.renderGrid();
    camera.render([cube, pyramid, triangularPrism, elongatedOctahedron]);
    plotPoint([0, 0], "#000000"); //a visual marker of where it will zoom into
}, 16);
