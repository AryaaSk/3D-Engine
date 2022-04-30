"use strict";
(() => {
    linkCanvas("renderingWindow");
    const camera = new Camera();
    camera.enableMovementControls("renderingWindow", true, true, true);
    const shape = new Shape();
    const displayShape = new Shape();
    let centeringX = 0;
    let centeringY = 0;
    let centeringZ = 0;
    //Point/Face Commands
    const getIndexes = (message, type) => {
        let pointIndexesList = prompt(message + "\nYou can also type 'All', to select everything");
        if (pointIndexesList == undefined || pointIndexesList == "") {
            return;
        }
        if (pointIndexesList.toLowerCase() == "all") {
            pointIndexesList = "";
            if (type == "points") {
                for (let i = 0; i != shape.pointMatrix.width; i += 1) {
                    pointIndexesList = pointIndexesList + String(i) + ",";
                }
            }
            else { //faces
                for (let i = 0; i != shape.faces.length; i += 1) {
                    pointIndexesList = pointIndexesList + String(i) + ",";
                }
            }
        }
        if (pointIndexesList.endsWith(",")) {
            pointIndexesList = pointIndexesList.slice(0, -1);
        }
        const pointIndexes = pointIndexesList.split(",").map(Number);
        return pointIndexes;
    };
    const duplicatePoints = () => {
        const pointIndexesToDup = getIndexes("Enter the indexes of the points you want to duplicate separated by a comma", "points");
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
        const pointIndexes = getIndexes("Enter the indexes of the points you want to translate separated by a comma", "points");
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
    const scalePoints = () => {
        const pointIndexes = getIndexes("Enter the indexes of the points you want to scale separated by a comma", "points");
        const pointMatrixWidth = shape.pointMatrix.width;
        for (let i = 0; i != pointIndexes.length; i += 1) {
            if (pointIndexes[i] > pointMatrixWidth - 1) {
                alert("One or more of indexes was not a valid point index");
                return;
            }
        }
        const scaleFactorString = prompt("Enter the scale factor vector in form [x, y, z]\nThis will be applied around (0, 0, 0), and is applied before the centering vector");
        if (scaleFactorString == undefined || scaleFactorString == "") {
            alert("Invalid scale factor");
            return;
        }
        const scaleFactor = JSON.parse(scaleFactorString);
        //check if any of the scaleFactors are 0, user may have thought this means do nothing, however it will set the point to 0
        if (scaleFactor[0] == 0 || scaleFactor[1] == 0 || scaleFactor[2] == 0) {
            const confimation = prompt(`1 or more of the vectors in ${JSON.stringify(scaleFactor)} is 0, a scale factor of 0 will set the corresponding axis to 0, you may have meant a scale factor of 1 ?\nType Y to confirm a scale factor of 0\nType anything else to cancel the operation`);
            if (confimation?.toLowerCase() != "y") {
                return;
            }
        }
        for (let i = 0; i != pointIndexes.length; i += 1) {
            const point = shape.pointMatrix.getColumn(pointIndexes[i]);
            shape.pointMatrix.setValue(pointIndexes[i], 0, point[0] * scaleFactor[0]);
            shape.pointMatrix.setValue(pointIndexes[i], 1, point[1] * scaleFactor[1]);
            shape.pointMatrix.setValue(pointIndexes[i], 2, point[2] * scaleFactor[2]);
        }
        updateDOM();
        updateDisplayShape();
    };
    const changeFaceColours = () => {
        const faceIndexes = getIndexes("Enter the indexes of the faces you want to change colours", "faces");
        const facesLength = shape.faces.length;
        for (let i = 0; i != faceIndexes.length; i += 1) {
            if (faceIndexes[i] > facesLength - 1) {
                alert("One or more of indexes was not a valid face index");
                return;
            }
        }
        const hexCode = prompt("Enter the new hex code of the new colour, e.g #ffffff");
        if (hexCode == undefined || hexCode == "") {
            alert("Invalid Hex Code");
            return;
        }
        for (let i = 0; i != faceIndexes.length; i += 1) {
            shape.faces[faceIndexes[i]].colour = hexCode;
        }
        updateDOM();
        updateDisplayShape();
    };
    const updateVariables = () => {
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
        const [centeringXString, centeringYString, centeringZString] = [document.getElementById("centeringX").value, document.getElementById("centeringY").value, document.getElementById("centeringZ").value];
        [centeringX, centeringY, centeringZ] = [Number(centeringXString), Number(centeringYString), Number(centeringZString)];
    };
    const updateDisplayShape = () => {
        //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
        displayShape.pointMatrix = shape.pointMatrix.copy();
        displayShape.faces = shape.faces;
        displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        displayShape.updateMatrices();
        displayShape.showOutline();
    };
    const updateDOM = () => {
        const pointList = document.getElementById("pointList");
        pointList.innerText = ""; //clear the list
        const pointTitleBar = document.createElement("div");
        pointTitleBar.innerHTML = `
    <div class="dataRow point" style="border: none; border-bottom: var(--mainBorder); background-color: transparent;">
        <div class="centered"> <label class="h3">Index</label> </div>
        <div class="centered"> <label class="h3">X</label> </div>
        <div class="centered"> <label class="h3">Y</label> </div>
        <div class="centered"> <label class="h3">Z</label> </div>
        <div class="centered"> </div>
    </div>
    `;
        pointList.appendChild(pointTitleBar);
        for (let i = 0; i != shape.pointMatrix.width; i += 1) {
            const point = shape.pointMatrix.getColumn(i);
            const pointDiv = document.createElement('div');
            pointDiv.innerHTML = `
        <div class="dataRow point">
            <div class="centered">  <label class="h3">${String(i)}</label>  </div>
            
            <div class="centered"> <input type="text" class="editorInputText" value="${point[0]}" name="pointX${String(i)}" id="point${String(i)}X"> </div>
            <div class="centered"> <input type="text" class="editorInputText" value="${point[1]}" name="pointY${String(i)}" id="point${String(i)}Y"> </div>
            <div class="centered"> <input type="text" class="editorInputText" value="${point[2]}" name="pointZ${String(i)}" id="point${String(i)}Z"> </div>

            <div class="centered"> <input type="button" class="editorInputButton deleteButton" style="border-left: 1px solid lightgray;" value="—" tabindex="-1" id="DeletePoint${String(i)}"> </div>
        </div>
        `;
            pointList.appendChild(pointDiv);
        }
        const pointControls = document.createElement('div');
        pointControls.innerHTML = `
    <br>
    <div class="centered">
        <div class="pointFaceControlButtons">
            <input type="button" class="editorInputButton" value="+" style="border-right: var(--mainBorder);" tabindex="-1" id="addPoint">
            <input type="button" class="editorInputButton" value="Point Commands" tabindex="-1" id="pointCommands">
        </div>
    </div>
    `;
        pointList.appendChild(pointControls);
        const faceList = document.getElementById("faceList");
        faceList.innerText = "";
        const faceTitleBar = document.createElement('div');
        faceTitleBar.innerHTML = `
    <div class="dataRow face" style="border: none; border-bottom: var(--mainBorder); background-color: transparent;">
        <div class="centered"> <label class="h3">Index</label> </div>
        <div class="centered"> <label class="h3">Point Indexes</label> </div>
        <div class="centered"> <label class="h3">Colour</label> </div>
        <div class="centered"> </div>
    </div>
    `;
        faceList.appendChild(faceTitleBar);
        for (let i = 0; i != shape.faces.length; i += 1) {
            const face = shape.faces[i];
            const faceDiv = document.createElement('div');
            faceDiv.innerHTML = `
        <div class="dataRow face">
            <div class="centered">  <label class="h3">${String(i)}</label>  </div>
            
            <div class="centered"> <input type="text" class="editorInputText facePointIndexes" value="${String(face.pointIndexes)}" name="face${String(i)}" id="pointIndexes${String(i)}"> </div>
            <div class="centered"> <input type="color" class="editorInputText" value="${String(face.colour)}" tabindex="-1" id="colour${String(i)}"> </div>

            <div class="centered"> <input type="button" class="editorInputButton deleteButton" style="border-left: 1px solid lightgray;" value="—" tabindex="-1" id="DeleteFace${String(i)}"> </div>
        </div>
        `;
            faceList.appendChild(faceDiv);
        }
        const faceControls = document.createElement('div');
        faceControls.innerHTML = `
    <br>
    <div class="centered">
        <div class="pointFaceControlButtons">
            <input type="button" class="editorInputButton" value="+" style="border-right: var(--mainBorder);" tabindex="-1" id="addFace">
            <input type="button" class="editorInputButton" value="Face Commands" tabindex="-1" id="faceCommands">
        </div>
    </div>
    `;
        faceList.appendChild(faceControls);
        startButtonListeners();
    };
    const generateExportCode = () => {
        const shapeName = document.getElementById("shapeName").value || "NewShape";
        updateVariables();
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
        let shapeCode = prompt("Copy and paste the shape's code here\nMake sure you haven't added a line break between any of the datasets:");
        if (shapeCode == undefined || shapeCode == "") {
            alert("Invalid Shape Code");
            return;
        }
        shapeCode = shapeCode.replaceAll(" ", "");
        var lineArray = shapeCode.split(/\r?\n/);
        let points = [];
        let centeringVectors = [];
        let faces = [];
        let found = 0;
        //find lines which begin with, "constpoints=", "const[centeringX,centeringY,centeringZ]=", and "this.faces=", this is the data we need to construct the object
        //when it finds one, then split at '=', and get second element
        for (let i = 0; i != lineArray.length; i += 1) {
            const line = lineArray[i];
            if (line.startsWith("constpoints=")) {
                let pointsJSON = line.split("=")[1];
                if (pointsJSON.endsWith(";")) {
                    pointsJSON = pointsJSON.slice(0, -1);
                }
                points = JSON.parse(pointsJSON);
                found += 1;
            }
            else if (line.startsWith("const[centeringX,centeringY,centeringZ]=")) {
                let centeringJSON = line.split("=")[1];
                if (centeringJSON.endsWith(";")) {
                    centeringJSON = centeringJSON.slice(0, -1);
                }
                centeringVectors = JSON.parse(centeringJSON);
                found += 1;
            }
            else if (line.startsWith("this.faces=")) {
                let facesJSON = line.split("=")[1];
                if (facesJSON.endsWith(";")) {
                    facesJSON = facesJSON.slice(0, -1);
                }
                facesJSON = facesJSON.replaceAll('pointIndexes', '"pointIndexes"');
                facesJSON = facesJSON.replaceAll('colour', '"colour"');
                facesJSON = facesJSON.replaceAll('outline', '"outline"');
                faces = JSON.parse(facesJSON);
                found += 1;
            }
        }
        if (found != 3) {
            alert("Unable to find all required data");
            return;
        }
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
        document.getElementById("importShape").onclick = () => {
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
            const command = prompt("What command do you want to perform, enter a letter:\n    D: Duplicate Points\n    T: Translate Points\n    S: Scale Points")?.toLowerCase();
            if (command == undefined) {
                return;
            }
            if (command == "d") {
                duplicatePoints();
            }
            else if (command == "t") {
                translatePoints();
            }
            else if (command == "s") {
                scalePoints();
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
            const lastPointIndexesTextinput = Array.from(document.querySelectorAll(".facePointIndexes")).pop();
            lastPointIndexesTextinput.focus();
        };
        for (let i = 0; i != shape.faces.length; i += 1) {
            document.getElementById(`DeleteFace${String(i)}`).onclick = () => {
                shape.faces.splice(i, 1);
                updateDisplayShape();
                updateDOM();
            };
        }
        document.getElementById("faceCommands").onclick = () => {
            const command = prompt("What command do you want to perform, enter a letter:\n    C: Colour Change")?.toLowerCase();
            if (command == undefined) {
                return;
            }
            if (command == "c") {
                changeFaceColours();
            }
            else {
                alert("Invalid command");
                return;
            }
        };
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
        let faceTextFieldInFocusID = undefined;
        document.onclick = ($e) => {
            const clickedElement = document.activeElement;
            if (clickedElement.name?.startsWith("face")) //only interested if the user clicks a face textfield
             {
                faceTextFieldInFocusID = clickedElement.id;
            }
            else if ($e.clientX < canvasWidth && $e.clientY < canvasHeight) //don't change textFieldInFocus when user clicks the renderingWindow
             {
                document.getElementById(faceTextFieldInFocusID)?.focus();
                return false;
            }
            else {
                faceTextFieldInFocusID = undefined;
            }
        };
        document.getElementById("renderingWindow").onclick = ($e) => {
            let clickedPoint = undefined;
            //we need to convert these click X and Y coordinates into the coordinates on the grid
            const gridX = $e.clientX - (canvasWidth / 2);
            const gridY = (canvasHeight / 2) - $e.clientY;
            const cursorPoint = [gridX, gridY];
            const distanceBetween2D = (p1, p2) => { return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2); };
            //now we need to loop through the screenPoints, check which point is the closests to the pointer's x and y, and return undefined if that distance is bigger than 100
            let shortestDistanceIndex = 0;
            for (let i = 0; i != screenPoints.width; i += 1) {
                if (distanceBetween2D(cursorPoint, screenPoints.getColumn(i)) < distanceBetween2D(cursorPoint, screenPoints.getColumn(shortestDistanceIndex))) {
                    shortestDistanceIndex = i;
                }
            }
            if (distanceBetween2D(cursorPoint, screenPoints.getColumn(shortestDistanceIndex)) < 10) {
                clickedPoint = shortestDistanceIndex;
            }
            if (faceTextFieldInFocusID != undefined && clickedPoint != undefined) {
                const faceTextfield = document.getElementById(faceTextFieldInFocusID);
                if (faceTextfield.selectionStart == 0) {
                    faceTextfield.value = `${clickedPoint}`;
                }
                else if (faceTextfield.value.endsWith(",")) {
                    faceTextfield.value = faceTextfield.value + ` ${clickedPoint}`;
                }
                else {
                    faceTextfield.value = faceTextfield.value + `, ${clickedPoint}`;
                }
            }
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
        centeringX = 0;
        centeringY = 0;
        centeringZ = 0;
        document.getElementById("centeringX").value = String(centeringX); //the centering values do not get updated in updateDOM();
        document.getElementById("centeringY").value = String(centeringY);
        document.getElementById("centeringZ").value = String(centeringZ);
    })();
    updateDOM();
    updateDisplayShape();
    document.getElementById("exportCode").innerText = generateExportCode();
    displayShape.showPoints = true;
    document.getElementById("showPoints").checked = true;
    document.getElementById("showFaces").checked = false;
    document.getElementById("showPoints").onchange = () => { displayShape.showPoints = document.getElementById("showPoints").checked; };
    document.getElementById("showFaces").onchange = () => { displayShape.showFaceIndexes = document.getElementById("showFaces").checked; };
    //Animation Loop
    let screenPoints = new matrix(); //always updated to have the current screen points, in correct order
    setInterval(() => {
        clearCanvas();
        camera.renderGrid();
        screenPoints = camera.render([displayShape])[0].screenPoints; //camera now returns the sortedObjects, since we are only rendering 1 object we can always get [0]
    }, 16);
})();
//localScope();
