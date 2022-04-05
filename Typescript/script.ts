linkCanvas("renderingWindow");

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


const camera = new Camera();
camera.position.x = 0;
camera.position.y = 0;
camera.worldRotation.x = -30;
camera.worldRotation.y = 30;
camera.worldRotation.z = 0;
camera.updateRotationMatrix();

//IN FUTURE I WILL CREATE A SINGLE CAMERA.RENDER() FUNCTION, WHERE YOU CAN PASS IN ALL THE ELEMENTS, AND IT WILL RENDER THEM IN THE CORRECT ORDER
//YOU JUST NEED TO FIND THE CENTER OF EACH OBJECT, AND THEN CHECK WHICH IS CLOSESTS TO (0, 0, -50000), LIKE YOU DO INDIVIDUALLY FOR THE FACES

setInterval(() => {

    //cube.rotation.x += 1;
    //cube.rotation.y += 1;
    cube.updateMatrices();

    clearCanvas();
    camera.renderGrid();
    camera.render(cube2);
    camera.render(cube);
    camera.render(cube3);

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