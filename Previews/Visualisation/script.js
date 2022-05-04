"use strict";
//basically just want to be able to add objects, and show the lines going into the camera
//also want to show the point where they intersect the viewport (optional: draw lines on the viewport to show resulting image)
//will be done in absolute mode since it is easier to understand and work with.
const localVisualisationScope = () => {
    const draw3DLine = (p1, p2) => {
        const pointMatrix = new matrix();
        pointMatrix.addColumn(p1);
        pointMatrix.addColumn(p2);
        const transformedPointsMatrix = camera.transformMatrix(pointMatrix, { x: 0, y: 0, z: 0 });
        const point1 = transformedPointsMatrix.getColumn(0);
        const point2 = transformedPointsMatrix.getColumn(1);
        drawLine(point1, point2, "black");
        plotPoint(point1, "black");
        plotPoint(point2, "black");
    };
    const visualiseRays = (screenPoints, cameraPosition, showIntersection) => {
        /*
        //draw lines from screenPoints to cameraPosition
        const originMatrix = new matrix();
        originMatrix.addColumn([0, 0, 0])
        //@ts-expect-error
        const cameraPosition2D = camera.transformPoints(originMatrix, cameraPosition).getColumn(0);
        for (let i = 0; i != screenPoints.width; i += 1) {
            const point = screenPoints.getColumn(i);
            drawLine( point, cameraPosition2D, "grey" );
    
            //we also need to show the intersection between the ray and the viewport
        }
        */
        //doing it wrong, actually need to calculate vector from c -> point myself, since otherwise I can't calculate the scaled vector
        //then I just use the camera.generatePerspective() function on the points, and plot the rays with the intersection.
    };
    //CONSTANTS
    const nearDistance = 300;
    linkCanvas("renderingWindow");
    //Objects:
    const cube = new Box(200, 300, 500);
    cube.setColour("#87deeb20"); //transparent
    cube.showOutline();
    const cameraObject = new Sphere(25);
    cameraObject.name = "camera";
    cameraObject.setColour("#c4c4c4");
    cameraObject.showOutline();
    cameraObject.position.z = -800;
    const viewport = new Box(1280, 720, 1);
    viewport.position.z = cameraObject.position.z + nearDistance;
    viewport.setColour("#ffffff80");
    viewport.showOutline();
    const camera = new Camera();
    camera.worldRotation = { x: -20, y: 20, z: 0 };
    camera.updateRotationMatrix();
    camera.enableMovementControls("renderingWindow");
    //@ts-expect-error
    camera.type = "absolute";
    setInterval(() => {
        clearCanvas();
        camera.renderGrid();
        const cubePoints = camera.render([cameraObject, viewport, cube])[2].screenPoints;
        visualiseRays(cubePoints, cameraObject.position, true);
    }, 16);
};
localVisualisationScope();
