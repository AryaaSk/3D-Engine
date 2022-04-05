## How to update code to CDN:
1. Make changes locally, you will probably be using local script tags.
2. Delete everything in aryaa3D.js, and copy paste the code from the local JS files into it. Use this order: canvasUtilities.js, utilities.js, objects.js, camera.js
3. Commit and Upload to github
4. Get commit hash from github (it is next to the time ago at the start page of the repo), you have to click on it and get the whole thing
5. Replace current gitcdn link with old hash, with new hash (just replace the hashes), in README.md and also index.html
6. Commit and Upload again to github. 

## How to create new object:
1. Create a subclass of Shape and call it the shape you are trying to create
2. In the construcutor take in arguments which construct the shape, such as width and height
3. Create centering vectors, for example in a cube, the centeringX is -(width / 2)
4. Clear the pointMatrix, and populate it with points around the origin, and then translate that point by the centering vectors. After this the pointMatrix should be populated with points around the origin.
5. Create a setEdgesFaces() method, and call it + updateMatrices(); after you have setup the pointMatrix. Inside of this you just need to set edges and faces to the indexes of the vertexs which they are made of. For example in a cube, you may have a face object like { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" }, the point 0, 1, 2, 3 refer to the vertexs of the cube. Refer to *Research/BoxLayout.png* for more info.