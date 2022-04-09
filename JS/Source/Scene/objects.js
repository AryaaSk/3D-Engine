"use strict";
//All shapes are subclasses of class Shape, because an object is just a collection of it's points
//When the camera renders the object is just needs its Physical Matrix (points relative to the origin), so the subclasses are purely for constructing the shape
class Shape {
    //Construction    
    pointMatrix = new matrix(); //pointMatrix is constructed in the subclasses
    //Rotation
    rotationMatrix = new matrix();
    rotation = { x: 0, y: 0, z: 0 };
    updateRotationMatrix() {
        const [rX, rY, rZ] = [(this.rotation.x % 360), (this.rotation.y % 360), (this.rotation.z % 360)];
        this.rotationMatrix = calculateRotationMatrix(rX, rY, rZ);
    }
    //Physical (as if the shape was being rendered around the origin)
    physicalMatrix = new matrix();
    scale = 1;
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
    }
    //Rendering
    position = { x: 0, y: 0, z: 0 };
    showOutline = false;
    showPoints = false;
    faces = []; //stores the indexes of the columns (points) in the physicalMatrix
    showFaceIndexes = false;
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
        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0, 0, 0]);
        this.pointMatrix.addColumn([width, 0, 0]);
        this.pointMatrix.addColumn([width, height, 0]);
        this.pointMatrix.addColumn([0, height, 0]);
        this.pointMatrix.addColumn([0, 0, depth]);
        this.pointMatrix.addColumn([width, 0, depth]);
        this.pointMatrix.addColumn([width, height, depth]);
        this.pointMatrix.addColumn([0, height, depth]);
        const [centeringX, centeringY, centeringZ] = [-(width / 2), -(height / 2), -(depth / 2)];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        //hardcoded values since the points of the shape won't move in relation to each other
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
        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0, 0, 0]);
        this.pointMatrix.addColumn([bottomSideLength, 0, 0]);
        this.pointMatrix.addColumn([bottomSideLength, 0, bottomSideLength]);
        this.pointMatrix.addColumn([0, 0, bottomSideLength]);
        this.pointMatrix.addColumn([bottomSideLength / 2, height, bottomSideLength / 2]);
        const [centeringX, centeringY, centeringZ] = [-(bottomSideLength / 2), -(height / 2), -(bottomSideLength / 2)];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [
            { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" },
            { pointIndexes: [0, 1, 4], colour: "#00ff00" },
            { pointIndexes: [1, 2, 4], colour: "#0000ff" },
            { pointIndexes: [2, 3, 4], colour: "#ffff00" },
            { pointIndexes: [0, 3, 4], colour: "#00ffff" },
        ];
    }
}
class TriangularPrism extends Shape {
    constructor(width, height, depth) {
        super();
        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0, 0, 0]);
        this.pointMatrix.addColumn([width, 0, 0]);
        this.pointMatrix.addColumn([width / 2, height, 0]);
        this.pointMatrix.addColumn([0, 0, depth]);
        this.pointMatrix.addColumn([width, 0, depth]);
        this.pointMatrix.addColumn([width / 2, height, depth]);
        const [centeringX, centeringY, centeringZ] = [-(width / 2), -(height / 2), -(depth / 2)];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [
            { pointIndexes: [0, 1, 2], colour: "#ff0000" },
            { pointIndexes: [0, 2, 5, 3], colour: "#00ff00" },
            { pointIndexes: [0, 1, 4, 3], colour: "#0000ff" },
            { pointIndexes: [1, 2, 5, 4], colour: "#ffff00" },
            { pointIndexes: [3, 4, 5], colour: "#00ffff" }
        ];
    }
}
class ElongatedOctahedron extends Shape {
    constructor(width, height, depth) {
        super();
        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0, 0, 0]); //bottom point
        this.pointMatrix.addColumn([-width / 2, height / 3, 0]); //first pyramid
        this.pointMatrix.addColumn([0, height / 3, depth / 2]);
        this.pointMatrix.addColumn([width / 2, height / 3, 0]);
        this.pointMatrix.addColumn([0, height / 3, -depth / 2]);
        this.pointMatrix.addColumn([-width / 2, height / 3 * 2, 0]); //cuboid in center
        this.pointMatrix.addColumn([0, height / 3 * 2, depth / 2]);
        this.pointMatrix.addColumn([width / 2, height / 3 * 2, 0]);
        this.pointMatrix.addColumn([0, height / 3 * 2, -depth / 2]);
        this.pointMatrix.addColumn([0, height, 0]); //top point
        const [centeringX, centeringY, centeringZ] = [0, -(height / 2), 0];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);
        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
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
    }
}
