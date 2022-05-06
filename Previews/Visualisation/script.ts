//basically just want to be able to add objects, and show the lines going into the camera
//also want to show the point where they intersect the viewport (optional: draw lines on the viewport to show resulting image)

//will be done in absolute mode since it is easier to understand and work with.

const localVisualisationScope = () => {

    //CONSTANTS
    const nearDistance = 100;
    
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
    
            if ( vertex[2] < (cameraPosition.z + nearDistance) ) {
                console.log("need to clip")
            }
    
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

            const transformedMatrix = camera.transformPoints( packageMatrix );
            intersectionPoints.push( transformedMatrix.getColumn(2) ); //to create the image later

            if (showRays == true) {
                drawLine( transformedMatrix.getColumn(0), transformedMatrix.getColumn(1), "black" ) //camera -> object
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
    
    
    linkCanvas("renderingWindow");
    
    //Objects:
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
    
    
    const cameraObject = new Sphere( 25 );
    cameraObject.name = "camera"
    cameraObject.setColour("#c4c4c4");
    cameraObject.showOutline();
    cameraObject.position = Vector( 50, 50, -600 );


    const viewport = new Box(1280, 720, 1);
    viewport.setColour("#d1e6ff40");
    viewport.showOutline();
    const updateViewport = () => { 
        viewport.position = JSON.parse(JSON.stringify(cameraObject.position));
        viewport.position.z = cameraObject.position.z + nearDistance; 
    }
    updateViewport();
    
    
    
    
    const camera = new Camera();
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
    
    setInterval(() => {
        clearCanvas();
        camera.render([plane]);
        camera.render([cameraObject, viewport, cube, sphere]);
    
        visualiseRays( plane, cameraObject.position, { showRays: false, showIntersection: true });
        visualiseRays( cube, cameraObject.position, { showRays: false, showIntersection: false });
        visualiseRays( sphere, cameraObject.position, { showRays: false, showIntersection: false });
    }, 16);
    
    
    document.onkeydown = ($e) => {
        const key = $e.key.toLowerCase();
        if (key == "arrowup") { cameraObject.position.y += 5; }
        else if (key == "arrowdown") { cameraObject.position.y -= 5; }
    
        else if ( key == "arrowleft" ) { cameraObject.position.x -= 5; }
        else if ( key == "arrowright" ) { cameraObject.position.x += 5; }
    
        else if ( key == "w" ) { cameraObject.position.z += 5; }
        else if ( key == "s" ) { cameraObject.position.z -= 5; }
    
        else if (key == "1") { cameraObject.setColour("#c4c4c4"); }
        else if (key == "2") { cameraObject.setColour(""); }
        updateViewport();
    }
    
    console.log("Arrow keys to move camera x and y, w and s to move camera z, press 1 or 2 to show or hide camera");
    
    document.getElementById("moveLeft")!.onclick = () => {
        cameraObject.position.z -= 20;
        updateViewport();
    }
    document.getElementById("moveRight")!.onclick = () => {
        cameraObject.position.z += 20;
        updateViewport();
    }
    
    }
    localVisualisationScope();