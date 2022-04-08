"use strict";
(() => {
    linkCanvas("renderingWindow");
    const camera = new Camera();
    camera.enableMovementControls("renderingWindow", true, false, true);
    const shape = new Shape();
    const displayShape = new Shape();
    displayShape.showOutline = true;
    let centeringX = 0;
    let centeringY = 0;
    let centeringZ = 0;
    const duplicatePoints = () => {
        const pointIndexesToDupList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
        if (pointIndexesToDupList == undefined || pointIndexesToDupList == "") {
            return;
        }
        const pointIndexesToDup = pointIndexesToDupList.split(",").map(Number);
        const pointMatrixWidth = shape.pointMatrix.width;
        for (let i = 0; i != pointIndexesToDup.length; i += 1) {
            if (pointIndexesToDup[i] > pointMatrixWidth - 1) {
                alert("One or more of indexes was not a valid point index");
                return;
            }
        }
        const newPoints = [];
        for (let i = 0; i != pointIndexesToDup.length; i += 1) {
            const point = JSON.parse(JSON.stringify(shape.pointMatrix.getColumn(pointIndexesToDup[i])));
            newPoints.push(point);
        }
        for (let i = 0; i != newPoints.length; i += 1) {
            shape.pointMatrix.addColumn(newPoints[i]);
        }
        updateDOM();
        updateDisplayShape();
    };
    const translatePoints = () => {
        const pointIndexesList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
        if (pointIndexesList == undefined || pointIndexesList == "") {
            return;
        }
        const pointIndexes = pointIndexesList.split(",").map(Number);
        const pointMatrixWidth = shape.pointMatrix.width;
        for (let i = 0; i != pointIndexes.length; i += 1) {
            if (pointIndexes[i] > pointMatrixWidth - 1) {
                alert("One or more of indexes was not a valid point index");
                return;
            }
        }
        const translationVectorString = prompt("Enter the translation vector in format [x, y, z]");
        if (translationVectorString == undefined || translationVectorString == "") {
            alert("Invalid translation vector");
            return;
        }
        const translationVector = JSON.parse(translationVectorString);
        for (let i = 0; i != pointIndexes.length; i += 1) {
            const point = shape.pointMatrix.getColumn(pointIndexes[i]);
            shape.pointMatrix.setValue(pointIndexes[i], 0, point[0] + translationVector[0]);
            shape.pointMatrix.setValue(pointIndexes[i], 1, point[1] + translationVector[1]);
            shape.pointMatrix.setValue(pointIndexes[i], 2, point[2] + translationVector[2]);
        }
        updateDOM();
        updateDisplayShape();
    };
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
        updateDisplayShape();
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
        updateDisplayShape();
        updateDOM();
    };
    const updateCentering = () => {
        const [centeringXString, centeringYString, centeringZString] = [document.getElementById("centeringX").value, document.getElementById("centeringY").value, document.getElementById("centeringZ").value];
        [centeringX, centeringY, centeringZ] = [Number(centeringXString), Number(centeringYString), Number(centeringZString)];
    };
    const updateVariables = () => {
        updatePoints();
        updateFaces();
        updateCentering();
    };
    const updateDisplayShape = () => {
        //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
        displayShape.pointMatrix = shape.pointMatrix.copy();
        displayShape.faces = shape.faces;
        displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        displayShape.updateMatrices();
    };
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
        <input type="button" style="margin-left: 20px;" class="controlButton" id="pointCommands" value="Point Commands">
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
    const generateExportCode = () => {
        const shapeName = document.getElementById("shapeName").value || "NewShape";
        let pointMatrixPoints = [];
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            const point = shape.pointMatrix.getColumn(i);
            pointMatrixPoints.push(point);
        }
        updateCentering();
        const exportCode = `class ${shapeName} extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = ${JSON.stringify(pointMatrixPoints)};
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [${centeringX}, ${centeringY}, ${centeringZ}];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = ${JSON.stringify(shape.faces).replace(/"([^"]+)":/g, '$1:')};
    }
}
`;
        return exportCode;
    };
    const importShape = () => {
        let pointsJSON = prompt("Copy and paste the points array here:");
        if (pointsJSON == undefined || pointsJSON == "") {
            alert("Invalid Points");
            return;
        }
        if (pointsJSON.endsWith(";")) {
            pointsJSON = pointsJSON.slice(0, -1);
        }
        const points = JSON.parse(pointsJSON);
        let facesJSON = prompt("Copy and paste the faces array here:");
        if (facesJSON == undefined || facesJSON == "") {
            alert("Invalid Faces");
            return;
        }
        if (facesJSON.endsWith(";")) {
            facesJSON = facesJSON.slice(0, -1);
        }
        facesJSON = facesJSON.replaceAll('pointIndexes', '"pointIndexes"');
        facesJSON = facesJSON.replaceAll('colour', '"colour"');
        const faces = JSON.parse(facesJSON);
        let centeringJSON = prompt("Copy and paste the centering vectors array here:");
        if (centeringJSON == undefined || centeringJSON == "") {
            alert("Invalid Centering Vectors");
            return;
        }
        if (centeringJSON.endsWith(";")) {
            centeringJSON = centeringJSON.slice(0, -1);
        }
        const centeringVectors = JSON.parse(centeringJSON);
        shape.pointMatrix = new matrix();
        for (let i = 0; i != points.length; i += 1) {
            shape.pointMatrix.addColumn(points[i]);
        }
        shape.faces = faces;
        [centeringX, centeringY, centeringZ] = centeringVectors;
        updateDisplayShape();
        updateDOM();
        document.getElementById("centeringX").value = String(centeringX);
        document.getElementById("centeringY").value = String(centeringY);
        document.getElementById("centeringZ").value = String(centeringZ);
        document.getElementById("exportCodeTitle").innerText = "*Export Code:";
    };
    const startButtonListeners = () => {
        document.onkeydown = ($e) => {
            const key = $e.key.toLowerCase();
            if (key == "enter") {
                document.getElementById("exportCodeTitle").innerText = "*Export Code:";
                updateVariables();
                updateDisplayShape();
            }
        };
        document.getElementById("uploadShape").onclick = () => {
            importShape();
        };
        document.getElementById("addPoint").onclick = () => {
            shape.pointMatrix.addColumn([0 - centeringX, 0 - centeringY, 0 - centeringZ]);
            updateDisplayShape();
            updateDOM();
        };
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            document.getElementById(`DeletePoint${String(i)}`).onclick = () => {
                shape.pointMatrix.deleteColumn(i);
                //also need to check if there are any faces with this point, i = pointIndex
                let a = 0;
                while (a != shape.faces.length) {
                    if (shape.faces[a]?.pointIndexes.includes(i) == true) {
                        shape.faces.splice(a, 1);
                        a -= 1;
                    }
                    else {
                        a += 1;
                    }
                }
                updateDisplayShape();
                updateDOM();
            };
        }
        document.getElementById("pointCommands").onclick = () => {
            const command = prompt("What command do you want to perform, enter a letter:\n    D: Duplicate Points\n    T: Translate Points")?.toLowerCase();
            if (command == undefined) {
                return;
            }
            if (command == "d") {
                duplicatePoints();
            }
            else if (command == "t") {
                translatePoints();
            }
            else {
                alert("Invalid command");
                return;
            }
        };
        document.getElementById("addFace").onclick = () => {
            if (shape.pointMatrix.width < 3) {
                alert("You need at least 3 points to construct a face");
                return;
            }
            shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#c4c4c4" });
            updateDisplayShape();
            updateDOM();
        };
        for (let i = 0; i != shape.faces.length; i += 1) {
            document.getElementById(`DeleteFace${String(i)}`).onclick = () => {
                shape.faces.splice(i, 1);
                updateDisplayShape();
                updateDOM();
            };
        }
        document.getElementById("update").onclick = () => {
            document.getElementById("exportCodeTitle").innerText = "*Export Code:";
            updateVariables();
            updateDisplayShape();
        };
        document.getElementById("export").onclick = () => {
            updateVariables();
            document.getElementById("exportCodeTitle").innerText = "Export Code:";
            document.getElementById("exportCode").innerText = generateExportCode();
        };
    };
    //Startup
    (() => {
        shape.pointMatrix.addColumn([0, 0, 0]);
        shape.pointMatrix.addColumn([100, 0, 0]);
        shape.pointMatrix.addColumn([50, 0, 100]);
        shape.pointMatrix.addColumn([50, 100, 50]);
        shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#ff0000" });
        shape.faces.push({ pointIndexes: [0, 1, 3], colour: "#ff9300" });
        shape.faces.push({ pointIndexes: [1, 2, 3], colour: "#00f900" });
        shape.faces.push({ pointIndexes: [2, 3, 0], colour: "#0433ff" });
        centeringX = -50;
        centeringY = -50;
        centeringZ = -50;
        document.getElementById("centeringX").value = String(centeringX); //the centering values do not get updated in updateDOM();
        document.getElementById("centeringY").value = String(centeringY);
        document.getElementById("centeringZ").value = String(centeringZ);
    })();
    updateDOM();
    updateDisplayShape();
    document.getElementById("exportCode").innerText = generateExportCode();
    //Animation Loop
    setInterval(() => {
        clearCanvas();
        camera.renderGrid();
        camera.render([displayShape], true);
    }, 16);
})();
//localScope();
