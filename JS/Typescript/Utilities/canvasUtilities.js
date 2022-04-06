"use strict";
let dpi = 1; //window.devicePixelRatio; //it is too laggy when dpi >1
let canvas = undefined;
let c = undefined;
let canvasWidth = 0;
let canvasHeight = 0;
const linkCanvas = (canvasID) => {
    canvas = document.getElementById(canvasID);
    c = canvas.getContext('2d');
    canvasHeight = document.getElementById(canvasID).getBoundingClientRect().height; //Fix blury lines
    canvasWidth = document.getElementById(canvasID).getBoundingClientRect().width;
    canvas.setAttribute('height', String(canvasHeight * dpi));
    canvas.setAttribute('width', String(canvasWidth * dpi));
    window.onresize = () => { linkCanvas(canvasID); }; //just calling the function to initialise the canvas again
};
//ACTUAL DRAWING FUNCTIONS
const gridX = (x) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasWidth / 2) + x;
};
const gridY = (y) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    return (canvasHeight / 2) - y;
};
const plotPoint = (p, colour, label) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    //point will be in format: [x, y]
    c.fillStyle = colour;
    c.fillRect(gridX(p[0] * dpi), gridY(p[1] * dpi), 10, 10);
    if (label != undefined) {
        c.font = "20px Arial";
        c.fillText(label, gridX(p[0] * dpi) + 10, gridY(p[1] * dpi) + 10);
    }
};
const drawLine = (p1, p2, colour) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    //points will be in format: [x, y]
    //I need to convert the javascript x and y into actual grid x and y
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(p1[0] * dpi), gridY(p1[1] * dpi));
    c.lineTo(gridX(p2[0] * dpi), gridY(p2[1] * dpi));
    c.stroke();
};
const drawShape = (points, colour, outline) => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    if (points.length < 3) {
        console.error("Cannot draw shape, need at least 3 points to draw a shape");
        return;
    }
    c.fillStyle = colour;
    c.beginPath();
    c.moveTo(gridX(points[0][0] * dpi), gridY(points[0][1] * dpi));
    for (let pointsIndex = 1; pointsIndex != points.length; pointsIndex += 1) {
        c.lineTo(gridX(points[pointsIndex][0] * dpi), gridY(points[pointsIndex][1] * dpi));
    }
    c.closePath();
    c.fill();
    if (outline == true) {
        for (let i = 1; i != points.length; i += 1) {
            drawLine(points[i - 1], points[i], "#000000");
        }
        drawLine(points[points.length - 1], points[0], "000000"); //to cover the line from last point to first point
    }
};
const clearCanvas = () => {
    if (c == undefined) {
        console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
        return;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
};
