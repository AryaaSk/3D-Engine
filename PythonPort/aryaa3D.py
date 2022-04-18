#Porting the aryaa3D.ts, into Python Turtle
#Date: 18/04/22, self may get outdated since it is a lot of work to port the entire library from Typescript to Python
#There will not be many comments since the functions basically perform the same thing as in the TS/JS files

#TURTLE UTILITIES
import turtle

t: turtle.Turtle = None
screen: turtle.Screen = None
def linkCanvas(canvasWidth, canvasHeight):
    global t
    global screen
    screen = turtle.Screen()
    screen.setup(canvasWidth, canvasHeight)
    screen.tracer(False) #to enable us to get smooth 60fps animation   
    t = turtle.Turtle()
    t.hideturtle();
    t.penup();
    return screen
    
#No gridX and gridY functions since in turtle, the center of the screen is at coordinate (0, 0)
def plotPoint(p, colour):
    global t
    if t == None:
        print("Cannot draw, canvas has not been initialized. Please use the linkCanvas(width, height) function before rendering any shapes")
        return
    t.penup()
    t.goto(p[0], p[1])
    t.dot(10, colour)
def drawLine(p1, p2, colour):
    global t
    if t == None:
        print("Cannot draw, canvas has not been initialized. Please use the linkCanvas(width, height) function before rendering any shapes")
        return
    t.penup()
    t.pencolor(colour)
    t.goto(p1[0], p1[1])
    t.pendown()
    t.goto(p2[0], p2[1])
    t.penup()
def drawShape(points, colour, outline):
    global t
    if t == None:
        print("Cannot draw, canvas has not been initialized. Please use the linkCanvas(width, height) function before rendering any shapes")
        return
    t.penup()
    t.goto(points[0][0], points[0][1])
    t.fillcolor(colour)
    t.pencolor('black')
    if outline == True:
        t.pendown()
    t.begin_fill()
    for p in points:
        t.goto(p[0], p[1])
    t.penup()
    t.end_fill();
    if outline == True:
        t.pendown()
        t.goto(points[0][0], points[0][1])
        t.penup()
def clearCanvas():
    global t
    if t == None:
        print("Cannot clear, canvas has not been initialized. Please use the linkCanvas(width, height) function before rendering any shapes")
        return
    t.clear()






#MATH UTILITIES
import math

class matrix():
    data = []
    width = 0
    height = 0
    def __init__(self):
        self.data = []
        self.width = 0
        self.height = 0

    def addColumn(self, nums):
        self.data.append(nums)
        self.height = len(nums)
        self.width += 1

    def printMatrix(self):
        finalOutput = "Matrix:"
        currentRow = 0
        while (currentRow != self.height):
            currentLineOutput = "\n"
            currentColumn = 0
            while (currentColumn != self.width):
                currentLineOutput = currentLineOutput + str(self.data[currentColumn][currentRow]) + "      "
                currentColumn += 1
            finalOutput = finalOutput + currentLineOutput
            currentRow += 1
        print(finalOutput)

    def getColumn(self, columnIndex):
        return self.data[columnIndex]
    def getRow(self, rowIndex):
        returnArray = []
        for column in self.data:
            returnArray.append(column[rowIndex])
        return returnArray
    
    def setValue(self, columnIndex, rowIndex, value):
        self.data[columnIndex][rowIndex] = value
    def getValue(self, columnIndex, rowIndex):
        return self.data[columnIndex][rowIndex]
    def deleteColumn(self, columnIndex):
        del self.data[columnIndex]
        self.width -= 1

    def scaleUp(self, factor):
        i = 0
        while i != len(self.data):
            a = 0
            while a != len(self.data[i]):
                self.data[i][a] *= factor
                a += 1
            i += 1
    def scaledUp(self, factor):
        newMatrix = self.copy()
        newMatrix.scaleUp(factor)
        return newMatrix

    def translateMatrix(self, x, y, z):
        i = 0
        while i != self.width:
            column = self.getColumn(i)
            self.setValue(i, 0, column[0] + x)
            self.setValue(i, 1, column[1] + y)
            self.setValue(i, 2, column[2] + z)
            i += 1

    def copy(self):
        newMatrix = matrix() #we need to individually create the columns, without creating any references
        for i in range(0, self.width):
            newColumn = []
            for a in range(0, self.height):
                newColumn.append(self.data[i][a])
            newMatrix.addColumn(newColumn)
        return newMatrix

