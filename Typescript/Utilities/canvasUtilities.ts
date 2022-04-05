const dpi = window.devicePixelRatio;

let canvas: any = undefined;
let c: any = undefined;
let canvasWidth = 0; 
let canvasHeight = 0;
const linkCanvas = (canvasID: string) => {
    canvas = <HTMLCanvasElement>document.getElementById(canvasID);
    c = canvas.getContext('2d')!;

    canvasHeight = document.getElementById(canvasID)!.getBoundingClientRect().height; //Fix blury lines
    canvasWidth = document.getElementById(canvasID)!.getBoundingClientRect().width;
    canvas.setAttribute('height', String(canvasHeight * dpi));
    canvas.setAttribute('width', String(canvasWidth * dpi));

    window.onresize = () => { linkCanvas(canvasID); } //just calling the function to initialise the canvas again
}


//ACTUAL DRAWING FUNCTIONS
const gridX = (x: number) => {
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    return (canvasWidth / 2) + x;
}
const gridY = (y: number) => {  //on the page y = 0 is at the top, however in an actual grid y = 0 is at the bottom
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    return (canvasHeight / 2) - y;
}
const plotPoint = (p: number[], colour: string, label?: string) => {
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    //point will be in format: [x, y]
    c.fillStyle = colour;
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);

    if (label != undefined) {
        c.font = "20px Arial";
        c.fillText(label, gridX(p[0] * dpi)! + 10, gridY(p[1] * dpi)! + 10);
    }
}
const drawLine = (p1: number[], p2: number[], colour: string) => {
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.fillStyle = colour;
    c.beginPath()
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi))
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
}
const drawQuadrilateral = (p1: number[], p2: number[], p3: number[], p4: number[], colour: string) => {
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.lineTo(gridX(p3[0] * dpi), gridY(p3[1] * dpi));
    c.lineTo(gridX(p4[0] * dpi), gridY(p4[1] * dpi));
    c.closePath();
    c.fill();
}
const clearCanvas = () => {
    if (c == undefined) { console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes"); return; }
    c.clearRect(0, 0, canvas.width, canvas.height);
}