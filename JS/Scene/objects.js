"use strict";
//All shapes are subclasses of class Shape, because an object is just a collection of it's points
//When the camera renders the object is just needs its Physical Matrix (points relative to the origin), so the subclasses are purely for constructing the shape
class Shape {
    constructor() {
        this.type = "";
        //Point Matrix
        this.pointMatrix = new matrix();
        this.edges = [];
        this.diagonals = [];
        this.faces = [];
        //Appearance
        this.faceColours = {};
        this.outline = false;
        //ROTATION
        this.rotationMatrix = new matrix();
        this.rotation = { x: 0, y: 0, z: 0 };
        this.iHat = [1, 0, 0]; //Unit Vectors
        this.jHat = [0, 1, 0];
        this.kHat = [0, 0, 1];
        //PHYSICAL MATRIX
        this.physicalMatrix = new matrix();
        this.position = { x: 0, y: 0, z: 0 };
        this.scale = 1;
    }
    updateRotationMatrix() {
        //XYZ Euler rotation, Source: https://support.zemax.com/hc/en-us/articles/1500005576822-Rotation-Matrix-and-Tilt-About-X-Y-Z-in-OpticStudio
        const rX = this.rotation.x % 360;
        const rY = this.rotation.y % 360;
        const rZ = this.rotation.z % 360;
        this.iHat[0] = cos(rY) * cos(rZ); //x-axis (iHat)
        this.iHat[1] = cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ);
        this.iHat[2] = sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ);
        this.jHat[0] = -(cos(rY)) * sin(rZ); //y-axis (jHat)
        this.jHat[1] = cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ);
        this.jHat[2] = sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ);
        this.kHat[0] = sin(rY); //z-axis (kHat)
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
    }
}
class Box extends Shape {
    constructor(width, height, depth) {
        super();
        //All we do in the Box subclass is construct the Box and put the coordinates into the physical matrix
        this.dimensions = { width: 5, height: 5, depth: 5 };
        this.type = "box";
        this.dimensions.width = width;
        this.dimensions.height = height;
        this.dimensions.depth = depth;
        //we can construct edges/diagonals with 2 points, even though we translate and rotate the shape, the 2 points never change relative to each other
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
        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)
        this.updateMatrices();
    }
    updateMatrices() {
        this.updatePointMatrix();
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
    updatePointMatrix() {
        const width = this.dimensions.width;
        const height = this.dimensions.height;
        const depth = this.dimensions.depth;
        //offsets are so that the shape rotates around it's center rather than the first point
        const centeringX = -(width / 2);
        const centeringY = -(height / 2);
        const centeringZ = -(depth / 2);
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
}
class Box2 {
    constructor(width, height, depth) {
        this.pointMatrix = new matrix(); //Positions of points without any rotation transformations applied to them
        this.edges = []; //pairs of indexes of vertices which are edges of the shape
        this.diagonals = []; //pairs of indexes of vertices which are diagonals
        this.faces = [];
        this.faceColours = {};
        this.outline = false;
        this.dimensions = { width: 5, height: 5, depth: 5 };
        this.scale = 1;
        this.position = { x: 0, y: 0, z: 0 };
        //we need to define our transformation/rotation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
        this.iHat = [1, 0, 0];
        this.jHat = [0, 1, 0];
        this.kHat = [0, 0, 1];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.rotationMatrix = new matrix(); //multiply this by the pointMatrix to get the actual positions of the points on the pseudo grid (physical points)
        this.physicalMatrix = new matrix(); //the points of this object, however they are still relative to origin, they are translating when rendering from camera
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
        const width = this.dimensions.width;
        const height = this.dimensions.height;
        const depth = this.dimensions.depth;
        //offsets are so that the shape rotates around it's center rather than the first point
        const centeringX = -(width / 2);
        const centeringY = -(height / 2);
        const centeringZ = -(depth / 2);
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
    }
    updateMatrices() {
        this.updatePointMatrix();
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}
