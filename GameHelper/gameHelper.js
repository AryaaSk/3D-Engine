"use strict";
//Keysdown detection
//Using onkeydown() will cause a delay, now you can just access the keysDown array, and handle it in the animation loop
const keysDown = [];
document.onkeydown = ($e) => {
    const key = $e.key.toLowerCase();
    if (keysDown.includes(key) == false) {
        keysDown.push(key);
    }
};
document.onkeyup = ($e) => {
    const key = $e.key.toLowerCase();
    if (keysDown.includes(key) == true) {
        keysDown.splice(keysDown.indexOf(key), 1);
    }
};
