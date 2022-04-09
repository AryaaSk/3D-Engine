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

class House extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = [[0,0,0],[200,0,0],[200,0,100],[0,0,100],[0,100,0],[200,100,0],[200,100,100],[0,100,100],[40,140,50],[160,140,50],[85,0,0],[115,0,0],[85,50,0],[115,50,0],[85,0,-10],[115,0,-10],[85,50,-10],[115,50,-10],[30,80,0],[50,80,0],[30,60,0],[50,60,0],[30,80,-10],[50,80,-10],[30,60,-10],[50,60,-10],[150,80,0],[170,80,0],[150,60,0],[170,60,0],[150,80,-10],[170,80,-10],[150,60,-10],[170,60,-10]];
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [-100, -70, 0];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{pointIndexes:[5,6,2,1],colour:"#c2600f"},{pointIndexes:[6,2,3,7],colour:"#c2600f"},{pointIndexes:[7,4,0,3],colour:"#c2600f"},{pointIndexes:[5,9,6],colour:"#0593ff"},{pointIndexes:[4,8,9,5],colour:"#0593ff"},{pointIndexes:[6,9,8,7],colour:"#0593ff"},{pointIndexes:[7,8,4],colour:"#0593ff"},{pointIndexes:[12,16,14,10],colour:"#ffce47"},{pointIndexes:[12,16,17,13],colour:"#ffce47"},{pointIndexes:[17,13,11,15],colour:"#ffce47"},{pointIndexes:[16,17,15,14],colour:"#ffce47"},{pointIndexes:[18,19,23,22],colour:"#0b07f2"},{pointIndexes:[18,22,24,20],colour:"#0b07f2"},{pointIndexes:[24,25,21,20],colour:"#0b07f2"},{pointIndexes:[23,19,21,25],colour:"#0b07f2"},{pointIndexes:[22,23,25,24],colour:"#0b07f2"},{pointIndexes:[26,27,31,30],colour:"#0b07f2"},{pointIndexes:[31,27,29,33],colour:"#0b07f2"},{pointIndexes:[26,30,32,28],colour:"#0b07f2"},{pointIndexes:[32,33,29,28],colour:"#0b07f2"},{pointIndexes:[30,31,33,32],colour:"#0b07f2"},{pointIndexes:[4,18,20,0],colour:"#c2600f"},{pointIndexes:[0,20,21,10],colour:"#c2600f"},{pointIndexes:[21,10,12],colour:"#c2600f"},{pointIndexes:[13,11,28],colour:"#c2600f"},{pointIndexes:[11,28,29,1],colour:"#c2600f"},{pointIndexes:[1,29,27,5],colour:"#c2600f"},{pointIndexes:[19,26,28,13,12,21],colour:"#c2600f"},{pointIndexes:[5,27,26,19,18,4],colour:"#c2600f"}];
    }
}

