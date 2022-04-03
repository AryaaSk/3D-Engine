const cube = new Box(100, 100, 100);
cube.rotation = { x: -30, y: -5, z: 0};
cube.scale = 1;
cube.position = { x: -200, y: 0, z: 50 };
cube.updateMatrices();

const cube2 = new Box(200, 100, 100);
cube2.rotation = { x: -30, y: -5, z: 0};
cube2.scale = 1;
cube2.position = { x: 200, y: 0, z: 0 };
cube2.updateMatrices();

const camera = new Camera();
camera.position.x = 0;
camera.position.z = -50;


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
    if ($e.key == "ArrowLeft")
    { camera.position.x -= 10; }
    else if ($e.key == "ArrowRight")
    { camera.position.x += 10; }
    else if ($e.key == "ArrowUp")
    { camera.position.y += 10; }
    else if ($e.key == "ArrowDown")
    { camera.position.y -= 10; }
}