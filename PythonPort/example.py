from aryaa3D import *

screen = linkCanvas(1000, 600)

camera = Camera()
camera.worldRotation.x = -20
camera.worldRotation.y = 20
camera.worldRotation.z = 0
camera.updateRotationMatrix()
camera.enableMovementControls() #pass in rotation, movement, zoom and limitRotation with arguments, e.g. rotation=False

box = Box(100, 100, 100)
box.position.x = 300

box2 = Box(80, 80, 80)
box2.position.y = 100
box2.faces[0].colour = ""

house = House()


#This is how you implement Delta Time
import time
previousTime = time.time()
def deltaTime(constant: float):
    global previousTime
    currentTime = time.time()
    deltaTime = currentTime - previousTime
    previousTime = currentTime
    deltaMultiplier = deltaTime / constant
    return deltaMultiplier


def animationLoop():
    deltaMultiplier = deltaTime(0.016)

    clearCanvas()
    camera.renderGrid()
    camera.render([house])

    screen.update()
    screen.ontimer(animationLoop, 16) #16ms, 60fps

animationLoop()
screen.mainloop()
