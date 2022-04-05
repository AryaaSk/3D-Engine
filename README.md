**This is not meant to be used for any serious projects, I just made this to learn more about 3D rendering and Matrix transformations**\
If you want to know how it works go [here](Research/Pipeline.md)

## Importing
To import the library, just copy this script tag into your HTML head *(Make sure to do this before using it in another JS file)*.
```
<script src="https://gitcdn.link/cdn/AryaaSk/3D-Engine/ce7ecc53245030368e419a93b657c9e80a17bf96/aryaa3D.js"></script>

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

## Creating a box
To create a box the user passes in 3 arguments: width, height: depth, as seen below:
```
const cube = new Box(100, 100, 100);
```
Then in the Box's constructor, it creates points with these dimensions, and positions them around the origin.

You can transform the box using its rotation, scale and position attributes:
```
cube.rotation = { x: -20, y: -20, z: 0};
cube.scale = 2;
cube.position = { x: 2, y: 0, z: 0 };
```

If you change the rotation or scale then you need to apply the changes using:
```
cube.updateMatrices();
```

You can also assign a colour to each face using the faceColours attribute
```
cube.faceColours = {  //assign a colour to each face (-z, -y, -x, +x, +y, +z)
    "-z" : "#ff0000",
    "-y" : "#00ff00",
    "-x" : "#0000ff",
    "+x" : "#ffff00",
    "+y" : "#00ffff",
    "+z" : "#ff00ff",
}
```
Each face has it's own identifier (the key), which is just the direction which it is facing when there is no rotations applied to it. For example the first one is "-z", which is the face which is pointing in the negative-z direction, and it is the first face you see. The "-y" is pointing downwards, etc...\
You can also set a face to "", which will make it transparent:
```
cube.faceColours["-z"] = ""; //makes the front-facing side transparent
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

Finally to render an object:
```
camera.render(cube);
```
You can also pass in an optional boolean parameter **outline**, which will show the outline of the object, however this will also show the edges which should originally be hidden.

You may also want to clear the page before rendering again, since otherwise there will be a copy created
```
clearCanvas();
```

Here is a preview of the project in this repo (to run this just download the repo and open the index.html file)

![Preview Gif](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/3DEngineDemo.gif?raw=true)