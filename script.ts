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





//RENDERING AN OBJECT
//first we need to define our transformation matrix, iHat = x axis, jHat = y axis, kHat = z axis, these are vectors
//            x, y  (Physical grid)
const iHat = [1, 0];
const jHat = [0, 0.7];
const kHat = [0, 0.3];

const tMatrix = new matrix(); //transformation matrix, cube pointing slightly forward
tMatrix.addColumn(iHat);
tMatrix.addColumn(jHat);
tMatrix.addColumn(kHat);


//create our cube matrix (Pseudo Grid)
const cubeMatrix = new matrix();
cubeMatrix.addColumn([0, 0, 0]);
cubeMatrix.addColumn([1, 0, 0]);
cubeMatrix.addColumn([1, 1, 0]);
cubeMatrix.addColumn([0, 1, 0]);

cubeMatrix.addColumn([0, 0, 1]);
cubeMatrix.addColumn([1, 0, 1]);
cubeMatrix.addColumn([1, 1, 1]);
cubeMatrix.addColumn([0, 1, 1]);

//tMatrix.printMatrix();
//cubeMatrix.printMatrix();

//By multiplying the tMatrix and cubeMatrix, you get the coordinates of the cube on the physical graph
const rMatrix = multiplyMatrixs(tMatrix, cubeMatrix);
//rMatrix.printMatrix();

//loop through the columns, and plot the points with the scale transformation applied to them
const scale = 100;
for (let i = 0; i != rMatrix.width; i += 1)
{
    const points = rMatrix.getColumn(i);
    points[0] = points[0] * scale;
    points[1] = points[1] * scale;

    plotPoint(points);
}