const localScope = () => {

linkCanvas("renderingWindow");
const camera = new Camera();
camera.enableMovementControls("renderingWindow", true, false, true);

const shape = new Shape();
const loadDefaultShape = () => {
    shape.pointMatrix.addColumn([0, 0, 0]);
    shape.pointMatrix.addColumn([100, 0, 0]);
    shape.pointMatrix.addColumn([50, 0, 100]);
    shape.pointMatrix.addColumn([50, 100, 50]);
    shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#ff0000"});
    shape.faces.push({ pointIndexes: [0, 1, 3], colour: "#ff9300"});
    shape.faces.push({ pointIndexes: [1, 2, 3], colour: "#00f900"});
    shape.faces.push({ pointIndexes: [2, 3, 0], colour: "#0433ff"});
    shape.updateMatrices();
}
const displayShape = new Shape();
displayShape.showOutline = true;

let centeringX = 0;
let centeringY = 0;
let centeringZ = 0;

const updatePoints = () => { //takes data from DOM, and saves it to the shape.pointMatrix
    //get data from existing points, can just use the indexes from the point matrix, and update the values
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
    shape.updateMatrices();
};
const updateFaces = () => { //takes data from DOM, and saves it to the shape.faces
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
    shape.updateMatrices();
    updateDOM();
};

const updateCentering = () => {
    const [centeringXString, centeringYString, centeringZString] = [(<HTMLInputElement>document.getElementById("centeringX")!).value, (<HTMLInputElement>document.getElementById("centeringY")!).value, (<HTMLInputElement>document.getElementById("centeringZ")!).value];
    [centeringX, centeringY, centeringZ] = [Number(centeringXString), Number(centeringYString), Number(centeringZString)];   
}

const updateAll = () => {
    updatePoints()
    updateFaces()

    displayShape.pointMatrix = shape.pointMatrix.copy();
    displayShape.faces = shape.faces;

    updateCentering(); //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
    displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
    displayShape.updateMatrices();

    //changes should be handled by animation loop
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
                <div class="centered"> X: <input type="text" style="width: 90%;" value="${point[0]}" id="point${String(i)}X"> </div>
                <div class="centered"> Y: <input type="text" style="width: 90%;" value="${point[1]}" id="point${String(i)}Y"> </div>
                <div class="centered"> Z: <input type="text" style="width: 90%;" value="${point[2]}" id="point${String(i)}Z"> </div>
                <div class="centered"><input type="button" class="controlButton deleteStyle" id="DeletePoint${String(i)}" value="Delete Point" style="float: right;"></div>
        `;
        pointMatrixList.appendChild(pointDiv)
    }
    const pointControls = document.createElement('div');
    pointControls.className = "centered";
    pointControls.innerHTML = `
        <input type="button" class="controlButton" id="addPoint" value="Add Point">
        <input type="button" style="margin-left: 20px;" class="controlButton" id="duplicatePoints" value="Duplicate Points">
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
}

const generateExportCode = () => {
    const shapeName = (<HTMLInputElement>document.getElementById("shapeName")!).value || "NewShape";

    let pointMatrixPoints: number[][] = [];
    for (let i = 0; i != shape.pointMatrix.width; i += 1)
    {
        const point = shape.pointMatrix.getColumn(i);
        pointMatrixPoints.push(point)
    }

    updateCentering();

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

const startButtonListeners = () => {
    document.onkeydown = ($e) => {
        const key = $e.key.toLowerCase();
        if (key == "enter") { document.getElementById("exportCodeTitle")!.innerText = "*Export Code:"; updateAll(); }
    }

    document.getElementById("addPoint")!.onclick = () => {
        shape.pointMatrix.addColumn([0, 0, 0]);
        shape.updateMatrices();
        updateDOM();
    }
    for (let i = 0; i != shape.pointMatrix.width; i += 1)
    {
        document.getElementById(`DeletePoint${String(i)}`)!.onclick = () => {
            shape.pointMatrix.deleteColumn(i);
            //also need to check if there are any faces with this point
            for (let i = 0; i != shape.faces.length; i += 1)
            {
                if (shape.faces[i].pointIndexes.includes(i) == true)
                { shape.faces.splice(i, 1); i -= 1; }
            }
            shape.updateMatrices();
            updateDOM();
            updateAll();
        }
    }
    document.getElementById("duplicatePoints")!.onclick = () => {
        const pointIndexesToDupList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
        if (pointIndexesToDupList == undefined || pointIndexesToDupList == "") { return; }
        const pointIndexesToDup = pointIndexesToDupList.split(",").map(Number);

        const pointMatrixWidth = shape.pointMatrix.width;
        for (let i = 0; i != pointIndexesToDup.length; i += 1)
        { if (pointIndexesToDup[i] > pointMatrixWidth - 1) { alert("One or more of indexes was not a valid pooint index"); return; } }

        const changeAxis = prompt("Which axis do you want to change")?.toLowerCase();
        if (changeAxis == undefined) { alert("Invalid Axis"); return; }
        if (!(changeAxis == "x" || changeAxis == "y" || changeAxis == "z")) { alert("Invalid Axis"); return; }

        const changeTo = Number(prompt(`What do you want to change the ${changeAxis} to: `))
        if (changeTo == undefined) { alert("Invalid number"); return; }

        const newPoints: number[][] = [];
        for (let i = 0; i != pointIndexesToDup.length; i += 1) {
            const point = JSON.parse(JSON.stringify(shape.pointMatrix.getColumn(pointIndexesToDup[i])));
            if (changeAxis == "x") { point[0] = changeTo - centeringX; }
            else if (changeAxis == "y") { point[1] = changeTo - centeringY; }
            else if (changeAxis == "z") { point[2] = changeTo - centeringZ; }
            newPoints.push(point);
        }

        for (let i = 0; i != newPoints.length; i += 1)
        { shape.pointMatrix.addColumn(newPoints[i]); }

        updateDOM();
        updateAll();
    }

    document.getElementById("addFace")!.onclick = () => {
        if (shape.pointMatrix.width < 3) { alert("You need at least 3 points to construct a face"); return; }
        shape.faces.push( { pointIndexes: [0, 1, 2], colour: "#c4c4c4" } )
        shape.updateMatrices();
        updateDOM();
    }
    for (let i = 0; i != shape.faces.length; i += 1)
    {
        document.getElementById(`DeleteFace${String(i)}`)!.onclick = () => {
            shape.faces.splice(i, 1);
            shape.updateMatrices();
            updateDOM();
        }
    }

    document.getElementById("update")!.onclick = () => {
        document.getElementById("exportCodeTitle")!.innerText = "*Export Code:"
        updateAll();
    }

    document.getElementById("export")!.onclick = () => {
        updateAll();
        document.getElementById("exportCodeTitle")!.innerText = "Export Code:"
        document.getElementById("exportCode")!.innerText = generateExportCode();
    }
}

//Startup
loadDefaultShape();
updateDOM();
updateAll();
document.getElementById("exportCode")!.innerText = generateExportCode();

//Animation Loop
setInterval(() => {
    clearCanvas();
    camera.renderGrid();
    camera.render([displayShape], true);
}, 16)



























};
localScope();