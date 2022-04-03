I had to do a lot of research to learn about how to render 3D shapes, into a 2D screen

This project is based off of Matrix Transformations, and using unit vectors to rotate the objects.

## Importing
To import download the JS files, then import using script tags and linked to the correct directory: (You should also make sure to import in the correct order)
```
<script src="JS/canvasUtilities.js" defer></script>
<script src="JS/utilities.js" defer></script>
<script src="JS/objects.js" defer></script>
<script src="JS/camera.js"></script>

<script src="JS/script.js" defer></script>
```

Then create a canvas element in the DOM with id="renderingWindow"
```
<canvas id="renderingWindow"></canvas>
```

You can apply whatever CSS styles you want to this element, such as width and height

## Creating a box
The box object has 3 matrixes: PointMatrix, RotationMatrix, and PhysicalMatrix
- The PointMatrix contains the points around the origin (0, 0), and doesn't have any transformations applied to it, such as rotation, scale or position
- The RotationMatrix contains the Unit Vectors: iHat, jHat, and kHat, which are basically the X-Axis, Y-Axis, and Z-Axis respectively. When you rotate a shape, you actually just change these unit vectors, the way I calculate the RotationMatrix is using Euler's XYZ Rotation Matrix Formula, refer to *Research/xyzrotationmatrix.jpeg* for more infomation.
- The PhysicalMatrix contains the actual points where the shape is in the 3D World, it has the transformations rotation and scale applied to it. To calculate this matrix you do RotationMatrix * PointMatrix, then you scale up every vector by the scale. The position is added in the camera, since it needs to render based on the object's position to the camera.

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

And then once you have change the attributes you need to update the Box's Matrices using the function:
```
cube.updateMatrices();
```

## The Camera
The camera is used to render objects.

To detect which faces are behind the other ones, the camera finds the center of each face, using the diagonals variable which is created on the Box object when creating it. The center is a physical point in the 3D World, then the camera calculates the distance between the center and its own position using Pythagorus' Formula, and renders the ones furthest away first, so that the ones closest will appear to be in front.

To create a camera object:
```
const camera = new Camera();
```

You can then position this camera in the scene somewhere
```
camera.position = { x: 0, y: 0, z: -30 };
```

The objects' faces are always rendered in the order of which face is furthest from the camera, however it does not take the Z-Position that you give it, I have just hard-coded an arbitary value of -5000, so that there aren't any problems with the differences in postions between different objects, **you do not have to worry about this though**.

You can also change the world zoom
```
camera.zoom = 2; //will zoom in by 2 so everything looks twice as big
```

Finally to render an object:
```
camera.render(cube);
```
You can also pass in an optional boolean parameter *outline*, which will show the outline of the object, however this will also show the edges which should originally be hidden.

You may also want to clear the page before rendering again, since otherwise there will be a copy created
```
clearCanvas();
```

To simulate perspective and the Z-Axis, I create a unit scale factor, which is basically just a scale factor you can apply to an object which will make it fill up the entire screen, then I divide that by the distance between the object and the camera in the Z-Axis (divide it by 10 to make it more subtle), and then I just scale the object by that.\
This also gives a sort of parallax effect, since the object's further away will be scaled less, resulting in them moving less.

## Usage
This is designed to be a 3D engine, but used for 2D games/applications, since there is no camera rotation and the object's don't actually move anywhere based on the camera's Z-Position. For example in platformers where you want a 3D parallax background.