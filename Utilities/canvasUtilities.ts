const dpi = window.devicePixelRatio;
const canvas = <HTMLCanvasElement>document.getElementById('renderingWindow');
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
const plotPoint = (p: number[], colour: string, label?: string) => {
    //point will be in format: [x, y]
    c.fillStyle = colour;
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);

    if (label != undefined) {
        c.font = "20px Arial";
        c.fillText(label, gridX(p[0] * dpi) + 10, gridY(p[1] * dpi) + 10);
    }
}
const drawLine = (p1: number[], p2: number[], colour: string) => {
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.fillStyle = colour;
    c.beginPath()
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi))
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
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
const clearCanvas = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}