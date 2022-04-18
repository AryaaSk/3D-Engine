from aryaa3D import *

screen = linkCanvas(1280, 720)

camera = Camera()
camera.worldRotation.x = -20
camera.worldRotation.y = 20
camera.worldRotation.z = 0
camera.updateRotationMatrix()

#I had to make the controls a bit different, since keydown and keyup werent working
#To pan around hold the right click, and then you can drag around with the mouse
#pass in rotation, movement, zoom and limitRotation with arguments, e.g. rotation=False
camera.enableMovementControls()

box = Box(100, 100, 100)
box.position.x = 300

box2 = Box(80, 80, 80)
box2.position.y = 100
box2.position.z = 1000
box2.faces[0].colour = ""

#Custom Shuriken Object
exec(convertShapeToPython("""
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
"""))
shuriken = Shuriken()
shuriken.scale = 0.5
shuriken.updateMatrices()

def animationLoop():
    deltaMultiplier = deltaTime(0.016) #deltaTime function from aryaa3D

    shuriken.rotation.y += 5 * deltaMultiplier
    shuriken.updateMatrices()

    clearCanvas()
    camera.render([shuriken, box, box2])
    camera.renderGrid()

    screen.update()
    screen.ontimer(animationLoop, 16) #16ms, 60fps

animationLoop()
screen.mainloop()
