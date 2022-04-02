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
- The PhysicalMatrix contains the actual points where the shape is in the 3D World, it has the transformations rotation, position applied to it. To calculate this matrix you do RotationMatrix * PointMatrix, and then you individually add the x/y/z position offsets to each vector (stored as columns in the matrix). The scale is applied at by the camera, by just individually multiplying each vector (column), by the Scale Factor

To create a box the user passes in 3 arguments: width, height: depth, as seen below:
```
const cube = new Box(100, 100, 100);
```
Then in the Box's constructor, it creates points with these dimensions, and positions them around the origin.

You can change the Box's position using the rotation and position attributes:
```
cube.rotation = { x: -20, y: -20, z: 0};
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

You can adjust the scale of the camera
```
camera.scale = 2;
```
This will make every objects size double (multiply the original size by scale), and I was thinking that it could be used when zooming in on objects

One problem can arise when there are multiple objects and the camera is positioned too close to one of the objects, the default position is (0, 0, 0), this is because it detects that one of the faces of one of the objects is closest to the camera, when in reality it's not at the front.\
To fix this issue you have to position the camera quite far away so that the distance between objects is insignificant compared to the distance to the camera:
```
camera.position = [0, 0, -50] //positioned very far away on Z-Axis, distance between objects may only be 2 or something
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