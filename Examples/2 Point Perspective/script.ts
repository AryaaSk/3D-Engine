linkCanvas("renderingWindow");

const cube3 = new Box(50, 50, 50);

const camera3 = new PerspectiveCamera();
camera3.position.x = 50;
camera3.position.y = 50;
camera3.position.z = -300;

camera3.render([cube3]);

//Currently can render this 1 point perspective
//Next want to render this scene in 2 point perspective