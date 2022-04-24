# Game Helper
### The game helper is just a collection of functions, to help you create games using aryaa3D.\ 

## Setup
To import it just add this script tag:
```html
<script src="https://aryaask.github.io/3D-Engine/GameHelper/gameHelper.js"></script>
```

## Utilities
- **enableKeyListeners()**: This function will start a key listener, which keeps track of which keys are currently being held down. You can access this with the **keysDown** array, and handle the keys inside your event loop. When just using the document.onkeydown(), there is a delay between clicking the key, and holding, this function will remove that. Here is an example of using it:
```javascript
enableKeyListeners();

//inside animation loop...
keysDown.forEach(key => {
    //Key will always be in lower case
    if (key == "a") {
        console.log("The a key was pressed");
    }
})
```

- **syncCamera()**: This function takes in 2 parameters: The Camera, and an Object. Then it will position the camera at the same position and rotate the world inversly to the object's y-rotation, which makes a third-person view of the object you are following. You can look in the [ThirdPersonDemo](https://github.com/AryaaSk/3D-Engine/blob/master/GameHelper/ThirdPersonDemo) for more info.

- There are also some CannonJS functions, which help you add physics to your game.\
**If you want to add physics to your game, read the [Physics Integration README](PhysicsIntegration.md)**