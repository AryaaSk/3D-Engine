//CANNONJS SETUP
const world = new CANNON.World();
world.gravity.set(0, -9.82 * 100, 0); // *100 to scale into the world


//ARYAA3D SETUP
linkCanvas("renderingWindow")

const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
camera.position.y = -300;
camera.enableMovementControls("renderingWindow", true, true, true, true);


//Objects:
const planeShape = new Box(1000, 10, 1000);
planeShape.showOutline();
planeShape.setColour("#ffffff");
planeShape.position.y = -300;
const plane = new PhysicsObject( world, planeShape, new CANNON.Body( { mass: 0 } ) );


const cubeShape = new Box(50, 50, 50);
cubeShape.pointMatrix.translateMatrix(0, 100, 0);
cubeShape.updateMatrices();
const sphereShape = new SphereShape(50);
sphereShape.showOutline();
const combinedShape = mergeShapes(cubeShape, sphereShape);
combinedShape.translateLocal(-300, 0, 0);


const box1 = new primativeBox( { width: 50, height: 50, depth: 50 }, Vector(0, 100, 0) );
const sphere1 = new primativeSphere( { radius: 50 }, Vector(0, 0, 0) );
const object = constructObjectFromPrimatives([box1, sphere1], 1);
const combinedObject = new PhysicsObject(world, object.aShape, object.cBody);
combinedObject.aShape.showOutline();




const interval = setInterval(() => { //animation loop
    world.step(16 / 1000);

    //sync aryaa3D objects with cannon objects
    plane.syncAShape();
    combinedObject.syncAShape();

    clearCanvas();
    camera.render([plane.aShape]);
    camera.render([combinedObject.aShape])

    combinedShape.rotation.x += 1;
    combinedShape.updateQuaternion();
    camera.render([combinedShape]);
}, 16);











//Controls
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if ($e.key == " ") { clearInterval(interval); }

    else if (key == "arrowup") { plane.aShape.rotation.x += 5;}
    else if (key == "arrowdown") {plane.aShape.rotation.x -= 5; } 
    else if (key == "arrowleft") {plane.aShape.rotation.z += 5; }
    else if (key == "arrowright") {plane.aShape.rotation.z -= 5;}

    plane.aShape.updateQuaternion();
    plane.syncCBody(); //sync cannon body with aryaa3D shape's rotation
}






//Console messages
/*
console.log("Press space to stop the animation");
console.log("Press arrow keys to rotate plane and move objects");
console.log("Press WASD to apply impulses to the cube in the respective directions")
console.warn("Object's may seem to be in front of plane, even when they are behind, because I am rendering the plane before the objects");
console.warn("As this is a parallel projection, there is no depth perception");
*/