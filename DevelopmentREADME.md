## How to update code to CDN:
1. Make changes locally, you will probably be using local script tags.
2. Delete everything in aryaa3D.js, and copy paste the code from the local JS files into it. Use this order: canvasUtilities.js, utilities.js, objects.js, camera.js
3. Commit and Upload to github
4. Get commit hash from github (it is next to the time ago at the start page of the repo), you have to click on it and get the whole thing
5. Replace current gitcdn link with old hash, with new hash (just replace the hashes), in README.md and also index.html
6. Commit and Upload again to github. 

## How to create new object:
