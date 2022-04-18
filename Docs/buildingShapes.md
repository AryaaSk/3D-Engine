# How to use Shape Builder
## How to create a new object:
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
```javascript
const pentagon = new PentagonalPrism();
pentagon.position.x = 300;
pentagon.position.y = 300;
camera.render([pentagon]);
```

## How to import shapes into Shape Builder:
1. Click on the Import Shape button next to the title in the Shape Builder
2. Copy and paste the shape class code into the text input, make sure you haven't added a line break between the Points Array, the Faces Array, or the Centering Array.
3. Click done and your shape should be in the Shape Editor, where you can edit it normally, and then just export it again.

- If you are are unsure of what arrays/data it is talking about, you can refer to this:\
![Shape Builder Code](https://github.com/AryaaSk/3D-Engine/blob/master/Previews/ImportCodeExplanation.png?raw=true)

## Good Shape Builder Techniques:
### Points:
1. You should create the points first, since they are the building blocks of all the components. 
2. You can use the Point Commands to speed up the workflow:
    - The Translate option will allow you to translate a group of points by a vector, this is very useful if you have some points and you want to create a shape such as a prism
    - The Duplicate option will just duplicate a group of points, by using this and the translation, it is very quick to create a prism, just create 1 face, duplicate the points, and translate the new points by the depth of your prism.
    - The Scale Points option takes in a scale factor vector, as well as a group of points. It will apply a scale factor in the corresponding axis to each point. For example if you input a scale factor vector of [2, 1, 2], on point (10, 0, 5), the new point will be (20, 0, 10). **Be careful of giving 0 as a scale factor, as this will just set the corresponding axis to 0**, the Shape Builder will give you a warning if you try and add 0, since you probably meant to do 1.

### Faces:
- It is important to configure the faces correctly, otherwise your shape may look weird from different angles.
1. When you are editing the faces, **instead of manually typing out every point index, you can just click on the text input, and then start clicking on the actual points**, it will add them into the textfield for you. This speeds up the process a lot.
2. Just like with the points, there are also face commands:
    - The Colour Change takes in the face indexes (the number next to the face), and changes their colours based on a hex code that you give it.
3. If you have a plane, and then you have positioned more components on top of it, it may cause some issues with the renderer, where the plane is rendered above the components, since it is so large that the center is actually closer to the position point (0, 0, -50000). To minimize this issue you need to try and keep each face as small as possible:
    - Here is an example, I am building a house object, and the front face is covering parts of the door and windows
    ![House Disjointed Faces](https://github.com/AryaaSk/3D-Engine/blob/master/Research/HouseJoinedFace.png?raw=true)

    - Instead of creating a single face for the front wall, I have split it up between the door and the window components, this drastically helps reduce the issue of faces being wrongly placed on top of each other. This is what it looks like after I split up the faces:\
    ![House Disjointed Faces](https://github.com/AryaaSk/3D-Engine/blob/master/Research/HouseDisjointedFaces.png?raw=true)

### Centering:
- To center the object, an easy way is to find the *upper and lower bound* of each axis, then just center it by halfing the range between them.