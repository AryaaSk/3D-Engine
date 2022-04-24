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

class physicsObject {

    aShape: Shape = new Shape(); //aryaa3D Shape
    cShape: CANNON.Shape = new CANNON.Shape(); //cannonJS shape, try to match to aryaa3D shape
    cBody: CANNON.Body = new CANNON.Body(); //cannonJS body

    constructor (aryaa3DShape?: Shape, cannonJSShape?: CANNON.Shape, cannonJSBody?: CANNON.Body) {
        if (aryaa3DShape == undefined) { 
            console.error("Cannot create object without aryaa3D Shape")
            return; 
        } else {
            this.aShape = aryaa3DShape;
        }

        if (cannonJSShape == undefined) {
            //create a box object using the range of x, y, and z axis
            let [minX, minY, minZ] = [9999, 9999, 9999];
            let [maxX, maxY, maxZ] = [0, 0, 0];

            for (let i = 0; i != this.aShape.pointMatrix.width; i += 1) { 
                const point = this.aShape.pointMatrix.getColumn(i);

                if (point[0] < minX) { minX = point[0]; }
                else if (point[0] > maxX) { maxX = point[0]; }

                if (point[1] < minY) { minY = point[1]; }
                else if (point[1] < maxY) { maxY = point[1]; }

                if (point[2] < minZ) { minZ = point[2]; }
                else if (point[2] < maxZ) { maxZ = point[2]; }
            }

            const [xRange, yRange, zRange] = [maxX - minX, maxY - minY, maxZ - minZ];
            const [halfWidth, halfHeight, halfDepth] = [xRange / 2, yRange / 2, zRange / 2];
            
            const generatedBox = new CANNON.Box( new CANNON.Vec3(halfWidth, halfHeight, halfDepth) );
            this.cShape = generatedBox;

        } else {
            this.cShape = cannonJSShape;
        }

        if (cannonJSBody == undefined) {
            const cBody = new CANNON.Body( { mass: 1 } );
            cBody.addShape(this.cShape);
            this.cBody = cBody;
        } else {
            this.cBody = cannonJSBody;
        }
        
        this.cBody.quaternion.x = this.aShape.quaternion.x; //sync object's rotations
        this.cBody.quaternion.y = this.aShape.quaternion.y;
        this.cBody.quaternion.z = this.aShape.quaternion.z;
        this.cBody.quaternion.w = this.aShape.quaternion.w;
    }

    syncAShape() {
        syncObject(this.cBody, this.aShape);
    }

    visualiseCShape(camera: Camera) {
        console.log(this.cShape);
    }    
}