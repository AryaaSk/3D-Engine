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