def multiplyMatrixs(m1, m2):
    resultMatrix = matrix()
    rMatrixHeight = m1.height
    rMatrixWidth = m2.width

    for _ in range(0, rMatrixWidth):
        newColumn = []
        for __ in range(0, rMatrixHeight):
            newColumn.append(0)
        resultMatrix.addColumn(newColumn)

    for columnIndex in range(0, resultMatrix.width):
        for rowIndex in range(0, resultMatrix.height):
            currentRow = m1.getRow(rowIndex)
            currentColumn = m2.getColumn(columnIndex)

            value = 0
            for i, _ in enumerate(currentRow):
                value += currentRow[i] * currentColumn[i]
                i += 1
            resultMatrix.setValue(columnIndex, rowIndex, value)
            rowIndex += 1
        columnIndex += 1
    
    return resultMatrix

def toRadians(angle):
    return angle * (math.pi / 180)
def sin(num):
    return math.sin(toRadians(num))
def cos(num):
    return math.cos(toRadians(num))

def distanceBetween(p1, p2):
    bottomDiagonal = math.sqrt((p2[0] - p1[0])**2 + (p2[2] - p1[2])**2)
    distance = math.sqrt(bottomDiagonal**2 + (p2[1] - p1[1])**2)
    return distance

#2 zoom outs
def calculateRotationMatrix(rotationX, rotationY, rotationZ):
    rX, rY, rZ = rotationX % 360, rotationY % 360, rotationZ % 360
    iHat = [cos(rY) * cos(rZ), cos(rX) * sin(rZ) + sin(rX) * sin(rY) * cos(rZ), sin(rX) * sin(rZ) - cos(rX) * sin(rY) * cos(rZ)]
    jHat = [-(cos(rY)) * sin(rZ), cos(rX) * cos(rZ) - sin(rX) * sin(rY) * sin(rZ), sin(rX) * cos(rZ) + cos(rX) * sin(rY) * sin(rZ)]
    kHat = [sin(rY), -(sin(rX)) * cos(rY), cos(rX) * cos(rY)]

    rotationMatrix = matrix()
    rotationMatrix.addColumn(iHat)
    rotationMatrix.addColumn(jHat)
    rotationMatrix.addColumn(kHat)
    return rotationMatrix

#OBJECTS
class XYZ:
    x: int
    y: int
    z: int
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
class Face:
    pointIndexes: list[int]
    colour: str
    def __init__(self, pointIndexes, colour):
        self.pointIndexes = pointIndexes
        self.colour = colour

class Shape:
    pointMatrix = matrix()

    rotationMatrix = matrix()
    rotation = XYZ(0, 0, 0)

    physicalMatrix = matrix()
    scale = 1

    position = XYZ(0, 0, 0)
    showOutline = False
    showPoints = False
    faces: list[Face] = []
    #No faceIndexes since turtle doesn't implement it without tracer, so it causes flickering

    def __init__(self):
        self.pointMatrix = matrix()
        self.rotationMatrix = matrix()
        self.rotation = XYZ(0, 0, 0)
        self.physicalMatrix = matrix()
        self.scale = 1
        self.position = XYZ(0, 0, 0)
        self.showOutline = False
        self.showPoints = False
        self.faces = []

    def updateRotationMatrix(self):
        rX, rY, rZ = self.rotation.x % 360, self.rotation.y % 360, self.rotation.z % 360
        self.rotationMatrix = calculateRotationMatrix(rX, rY, rZ)
    def updatePhysicalMatrix(self):
        self.physicalMatrix = multiplyMatrixs(self.rotationMatrix, self.pointMatrix);
        self.physicalMatrix.scaleUp(self.scale)

    def updateMatrices(self):
        self.updateRotationMatrix()
        self.updatePhysicalMatrix()

