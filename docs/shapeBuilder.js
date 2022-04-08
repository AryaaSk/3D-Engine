(function () {
    linkCanvas("renderingWindow");
    var camera = new Camera();
    camera.enableMovementControls("renderingWindow", true, false, true);
    var shape = new Shape();
    var displayShape = new Shape();
    displayShape.showOutline = true;
    var centeringX = 0;
    var centeringY = 0;
    var centeringZ = 0;
    var duplicatePoints = function () {
        var pointIndexesToDupList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
        if (pointIndexesToDupList == undefined || pointIndexesToDupList == "") {
            return;
        }
        var pointIndexesToDup = pointIndexesToDupList.split(",").map(Number);
        var pointMatrixWidth = shape.pointMatrix.width;
        for (var i = 0; i != pointIndexesToDup.length; i += 1) {
            if (pointIndexesToDup[i] > pointMatrixWidth - 1) {
                alert("One or more of indexes was not a valid point index");
                return;
            }
        }
        var newPoints = [];
        for (var i = 0; i != pointIndexesToDup.length; i += 1) {
            var point = JSON.parse(JSON.stringify(shape.pointMatrix.getColumn(pointIndexesToDup[i])));
            newPoints.push(point);
        }
        for (var i = 0; i != newPoints.length; i += 1) {
            shape.pointMatrix.addColumn(newPoints[i]);
        }
        updateDOM();
        updateDisplayShape();
    };
    var translatePoints = function () {
        var pointIndexesList = prompt("Enter the indexes of the points you want to duplicate separated by a comma");
        if (pointIndexesList == undefined || pointIndexesList == "") {
            return;
        }
        var pointIndexes = pointIndexesList.split(",").map(Number);
        var pointMatrixWidth = shape.pointMatrix.width;
        for (var i = 0; i != pointIndexes.length; i += 1) {
            if (pointIndexes[i] > pointMatrixWidth - 1) {
                alert("One or more of indexes was not a valid point index");
                return;
            }
        }
        var translationVectorString = prompt("Enter the translation vector in format [x, y, z]");
        if (translationVectorString == undefined || translationVectorString == "") {
            alert("Invalid translation vector");
            return;
        }
        var translationVector = JSON.parse(translationVectorString);
        for (var i = 0; i != pointIndexes.length; i += 1) {
            var point = shape.pointMatrix.getColumn(pointIndexes[i]);
            shape.pointMatrix.setValue(pointIndexes[i], 0, point[0] + translationVector[0]);
            shape.pointMatrix.setValue(pointIndexes[i], 1, point[1] + translationVector[1]);
            shape.pointMatrix.setValue(pointIndexes[i], 2, point[2] + translationVector[2]);
        }
        updateDOM();
        updateDisplayShape();
    };
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
        updateDisplayShape();
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
        updateDisplayShape();
        updateDOM();
    };
    var updateCentering = function () {
        var _a;
        var _b = [document.getElementById("centeringX").value, document.getElementById("centeringY").value, document.getElementById("centeringZ").value], centeringXString = _b[0], centeringYString = _b[1], centeringZString = _b[2];
        _a = [Number(centeringXString), Number(centeringYString), Number(centeringZString)], centeringX = _a[0], centeringY = _a[1], centeringZ = _a[2];
    };
    var updateVariables = function () {
        updatePoints();
        updateFaces();
        updateCentering();
    };
    var updateDisplayShape = function () {
        //don't actually render the shape, we render the displayShape to avoid directly modifying the shape's pointMatrix with the centering vectors
        displayShape.pointMatrix = shape.pointMatrix.copy();
        displayShape.faces = shape.faces;
        displayShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        displayShape.updateMatrices();
    };
    var updateDOM = function () {
        var pointMatrixList = document.getElementById("pointMatrixList");
        pointMatrixList.innerText = ""; //clear the list
        for (var i = 0; i != shape.pointMatrix.width; i += 1) {
            var point = shape.pointMatrix.getColumn(i);
            var pointDiv = document.createElement('div');
            pointDiv.className = 'point';
            pointDiv.innerHTML = "\n                <div class=\"centered\">".concat(String(i), "</div>\n                <div class=\"centered\"> X: <input type=\"text\" name=\"pointX").concat(String(i), "\" style=\"width: 90%;\" value=\"").concat(point[0], "\" id=\"point").concat(String(i), "X\"> </div>\n                <div class=\"centered\"> Y: <input type=\"text\" name=\"pointY").concat(String(i), "\" style=\"width: 90%;\" value=\"").concat(point[1], "\" id=\"point").concat(String(i), "Y\"> </div>\n                <div class=\"centered\"> Z: <input type=\"text\" name=\"pointZ").concat(String(i), "\" style=\"width: 90%;\" value=\"").concat(point[2], "\" id=\"point").concat(String(i), "Z\"> </div>\n                <div class=\"centered\"><input type=\"button\" class=\"controlButton deleteStyle\" id=\"DeletePoint").concat(String(i), "\" value=\"Delete Point\" style=\"float: right;\"></div>\n        ");
            pointMatrixList.appendChild(pointDiv);
        }
        var pointControls = document.createElement('div');
        pointControls.className = "centered";
        pointControls.innerHTML = "\n        <input type=\"button\" class=\"controlButton\" id=\"addPoint\" value=\"Add Point\">\n        <input type=\"button\" style=\"margin-left: 20px;\" class=\"controlButton\" id=\"pointCommands\" value=\"Point Commands\">\n    ";
        pointMatrixList.appendChild(pointControls);
        var faceList = document.getElementById("faceList");
        faceList.innerText = "";
        for (var i = 0; i != shape.faces.length; i += 1) {
            var face = shape.faces[i];
            var faceDiv = document.createElement('div');
            faceDiv.className = "face";
            faceDiv.innerHTML = "\n            <div class=\"centered\"> ".concat(String(i), " </div>\n            <div class=\"centeredLeft\"> Point Indexes: <input type=\"text\" name=\"face").concat(String(i), "\" style=\"margin-left: 20px; width: 70%;\" id=\"pointIndexes").concat(String(i), "\" value=\"").concat(String(face.pointIndexes), "\"> </div>\n            <div class=\"centeredLeft\"> Colour: <input type=\"color\" style=\"width: 90%;\" id=\"colour").concat(String(i), "\" value=\"").concat(String(face.colour), "\"></div>\n            <div class=\"centeredLeft\"><input type=\"button\" class=\"controlButton deleteStyle\" id=\"DeleteFace").concat(String(i), "\" value=\"Delete Face\" style=\"float: right;\"></div>\n        ");
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
    var importShape = function () {
        var shapeCode = prompt("Copy and paste the shape's code here\nMake sure you haven't added a line break between any of the datasets:");
        if (shapeCode == undefined || shapeCode == "") {
            alert("Invalid Shape Code");
            return;
        }
        shapeCode = shapeCode.replaceAll(" ", "");
        var lineArray = shapeCode.split(/\r?\n/);
        var points = [];
        var centeringVectors = [];
        var faces = [];
        var found = 0;
        //find lines which begin with, "constpoints=", "const[centeringX,centeringY,centeringZ]=", and "this.faces=", this is the data we need to construct the object
        //when it finds one, then split at '=', and get second element
        for (var i = 0; i != lineArray.length; i += 1) {
            var line = lineArray[i];
            if (line.startsWith("constpoints=")) {
                var pointsJSON = line.split("=")[1];
                if (pointsJSON.endsWith(";")) {
                    pointsJSON = pointsJSON.slice(0, -1);
                }
                points = JSON.parse(pointsJSON);
                found += 1;
            }
            else if (line.startsWith("const[centeringX,centeringY,centeringZ]=")) {
                var centeringJSON = line.split("=")[1];
                if (centeringJSON.endsWith(";")) {
                    centeringJSON = centeringJSON.slice(0, -1);
                }
                centeringVectors = JSON.parse(centeringJSON);
                found += 1;
            }
            else if (line.startsWith("this.faces=")) {
                var facesJSON = line.split("=")[1];
                if (facesJSON.endsWith(";")) {
                    facesJSON = facesJSON.slice(0, -1);
                }
                facesJSON = facesJSON.replaceAll('pointIndexes', '"pointIndexes"');
                facesJSON = facesJSON.replaceAll('colour', '"colour"');
                faces = JSON.parse(facesJSON);
                found += 1;
            }
        }
        if (found != 3) {
            alert("Unable to find all required data");
            return;
        }
        shape.pointMatrix = new matrix();
        for (var i = 0; i != points.length; i += 1) {
            shape.pointMatrix.addColumn(points[i]);
        }
        shape.faces = faces;
        centeringX = centeringVectors[0], centeringY = centeringVectors[1], centeringZ = centeringVectors[2];
        updateDisplayShape();
        updateDOM();
        document.getElementById("centeringX").value = String(centeringX);
        document.getElementById("centeringY").value = String(centeringY);
        document.getElementById("centeringZ").value = String(centeringZ);
        document.getElementById("exportCodeTitle").innerText = "*Export Code:";
    };
    var startButtonListeners = function () {
        document.onkeydown = function ($e) {
            var key = $e.key.toLowerCase();
            if (key == "enter") {
                document.getElementById("exportCodeTitle").innerText = "*Export Code:";
                updateVariables();
                updateDisplayShape();
            }
        };
        document.getElementById("uploadShape").onclick = function () {
            importShape();
        };
        document.getElementById("addPoint").onclick = function () {
            shape.pointMatrix.addColumn([0 - centeringX, 0 - centeringY, 0 - centeringZ]);
            updateDisplayShape();
            updateDOM();
        };
        var _loop_1 = function (i) {
            document.getElementById("DeletePoint".concat(String(i))).onclick = function () {
                var _a;
                shape.pointMatrix.deleteColumn(i);
                //also need to check if there are any faces with this point, i = pointIndex
                var a = 0;
                while (a != shape.faces.length) {
                    if (((_a = shape.faces[a]) === null || _a === void 0 ? void 0 : _a.pointIndexes.includes(i)) == true) {
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
        };
        for (var i = 0; i != shape.pointMatrix.width; i += 1) {
            _loop_1(i);
        }
        document.getElementById("pointCommands").onclick = function () {
            var _a;
            var command = (_a = prompt("What command do you want to perform, enter a letter:\n    D: Duplicate Points\n    T: Translate Points")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (command == undefined) {
                return;
            }
            if (command == "d") {
                duplicatePoints();
            }
            else if (command == "t") {
                translatePoints();
            }
            else {
                alert("Invalid command");
                return;
            }
        };
        document.getElementById("addFace").onclick = function () {
            if (shape.pointMatrix.width < 3) {
                alert("You need at least 3 points to construct a face");
                return;
            }
            shape.faces.push({ pointIndexes: [0, 1, 2], colour: "#c4c4c4" });
            updateDisplayShape();
            updateDOM();
        };
        var _loop_2 = function (i) {
            document.getElementById("DeleteFace".concat(String(i))).onclick = function () {
                shape.faces.splice(i, 1);
                updateDisplayShape();
                updateDOM();
            };
        };
        for (var i = 0; i != shape.faces.length; i += 1) {
            _loop_2(i);
        }
        document.getElementById("update").onclick = function () {
            document.getElementById("exportCodeTitle").innerText = "*Export Code:";
            updateVariables();
            updateDisplayShape();
        };
        document.getElementById("export").onclick = function () {
            updateVariables();
            document.getElementById("exportCodeTitle").innerText = "Export Code:";
            document.getElementById("exportCode").innerText = generateExportCode();
        };
        var faceTextFieldInFocusID = undefined;
        document.onclick = function ($e) {
            var _a, _b;
            var clickedElement = document.activeElement;
            if ((_a = clickedElement.name) === null || _a === void 0 ? void 0 : _a.startsWith("face")) //only interested if the user clicks a face textfield
             {
                faceTextFieldInFocusID = clickedElement.id;
            }
            else if ($e.clientX < canvasWidth && $e.clientY < canvasHeight) //don't change textFieldInFocus when user clicks the renderingWindow
             {
                (_b = document.getElementById(faceTextFieldInFocusID)) === null || _b === void 0 ? void 0 : _b.focus();
            }
            else {
                faceTextFieldInFocusID = undefined;
            }
            return false;
        };
        document.getElementById("renderingWindow").onclick = function ($e) {
            var clickedPoint = undefined;
            //we need to convert these click X and Y coordinates into the coordinates on the grid
            var gridX = $e.clientX - (canvasWidth / 2);
            var gridY = (canvasHeight / 2) - $e.clientY;
            //now we need to loop through the screenPoints, and check which points are within a certain radius of the click using X and Y coordinates (nearest 2 dp)
            var roundMultiple = 0.01; //making the points less accurate so that the user doesn't have to click exactly on the point, higher means user has to be more precise
            var gridXRounded = Math.round(gridX * roundMultiple) / roundMultiple;
            var gridYRounded = Math.round(gridY * roundMultiple) / roundMultiple;
            for (var i = 0; i != screenPoints.width; i += 1) {
                var point = screenPoints.getColumn(i);
                var pointXRounded = Math.round(point[0] * roundMultiple) / roundMultiple;
                var pointYRounded = Math.round(point[1] * roundMultiple) / roundMultiple;
                if (gridXRounded == pointXRounded && gridYRounded == pointYRounded) {
                    clickedPoint = i;
                }
            }
            if (faceTextFieldInFocusID != undefined && clickedPoint != undefined) {
                var faceTextfield = document.getElementById(faceTextFieldInFocusID);
                if (faceTextfield.value.endsWith(",")) {
                    faceTextfield.value = faceTextfield.value + " ".concat(clickedPoint);
                }
                else {
                    faceTextfield.value = faceTextfield.value + ", ".concat(clickedPoint);
                }
            }
        };
    };
    //Startup
    (function () {
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
    //Animation Loop
    var screenPoints = new matrix(); //always updated to have the current screen points, in correct order
    setInterval(function () {
        clearCanvas();
        camera.renderGrid();
        screenPoints = camera.render([displayShape], true)[0].screenPoints; //camera now returns the sortedObjects, since we are only rendering 1 object we can always get [0]
    }, 16);
})();
//localScope();
