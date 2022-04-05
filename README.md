**This is not meant to be used for any serious projects, I just made this to learn more about 3D rendering and Matrix transformations**\
If you want to know how it works go [here](Research/Pipeline.md)

## Importing
To import the library, just copy this script tag into your HTML head *(Make sure to do this before using it in another JS file)*.
```
<script src="https://gitcdn.link/cdn/AryaaSk/3D-Engine/04d74860af8dac8a83943de1b3379a8e1c101646/aryaa3D.js"></script>

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
I have made 2 inbuilt objects: a box and a square based pyramid, however it is very easy to create more, read the [Development Readme](DevelopmentREADME.md) for more information.\
In this example I will create a box, the only thing you would have to change for other objects is the dimensions you pass in when creating them

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

You can also change the appearance of the object using the faces property
```
cube.faces[0].colour = "#ff0000";
```
The faces each have their own index, 0 is the front-facing face, you may have to try a few to find the face you want to change. Here you changed the front-facing face to red;

You can also make a face transparent:
```
cube.faces[5].colour = "#ff0000";
```
Here you changed the back-facing face to transparent, so you can see through it and see the other faces.

Finally if you want to show the outline you can set the outline property to true, however this will also show the edges which should originally be hidden.
```
cube.outline = true;
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

Here is a preview of the project in this repo (to run this just download the repo and open the index.html file)

![Preview Gif](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/3DEngineDemo.gif?raw=true)