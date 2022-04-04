"use strict";

const dpi = window.devicePixelRatio;
let canvas = undefined;
let c = undefined;
let canvasWidth = 0;
let canvasHeight = 0;
const linkCanvas = (canvasID) => {
    canvas = document.getElementById('renderingWindow');
    c = canvas.getContext('2d');
    canvasHeight = document.getElementById(canvasID).getBoundingClientRect().height; //Fix blury lines
    canvasWidth = document.getElementById(canvasID).getBoundingClientRect().width;
    canvas.setAttribute('height', String(canvasHeight * dpi));
    canvas.setAttribute('width', String(canvasWidth * dpi));
    window.onresize = () => { linkCanvas(canvasID); }; //just calling the function to initialise the canvas again
};
//ACTUAL DRAWING FUNCTIONS
const gridX = (x) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasWidth / 2) + x;
};
const gridY = (y) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasHeight / 2) - y;
};
const plotPoint = (p, colour, label) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    //point will be in format: [x, y]
    c.fillStyle = colour;
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
    if (label != undefined) {
        c.font = "20px Arial";
        c.fillText(label, gridX(p[0] * dpi) + 10, gridY(p[1] * dpi) + 10);
    }
};
const drawLine = (p1, p2, colour) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
};
const drawQuadrilateral = (p1, p2, p3, p4, colour) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.lineTo(gridX(p3[0] * dpi), gridY(p3[1] * dpi));
    c.lineTo(gridX(p4[0] * dpi), gridY(p4[1] * dpi));
    c.closePath();
    c.fill();
};
const clearCanvas = () => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
};

//MATRIX FUNCTIONS
class matrix {
    constructor() {
        /* The data will be stored like on the left, on the right is how the actual matrix will look if you wrote it in mathmatics
       [[1, 0],          [ [1   [0   [0
        [0, 1]      =       0],  1],  0] ]
        [0, 0]]
        */
        this.data = []; /* DO NOT SET THIS EXPLICITLY, USE THE FUNCTIONS */
        this.width = 0; //num of columns
        this.height = 0; //num of rows
    }
    addColumn(nums) {
        this.data.push(nums);
        this.height = nums.length;
        this.width += 1;
    }
    addRow(nums) {
        //to add a row you just need to add the given nums to the end of each column, we first need to check that nums == width
        if (nums.length != this.width) {
            console.error("Unable to add row since length of inputs is not equal to number of columns");
            return;
        }
        for (let i in nums) {
            this.data[i].push(nums[i]);
            i += 1;
        }
        this.height += 1;
    }
    printMatrix() {
        //loop through the rows, and inside of that loop, loop through all the columns
        let finalOutput = "Matrix:";
        let currentRow = 0;
        while (currentRow != this.height) {
            let currentLineOutput = "\n";
            let currentColumn = 0;
            while (currentColumn != this.width) {
                currentLineOutput = currentLineOutput + (this.data[currentColumn][currentRow]) + "      ";
                currentColumn += 1;
            }
            finalOutput = finalOutput + currentLineOutput;
            currentRow += 1;
        }
        console.log(finalOutput);
    }
    getColumn(columnIndex) { return this.data[columnIndex]; }
    getRow(rowIndex) {
        let returnArray = [];
        for (let i in this.data) {
            returnArray.push(this.data[i][rowIndex]);
        }
        return returnArray;
    }
    setValue(columnIndex, rowIndex, value) { this.data[columnIndex][rowIndex] = value; }
    getValue(columnIndex, rowIndex) { return this.data[columnIndex][rowIndex]; }
    scaleUp(factor) { for (let i in this.data) {
        for (let a in this.data[i]) {
            this.data[i][a] *= factor;
        }
    } }
    scaledUp(factor) {
        const returnMatrix = new matrix(); //create new matrix object, and scale it up
        for (let i = 0; i != this.width; i += 1) {
            const column = this.getColumn(i);
            const columnCopy = JSON.parse(JSON.stringify(column));
            returnMatrix.addColumn(columnCopy);
        }
        for (let i in returnMatrix.data) {
            for (let a in returnMatrix.data[i]) {
                returnMatrix.data[i][a] *= factor;
            }
        } //scale up
        return returnMatrix;
    }
    translateMatrix(x, y, z) {
        for (let i = 0; i != this.width; i += 1) {
            const column = this.getColumn(i);
            this.setValue(i, 0, column[0] + x);
            this.setValue(i, 1, column[1] + y);
            this.setValue(i, 2, column[2] + z);
        }
    }
    copy() {
        const copyMatrix = new matrix();
        for (let i = 0; i != this.width; i += 1) {
            const column = this.getColumn(i);
            const columnCopy = JSON.parse(JSON.stringify(column));
            copyMatrix.addColumn(columnCopy);
        }
        return copyMatrix;
    }
    ;
}
const multiplyMatrixs = (m1, m2) => {
    //check that m1.width == m2.height, the result matrix will be m1.height x m2.width
    //create result matrix:
    const resultMatrix = new matrix();
    const rMatrixHeight = m1.height;
    const rMatrixWidth = m2.width;
    for (let _ = 0; _ != rMatrixWidth; _ += 1) {
        const newColumn = [];
        for (let __ = 0; __ != rMatrixHeight; __ += 1) {
            newColumn.push(0);
        }
        resultMatrix.addColumn(newColumn);
    }
    //now loop through each element in the result matrix with the rowIndex and columnIndex, and calculate it
    let columnIndex = 0;
    while (columnIndex != resultMatrix.width) {
        let rowIndex = 0;
        while (rowIndex != resultMatrix.height) {
            //these 2 should be the same length
            const currentRow = m1.getRow(rowIndex);
            const currentColumn = m2.getColumn(columnIndex);
            let value = 0;
            let i = 0;
            while (i != currentRow.length) {
                value += currentRow[i] * currentColumn[i];
                i += 1;
            }
            resultMatrix.setValue(columnIndex, rowIndex, value);
            rowIndex += 1;
        }
        columnIndex += 1;
    }
    return resultMatrix;
};
const toRadians = (angle) => {
    return angle * (Math.PI / 180);
};
const sin = (num) => { return Math.sin(toRadians(num)); };
const cos = (num) => { return Math.cos(toRadians(num)); };
const distanceBetween = (p1, p2) => {
    //first use pythagoruses thoerm to get the bottom diagonal
    const bottomDiagonal = Math.sqrt(Math.pow((p2[0] - p1[0]), 2) + Math.pow((p2[2] - p1[2]), 2));
    const distance = Math.sqrt(Math.pow(bottomDiagonal, 2) + Math.pow((p2[1] - p1[1]), 2));
    return distance;
};

