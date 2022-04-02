"use strict";
//TO ENABLE AUTO RELOAD, RUN LIVE-SERVER, AND CLICK CMD+SHIFT+B, THEN CLICK WATCH TSC: WATCH
const dpi = window.devicePixelRatio;
const canvas = document.getElementById('renderingWindow');
const c = canvas.getContext('2d');
const canvasHeight = document.getElementById('renderingWindow').getBoundingClientRect().height; //Fix blury lines
const canvasWidth = document.getElementById('renderingWindow').getBoundingClientRect().width;
canvas.setAttribute('height', String(canvasHeight * dpi));
canvas.setAttribute('width', String(canvasWidth * dpi));
//ACTUAL DRAWING FUNCTIONS
const gridX = (x) => {
    return (canvasWidth / 2) + x;
};
const gridY = (y) => {
    return (canvasHeight / 2) - y;
};
const plotPoint = (p, colour, label) => {
    //point will be in format: [x, y]
    c.fillStyle = colour;
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
    if (label != undefined) {
        c.font = "20px Arial";
        c.fillText(label, gridX(p[0] * dpi) + 10, gridY(p[1] * dpi) + 10);
    }
};
const drawLine = (p1, p2, colour) => {
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
};
const drawQuadrilateral = (p1, p2, p3, p4, colour) => {
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
        this.diagonals = []; //pairs of indexes of vertices which are diagonals
        this.faces = [];
        this.edges = []; //pairs of indexes of vertices which are edges of the shape
        //we need to define our transformation/rotation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
        //      x, y  (Physical grid)
        this.iHat = [1, 0, 0];
        this.jHat = [0, 1, 0];
        this.kHat = [0, 0, 1];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.rotationMatrix = new matrix(); //multiply this by the pointMatrix to get the actual positions of the points on the pseudo grid (physical points)
        this.physicalMatrix = new matrix(); //the physical points that we plot on the screen
        //Populate the pointMatrix, offsets are so that the shape rotates around it's center rather than the first point
        const offsetX = -(width / 2);
        const offsetY = -(height / 2);
        const offsetZ = -(depth / 2); //this doesn't really matter since the z-axis can't get rendered anyway
        this.pointMatrix.addColumn([0 + offsetX, 0 + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, 0 + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, height + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([0 + offsetX, height + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([0 + offsetX, 0 + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, 0 + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, height + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([0 + offsetX, height + offsetY, depth + offsetZ]);
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
        //This is what the default rotation is when all rotations are set to 0
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)
        this.updateMatrices();
    }
    updateRotationMatrix() {
        const rotationX = this.rotation.x % 360;
        const rotationY = this.rotation.y % 360;
        const rotationZ = this.rotation.z % 360;
        //Source: http://eecs.qmul.ac.uk/~gslabaugh/publications/euler.pdf
        //Using the ZYX Euler angle rotation matrix
        //What I want:
        //Given rotationX: 0, rotationY: -90, rotationZ: 0
        //iHat = [0, 0, 1]
        //jHat = [0, 1, 0]
        //kHat = [-1, 0, 0]
        //x-axis (iHat)
        this.iHat[0] = Math.cos(toRadians(rotationY)) * Math.cos(toRadians(rotationZ));
        this.iHat[1] = Math.cos(toRadians(rotationY)) * Math.sin(toRadians(rotationZ));
        this.iHat[2] = -(Math.sin(toRadians(rotationY)));
        //y-axis (jHat)
        this.jHat[0] = Math.sin(toRadians(rotationX)) * Math.sin(toRadians(rotationY)) * Math.cos(toRadians(rotationZ)) - Math.cos(toRadians(rotationX)) * Math.sin(toRadians(rotationZ));
        this.jHat[1] = Math.sin(toRadians(rotationX)) * Math.sin(toRadians(rotationY)) * Math.sin(toRadians(rotationZ)) + Math.cos(toRadians(rotationX)) * Math.cos(toRadians(rotationZ));
        this.jHat[2] = Math.sin(toRadians(rotationX) * Math.cos(toRadians(rotationY)));
        //z-axis (kHat)
        this.kHat[0] = Math.cos(toRadians(rotationX)) * Math.sin(toRadians(rotationY)) * Math.cos(toRadians(rotationZ)) + Math.sin(toRadians(rotationX)) * Math.sin(toRadians(rotationZ));
        this.kHat[1] = Math.cos(toRadians(rotationX)) * Math.sin(toRadians(rotationY)) * Math.sin(toRadians(rotationZ)) - Math.sin(toRadians(rotationX)) * Math.cos(toRadians(rotationZ));
        this.kHat[2] = Math.cos(toRadians(rotationX)) * Math.round(Math.cos(toRadians(rotationY))); //THE MISSING BRACKET
        //Set the unit vectors onto the singular rotation matrix
        this.rotationMatrix.setValue(0, 0, this.iHat[0]);
        this.rotationMatrix.setValue(0, 1, this.iHat[1]);
        this.rotationMatrix.setValue(0, 2, this.iHat[2]);
        this.rotationMatrix.setValue(1, 0, this.jHat[0]);
        this.rotationMatrix.setValue(1, 1, this.jHat[1]);
        this.rotationMatrix.setValue(1, 2, this.jHat[2]);
        this.rotationMatrix.setValue(2, 0, this.kHat[0]); //FOR SOME REASON THE KHAT IS ROTATING AROUND THE WRONG AXIS
        this.rotationMatrix.setValue(2, 1, this.kHat[1]);
        this.rotationMatrix.setValue(2, 2, this.kHat[2]);
    }
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(camera.scale);
    }
    updateMatrices() {
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}
class Camera {
    constructor() {
        this.scale = 1;
        this.position = [0, 0, 0];
    }
    render(box) {
        //the first thing to do is to calculate the centers of the faces
        for (let i = 0; i != box.faces.length; i += 1) {
            //we can just calculate the midpoint of one of the diagonals, since that is where it should cross
            const point1 = box.physicalMatrix.getColumn(box.faces[i].diagonal1.p1Index);
            const point2 = box.physicalMatrix.getColumn(box.faces[i].diagonal1.p2Index);
            const averageX = (point1[0] + point2[0]) / 2;
            const averageY = (point1[1] + point2[1]) / 2;
            const averageZ = (point1[2] + point2[2]) / 2;
            box.faces[i].center = [averageX, averageY, averageZ];
        }
        //sort faces based on distance to camera from center (Not entirely accurate, not sure how to fix), so the furthest away get rendered first
        let sortedFaces = [];
        const facesCopy = JSON.parse(JSON.stringify(box.faces));
        while (facesCopy.length != 0) {
            let furthestDistanceIndex = 0;
            for (let i = 0; i != facesCopy.length; i += 1) {
                if (distanceBetween(this.position, facesCopy[i].center) > distanceBetween(this.position, facesCopy[furthestDistanceIndex].center)) {
                    furthestDistanceIndex = i;
                }
            }
            sortedFaces.push(facesCopy[furthestDistanceIndex]);
            facesCopy.splice(furthestDistanceIndex, 1);
        }
        //and finally we can draw the faces with the box's faces object
        for (let i = 0; i != sortedFaces.length; i += 1) {
            const point1 = box.physicalMatrix.getColumn(sortedFaces[i].diagonal1.p1Index);
            const point2 = box.physicalMatrix.getColumn(sortedFaces[i].diagonal2.p1Index);
            const point3 = box.physicalMatrix.getColumn(sortedFaces[i].diagonal1.p2Index);
            const point4 = box.physicalMatrix.getColumn(sortedFaces[i].diagonal2.p2Index);
            const distanceToCamera = Math.round(distanceBetween(this.position, sortedFaces[i].center));
            const centerRounded = [Math.round(sortedFaces[i].center[0]), Math.round(sortedFaces[i].center[1]), Math.round(sortedFaces[i].center[2])];
            //plotPoint(sortedFaces[i].center, "#000000", `Rendered: ${i} CenterZ: ${centerRounded[2]}`); //plotting a point in the center of the face and including the order of which the faces were rendered
            const facingAxis = sortedFaces[i].facingAxis;
            let colour = "";
            continue; //delete this once i have fixed rotation matrix
            drawQuadrilateral(point1, point2, point3, point4, colour);
        }
        //use the object's physicalMatrix, and just plot the points, the physicalMatrix will actually contain 3 rows, but the third one is the z-axis, so we just ignore it
        for (let i = 0; i != box.physicalMatrix.width; i += 1) {
            const point = box.physicalMatrix.getColumn(i);
            const pointRounded = [Math.round(point[0]), Math.round(point[1]), Math.round(point[2])];
            plotPoint(point, "#000000", String(i + 1) + ": " + String(pointRounded));
        }
        /*
        //can also use the object's edges, with the physicalMatrix, to draw the edges of the box
        for (let i = 0; i != box.edges.length; i += 1) {
            const point1 = box.physicalMatrix.getColumn(box.edges[i].p1Index);
            const point2 = box.physicalMatrix.getColumn(box.edges[i].p2Index);
            drawLine(point1, point2, "#606060");
        }
        */
    }
    ;
}
//RENDERING AN OBJECT
const camera = new Camera();
camera.position = [0, 0, -500];
camera.scale = 200;
//create our cube matrix (Pseudo Grid)
const cube = new Box(2, 1, 1);
cube.rotation.x = 0;
cube.rotation.y = -90;
cube.rotation.z = 0;
camera.render(cube);
let stopped = true;
let rotationInterval = 1;
const interval = setInterval(() => {
    if (stopped == true) {
        return;
    }
    cube.rotation.y += rotationInterval;
    cube.updateMatrices();
    clearCanvas();
    camera.render(cube);
}, 16);
document.onkeydown = ($e) => {
    if ($e.key == " ") {
        stopped = true;
        cube.physicalMatrix.printMatrix();
        console.log(cube.faces);
    }
    else {
        stopped = false;
    }
};
