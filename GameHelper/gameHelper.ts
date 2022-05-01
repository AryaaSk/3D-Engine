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
const syncShape = (cannonBody: CANNON.Body, aryaa3DBody: Shape) => {
    aryaa3DBody.position.x = cannonBody.position.x;
    aryaa3DBody.position.y = cannonBody.position.y;
    aryaa3DBody.position.z = cannonBody.position.z;

    //to get rotation, we need to convert the quaternion, into XYZ Euler angles
    aryaa3DBody.quaternion = { x: cannonBody.quaternion.x, y: cannonBody.quaternion.y, z: cannonBody.quaternion.z, w: cannonBody.quaternion.w };
    aryaa3DBody.updateMatrices();
}

const createCANNONBoundingBox = (aShape: Shape): CANNON.Box => {
    //create a box object using the range of x, y, and z axis
    let [minX, minY, minZ] = [9999, 9999, 9999];
    let [maxX, maxY, maxZ] = [0, 0, 0];

    const pointMatrixScaled = aShape.pointMatrix.scaledUp(aShape.scale);
    for (let i = 0; i != pointMatrixScaled.width; i += 1) { 
        const point = pointMatrixScaled.getColumn(i);

        if (point[0] < minX) { minX = point[0]; }
        else if (point[0] > maxX) { maxX = point[0]; }

        if (point[1] < minY) { minY = point[1]; }
        else if (point[1] > maxY) { maxY = point[1]; }

        if (point[2] < minZ) { minZ = point[2]; }
        else if (point[2] > maxZ) { maxZ = point[2]; }
    }

    const [xRange, yRange, zRange] = [maxX - minX, maxY - minY, maxZ - minZ];
    let [halfWidth, halfHeight, halfDepth] = [xRange / 2, yRange / 2, zRange / 2];
    if (halfWidth == 0) { halfWidth = 1; } //to prevent other objects from not colliding with them
    if (halfHeight == 0) { halfHeight = 1; }
    if (halfDepth == 0) { halfDepth = 1; }

    const boundingBox = new CANNON.Box( new CANNON.Vec3(halfWidth, halfHeight, halfDepth) );
    return boundingBox
}


//Primatives, used for creating custom hitboxes
class primative {
    dimensions: any;
    type: string = "";
    offset: XYZ = Vector(0, 0, 0);
}
class PrimativeBox extends primative{
    dimensions: { width: number, height: number, depth: number };

    constructor(dimensions: { width: number, height: number, depth: number }, offset: XYZ) {
        super();
        this.type = "box";
        this.dimensions = dimensions;
        this.offset = offset;
    }
}
class PrimativeSphere extends primative {
    dimensions: { radius: number };

    constructor(dimensions: { radius: number }, offset: XYZ) {
        super();
        this.type = "sphere";
        this.dimensions = dimensions;
        this.offset = offset;
    }
}
//will add cylinder and cone later

const constructObjectFromPrimatives = (primatives: primative[], mass: number) => {
    //takes in aryaa3D shapes (must be a primative, e.g. box, sphere, cylinder, cone)
    let shape = new Shape();
    const body = new CANNON.Body( { mass: mass } );

    for (const primative of primatives) {
        const dimensions = primative.dimensions;
        const offset = primative.offset;

        if (primative.type == "box") {
            const aShape = new Box( dimensions.width, dimensions.height, dimensions.depth );
            aShape.pointMatrix.translateMatrix(offset.x, offset.y, offset.z);
            aShape.updateMatrices();
            const cShape = new CANNON.Box( new CANNON.Vec3( dimensions.width / 2, dimensions.height / 2, dimensions.depth / 2 ) );

            shape = mergeShapes(shape, aShape);
            body.addShape(cShape, new CANNON.Vec3(offset.x, offset.y, offset.z) );
        }
        else if (primative.type == "sphere") {
            const aShape = new Sphere( dimensions.radius );
            aShape.pointMatrix.translateMatrix(offset.x, offset.y, offset.z);
            aShape.updateMatrices();
            const cShape = new CANNON.Sphere( dimensions.radius );

            shape = mergeShapes(shape, aShape);
            body.addShape(cShape, new CANNON.Vec3(offset.x, offset.y, offset.z) );
        }
    }

    return { aShape: shape, cBody: body };
}


class PhysicsObject {
    aShape: Shape = new Shape(); //aryaa3D Shape
    cBody: CANNON.Body = new CANNON.Body(); //cannonJS body

    constructor (world: CANNON.World, aryaa3DShape: Shape, cannonJSBody?: CANNON.Body) {
        this.aShape = aryaa3DShape;

        if (cannonJSBody == undefined) {
            const cBody = new CANNON.Body( { mass: 1 } );
            this.cBody = cBody;
        } 
        else { this.cBody = cannonJSBody; }

        if (this.cBody.shapes.length == 0) {   
            const boundingBox = createCANNONBoundingBox(this.aShape);
            this.cBody.addShape(boundingBox);
        }

        this.syncCBody();
        world.addBody(this.cBody);
    }

    syncAShape() {
        syncShape(this.cBody, this.aShape);
    }
    syncCBody() {
        this.cBody.position = new CANNON.Vec3( this.aShape.position.x, this.aShape.position.y, this.aShape.position.z );

        this.cBody.quaternion.x = this.aShape.quaternion.x; //sync object's rotations
        this.cBody.quaternion.y = this.aShape.quaternion.y;
        this.cBody.quaternion.z = this.aShape.quaternion.z;
        this.cBody.quaternion.w = this.aShape.quaternion.w;
    }
}