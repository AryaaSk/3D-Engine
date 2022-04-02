const cube = new Box(100, 100, 100);
cube.rotation = { x: -20, y: -20, z: 0};
cube.position = { x: 2, y: 0, z: 0 };
cube.updateMatrices();
 
const camera = new Camera();
camera.scale = 5;
camera.position = [0, 0, -50] //positioned very far away on Z-Axis, distance between objects may only be 2 or something
camera.render(cube);
camera.render(cube);

camera.render(cube);
camera.render(cube);

clearCanvas();
camera.scale = 2;

camera.render(cube);
camera.render(cube);