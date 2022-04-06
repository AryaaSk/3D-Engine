var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dpi = window.devicePixelRatio;
var canvas = undefined;
var c = undefined;
var canvasWidth = 0;
var canvasHeight = 0;
var linkCanvas = function (canvasID) {
    canvas = document.getElementById(canvasID);
    c = canvas.getContext('2d');
    canvasHeight = document.getElementById(canvasID).getBoundingClientRect().height; //Fix blury lines
    canvasWidth = document.getElementById(canvasID).getBoundingClientRect().width;
    canvas.setAttribute('height', String(canvasHeight * dpi));
    canvas.setAttribute('width', String(canvasWidth * dpi));
    window.onresize = function () { linkCanvas(canvasID); }; //just calling the function to initialise the canvas again
};
//ACTUAL DRAWING FUNCTIONS
var gridX = function (x) {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasWidth / 2) + x;
};
var gridY = function (y) {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasHeight / 2) - y;
};
var plotPoint = function (p, colour, label) {
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
var drawLine = function (p1, p2, colour) {
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
var drawShape = function (points, colour, outline) {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    if (points.length < 3) {
        console.error("Cannot draw shape, need at least 3 points to draw a shape");
        return;
    }
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(points[0][0] * dpi), gridY(points[0][1] * dpi));
    for (var pointsIndex = 1; pointsIndex != points.length; pointsIndex += 1) {
        c.lineTo(gridX(points[pointsIndex][0] * dpi), gridY(points[pointsIndex][1] * dpi));
    }
    c.closePath();
    c.fill();
    if (outline == true) {
        for (var i = 1; i != points.length; i += 1) {
            drawLine(points[i - 1], points[i], "#000000");
        }
        drawLine(points[points.length - 1], points[0], "000000"); //to cover the line from last point to first point
    }
};
var clearCanvas = function () {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
};
//MATRIX FUNCTIONS
var matrix = /** @class */ (function () {
    function matrix() {
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
    matrix.prototype.scaleUp = function (factor) { for (var i in this.data) {
        for (var a in this.data[i]) {
            this.data[i][a] *= factor;
        }
    } };
    matrix.prototype.scaledUp = function (factor) {
        var returnMatrix = new matrix(); //create new matrix object, and scale it up
        for (var i = 0; i != this.width; i += 1) {
            var column = this.getColumn(i);
            var columnCopy = JSON.parse(JSON.stringify(column));
            returnMatrix.addColumn(columnCopy);
        }
        for (var i in returnMatrix.data) {
            for (var a in returnMatrix.data[i]) {
                returnMatrix.data[i][a] *= factor;
            }
        } //scale up
        return returnMatrix;
    };
    matrix.prototype.translateMatrix = function (x, y, z) {
        for (var i = 0; i != this.width; i += 1) {
            var column = this.getColumn(i);
            this.setValue(i, 0, column[0] + x);
            this.setValue(i, 1, column[1] + y);
            this.setValue(i, 2, column[2] + z);
        }
    };
    matrix.prototype.copy = function () {
        var copyMatrix = new matrix();
        for (var i = 0; i != this.width; i += 1) {
            var column = this.getColumn(i);
            var columnCopy = JSON.parse(JSON.stringify(column));
            copyMatrix.addColumn(columnCopy);
        }
        return copyMatrix;
    };
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
            //these 2 should be the same length
            var currentRow = m1.getRow(rowIndex);
            var currentColumn = m2.getColumn(columnIndex);
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
var toRadians = function (angle) { return angle * (Math.PI / 180); };
var sin = function (num) { return Math.sin(toRadians(num)); };
var cos = function (num) { return Math.cos(toRadians(num)); };
var distanceBetween = function (p1, p2) {
    //first use pythagoruses thoerm to get the bottom diagonal
    var bottomDiagonal = Math.sqrt(Math.pow((p2[0] - p1[0]), 2) + Math.pow((p2[2] - p1[2]), 2));
    var distance = Math.sqrt(Math.pow(bottomDiagonal, 2) + Math.pow((p2[1] - p1[1]), 2));
    return distance;
};
//All shapes are subclasses of class Shape, because an object is just a collection of it's points
//When the camera renders the object is just needs its Physical Matrix (points relative to the origin), so the subclasses are purely for constructing the shape
var Shape = /** @class */ (function () {
    function Shape() {
        //Construction    
        this.pointMatrix = new matrix(); //pointMatrix is constructed in the subclasses
        //Rotation
        this.rotationMatrix = new matrix();
        this.rotation = { x: 0, y: 0, z: 0 };
        //Physical (as if the shape was being rendered around the origin)
        this.physicalMatrix = new matrix();
        this.scale = 1;
        //Rendering
        this.position = { x: 0, y: 0, z: 0 };
        this.showOutline = false;
        this.faces = []; //stores the indexes of the columns (points) in the physicalMatrix
        this.showFaceIndexes = false;
    }
    Shape.prototype.updateRotationMatrix = function () {
        //XYZ Euler rotation, Source: https://support.zemax.com/hc/en-us/articles/1500005576822-Rotation-Matrix-and-Tilt-About-X-Y-Z-in-OpticStudio
        var _a = [(this.rotation.x % 360), (this.rotation.y % 360), (this.rotation.z % 360)], rX = _a[0], rY = _a[1], rZ = _a[2];
        var iHat = [cos(rY) * cos(rZ), cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ), sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ)]; //x-axis (iHat)
        var jHat = [-(cos(rY)) * sin(rZ), cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ), sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ)]; //y-axis (jHat)
        var kHat = [sin(rY), -(sin(rX)) * cos(rY), cos(rX) * cos(rY)]; //z-axis (kHat)
        //Set the unit vectors onto the singular rotation matrix
        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn(iHat);
        this.rotationMatrix.addColumn(jHat);
        this.rotationMatrix.addColumn(kHat);
    };
    Shape.prototype.updatePhysicalMatrix = function () {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
    };
    Shape.prototype.updateMatrices = function () {
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    };
    return Shape;
}());
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    //populate the pointMatrix, once we have done that we just call updateRotationMatrix() and updatePhysicalMatrix()
    //after populating pointMatrix, we need to update the edges, and faceIndexes
    function Box(width, height, depth) {
        var _this = _super.call(this) || this;
        _this.pointMatrix = new matrix();
        _this.pointMatrix.addColumn([0, 0, 0]);
        _this.pointMatrix.addColumn([width, 0, 0]);
        _this.pointMatrix.addColumn([width, height, 0]);
        _this.pointMatrix.addColumn([0, height, 0]);
        _this.pointMatrix.addColumn([0, 0, depth]);
        _this.pointMatrix.addColumn([width, 0, depth]);
        _this.pointMatrix.addColumn([width, height, depth]);
        _this.pointMatrix.addColumn([0, height, depth]);
        var _a = [-(width / 2), -(height / 2), -(depth / 2)], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
        _this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        _this.setFaces();
        _this.updateMatrices();
        return _this;
    }
    Box.prototype.setFaces = function () {
        //hardcoded values since the points of the shape won't move in relation to each other
        this.faces = [
            { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" },
            { pointIndexes: [1, 2, 6, 5], colour: "#00ff00" },
            { pointIndexes: [2, 3, 7, 6], colour: "#0000ff" },
            { pointIndexes: [0, 1, 5, 4], colour: "#ffff00" },
            { pointIndexes: [0, 3, 7, 4], colour: "#00ffff" },
            { pointIndexes: [4, 5, 6, 7], colour: "#ff00ff" },
        ];
    };
    return Box;
}(Shape));
var SquareBasedPyramid = /** @class */ (function (_super) {
    __extends(SquareBasedPyramid, _super);
    function SquareBasedPyramid(bottomSideLength, height) {
        var _this = _super.call(this) || this;
        _this.pointMatrix = new matrix();
        _this.pointMatrix.addColumn([0, 0, 0]);
        _this.pointMatrix.addColumn([bottomSideLength, 0, 0]);
        _this.pointMatrix.addColumn([bottomSideLength, 0, bottomSideLength]);
        _this.pointMatrix.addColumn([0, 0, bottomSideLength]);
        _this.pointMatrix.addColumn([bottomSideLength / 2, height, bottomSideLength / 2]);
        var _a = [-(bottomSideLength / 2), -(height / 2), -(bottomSideLength / 2)], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
        _this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        _this.setFaces();
        _this.updateMatrices();
        return _this;
    }
    SquareBasedPyramid.prototype.setFaces = function () {
        this.faces = [
            { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" },
            { pointIndexes: [0, 1, 4], colour: "#00ff00" },
            { pointIndexes: [1, 2, 4], colour: "#0000ff" },
            { pointIndexes: [2, 3, 4], colour: "#ffff00" },
            { pointIndexes: [0, 3, 4], colour: "#00ffff" },
        ];
    };
    return SquareBasedPyramid;
}(Shape));
var TriangularPrism = /** @class */ (function (_super) {
    __extends(TriangularPrism, _super);
    function TriangularPrism(width, height, depth) {
        var _this = _super.call(this) || this;
        _this.pointMatrix = new matrix();
        _this.pointMatrix.addColumn([0, 0, 0]);
        _this.pointMatrix.addColumn([width, 0, 0]);
        _this.pointMatrix.addColumn([width / 2, height, 0]);
        _this.pointMatrix.addColumn([0, 0, depth]);
        _this.pointMatrix.addColumn([width, 0, depth]);
        _this.pointMatrix.addColumn([width / 2, height, depth]);
        var _a = [-(width / 2), -(height / 2), -(depth / 2)], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
        _this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        _this.setFaces();
        _this.updateMatrices();
        return _this;
    }
    TriangularPrism.prototype.setFaces = function () {
        this.faces = [
            { pointIndexes: [0, 1, 2], colour: "#ff0000" },
            { pointIndexes: [0, 2, 5, 3], colour: "#00ff00" },
            { pointIndexes: [0, 1, 4, 3], colour: "#0000ff" },
            { pointIndexes: [1, 2, 5, 4], colour: "#ffff00" },
            { pointIndexes: [3, 4, 5], colour: "#00ffff" }
        ];
    };
    return TriangularPrism;
}(Shape));
var ElongatedOctahedron = /** @class */ (function (_super) {
    __extends(ElongatedOctahedron, _super);
    function ElongatedOctahedron(width, height, depth) {
        var _this = _super.call(this) || this;
        _this.pointMatrix = new matrix();
        _this.pointMatrix.addColumn([0, 0, 0]); //bottom point
        _this.pointMatrix.addColumn([-width / 2, height / 3, 0]); //first pyramid
        _this.pointMatrix.addColumn([0, height / 3, depth / 2]);
        _this.pointMatrix.addColumn([width / 2, height / 3, 0]);
        _this.pointMatrix.addColumn([0, height / 3, -depth / 2]);
        _this.pointMatrix.addColumn([-width / 2, height / 3 * 2, 0]); //cuboid in center
        _this.pointMatrix.addColumn([0, height / 3 * 2, depth / 2]);
        _this.pointMatrix.addColumn([width / 2, height / 3 * 2, 0]);
        _this.pointMatrix.addColumn([0, height / 3 * 2, -depth / 2]);
        _this.pointMatrix.addColumn([0, height, 0]); //top point
        var _a = [0, -(height / 2), 0], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
        _this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        _this.setFaces();
        _this.updateMatrices();
        return _this;
    }
    ElongatedOctahedron.prototype.setFaces = function () {
        this.faces = [
            { pointIndexes: [0, 1, 2], colour: "#ffffff" },
            { pointIndexes: [0, 2, 3], colour: "#c4c4c4" },
            { pointIndexes: [0, 3, 4], colour: "#ffffff" },
            { pointIndexes: [0, 4, 1], colour: "#c4c4c4" },
            { pointIndexes: [1, 5, 6, 2], colour: "#c4c4c4" },
            { pointIndexes: [2, 6, 7, 3], colour: "#ffffff" },
            { pointIndexes: [3, 7, 8, 4], colour: "#c4c4c4" },
            { pointIndexes: [4, 8, 5, 1], colour: "#ffffff" },
            { pointIndexes: [9, 5, 6], colour: "#ffffff" },
            { pointIndexes: [9, 6, 7], colour: "#c4c4c4" },
            { pointIndexes: [9, 7, 8], colour: "#ffffff" },
            { pointIndexes: [9, 8, 5], colour: "#c4c4c4" }
        ];
    };
    return ElongatedOctahedron;
}(Shape));
var Camera = /** @class */ (function () {
    function Camera() {
        this.position = { x: 0, y: 0 };
        this.zoom = 1;
        this.worldRotation = { x: 0, y: 0, z: 0 };
        this.worldRotationMatrix = new matrix();
        this.updateRotationMatrix();
    }
    Camera.prototype.render = function (objects) {
        var objectData = [];
        for (var objectIndex = 0; objectIndex != objects.length; objectIndex += 1) {
            //transform the object's physicalMatrix to how the camera would see it:
            var object = objects[objectIndex];
            var cameraObjectMatrix = object.physicalMatrix.copy();
            cameraObjectMatrix.scaleUp(this.zoom); //scale from zoom
            cameraObjectMatrix = multiplyMatrixs(this.worldRotationMatrix, cameraObjectMatrix); //global world rotation
            //translate object relative to grid origin, since the object's position is relative to the origin, it can also be considered as a vector from the origin
            var gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };
            var originObjectVector = new matrix();
            originObjectVector.addColumn([object.position.x, object.position.y, object.position.z]);
            originObjectVector = multiplyMatrixs(this.worldRotationMatrix, originObjectVector);
            var originObjectTranslation = originObjectVector.getColumn(0);
            //move the object in the correct position based on zoom, calculate vector from zoom point (0, 0, 0), to object
            var screenOriginObjectVector = new matrix();
            screenOriginObjectVector.addColumn([(gridOrigin.x + originObjectTranslation[0]), (gridOrigin.y + originObjectTranslation[1]), (gridOrigin.z + originObjectTranslation[2])]);
            screenOriginObjectVector.scaleUp(this.zoom);
            var ultimateTranslation = screenOriginObjectVector.getColumn(0); //screenOriginObjectVector contains the originObjectTranslation inside it
            cameraObjectMatrix.translateMatrix(ultimateTranslation[0], ultimateTranslation[1], ultimateTranslation[2]);
            //work out center of shape by finding average of all points
            var _a = [0, 0, 0], totalX = _a[0], totalY = _a[1], totalZ = _a[2];
            for (var i = 0; i != cameraObjectMatrix.width; i += 1) {
                var point = cameraObjectMatrix.getColumn(i);
                totalX += point[0];
                totalY += point[1];
                totalZ += point[2];
            }
            var _b = [totalX / cameraObjectMatrix.width, totalY / cameraObjectMatrix.width, totalZ / cameraObjectMatrix.width], averageX = _b[0], averageY = _b[1], averageZ = _b[2];
            var center = [averageX, averageY, averageZ];
            objectData.push({ object: object, screenPoints: cameraObjectMatrix, center: center });
        }
        //sort objects based on distance to the position point:
        var positionPoint = [0, 0, -50000];
        var sortedObjects = this.sortFurthestDistanceTo(objectData, "center", positionPoint);
        for (var objectIndex = 0; objectIndex != sortedObjects.length; objectIndex += 1) {
            var object = sortedObjects[objectIndex].object;
            var screenPoints = sortedObjects[objectIndex].screenPoints;
            //draw faces of shape in correct order, by finding the center and sorting based on distance to the position point
            var objectFaces = [];
            //populate the array
            for (var i = 0; i != object.faces.length; i += 1) {
                var points = [];
                for (var a = 0; a != object.faces[i].pointIndexes.length; a += 1) {
                    points.push(screenPoints.getColumn(object.faces[i].pointIndexes[a]));
                }
                //find center by getting average of all points
                var _c = [0, 0, 0], totalX = _c[0], totalY = _c[1], totalZ = _c[2];
                for (var a = 0; a != points.length; a += 1) {
                    totalX += points[a][0];
                    totalY += points[a][1];
                    totalZ += points[a][2];
                }
                var _d = [totalX / points.length, totalY / points.length, totalZ / points.length], averageX = _d[0], averageY = _d[1], averageZ = _d[2];
                var center = [averageX, averageY, averageZ];
                objectFaces.push({ points: points, center: center, colour: object.faces[i].colour, faceIndex: i });
            }
            var sortedFaces = this.sortFurthestDistanceTo(objectFaces, "center", positionPoint); //sort based on distance from center to (0, 0, -50000)
            //draw the faces as a quadrilateral, later I will change the drawQuadrilateral function to a drawShape function, which can take as many points as it needs
            for (var i = 0; i != sortedFaces.length; i += 1) {
                var facePoints = sortedFaces[i].points;
                var colour = sortedFaces[i].colour;
                if (colour != "") {
                    drawShape(facePoints, colour, object.showOutline);
                } //if face is transparent then just don't render it
                if (object.showFaceIndexes == true) {
                    plotPoint(sortedFaces[i].center, "#000000", String(sortedFaces[i].faceIndex));
                }
            }
        }
    };
    Camera.prototype.sortFurthestDistanceTo = function (list, positionKey, positionPoint) {
        var sortedList = [];
        var listCopy = list;
        while (listCopy.length != 0) {
            var furthestDistanceIndex = 0;
            for (var i = 0; i != listCopy.length; i += 1) {
                if (distanceBetween(positionPoint, listCopy[i][positionKey]) > distanceBetween(positionPoint, listCopy[furthestDistanceIndex][positionKey])) {
                    furthestDistanceIndex = i;
                }
            }
            sortedList.push(listCopy[furthestDistanceIndex]);
            listCopy.splice(furthestDistanceIndex, 1);
        }
        return sortedList;
    };
    Camera.prototype.updateRotationMatrix = function () {
        var _a = [(this.worldRotation.x % 360), (this.worldRotation.y % 360), (this.worldRotation.z % 360)], rX = _a[0], rY = _a[1], rZ = _a[2];
        var worldiHat = [cos(rY) * cos(rZ), cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ), sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ)];
        var worldjHat = [-(cos(rY)) * sin(rZ), cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ), sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ)];
        var worldkHat = [sin(rY), -(sin(rX)) * cos(rY), cos(rX) * cos(rY)];
        this.worldRotationMatrix = new matrix();
        this.worldRotationMatrix.addColumn(worldiHat);
        this.worldRotationMatrix.addColumn(worldjHat);
        this.worldRotationMatrix.addColumn(worldkHat);
    };
    Camera.prototype.renderGrid = function () {
        var gridLength = 1000 * this.zoom;
        //create 2 points for each axis, then transform them using the worldRotationMatrix, then just plot them
        var startPointMatrix = new matrix();
        startPointMatrix.addColumn([-gridLength, 0, 0]); //x-axis
        startPointMatrix.addColumn([0, -gridLength, 0]); //y-axis
        startPointMatrix.addColumn([0, 0, -gridLength]); //z-axis
        var endPointMatrix = new matrix();
        endPointMatrix.addColumn([gridLength, 0, 0]);
        endPointMatrix.addColumn([0, gridLength, 0]);
        endPointMatrix.addColumn([0, 0, gridLength]);
        startPointMatrix = multiplyMatrixs(this.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(this.worldRotationMatrix, endPointMatrix);
        //we also want to offset this grid by the camera's position, and also the zoom
        var gridOrigin = { x: -this.position.x, y: -this.position.y, z: 0 };
        //move grid based on zoom
        var absoluteOriginObjectVector = new matrix();
        absoluteOriginObjectVector.addColumn([gridOrigin.x, gridOrigin.y, gridOrigin.z]);
        absoluteOriginObjectVector.scaleUp(this.zoom);
        var zoomTranslationVector = absoluteOriginObjectVector.getColumn(0);
        startPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        endPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        for (var i = 0; i != startPointMatrix.width; i += 1) //draw grid lines in
         {
            var point1 = startPointMatrix.getColumn(i);
            var point2 = endPointMatrix.getColumn(i);
            drawLine(point1, point2, "#000000");
        }
    };
    ;
    return Camera;
}());
