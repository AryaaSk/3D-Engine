## How to create new object:
### Using the Shape Builder (**recommended**):
1. Go to the shape builder folder and open the index.html, this is the Shape Builder
2. Then add the points to construct your shape, don't worry about centering them around the origin, you can do that later with the centering inputs, the number on the point is the point's index, which will be important later when defining the faces/ Here you can see me making a Pentagonal Prism, what it looks like after I added the points:\
![Shape Builder Preview 1](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview1.png?raw=true)\
3. Once you have added the points, you need to define the faces, just add as many faces as the shape you are making has, and input the point indexes which connect to make the face, make sure to use regular mathmatical notation, the points should go around the face, and not cross over. Here you can see how the Pentagonal Prism looks after defining the face:\
![Shape Builder Preview 2](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview2.png?raw=true)\
4. Then make sure to center the shape using the centering inputs, the origin should be in the center of the shape, and then you can click on the Export to Code button, which will generate the code of the shape you have just created. Here is what the Pentagonal Prism's code looks like after centering it:\
![Shape Builder Preview 3](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ShapeBuilderPreview3.png?raw=true)\
*Don't forget to name your shape, if you want to see the changes you made then click the Render Shape button, or click Enter*

5. Finally you can just copy and paste this code into your script, and then use the shape like any other shapes.
```
const pentagon = new PentagonalPrism();
pentagon.position.x = 300;
pentagon.position.y = 300;
```

### Manually setting points and faces through code (**not recommended**):
1. Create a subclass of Shape and call it the shape you are trying to create
2. In the construcutor take in arguments which construct the shape, such as width and height
3. Create centering vectors, for example in a cube, the centeringX is -(width / 2)
4. Clear the pointMatrix, and populate it with points around the origin, and then translate that matrix by the centering vectors. After this the pointMatrix should be populated with points around the origin.
5. Create a setFaces() method, and call it + updateMatrices(); after you have setup the pointMatrix. Inside of this you just need to set the faces to the indexes of the vertexs which they are made of. For example in a cube, you may have a face object like { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" }, the point 0, 1, 2, 3 refer to the vertexs of the cube. Refer to *Research/BoxLayout.png* for more info.
*You can look at the currently existing shapes in JS/Scene/objects.js for reference, it will make more sense when you see it yourself*

## How to update code to CDN:
1. Make changes locally, you will probably be using local script tags.
2. Run this command from the project root directory: 
```
npx tsc --outfile JS/aryaa3D.js Typescript/Utilities/canvasUtilities.ts Typescript/Utilities/utilities.ts Typescript/Scene/objects.ts Typescript/Scene/camera.ts
```
3. Commit and Upload to github
4. Get commit hash from github (it is next to the time ago at the start page of the repo), you have to click on it and get the whole thing
5. Replace current gitcdn link with old hash, with new hash (just replace the hashes), in README.md and also index.html
6. Commit and Upload again to github. 