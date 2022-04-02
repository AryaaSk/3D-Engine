//TO ENABLE AUTO RELOAD, RUN LIVE-SERVER, AND CLICK CMD+SHIFT+B, THEN CLICK WATCH TSC: WATCH
//RENDERING AN OBJECT
const camera = new Camera();
camera.scale = 300;

//ONE PROBLEM IS THAT THE CAMERA RENDERS A SHAPES SIDES IN ORDER OF HOW CLOSE THEY ARE TO THE CAMERA, HOWEVER THIS MEANS THAT THE CAMERA'S POSITION CAN ONLY BE OPTIMIZED FOR ONE OBJECT
//I MAY HAVE TO PASS IN A CAMERAPOSITION ARGUEMENT INTO THE RENDER FUNCTION, AND NOT HAVE A GLOBAL CAMERA POSITION OBJECT
//OR ANOTHER WAY TO SOLVE THIS ISSUE IS TO PUSH THE CAMERA VERY FAR AWAY IN THE NEGATIVE Z-DIRECTION, I BELIEVE THIS IS A BETTER WAY

camera.position = [-3, 0, -50] //you can see I have just positioned it very far away, to negate the position differences between objects

//create our cube matrix (Pseudo Grid)
const cube = new Box(1, 1, 1);
cube.rotation.x = -30;
cube.rotation.y = 0;
cube.rotation.z = 0;
cube.position.x = 1;
cube.position.y = -0.7;
cube.position.z = 0;
cube.updateMatrices();

const cube2 = new Box(2, 1, 1);
cube2.rotation.x = -30;
cube2.rotation.y = 0;
cube2.rotation.z = 0;
cube2.position.x = -1;
cube2.position.y = -0.7;
cube2.position.z = 0;
cube2.updateMatrices();

const cube3 = new Box(0.5, 1, 0.5);
cube3.position.y = 1.5;
cube3.updateMatrices();


let stopped = false;
let rotationInterval = 1;
const interval = setInterval(() => {
    if (stopped == true) { return }

    cube.rotation.x -= rotationInterval;
    cube.rotation.y -= rotationInterval;
    cube.updateMatrices();

    cube2.rotation.x -= rotationInterval;
    cube2.rotation.y -= rotationInterval;
    cube2.updateMatrices();

    cube3.rotation.x -= rotationInterval;
    cube3.rotation.z -= rotationInterval;
    cube3.updateMatrices();

    clearCanvas();
    camera.render(cube, true);
    camera.render(cube2);
    camera.render(cube3, true);
}, 16);

document.onkeydown = ($e) => {
    if ($e.key == " ") {
        stopped = true;
    }
    else {
        stopped = false;
    }
}