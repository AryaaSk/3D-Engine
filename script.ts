//TO ENABLE AUTO RELOAD, RUN LIVE-SERVER, AND CLICK CMD+SHIFT+B, THEN CLICK WATCH TSC: WATCH

const dpi = window.devicePixelRatio;
const canvas = <HTMLCanvasElement> document.getElementById('renderingWindow');
const c = canvas.getContext('2d')!;

const canvasHeight = document.getElementById('renderingWindow')!.getBoundingClientRect().height; //Fix blury lines
const canvasWidth = document.getElementById('renderingWindow')!.getBoundingClientRect().width;
canvas.setAttribute('height', String(canvasHeight * dpi));
canvas.setAttribute('width', String(canvasWidth * dpi));


//ACTUAL DRAWING FUNCTIONS
const gridX = (x: number) => { 
    return (canvasWidth / 2) + x;
}
const gridY = (y: number) => {  //on the page y = 0 is at the top, however in an actual grid y = 0 is at the bottom
    return (canvasHeight / 2) - y;
}
const drawLine = (p1: number[], p2: number[]) => {
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.beginPath()
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi))
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
}
const plotPoint = (p: number[]) => {
    //point will be in format: [x, y]
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
}
const drawQuadrilateral = (p1: number[], p2: number[], p3: number[], p4: number[], colour: string) => {
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.lineTo(gridX(p3[0] * dpi), gridY(p3[1] * dpi));
    c.lineTo(gridX(p4[0] * dpi), gridY(p4[1] * dpi));
    c.closePath();
    c.fill();
}





//MATRIX FUNCTIONS
class matrix
{
    /* The data will be stored like on the left, on the right is how the actual matrix will look if you wrote it in mathmatics
   [[1, 0],          [ [1   [0   [0
    [0, 1]      =       0],  1],  0] ]
    [0, 0]]                
    */
    private data: number[][] = []; /* DO NOT SET THIS EXPLICITLY, USE THE FUNCTIONS */
    width: number = 0; //num of columns
    height: number = 0; //num of rows

    addColumn(nums: number[])
    { 
        this.data.push(nums);
        this.height = nums.length;
        this.width += 1;
    }
    addRow(nums: number[])
    {
        //to add a row you just need to add the given nums to the end of each column, we first need to check that nums == width
        if (nums.length != this.width) { console.error("Unable to add row since length of inputs is not equal to number of columns"); return; }

        for (let i in nums)
        { this.data[i].push(nums[i]); i += 1; }
        this.height += 1;
    }

    printMatrix()
    {
        //loop through the rows, and inside of that loop, loop through all the columns
        let finalOutput = "Matrix:";
        let currentRow = 0;
        while (currentRow != this.height)
        {
            let currentLineOutput = "\n"
            let currentColumn = 0;
            while (currentColumn != this.width)
            {
                currentLineOutput = currentLineOutput + (this.data[currentColumn][currentRow]) + "      "; 
                currentColumn += 1;
            }
            
            finalOutput = finalOutput + currentLineOutput;
            currentRow += 1;
        }
        console.log(finalOutput);
    }

    getColumn(columnIndex: number)
    { return this.data[columnIndex]; }
    getRow(rowIndex: number) //loop through data, and get the element at rowIndex for each one
    { 
        let returnArray: number[] = [];
        for (let i in this.data)
        { returnArray.push(this.data[i][rowIndex]); }
        return returnArray;
    }
    setValue(columnIndex: number, rowIndex: number, value: number)
    { this.data[columnIndex][rowIndex] = value; }
    getValue(columnIndex: number, rowIndex: number)
    { return this.data[columnIndex][rowIndex]; }

    scaleUp(factor: number)
    { for (let i in this.data) { for (let a in this.data[i]) { this.data[i][a] *= factor; } } }

    constructor() {};
}