//not a proper sphere, I just tried to create it using the Shape Builder.
//To make a proper sphere I would just pick a point a certain distance from the origin (radius), and then just rotate that point around using a rotation matrix, and then join up all the points
class Sphere extends Shape {
    constructor () {
        super();

        this.pointMatrix = new matrix();
        const points = [[-60,20,20],[-20,20,60],[20,20,60],[60,20,20],[60,20,-20],[20,20,-60],[-20,20,-60],[-60,20,-20],[-84,50,28],[-28,50,84],[28,50,84],[84,50,28],[84,50,-28],[28,50,-84],[-28,50,-84],[-84,50,-28],[-100,80,33.6],[-33.6,80,100],[33.6,80,100],[100,80,33.6],[100,80,-33.6],[33.6,80,-100],[-33.6,80,-100],[-100,80,-33.6],[-84,140,28],[-28,140,84],[28,140,84],[84,140,28],[84,140,-28],[28,140,-84],[-28,140,-84],[-84,140,-28],[-60,170,20],[-20,170,60],[20,170,60],[60,170,20],[60,170,-20],[20,170,-60],[-20,170,-60],[-60,170,-20],[-100,110,33.6],[-33.6,110,100],[33.6,110,100],[100,110,33.6],[100,110,-33.6],[33.6,110,-100],[-33.6,110,-100],[-100,110,-33.6],[0,0,0],[0,190,0]];
        for (let i = 0; i != points.length; i += 1)
        { this.pointMatrix.addColumn(points[i]); }

        const [centeringX, centeringY, centeringZ] = [0, 0, 0];
        this.pointMatrix.translateMatrix(centeringX, centeringY, centeringZ);

        this.setFaces();
        this.updateMatrices();
    }
    setFaces() {
        this.faces = [{pointIndexes:[0,8,15,7],colour:"#c4c4c4"},{pointIndexes:[7,6,14,15],colour:"#c4c4c4"},{pointIndexes:[6,5,13,14],colour:"#c4c4c4"},{pointIndexes:[5,4,12,13],colour:"#c4c4c4"},{pointIndexes:[4,3,11,12],colour:"#c4c4c4"},{pointIndexes:[3,2,10,11],colour:"#c4c4c4"},{pointIndexes:[2,1,9,10],colour:"#c4c4c4"},{pointIndexes:[1,0,8,9],colour:"#c4c4c4"},{pointIndexes:[9,8,16,17],colour:"#c4c4c4"},{pointIndexes:[8,15,23,16],colour:"#c4c4c4"},{pointIndexes:[15,14,22,23],colour:"#c4c4c4"},{pointIndexes:[14,13,21,22],colour:"#c4c4c4"},{pointIndexes:[13,12,20,21],colour:"#c4c4c4"},{pointIndexes:[12,11,19,20],colour:"#c4c4c4"},{pointIndexes:[11,10,18,19],colour:"#c4c4c4"},{pointIndexes:[10,9,17,18],colour:"#c4c4c4"},{pointIndexes:[18,17,41,42],colour:"#c4c4c4"},{pointIndexes:[17,16,40,41],colour:"#c4c4c4"},{pointIndexes:[16,23,47,40],colour:"#c4c4c4"},{pointIndexes:[23,22,46,47],colour:"#c4c4c4"},{pointIndexes:[22,21,45,46],colour:"#c4c4c4"},{pointIndexes:[21,20,44,45],colour:"#c4c4c4"},{pointIndexes:[20,19,43,44],colour:"#c4c4c4"},{pointIndexes:[19,18,42,43],colour:"#c4c4c4"},{pointIndexes:[44,28,27,43],colour:"#c4c4c4"},{pointIndexes:[43,27,26,42],colour:"#c4c4c4"},{pointIndexes:[42,26,25,41],colour:"#c4c4c4"},{pointIndexes:[41,25,24,40],colour:"#c4c4c4"},{pointIndexes:[40,24,31,47],colour:"#c4c4c4"},{pointIndexes:[47,31,30,46],colour:"#c4c4c4"},{pointIndexes:[46,30,29,45],colour:"#c4c4c4"},{pointIndexes:[45,29,28,44],colour:"#c4c4c4"},{pointIndexes:[30,29,37,38],colour:"#c4c4c4"},{pointIndexes:[29,28,36,37],colour:"#c4c4c4"},{pointIndexes:[28,27,35,36],colour:"#c4c4c4"},{pointIndexes:[27,26,34,35],colour:"#c4c4c4"},{pointIndexes:[26,25,33,34],colour:"#c4c4c4"},{pointIndexes:[25,24,32,33],colour:"#c4c4c4"},{pointIndexes:[24,31,39,32],colour:"#c4c4c4"},{pointIndexes:[31,30,38,39],colour:"#c4c4c4"},{pointIndexes:[7,48,6],colour:"#c4c4c4"},{pointIndexes:[6,48,5],colour:"#c4c4c4"},{pointIndexes:[5,48,4],colour:"#c4c4c4"},{pointIndexes:[4,48,3],colour:"#c4c4c4"},{pointIndexes:[3,48,2],colour:"#c4c4c4"},{pointIndexes:[2,48,1],colour:"#c4c4c4"},{pointIndexes:[1,48,0],colour:"#c4c4c4"},{pointIndexes:[0,48,7],colour:"#c4c4c4"},{pointIndexes:[38,49,39],colour:"#c4c4c4"},{pointIndexes:[49,38,37],colour:"#c4c4c4"},{pointIndexes:[37,49,36],colour:"#c4c4c4"},{pointIndexes:[36,49,35],colour:"#c4c4c4"},{pointIndexes:[35,49,34],colour:"#c4c4c4"},{pointIndexes:[34,49,33],colour:"#c4c4c4"},{pointIndexes:[33,49,32],colour:"#c4c4c4"},{pointIndexes:[49,32,39],colour:"#c4c4c4"}];
    }
}