**This is not meant to be used for any serious projects, I just made this to learn more about 3D rendering and Matrix transformations**\
If you want to know how it works go here [Rendering Pipeline](Research/Pipeline.md)

## Importing
To import the library, just copy this script tag into your HTML head *(Make sure to do this before using it in another JS file)*.
```
<script src="https://aryaask.github.io/3D-Engine/JS/aryaa3D.js"></script>

<script src="yourownjsfile.js" defer></script> <!-- You should add a defer tag on your own file, since you will need to wait for the canvas element to load into the DOM -->
```

Then create a canvas element in the HTML DOM with an ID, I used "renderingWindow"
```
<canvas id="renderingWindow"></canvas>
```
You can apply whatever CSS styles you want to this element, such as width and height

Then in JS/TS, use the linkCanvas(canvasID: string) function with the same ID before doing anything
```
linkCanvas("renderingWindow");
```

## Creating an Object
I have not made a lot of inbuilt objects, however it is very easy to add/create more, to add more you can look at the [customShapes.js](ShapeBuilder/customShapes.js) file, which contains some classes of extra objects, to use them just copy and paste them into your code, and then use it like any other shape.\
If you want to create your own custom shapes/objects read the [Development Readme](DevelopmentREADME.md).

In this example I will create a box, the only thing you may have to change for other objects is the dimensions you pass in when creating them

To create a box the user passes in 3 arguments, width, height and depth (for a pyramid it is just the bottomSideLength and height):
```
const cube = new Box(100, 100, 100);
const pyramid = new SquareBasedPyramid(50, 100); //this is how you make a pyramid
```

You can transform the box using its rotation, scale and position attributes:
```
cube.rotation = { x: -20, y: -20, z: 0};
cube.scale = 2;
cube.position = { x: 200, y: 0, z: 0 };
```

If you change the rotation or scale then you need to apply the changes using:
```
cube.updateMatrices();
```

You can also change the appearance of the object using the faces property. Each faces each have their own index, if you are not sure which index is what face, you can set the showFaceIndexes property to true, and then you will be able to see which index is which face, making it easy to set the correct colour to the correct face:
```
cube.showFaceIndexes = true;
cube.faces[0].colour = "#ff0000";
```

You can also make a face transparent:
```
cube.faces[5].colour = "#ff0000";
```
Here you changed the back-facing face to transparent, so you can see through it and see the other faces.

Finally if you want to show the outline:
```
cube.showOutline = true;
```

## Camera
The camera is used to render objects.
 
To create a camera object:
```
const camera = new Camera();
```

You can then position this camera in the scene somewhere *(This doesn't change the 3D position, it is literally the 2D position from where you view the world, which is why there is no Z coordinate)*.
```
camera.position.x = 0;
camera.position.y = 0;
```

You can also change the world zoom:
```
camera.zoom = 0.5; //it will zoom out and everything will appear twice as small
```

You can rotate the entire world using the worldRotation property:
```
camera.worldRotation.x = -30;
camera.worldRotation.y = 30;
camera.worldRotation.z = 0;
camera.updateRotationMatrix(); //make sure to call this whenever you update the worldRotation
```

You can render a grid which shows where your object's are positioned:
```
camera.renderGrid();
```

Finally to actually render the object to the screen use: (if you have multiple objects make sure to pass them all in the same function call)
```
camera.render([cube]);

//If you have multiple objects:
camera.render([cube, cube2, cube3]);
```

You may also want to clear the page before rendering again, since otherwise there will be a copy created
```
clearCanvas();
```

You can also just enable the inbuilt movement controls, which allow the user to drag the mouse around to rotate the world, hold Alt and drag to move the camera's position, and scroll up/down to zoom in/out. **However if you use these then you will also have to handle the animation loop, since if you don't keep rendering the frames then you won't see any change on the screen**
```
camera.enableMovementControls(canvasID: string, rotation: boolean, movement: boolean, zoom: boolean);
```
*Do not call this too many times, as it adds event listeners everytime which will cause lag if there are too many*

Here is a preview of the project in this repo [Example.html](https://aryaask.github.io/3D-Engine/Previews/example.html)\
![Preview Gif](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/3DEngineDemo.gif?raw=true)

Here is a preview of the [Shape Builder](https://aryaask.github.io/3D-Engine/ShapeBuilder/) which you can use to build custom shapes\
![Shape Builder Preview](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview2.png?raw=true)\
*Read the [Development Readme](DevelopmentREADME.md) for more information*