# The Rendering Pipeline
## How an object is created and then drawn onto the screen
*A constant theme of this is the order of operations, which is very important. For example if you translate an object and then rotate it, since I am using the Euler Rotation Matrix formula which rotates around the origin, the shape would be in a different position compared to if you rotated first and then translated.*

### Creating the Object:
1. First the user creates a new object (I will use a box example), and gives it width, height and depth values.

2. Inside the Box class constructor, it creates a new box, around the origin, using the above dimensions. The box is represented as a matrix called pointMatrix, each column is a vector or point around the origin. You can see the order of the points in the image below\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Docs/ResearchImages/BoxLayout.png?raw=true)\
Each number represents the (index of the corner)+1, the +1 is because I didn't want to start at 0. The red point represents the origin, all the scale and rotation transformatiosn are performed around the origin, and then the object is translated to it's actual position after to prevent inaccurate rotations.

* Since we know where each corner is located in relation to the others, we can hardcode the faces and therefore the edges, each face is comprised of 4 vertexes (in a cube). These are useful later on when we render the shape.

3. Once we have the pointMatrix, we need to rotate with the XYZ Euler Angles or the Quaternion the user has given us:
    1. If the user gives Euler Angles then they also need to call the updateQuaternion() function, which will convert the **Euler to Quaternion** using this formula:\
    ![Euler to Quaternion](https://github.com/AryaaSk/3D-Engine/blob/master/Docs/ResearchImages/EulerToQuaternion.png?raw=true)\

    2. Once you have converted to quaternion, we can rotate the points in the pointMatrix using the quaternion, to do this just multiply the **Quaternion * Vector**, the vector is the point, by using these steps:

        1. **Convert vector to quaternion**:\
        This is quite simple, to convert a vector -> quaternion, you just keep all the x, y, z the same, and set the w to 0

        2. **Multiply rotation quaternion by vector quaterion**:\
        Use the quaternion multiplication formula:\
        ![Quaternion Multiplication](https://github.com/AryaaSk/3D-Engine/blob/master/Docs/ResearchImages/QuaternionMultiplication.png?raw=true)\

        3. **Multiply the result quaternion by the conjugate**:\
        Get the conjugate of the rotation quaternion, which is just the same but multiply the x, y, and z by -1. Then multiply the result of the previous calculation with this

        4. **Convert back to vector**
        To convert back to vector, just remove the w from the result, and this is your new point rotated with the quaternion.

    3. Save these new points in a new matrix called physicalMatrix, which basically represents the shape around the origin, with all it's local transformations applied to it. The position is applied when it is rendered, since it is relative to the camera.

4. Once we have the physicalMatrix, you also need to apply the object's scale, so just multiply all points in the physicalMatrix by the scale.

### Rendering the Object (Transforming based on Camera's Position and World Rotation):
**As you would imagine, the rendering steps are different for the Absolute and Perspective Camera, so I will explain both of them.**

#### Absolute Camera
1. When the render() function is called for an object, the function creates a copy of the object's PhysicalMatrix and calls it CameraPoints, it then transforms this matrix to get the actual position of the shape's vertices on the 2D screen.

2. The function translates the object first, then applies the world rotation, so that all the objects rotate around the screen origin (center), to make it seem like the camera is in a fixed position.

3. The transformation steps are in this order:

    1. **Translate based on object's position**:\
    The object's position is just a vector from the origin, so we can just translate it by that first

    2. **Translate oppositely to camera's position**:\
    This simulates the camera moving, but actually the objects are all just moving in the opposite direction.

    - *Step 1 and 2 are interchangable*

    3. **Rotate for camera's world rotation**:\
    Converts the camera's world rotation from Euler Angles, to a rotation matrix, using this formula:
    ![XYZ Rotation Matrix](https://github.com/AryaaSk/3D-Engine/blob/master/Docs/ResearchImages/xyzrotationmatrix.jpeg?raw=true)\
    This will give us our Î (iHat), Ĵ (jHat), and k̂ (kHat), unit vectors which represent the XYZ Axis. For example when there are no rotations, the iHat will point in the vector (1,  0, 0) from the origin, however when we rotate the object 90 degrees clockwise on the Y-Axis, the iHat will no point in the vector (0, 0, -1) from the origin. Then just multiply **RotationMatrix * CamerPoints**.


    4. **Translate based on opposite of camera's *absolute* position**:\
    The absolute position only an X and Y translation, no Z axis, it is translated on the physical screen.\
    Since the object gets translated after the rotation, the world rotation will not reflect on this. This means that if you change the absolute position, the objects and grid will still rotate around the screen origin (camera's position), and will ignore the absolute position.
    *This is why I recommend to disable movement in enableMovementControls(), if you are also changing the camera's position*

    5. **Scale object's size and position based on camera's zoom, and absPosition**

4. Then creates a copy of the CameraPoints called WorldPoints, and passes them to the drawing function. The WorldPoints represent the points in 3D space, but since it an absolute camera, the CameraPoints represent the same thing.

#### Perspective Camera
1. First it creates a copy of the object's Physical Matrix, and calls it the WorldPoints, which basically represent the object's verteces as points in 3D space. Here are the steps to get the WorldPoints:
    1. **Translate by Object's Position**:\
    Since the object's physical matrix is just a collection of points around the origin

    2. **Rotate points around camera**:\
    The simulate camera rotation, the camera always faces towards the positive z-axis, and the points rotate around it.

2. Then once it has created the WorldPoints, it needs to create the CameraPoints, which is the 2D projection of the 3D points onto a plane (the near plane). Here are the transformation steps to create the 2D projection:
    1. **Prepare and Clip the Points**:\
    If there are any points behind the camera then you need to clip them (translate their z-position to be in line with the camera). You also check if there are even any points in front of the camera, if there aren't then just don't render the object.

    2. **Calculate and Normalize Camera -> Vertex Vector**:\
    Calculates the projection by finding the vector from the Camera -> (Each Vertex), and then scaling the vector to normalize the Z coordinate, the Z coordinate represents the Near Distance (distance to the viewport).

    3. **Calculate the Point of Intersection**:\
    (Camera Position) + (Scaled Vector) = (Point of Intersection), discard the Z coordinate since it is normalized.

    4. **Translate the point's X and Y coordiante by the inverse of the Camera's X and Y**:\
    This is to cancel out the Camera's movement, since the User's Viewport (the screen), is not moving anywhere.

    - Here is a visualisation of how the perspective works, the green lines represent the vectors from the Camera -> Verteces, and Red Points represent the Intersection Points with the Viewport, and there is an image projected on the screen of the scene from the Camera's Perspective\
    ![Perspective Visualisation](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/PerspectiveVisualisation.png?raw=true)\
    You can use this yourself: [Visualisation](https://aryaask.github.io/3D-Engine/Examples/PerspectiveVisualisation/)    

    5. **Scale object's size and position based on camera's zoom, and absPosition**

3. Then just pass the CameraPoints and WorldPoints to the rendering function, to get drawn onto the screen.


### Rendering the Object (Actually drawing things on the screen):

- A list of objects is passed into the camera.render() function, I loop through that list and calculate all the transformations above, then once I have done that I calculate the center of the object in the 3D world, then just sort the objects based on distance to **(0, 0, -50000) or the camera's position** (absolute or perspective camera) with the WorldPoints, *similar to how I sort the faces below*, and I just render each object individually in order of furthest first, using the steps below:

1. Now we have the WorldPoints which has the points of the object in the correct position in the 3D World, we just need to draw the physical points using , lines and shapes onto the canvas:

2. We need to determine the order in which to draw the faces, otherwise we would get something like this:
    ![Wrong Face Order](https://github.com/AryaaSk/3D-Engine/blob/master/Docs/ResearchImages/WrongFaceOrder.png?raw=true)\

    1. First it calculates the center of each face, we know where the faces are located because we can hardcode the corners which construct each face, because we have a specific order of points, refer to the *Creating the Object* section for more info. To calculate the center you just find the average of all 4 points of the face (in a cube).

    2. Once you have the centers of the faces, it calculates the distance of each center to the point  **(0, 0, -50000) or the camera's position** (absolute or perspective camera) with the WorldPoints, the reason I used (0, 0, -50000) for Absolute Camera was because it negates the differences between individual object's positions, which would be an issue if I used the camera's position, which is why the Perspective Camera's sorting is quite buggy. Then just sort based on the distance between both points.

3. Once you have the order just draw each face as a shape (for a box it is a quadrilateral), draw the furthest ones first. You know which points to use because we hardcoded the index's of the corners in the object's PhysicalMatrix and therefore the CameraPoints.\
The reason this works is because although you are rotating and translating the shape, the corners don't actually move in relation to each other

4. If the user wanted to also show border lines (edges) then we just render the lines at the same time as drawing the faces, this means I don't have to worry about the wrong edges being shown as the faces will be in the correct order so the edges will be too.