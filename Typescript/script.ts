linkCanvas("renderingWindow");


const cube = new Box(100, 100, 100);
cube.rotation = { x: -30, y: -5, z: 0};
cube.scale = 1;
cube.position = { x: 0, y: 300, z: 1000 };
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
cube2.rotation = { x: -30, y: -5, z: 0};
cube2.scale = 1;
cube2.position = { x: 0, y: 0, z: 0 };
cube2.updateMatrices();

const camera = new Camera();
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -500;


setInterval(() => {
    cube.rotation.x += 1;
    cube2.rotation.x += 1;

    cube.updateMatrices();
    cube2.updateMatrices();

    clearCanvas()
    camera.render(cube);
    camera.render(cube2);
})

document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowleft") { camera.position.x -= 10; }
    else if (key == "arrowright") { camera.position.x += 10; }
    else if (key == "arrowup") { camera.position.y += 10; }
    else if (key == "arrowdown") { camera.position.y -= 10; }

    else if (key == "w") { camera.zoom += 0.1; }
    else if (key == "s") { camera.zoom -= 0.1; }
}


/*
const cube = new Box(100, 100, 100);
cube.rotation = { x: 0, y: 0, z: 0};
cube.scale = 1;
cube.position = { x: 0, y: 0, z: 0 };
cube.updateMatrices();

const camera = new Camera();
camera.position.x = 200;
camera.position.y = 200;
camera.position.z = -1000;

camera.render(cube);
*/