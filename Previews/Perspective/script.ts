(function () { //local scope


    
linkCanvas("renderingWindow") ;

//OBJECTS GO HERE...
const cube = new Box(100, 100, 100);
cube.showOutline();

const cube2 = new Box(100, 100, 100);
cube2.showOutline();
cube2.position.z = 500;

//CAMERA GOES HERE...
const camera = new AbsoluteCamera();
camera.position = Vector( 0, 200, -200 )
camera.enableMovementControls("renderingWindow", { limitRotation: true });

//camera.type = "absolute";
//camera.position = Vector(0, 0, 0);


setInterval(() => {
    clearCanvas();
    camera.render([cube, cube2]);
}, 16);

document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowup") { camera.position.y += 50; }
    else if (key == "arrowdown") { camera.position.y -= 50; }

    else if ( key == "arrowleft" ) { camera.position.x -= 50; cube.position.x -= 50; } //cube should not appear to move when the camera's x position is the same
    else if ( key == "arrowright" ) { camera.position.x += 50; cube.position.x += 50; }

    else if ( key == "w" ) { camera.position.z += 50; cube.position.z += 50; }
    else if ( key == "s" ) { camera.position.z -= 50; cube.position.z -= 50; }
}



})();