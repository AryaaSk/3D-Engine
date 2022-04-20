linkCanvas("renderingWindow")

const rotationSensitivity = 0.1;
const speed = 10;
const player = new Box(50, 100, 50);
player.updateMatrices();

const camera = new Camera();
camera.showScreenOrigin = true;
camera.worldRotation.x = -20; //inital rotation to look down onto player
camera.updateRotationMatrix();
camera.zoom = 2;

//Game Helper Functions
enableKeyListeners();

//Rotate player based on mouse movement
let mousedown = false;
document.onmousedown = () => {
    mousedown = true;
}
document.onmouseup = () => {
    mousedown = false;
}
document.onmousemove = ($e) => {
    if (mousedown == false) { return }

    const movementX = -$e.movementX;
    const movementY = -$e.movementY;

    player.rotation.y -= movementX * rotationSensitivity;
    player.updateMatrices();

    camera.worldRotation.x += movementY * rotationSensitivity; //only rotating world and not player
    if (camera.worldRotation.x < -90) {  camera.worldRotation.x = -90; } //limit rotation ourselves, since we disabled rotation in enableMovementControls()
    else if (camera.worldRotation.x > 0) {  camera.worldRotation.x = 0;  }
    camera.updateRotationMatrix();
}

//can now render other objects here, just like a normal scene, the player can move around and the camera follows in third person

console.log("WASD to move\nDrag mouse to rotate")
setInterval(() => { //animation loop
    //Handle keydowns
    keysDown.forEach(key => {
        let movementVector = { x: 0, y: 0, z: 0 }
        if (key == "w") 
            { movementVector.z += speed; }
        else if (key == "s")
            { movementVector.z -= speed; }
        else if (key == "a")
            { movementVector.x -= speed; }
        else if (key == "d")
            { movementVector.x += speed; }
        player.translateLocal(movementVector.x, movementVector.y, movementVector.z);
    })
    syncCamera(camera, player);

    clearCanvas();
    camera.renderGrid();
    camera.render([player]);
}, 16);