//WHEN DOING OTHER SHAPES I FOUND THIS QUESTIONS: https://math.stackexchange.com/questions/3635017/calculate-edge-and-plane-of-a-box-given-its-vertices
//RESEARCH ABOUT PAIRWISE DOT PRODUCTS, IT MAY HELP WHEN DEALING WITH THINGS LIKE PRISMS AND OTHER SHAPES
class Box {
    constructor(width, height, depth) {
        this.pointMatrix = new matrix(); //Positions of points without any rotation transformations applied to them
        this.edges = []; //pairs of indexes of vertices which are edges of the shape
        this.diagonals = []; //pairs of indexes of vertices which are diagonals
        this.faces = [];
        this.faceColours = {};
        this.dimensions = { width: 5, height: 5, depth: 5 };
        this.scale = 1;
        this.position = { x: 0, y: 0, z: 0 };
        //we need to define our transformation/rotation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
        //      x, y  (Physical grid)
        this.iHat = [1, 0, 0];
        this.jHat = [0, 1, 0];
        this.kHat = [0, 0, 1];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.rotationMatrix = new matrix(); //multiply this by the pointMatrix to get the actual positions of the points on the pseudo grid (physical points)
        this.physicalMatrix = new matrix(); //the physical points that we plot on the screen
        this.dimensions.width = width;
        this.dimensions.height = height;
        this.dimensions.depth = depth;
        //You are given the dimensions of the box, so we don't need to individually calculate the edges and planes
        //we can just put the vertices of the box in a specific order so that we know which pairs are diagonals and which pairs are edges
        //since it is a box we can be sure that there will always be 12 edges, 8 vertices, and 6 planes
        this.edges = [{ p1Index: 0, p2Index: 1 }, { p1Index: 1, p2Index: 2 }, { p1Index: 2, p2Index: 3 }, { p1Index: 3, p2Index: 0 }, { p1Index: 0, p2Index: 4 }, { p1Index: 1, p2Index: 5 }, { p1Index: 2, p2Index: 6 }, { p1Index: 3, p2Index: 7 }, { p1Index: 4, p2Index: 5 }, { p1Index: 5, p2Index: 6 }, { p1Index: 6, p2Index: 7 }, { p1Index: 7, p2Index: 4 }];
        this.diagonals = [{ p1Index: 0, p2Index: 2 }, { p1Index: 0, p2Index: 5 }, { p1Index: 0, p2Index: 7 }, { p1Index: 6, p2Index: 1 }, { p1Index: 6, p2Index: 3 }, { p1Index: 6, p2Index: 4 }];
        this.diagonals.push({ p1Index: 1, p2Index: 3 }, { p1Index: 1, p2Index: 4 }, { p1Index: 3, p2Index: 4 }, { p1Index: 2, p2Index: 5 }, { p1Index: 2, p2Index: 7 }, { p1Index: 5, p2Index: 7 });
        this.faces = [
            { diagonal1: this.diagonals[0], diagonal2: this.diagonals[0 + 6], facingAxis: "-z", center: [0, 0, 0] },
            { diagonal1: this.diagonals[1], diagonal2: this.diagonals[1 + 6], facingAxis: "-y", center: [0, 0, 0] },
            { diagonal1: this.diagonals[2], diagonal2: this.diagonals[2 + 6], facingAxis: "-x", center: [0, 0, 0] },
            { diagonal1: this.diagonals[3], diagonal2: this.diagonals[3 + 6], facingAxis: "+x", center: [0, 0, 0] },
            { diagonal1: this.diagonals[4], diagonal2: this.diagonals[4 + 6], facingAxis: "+y", center: [0, 0, 0] },
            { diagonal1: this.diagonals[5], diagonal2: this.diagonals[5 + 6], facingAxis: "+z", center: [0, 0, 0] }
        ];
        //- / + refers to the direction it is pointing in, for example -z means it is pointing towards the camera at default rotations
        this.faceColours = {
            "-z": "#ff0000",
            "-y": "#00ff00",
            "-x": "#0000ff",
            "+x": "#ffff00",
            "+y": "#00ffff",
            "+z": "#ff00ff",
        };
        //This is what the default rotation is when all rotations are set to 0
        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)
        this.updateMatrices();
    }
    updatePointMatrix() {
        //update the point matrix here
        const width = this.dimensions.width;
        const height = this.dimensions.height;
        const depth = this.dimensions.depth;
        //Populate the pointMatrix, offsets are so that the shape rotates around it's center rather than the first point
        const centeringX = -(width / 2);
        const centeringY = -(height / 2);
        const centeringZ = -(depth / 2); //this doesn't really matter since the z-axis can't get rendered anyway
        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0 + centeringX, 0 + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([width + centeringX, 0 + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([width + centeringX, height + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([0 + centeringX, height + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([0 + centeringX, 0 + centeringY, depth + centeringZ]);
        this.pointMatrix.addColumn([width + centeringX, 0 + centeringY, depth + centeringZ]);
        this.pointMatrix.addColumn([width + centeringX, height + centeringY, depth + centeringZ]);
        this.pointMatrix.addColumn([0 + centeringX, height + centeringY, depth + centeringZ]);
    }
    updateRotationMatrix() {
        const rX = this.rotation.x % 360;
        const rY = this.rotation.y % 360;
        const rZ = this.rotation.z % 360;
        //XYZ Euler rotation
        //Source: https://support.zemax.com/hc/en-us/articles/1500005576822-Rotation-Matrix-and-Tilt-About-X-Y-Z-in-OpticStudio
        //x-axis (iHat)
        this.iHat[0] = cos(rY) * cos(rZ);
        this.iHat[1] = cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ);
        this.iHat[2] = sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ);
        //y-axis (jHat)
        this.jHat[0] = -(cos(rY)) * sin(rZ);
        this.jHat[1] = cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ);
        this.jHat[2] = sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ);
        //z-axis (kHat)
        this.kHat[0] = sin(rY);
        this.kHat[1] = -(sin(rX)) * cos(rY);
        this.kHat[2] = cos(rX) * cos(rY);
        //Set the unit vectors onto the singular rotation matrix
        this.rotationMatrix.setValue(0, 0, this.iHat[0]);
        this.rotationMatrix.setValue(0, 1, this.iHat[1]);
        this.rotationMatrix.setValue(0, 2, this.iHat[2]);
        this.rotationMatrix.setValue(1, 0, this.jHat[0]);
        this.rotationMatrix.setValue(1, 1, this.jHat[1]);
        this.rotationMatrix.setValue(1, 2, this.jHat[2]);
        this.rotationMatrix.setValue(2, 0, this.kHat[0]);
        this.rotationMatrix.setValue(2, 1, this.kHat[1]);
        this.rotationMatrix.setValue(2, 2, this.kHat[2]);
    }
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
        //this will still be around the origin, the positions are set when rendering the object in the camera
    }
    updateMatrices() {
        this.updatePointMatrix();
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}

class Camera {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.zoom = 1;
        this.worldRotation = { x: 0, y: 0, z: 0 };
        this.worldRotationMatrix = new matrix();
        this.worldRotationMatrix.addColumn([1, 0, 0]);
        this.worldRotationMatrix.addColumn([0, 1, 0]);
        this.worldRotationMatrix.addColumn([0, 0, 1]);
        this.updateRotationMatrix();
    }
    render(box, outline) {
        //CALCULATING OBJECT'S POSITION ON THE 2D SCREEN:
        //The box's physicalMatrix tells us how where the point on the box are located relative to the origin, but we still need to position it
        //You cannot physically move the camera, since the user sees through it through their screen, so you have to move the objects in the opposite direction to the camera
        let cameraObjectMatrix = box.physicalMatrix.copy();
        cameraObjectMatrix.scaleUp(this.zoom); //scale first to prevent it from affecting other translations, however this means it is not a real zoom, instead just looks like you are englarging objects
        cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation
        const gridMiddle = { x: -(this.position.x), y: -(this.position.y), z: 0 };
        //we set the object's position based on the difference between it and the grid (which is calculated with the camera)
        //the position would be the gridMiddle + object's position, but we need to get the translation from the origin (that is where the object would be located now), these are the positions in the absolute 3D World, so they can also be considered translations from origin
        const objectPositionX = gridMiddle.x + box.position.x;
        const objectPositionY = gridMiddle.y + box.position.y;
        const objectPositionZ = gridMiddle.z + box.position.z;
        //however since those are the positions in the 3D, we need to find the vector of gridMiddle -> Object, transform that with the rotation matrix, and then translate it by that instead
        const distanceX = objectPositionX - gridMiddle.x;
        const distanceY = objectPositionY - gridMiddle.y;
        const distanceZ = objectPositionZ - gridMiddle.z;
        let gridMiddleObjectVectorMatrix = new matrix();
        gridMiddleObjectVectorMatrix.addColumn([distanceX, distanceY, distanceZ]);
        gridMiddleObjectVectorMatrix = multiplyMatrixs(this.worldRotationMatrix, gridMiddleObjectVectorMatrix);
        gridMiddleObjectVectorMatrix.scaleUp(this.zoom); //need to add zoom before we translate it to avoid the shape from rotating around the wrong point
        //now we have the translation vector from the gridMiddle, but we want it from the origin of the screen, so we just need to translate it by the gridMiddle
        gridMiddleObjectVectorMatrix.translateMatrix(gridMiddle.x, gridMiddle.y, gridMiddle.z);
        const translationVector = gridMiddleObjectVectorMatrix.getColumn(0);
        cameraObjectMatrix.translateMatrix(translationVector[0], translationVector[1], translationVector[2]);
        //ACTUALLY RENDERING THE OBJECT:
        //calculate the centers of the faces
        for (let i = 0; i != box.faces.length; i += 1) {
            //we can just calculate the midpoint of one of the diagonals, since that is where it should cross
            const point1 = cameraObjectMatrix.getColumn(box.faces[i].diagonal1.p1Index);
            const point2 = cameraObjectMatrix.getColumn(box.faces[i].diagonal1.p2Index);
            const averageX = (point1[0] + point2[0]) / 2;
            const averageY = (point1[1] + point2[1]) / 2;
            const averageZ = (point1[2] + point2[2]) / 2;
            box.faces[i].center = [averageX, averageY, averageZ];
        }
        //if we use the cameraObjectMatrix, then the camera is actually located at 0, 0, 0, so we will sort out faces based on their distance to the origin
        //however I need to use a z-axis of -50000, in order make the differences between object's insignificant
        const positionPoint = [0, 0, -50000];
        let sortedFaces = [];
        const facesCopy = JSON.parse(JSON.stringify(box.faces));
        while (facesCopy.length != 0) {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != facesCopy.length; i += 1) {
                if (distanceBetween(positionPoint, facesCopy[i].center) > distanceBetween(positionPoint, facesCopy[furthestDistanceIndex].center)) {
                    furthestDistanceIndex = i;
                }
            }
            sortedFaces.push(facesCopy[furthestDistanceIndex]);
            facesCopy.splice(furthestDistanceIndex, 1);
        }
        //TODO: To minimize overlapping of faces, I can calculate which faces are facing the camera, then just hide the ones which arent
        //and finally we can draw the faces with the box's faces object
        for (let i = 0; i != sortedFaces.length; i += 1) {
            const point1 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p1Index);
            const point2 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p1Index);
            const point3 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal1.p2Index);
            const point4 = cameraObjectMatrix.getColumn(sortedFaces[i].diagonal2.p2Index);
            const facingAxis = sortedFaces[i].facingAxis;
            let colour = box.faceColours[facingAxis];
            if (colour == "") {
                continue;
            }
            drawQuadrilateral(point1, point2, point3, point4, colour);
        }
        if (outline == true) {
            //use the object's edges, with the physicalMatrix, to draw the edges of the box
            for (let i = 0; i != box.edges.length; i += 1) {
                const point1 = cameraObjectMatrix.getColumn(box.edges[i].p1Index);
                const point2 = cameraObjectMatrix.getColumn(box.edges[i].p2Index);
                drawLine(point1, point2, "#606060");
            }
        }
    }
    updateRotationMatrix() {
        const rX = this.worldRotation.x % 360;
        const rY = this.worldRotation.y % 360;
        const rZ = this.worldRotation.z % 360;
        const worldiHat = [1, 0, 0];
        const worldjHat = [0, 1, 0];
        const worldkHat = [0, 0, 1];
        worldiHat[0] = cos(rY) * cos(rZ);
        worldiHat[1] = cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ);
        worldiHat[2] = sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ);
        worldjHat[0] = -(cos(rY)) * sin(rZ);
        worldjHat[1] = cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ);
        worldjHat[2] = sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ);
        worldkHat[0] = sin(rY);
        worldkHat[1] = -(sin(rX)) * cos(rY);
        worldkHat[2] = cos(rX) * cos(rY);
        this.worldRotationMatrix.setValue(0, 0, worldiHat[0]);
        this.worldRotationMatrix.setValue(0, 1, worldiHat[1]);
        this.worldRotationMatrix.setValue(0, 2, worldiHat[2]);
        this.worldRotationMatrix.setValue(1, 0, worldjHat[0]);
        this.worldRotationMatrix.setValue(1, 1, worldjHat[1]);
        this.worldRotationMatrix.setValue(1, 2, worldjHat[2]);
        this.worldRotationMatrix.setValue(2, 0, worldkHat[0]);
        this.worldRotationMatrix.setValue(2, 1, worldkHat[1]);
        this.worldRotationMatrix.setValue(2, 2, worldkHat[2]);
    }
    renderGrid() {
        const gridLength = 500 * this.zoom;
        //create 2 points for each axis, then transform them using the worldRotationMatrix, then just plot them
        let startPointMatrix = new matrix();
        startPointMatrix.addColumn([-gridLength, 0, 0]); //x-axis
        startPointMatrix.addColumn([0, -gridLength, 0]); //y-axis
        startPointMatrix.addColumn([0, 0, -gridLength]); //z-axis
        let endPointMatrix = new matrix();
        endPointMatrix.addColumn([gridLength, 0, 0]);
        endPointMatrix.addColumn([0, gridLength, 0]);
        endPointMatrix.addColumn([0, 0, gridLength]);
        startPointMatrix = multiplyMatrixs(this.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(this.worldRotationMatrix, endPointMatrix);
        //we also want to offset this grid by the camera's position
        startPointMatrix.translateMatrix(-this.position.x, -this.position.y, 0);
        endPointMatrix.translateMatrix(-this.position.x, -this.position.y, 0);
        /*
        const point1 = startPointMatrix.getColumn(0);
        const point2 = endPointMatrix.getColumn(0);
        const avX = (point1[0] + point2[0]) / 2;
        const avY = (point1[1] + point2[1]) / 2;
        const avZ = (point1[2] + point2[2]) / 2;
        const gridMiddle = { x: avX, y: avY, z: avZ }; //this is the middle of the grid
        */
        for (let i = 0; i != startPointMatrix.width; i += 1) {
            const point1 = startPointMatrix.getColumn(i);
            const point2 = endPointMatrix.getColumn(i);
            drawLine(point1, point2, "#000000");
        }
    }
    ;
}
