# The Rendering Pipeline
## How an object is created and then drawn onto the screen

### Creating the Object:
1. First the user creates a new object (I will use a box example), and gives it width, height and depth values.

2. Inside the Box class constructor, it creates a new box, around the origin, using the above dimensions. The box is represented as a matrix called pointMatrix, each column is a vector or point around the origin. You can see the order of the points in the image below\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Research/BoxLayout.png?raw=true)\
Each number represents the (index of the corner)+1, the +1 is because I didn't want to start at 0. The red point represents the origin, all the scale and rotation transformatiosn are performed around the origin, and then the object is translated to it's actual position after to prevent inaccurate rotations.

Since we know where each corner is located in relation to the others, we can hardcode the edges, diagonals and faces, each line containing 2 corners. These are useful later on when we render the shape.

3. Once we have created the pointMatrix, we need to rotate the object with the XYZ rotations the user has given us, to do this we create a RotationMatrix, to calculate this I used the XYZ Rotation Matrix formula:\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Research/xyzrotationmatrix.jpeg?raw=true)\
This will give us our Î (iHat), Ĵ (jHat), and k̂ (kHat), unit vectors which represent the XYZ Axis. For example when there are no rotations, the iHat will point in the vector (1, 0, 0) from the origin, however when we rotate the object 90 degrees clockwise on the Y-Axis, the iHat will no point in the vector (0, 0, -1) from the origin.

4. Once we have our RotationMatrix, we can find the physcial location of the points around the origin by doing **RotationMatrix * PointMatrix**, this tells us the location of all points relative to the origin, and then finally we scale the object by just multiplying each vector (column), by the scale. We store this in a matrix called PhysicalMatrix.

### Rendering the Object: