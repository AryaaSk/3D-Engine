//will be using cannonJS for physics, the world is all controlled by cannonjs, and I just use aryaa3D to actually render the world
//I'm not sure if the object's will match up to their cannon js counterparts

//Functions
const syncObject = (cannonBody: CANNON.Body, aryaa3DBody: Shape) => {
    aryaa3DBody.position.x = cannonBody.position.x;
    aryaa3DBody.position.y = cannonBody.position.y;
    aryaa3DBody.position.z = cannonBody.position.z;

    //to get rotation, we need to convert the quaternion, into XYZ Euler angles
    aryaa3DBody.quaternion = { x: cannonBody.quaternion.x, y: cannonBody.quaternion.y, z: cannonBody.quaternion.z, w: cannonBody.quaternion.w };
    aryaa3DBody.updateMatrices();
} 
const syncShapeRotation = ( parentShape: Shape, childShape: Shape ) => {
    childShape.quaternion = parentShape.quaternion;
    childShape.updateMatrices();
}





//CANNONJS SETUP
const world = new CANNON.World();
world.gravity.set(0, -9.82 * 100, 0); // *100 to scale into the world

const boxSize = 50;
const boxShape = new CANNON.Box( new CANNON.Vec3(boxSize / 2, boxSize / 2, boxSize / 2) );
const cBox = new CANNON.Body( { mass: 1, shape: boxShape } );
const cQuaternion = eulerToQuaternion( Vector(35, 45, 0) );
cBox.quaternion.set( cQuaternion.x, cQuaternion.y, cQuaternion.z, cQuaternion.w );
cBox.position.y = 300;
world.addBody(cBox);

const floorSize = 500;
const floorHeight = 50;
const floorShape = new CANNON.Box( new CANNON.Vec3(floorSize / 2, floorHeight / 2, floorSize / 2) );
const cFloor = new CANNON.Body( { mass: 0, shape: floorShape } )
world.addBody(cFloor);

//ARYAA3D SETUP
linkCanvas("renderingWindow")

const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", true, true, true, true);

const aryaaBox = new Box(boxSize, boxSize, boxSize);
aryaaBox.showOutline = true;
syncObject(cBox, aryaaBox);