const multiplyMatrixs = (m1: matrix, m2: matrix) =>
{
    //check that m1.width == m2.height, the result matrix will be m1.height x m2.width
    //create result matrix:
    const resultMatrix = new matrix();
    const rMatrixHeight = m1.height;
    const rMatrixWidth = m2.width;

    for (let _ = 0; _ != rMatrixWidth; _ += 1 )
    {
        const newColumn: number[] = [];
        for (let __ = 0; __ != rMatrixHeight; __ += 1 )
        { newColumn.push(0); }
        resultMatrix.addColumn(newColumn);
    }

    //now loop through each element in the result matrix with the rowIndex and columnIndex, and calculate it
    let columnIndex = 0;
    while (columnIndex != resultMatrix.width)
    {
        let rowIndex = 0;
        while (rowIndex != resultMatrix.height)
        {
            const currentRow = m1.getRow(rowIndex);
            const currentColumn = m2.getColumn(columnIndex); //these 2 should be the same length

            let value = 0;
            let i = 0;
            while (i != currentRow.length)
            {
                value += currentRow[i] * currentColumn[i];
                i += 1;
            }
            resultMatrix.setValue(columnIndex, rowIndex, value);

            rowIndex += 1;
        }
        columnIndex += 1;
    }

    return resultMatrix
}

const toRadians = (angle: number) => { return angle * (Math.PI / 180); }
class Box
{
    constructor(width: number, height: number, depth: number) {
        //Populate the pointMatrix
        const offsetX = -(width / 2);
        const offsetY = -(height / 2);
        const offsetZ = 0;

        this.pointMatrix.addColumn([0 + offsetX, 0 + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, 0 + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, height + offsetY, 0 + offsetZ]);
        this.pointMatrix.addColumn([0 + offsetX, height + offsetY, 0 + offsetZ]);

        this.pointMatrix.addColumn([0 + offsetX, 0 + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, 0 + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([width + offsetX, height + offsetY, depth + offsetZ]);
        this.pointMatrix.addColumn([0 + offsetX, height + offsetY, depth + offsetZ]);

        //This is what the default rotation is when all rotations are set to 0
        this.rotationMatrix.addColumn([1, 0, 0]); //x (iHat)
        this.rotationMatrix.addColumn([0, 1, 0]); //y (jHat)
        this.rotationMatrix.addColumn([0, 0, 1]); //z (kHat)

        this.updateRotationMatrix()
    }

    //first we need to define our transformation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
    //      x, y  (Physical grid)
    private iHat: number[] = [1, 0, 0];
    private jHat: number[] = [0, 1, 0];
    private kHat: number[] = [0, 0, 1];

    private pointMatrix = new matrix() //Positions of points without any rotation transformations applied to them

    rotationX = 0;
    rotationY = 0;
    rotationZ = 0;
    private rotationMatrix = new matrix() //multiply this by the pointMatrix to get the actual positions of the points on the pseudo grid (physical points)

    private updateRotationMatrix()
    {
        //Source: http://eecs.qmul.ac.uk/~gslabaugh/publications/euler.pdf
        //Using the ZYX Euler angle rotation matrix

        //x-axis (iHat)
        this.iHat[0] = Math.cos(toRadians(this.rotationY)) * Math.cos(toRadians(this.rotationZ));
        this.iHat[1] = Math.cos(toRadians(this.rotationY)) * Math.sin(toRadians(this.rotationZ));
        this.iHat[2] = -(Math.sin(toRadians(this.rotationY)));

        //y-axis (jHat)
        this.jHat[0] = Math.sin(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationY)) * Math.cos(toRadians(this.rotationZ)) - Math.cos(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationZ));
        this.jHat[1] = Math.sin(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationY)) * Math.sin(toRadians(this.rotationZ)) + Math.cos(toRadians(this.rotationX)) * Math.cos(toRadians(this.rotationZ));
        this.jHat[2] = Math.sin(toRadians(this.rotationX) * Math.cos(toRadians(this.rotationY)));

