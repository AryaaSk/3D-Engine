#Porting the aryaa3D.ts, into Python Turtle
#Date: 13/04/22, self may get outdated since it is a lot of work to port the entire library from Typescript to Python
#There will not be many comments since the functions basically perform the same thing as in the TS/JS files

#TURTLE UTILITIES
import turtle

#No linkCanvas() function, since we can just initialize the screen ourselves
canvasWidth = 1000
canvasHeight = 600
screen = turtle.Screen()
screen.setup(canvasWidth, canvasHeight)
screen.tracer(False) #to enable us to get smooth 60fps animation   
t = turtle.Turtle()
t.hideturtle();
t.penup();
    
#No gridX and gridY functions since in turtle, the center of the screen is at coordinate (0, 0)
def plotPoint(p, colour, label):
    t.penup()
    t.goto(p[0], p[1])
    t.dot(10, colour)
    print("Will add label later")
def drawLine(p1, p2, colour):
    t.penup()
    t.pencolor(colour)
    t.goto(p1[0], p1[1])
    t.pendown()
    t.goto(p2[0], p2[1])
    t.penup()
def drawShape(points, colour, outline):
    t.penup()
    t.goto(points[0][0], points[0][1])
    t.fillcolor(colour)
    t.pencolor('black')
    if (outline == True):
        t.pendown()
    t.begin_fill()
    for p in points:
        t.goto(p[0], p[1])
    t.penup()
    t.end_fill();
def clearCanvas():
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
        print("Will implement matrix scaledUp() function later")

    def translateMatrix(self, x, y, z):
        i = 0
        while i != self.width:
            column = self.getColumn(i)
            self.setValue(i, 0, column[0] + x)
            self.setValue(i, 1, column[1] + y)
            self.setValue(i, 2, column[2] + z)
            i += 1

    def copy(self):
        #return copy.deepcopy(self)
        return self #it appears I do not need a proper copying function in python

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
            for i in range(0, len(currentRow)):
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
class Shape:
    pointMatrix = matrix()

    rotationMatrix = matrix()
    rotation = { "x": 0, "y": 0, "z": 0 }

    physicalMatrix = matrix()
    scale = 1

    position = { "x": 0, "y": 0, "z": 0 }
    showOutline = False
    showPoints = False
    faces = []
    showFaceIndexes = False

    def __init__(self):
        self.pointMatrix = matrix()
        self.rotationMatrix = matrix()
        self.rotation = { "x": 0, "y": 0, "z": 0 }
        self.physicalMatrix = matrix()
        self.scale = 1
        self.position = { "x": 0, "y": 0, "z": 0 }
        self.showOutline = False
        self.showPoints = False
        self.faces = []
        self.showFaceIndexes = False

    def updateRotationMatrix(self):
        rX, rY, rZ = self.rotation["x"] % 360, self.rotation["y"] % 360, self.rotation["z"] % 360
        self.rotationMatrix = calculateRotationMatrix(rX, rY, rZ)
    def updatePhysicalMatrix(self):
        self.physicalMatrix = multiplyMatrixs(self.rotationMatrix, self.pointMatrix);
        self.physicalMatrix.scaleUp(self.scale)

    def updateMatrices(self):
        self.updateRotationMatrix()
        self.updatePhysicalMatrix()

class Box(Shape):    
    def __init__(self, width, height, depth):
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
            { "pointIndexes": [0, 1, 2, 3], "colour": "#ff0000" },
            { "pointIndexes": [1, 2, 6, 5], "colour": "#00ff00" },
            { "pointIndexes": [2, 3, 7, 6], "colour": "#0000ff" },
            
            { "pointIndexes": [0, 1, 5, 4], "colour": "#ffff00" },
            { "pointIndexes": [0, 3, 7, 4], "colour": "#00ffff" },
            { "pointIndexes": [4, 5, 6, 7], "colour": "#ff00ff" },
        ]

#todo: add more shapes



#CAMERA

