"use strict";
const localScope = () => {
    linkCanvas("renderingWindow");
    const camera = new Camera();
    camera.enableMovementControls("renderingWindow", true, false, true);
    const shape = new Shape();
    shape.pointMatrix.addColumn([0, 0, 0]);
    shape.pointMatrix.addColumn([100, 0, 0]);
    shape.pointMatrix.addColumn([50, 0, 100]);
    shape.pointMatrix.addColumn([50, 100, 50]);
    shape.faces.push({ pointIndexes: [0, 1, 3], colour: "#ff0000" });
    shape.updateMatrices();
    const updatePoints = () => {
        //get data from existing points, can just use the indexes from the point matrix, and update the values
        const pointMatrixWidth = shape.pointMatrix.width;
        shape.pointMatrix = new matrix();
        for (let i = 0; i != pointMatrixWidth; i += 1) {
            const DOMPointX = document.getElementById(`point${String(i)}X`);
            const DOMPointY = document.getElementById(`point${String(i)}Y`);
            const DOMPointZ = document.getElementById(`point${String(i)}Z`);
            const [x, y, z] = [Number(DOMPointX.value), Number(DOMPointY.value), Number(DOMPointZ.value)];
            shape.pointMatrix.addColumn([x, y, z]);
        }
        shape.updateMatrices();
    };
    const updateFaces = () => {
        for (let i = 0; i != shape.faces.length; i += 1) {
            const pointIndexesString = document.getElementById(`pointIndexes${String(i)}`).value;
            const pointIndexesStringList = pointIndexesString.split(",");
            const pointIndexes = [];
            for (let a = 0; a != pointIndexesStringList.length; a += 1) {
                pointIndexes.push(Number(pointIndexesStringList[a]));
            }
            //check if any of the index's in pointIndexes are > the width of pointMatrix + 1, if so it means the point doesnt exist
            const pointMatrixWidth = shape.pointMatrix.width;
            let cancelOperation = false;
            for (let a = 0; a != pointIndexes.length; a += 1) {
                if (pointIndexes[a] > (pointMatrixWidth - 1)) {
                    cancelOperation = true;
                    break;
                }
            }
            if (cancelOperation == true) {
                shape.faces.splice(i, 1);
                i -= 1;
            }
            else {
                shape.faces[i].pointIndexes = pointIndexes;
                const colour = document.getElementById(`colour${String(i)}`).value;
                shape.faces[i].colour = colour;
            }
        }
        shape.updateMatrices();
        updateDOM();
    };
    const updateAll = () => {
        updatePoints();
        updateFaces();
        //updateCentering
        const [centeringXString, centeringYString, centeringZString] = [document.getElementById("centeringX").value, document.getElementById("centeringY").value, document.getElementById("centeringZ").value];
        const [centeringX, centeringY, centeringZ] = [Number(centeringXString), Number(centeringYString), Number(centeringZString)];
        shape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        shape.updateMatrices();
        //changes should be handled by animation loop
    };
    const generateExportCode = () => {
        const shapeName = document.getElementById("shapeName").value || "NewShape";
        let pointMatrixPoints = [];
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            const point = shape.pointMatrix.getColumn(i);
            pointMatrixPoints.push(point);
        }
        const exportCode = `class ${shapeName} extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = ${JSON.stringify(pointMatrixPoints)};
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = ${JSON.stringify(shape.faces).replace(/"([^"]+)":/g, '$1:')};
    }
}
`; //don't need to worry about centering since the points should already be centered when building the shape
        return exportCode;
    };
    const startButtonListeners = () => {
        document.onkeydown = ($e) => {
            const key = $e.key.toLowerCase();
            if (key == "enter") {
                updateAll();
            }
        };
        document.getElementById("addPoint").onclick = () => {
            shape.pointMatrix.addColumn([0, 0, 0]);
            shape.updateMatrices();
            updateDOM();
        };
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            document.getElementById(`DeletePoint${String(i)}`).onclick = () => {
                shape.pointMatrix.deleteColumn(i);
                //also need to check if there are any faces with this point
                for (let i = 0; i != shape.faces.length; i += 1) {
                    if (shape.faces[i].pointIndexes.includes(i) == true) {
                        shape.faces.splice(i, 1);
                        i -= 1;
                    }
                }
                shape.updateMatrices();
                updateDOM();
            };
        }
        document.getElementById("addFace").onclick = () => {
            if (shape.pointMatrix.width < 3) {
                alert("You need at least 3 points to construct a face");
                return;
            }
            shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#c4c4c4" });
            shape.updateMatrices();
            updateDOM();
        };
        for (let i = 0; i != shape.faces.length; i += 1) {
            document.getElementById(`DeleteFace${String(i)}`).onclick = () => {
                shape.faces.splice(i, 1);
                shape.updateMatrices();
                updateDOM();
            };
        }
        document.getElementById("resetCentering").onclick = () => {
            document.getElementById("centeringX").value = "0";
            document.getElementById("centeringY").value = "0";
            document.getElementById("centeringZ").value = "0";
            updateAll();
        };
        document.getElementById("update").onclick = () => {
            updateAll();
        };
        document.getElementById("export").onclick = () => {
            updateAll();
            document.getElementById("exportCode").innerText = generateExportCode();
        };
    };
    document.getElementById("exportCode").innerText = generateExportCode();
    const updateDOM = () => {
        const pointMatrixList = document.getElementById("pointMatrixList");
        pointMatrixList.innerText = ""; //clear the list
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            const point = shape.pointMatrix.getColumn(i);
            const pointDiv = document.createElement('div');
            pointDiv.className = 'point';
            pointDiv.innerHTML = `
                <div class="centered">${String(i)}</div>
                <div class="centered"> X: <input type="text" style="width: 90%;" value="${point[0]}" id="point${String(i)}X"> </div>
                <div class="centered"> Y: <input type="text" style="width: 90%;" value="${point[1]}" id="point${String(i)}Y"> </div>
                <div class="centered"> Z: <input type="text" style="width: 90%;" value="${point[2]}" id="point${String(i)}Z"> </div>
                <div class="centered"><input type="button" class="controlButton deleteStyle" id="DeletePoint${String(i)}" value="Delete Point" style="float: right;"></div>
        `;
            pointMatrixList.appendChild(pointDiv);
        }
        const pointControls = document.createElement('div');
        pointControls.className = "centered";
        pointControls.innerHTML = `
        <input type="button" class="controlButton" id="addPoint" value="Add Point">
    `;
        pointMatrixList.appendChild(pointControls);
        const faceList = document.getElementById("faceList");
        faceList.innerText = "";
        for (let i = 0; i != shape.faces.length; i += 1) {
            const face = shape.faces[i];
            const faceDiv = document.createElement('div');
            faceDiv.className = "face";
            faceDiv.innerHTML = `
            <div class="centered"> ${String(i)} </div>
            <div class="centeredLeft"> Point Indexes: <input type="text" style="margin-left: 20px; width: 70%;" id="pointIndexes${String(i)}" value="${String(face.pointIndexes)}"> </div>
            <div class="centeredLeft"> Colour: <input type="color" style="width: 90%;" id="colour${String(i)}" value="${String(face.colour)}"></div>
            <div class="centeredLeft"><input type="button" class="controlButton deleteStyle" id="DeleteFace${String(i)}" value="Delete Face" style="float: right;"></div>
        `;
            faceList.appendChild(faceDiv);
        }
        const faceControls = document.createElement('div');
        faceControls.className = "centered";
        faceControls.innerHTML = `
        <input type="button" class="controlButton" id="addFace" value="Add Face">
    `;
        faceList.appendChild(faceControls);
        startButtonListeners();
    };
    updateDOM();
    //Animation Loop
    setInterval(() => {
        clearCanvas();
        camera.renderGrid();
        camera.render([shape], true);
    }, 16);
};
localScope();
