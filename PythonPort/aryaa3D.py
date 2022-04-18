#Porting the aryaa3D.ts, into Python Turtle
#Date: 13/04/22, self may get outdated since it is a lot of work to port the entire library from Typescript to Python
#There will not be many comments since the functions basically perform the same thing as in the TS/JS files

#TURTLE UTILITIES
import turtle

t: turtle.Turtle = None
screen: turtle.Screen = None
def linkCanvas():
    global t
    global screen
    canvasWidth = 1000
    canvasHeight = 600
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
    t.penup()
    t.goto(p[0], p[1])
    t.dot(10, colour)
def drawLine(p1, p2, colour):
    global t
    t.penup()
    t.pencolor(colour)
    t.goto(p1[0], p1[1])
    t.pendown()
    t.goto(p2[0], p2[1])
    t.penup()
def drawShape(points, colour, outline):
    global t
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
    global t
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
        newMatrix = matrix()
        for i in range(0, self.width):
            newMatrix.addColumn(self.getColumn(i))
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





#PYTHON SPECIFIC FUNCTIONS
import json

#This function takes in the TS shape, e.g. from Shape Builder, and prints out the new Python class which you can just copy and paste
def printPythonShape(typescriptShape: str):
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

    print(classString)
    return classString

class House(Shape):
    def __init__(self):
        super(House, self).__init__()

        points = [[0, 0, 0], [200, 0, 0], [200, 0, 100], [0, 0, 100], [0, 100, 0], [200, 100, 0], [200, 100, 100], [0, 100, 100], [40, 140, 50], [160, 140, 50], [85, 0, 0], [115, 0, 0], [85, 50, 0], [115, 50, 0], [85, 0, -10], [115, 0, -10], [85, 50, -10], [115, 50, -10], [30, 80, 0], [50, 80, 0], [30, 60, 0], [50, 60, 0], [30, 80, -10], [50, 80, -10], [30, 60, -10], [50, 60, -10], [150, 80, 0], [170, 80, 0], [150, 60, 0], [170, 60, 0], [150, 80, -10], [170, 80, -10], [150, 60, -10], [170, 60, -10]]
        for point in points:
            self.pointMatrix.addColumn(point)

        centeringX, centeringY, centeringZ = -100, -70, -50
        self.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ)

        self.setFaces()
        self.updateMatrices()

    def setFaces(self):
        faceDict = [{"pointIndexes": [5, 6, 2, 1], "colour": "#c2600f"}, {"pointIndexes": [6, 2, 3, 7], "colour": "#c2600f"}, {"pointIndexes": [7, 4, 0, 3], "colour": "#c2600f"}, {"pointIndexes": [5, 9, 6], "colour": "#0593ff"}, {"pointIndexes": [4, 8, 9, 5], "colour": "#0593ff"}, {"pointIndexes": [6, 9, 8, 7], "colour": "#0593ff"}, {"pointIndexes": [7, 8, 4], "colour": "#0593ff"}, {"pointIndexes": [12, 16, 14, 10], "colour": "#ffce47"}, {"pointIndexes": [12, 16, 17, 13], "colour": "#ffce47"}, {"pointIndexes": [17, 13, 11, 15], "colour": "#ffce47"}, {"pointIndexes": [16, 17, 15, 14], "colour": "#ffce47"}, {"pointIndexes": [18, 19, 23, 22], "colour": "#0b07f2"}, {"pointIndexes": [18, 22, 24, 20], "colour": "#0b07f2"}, {"pointIndexes": [24, 25, 21, 20], "colour": "#0b07f2"}, {"pointIndexes": [23, 19, 21, 25], "colour": "#0b07f2"}, {"pointIndexes": [22, 23, 25, 24], "colour": "#0b07f2"}, {"pointIndexes": [26, 27, 31, 30], "colour": "#0b07f2"}, {"pointIndexes": [31, 27, 29, 33], "colour": "#0b07f2"}, {"pointIndexes": [26, 30, 32, 28], "colour": "#0b07f2"}, {"pointIndexes": [32, 33, 29, 28], "colour": "#0b07f2"}, {"pointIndexes": [30, 31, 33, 32], "colour": "#0b07f2"}, {"pointIndexes": [4, 18, 20, 0], "colour": "#c2600f"}, {"pointIndexes": [0, 20, 21, 10], "colour": "#c2600f"}, {"pointIndexes": [21, 10, 12], "colour": "#c2600f"}, {"pointIndexes": [13, 11, 28], "colour": "#c2600f"}, {"pointIndexes": [11, 28, 29, 1], "colour": "#c2600f"}, {"pointIndexes": [1, 29, 27, 5], "colour": "#c2600f"}, {"pointIndexes": [19, 26, 28, 13, 12, 21], "colour": "#c2600f"}, {"pointIndexes": [5, 27, 26, 19, 18, 4], "colour": "#c2600f"}]
        for faceObject in faceDict:
            self.faces.append(Face(faceObject["pointIndexes"], faceObject["colour"]))