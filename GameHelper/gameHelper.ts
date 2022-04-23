//Keysdown detection
//Using onkeydown() will cause a delay, now you can just access the keysDown array, and handle it in the animation loop
const keysDown: string[] = [];
const enableKeyListeners = () => {
    document.addEventListener('keydown', ($e) => {
        const key = $e.key.toLowerCase();
        if (keysDown.includes(key) == false) { keysDown.push(key); }
    })
    document.addEventListener('keyup', ($e) => {
        const key = $e.key.toLowerCase();
        if (keysDown.includes(key) == true) { keysDown.splice(keysDown.indexOf(key), 1); }
    })
}

const syncCamera = (camera: Camera, object: Shape) => { //Syncs camera to third person view, directly behind object
    const objectPosition: { x: number, y: number, z: number }  = JSON.parse(JSON.stringify(object.position));
    camera.position = objectPosition;

    const objectYRotation = object.rotation.y;
    camera.worldRotation.y = -objectYRotation;
    camera.updateRotationMatrix();
}


//CannonJS Physics Functions, import cannonjs before using any of these
const syncObject = (cannonBody: CANNON.Body, aryaa3DBody: Shape) => {
    aryaa3DBody.position.x = cannonBody.position.x;
    aryaa3DBody.position.y = cannonBody.position.y;
    aryaa3DBody.position.z = cannonBody.position.z;

    //to get rotation, we need to convert the quaternion, into XYZ Euler angles
    aryaa3DBody.quaternion = { x: cannonBody.quaternion.x, y: cannonBody.quaternion.y, z: cannonBody.quaternion.z, w: cannonBody.quaternion.w };
    aryaa3DBody.updateMatrices();
} 