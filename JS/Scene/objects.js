"use strict";

class Shape {
    constructor() {
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
        this.edgeIndexes = [];
        this.outline = false;
        this.faces = []; //stores the indexes of the columns (points) in the physicalMatrix
    }
    updateRotationMatrix() {
        //XYZ Euler rotation, Source: https://support.zemax.com/hc/en-us/articles/1500005576822-Rotation-Matrix-and-Tilt-About-X-Y-Z-in-OpticStudio
        const rX = this.rotation.x % 360;
        const rY = this.rotation.y % 360;
        const rZ = this.rotation.z % 360;
        const iHat = [1, 0, 0];
        const jHat = [0, 1, 0];
        const kHat = [0, 0, 1];
        iHat[0] = cos(rY) * cos(rZ); //x-axis (iHat)
        iHat[1] = cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ);
        iHat[2] = sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ);
        jHat[0] = -(cos(rY)) * sin(rZ); //y-axis (jHat)
        jHat[1] = cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ);
        jHat[2] = sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ);
        kHat[0] = sin(rY); //z-axis (kHat)
        kHat[1] = -(sin(rX)) * cos(rY);
        kHat[2] = cos(rX) * cos(rY);
        //Set the unit vectors onto the singular rotation matrix
        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn(iHat);
        this.rotationMatrix.addColumn(jHat);
        this.rotationMatrix.addColumn(kHat);
    }
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
    }
    updateMatrices() {
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}
class Box extends Shape {
    //populate the pointMatrix, once we have done that we just call updateRotationMatrix() and updatePhysicalMatrix()
    //after populating pointMatrix, we need to update the edges, and faceIndexes
    constructor(width, height, depth) {
        super();
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
        this.setEdgesFaces();
        this.updateMatrices();
    }
    setEdgesFaces() {
        //hardcoded values since the points of the shape won't move in relation to each other
        this.edgeIndexes = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
        ];
        this.faces = [
            { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" },
            { pointIndexes: [1, 2, 6, 5], colour: "#00ff00" },
            { pointIndexes: [2, 3, 7, 6], colour: "#0000ff" },
            { pointIndexes: [0, 1, 5, 4], colour: "#ffff00" },
            { pointIndexes: [0, 3, 7, 4], colour: "#00ffff" },
            { pointIndexes: [4, 5, 6, 7], colour: "#ff00ff" },
        ];
    }
}
class SquareBasedPyramid extends Shape {
    constructor(bottomSideLength, height) {
        super();
        const centeringX = -(bottomSideLength / 2);
        const centeringY = -(height / 2);
        const centeringZ = -(bottomSideLength / 2);
        this.pointMatrix.addColumn([0 + centeringX, 0 + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([bottomSideLength + centeringX, 0 + centeringY, 0 + centeringZ]);
        this.pointMatrix.addColumn([bottomSideLength + centeringX, 0 + centeringY, bottomSideLength + centeringZ]);
        this.pointMatrix.addColumn([0 + centeringX, 0 + centeringY, bottomSideLength + centeringZ]);
        this.pointMatrix.addColumn([bottomSideLength / 2 + centeringX, height + centeringY, bottomSideLength / 2 + centeringZ]);
        this.setEdgesFaces();
        this.updateMatrices();
    }
    setEdgesFaces() {
        this.edgeIndexes = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
        ];
        this.faces = [
            { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" },
            { pointIndexes: [0, 1, 4], colour: "#00ff00" },
            { pointIndexes: [1, 2, 4], colour: "#0000ff" },
            { pointIndexes: [2, 3, 4], colour: "#ffff00" },
            { pointIndexes: [0, 3, 4], colour: "#00ffff" },
        ];
    }
}
