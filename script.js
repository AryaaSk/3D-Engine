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
const drawLine = (p1, p2) => {
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
};
const plotPoint = (p) => {
    //point will be in format: [x, y]
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
};
//MATRIX FUNCTIONS
class matrix {
    /* The data will be stored like on the left, on the right is how the actual matrix will look if you wrote it in mathmatics
   [[1, 0],          [ [1   [0   [0
    [0, 1]      =       0],  1],  0] ]
    [0, 0]]
    */
    data = []; /* DO NOT SET THIS EXPLICITLY, USE THE FUNCTIONS */
    width = 0; //num of columns
    height = 0; //num of rows
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
    constructor() { }
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
            const currentRow = m1.getRow(rowIndex);
            const currentColumn = m2.getColumn(columnIndex); //these 2 should be the same length
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
//RENDERING AN OBJECT
//first we need to define our transformation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
//            x, y  (Physical grid)
const iHat = [1, 0];
const jHat = [0, 0.7];
const kHat = [0, 0.3];
const tMatrix = new matrix(); //transformation matrix, cube pointing slightly forward
tMatrix.addColumn(iHat);
tMatrix.addColumn(jHat);
tMatrix.addColumn(kHat);
//create our cube matrix (Pseudo Grid)
const cubeMatrix = new matrix();
cubeMatrix.addColumn([0, 0, 0]);
cubeMatrix.addColumn([1, 0, 0]);
cubeMatrix.addColumn([1, 1, 0]);
cubeMatrix.addColumn([0, 1, 0]);
cubeMatrix.addColumn([0, 0, 1]);
cubeMatrix.addColumn([1, 0, 1]);
cubeMatrix.addColumn([1, 1, 1]);
cubeMatrix.addColumn([0, 1, 1]);
//tMatrix.printMatrix();
//cubeMatrix.printMatrix();
//By multiplying the tMatrix and cubeMatrix, you get the coordinates of the cube on the physical graph
const rMatrix = multiplyMatrixs(tMatrix, cubeMatrix);
//rMatrix.printMatrix();
//loop through the columns, and plot the points with the scale transformation applied to them
const scale = 100;
for (let i = 0; i != rMatrix.width; i += 1) {
    const points = rMatrix.getColumn(i);
    points[0] = points[0] * scale;
    points[1] = points[1] * scale;
    plotPoint(points);
}
/*
//DEFINE OUR HAT VECTORS (X, Y, Z)
//The hat vector is in the form [x, y], the physical direction is it pointing on the graph
const xHat = [-1, -1]
const yHat = [1, -1]
const zHat = [0, 1] //the zHat is pointing backwards so it wouldn't show any thing on the graph

const transformationMatrix = [
    [xHat[0], yHat[0], zHat[0]],
    [xHat[1], yHat[1], zHat[1]]
//      x        y        z
]


//now lets create a basic 1 x 1 x 1 cube
//Points are in form of [x, y, z], which is their position on the grid, we can consider this entire object 1 matrix if you flip it to its right
const cubeVertexs = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],

    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1],
]
//To render this onto the page we just need to multiply each axis in each point, by the corresponding hat, and it should give us the correct position on the graph

//Or we could multiply the transformation matrix by the cube matrix: [ x 3] * [3 x 8]
const cubeVertexsMatrix = [ //flipping the above onto it's left to actually create the matrix
    [0, 1, 1, 0,    0, 1, 1, 0], //x
    [1, 1, 0, 0,    1, 1, 0, 0], //y
    [1, 1, 1, 1,    0, 0, 0, 0], //z
]

//By multiplying both these matrix's (transformationMatrix * cubeVertexsMatrix) you could get: (each column of this represents a point on the graph)
const resultMatrix = [
    [1, 0, -1, 0, 1, 0, -1, 0], //x
    [2, 1,  0, 1, 1, 0, -1, 0]  //y
]


//convert it into a plotable array
const pointsToPlot = [
    [1, 2],
    [0, 1],
    [-1, 0],
    [0, 1],
    [1, 1],
    [0, 0],
    [-1, -1],
    [0, 0]
]

//now just plot these points
for (i in pointsToPlot)
{
    const point = pointsToPlot[i];
    const scale = 100;
    const xOffset = 500;
    const yOffset = 500;

    point[0] = point[0] * scale + xOffset;
    point[1] = point[1] * scale + yOffset;
    console.log(point);
    plotPoint(point);
}
*/ 
