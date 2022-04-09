(() => { //local scope

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
    if (pointIndexesToDupList == undefined || pointIndexesToDupList == "") { return; }
    const pointIndexesToDup = pointIndexesToDupList.split(",").map(Number);

    const pointMatrixWidth = shape.pointMatrix.width;
    for (let i = 0; i != pointIndexesToDup.length; i += 1)
    { if (pointIndexesToDup[i] > pointMatrixWidth - 1) { alert("One or more of indexes was not a valid point index"); return; } }

    const newPoints: number[][] = [];
    for (let i = 0; i != pointIndexesToDup.length; i += 1) {
        const point = JSON.parse(JSON.stringify(shape.pointMatrix.getColumn(pointIndexesToDup[i])));
        newPoints.push(point);
    }

    for (let i = 0; i != newPoints.length; i += 1)
    { shape.pointMatrix.addColumn(newPoints[i]); }

    updateDOM();
    updateDisplayShape();
}
const translatePoints = () => {
    const pointIndexesList = prompt("Enter the indexes of the points you want to translate separated by a comma");
    if (pointIndexesList == undefined || pointIndexesList == "") { return; }
    const pointIndexes = pointIndexesList.split(",").map(Number);

    const pointMatrixWidth = shape.pointMatrix.width;
    for (let i = 0; i != pointIndexes.length; i += 1)
    { if (pointIndexes[i] > pointMatrixWidth - 1) { alert("One or more of indexes was not a valid point index"); return; } }

    const translationVectorString = prompt("Enter the translation vector in format [x, y, z]");
    if (translationVectorString == undefined || translationVectorString == "") { alert("Invalid translation vector"); return; }
    const translationVector = JSON.parse(translationVectorString);

    for (let i = 0; i != pointIndexes.length; i += 1)
    {
        const point = shape.pointMatrix.getColumn(pointIndexes[i]);
        shape.pointMatrix.setValue(pointIndexes[i], 0, point[0] + translationVector[0]);
        shape.pointMatrix.setValue(pointIndexes[i], 1, point[1] + translationVector[1]);
        shape.pointMatrix.setValue(pointIndexes[i], 2, point[2] + translationVector[2]);
    }

    updateDOM();
    updateDisplayShape();
}
const changeFaceColours = () => {
    const faceIndexesList = prompt("Enter the indexes of the faces you want to change colours");
    if (faceIndexesList == undefined || faceIndexesList == "") { return; }
    const faceIndexes = faceIndexesList.split(",").map(Number);

    const facesLength = shape.faces.length;
    for (let i = 0; i != faceIndexes.length; i += 1)
    { if (faceIndexes[i] > facesLength - 1) { alert("One or more of indexes was not a valid face index"); return; } }

    const hexCode = prompt("Enter the new hex code of the new colour, e.g #ffffff");
    if (hexCode == undefined || hexCode == "") { alert("Invalid Hex Code"); return; }
    
    for (let i = 0; i != faceIndexes.length; i += 1) {
        shape.faces[faceIndexes[i]].colour = hexCode;
    }

    updateDOM();
    updateDisplayShape();
}


const updateVariables = () => {
    const pointMatrixWidth = shape.pointMatrix.width;
    shape.pointMatrix = new matrix();
    for (let i = 0; i != pointMatrixWidth; i += 1)
    {
        const DOMPointX = <HTMLInputElement>document.getElementById(`point${String(i)}X`)!;
        const DOMPointY = <HTMLInputElement>document.getElementById(`point${String(i)}Y`)!;
        const DOMPointZ = <HTMLInputElement>document.getElementById(`point${String(i)}Z`)!;
        const [x, y, z] = [Number(DOMPointX.value), Number(DOMPointY.value), Number(DOMPointZ.value)]

        shape.pointMatrix.addColumn([x, y, z]);
    }
    updateDisplayShape();

    for (let i = 0; i != shape.faces.length; i += 1)
    {
        const pointIndexesString = (<HTMLInputElement>document.getElementById(`pointIndexes${String(i)}`)!).value;
        const pointIndexesStringList = pointIndexesString.split(",");
        const pointIndexes: number[] = [];
        for (let a = 0; a != pointIndexesStringList.length; a += 1)
        { pointIndexes.push(Number(pointIndexesStringList[a])); }

        //check if any of the index's in pointIndexes are > the width of pointMatrix + 1, if so it means the point doesnt exist
        const pointMatrixWidth = shape.pointMatrix.width;
        let cancelOperation = false;
        for (let a = 0; a != pointIndexes.length; a += 1)
        {
            if (pointIndexes[a] > (pointMatrixWidth - 1))
            { cancelOperation = true; break }
        }

        if (cancelOperation == true) {
            shape.faces.splice(i, 1);
            i -= 1;
        }
        else {
            shape.faces[i].pointIndexes = pointIndexes;
            const colour = (<HTMLInputElement>document.getElementById(`colour${String(i)}`)!).value;
            shape.faces[i].colour = colour;
        }
    }
    updateDisplayShape();
    updateDOM();

    const [centeringXString, centeringYString, centeringZString] = [(<HTMLInputElement>document.getElementById("centeringX")!).value, (<HTMLInputElement>document.getElementById("centeringY")!).value, (<HTMLInputElement>document.getElementById("centeringZ")!).value];
    [centeringX, centeringY, centeringZ] = [Number(centeringXString), Number(centeringYString), Number(centeringZString)];   
}

const updateDisplayShape = () => {
    //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
    displayShape.pointMatrix = shape.pointMatrix.copy();
    displayShape.faces = shape.faces;
    displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
    displayShape.updateMatrices();
}

const updateDOM = () => { //updates the data from the shape, to display in the DOM
    const pointMatrixList = document.getElementById("pointMatrixList")!;
    pointMatrixList.innerText = ""; //clear the list
    for (let i = 0; i != shape.pointMatrix.width; i += 1)
    {
        const point = shape.pointMatrix.getColumn(i);
        const pointDiv = document.createElement('div');
        pointDiv.className = 'point';

        pointDiv.innerHTML = `
                <div class="centered">${String(i)}</div>
                <div class="centered"> X: <input type="text" name="pointX${String(i)}" style="width: 90%;" value="${point[0]}" id="point${String(i)}X"> </div>
                <div class="centered"> Y: <input type="text" name="pointY${String(i)}" style="width: 90%;" value="${point[1]}" id="point${String(i)}Y"> </div>
                <div class="centered"> Z: <input type="text" name="pointZ${String(i)}" style="width: 90%;" value="${point[2]}" id="point${String(i)}Z"> </div>
                <div class="centered"><input type="button" class="controlButton deleteStyle" id="DeletePoint${String(i)}" value="Delete Point" style="float: right;"></div>
        `;
        pointMatrixList.appendChild(pointDiv)
    }
    const pointControls = document.createElement('div');
    pointControls.className = "centered";
    pointControls.innerHTML = `
        <input type="button" class="controlButton" id="addPoint" value="Add Point">
        <input type="button" style="margin-left: 20px;" class="controlButton" id="pointCommands" value="Point Commands">
    `;
    pointMatrixList.appendChild(pointControls);


    const faceList = document.getElementById("faceList")!;
    faceList.innerText = "";
    for (let i = 0; i != shape.faces.length; i += 1)
    {
        const face = shape.faces[i];
        const faceDiv = document.createElement('div');
        faceDiv.className = "face";
        faceDiv.innerHTML= `
            <div class="centered"> ${String(i)} </div>
            <div class="centeredLeft"> Point Indexes: <input type="text" name="face${String(i)}" style="margin-left: 20px; width: 70%;" class="facePointIndexes" id="pointIndexes${String(i)}" value="${String(face.pointIndexes)}"> </div>
            <div class="centeredLeft"> Colour: <input type="color" style="width: 90%;" id="colour${String(i)}" value="${String(face.colour)}"></div>
            <div class="centeredLeft"><input type="button" class="controlButton deleteStyle" id="DeleteFace${String(i)}" value="Delete Face" style="float: right;"></div>
        `;

        faceList.appendChild(faceDiv);
    }
    const faceControls = document.createElement('div');
    faceControls.className = "centered";
    faceControls.innerHTML = `
        <input type="button" class="controlButton" id="addFace" value="Add Face">
        <input type="button" style="margin-left: 20px;" class="controlButton" id="faceCommands" value="Face Commands">
    `;
    faceList.appendChild(faceControls);

    startButtonListeners();
}

const generateExportCode = () => {
    const shapeName = (<HTMLInputElement>document.getElementById("shapeName")!).value || "NewShape";
    updateVariables();

    let pointMatrixPoints: number[][] = [];
    for (let i = 0; i != shape.pointMatrix.width; i += 1) {
        const point = shape.pointMatrix.getColumn(i); pointMatrixPoints.push(point)
    }

    const exportCode = 
`class ${shapeName} extends Shape {
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
}

const importShape = () => {
    let shapeCode = prompt("Copy and paste the shape's code here\nMake sure you haven't added a line break between any of the datasets:");
    if (shapeCode == undefined || shapeCode == "") { alert("Invalid Shape Code"); return; }
    shapeCode = shapeCode.replaceAll(" ", "");
    var lineArray = shapeCode.split(/\r?\n/);

    let points = [];
    let centeringVectors = [];
    let faces = [];
    let found = 0;

    //find lines which begin with, "constpoints=", "const[centeringX,centeringY,centeringZ]=", and "this.faces=", this is the data we need to construct the object
    //when it finds one, then split at '=', and get second element
    for (let i = 0; i != lineArray.length; i += 1)
    {
        const line = lineArray[i];
        if (line.startsWith("constpoints=")) {
            let pointsJSON = line.split("=")[1];
            if (pointsJSON.endsWith(";")) { pointsJSON = pointsJSON.slice(0, -1); }
            points = JSON.parse(pointsJSON);
            found += 1;
        }
        else if (line.startsWith("const[centeringX,centeringY,centeringZ]=")) {
            let centeringJSON = line.split("=")[1];
            if (centeringJSON.endsWith(";")) { centeringJSON = centeringJSON.slice(0, -1); }
            centeringVectors = JSON.parse(centeringJSON);
            found += 1;
        }
        else if (line.startsWith("this.faces=")) {
            let facesJSON = line.split("=")[1];
            if (facesJSON.endsWith(";")) { facesJSON = facesJSON.slice(0, -1); }
            facesJSON = facesJSON.replaceAll('pointIndexes', '"pointIndexes"');
            facesJSON = facesJSON.replaceAll('colour', '"colour"');
            faces = JSON.parse(facesJSON);
            found += 1;
        }
    }

    if (found != 3) { alert("Unable to find all required data"); return; }
    shape.pointMatrix = new matrix();
    for (let i = 0; i != points.length; i += 1)
    { shape.pointMatrix.addColumn(points[i]); }
    shape.faces = faces;
    [centeringX, centeringY, centeringZ] = centeringVectors;

    updateDisplayShape();
    updateDOM();
    (<HTMLInputElement>document.getElementById("centeringX")!).value = String(centeringX);
    (<HTMLInputElement>document.getElementById("centeringY")!).value = String(centeringY);
    (<HTMLInputElement>document.getElementById("centeringZ")!).value = String(centeringZ);
    document.getElementById("exportCodeTitle")!.innerText = "*Export Code:";
}

const startButtonListeners = () => {
    document.onkeydown = ($e) => {
        const key = $e.key.toLowerCase();
        if (key == "enter") { document.getElementById("exportCodeTitle")!.innerText = "*Export Code:"; updateVariables(); updateDisplayShape(); }
    }

    document.getElementById("uploadShape")!.onclick = () => {
        importShape();
    }

    document.getElementById("addPoint")!.onclick = () => {
        shape.pointMatrix.addColumn([0 - centeringX, 0 - centeringY, 0 - centeringZ]);
        updateDisplayShape();
        updateDOM();
    }
    for (let i = 0; i != shape.pointMatrix.width; i += 1)
    {
        document.getElementById(`DeletePoint${String(i)}`)!.onclick = () => {
            shape.pointMatrix.deleteColumn(i);
            //also need to check if there are any faces with this point, i = pointIndex
            let a = 0;
            while (a != shape.faces.length)
            {
                if (shape.faces[a]?.pointIndexes.includes(i) == true)
                { shape.faces.splice(a, 1); a -= 1; }
                else
                { a += 1 }
            }
            updateDisplayShape();
            updateDOM();
        }
    }
    document.getElementById("pointCommands")!.onclick = () => {
        const command = prompt("What command do you want to perform, enter a letter:\n    D: Duplicate Points\n    T: Translate Points")?.toLowerCase();
        if (command == undefined) { return; }

        if (command == "d") { duplicatePoints(); }
        else if ( command == "t" ) { translatePoints(); }
        else { alert("Invalid command"); return; }
    }

    document.getElementById("addFace")!.onclick = () => {
        if (shape.pointMatrix.width < 3) { alert("You need at least 3 points to construct a face"); return; }
        shape.faces.push( { pointIndexes: [0, 1, 2], colour: "#c4c4c4" } )
        updateDisplayShape();
        updateDOM();
        const lastPointIndexesTextinput: any = Array.from(document.querySelectorAll(".facePointIndexes")).pop(); 
        lastPointIndexesTextinput.focus();
    }
    for (let i = 0; i != shape.faces.length; i += 1)
    {
        document.getElementById(`DeleteFace${String(i)}`)!.onclick = () => {
            shape.faces.splice(i, 1);
            updateDisplayShape();
            updateDOM();
        }
    }
    document.getElementById("faceCommands")!.onclick = () => {
        const command = prompt("What command do you want to perform, enter a letter:\n    C: Colour Change")?.toLowerCase();
        if (command == undefined) { return; }

        if (command == "c") { changeFaceColours(); }
        else { alert("Invalid command"); return; }
    }

    document.getElementById("update")!.onclick = () => {
        document.getElementById("exportCodeTitle")!.innerText = "*Export Code:"
        updateVariables();
        updateDisplayShape();
    }

    document.getElementById("export")!.onclick = () => {
        updateVariables();
        document.getElementById("exportCodeTitle")!.innerText = "Export Code:"
        document.getElementById("exportCode")!.innerText = generateExportCode();
    }

    let faceTextFieldInFocusID: any = undefined;
    document.onclick = ($e) => {
        const clickedElement: any = document.activeElement;
        if (clickedElement.name?.startsWith("face")) //only interested if the user clicks a face textfield
        { faceTextFieldInFocusID = clickedElement.id; }
        else if ( $e.clientX < canvasWidth && $e.clientY < canvasHeight ) //don't change textFieldInFocus when user clicks the renderingWindow
        { document.getElementById(faceTextFieldInFocusID)?.focus(); } 
        else { faceTextFieldInFocusID = undefined; }

        return false;
    }

    document.getElementById("renderingWindow")!.onclick = ($e) => {        
        let clickedPoint = undefined;

        //we need to convert these click X and Y coordinates into the coordinates on the grid
        const gridX = $e.clientX - (canvasWidth / 2);
        const gridY = (canvasHeight / 2) - $e.clientY;
        
        //now we need to loop through the screenPoints, and check which points are within a certain radius of the click using X and Y coordinates (nearest 2 dp)
        const roundMultiple = 0.01; //making the points less accurate so that the user doesn't have to click exactly on the point, higher means user has to be more precise
        const gridXRounded = Math.round(gridX * roundMultiple) / roundMultiple;
        const gridYRounded = Math.round(gridY * roundMultiple) / roundMultiple;
        for (let i = 0; i != screenPoints.width; i += 1) {
            const point = screenPoints.getColumn(i);
            const pointXRounded = Math.round(point[0] * roundMultiple) / roundMultiple;
            const pointYRounded = Math.round(point[1] * roundMultiple) / roundMultiple;

            if (gridXRounded == pointXRounded && gridYRounded == pointYRounded) { clickedPoint = i; }
        }

        if (faceTextFieldInFocusID != undefined && clickedPoint != undefined) {
            const faceTextfield = <HTMLInputElement>document.getElementById(faceTextFieldInFocusID)!;
            if (faceTextfield.selectionStart == 0) { faceTextfield.value = `${clickedPoint}` }
            else if (faceTextfield.value.endsWith(",")) { faceTextfield.value = faceTextfield.value + ` ${clickedPoint}`; }
            else { faceTextfield.value = faceTextfield.value + `, ${clickedPoint}`; }
        }
    }
}

//Startup
(() => { //load default shape - triangle
    shape.pointMatrix.addColumn([0, 0, 0]);
    shape.pointMatrix.addColumn([100, 0, 0]);
    shape.pointMatrix.addColumn([50, 0, 100]);
    shape.pointMatrix.addColumn([50, 100, 50]);
    shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#ff0000"});
    shape.faces.push({ pointIndexes: [0, 1, 3], colour: "#ff9300"});
    shape.faces.push({ pointIndexes: [1, 2, 3], colour: "#00f900"});
    shape.faces.push({ pointIndexes: [2, 3, 0], colour: "#0433ff"});

    centeringX = 0;
    centeringY = 0;
    centeringZ = 0;
    (<HTMLInputElement>document.getElementById("centeringX")!).value = String(centeringX); //the centering values do not get updated in updateDOM();
    (<HTMLInputElement>document.getElementById("centeringY")!).value = String(centeringY);
    (<HTMLInputElement>document.getElementById("centeringZ")!).value = String(centeringZ);
})();
updateDOM();
updateDisplayShape();
document.getElementById("exportCode")!.innerText = generateExportCode();

//Animation Loop
let screenPoints: matrix = new matrix(); //always updated to have the current screen points, in correct order
setInterval(() => {
    clearCanvas();
    camera.renderGrid();
    screenPoints = camera.render([displayShape], true)[0].screenPoints; //camera now returns the sortedObjects, since we are only rendering 1 object we can always get [0]
}, 16)



























})();
//localScope();