class Camera:
    absPosition = { "x" : 0, "y" : 0 }
    zoom = 1

    worldRotation = { "x" : 0 , "y" : 0, "z" : 0 }
    worldRotationMatrix = matrix()

    def __init__(self):
        self.absPosition = { "x" : 0, "y" : 0 }
        self.zoom = 1
        self.worldRotation = { "x" : 0 , "y" : 0, "z" : 0 }
        self.worldRotationMatrix = matrix()
        self.updateRotationMatrix()

    def sortFurthestDistanceTo(self, list, positionKey, positionPoint):
        sortedList = []
        listCopy = list
        while (len(listCopy) != 0):
            furthestDistanceIndex = 0
            for i in range(0, len(listCopy)):
                if (distanceBetween(positionPoint, listCopy[i][positionKey]) > distanceBetween(positionPoint, listCopy[furthestDistanceIndex][positionKey])):
                    furthestDistanceIndex = i
            sortedList.append(listCopy[furthestDistanceIndex])
            del listCopy[furthestDistanceIndex]
        return sortedList

    def updateRotationMatrix(self):
        rX, rY, rZ = self.worldRotation["x"] % 360, self.worldRotation["y"] % 360, self.worldRotation["z"] % 360
        self.worldRotationMatrix = calculateRotationMatrix(rX, rY, rZ);

    def render(self, objects: list[Shape]):
        objectData = []
        for object in objects:
            cameraObjectMatrix = object.physicalMatrix.copy()
            
            cameraObjectMatrix.scaleUp(self.zoom)
            cameraObjectMatrix = multiplyMatrixs(self.worldRotationMatrix, cameraObjectMatrix)

            gridOrigin = { "x" : -(self.absPosition["x"]), "y" : -(self.absPosition["y"]), "z" : 0 }
            originObjectVector = matrix()
            originObjectVector.addColumn([object.position["x"], object.position["y"], object.position["z"]])
            originObjectVector = multiplyMatrixs(self.worldRotationMatrix, originObjectVector)
            originObjectTranslation = originObjectVector.getColumn(0)

            screenOriginObjectVector = matrix()
            screenOriginObjectVector.addColumn([(gridOrigin["x"] + originObjectTranslation[0]), (gridOrigin["y"] + originObjectTranslation[1]), (gridOrigin["z"] + originObjectTranslation[2])])
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

        for objectIndex in range(0, len(sortedObjects)):
            object: Shape = sortedObjects[objectIndex]["object"]
            screenPoints: matrix = sortedObjects[objectIndex]["screenPoints"]

            objectFaces = []
            for i in range(0, len(object.faces)):
                points = []
                for a in range(0, len(object.faces[i]["pointIndexes"])):
                    points.append(screenPoints.getColumn(object.faces[i]["pointIndexes"][a]))
                
                totalX, totalY, totalZ = 0, 0, 0
                for a in range(0, len(points)):
                    totalX += points[a][0]; totalY += points[a][1]; totalZ += points[a][2];
                averageX, averageY, averageZ = totalX / len(points), totalY / len(points), totalZ / len(points)
                center = [averageX, averageY, averageZ]
                objectFaces.append( { "points" : points, "center" : center, "colour" : object.faces[i]["colour"], "faceIndex" : i } )
            
            sortedFaces = self.sortFurthestDistanceTo(objectFaces, "center", positionPoint)

            for i in range(0, len(sortedFaces)):
                facePoints = sortedFaces[i]["points"]
                colour = sortedFaces[i]["colour"]
                if colour != "":
                    drawShape(facePoints, colour, object.showOutline)

                if object.showFaceIndexes == True:
                    plotPoint(sortedFaces[i]["center"], "#000000", str(sortedFaces[i]["faceIndex"]))

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

        gridOrigin = { "x": -(self.absPosition["x"]), "y": -(self.absPosition["y"]), "z": 0 };
        absoluteOriginObjectVector = matrix();
        absoluteOriginObjectVector.addColumn([gridOrigin["x"], gridOrigin["y"], gridOrigin["z"]]);
        absoluteOriginObjectVector.scaleUp(self.zoom);
        zoomTranslationVector = absoluteOriginObjectVector.getColumn(0)

        startPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);
        endPointMatrix.translateMatrix(zoomTranslationVector[0], zoomTranslationVector[1], zoomTranslationVector[2]);

        drawLine([0, 0], [0, 0], "#000000") #for some reason the draw line function doesnt work properly, it works when I draw an imaginary line before hand
        drawLine(startPointMatrix.getColumn(0), endPointMatrix.getColumn(0), "#000000") #x axis
        drawLine(startPointMatrix.getColumn(1), endPointMatrix.getColumn(1), "#000000") #y axis
        drawLine(startPointMatrix.getColumn(2), endPointMatrix.getColumn(2), "#000000") #z axis





#PYTHON SPECIFIC FUNCTIONS
import json

#This is how you can use custom shapes from TS/JS, or from the Shape Builder, and add them to python
def convertShapeToPython(typescriptShape: str):
    points = []
    centering = []
    faces = []
    dataCounter = 0
    typescriptShape = typescriptShape.replace(" ", "")
    typescriptShape = typescriptShape.replace(";", "")

    lines = typescriptShape.splitlines()
    for line in lines:
        if line.startswith("constpoints="):
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

    if dataCounter < 3:
        print("Unable to find required data")
        return

    newShape = Shape()
    for point in points:
        newShape.pointMatrix.addColumn(point)
    centeringX, centeringY, centeringZ = centering[0], centering[1], centering[2]
    newShape.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ)
    newShape.faces = faces
    newShape.updateMatrices()

    return newShape


Shuriken = convertShapeToPython('''
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

''')



#TESTING / DEMO
#You could probably import this by downloading the file, then just calling it using open(), and using eval() to run the script before using it yourself

camera = Camera()
camera.worldRotation["x"] = -20
camera.worldRotation["y"] = 20
camera.worldRotation["z"] = 0
camera.updateRotationMatrix()

box = Box(100, 100, 100)
box.position["x"] = 300

shuriken = Shuriken
shuriken.position["z"] = 300
shuriken.showOutline = True
shuriken.scale = 0.6
shuriken.updateMatrices()

def animationLoop():
    shuriken.rotation["y"] += 5
    shuriken.updateMatrices()

    camera.worldRotation["y"] += 1
    camera.updateRotationMatrix()

    clearCanvas()
    camera.renderGrid()
    camera.render([box, shuriken])

    screen.update()
    screen.ontimer(animationLoop, 16) #16ms, 60fps

animationLoop()
screen.mainloop()