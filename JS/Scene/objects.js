"use strict";
//WHEN DOING OTHER SHAPES I FOUND THIS QUESTIONS: https://math.stackexchange.com/questions/3635017/calculate-edge-and-plane-of-a-box-given-its-vertices
//RESEARCH ABOUT PAIRWISE DOT PRODUCTS, IT MAY HELP WHEN DEALING WITH THINGS LIKE PRISMS AND OTHER SHAPES
class Box {
    constructor(width, height, depth) {
        this.pointMatrix = new matrix(); //Positions of points without any rotation transformations applied to them
        this.diagonals = []; //pairs of indexes of vertices which are diagonals
        this.faces = [];
        this.edges = []; //pairs of indexes of vertices which are edges of the shape
        this.dimensions = { width: 5, height: 5, depth: 5 };
        this.position = { x: 0, y: 0, z: 0 };
        //we need to define our transformation/rotation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
        //      x, y  (Physical grid)
        this.iHat = [1, 0, 0];
        this.jHat = [0, 1, 0];
        this.kHat = [0, 0, 1];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.rotationMatrix = new matrix(); //multiply this by the pointMatrix to get the actual positions of the points on the pseudo grid (physical points)
        this.physicalMatrix = new matrix(); //the physical points that we plot on the screen
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
        //This is what the default rotation is when all rotations are set to 0
        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)
        this.updateMatrices();
    }
    updatePointMatrix() {
        //update the point matrix here
        const width = this.dimensions.width;
        const height = this.dimensions.height;
        const depth = this.dimensions.depth;
        //Populate the pointMatrix, offsets are so that the shape rotates around it's center rather than the first point
        const centeringX = -(width / 2);
        const centeringY = -(height / 2);
        const centeringZ = -(depth / 2); //this doesn't really matter since the z-axis can't get rendered anyway
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
        this.rotationMatrix.setValue(2, 0, this.kHat[0]); //FOR SOME REASON THE KHAT IS ROTATING AROUND THE WRONG AXIS
        this.rotationMatrix.setValue(2, 1, this.kHat[1]);
        this.rotationMatrix.setValue(2, 2, this.kHat[2]);
    }
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        //this is where we apply the translations
        for (let i = 0; i != this.physicalMatrix.width; i += 1) {
            const point = this.physicalMatrix.getColumn(i);
            this.physicalMatrix.setValue(i, 0, point[0] + this.position.x);
            this.physicalMatrix.setValue(i, 1, point[1] + this.position.y);
            this.physicalMatrix.setValue(i, 2, point[2] + this.position.z);
        }
        this.physicalMatrix.scaleUp(camera.scale);
    }
    updateMatrices() {
        this.updatePointMatrix();
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}
