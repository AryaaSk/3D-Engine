### How to create object by manually setting points and faces through code (**not recommended**):
1. Create a subclass of Shape and call it the shape you are trying to create
2. In the construcutor take in arguments which construct the shape, such as width and height
3. Create centering vectors, for example in a cube, the centeringX is -(width / 2)
4. Clear the pointMatrix, and populate it with points around the origin, and then translate that matrix by the centering vectors. After this the pointMatrix should be populated with points around the origin.
5. Create a setFaces() method, and call it + updateMatrices(); after you have setup the pointMatrix. Inside of this you just need to set the faces to the indexes of the vertexs which they are made of. For example in a cube, you may have a face object like { pointIndexes: [0, 1, 2, 3], colour: "#ff0000" }, the point 0, 1, 2, 3 refer to the vertexs of the cube. Refer to [ResearchImages/BoxLayout](ResearchImages/BoxLayout.png) for more info.\
*You can look at the currently existing shapes in Source/Scene/Objects.ts for reference, it will make more sense when you see it yourself*

## Setting up local environment:
- When developing locally you will want to use the local JS files which get compiled by the Typescript compiler, for example if I was working on the source I would use this tag:
```javascript
<script src="/Source/aryaa3D.js"></script>
```
- When you have finished developing locally, just switch the script tag to use the Github Pages link, for the source it would be this:
```javascript
<script src="https://aryaask.github.io/3D-Engine/Source/aryaa3D.js"></script>
```
- It is the same process for Shape Builder, but the tags just point to different files, use the local JS files when developing, and switch to the Github tag once you have finished