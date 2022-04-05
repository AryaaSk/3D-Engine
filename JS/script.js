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
const pyramid = new SquareBasedPyramid(100, 100);
pyramid.position.x = -150;
pyramid.scale = 2;
pyramid.updateMatrices();
pyramid.faces[0].colour = ""; //transparent face
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
/*
const cube = new Box(100, 100, 100);
cube.rotation = { x: 0, y: 0, z: 0};
cube.scale = 1;
cube.position = { x: 0, y: 0, z: 0 };
cube.updateMatrices();
cube.faceColours = {  //assign a colour to each face (-z, -y, -x, +x, +y, +z)
    "-z" : "#d90000",
    "-y" : "#ff0000",
    "-x" : "#ad0000",
    "+x" : "#ad0000",
    "+y" : "#ff0000",
    "+z" : "#d90000",
}

const cube2 = new Box(200, 100, 100);
cube2.rotation = { x: 0, y: 0, z: 0};
cube2.scale = 1;
cube2.position = { x: 0, y: 0, z: 300 };
cube2.updateMatrices();
cube2.outline = true;

const cube3 = new Box(100, 100, 100);
cube3.position = { x: -200, y: 0, z: 0 };
cube3.faceColours = {
    "-z" : "#5a16e0",
    "-y" : "#7a39fa",
    "-x" : "#40109e",
    "+x" : "#40109e",
    "+y" : "#7a39fa",
    "+z" : "#5a16e0",
};

cube3.dimensions.width = 200;
cube3.updatePointMatrix();


const camera = new Camera();
camera.position.x = 0;
camera.position.y = 0;
camera.worldRotation.x = -30;
camera.worldRotation.y = 30;
camera.worldRotation.z = 0;
camera.updateRotationMatrix();

setInterval(() => {

    //cube.rotation.x += 1;
    //cube.rotation.y += 1;
    cube.updateMatrices();

    clearCanvas();
    camera.renderGrid();
    camera.render([cube3, cube, cube2]);

    plotPoint([0, 0], "#000000"); //a visual marker of where it will zoom into
})

document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowleft") { camera.position.x -= 20; }
    else if (key == "arrowright") { camera.position.x += 20; }
    else if (key == "arrowup") { camera.position.y += 20; }
    else if (key == "arrowdown") { camera.position.y -= 20; }

    else if (key == "w") { camera.worldRotation.x -= 10; camera.updateRotationMatrix(); }
    else if (key == "s") { camera.worldRotation.x += 10; camera.updateRotationMatrix(); }
    else if (key == "a") { camera.worldRotation.y -= 10; camera.updateRotationMatrix(); }
    else if (key == "d") { camera.worldRotation.y += 10; camera.updateRotationMatrix(); }

    else if (key == "1") { camera.zoom += 0.1; }
    else if (key == "2") { camera.zoom -= 0.1; }
}
*/
