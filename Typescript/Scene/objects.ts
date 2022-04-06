//All shapes are subclasses of class Shape, because an object is just a collection of it's points
//When the camera renders the object is just needs its Physical Matrix (points relative to the origin), so the subclasses are purely for constructing the shape
class Shape
{
    //Construction    
    pointMatrix = new matrix(); //pointMatrix is constructed in the subclasses
    
    //Rotation
    rotationMatrix = new matrix();
    rotation: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };
    updateRotationMatrix() {
        //XYZ Euler rotation, Source: https://support.zemax.com/hc/en-us/articles/1500005576822-Rotation-Matrix-and-Tilt-About-X-Y-Z-in-OpticStudio
        const [rX, rY, rZ] = [(this.rotation.x % 360), (this.rotation.y % 360), (this.rotation.z % 360)]

        const iHat = [cos(rY) * cos(rZ), cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ), sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ)]; //x-axis (iHat)
        const jHat = [-(cos(rY)) * sin(rZ), cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ), sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ)]; //y-axis (jHat)
        const kHat = [sin(rY), -(sin(rX)) * cos(rY), cos(rX) * cos(rY)]; //z-axis (kHat)

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
    showFaces: boolean = false;

    updateMatrices() {
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

        this.setEdgesFaces();
        this.updateMatrices();
    }
    private setEdgesFaces()
    {
        //hardcoded values since the points of the shape won't move in relation to each other
        this.edgeIndexes = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 5], [2, 6], [3, 7],
            [4, 5], [5, 6], [6, 7], [7, 4]
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

        this.pointMatrix = new matrix();
        this.pointMatrix.addColumn([0, 0, 0]);
        this.pointMatrix.addColumn([bottomSideLength, 0, 0]);
        this.pointMatrix.addColumn([bottomSideLength, 0, bottomSideLength]);
        this.pointMatrix.addColumn([0, 0, bottomSideLength]);
        this.pointMatrix.addColumn([bottomSideLength / 2, height, bottomSideLength / 2]);

        const [centeringX, centeringY, centeringZ] = [-(bottomSideLength / 2), -(height / 2), -(bottomSideLength / 2)];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setEdgesFaces();
        this.updateMatrices();
    }
    private setEdgesFaces()
    {
        this.edgeIndexes = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4], [2, 4], [3, 4],
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

class TriangularPrism extends Shape
{
    constructor(width: number, height: number, depth: number)
    {
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

        this.setEdgesFaces();
        this.updateMatrices();
    }

    private setEdgesFaces()
    {
        this.edgeIndexes = [
            [0, 1], [1, 2], [2, 0],
            [0, 3], [1, 4], [2, 5],
            [3, 4], [4, 5], [5, 3]
        ];

        this.faces = [
            { pointIndexes: [0, 1, 2], colour: "#ff0000" },

            { pointIndexes: [0, 2, 5, 3], colour: "#00ff00" },
            { pointIndexes: [0, 1, 4, 3], colour: "#0000ff" },
            { pointIndexes: [1, 2, 5, 4], colour: "#ffff00" },

            { pointIndexes: [3, 4, 5], colour: "#00ffff" }
        ]
    }
}