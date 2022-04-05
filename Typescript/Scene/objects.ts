//All shapes are subclasses of class Shape, because an object is just a collection of it's points
//When the camera renders the object is just needs its Physical Matrix (points relative to the origin), so the subclasses are purely for constructing the shape




/*
class Shape
{
    type: String = "";

    //Point Matrix
    pointMatrix = new matrix()
    edges: { p1Index: number, p2Index: number }[] = [];
    diagonals: { p1Index: number, p2Index: number }[] = [];
    faces: { diagonal1: { p1Index: number, p2Index: number }, diagonal2: { p1Index: number, p2Index: number }, facingAxis: string, center: number[] }[] = [];

    //Appearance
    faceColours: { [k: string] :  string } = {};
    outline: boolean = false;

    //ROTATION
    rotationMatrix = new matrix();
    rotation: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };

    private iHat: number[] = [1, 0, 0]; //Unit Vectors
    private jHat: number[] = [0, 1, 0];
    private kHat: number[] = [0, 0, 1];

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
        this.rotationMatrix.setValue(0, 2, this.iHat[2])
        this.rotationMatrix.setValue(1, 0, this.jHat[0]);
        this.rotationMatrix.setValue(1, 1, this.jHat[1]);
        this.rotationMatrix.setValue(1, 2, this.jHat[2]);
        this.rotationMatrix.setValue(2, 0, this.kHat[0]);
        this.rotationMatrix.setValue(2, 1, this.kHat[1]);
        this.rotationMatrix.setValue(2, 2, this.kHat[2]);
    }

    //PHYSICAL MATRIX
    physicalMatrix = new matrix();
    position: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0};
    scale: number = 1;
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
    }
}

class Box extends Shape
{
    updateMatrices() {
        this.updatePointMatrix();
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }

    //All we do in the Box subclass is construct the Box and put the coordinates into the physical matrix
    dimensions: {width: number, height: number, depth: number} = {width: 5, height: 5, depth: 5};
    updatePointMatrix()
    {
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

    constructor(width: number, height: number, depth: number) {
        super();
        this.type = "box";

        this.dimensions.width = width;
        this.dimensions.height = height;
        this.dimensions.depth = depth;

        //we can construct edges/diagonals with 2 points, even though we translate and rotate the shape, the 2 points never change relative to each other
        this.edges = [{ p1Index: 0, p2Index: 1 }, { p1Index: 1, p2Index: 2 }, { p1Index: 2, p2Index: 3 }, { p1Index: 3, p2Index: 0 }, { p1Index: 0, p2Index: 4 }, { p1Index: 1, p2Index: 5 }, { p1Index: 2, p2Index: 6 }, { p1Index: 3, p2Index: 7 }, { p1Index: 4, p2Index: 5 }, { p1Index: 5, p2Index: 6 }, { p1Index: 6, p2Index: 7 }, { p1Index: 7, p2Index: 4 }]
        this.diagonals = [{ p1Index: 0, p2Index: 2 }, { p1Index: 0, p2Index: 5 }, { p1Index: 0, p2Index: 7 }, { p1Index: 6, p2Index: 1 }, { p1Index: 6, p2Index: 3 }, { p1Index: 6, p2Index: 4 }];
        this.diagonals.push({ p1Index: 1, p2Index: 3 }, { p1Index: 1, p2Index: 4 }, { p1Index: 3, p2Index: 4 }, { p1Index: 2, p2Index: 5 }, { p1Index: 2, p2Index: 7 }, { p1Index: 5, p2Index: 7 });
        this.faces = [
            { diagonal1: this.diagonals[0], diagonal2: this.diagonals[0 + 6], facingAxis: "-z", center: [0, 0, 0] }, //center's are calculated when the object is rendered by the camera
            { diagonal1: this.diagonals[1], diagonal2: this.diagonals[1 + 6], facingAxis: "-y", center: [0, 0, 0] },
            { diagonal1: this.diagonals[2], diagonal2: this.diagonals[2 + 6], facingAxis: "-x", center: [0, 0, 0] },
            { diagonal1: this.diagonals[3], diagonal2: this.diagonals[3 + 6], facingAxis: "+x", center: [0, 0, 0] },
            { diagonal1: this.diagonals[4], diagonal2: this.diagonals[4 + 6], facingAxis: "+y", center: [0, 0, 0] },
            { diagonal1: this.diagonals[5], diagonal2: this.diagonals[5 + 6], facingAxis: "+z", center: [0, 0, 0] }
        ]
        //- / + refers to the direction it is pointing in, for example -z means it is pointing towards the camera at default rotations

        this.faceColours = {  //assign a colour to each face (-z, -y, -x, +x, +y, +z)
            "-z" : "#ff0000",
            "-y" : "#00ff00",
            "-x" : "#0000ff",
            "+x" : "#ffff00",
            "+y" : "#00ffff",
            "+z" : "#ff00ff",
        }

        this.rotationMatrix = new matrix();
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)

        this.updateMatrices();
    }
}
*/








class Shape
{
    //Construction    
    pointMatrix = new matrix(); //pointMatrix is constructed in the subclasses
    
    //Rotation
    rotationMatrix = new matrix();
    rotation: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };
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

    //Physical (as if the shape was being rendered around the origin)
    physicalMatrix = new matrix();
    scale = 1;
    updatePhysicalMatrix() {
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(this.scale);
    }

    //Rendering
    position: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0};
    edgeIndexes: number[][] = [];
    outline: boolean = false;
    faces: { pointIndexes: number[], colour: string }[]  = []; //stores the indexes of the columns (points) in the physicalMatrix

    updateMatrices()
    {
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}

class Box extends Shape
{
    //populate the pointMatrix, once we have done that we just call updateRotationMatrix() and updatePhysicalMatrix()
    //after populating pointMatrix, we need to update the edges, and faceIndexes

    constructor(width: number, height: number, depth: number)
    {
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

    private setEdgesFaces()
    {
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
        ]
    }
}

class SquareBasedPyramid extends Shape
{
    constructor(bottomSideLength: number, height: number)
    {
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

    private setEdgesFaces()
    {
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
        ]
    }
}