class Box(Shape):    
    def __init__(self, width, height, depth):
        super(Box, self).__init__()

        self.pointMatrix = matrix()
        self.pointMatrix.addColumn([0, 0, 0]);
        self.pointMatrix.addColumn([width, 0, 0]);
        self.pointMatrix.addColumn([width, height, 0]);
        self.pointMatrix.addColumn([0, height, 0]);
        self.pointMatrix.addColumn([0, 0, depth]);
        self.pointMatrix.addColumn([width, 0, depth]);
        self.pointMatrix.addColumn([width, height, depth]);
        self.pointMatrix.addColumn([0, height, depth]);
        
        centeringX, centeringY, centeringZ = -(width / 2), -(height / 2), -(depth / 2)
        self.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ)

        self.setFaces()
        self.updateMatrices()

    def setFaces(self):
        self.faces = [
            Face([0, 1, 2, 3], "#ff0000"),
            Face([1, 2, 6, 5], "#00ff00"),
            Face([2, 3, 7, 6], "#0000ff"),
            Face([0, 1, 5, 4], "#ffff00"),
            Face([0, 3, 7, 4], "#00ffff"),
            Face([4, 5, 6, 7], "#ff00ff"),
        ]



#CAMERA
class Camera:
    absPosition = XYZ(0, 0, None) #z is irrelevant but I don't want to create a new XY class
    zoom = 1

    worldRotation = XYZ(0, 0, 0)
    worldRotationMatrix = matrix()

    def __init__(self):
        self.absPosition =XYZ(0, 0, None)
        self.zoom = 1
        self.worldRotation = XYZ(0, 0, 0)
        self.worldRotationMatrix = matrix()
        self.updateRotationMatrix()

    def sortFurthestDistanceTo(self, list, positionKey, positionPoint):
        sortedList = []
        listCopy = list
        while (len(listCopy) != 0):
            furthestDistanceIndex = 0
            for i, item in enumerate(listCopy):
                if (distanceBetween(positionPoint, item[positionKey]) > distanceBetween(positionPoint, listCopy[furthestDistanceIndex][positionKey])):
                    furthestDistanceIndex = i
            sortedList.append(listCopy[furthestDistanceIndex])
            del listCopy[furthestDistanceIndex]
        return sortedList

    def updateRotationMatrix(self):
        rX, rY, rZ = self.worldRotation.x % 360, self.worldRotation.y % 360, self.worldRotation.z % 360
        self.worldRotationMatrix = calculateRotationMatrix(rX, rY, rZ);

    def render(self, objects: list[Shape]):
        objectData = []
        for object in objects:
            cameraObjectMatrix = object.physicalMatrix.copy()
            
            cameraObjectMatrix.scaleUp(self.zoom)
            cameraObjectMatrix = multiplyMatrixs(self.worldRotationMatrix, cameraObjectMatrix)

            gridOrigin = XYZ(-(self.absPosition.x), -(self.absPosition.y), 0)
            originObjectVector = matrix()
            originObjectVector.addColumn([object.position.x, object.position.y, object.position.z])
            originObjectVector = multiplyMatrixs(self.worldRotationMatrix, originObjectVector)
            originObjectTranslation = originObjectVector.getColumn(0)

            screenOriginObjectVector = matrix()
            screenOriginObjectVector.addColumn([(gridOrigin.x + originObjectTranslation[0]), (gridOrigin.y + originObjectTranslation[1]), (gridOrigin.z + originObjectTranslation[2])])
            screenOriginObjectVector.scaleUp(self.zoom)

            ultimateTranslation  = screenOriginObjectVector.getColumn(0)
            cameraObjectMatrix.translateMatrix(ultimateTranslation[0], ultimateTranslation[1], ultimateTranslation[2])

            totalX, totalY, totalZ = 0, 0, 0
            for i in range(0, cameraObjectMatrix.width):
                point = cameraObjectMatrix.getColumn(i)
                totalX += point[0]; totalY += point[1]; totalZ += point[2]
            averageX, averageY, averageZ = totalX / cameraObjectMatrix.width, totalY / cameraObjectMatrix.width, totalZ / cameraObjectMatrix.width
            center = [averageX, averageY, averageZ]

            objectData.append( { "object" : object, "screenPoints" : cameraObjectMatrix, "center" : center} )

        positionPoint = [0, 0, -50000]
        sortedObjects = self.sortFurthestDistanceTo(objectData, "center", positionPoint)

        for sortedObject in sortedObjects:
            object: Shape = sortedObject["object"]
            screenPoints: matrix = sortedObject["screenPoints"]

            objectFaces = []
            for i, (face) in enumerate(object.faces):
                if face.colour == "": #avoid doing unnessecary calculations
                    continue
                points = []
                for a in range(0, len(face.pointIndexes)):
                    points.append(screenPoints.getColumn(face.pointIndexes[a]))
                
                totalX, totalY, totalZ = 0, 0, 0
                for point in points:
                    totalX += point[0]; totalY += point[1]; totalZ += point[2];
                averageX, averageY, averageZ = totalX / len(points), totalY / len(points), totalZ / len(points)
                center = [averageX, averageY, averageZ]
                objectFaces.append( { "points" : points, "center" : center, "colour" : face.colour, "faceIndex" : i } )
            
            sortedFaces = self.sortFurthestDistanceTo(objectFaces, "center", positionPoint)

            for sortedFace in sortedFaces:
                facePoints = sortedFace["points"]
                colour = sortedFace["colour"]
                drawShape(facePoints, colour, object.showOutline)

            if object.showPoints == True:
                for i in range(0, screenPoints.width):
                    point = screenPoints.getColumn(i)
                    plotPoint(point, "#000000", str(i));

        return sortedObjects

    def renderGrid(self):
        gridLength = 1000 * self.zoom

        startPointMatrix = matrix();
        startPointMatrix.addColumn([-gridLength, 0, 0])
        startPointMatrix.addColumn([0, -gridLength, 0])
        startPointMatrix.addColumn([0, 0, -gridLength])
        endPointMatrix = matrix();
        endPointMatrix.addColumn([gridLength, 0, 0])
        endPointMatrix.addColumn([0, gridLength, 0])
        endPointMatrix.addColumn([0, 0, gridLength])

        startPointMatrix = multiplyMatrixs(self.worldRotationMatrix, startPointMatrix);
        endPointMatrix = multiplyMatrixs(self.worldRotationMatrix, endPointMatrix);

        gridOrigin = XYZ(-(self.absPosition.x), -(self.absPosition.y), 0)
        absoluteOriginObjectVector = matrix();
        absoluteOriginObjectVector.addColumn([gridOrigin.x, gridOrigin.y, gridOrigin.z]);
        absoluteOriginObjectVector.scaleUp(self.zoom);
        zoomTranslationVector = absoluteOriginObjectVector.getColumn(0)

        startPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        endPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);

        drawLine([0, 0], [0, 0], "#000000") #for some reason the draw line function doesnt work properly, it works when I draw an imaginary line before hand
        drawLine(startPointMatrix.getColumn(0), endPointMatrix.getColumn(0), "#000000") #x axis
        drawLine(startPointMatrix.getColumn(1), endPointMatrix.getColumn(1), "#000000") #y axis
        drawLine(startPointMatrix.getColumn(2), endPointMatrix.getColumn(2), "#000000") #z axis

    def enableMovementControls(self, **kwargs):
        print("Drag mouse around to rotate world\nHold right click and drag to pan\nScroll in/out to zoom in/out")
        global t
        global screen
        if t == None:
            print("Cannot enableMovementControls, canvas has not been initialized. Please use the linkCanvas(width, height) function before rendering any shapes")
            return
        canvas = screen.getcanvas().winfo_toplevel()
        canvasWidth = canvas.winfo_width()
        canvasHeight = canvas.winfo_height()

        rotation = kwargs.get('rotation', True)
        movement = kwargs.get('movement', True)
        zoom = kwargs.get('zoom', True)
        limitRotation = kwargs.get('limitRotation', False)

        mousedown = False
        rightClickDown = False
        previousX, previousY = 0, 0

        def MouseDown(event):
            nonlocal mousedown, previousX, previousY
            mousedown = True
            previousX = event.x - (canvasWidth / 2)
            previousY = event.y - (canvasHeight / 2)
        def MouseUp(event):
            nonlocal mousedown
            mousedown = False
        canvas.bind("<ButtonPress-1>", MouseDown)
        canvas.bind("<ButtonRelease-1>", MouseUp)

        def RightClickDown(event):
            nonlocal rightClickDown
            rightClickDown = True
        def RightClickUp(event):
            nonlocal rightClickDown
            rightClickDown = False
        canvas.bind("<ButtonPress-2>", RightClickDown)
        canvas.bind("<ButtonRelease-2>", RightClickUp)

        def MouveMove(event):
            nonlocal mousedown, rightClickDown, previousX, previousY
            if mousedown == False:
                return
            x = event.x - (canvasWidth / 2)
            y = event.y - (canvasHeight / 2)
            
            differenceX, differenceY = x - previousX, y - previousY
            if rightClickDown == True and movement == True:
                self.absPosition.x -= differenceX / self.zoom
                self.absPosition.y += differenceY / self.zoom

            elif rotation == True:
                absX = abs(self.worldRotation.x) % 360
                if absX > 90 and absX < 270:
                    differenceX *= -1
                self.worldRotation.x -= differenceY / 5
                self.worldRotation.y -= differenceX / 5

                if self.worldRotation.x < -90 and limitRotation == True:
                    self.worldRotation.x = -90
                elif self.worldRotation.x > 0 and limitRotation == True:
                    self.worldRotation.x = 0

                self.updateRotationMatrix()
            
            previousX, previousY = x, y
        canvas.bind('<Motion>', MouveMove)

        def OnScroll(event):
            if zoom == False:
                return

            delta = event.delta
            if self.zoom < 0:
                self.zoom = delta / 100
            self.zoom -= delta / 100            
        canvas.bind('<MouseWheel>', OnScroll)




