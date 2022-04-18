# Python Port of aryaa3D
## I have tried to keep as many aspects of the original Javascript library the same in python, however in some cases I just had to make some changes

### Importing
To import the python library, download the [aryaa3D.py](aryaa3D.py) file, and store it in the same directory as your project.

Then you can just import it into your script using the import statement:
```python
from aryaa3D import *
```

### Setup
To initialize a window, use the linkCanvas() function, you need to do this before doing anything else. It takes in 2 arguments: **width** and **height**
```python
screen = linkCanvas(1280, 720)
```
Here I am setting up a 720p window, *the user will still be able to resize it once it has opened*. You need to store the screen reference since it is required when you want to render objects later on

## Objects
### <ins>Initializing Objects:</ins>
**To create and transform objects, it is very similar to how it is in javascript**
Create a cube object:
```python
cube = Box(100, 100, 100)
```

Transformations such as position, rotation, and scale
```python
cube.rotation.x = 30
cube.scale = 2
cube.position.z = 200
```

Make sure to call the updateMatrices() function if you change rotation or scale
```python
cube.updateMatrices()
```

**You can also change the appearance of the object inside the code itself**\
Change the colour of the object's faces:
```python
cube.faces[0].colour = "#ff0000" #Red
cube.faces[2].colour = "" #Transparent
```
*Setting the colour to "", will make the face transparent*

Can also show the object's outline:
```python
cube.showOutline = True
```

### <ins>Importing Objects from Shape Builder/Code</ins>
Unlike in javascript where you can just copy and paste the code from the Shape Builder, in python you will need to convert the JS code into python code.

Luckily I have created a function which does that for you, and you just need to execute the output

To get the python output code, use the convertShapeToPython() function
*In this example I am importing the Shuriken shape from [customShapes.js](ShapeBuilder/customShapes.js)*
```python
ShurikenClassString = convertShapeToPython("""
class Shuriken extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = [[-100,0,100],[100,0,100],[-100,0,-100],[100,0,-100],[0,0,300],[300,0,0],[0,0,-300],[-300,0,0],[0,30,0],[0,-30,0]];
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [0, 0, 0];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{pointIndexes:[8,4,0],colour:"#c4c4c4"},{pointIndexes:[8,4,1],colour:"#000000"},{pointIndexes:[8,1,5],colour:"#c4c4c4"},{pointIndexes:[8,5,3],colour:"#000000"},{pointIndexes:[8,3,6],colour:"#c4c4c4"},{pointIndexes:[8,2,6],colour:"#000000"},{pointIndexes:[8,2,7],colour:"#c4c4c4"},{pointIndexes:[8,0,7],colour:"#000000"},{pointIndexes:[9,4,0],colour:"#c4c4c4"},{pointIndexes:[9,4,1],colour:"#000000"},{pointIndexes:[9,1,5],colour:"#c4c4c4"},{pointIndexes:[9,5,3],colour:"#000000"},{pointIndexes:[9,3,6],colour:"#c4c4c4"},{pointIndexes:[9,2,6],colour:"#000000"},{pointIndexes:[9,2,7],colour:"#c4c4c4"},{pointIndexes:[9,0,7],colour:"#050505"}];
    }
}
""")
```

Once you have the output, you can either print it, and then copy and paste it into your own code:
```python
print(ShurikenClassString)
#... copy and paste the output here
```

Or you can execute it using the exec() function:
```python
exec(ShurikenClassString)
```

Once you have done either of those, you can access the shape just like a regular object
```python
shuriken = Shuriken()
shuriken.scale = 0.5
shuriken.updateMatrices()
```

## Camera
### <ins>Transformations</ins>
Create camera object:
```python
camera = Camera()
```

Then position this in the scene somewhere, remember that this is absolute positioning, and so only includes a X and Y coordinate
```python
camera.absPosition.x = 100
camera.absPosition.y = -100
```

Change zoom, about the center of the physical window:
```python
camera.zoom = 0.5 #everything will appear twice as small
```

Rotate the entire world with the worldRotationProperty:
```python
camera.worldRotation.x = -30;
camera.worldRotation.y = 30;
camera.worldRotation.z = 0;
camera.updateRotationMatrix(); #make sure to call this whenever you update the worldRotation
```

I have also implemented the **enableMovementControls()**, which allow you to move around the scene using your mouse cursor, you will need to have added an animation loop in order to see the changes
```python
camera.enableMovementControls()
```
- This function can take in 4 optional boolean arguments:
    1. Rotation
    2. Movement
    3. Zoom
    4. limitRotation
    
Read the main readme to learn what these arguments do, to pass them into the function you need to specify which one you are passing and then give a boolean value for it, e.g.:
```python
camera.enableMovementControls(limitRotation=True)
```
The controls will be printed when you call the function, unfortunately the keydown and keyup listeners weren't working, so instead of holding Alt like you do in the JS version, you have to hold the right click, and then drag to pan the world

### <ins>Rendering</ins>
You can render a grid which shows where your object's are positioned:
```python
camera.renderGrid();
```

To render objects:
```python
camera.render([cube]);

camera.render([cube, cube2, cube3]); #If you have multiple objects
```

Finally once you have called all the render() and renderGrid() function (optional), you need to update the screen:
```python
camera.renderGrid()
camera.render([cube])
screen.update()
```

You will also want to clear the canvas whenever you want to render a new frame
```python
clearCanvas()
```

If you want to implement an animation loop, you can do something like this:
```python
def animationLoop():
    clearCanvas()
    camera.renderGrid()
    camera.render([cube]) #...objects

    screen.update()
    screen.ontimer(animationLoop, 16) #16ms, 60fps

animationLoop()
screen.mainloop()
```

**I recommend reading the [Main README](https://github.com/AryaaSk/3D-Engine/blob/master/README.md), for more information as this readme is based on that one but just modified slightly for the python port** 

## Usage
![Python Preview](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/PythonPreview.png?raw=true)\
Look at [example.py](example.py) for an example, you will also need to download the aryaa3D.py since the example will not function properly without it.