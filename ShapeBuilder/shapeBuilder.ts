const localScope = () => {

linkCanvas("renderingWindow");
const camera = new Camera();
camera.enableMovementControls("renderingWindow", true, false, true);

const pointMatrix = new matrix();
pointMatrix.addColumn([0, 0, 0]);
pointMatrix.addColumn([100, 0, 0]);
pointMatrix.addColumn([50, 0, 100]);
pointMatrix.addColumn([50, 100, 50]);

setInterval(() => {
    clearCanvas();
    camera.renderGrid();

    //render the points in the pointMatrix, but first we have to transform it using the camera's rotationMatrix
    const physicalMatrix = multiplyMatrixs(camera.worldRotationMatrix, pointMatrix);
    physicalMatrix.scaleUp(camera.zoom);
    
    for (let i = 0; i != physicalMatrix.width; i += 1)
    {
        const point = physicalMatrix.getColumn(i);
        plotPoint(point, "#000000", String(i));
    }


}, 16)




























};
localScope();