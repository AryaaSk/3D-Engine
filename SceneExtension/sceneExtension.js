"use strict";
//This extension helps create 3D movement of the camera, by just moving all other objects in the scene in the inverse direction
//I decided not to also move the grid, to make it clear that it is actually just the objects moving
//You can think of it like the center of the grid is where the camera is located
class Scene {
    objects;
    movedObjects;
    camera;
    cameraPosition;
    fps;
    showGrid;
    constructor() {
        this.objects = [];
        this.movedObjects = [];
        this.camera = new Camera();
        this.cameraPosition = { x: 0, y: 0, z: 0 };
        this.fps = 60;
        this.showGrid = false;
    }
    clearObjects() {
        this.objects = [];
    }
    addObject(object) {
        this.objects.push(object);
    }
    removeObject(object) {
        let i = 0;
        while (i != this.objects.length) {
            if (this.objects[i].physicalMatrix == object.physicalMatrix) {
                this.objects.splice(i, 0);
                break;
            }
            i += 1;
        }
    }
    moveObjects() {
        //moves object's based on inverse of camera position
        this.movedObjects = [];
        this.objects.forEach(object => {
            //Copying the object here, since if I create a copy and change the position then it will also change the actual position
            const movedObject = new Shape();
            movedObject.rotationMatrix = object.rotationMatrix.copy();
            movedObject.physicalMatrix = object.physicalMatrix.copy();
            movedObject.scale = object.scale;
            movedObject.showFaceIndexes = object.showFaceIndexes;
            movedObject.showOutline = object.showOutline;
            movedObject.showPoints = object.showPoints;
            movedObject.faces = object.faces;
            movedObject.position = JSON.parse(JSON.stringify(object.position));
            movedObject.position.x -= this.cameraPosition.x;
            movedObject.position.y -= this.cameraPosition.y;
            movedObject.position.z -= this.cameraPosition.z;
            this.movedObjects.push(movedObject);
        });
    }
    startAnimationLoop() {
        setInterval(() => {
            this.moveObjects();
            clearCanvas();
            if (this.showGrid == true) {
                this.camera.renderGrid();
            }
            this.camera.render(this.movedObjects);
        }, (1000 / this.fps));
    }
}