#PYTHON SPECIFIC FUNCTIONS
import json

#This function takes in the TS shape, e.g. from Shape Builder, and returns the new Python class which you can wrap an exec statement around
def convertShapeToPython(typescriptShape: str):
    name = ""
    points = []
    centering = []
    faces = []
    dataCounter = 0
    typescriptShape = typescriptShape.replace(" ", "")
    typescriptShape = typescriptShape.replace(";", "")

    lines = typescriptShape.splitlines()
    for line in lines:
        if line.startswith("class"):
            "classShurikenextendsShape{"
            name = line[5: -13]
            dataCounter += 1
        elif line.startswith("constpoints="):
            splitLine = line.split("=")
            pointsJSON = splitLine[1]
            points = json.loads(pointsJSON)
            dataCounter += 1
        elif line.startswith("const[centeringX,centeringY,centeringZ]="):
            splitLine = line.split("=")
            centeringJSON = splitLine[1]
            centering = json.loads(centeringJSON)
            dataCounter += 1
        elif line.startswith("this.faces="):
            splitLine = line.split("=")
            facesJSON = splitLine[1]
            facesJSON = facesJSON.replace('pointIndexes', '"pointIndexes"')
            facesJSON = facesJSON.replace('colour', '"colour"')
            faces = json.loads(facesJSON)
            dataCounter += 1

    if dataCounter < 4:
        print("Unable to find required data")
        return

    classString = (f'''
class {name}(Shape):
    def __init__(self):
        super({name}, self).__init__()

        points = {json.dumps(points)}
        for point in points:
            self.pointMatrix.addColumn(point)

        centeringX, centeringY, centeringZ = {centering[0]}, {centering[1]}, {centering[2]}
        self.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ)

        self.setFaces()
        self.updateMatrices()

    def setFaces(self):
        faceDict = {json.dumps(faces)}
        for faceObject in faceDict:
            self.faces.append(Face(faceObject["pointIndexes"], faceObject["colour"]))
''')

    return classString


#Delta Time
import time

previousTime = time.time()
def deltaTime(constant: float):
    global previousTime
    currentTime = time.time()
    deltaTime = currentTime - previousTime
    previousTime = currentTime
    deltaMultiplier = deltaTime / constant
    return deltaMultiplier