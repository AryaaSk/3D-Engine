var localScope = function () {
    linkCanvas("renderingWindow");
    var camera = new Camera();
    camera.enableMovementControls("renderingWindow", true, false, true);
    var shape = new Shape();
    var loadDefaultShape = function () {
        shape.pointMatrix.addColumn([0, 0, 0]);
        shape.pointMatrix.addColumn([100, 0, 0]);
        shape.pointMatrix.addColumn([50, 0, 100]);
        shape.pointMatrix.addColumn([50, 100, 50]);
        shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#ff0000" });
        shape.faces.push({ pointIndexes: [0, 1, 3], colour: "#ff9300" });
        shape.faces.push({ pointIndexes: [1, 2, 3], colour: "#00f900" });
        shape.faces.push({ pointIndexes: [2, 3, 0], colour: "#0433ff" });
        shape.updateMatrices();
    };
    var displayShape = new Shape();
    displayShape.showOutline = true;
    var centeringX = 0;
    var centeringY = 0;
    var centeringZ = 0;
    var updatePoints = function () {
        //get data from existing points, can just use the indexes from the point matrix, and update the values
        var pointMatrixWidth = shape.pointMatrix.width;
        shape.pointMatrix = new matrix();
        for (var i = 0; i != pointMatrixWidth; i += 1) {
            var DOMPointX = document.getElementById("point".concat(String(i), "X"));
            var DOMPointY = document.getElementById("point".concat(String(i), "Y"));
            var DOMPointZ = document.getElementById("point".concat(String(i), "Z"));
            var _a = [Number(DOMPointX.value), Number(DOMPointY.value), Number(DOMPointZ.value)], x = _a[0], y = _a[1], z = _a[2];
            shape.pointMatrix.addColumn([x, y, z]);
        }
        shape.updateMatrices();
    };
    var updateFaces = function () {
        for (var i = 0; i != shape.faces.length; i += 1) {
            var pointIndexesString = document.getElementById("pointIndexes".concat(String(i))).value;
            var pointIndexesStringList = pointIndexesString.split(",");
            var pointIndexes = [];
            for (var a = 0; a != pointIndexesStringList.length; a += 1) {
                pointIndexes.push(Number(pointIndexesStringList[a]));
            }
            //check if any of the index's in pointIndexes are > the width of pointMatrix + 1, if so it means the point doesnt exist
            var pointMatrixWidth = shape.pointMatrix.width;
            var cancelOperation = false;
            for (var a = 0; a != pointIndexes.length; a += 1) {
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
                var colour = document.getElementById("colour".concat(String(i))).value;
                shape.faces[i].colour = colour;
            }
        }
        shape.updateMatrices();
        updateDOM();
    };
    var updateCentering = function () {
        var _a;
        var _b = [document.getElementById("centeringX").value, document.getElementById("centeringY").value, document.getElementById("centeringZ").value], centeringXString = _b[0], centeringYString = _b[1], centeringZString = _b[2];
        _a = [Number(centeringXString), Number(centeringYString), Number(centeringZString)], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
    };
    var updateAll = function () {
        updatePoints();
        updateFaces();
        displayShape.pointMatrix = shape.pointMatrix.copy();
        displayShape.faces = shape.faces;
        updateCentering(); //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
        displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        displayShape.updateMatrices();
        //changes should be handled by animation loop
    };
    var updateDOM = function () {
        var pointMatrixList = document.getElementById("pointMatrixList");
        pointMatrixList.innerText = ""; //clear the list
        for (var i = 0; i != shape.pointMatrix.width; i += 1) {
            var point = shape.pointMatrix.getColumn(i);
            var pointDiv = document.createElement('div');
            pointDiv.className = 'point';
            pointDiv.innerHTML = "\n                <div class=\"centered\">".concat(String(i), "</div>\n                <div class=\"centered\"> X: <input type=\"text\" style=\"width: 90%;\" value=\"").concat(point[0], "\" id=\"point").concat(String(i), "X\"> </div>\n                <div class=\"centered\"> Y: <input type=\"text\" style=\"width: 90%;\" value=\"").concat(point[1], "\" id=\"point").concat(String(i), "Y\"> </div>\n                <div class=\"centered\"> Z: <input type=\"text\" style=\"width: 90%;\" value=\"").concat(point[2], "\" id=\"point").concat(String(i), "Z\"> </div>\n                <div class=\"centered\"><input type=\"button\" class=\"controlButton deleteStyle\" id=\"DeletePoint").concat(String(i), "\" value=\"Delete Point\" style=\"float: right;\"></div>\n        ");
            pointMatrixList.appendChild(pointDiv);
        }
        var pointControls = document.createElement('div');
        pointControls.className = "centered";
        pointControls.innerHTML = "\n        <input type=\"button\" class=\"controlButton\" id=\"addPoint\" value=\"Add Point\">\n        <input type=\"button\" style=\"margin-left: 20px;\" class=\"controlButton\" id=\"duplicatePoints\" value=\"Duplicate Points\">\n    ";
        pointMatrixList.appendChild(pointControls);
        var faceList = document.getElementById("faceList");
        faceList.innerText = "";
        for (var i = 0; i != shape.faces.length; i += 1) {
            var face = shape.faces[i];
            var faceDiv = document.createElement('div');
            faceDiv.className = "face";
            faceDiv.innerHTML = "\n            <div class=\"centered\"> ".concat(String(i), " </div>\n            <div class=\"centeredLeft\"> Point Indexes: <input type=\"text\" style=\"margin-left: 20px; width: 70%;\" id=\"pointIndexes").concat(String(i), "\" value=\"").concat(String(face.pointIndexes), "\"> </div>\n            <div class=\"centeredLeft\"> Colour: <input type=\"color\" style=\"width: 90%;\" id=\"colour").concat(String(i), "\" value=\"").concat(String(face.colour), "\"></div>\n            <div class=\"centeredLeft\"><input type=\"button\" class=\"controlButton deleteStyle\" id=\"DeleteFace").concat(String(i), "\" value=\"Delete Face\" style=\"float: right;\"></div>\n        ");
            faceList.appendChild(faceDiv);
        }
        var faceControls = document.createElement('div');
        faceControls.className = "centered";
        faceControls.innerHTML = "\n        <input type=\"button\" class=\"controlButton\" id=\"addFace\" value=\"Add Face\">\n    ";
        faceList.appendChild(faceControls);
        startButtonListeners();
    };
    var generateExportCode = function () {
        var shapeName = document.getElementById("shapeName").value || "NewShape";
        var pointMatrixPoints = [];
        for (var i = 0; i != shape.pointMatrix.width; i += 1) {
            var point = shape.pointMatrix.getColumn(i);
            pointMatrixPoints.push(point);
        }
        updateCentering();
        var exportCode = "class ".concat(shapeName, " extends Shape {\n    constructor () {\n        super();\n\n        this.pointMatrix = new matrix();\n        const points = ").concat(JSON.stringify(pointMatrixPoints), ";\n        for (let i = 0; i != points.length; i += 1)\n        { this.pointMatrix.addColumn(points[i]); }\n\n        const [centeringX, centeringY, centeringZ] = [").concat(centeringX, ", ").concat(centeringY, ", ").concat(centeringZ, "];\n        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);\n\n        this.setFaces();\n        this.updateMatrices();\n    }\n    setFaces() {\n        this.faces = ").concat(JSON.stringify(shape.faces).replace(/"([^"]+)":/g, '$1:'), ";\n    }\n}\n");
        return exportCode;
    };
    var startButtonListeners = function () {
        document.onkeydown = function ($e) {
            var key = $e.key.toLowerCase();
            if (key == "enter") {
                document.getElementById("exportCodeTitle").innerText = "*Export Code:";
                updateAll();
            }
        };
        document.getElementById("addPoint").onclick = function () {
            shape.pointMatrix.addColumn([0, 0, 0]);
            shape.updateMatrices();
            updateDOM();
        };
        var _loop_1 = function (i) {
            document.getElementById("DeletePoint".concat(String(i))).onclick = function () {
                shape.pointMatrix.deleteColumn(i);
                //also need to check if there are any faces with this point
                for (var i_1 = 0; i_1 != shape.faces.length; i_1 += 1) {
                    if (shape.faces[i_1].pointIndexes.includes(i_1) == true) {
                        shape.faces.splice(i_1, 1);
                        i_1 -= 1;
                    }
                }
                shape.updateMatrices();
                updateDOM();
                updateAll();
            };
        };
        for (var i = 0; i != shape.pointMatrix.width; i += 1) {
            _loop_1(i);
        }
        document.getElementById("duplicatePoints").onclick = function () {
            var _a;
            var pointIndexesToDupList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
            if (pointIndexesToDupList == undefined || pointIndexesToDupList == "") {
                return;
            }
            var pointIndexesToDup = pointIndexesToDupList.split(",").map(Number);
            var pointMatrixWidth = shape.pointMatrix.width;
            for (var i = 0; i != pointIndexesToDup.length; i += 1) {
                if (pointIndexesToDup[i] > pointMatrixWidth - 1) {
                    alert("One or more of indexes was not a valid pooint index");
                    return;
                }
            }
            var changeAxis = (_a = prompt("Which axis do you want to change")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (changeAxis == undefined) {
                alert("Invalid Axis");
                return;
            }
            if (!(changeAxis == "x" || changeAxis == "y" || changeAxis == "z")) {
                alert("Invalid Axis");
                return;
            }
            var changeTo = Number(prompt("What do you want to change the ".concat(changeAxis, " to: ")));
            if (changeTo == undefined) {
                alert("Invalid number");
                return;
            }
            var newPoints = [];
            for (var i = 0; i != pointIndexesToDup.length; i += 1) {
                var point = JSON.parse(JSON.stringify(shape.pointMatrix.getColumn(pointIndexesToDup[i])));
                if (changeAxis == "x") {
                    point[0] = changeTo - centeringX;
                }
                else if (changeAxis == "y") {
                    point[1] = changeTo - centeringY;
                }
                else if (changeAxis == "z") {
                    point[2] = changeTo - centeringZ;
                }
                newPoints.push(point);
            }
            for (var i = 0; i != newPoints.length; i += 1) {
                shape.pointMatrix.addColumn(newPoints[i]);
            }
            updateDOM();
            updateAll();
        };
        document.getElementById("addFace").onclick = function () {
            if (shape.pointMatrix.width < 3) {
                alert("You need at least 3 points to construct a face");
                return;
            }
            shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#c4c4c4" });
            shape.updateMatrices();
            updateDOM();
        };
        var _loop_2 = function (i) {
            document.getElementById("DeleteFace".concat(String(i))).onclick = function () {
                shape.faces.splice(i, 1);
                shape.updateMatrices();
                updateDOM();
            };
        };
        for (var i = 0; i != shape.faces.length; i += 1) {
            _loop_2(i);
        }
        document.getElementById("update").onclick = function () {
            document.getElementById("exportCodeTitle").innerText = "*Export Code:";
            updateAll();
        };
        document.getElementById("export").onclick = function () {
            updateAll();
            document.getElementById("exportCodeTitle").innerText = "Export Code:";
            document.getElementById("exportCode").innerText = generateExportCode();
        };
    };
    //Startup
    loadDefaultShape();
    updateDOM();
    updateAll();
    document.getElementById("exportCode").innerText = generateExportCode();
    //Animation Loop
    setInterval(function () {
        clearCanvas();
        camera.renderGrid();
        camera.render([displayShape], true);
    }, 16);
};
localScope();
