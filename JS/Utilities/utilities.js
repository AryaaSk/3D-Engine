"use strict";
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
