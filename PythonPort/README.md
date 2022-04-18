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
Here I am setting up a 720p window, *the user will still be able to resize it once it has opened*.

## Objects
### <u>Initializing Objects:</u>
**To create and transform objects, it is very similar to how it is in javascript**
Create a cube object:
```python
cube = Box(100, 100, 100)
```

Transformations such as position, rotation, and scale
```python
cube.rotation.x = 30
cube.scale = 2
cube.position.z = 500
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

### <u>Importing Objects from Shape Builder/Code</u>
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