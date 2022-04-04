# The Rendering Pipeline
## How an object is created and then drawn onto the screen

### Creating the Object:
1. First the user creates a new object (I will use a box example), and gives it width, height and depth values.

2. Inside the Box class constructor, it creates a new box, around the origin, using the above dimensions. The box is represented as a matrix called pointMatrix, each column is a vector or point around the origin. You can see the order of the points in the image below\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Research/BoxLayout.png?raw=true)\
Each number represents the (index of the corner)+1, the +1 is because I didn't want to start at 0. The red point represents the origin, all the scale and rotation transformatiosn are performed around the origin, and then the object is translated to it's actual position after to prevent inaccurate rotations.\

* Since we know where each corner is located in relation to the others, we can hardcode the edges, diagonals and faces, each line containing 2 corners. These are useful later on when we render the shape.

3. Once we have created the pointMatrix, we need to rotate the object with the XYZ rotations the user has given us, to do this we create a RotationMatrix, to calculate this I used the XYZ Rotation Matrix formula:\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Research/xyzrotationmatrix.jpeg?raw=true)\
This will give us our Î (iHat), Ĵ (jHat), and k̂ (kHat), unit vectors which represent the XYZ Axis. For example when there are no rotations, the iHat will point in the vector (1, 0, 0) from the origin, however when we rotate the object 90 degrees clockwise on the Y-Axis, the iHat will no point in the vector (0, 0, -1) from the origin.

4. Once we have our RotationMatrix, we can find the physcial location of the points around the origin by doing **RotationMatrix * PointMatrix**, this tells us the location of all points relative to the origin, and then finally we scale the object by just multiplying each vector (column), by the scale. We store this in a matrix called PhysicalMatrix.

### Rendering the Object (Transforming based on Camera's Position and World Rotation):
1. When the render() function is called for an object, the function creates a copy of the object's PhysicalMatrix and calls it the CameraObjectMatrix, it then transforms this matrix to get the actual position of the shape's vertices on the 2D screen.

2. The function transforms the object's size and rotation first, and then applies the translation transformations, this is because if you translate it first and then change the size/rotation, then it will use the origin as the point of rotation/enlargment, causing an inaccurate transformation.

3. The transformation steps are in this order:
    1. **Scale up object based on camera's zoom (will translate for zoom later)**

    2. **Rotate for world rotation (when the user changes camera.rotation)**

    3.  **Translate based on world rotation**:\
    Function calculates where the origin is located, but in the absolute 3D world, if the camera's position is (50, 100), then the origin would be located at (-50, -100), I save this value as gridMiddle.\
    Since the object's position is relative to the origin, it can also been seen as a vector from the origin, so the object's position in the absolute 3D scene is just **gridMiddle + object.position**.\
    \
    We have the object's position, but we actually need the vector from the origin so I just do **object.position - gridMiddle**, which just cancels out to **object.position**, *We don't really need to use gridMiddle for this, it is just an abstraction to make it easier to understand*.\
    Once we have the vector from the gridMiddle (origin) -> object.position, we apply the worldRotationMatrix (which is calculated using the same formula as the RotationMatrix from the object), and now we have the new vector from the **gridMiddle -> object.position**.\
    Finally we have this vector, we multiply it by the camera's zoom to make the space between object's larger with larger zoom, and then we just translate the object's position by this vector, which is the same as setting it since the object's position would have been relative to the origin before.

*The Absolute 3D World refers to a point's position on the actual screen, but if you consider the screen as 3D, you just can't see the Z-Axis. This means when I actually draw the point on the screen I just ignore the Z position, and just use the X and Y position*

### Rendering the Object (Actually drawing things on the screen):

1. Now we have the CameraObjectMatrix which has the points of the object in the correct position in the Absolute 3D World, we just need to draw the physical points, lines and quadrilaterals onto the canvas:

2. We need to determine the order in which to draw the faces, otherwise we would get something like this:
    ![Wrong Face Order](https://github.com/AryaaSk/3D-Engine/blob/master/Research/WrongFaceOrder.png?raw=true)\

    1. First it calculates the center of each face, we know where the faces are located because we can hardcode the corners which construct each face, because we have a specific order of points, refer to the Creating the Object section for more info. To calculate the center you just use 1 of the diagonals, add together both points (vectors) and then divide by 2.

    2. Once you have the centers of the faces, it calculates the distance of each center to the point (0, 0, -50000), the reason I used this point was because it negates the differences between individual object's positions, which would be an issue if I used the camera's position. Then just sort based on the distance between both points.

3. Once you have the order just draw each face as a quadrilateral, draw the furthest ones first. You know which points to use because we hardcoded the index's of the corners in the object's PhysicalMatrix and therefore the CameraObjectMatrix.\
The reason this works is because although you are rotating and translating the shape, the corners don't actually move in relation to each other

4. If the user wanted to also show border lines then we just use the edges indexes, which are also hardcoded when creating the object, again for the same reason as the diagonals and faces. Then just draw the lines using the points in the CameraObjectMatrix and ignore the Z-Axis.