        //z-axis (kHat)
        this.kHat[0] = Math.cos(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationY)) * Math.cos(toRadians(this.rotationZ)) + Math.sin(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationZ));
        this.kHat[1] = Math.cos(toRadians(this.rotationX)) * Math.sin(toRadians(this.rotationY)) * Math.sin(toRadians(this.rotationZ)) - Math.sin(toRadians(this.rotationX)) * Math.cos(toRadians(this.rotationZ))
        this.kHat[2] = Math.cos(toRadians(this.rotationX) * Math.cos(toRadians(this.rotationY)))

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

        this.updatePhysicalMatrix();
    }

    physicalMatrix = new matrix(); //the physical points that we plot on the screen
    private updatePhysicalMatrix()
    {  
        this.physicalMatrix = multiplyMatrixs(this.rotationMatrix, this.pointMatrix);
        this.physicalMatrix.scaleUp(camera.scale);
    }

    updateMatrices()
    {
        this.updateRotationMatrix();
        this.updatePhysicalMatrix();
    }
}

class Camera
{
    scale = 1;
    position = [0, 0, 0];

    render(object: Box)
    {
        //use the object's physicalMatrix, and just plot the points
        //loop through the columns, and plot the points with the scale transformation applied to them
        for (let i = 0; i != object.physicalMatrix.width; i += 1)
        {  const point = object.physicalMatrix.getColumn(i);  plotPoint(point);  }
    }

    constructor( ) {  };
}



//RENDERING AN OBJECT
const camera = new Camera();
camera.position = [0, 0, -5]
camera.scale = 1;

//create our cube matrix (Pseudo Grid)
const cube = new Box(300, 500, 200)
cube.rotationX = 0;
cube.rotationY = 0;
cube.rotationZ = 0;
cube.updateMatrices();

camera.render(cube);

