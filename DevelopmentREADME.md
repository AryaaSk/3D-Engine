## How to create new object:
### Using the Shape Builder (**recommended**):
1. Go to [Shape Builder](https://aryaask.github.io/3D-Engine/ShapeBuilder/), this is the Shape Builder/Editor
2. Then add the points to construct your shape, don't worry about centering them around the origin, you can do that later with the centering inputs, the number on the point is the point's index, which will be important later when defining the faces/ Here you can see me making a Pentagonal Prism, what it looks like after I added the points:\
![Shape Builder Preview 1](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview1.png?raw=true)
3. Once you have added the points, you need to define the faces, just add as many faces as the shape you are making has, and input the point indexes which connect to make the face, make sure to use regular mathmatical notation, the points should go around the face, and not cross over. Here you can see how the Pentagonal Prism looks after defining the face:\
![Shape Builder Preview 2](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview2.png?raw=true)
4. Then make sure to center the shape using the centering inputs, the origin should be in the center of the shape, and then you can click on the Export to Code button, which will generate the code of the shape you have just created. Here is what the Pentagonal Prism's code looks like after centering it:\
![Shape Builder Preview 3](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview3.png?raw=true)\
*Don't forget to name your shape, if your changes haven't been updated to the screen then press Render Shape, or click Enter*
- It is strongly recommended to create the points first, then the faces, and then center the shape in that order, this is because the faces are dependant on the points, and the centering is easier when you can see the entire shape. You can always modify the points even after you have connected a face to them, but if you delete points which construct a face then there may be some issues.

5. Finally you can just copy and paste this code into your script, and then after that you can use the shape like any other shape.
```
const pentagon = new PentagonalPrism();
pentagon.position.x = 300;
pentagon.position.y = 300;
camera.render([pentagon]);
```
**If you want to know some good techniques and tips to create shapes, go to the [Building Shapes README](ShapeBuilder/buildingShapes.md)**

### Manually setting points and faces through code (**not recommended**):
1. Create a subclass of Shape and call it the shape you are trying to create
2. In the construcutor take in arguments which construct the shape, such as width and height
3. Create centering vectors, for example in a cube, the centeringX is -(width / 2)
4. Clear the pointMatrix, and populate it with points around the origin, and then translate that matrix by the centering vectors. After this the pointMatrix should be populated with points around the origin.
5. Create a setFaces() method, and call it + updateMatrices(); after you have setup the pointMatrix. Inside of this you just need to set the faces to the indexes of the vertexs which they are made of. For example in a cube, you may have a face object like { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" }, the point 0, 1, 2, 3 refer to the vertexs of the cube. Refer to *Research/BoxLayout.png* for more info.\
*You can look at the currently existing shapes in Source/Scene/Objects.ts for reference, it will make more sense when you see it yourself*

## How to import shapes into Shape Builder:
1. Click on the Import Shape button next to the title in the Shape Builder
2. Copy and paste the shape class code into the text input, make sure you haven't added a line break between the Points Array, the Faces Array, or the Centering Array.
3. Click done and your shape should be in the Shape Editor, where you can edit it normally, and then just export it again.

- If you are are unsure of what arrays/data it is talking about, you can refer to this:\
![Shape Builder Code](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ImportCodeExplanation.png?raw=true)

## How to update source code to CDN:
1. Make changes locally, you will probably be using local script tags.
```
<script src="/JS/Source/Utilities/canvasUtilities.js"></script>
<script src="/JS/Source/Utilities/utilities.js"></script>
<script src="/JS/Source/Scene/objects.js"></script>
<script src="/JS/Source/Scene/camera.js"></script>
```
2. Run this command from the project root directory: 
```
npx tsc --outfile JS/aryaa3D.js Source/Utilities/canvasUtilities.ts Source/Utilities/utilities.ts Source/Scene/objects.ts Source/Scene/camera.ts
```
3. Switch to use the Github Pages script tag
```
<script src="https://aryaask.github.io/3D-Engine/JS/aryaa3D.js"></script>
```

## How to setup local development environment for Shape Builder:
- When developing you will need to use the local /JS file which is automatically compiled by the typescript compiler, so use this script tag:
```
<script src="/JS/ShapeBuilder/shapeBuilder.js" defer></script>
```
- Once you have finished, switch back to the Github pages script tag:
```
<script src="https://aryaask.github.io/3D-Engine/JS/ShapeBuilder/shapeBuilder.js" defer></script>
```