class FloorTop extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = [[0,0,0],[100,0,0],[100,0,100],[0,0,100],[0,0,200],[100,0,200],[100,0,300],[0,0,300],[0,0,400],[100,0,400],[100,0,500],[0,0,500],[0,0,600],[100,0,600],[100,0,700],[0,0,700],[0,0,800],[100,0,800],[200,0,0],[300,0,0],[300,0,100],[200,0,100],[200,0,200],[300,0,200],[300,0,300],[200,0,300],[200,0,400],[300,0,400],[300,0,500],[200,0,500],[200,0,600],[300,0,600],[300,0,700],[200,0,700],[200,0,800],[300,0,800],[400,0,0],[500,0,0],[500,0,100],[400,0,100],[400,0,200],[500,0,200],[500,0,300],[400,0,300],[400,0,400],[500,0,400],[500,0,500],[400,0,500],[400,0,600],[500,0,600],[500,0,700],[400,0,700],[400,0,800],[500,0,800],[600,0,0],[700,0,0],[700,0,100],[600,0,100],[600,0,200],[700,0,200],[700,0,300],[600,0,300],[600,0,400],[700,0,400],[700,0,500],[600,0,500],[600,0,600],[700,0,600],[700,0,700],[600,0,700],[600,0,800],[700,0,800],[800,0,0],[800,0,100],[800,0,200],[800,0,300],[800,0,400],[800,0,500],[800,0,600],[800,0,700],[800,0,800]];
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [-400, (floorHeight / 2) +  floorHeight * (floorSize / 800) / 2, -400];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{pointIndexes:[0,1,2,3],colour:"#c4c4c4"},{pointIndexes:[1,18,21,2],colour:"#c4c4c4"},{pointIndexes:[18,19,20,21],colour:"#c4c4c4"},{pointIndexes:[19,36,39,20],colour:"#c4c4c4"},{pointIndexes:[36,37,38,39],colour:"#c4c4c4"},{pointIndexes:[37,54,57,38],colour:"#c4c4c4"},{pointIndexes:[54,55,56,57],colour:"#c4c4c4"},{pointIndexes:[55,72,73,56],colour:"#c4c4c4"},{pointIndexes:[3,2,5,4],colour:"#c4c4c4"},{pointIndexes:[2,21,22,5],colour:"#c4c4c4"},{pointIndexes:[21,20,23,22],colour:"#c4c4c4"},{pointIndexes:[20,39,40,23],colour:"#c4c4c4"},{pointIndexes:[39,38,41,40],colour:"#c4c4c4"},{pointIndexes:[38,57,58,41],colour:"#c4c4c4"},{pointIndexes:[57,56,59,58],colour:"#c4c4c4"},{pointIndexes:[56,73,74,59],colour:"#c4c4c4"},{pointIndexes:[4,5,6,7],colour:"#c4c4c4"},{pointIndexes:[5,22,25,6],colour:"#c4c4c4"},{pointIndexes:[22,23,24,25],colour:"#c4c4c4"},{pointIndexes:[23,40,43,24],colour:"#c4c4c4"},{pointIndexes:[40,41,42,43],colour:"#c4c4c4"},{pointIndexes:[41,58,61,42],colour:"#c4c4c4"},{pointIndexes:[58,59,60,61],colour:"#c4c4c4"},{pointIndexes:[59,74,75,60],colour:"#c4c4c4"},{pointIndexes:[7,6,9,8],colour:"#c4c4c4"},{pointIndexes:[6,25,26,9],colour:"#c4c4c4"},{pointIndexes:[25,24,27,26],colour:"#c4c4c4"},{pointIndexes:[24,43,44,27],colour:"#c4c4c4"},{pointIndexes:[43,42,45,44],colour:"#c4c4c4"},{pointIndexes:[42,61,62,45],colour:"#c4c4c4"},{pointIndexes:[61,60,63,62],colour:"#c4c4c4"},{pointIndexes:[60,75,76,63],colour:"#c4c4c4"},{pointIndexes:[8,9,10,11],colour:"#c4c4c4"},{pointIndexes:[9,26,29,10],colour:"#c4c4c4"},{pointIndexes:[26,27,28,29],colour:"#c4c4c4"},{pointIndexes:[27,44,47,28],colour:"#c4c4c4"},{pointIndexes:[44,45,46,47],colour:"#c4c4c4"},{pointIndexes:[45,62,65,46],colour:"#c4c4c4"},{pointIndexes:[62,63,64,65],colour:"#c4c4c4"},{pointIndexes:[63,76,77,64],colour:"#c4c4c4"},{pointIndexes:[11,10,13,12],colour:"#c4c4c4"},{pointIndexes:[10,29,30,13],colour:"#c4c4c4"},{pointIndexes:[29,28,31,30],colour:"#c4c4c4"},{pointIndexes:[28,47,48,31],colour:"#c4c4c4"},{pointIndexes:[47,46,49,48],colour:"#c4c4c4"},{pointIndexes:[46,65,66,49],colour:"#c4c4c4"},{pointIndexes:[65,64,67,66],colour:"#c4c4c4"},{pointIndexes:[64,77,78,67],colour:"#c4c4c4"},{pointIndexes:[12,13,14,15],colour:"#c4c4c4"},{pointIndexes:[13,30,33,14],colour:"#c4c4c4"},{pointIndexes:[30,31,32,33],colour:"#c4c4c4"},{pointIndexes:[31,48,51,32],colour:"#c4c4c4"},{pointIndexes:[48,49,50,51],colour:"#c4c4c4"},{pointIndexes:[49,66,69,50],colour:"#c4c4c4"},{pointIndexes:[66,67,68,69],colour:"#c4c4c4"},{pointIndexes:[67,78,79,68],colour:"#c4c4c4"},{pointIndexes:[15,14,17,16],colour:"#c4c4c4"},{pointIndexes:[14,33,34,17],colour:"#c4c4c4"},{pointIndexes:[33,32,35,34],colour:"#c4c4c4"},{pointIndexes:[32,51,52,35],colour:"#c4c4c4"},{pointIndexes:[51,50,53,52],colour:"#c4c4c4"},{pointIndexes:[50,69,70,53],colour:"#c4c4c4"},{pointIndexes:[69,68,71,70],colour:"#c4c4c4"},{pointIndexes:[68,79,80,71],colour:"#c4c4c4"}];
    }
}

const aryaaFloor = new Box(floorSize, floorHeight, floorSize);
const floorTop = new FloorTop(); 
floorTop.position = JSON.parse(JSON.stringify(aryaaFloor.position));
floorTop.scale = (floorSize / 800); //floor top is 800 * 800, so I need to calculate floorSize / 800, and set that as the scale
floorTop.updateMatrices();






document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if ($e.key == " ") {
        clearInterval(interval);
    }
    else if (key == "arrowup") {
        aryaaFloor.rotation.x += 5;
    }
    else if (key == "arrowdown") {
        aryaaFloor.rotation.x -= 5;
    }
    else if (key == "arrowleft") {
        aryaaFloor.rotation.z += 5;
    }
    else if (key == "arrowright") {
        aryaaFloor.rotation.z -= 5;
    }

    aryaaFloor.updateQuaternion();
    syncShapeRotation(aryaaFloor, floorTop);
    cFloor.quaternion = new CANNON.Quaternion( aryaaFloor.quaternion.x, aryaaFloor.quaternion.y, aryaaFloor.quaternion.z, aryaaFloor.quaternion.w );

}






const interval = setInterval(() => { //animation loop
    updateWorld(world);

    //now sync cannon object with aryaa3D object
    syncObject(cBox, aryaaBox)
    syncObject(cFloor, aryaaFloor)

    clearCanvas();
    camera.renderGrid();
    camera.render([aryaaFloor, floorTop]);
    camera.render([aryaaBox]);
}, 16);

const updateWorld = (cannonWorld: CANNON.World) => {
    cannonWorld.step(16 / 1000);
}