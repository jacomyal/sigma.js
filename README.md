<h2>sigma.js</h2>

*sigma.js* is a JavaScript library to visualize and explore graphs using the HTML5 canvas element.

<h4>Use</h4>

To initialize sigma.js on a DOM element, use 
    var instance = sigma.init(dom);
This method will return an object with the different public methods you can use to interact with your sigma instance (`addNode`, `dropEdge`, `resize`, etc...).

See '**src/core/sigmapublic.js**' for an exhaustive list of those public methods.
You can also take a look at '**debug/index.html**' for a full use example.


<h4>Build</h4>

*sigma.js* uses **gjslint** and **fixjsstyle** from [Google Closure Linter](http://code.google.com/closure/utilities/docs/linter_howto.html) to keep the code readable, and the [Closure Compiler](http://code.google.com/closure/compiler/) to minify the sources.

The Makefile actions `check` and `fix` will respectively apply **gjslint** and **fixjsstyle** on *sigma.js*'s sources.

To build sigma.js:

1. Use `make concat` to concatenate the different JS files into 'build/sigma.concat.js'.
2. Use `make minify-simple` or `make minify-advanced` to minify concatenation result (*Warning*: `make minify-advanced` uses Closure advanced minify mode which is pretty agressive on renaming, and this minification has not been tested yet).