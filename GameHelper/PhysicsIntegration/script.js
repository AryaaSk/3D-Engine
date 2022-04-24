"use strict";
//CANNONJS SETUP
const world = new CANNON.World();
world.gravity.set(0, -9.82 * 100, 0); // *100 to scale into the world
//ARYAA3D SETUP
linkCanvas("renderingWindow");
const camera = new Camera();
camera.worldRotation.x = -20;
camera.worldRotation.y = 20;
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow", true, true, true, true);
//Objects:
const cubeShape = new Box(100, 100, 100);
cubeShape.position = { x: 0, y: 300, z: -200 };
cubeShape.rotation = { x: -40, y: 30, z: 0 };
cubeShape.updateQuaternion();
const cube = new PhysicsObject(world, cubeShape);
const cubeShape2 = new Box(50, 50, 50);
cubeShape2.position = { x: 200, y: 300, z: -100 };
const cube2 = new PhysicsObject(world, cubeShape2);
const cuboidShape = new Box(100, 50, 25);
cuboidShape.position = { x: -200, y: 300, z: -100 };
const cuboid = new PhysicsObject(world, cuboidShape);
//Custom Object, the hitbox will not match exactly since it forms a bounding box around the object
class PentagonalPrism extends Shape {
    constructor() {
        super();
        this.pointMatrix = new matrix();
        const points = [[0, 0, 0], [100, 0, 0], [150, 100, 0], [50, 150, 0], [-50, 100, 0], [0, 0, 200], [100, 0, 200], [150, 100, 200], [50, 150, 200], [-50, 100, 200]];
        for (let i = 0; i != points.length; i += 1) {
            this.pointMatrix.addColumn(points[i]);
        }
        const [centeringX, centeringY, centeringZ] = [-50, -75, -100];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{ pointIndexes: [0, 1, 6, 5], colour: "#ff2600" }, { pointIndexes: [1, 2, 7, 6], colour: "#ff9300" }, { pointIndexes: [2, 3, 8, 7], colour: "#fffb00" }, { pointIndexes: [3, 4, 9, 8], colour: "#00f900" }, { pointIndexes: [0, 4, 9, 5], colour: "#00fdff" }, { pointIndexes: [0, 1, 2, 3, 4], colour: "#0433ff" }, { pointIndexes: [5, 6, 7, 8, 9], colour: "#ff40ff" }];
    }
}
const pentagonalPrismShape = new PentagonalPrism(); //create aryaa3D object with the newly created class
pentagonalPrismShape.position = { x: 0, y: 300, z: 200 };
const pentagonalPrismCannonBody = new CANNON.Body({ mass: 1 });
pentagonalPrismCannonBody.addShape(new CANNON.Sphere(75));
const pentagonalPrism = new PhysicsObject(world, pentagonalPrismShape, pentagonalPrismCannonBody);
//Plane
class Plane extends Shape {
    constructor() {
        super();
        this.pointMatrix = new matrix();
        const points = [[0, 0, 0], [100, 0, 0], [100, 0, 100], [0, 0, 100], [0, 0, 200], [100, 0, 200], [100, 0, 300], [0, 0, 300], [0, 0, 400], [100, 0, 400], [100, 0, 500], [0, 0, 500], [0, 0, 600], [100, 0, 600], [100, 0, 700], [0, 0, 700], [0, 0, 800], [100, 0, 800], [200, 0, 0], [300, 0, 0], [300, 0, 100], [200, 0, 100], [200, 0, 200], [300, 0, 200], [300, 0, 300], [200, 0, 300], [200, 0, 400], [300, 0, 400], [300, 0, 500], [200, 0, 500], [200, 0, 600], [300, 0, 600], [300, 0, 700], [200, 0, 700], [200, 0, 800], [300, 0, 800], [400, 0, 0], [500, 0, 0], [500, 0, 100], [400, 0, 100], [400, 0, 200], [500, 0, 200], [500, 0, 300], [400, 0, 300], [400, 0, 400], [500, 0, 400], [500, 0, 500], [400, 0, 500], [400, 0, 600], [500, 0, 600], [500, 0, 700], [400, 0, 700], [400, 0, 800], [500, 0, 800], [600, 0, 0], [700, 0, 0], [700, 0, 100], [600, 0, 100], [600, 0, 200], [700, 0, 200], [700, 0, 300], [600, 0, 300], [600, 0, 400], [700, 0, 400], [700, 0, 500], [600, 0, 500], [600, 0, 600], [700, 0, 600], [700, 0, 700], [600, 0, 700], [600, 0, 800], [700, 0, 800], [800, 0, 0], [800, 0, 100], [800, 0, 200], [800, 0, 300], [800, 0, 400], [800, 0, 500], [800, 0, 600], [800, 0, 700], [800, 0, 800]];
        for (let i = 0; i != points.length; i += 1) {
            this.pointMatrix.addColumn(points[i]);
        }
        const [centeringX, centeringY, centeringZ] = [-400, 0, -400];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{ pointIndexes: [0, 1, 2, 3], colour: "#e6e6e6" }, { pointIndexes: [1, 18, 21, 2], colour: "#e6e6e6" }, { pointIndexes: [18, 19, 20, 21], colour: "#e6e6e6" }, { pointIndexes: [19, 36, 39, 20], colour: "#e6e6e6" }, { pointIndexes: [36, 37, 38, 39], colour: "#e6e6e6" }, { pointIndexes: [37, 54, 57, 38], colour: "#e6e6e6" }, { pointIndexes: [54, 55, 56, 57], colour: "#e6e6e6" }, { pointIndexes: [55, 72, 73, 56], colour: "#e6e6e6" }, { pointIndexes: [3, 2, 5, 4], colour: "#e6e6e6" }, { pointIndexes: [2, 21, 22, 5], colour: "#e6e6e6" }, { pointIndexes: [21, 20, 23, 22], colour: "#e6e6e6" }, { pointIndexes: [20, 39, 40, 23], colour: "#e6e6e6" }, { pointIndexes: [39, 38, 41, 40], colour: "#e6e6e6" }, { pointIndexes: [38, 57, 58, 41], colour: "#e6e6e6" }, { pointIndexes: [57, 56, 59, 58], colour: "#e6e6e6" }, { pointIndexes: [56, 73, 74, 59], colour: "#e6e6e6" }, { pointIndexes: [4, 5, 6, 7], colour: "#e6e6e6" }, { pointIndexes: [5, 22, 25, 6], colour: "#e6e6e6" }, { pointIndexes: [22, 23, 24, 25], colour: "#e6e6e6" }, { pointIndexes: [23, 40, 43, 24], colour: "#e6e6e6" }, { pointIndexes: [40, 41, 42, 43], colour: "#e6e6e6" }, { pointIndexes: [41, 58, 61, 42], colour: "#e6e6e6" }, { pointIndexes: [58, 59, 60, 61], colour: "#e6e6e6" }, { pointIndexes: [59, 74, 75, 60], colour: "#e6e6e6" }, { pointIndexes: [7, 6, 9, 8], colour: "#e6e6e6" }, { pointIndexes: [6, 25, 26, 9], colour: "#e6e6e6" }, { pointIndexes: [25, 24, 27, 26], colour: "#e6e6e6" }, { pointIndexes: [24, 43, 44, 27], colour: "#e6e6e6" }, { pointIndexes: [43, 42, 45, 44], colour: "#e6e6e6" }, { pointIndexes: [42, 61, 62, 45], colour: "#e6e6e6" }, { pointIndexes: [61, 60, 63, 62], colour: "#e6e6e6" }, { pointIndexes: [60, 75, 76, 63], colour: "#e6e6e6" }, { pointIndexes: [8, 9, 10, 11], colour: "#e6e6e6" }, { pointIndexes: [9, 26, 29, 10], colour: "#e6e6e6" }, { pointIndexes: [26, 27, 28, 29], colour: "#e6e6e6" }, { pointIndexes: [27, 44, 47, 28], colour: "#e6e6e6" }, { pointIndexes: [44, 45, 46, 47], colour: "#e6e6e6" }, { pointIndexes: [45, 62, 65, 46], colour: "#e6e6e6" }, { pointIndexes: [62, 63, 64, 65], colour: "#e6e6e6" }, { pointIndexes: [63, 76, 77, 64], colour: "#e6e6e6" }, { pointIndexes: [11, 10, 13, 12], colour: "#e6e6e6" }, { pointIndexes: [10, 29, 30, 13], colour: "#e6e6e6" }, { pointIndexes: [29, 28, 31, 30], colour: "#e6e6e6" }, { pointIndexes: [28, 47, 48, 31], colour: "#e6e6e6" }, { pointIndexes: [47, 46, 49, 48], colour: "#e6e6e6" }, { pointIndexes: [46, 65, 66, 49], colour: "#e6e6e6" }, { pointIndexes: [65, 64, 67, 66], colour: "#e6e6e6" }, { pointIndexes: [64, 77, 78, 67], colour: "#e6e6e6" }, { pointIndexes: [12, 13, 14, 15], colour: "#e6e6e6" }, { pointIndexes: [13, 30, 33, 14], colour: "#e6e6e6" }, { pointIndexes: [30, 31, 32, 33], colour: "#e6e6e6" }, { pointIndexes: [31, 48, 51, 32], colour: "#e6e6e6" }, { pointIndexes: [48, 49, 50, 51], colour: "#e6e6e6" }, { pointIndexes: [49, 66, 69, 50], colour: "#e6e6e6" }, { pointIndexes: [66, 67, 68, 69], colour: "#e6e6e6" }, { pointIndexes: [67, 78, 79, 68], colour: "#e6e6e6" }, { pointIndexes: [15, 14, 17, 16], colour: "#e6e6e6" }, { pointIndexes: [14, 33, 34, 17], colour: "#e6e6e6" }, { pointIndexes: [33, 32, 35, 34], colour: "#e6e6e6" }, { pointIndexes: [32, 51, 52, 35], colour: "#e6e6e6" }, { pointIndexes: [51, 50, 53, 52], colour: "#e6e6e6" }, { pointIndexes: [50, 69, 70, 53], colour: "#e6e6e6" }, { pointIndexes: [69, 68, 71, 70], colour: "#e6e6e6" }, { pointIndexes: [68, 79, 80, 71], colour: "#e6e6e6" }];
    }
}
const plane = new PhysicsObject(world, new Plane(), new CANNON.Body({ mass: 0 }));
plane.aShape.showOutline = true;
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if ($e.key == " ") {
        clearInterval(interval);
    }
    else if (key == "arrowup") {
        plane.aShape.rotation.x += 5;
    }
    else if (key == "arrowdown") {
        plane.aShape.rotation.x -= 5;
    }
    else if (key == "arrowleft") {
        plane.aShape.rotation.z += 5;
    }
    else if (key == "arrowright") {
        plane.aShape.rotation.z -= 5;
    }
    else if (key == "w") {
        cube.cBody.applyImpulse(new CANNON.Vec3(0, 0, 50), cube.cBody.position);
    }
    else if (key == "s") {
        cube.cBody.applyImpulse(new CANNON.Vec3(0, 0, -50), cube.cBody.position);
    }
    else if (key == "a") {
        cube.cBody.applyImpulse(new CANNON.Vec3(-50, 0, 0), cube.cBody.position);
    }
    else if (key == "d") {
        cube.cBody.applyImpulse(new CANNON.Vec3(50, 0, 0), cube.cBody.position);
    }
    plane.aShape.updateQuaternion();
    plane.syncCBody(); //sync cannon body with aryaa3D shape's rotation
};
console.log("Press space to stop the animation");
console.log("Press arrow keys to rotate plane and move objects");
console.log("Press WASD to apply impulses to the cube in the respective directions");
const interval = setInterval(() => {
    world.step(16 / 1000);
    //sync aryaa3D objects with cannon objects
    cube.syncAShape();
    cube2.syncAShape();
    cuboid.syncAShape();
    pentagonalPrism.syncAShape();
    plane.syncAShape(); //don't actually need this since the plane is not meant to move
    clearCanvas();
    camera.renderGrid();
    camera.render([plane.aShape]); //rendering plane before objects
    camera.render([cube.aShape, cube2.aShape, cuboid.aShape, pentagonalPrism.aShape]);
}, 16);
console.warn("Object's may seem to be in front of plane, even when they are behind, because I am rendering the plane before the objects");
console.warn("As this is a parallel projection, there is no depth perception");
