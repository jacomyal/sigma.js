[![Build Status](https://travis-ci.org/jacomyal/sigma.js.svg)](https://travis-ci.org/jacomyal/sigma.js)

Angular Install Instructions
=================

For those interested in using Sigma.js with angular, I hope these instructions help and save you some pain.

### Verified Platforms

I've tested this on Windows 10, Ubuntu 18 and MacOS Mojave.

### Steps


 - npm install sigma -save
 - npm install sigm-webpack -save
 - Open angular.json file in a text editor
 - Look for "architect" -> "build" -> "options" -> "assets". Assets takes and array of settings. Add {"glob": "**/*", "input":"./node_modules/sigma/build", "output": "/assets/lib" }
 - Look for "architect" -> "build" -> "options" -> "scripts". Scripts tells angular to include the files when it compiles the application. Add "src/assets/lib/sigma/sigma.conf.js","node_modules/sigma/build/sigma.min.js"
 - Save the file
 - Create the sigma.conf.js file and add in line to it: mxBasePath = 'assets/lib/sigma';
 - Save sigma.conf.js
 - Start your angular app with ng serve
 - Start Chrome and open the debugger
 - Go to the source tab and you should see sigma.min.js in the assets/lib folder
 
To Test sigma really works, edit one of your component .ts files.
 - Add import { sigma } from 'sigma';
 - Add var sigmaJs = new sigma();

When you inspect the object in Chrome debugger, it should be a valid sigma object. If you get sigma undefined resource error, it means sigma wasn't installed correctly. Remove sigma and repeat the installation steps again.