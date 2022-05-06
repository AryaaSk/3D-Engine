(function () { //local scope


    
linkCanvas("renderingWindow") ;

//OBJECTS GO HERE...
const plane = new Box(300, 10, 1000);
plane.setColour("#ffffff00"); //transparent
plane.showOutline();
plane.position.y = -55;

const cube = new Box(100, 100, 100);
cube.showOutline();

const sphere = new Sphere( 50 );
sphere.setColour("#87deeb");
sphere.showOutline();
sphere.position.z = 500;

//CAMERA GOES HERE...
const camera = new PerspectiveCamera();
camera.position = Vector( 0, 500, -1500 )
camera.rotation.x = 20;
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", {  });


setInterval(() => {
    clearCanvas();
    camera.render([plane]);
    camera.render([cube, sphere]);
}, 16);

document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if ( key == "w" ) { camera.position.z += 50; }
    else if ( key == "s" ) { camera.position.z -= 50; }
    else if ( key == "a" ) { camera.position.x -= 50; }
    else if ( key == "d" ) { camera.position.x += 50; }

    else if (key == "arrowup") { camera.position.y += 50; }
    else if (key == "arrowdown") { camera.position.y -= 50; }
}
console.log("WASD to move camera on x and z axis, arrow keys to move camera on y axis, use move to rotate camera and look around scene");



})();