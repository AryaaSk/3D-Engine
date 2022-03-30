//TO ENABLE AUTO RELOAD, RUN LIVE-SERVER, AND CLICK CMD+SHIFT+B, THEN CLICK WATCH TSC: WATCH
var dpi = window.devicePixelRatio;
var canvas = document.getElementById('renderingWindow');
var c = canvas.getContext('2d');
var canvasHeight = document.getElementById('renderingWindow').getBoundingClientRect().height; //Fix blury lines
var canvasWidth = document.getElementById('renderingWindow').getBoundingClientRect().width;
canvas.setAttribute('height', String(canvasHeight * dpi));
canvas.setAttribute('width', String(canvasWidth * dpi));
//ACTUAL DRAWING FUNCTIONS
var gridX = function (x) {
    return (canvasWidth / 2) + x;
};
var gridY = function (y) {
    return (canvasHeight / 2) - y;
};
var drawLine = function (p1, p2) {
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
};
var plotPoint = function (p) {
    //point will be in format: [x, y]
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
};
//MATRIX FUNCTIONS
var matrix = /** @class */ (function () {
    function matrix() {
        /* The data will be stored like on the left, on the right is how the actual matrix will look if you wrote it in mathmatics
       [[1, 0],          [ [1   [0   [0
        [0, 1]      =       0],  1],  0] ]
        [0, 0]]
        */
        this.data = []; /* DO NOT SET THIS EXPLICITLY, USE THE FUNCTIONS */
        this.width = 0; //num of columns
        this.height = 0; //num of rows
    }
    matrix.prototype.addColumn = function (nums) {
        this.data.push(nums);
        this.height = nums.length;
        this.width += 1;
    };
    matrix.prototype.addRow = function (nums) {
        //to add a row you just need to add the given nums to the end of each column, we first need to check that nums == width
        if (nums.length != this.width) {
            console.error("Unable to add row since length of inputs is not equal to number of columns");
            return;
        }
        for (var i in nums) {
            this.data[i].push(nums[i]);
            i += 1;
        }
        this.height += 1;
    };
    matrix.prototype.printMatrix = function () {
        //loop through the rows, and inside of that loop, loop through all the columns
        var finalOutput = "Matrix:";
        var currentRow = 0;
        while (currentRow != this.height) {
            var currentLineOutput = "\n";
            var currentColumn = 0;
            while (currentColumn != this.width) {
                currentLineOutput = currentLineOutput + (this.data[currentColumn][currentRow]) + "      ";
                currentColumn += 1;
            }
            finalOutput = finalOutput + currentLineOutput;
            currentRow += 1;
        }
        console.log(finalOutput);
    };
    matrix.prototype.getColumn = function (columnIndex) { return this.data[columnIndex]; };
    matrix.prototype.getRow = function (rowIndex) {
        var returnArray = [];
        for (var i in this.data) {
            returnArray.push(this.data[i][rowIndex]);
        }
        return returnArray;
    };
    matrix.prototype.setValue = function (columnIndex, rowIndex, value) { this.data[columnIndex][rowIndex] = value; };
    matrix.prototype.getValue = function (columnIndex, rowIndex) { return this.data[columnIndex][rowIndex]; };
    ;
    return matrix;
}());
var multiplyMatrixs = function (m1, m2) {
    //check that m1.width == m2.height, the result matrix will be m1.height x m2.width
    //create result matrix:
    var resultMatrix = new matrix();
    var rMatrixHeight = m1.height;
    var rMatrixWidth = m2.width;
    for (var _ = 0; _ != rMatrixWidth; _ += 1) {
        var newColumn = [];
        for (var __ = 0; __ != rMatrixHeight; __ += 1) {
            newColumn.push(0);
        }
        resultMatrix.addColumn(newColumn);
    }
    //now loop through each element in the result matrix with the rowIndex and columnIndex, and calculate it
    var columnIndex = 0;
    while (columnIndex != resultMatrix.width) {
        var rowIndex = 0;
        while (rowIndex != resultMatrix.height) {
            var currentRow = m1.getRow(rowIndex);
            var currentColumn = m2.getColumn(columnIndex); //these 2 should be the same length
            var value = 0;
            var i = 0;
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
var iHat = [1, 0];
var jHat = [0, 0.7];
var kHat = [0, 0.3];
var tMatrix = new matrix(); //transformation matrix, cube pointing slightly forward
tMatrix.addColumn(iHat);
tMatrix.addColumn(jHat);
tMatrix.addColumn(kHat);
//create our cube matrix (Pseudo Grid)
var cubeMatrix = new matrix();
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
var rMatrix = multiplyMatrixs(tMatrix, cubeMatrix);
//rMatrix.printMatrix();
//loop through the columns, and plot the points with the scale transformation applied to them
var scale = 100;
for (var i = 0; i != rMatrix.width; i += 1) {
    var points = rMatrix.getColumn(i);
    points[0] = points[0] * scale;
    points[1] = points[1] * scale;
    plotPoint(points);
}
