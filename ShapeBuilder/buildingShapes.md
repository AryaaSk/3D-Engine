# How to build shapes using Shape Builder
## Explaining some techniques and tips on how to use the Shape Builder well

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