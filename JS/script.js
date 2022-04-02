"use strict";
const cube = new Box(100, 100, 100);
cube.rotation = { x: -20, y: -20, z: 0 };
cube.scale = 2;
cube.position = { x: -400, y: 0, z: 0 };
cube.updateMatrices();
const camera = new Camera();
camera.position = [0, 0, -1000]; //positioned very far away on Z-Axis (-500)
camera.render(cube);