/*
//to draw shapes we just need to draw rectangles between the points, but we need to draw the furthest ones first so we overlap them (will develop the sorting algorithm later)
let diagonals: {point1: number[], point2: number[], center: number[]}[] = [];
let edges: {point1: number[], point2: number[], center: number[]}[] = [];

let faces: {[k: string] : {diagonal1: {point1: number[], point2: number[], center: number[]}, diagonal2: {point1: number[], point2: number[], center: number[]}, constantAxis: string}} = {};
//we get the faces by going through diagonals, and checking the centers

//we need to look for diagonals (only 2 of the axis change)
for (let i = 0; i != cubeMatrix.width; i += 1)
{
    const point1 = cubeMatrix.getColumn(i); //[x, y, z]
    
    //loop through all the others, and check if only 2 of the axis changed
    for (let a = 0; a != cubeMatrix.width; a += 1)
    {
        if (a == i) { continue; }
        const point2 = cubeMatrix.getColumn(a);

        const condition1 = point1[0] == point2[0] && point1[1] != point2[1] && point1[2] != point2[2] //x remains constant
        const condition2 = point1[0] != point2[0] && point1[1] == point2[1] && point1[2] != point2[2] //y remains constant
        const condition3 = point1[0] != point2[0] && point1[1] != point2[1] && point1[2] == point2[2] //z remains constant

        let result = 0; //converting to int so that I can add them together and make sure that only 1 of them is true
        let constantAxis = "";
        if (condition1 == true) { result += 1; constantAxis = "x"; }
        if (condition2 == true) { result += 1; constantAxis = "y"; }
        if (condition3 == true) { result += 1; constantAxis = "z"; }

        const center = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2, (point1[2] + point2[2]) / 2]

        if (result == 1)
        { 
            //before adding it we flip it and check if it already exist
            const flipped = {point1: point2, point2: point1};
            let containsAlready = false;
            for (let b in diagonals)
            { if (diagonals[b].point1 == flipped.point1 && diagonals[b].point2 == flipped.point2) { containsAlready = true; break; } }

            if (containsAlready == false) { 
                diagonals.push({point1: point1, point2: point2, center: center});

                if (faces[String(center)] == undefined)
                { faces[String(center)] = {diagonal1: {point1: point1, point2: point2, center: center}, diagonal2: {point1: [], point2: [], center: []}, constantAxis: constantAxis}}
                else 
                { faces[String(center)].diagonal2 = {point1: point1, point2: point2, center: center}; }
            }
        }

        else
        {
            //we can also check if it is a line (change in 1 axis)
            const condition1 = point1[0] != point2[0] && point1[1] == point2[1] && point1[2] == point2[2] //change in x axis
            const condition2 = point1[0] == point2[0] && point1[1] != point2[1] && point1[2] == point2[2] //change in y axis
            const condition3 = point1[0] == point2[0] && point1[1] == point2[1] && point1[2] != point2[2] //change in z axis

            if (condition1 || condition2 || condition3)
            { 
                //before adding it we flip it and check if it already exist
                let containsAlready = false;
                for (let b in edges)
                { if (JSON.stringify(edges[b].center) == JSON.stringify(center)) { containsAlready = true; break; } }

                if (containsAlready == false) { edges.push({point1: point1, point2: point2, center: center}); }
            }
        }
    }
}



//now lets draw lines with these
for (let i in edges)
{
    const line = edges[i];
    const point1 = line.point1;
    const point2 = line.point2;

    //these points are in the pseudo grid, we need to multiply the tMatrix by them to get physical points
    const pointMatrix = new matrix();
    pointMatrix.addColumn(point1);
    pointMatrix.addColumn(point2);
    const physicalPoints = multiplyMatrixs(camera.tMatrix, pointMatrix)
    physicalPoints.scaleUp(camera.scale);

    const phyPoint1 = physicalPoints.getColumn(0);
    const phyPoint2 = physicalPoints.getColumn(1);

    drawLine(phyPoint1, phyPoint2)
}



//draw the faces, but we have to order the keys (the centers), based on the distance from camera in the z-axis
const centers = Object.keys(faces);
const centersParsed: number[][] = []; //the centers will be strings so we need to parse them
for (let i in centers) {  
    const splitCenter = centers[i].split(",");
    centersParsed.push([ Number(splitCenter[0]), Number(splitCenter[1]), Number(splitCenter[2]) ]);
}

let sortedCenters: string[] = [];
while (centersParsed.length != 0)
{
    let furthestZIndex = 0;
    for (let i = 0; i != centersParsed.length; i += 1 )
    { 
        if ((centersParsed[i][2] - camera.position[2] > (centersParsed[furthestZIndex][2] - camera.position[2])))
        { furthestZIndex = i; }
    }

    let sortedString = JSON.stringify(centersParsed[furthestZIndex]);
    sortedString = sortedString.replace("[", "");
    sortedString = sortedString.replace("]", "");
    sortedCenters.push(sortedString);
    centersParsed.splice(furthestZIndex, 1);
}

console.log(sortedCenters);

//TODO: SORTED BASED ON DISTANCE TO CAMERA POSITION, RATHER THAN JUST DISTANCE TO CAMERA'S Z POSITION
//WILL NEED TO MAKE A FUNCTION THAT TAKES IN P1 AND P2 AND RETURS DISTANCE

for (let i in sortedCenters)
{
    const center = sortedCenters[i];
    const diagonal1 = faces[center].diagonal1;
    const diagonal2 = faces[center].diagonal2;
    const constantAxis = faces[center].constantAxis;

    //since we know the diagonals cross over, to draw the face we want point1 of diagonal1, then point1 of diagonal2, then point2 of diagonal1, then point2 of diagonal2
    const points: number[][] = [diagonal1.point1, diagonal2.point1, diagonal1.point2, diagonal2.point2];

    //now we just need to convert these points into physical points, by multiplying the tMatrix by them
    const pointMatrix = new matrix();
    for (let i in points)
    { pointMatrix.addColumn(points[i]);}

    const physicalPointsMatrix = multiplyMatrixs(camera.tMatrix, pointMatrix); //these are our real points
    physicalPointsMatrix.scaleUp(camera.scale);
    points[0] = physicalPointsMatrix.getColumn(0);
    points[1] = physicalPointsMatrix.getColumn(1);
    points[2] = physicalPointsMatrix.getColumn(2);
    points[3] = physicalPointsMatrix.getColumn(3);

    let colour = ""
    if (constantAxis == "x") { colour = "#ff0000"; } //sides facing in the x axis
    else if (constantAxis == "y") { colour = "#00ff00"; } //y axis
    else if (constantAxis == "z") { colour = "#0000ff"; } //z axis

    drawQuadrilateral(points[0], points[1], points[2], points[3], colour);
}
*/