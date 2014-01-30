sigma.js - v1.0.0
=================

Sigma is a JavaScript library dedicated to graph drawing.

---

### Note about this specific branch

This branch contains a full new version of sigma.

The lack of tests and documentation, plus the rigidity of the code, made any modification painful to push.

This new version has been developed to be more maintainable: Classes are no more encapsulated in sigma's scope but accessible in the global scope, and every settings and classes are easily overridable. That makes unit tests writing way easier.

Also, cameras, renderers and sigma instances have been separated, to make possible to use sigma with different renderers. Currently, only Canvas and WebGL are available, but SVG might come in an upcoming release.

A full documentation will come soon - until then you can check the examples in the `examples/` folder.

Finally, the API has fully been rewritten, and some new features have been added, including the **touch support** and a **WebGL renderer** in addition to the Canvas one.

This version will become the main version as soon as the API is frozen and every features from the master branch have been ported to this new version.

Please enjoy playing with it, and *don't hesitate to report bugs or inconsistent API elements*!

---

### How to use it

To use it, clone the repository:

```
git clone -b draft-v1.0.0 git@github.com:jacomyal/sigma.js.git
```

To build the code:

 - Install [Node.js](http://nodejs.org/), [NPM](https://npmjs.org/) and [Grunt](http://gruntjs.com/installing-grunt).
 - Use `npm install` to install sigma development dependencies.
 - Use `grunt uglify` to minify the code with [Uglify](https://github.com/mishoo/UglifyJS). The minified file `sigma.min.js` will then be accessible in the `build/` folder.

### Contributing

You can contribute by submitting [issues tickets](http://github.com/jacomyal/sigma.js/issues) and proposing [pull requests](http://github.com/jacomyal/sigma.js/pulls). Be sure to successfully run `grunt closureLint` and `grunt qunit` before submitting any pull request.

The whole source code is validated by the [Google Closure Linter](https://developers.google.com/closure/utilities/) and [JSHint](http://www.jshint.com/), and the comments are written in [JSDoc](http://en.wikipedia.org/wiki/JSDoc) (tags description is available [here](https://developers.google.com/closure/compiler/docs/js-for-compiler)).
