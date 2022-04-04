# The Rendering Pipeline
## How an object is created and then drawn onto the screen

1. First the user creates a new object (I will use a box example), and gives it width, height and depth values.
2. Inside the Box class constructor, it creates a new box, around the origin, using the above dimensions. The box is represented as a matrix, each column is a vector or point around the origin. You can see the order of the points in the image below\
![Box Layout](https://github.com/AryaaSk/3D-Engine/blob/master/Research/BoxLayout.png?raw=true)\
Each number represents the (index of the corner)+1, the +1 is because I didn't want to start at 0.