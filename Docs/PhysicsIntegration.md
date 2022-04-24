# Physical Integration with CannonJS

## Getting Started
I used CannonJS to integrate phyiscs into my 3D Engine, the basic idea is that there is a physics world, and then you just use aryaa3D to render the objects in that physics world.

### Importing
You will need to import aryaa3D, as well as cannon.js, and the aryaa3D gameHelper.js
```html
<script src="https://aryaask.github.io/3D-Engine/Source/aryaa3D.js"></script>
<script src="https://aryaask.github.io/3D-Engine/GameHelper/PhysicsIntegration/cannon.js"></script>
<script src="https://aryaask.github.io/3D-Engine/GameHelper/gameHelper.js"></script>

<script src="yourownjsfile.js" defer>
```

If you want to use typescript auto-complete, then just download the [CannonJS Types](https://github.com/AryaaSk/3D-Engine/blob/master/GameHelper/PhysicsIntegration/cannonTypes.d.ts), and the [GameHelper.ts](https://github.com/AryaaSk/3D-Engine/blob/master/GameHelper/gameHelper.ts), then just compile them using the TS compiler, and use those in the script tags.

## Setup
First setup the aryaa3D and cannon world/scene:
```javascript 
//CannonJS Setup
const world = new CANNON.World();
world.gravity.set(0, -9.82 * 100, 0); // *100 to scale into the world

//Aryaa3D Setup
linkCanvas("renderingWindow")
const camera = new Camera();
camera.enableMovementControls("renderingWindow"); //optional - just configuring camera
```

## Objects

### Adding Objects 
To add objects, you use the PhysicsObject class, it will take in 2 required parameters, and 2 optional parameters:
1. **CannonJSWorld**: This is the CannonJS world in which we will add all the objects, we defined this above as simply **world**, so just pass that in first.
2. **Aryaa3DShape**: The aryaa3D object, such as a Box(), or a custom object you built in the Shape Builder
3. **CannonJSShape (optional)**: This will serve as the hitbox of your object, if you don't pass anything then the GameHelper will automatically create a bounding box, and set that as your hitbox, it is of type CANNON.Shape.
4. **CannonJSBody (optional)**: The body, of your objects, which contains information such as its mass. If you leave this as undefined then GameHelper will automatically set the mass of the object as 1.

Here is how you would make a simple cube object:
```javascript
const cubeShape = new Box(100, 100, 100);
cubeShape.position = { x: 0, y: 300, z: -200 }; //changing position and rotation of aryaa3D object
cubeShape.rotation = { x: -40, y: 30, z: 0 };
cubeShape.updateQuaternion();

const cube = new PhysicsObject(world, cubeShape, undefined, undefined); //didn't pass CannonJSShape or CannonJSBody, so GameHelper will automatically create them.
```

### Custom Objects
Here is how you could create a custom PhysicsObject():
```javascript
//Custom aryaa3D Object from ShapeBuilder:
class PentagonalPrism extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = [[0,0,0],[100,0,0],[150,100,0],[50,150,0],[-50,100,0],[0,0,200],[100,0,200],[150,100,200],[50,150,200],[-50,100,200]];
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [-50, -75, -100];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{pointIndexes:[0,1,6,5],colour:"#ff2600"},{pointIndexes:[1,2,7,6],colour:"#ff9300"},{pointIndexes:[2,3,8,7],colour:"#fffb00"},{pointIndexes:[3,4,9,8],colour:"#00f900"},{pointIndexes:[0,4,9,5],colour:"#00fdff"},{pointIndexes:[0,1,2,3,4],colour:"#0433ff"},{pointIndexes:[5,6,7,8,9],colour:"#ff40ff"}];
    }
}

const pentagonalPrismShape = new PentagonalPrism(); //create aryaa3D object with the newly created class
const pentagonalPrism = new PhysicsObject(world, pentagonalPrismShape); //add like above
```
*If you have a custom object then I wouldn't recommend to let GameHelper create the CannonJSShape, since it creates a bounding box, which may not be ideal for your object. I would recommend reading the [CannonJS Docs](https://github.com/schteppe/cannon.js), on how to create custom Shapes.*

### Editing Objects
To edit the objects once you have initialized them, you can use the cBody, or the aShape (not recommended).
- The cBody is the CannonJSBody, which you passed or was automaticaly created, this is what you should be applying forces and impulses to, so that the physics can be simulated.\
It is simply a CANNON.Body, so you can do all the operations that you could do on a regular cannon body. Read the [CannonJS Docs](https://github.com/schteppe/cannon.js) for more info.
- The aShape is the aryaa3D object that you passed, you can use it like a regular aryaa3D object, but **I wouldn't recommend transforming this directly**, because the physics won't be simulated since you are explicitly setting the postion/rotation.

Here is an example of moving an object:
```javascript
//This will create an impulse, pushing the cube in the positive y direction
cube.cBody.applyImpulse( new CANNON.Vec3(0, 150, 0), cube.cBody.position );
```

If you want to change the object's rotation using the aShape:
```javascript
cube.aShape.rotation.x += 5;
cube.aShape.updateQuaternion();
cube.syncCBody(); //sync cannon body with aryaa3D shape's rotation, will also sync position
```

You can also just edit all the apperance properties as usual:
```javascript
cube.aShape.showOutline = true;
```

## Animation/Simulation Loop
The animation loop now also needs to step the cannon world, as well as sync all the aryaa3D shapes to their respective cannon bodies

Here is an example of an animation loop:
```javascript
setInterval(() => {
    world.step(16 / 1000); //updating the cannonJS world

    //Sync aryaa3D Shapes to CannonJS Bodies
    cube.syncAShape();
    pentagonalPrism.syncAShape();

    //Render objects
    clearCanvas();
    camera.renderGrid();
    camera.render([cube.aShape, pentagonalPrism.aShape]) //notice how we pass in the aryaa3D shapes
}, 16);
```

You can get quickly get started with the [physicsTemplate.html](https://github.com/AryaaSk/3D-Engine/tree/master/GameHelper/PhysicsIntegration/physicsTemplate.html)

Here is a demo of the [example.html](https://github.com/AryaaSk/3D-Engine/tree/master/GameHelper/PhysicsIntegration/example.html)\
![Preview Gif](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/PhysicsDemo.gif?raw=true)