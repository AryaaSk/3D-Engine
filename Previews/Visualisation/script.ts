//basically just want to be able to add objects, and show the lines going into the camera
//also want to show the point where they intersect the viewport (optional: draw lines on the viewport to show resulting image)

//will be done in absolute mode since it is easier to understand and work with.

const localVisualisationScope = () => {

const draw3DLine = (p1: number[], p2: number[]) => {
    const pointMatrix = new matrix();
    pointMatrix.addColumn(p1);
    pointMatrix.addColumn(p2);
    const transformedPointsMatrix = camera.transformMatrix(pointMatrix, { x: 0, y: 0, z: 0 });
    const point1 = transformedPointsMatrix.getColumn(0);
    const point2 = transformedPointsMatrix.getColumn(1);

    drawLine(point1, point2, "black")
    plotPoint(point1, "black");
    plotPoint(point2, "black");
}

const visualiseRays = ( object: Shape, cameraPosition: XYZ, options?: { showRays?: boolean, showIntersection?: boolean, showImage?: boolean }) => {
    let [showRays, showIntersection, showImage] = [true, true, true];
    if (options?.showIntersection == false) { showIntersection = false; }
    if (options?.showRays == false) { showRays = false; }
    if (options?.showImage == false) { showImage = false; }

    const objectPoints = object.physicalMatrix.copy();
    objectPoints.translateMatrix( object.position.x, object.position.y, object.position.z );
    const cameraPos = [ cameraPosition.x, cameraPosition.y, cameraPosition.z ];

    const intersectionPoints: number[][] = [];

    for (let i = 0; i != objectPoints.width; i += 1) {
        const vertex = objectPoints.getColumn(i);
        const ray = [ cameraPos, vertex ]; //ray is just vector from camera -> vertex

        //calculate intersection, normalize z-axis to (camera.position.z + nearDistance), the position of the viewport
        const vector = [ vertex[0] - cameraPos[0], vertex[1] - cameraPos[1], vertex[2] - cameraPos[2] ];
        const zScaleFactor = nearDistance / vector[2];
        const intersectionVector = [  vector[0] * zScaleFactor, vector[1] * zScaleFactor, vector[2] * zScaleFactor ]; //keep z position since I need to plot it in the 3D world
        const intersectionPoint = [ cameraPosition.x + intersectionVector[0], cameraPosition.y + intersectionVector[1], cameraPosition.z + intersectionVector[2] ]

        const packageMatrix = new matrix(); //wrapping the ray and intersection into 1 matrix to get transformed into 2D points to plot
        packageMatrix.addColumn( ray[0] );
        packageMatrix.addColumn( ray[1] );
        packageMatrix.addColumn( intersectionPoint );
        //@ts-expect-error
        const transformedMatrix = camera.transformPoints( packageMatrix )
        intersectionPoints.push( transformedMatrix.getColumn(2) );

        if (showRays == true) {
            drawLine( transformedMatrix.getColumn(0), transformedMatrix.getColumn(1), "black" )
        }
        if (showIntersection == true) {
            plotPoint( transformedMatrix.getColumn(2), "grey" );
        }
    }

    if (showImage == true) {
        for (const face of object.faces) {
            const points: number[][] = [];
            for (const pointIndex of face.pointIndexes) {
                points.push( intersectionPoints[pointIndex] )
            }
            drawShape( points, "#ffffff00", true );
        }
    }
}

//CONSTANTS
const nearDistance = 100;


linkCanvas("renderingWindow");

//Objects:
const cube = new Box(200, 300, 500);
cube.setColour("#87deeb20"); //transparent
cube.showOutline();



const cameraObject = new Sphere( 25 );
cameraObject.name = "camera"
cameraObject.setColour("#c4c4c4");
cameraObject.showOutline();
cameraObject.position.z = -500;


const viewport = new Box(1280, 720, 1);
viewport.setColour("#ffffff80");
viewport.showOutline();
const updateViewport = () => { 
    viewport.position = JSON.parse(JSON.stringify(cameraObject.position));
    viewport.position.z = cameraObject.position.z + nearDistance; 
}
updateViewport();




const camera = new Camera();
camera.worldRotation = { x: -20, y: 20, z: 0 };
camera.updateRotationMatrix();
camera.enableMovementControls("renderingWindow");
//@ts-expect-error
camera.type = "absolute"
setInterval(() => {
    clearCanvas();
    camera.renderGrid();
    camera.render([cameraObject, viewport, cube])[2].screenPoints;

    visualiseRays( cube, cameraObject.position );
}, 16);

document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (key == "arrowup") { cameraObject.position.y += 5; }
    else if (key == "arrowdown") { cameraObject.position.y -= 5; }

    else if ( key == "arrowleft" ) { cameraObject.position.x -= 5; }
    else if ( key == "arrowright" ) { cameraObject.position.x += 5; }

    else if ( key == "w" ) { cameraObject.position.z += 5; }
    else if ( key == "s" ) { cameraObject.position.z -= 5; }
    updateViewport();
}



}
localVisualisationScope();