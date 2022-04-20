class Scene {
    private objects: Shape[];
    camera: Camera;

    fps: number;
    showGrid: boolean;

    constructor () {
        this.objects = [];
        this.camera = new Camera();
        this.fps = 60;
        this.showGrid = false;
    }

    clearObjects() {
        this.objects = [];
    }
    addObject(object: Shape) {
        this.objects.push(object)
    }
    removeObject(object: Shape) {
        let i = 0;
        while (i != this.objects.length) {
            if (this.objects[i].physicalMatrix == object.physicalMatrix) {
                this.objects.splice(i, 0);
                break;
            }
            i += 1;
        }
    }

    startAnimationLoop() {
        setInterval(() => {

            this.camera.render(this.objects);

        }, (1000 / this.fps));
    }
}