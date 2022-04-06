## How to update code to CDN:
1. Make changes locally, you will probably be using local script tags.
2. Run this command from the project root directory: 
```
npx tsc --outfile aryaa3D.js Typescript/Utilities/canvasUtilities.ts Typescript/Utilities/utilities.ts Typescript/Scene/objects.ts Typescript/Scene/camera.ts
```
3. Commit and Upload to github
4. Get commit hash from github (it is next to the time ago at the start page of the repo), you have to click on it and get the whole thing
5. Replace current gitcdn link with old hash, with new hash (just replace the hashes), in README.md and also index.html
6. Commit and Upload again to github. 

## How to create new object:
1. Create a subclass of Shape and call it the shape you are trying to create
2. In the construcutor take in arguments which construct the shape, such as width and height
3. Create centering vectors, for example in a cube, the centeringX is -(width / 2)
4. Clear the pointMatrix, and populate it with points around the origin, and then translate that matrix by the centering vectors. After this the pointMatrix should be populated with points around the origin.
5. Create a setFaces() method, and call it + updateMatrices(); after you have setup the pointMatrix. Inside of this you just need to set the faces to the indexes of the vertexs which they are made of. For example in a cube, you may have a face object like { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" }, the point 0, 1, 2, 3 refer to the vertexs of the cube. Refer to *Research/BoxLayout.png* for more info.

*You can look at the currently existing shapes in JS/Scene/objects.js for reference, it will make more sense when you see it yourself*