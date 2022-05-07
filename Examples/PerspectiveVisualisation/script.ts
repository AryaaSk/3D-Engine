//basically just want to be able to add objects, and show the lines going into the camera
//also want to show the point where they intersect the viewport (optional: draw lines on the viewport to show resulting image)

//will be done in absolute mode since it is easier to understand and work with.

(function () {

//CONSTANTS
const nearDistance = 1000;

const visualiseRays = ( object: Shape, cameraPosition: XYZ, options?: { showRays?: boolean, showIntersection?: boolean, showImage?: boolean }) => {
    let [showRays, showIntersection, showImage] = [true, true, true];
    if (options?.showIntersection == false) { showIntersection = false; }
    if (options?.showRays == false) { showRays = false; }
    if (options?.showImage == false) { showImage = false; }

    const objectPoints = object.physicalMatrix.copy();
    objectPoints.translateMatrix( object.position.x, object.position.y, object.position.z );
    const cameraPoint = [ cameraPosition.x, cameraPosition.y, cameraPosition.z ];
    
    //prepare the points
    let pointsInFrontOfCamera = false;
    for (let i = 0; i != objectPoints.width; i += 1) {
        const vertex = objectPoints.getColumn(i);
        if ( vertex[2] > cameraPoint[2] ) { pointsInFrontOfCamera = true; }

        if (vertex[2] <= cameraPoint[2]) {
            objectPoints.setValue( i, 2, cameraPoint[2] + 1 ); //clip point to the camera'z so it doesn't get inverted
        }
    }
    if ( pointsInFrontOfCamera == false ) { return; } //no point rendering if all the points are behind the camera


    const intersectionPoints: number[][] = [];
    for (let i = 0; i != objectPoints.width; i += 1) {
        const vertex = objectPoints.getColumn(i);

        //calculate intersection, normalize z-axis to (camera.position.z + nearDistance), the position of the viewport
        const vector = [ vertex[0] - cameraPoint[0], vertex[1] - cameraPoint[1], vertex[2] - cameraPoint[2] ];
        const zScaleFactor = nearDistance / vector[2];
        const intersectionVector = [  vector[0] * zScaleFactor, vector[1] * zScaleFactor, vector[2] * zScaleFactor ]; //keep z position since I need to plot it in the 3D world
        const intersectionPoint = [ cameraPoint[0] + intersectionVector[0], cameraPoint[1] + intersectionVector[1], cameraPoint[2] + intersectionVector[2] ]

        /* //You need this when projecting onto the screen, in our case the viewport moves
        intersectionPoint[0] -= cameraPoint[0];
        intersectionPoint[1] -= cameraPoint[1];
        intersectionPoint[2] -= cameraPoint[2];
        */

        const packageMatrix = new matrix(); //wrapping the ray and intersection into 1 matrix to get transformed into 2D points to plot
        packageMatrix.addColumn( vertex );
        packageMatrix.addColumn( cameraPoint );
        packageMatrix.addColumn( intersectionPoint );

        const transformedMatrix = camera.transformPoints( packageMatrix );
        intersectionPoints.push( transformedMatrix.getColumn(2) ); //to create the image later
        //intersectionPoints.push( intersectionPoint );
        //When it is projected on the viewport, the player stays in the same position (relative to viewport), but when projected onto screen it moves even when the camera is directly behind it.
        //May have to translate by the inverse of the camera's position, since when projecting to the viewport, the viewport also moves.

        if (showRays == true) {
            drawLine( transformedMatrix.getColumn(0), transformedMatrix.getColumn(1), "lime" ) //camera -> object
        }
        if (showIntersection == true) {
            plotPoint( transformedMatrix.getColumn(2), "red" );
        }
    }

    if (showImage == true) {
        for (const face of object.faces) {
            const points: number[][] = [];
            for (const pointIndex of face.pointIndexes) {
                points.push( intersectionPoints[pointIndex] )
            }
            drawShape( points, "#ffffff00", true, "#ffffff");
        }
    }
}


linkCanvas("renderingWindow");

//Objects:
const plane = new Box(300, 10, 1000);
plane.setColour("#ffffff"); //transparent
plane.showOutline();
plane.position.y = -55;

const cube = new Box(100, 100, 100);
cube.showOutline();

const sphere = new Sphere( 50 );
sphere.setColour("#87deeb");
sphere.showOutline();
sphere.position.z = 500;




const cameraObject = new Sphere( 25 );
cameraObject.name = "camera"
cameraObject.setColour("#c4c4c4");
cameraObject.showOutline();
cameraObject.position = Vector( 50, 50, -600 );

const viewport = new Box(1280, 720, 1);
viewport.setColour("#00000050");
viewport.showOutline();
const updateViewport = () => { 
    viewport.position = JSON.parse(JSON.stringify(cameraObject.position));
    viewport.position.z = cameraObject.position.z + nearDistance; 
}
updateViewport();


const camera = new AbsoluteCamera();
camera.worldRotation = Euler( -20, 20, 0 );
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow");

//zoom based on device height / width
const cameraZoomWidth = (window.innerWidth) / 1850;
const cameraZoomHeight = (window.innerHeight) / 1100;
camera.zoom = cameraZoomWidth; //set to lowest
if (cameraZoomHeight < cameraZoomWidth) {
    camera.zoom = cameraZoomHeight;
}

let cubeRays = false;
setInterval(() => {
    clearCanvas();
    camera.render([plane]);
    camera.render([cameraObject, viewport, cube, sphere]);

    visualiseRays( plane, cameraObject.position, { showRays: false, showIntersection: false });
    visualiseRays( cube, cameraObject.position, { showRays: cubeRays, showIntersection: cubeRays });
    visualiseRays( sphere, cameraObject.position, { showRays: false, showIntersection: false });
}, 16);


const cameraSpeed = 50;
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowup") { cameraObject.position.y += cameraSpeed; }
    else if (key == "arrowdown") { cameraObject.position.y -= cameraSpeed; }

    else if ( key == "arrowleft" ) { cameraObject.position.x -= cameraSpeed; }
    else if ( key == "arrowright" ) { cameraObject.position.x += cameraSpeed; }

    else if ( key == "w" ) { cameraObject.position.z += cameraSpeed; }
    else if ( key == "s" ) { cameraObject.position.z -= cameraSpeed; }

    else if (key == "1") { cameraObject.setColour("#c4c4c4"); }
    else if (key == "2") { cameraObject.setColour(""); }
    updateViewport();
}

document.getElementById("moveBackward")!.onclick = () => {
    cameraObject.position.z -= cameraSpeed;
    updateViewport();
}
document.getElementById("moveForward")!.onclick = () => {
    cameraObject.position.z += cameraSpeed;
    updateViewport();
}
console.log("Arrow keys to move camera x and y, w and s to move camera z, press 1 or 2 to show or hide camera");

document.getElementById("toggleCubeRays")!.onclick = () => {
    cubeRays = !cubeRays;
}

})();
