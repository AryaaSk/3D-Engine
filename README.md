# Aryaa 3D: A 3D Library which uses Parallel or Perspective Projection, and comes with it's own Object Builder/Editor

**I just made this to learn more about 3D rendering/modelling, and Matrix transformations**\
If you want to know how it works go here [Rendering Pipeline](Docs/Pipeline.md)

### Table of Contents
- [Importing](#Importing)
- [Setup](#Setup)
- [Creating Objects](#Creating-an-Object)
- [Camera](#Camera)
- [Rendering](#Rendering)
- [Usage](#Usage)

## Importing
### CDN
To import the library with CDN, just copy this script tag into your HTML head *(Make sure to do this before using it in another JS file)*.
```javascript
<script src="https://aryaask.github.io/3D-Engine/Source/aryaa3D.js"></script>

<script src="yourownjsfile.js" defer></script>
```
*You should add a defer tag on your own file, since you will need to wait for the canvas element to load into the DOM*

### Typescript
Alternatively if you want to use typescript defenitions with this library, then you can just download the [aryaa3D Source file](Source/aryaa3D.ts), and then you can compile it into JS and use it in your projeect
### Python
I have ported this library over to python. To get started go to the [PythonPort](PythonPort) Folder, and read the README


## Setup
Then create a canvas element in the HTML DOM with an ID, I used "renderingWindow"
```javascript
<canvas id="renderingWindow"></canvas>
```
You can apply whatever CSS styles you want to this element, such as width and height

Then in JS/TS, use the linkCanvas(canvasID: string) function with the same ID before doing anything
```javascript
linkCanvas("renderingWindow");
```

## Creating an Object
I have not made a lot of inbuilt objects, however it is very easy to add/create more, to add more you can look at the [customShapes.js](ShapeBuilder/customShapes.js) file, which contains some classes of extra objects, to use them just copy and paste them into your code, and then use it like any other shape.\
If you want to create your own custom shapes/objects read about the Shape Builder in the [Shape Builder](Docs/buildingShapes.md).

**In this example I will create a box, the only thing you may have to change for other objects is the dimensions you pass in when creating them**

To create a box the user passes in 3 arguments, width, height and depth (for a pyramid it is just the bottomSideLength and height):
```javascript
const cube = new Box(100, 100, 100);
const pyramid = new SquareBasedPyramid(50, 100); //this is how you make a pyramid
```

You can transform the box using its rotation, scale and position attributes:
```javascript
cube.rotation = { x: -20, y: -20, z: 0};
cube.scale = 2;
cube.position = { x: 200, y: 0, z: 0 };
```

You can set the rotation using Euler Angles or Quaternions
```javascript
cube.rotation = { x: -20, y: -20, z: 0};
cube.updateQuaternion(); //If you change using Euler Angles, then make sure to call the updateQuaternion() function

cube.quaternion = { x: -0.171, y: -0.171, z: 0.0302, w: 0.970 };
```

If you change the rotation or scale then you need to apply the changes using:
```javascript
cube.updateMatrices();
```

You can also change the appearance of the object using the faces property. Each faces each have their own index, if you are not sure which index is what face, you can set the showFaceIndexes property to true, and then you will be able to see which index is which face, making it easy to set the correct colour to the correct face:
```javascript
cube.showFaceIndexes = true;
cube.setColour("#0000ff"); //makes the shape blue
cube.faces[0].colour = "#ff0000";
```

You can also make a face transparent:
```javascript
cube.faces[5].colour = "";
```
Here you changed the back-facing face to transparent, so you can see through it and see the other faces.

Show/Hide the shape's outline, or you could control the outline for individidual faces
Show and hide the outline for individual faces, or you can show / hide the outline for the entire shape:
```javascript
cube.showOutline(); //sets every face's outline to true, hideOutline() sets to false
cube.hideOutline();
cube.faces[0].outline = true;
```

## Camera
The camera is used to render objects, there are 2 types of camera, the Absolute Camera and the Perspective Camera/
- The Absolute Camera is useful for programs where the camera will not move, and the world is static, e.g. a board game or a simulation.
- The Perspective Camera is useful for programs where the camera moves a lot, e.g. a game.
*Note that the face sorting on the Perspective Camera is quite buggy at the moment, if you want stability then I would recommend the Absolute Camera*

The 2 camera have slightly different properties and methods, so I will explain each one separately

### Absolute Camera
To create a new Absolute Camera object:
```javascript
const camera = new AbsoluteCamera();
```

You can also change the camera's position:
```javascript
camera.position.x = 200;
camera.position.z = 200;
```
The way this works is just by translating the objects in the opposite direction when you render them.

You can also change the world zoom:
```javascript
camera.zoom = 0.5; //it will zoom out and everything will appear twice as small
```

You can rotate the entire world using the worldRotation property:
```javascript
camera.worldRotation.x = -30;
camera.worldRotation.y = 30;
camera.worldRotation.z = 0;
camera.updateRotationMatrix(); //make sure to call this whenever you update the worldRotation
```

You can render a grid which shows where your object's are positioned:
```javascript
camera.renderGrid();
```

If you want a visual marker of the center of the screen. The dot basically represents where the camera is located, where the object's will rotate around:
```javascript
camera.showScreenOrigin = true;
```

### Perspective Camera
Create Perspective Camera object:
```javascript
const camera = new PerspectiveCamera();
```

Change position:
```javascript
camera.position.y = 300;
camera.position.z = -1000;
```

Change Zoom Level:
```javascript
camera.zoom = 0.5;
```

Rotate camera:
```javascript
camera.rotation.x = 20;
camera.updateRotationMatrix(); //remember to call this if you update rotation
```
*This works by rotating all the object around the camera by the opposite of the camera's rotation*

You can also change the Near Distance, which is the distance from the Camera to the Near Plane
```javascript
camera.nearDistance = 1000; //1000 by default
```
*It can be used sort of like an FOV value*


## Rendering
Finally to actually render the object to the screen use: (if you have multiple objects make sure to pass them all in the same function call)
```javascript
camera.render([cube]);

camera.render([cube, cube2, cube3]); //If you have multiple objects
```
This function will also return the objects with their respective screen points, if you want to setup an interactive system where the user can select points/faces directly from the canvas, I have used this in the Shape Builder when you select the points indexes for the faces.

You may also want to clear the page before rendering again, since otherwise there will be a copy created
```javascript
clearCanvas();
```

You can also just enable the inbuilt movement controls, which allow the user to drag the mouse around to rotate the world, hold Alt and drag to move the camera's position, and scroll up/down to zoom in/out. **However if you use these then you will also have to handle the animation loop, since if you don't keep rendering the frames then you won't see any change on the screen**
```javascript
camera.enableMovementControls(canvasID);
```
*Do not call this too many times, as it adds event listeners everytime which will cause lag if there are too many*
- The function comes with 2 paramters on both cameras
    1. CanvasID: The ID of the canvas which you use to render, this is so that it can attack event listeners to the canvas, to monitor for mouseclicks
    2. Options: Some options so you can configure the movement how you want, here are some of them.
        - rotation: boolean, default = true
        - movement: boolean, default = true
        - zoom: boolean, default = true
        - limitRotation: boolean, default = false
        - limitRotationMin: number, default = 0
        - limitRotationMax: number, default = -90
    - *The Perspective Camera does not include the movement option*

**If you are changing the camera's position, then I would recommend to disable movement, since that will change the absolute position of the objects, and then the rotation would also get messed up**

You can download the [Quick Start Template](template.html) to get started straight away

## Usage

### If you want to create games with this, read the [Game Helper Docs](Docs/GameHelper.md)

Here is a preview of the project in this repo [Absolute Camera Example](https://aryaask.github.io/3D-Engine/Examples/Absolute/)\
![Preview Gif](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/3DEngineDemo.gif?raw=true)

Here is a preview of the [Shape Builder](https://aryaask.github.io/3D-Engine/ShapeBuilder/) which you can use to build custom shapes\
![Shape Builder Preview](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview2.png?raw=true)\
*Read the [Shape Builder Docs](Docs/buildingShapes.md). for more information*

- I created a 3D Chess game using this library: https://github.com/AryaaSk/3DChess
- As well as a Lego Builder: https://github.com/AryaaSk/LegoBuilder
- As well as a Knockout Game "Descending Dudes": https://github.com/AryaaSk/DescendingDudes

### Limitations
There are some limitations to this engine:
- Sorting order, sometimes at weird angles, some shapes will be rendered in front of another shape, even if it was meant to be the other way round. This is usually caused by have shapes too large, due to how the engine calculates render order.
- Performance, when you start to add many points and shapes, the performance does start to drop quite a bit, this can be seen in the chess game, which only runs at about 40fps on average.
- No .obj files or textures, you have to make all custom shapes inside the Shape Builder, and you can't project images (textures) onto objects.

*This was just a project for fun and education*