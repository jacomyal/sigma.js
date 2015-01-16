[ ![Codeship Status for Linkurious/linkurious.js](https://www.codeship.io/projects/b0710040-7f11-0132-f563-62fa786c5210/status)](https://www.codeship.io/projects/57170)

linkurious.js
=================

The linkurious.js toolkit speeds up the development of modern Web applications that leverage the power of **graph visualization and interaction**.

Graphs are also called networks: they are made of nodes linked by edges. Graphs are a powerful way to represent any relationships in data like social networks (i.e. who likes who), infrastructure (i.e. how devices are connected), flows (i.e. where does the money go), and much more.

Linkurious.js provides a collection of **HTML5** features based on [Sigma.js](http://sigmajs.org/), the fastest open source Javascript graph drawing engine on the market. Linkurious.js is published in dual licenses, **available under both commercial and GNU GPLv3 licenses** (see below).

---

[
![glyphs-icons](https://github.com/Linkurious/linkurious.js/wiki/media/glyphs-icons-230.gif)
![edge-shapes](https://github.com/Linkurious/linkurious.js/wiki/media/edge-shapes-230.gif)
![filters](https://github.com/Linkurious/linkurious.js/wiki/media/filters-230.gif)
![forceatlas](https://github.com/Linkurious/linkurious.js/wiki/media/forceatlas-230.gif)
![glyphs](https://github.com/Linkurious/linkurious.js/wiki/media/glyphs-230.gif)
![halo](https://github.com/Linkurious/linkurious.js/wiki/media/halo-230.gif)
![hover-edge](https://github.com/Linkurious/linkurious.js/wiki/media/hover-edge-230.gif)
![designer](https://github.com/Linkurious/linkurious.js/wiki/media/designer-230.gif)
![lasso](https://github.com/Linkurious/linkurious.js/wiki/media/lasso-230.gif)
![layout-arctic](https://github.com/Linkurious/linkurious.js/wiki/media/layout-arctic-230.gif)
![level-of-details-edges-labels](https://github.com/Linkurious/linkurious.js/wiki/media/level-of-details-edges-labels-230.gif)
![node-icons](https://github.com/Linkurious/linkurious.js/wiki/media/node-icons-230.gif)
![pie-charts](https://github.com/Linkurious/linkurious.js/wiki/media/pie-charts-230.gif)
![self-loop](https://github.com/Linkurious/linkurious.js/wiki/media/self-loop-230.gif)
![tooltips](https://github.com/Linkurious/linkurious.js/wiki/media/tooltips-230.gif)
](https://github.com/Linkurious/linkurious.js/wiki)

---

### Introduction

Linkurious.js is developed in pure Javascript. It uses Sigma.js for its graph data structure and visualization engine, which provides both **Canvas**, **WebGL** and **SVG** renderers for nodes and edges. Sigma.js is highly flexible thanks to its modular architecture, and is extensible by plugins. The linkurious.js toolkit is made of **more than 30 Sigma.js plugins**, combined to work together and tested for integration into modern Web applications.

### Resources

The [wiki](https://github.com/Linkurious/linkurious.js/wiki) provides documentation on APIs, and you can start learning how to code with Linkurious.js with the `examples` and `test` directories.

### Getting started

To use it, clone the repository:

```
git clone git@github.com:Linkurious/sigma.js.git
```

To build the code:

 - Install [Node.js](http://nodejs.org/).
 - Install [gjslint](https://developers.google.com/closure/utilities/docs/linter_howto?hl=en).
 - Use `npm install` to install sigma development dependencies.
 - Use `npm run build` to minify the code with [Uglify](https://github.com/mishoo/UglifyJS). The minified files `sigma.min.js` and sigma plugins will then be accessible in the `build/` folder.

You can also customize the build by adding or removing files from the `coreJsFiles` array in `Gruntfile.js` before applying the grunt task.

### Why linkurious.js?

At [Linkurious SAS](http://linkurio.us) we are big fans of Sigma.js. We use it extensively in our applications because it is an efficient graph *viewer*, but application developers like us need more high level and integration-ready features to create smart graph applications. We have thus developed more than 20 plugins and improved the core of Sigma with enhanced interaction features.

We define our mission as follows:

1. To work on **core fixes** and core improvements in collaboration with the Sigma.js team.
2. To develop **integration-ready features** such as filters, tooltips, or Excel exporter.
3. To provide **professional support** for developers to succeed in their projects.

### Benefits

You should consider linkurious.js as your primary toolkit for building graph-based applications on the Web if you need:
* to ship your solution quickly;
* to focus on the core value of your application;
* to display large graphs (i.e. larger than 2000 nodes and 5000 edges);
* to interact with the graph visualization;
* development support.

### Browser Support

All modern web browsers are supported, including:
* Internet Explorer 10+
* Chrome 23+ and Chromium
* Firefox 15+
* Safari 6+

Touch events on tablet and mobile are currently supported as *beta* features.

### Performance

Performance depends on the graph size, the graphic renderers, the computer and browser on which the web application runs.

* **Canvas** is supported in all modern browsers. It is a great tradeoff between flexibility and performance. Use it to display up to 5 000 nodes and 8 000 edges.
* **WebGL** needs a graph card and is thus not suitable to all clients, but it unlocks the graph size boundaries. It is great to display large graph withs a layout previously computed (e.g. from [Gephi](http://gephi.github.io/)) because the graphic card memory is loaded only once. Use it to display up to 20 000 nodes and 30 000 edges.
* **SVG** is partially supported and is still under active development. It is great for interactivity and animations but performances drop quickly with the number of displayed items. Use it to display up to 500 nodes and 1 000 edges. Notice that an [SVG export plugin](https://github.com/Linkurious/linkurious.js/tree/linkurious-version/plugins/sigma.exporters.svg) is available to generate files for Inkscape or Adobe Illustrator.

Different kinds of renderers can be mixed, and automatic fallback from WebGL to Canvas makes adoption wider and smoother. With linkurious.js your application is not bound to a specific rendering technology anymore!

See our [performance guide](https://github.com/Linkurious/linkurious.js/wiki/Performance) to learn more.

### External Dependencies

Linkurious.js comes with no external dependency, making it compatible with any Javascript framework and library. We integrate it with [Angular.js](https://angularjs.org/) in a Linkurious product.

A few plugins may require external dependencies. Please check their README files.

### Contributing

You can contribute by submitting [issues tickets](http://github.com/Linkurious/linkurious.js/issues) and proposing [pull requests](http://github.com/Linkurious/linkurious.js/pulls). Make sure that tests and linting pass before submitting any pull request by running the command `grunt`.

See [How to fix bugs](https://github.com/Linkurious/linkurious.js/wiki/How-to-fix-bugs) and to [How to develop plugins](https://github.com/Linkurious/linkurious.js/wiki/How-to-develop-plugins).

The whole source code is validated by the [Google Closure Linter](https://developers.google.com/closure/utilities/) and [JSHint](http://www.jshint.com/), and the comments are written in [JSDoc](http://en.wikipedia.org/wiki/JSDoc) (tags description is available [here](https://developers.google.com/closure/compiler/docs/js-for-compiler)).


### License

The linkurious.js toolkit is dual-licensed, **available under both commercial and open-source licenses**. The open-source license is the GNU General Public License v.3 ("GPL"). In addition to GPL, the Linkurious.js toolkit is available under commercial license terms from [Linkurious SAS](http://linkurio.us).

GPL has been chosen as the open-source license for linkurious.js, because it provides the following four degrees of freedom:

1. The freedom to run the program for any purpose.
2. The freedom to study how the program works and adapt it to specific needs.
3. The freedom to redistribute copies so you can help your neighbor.
4. The freedom to improve the program and release your improvements to the public, so that the whole community benefits.

These four degrees of freedom are very important for the success of linkurious.js, and it is important that all users of linkurious.js under GPL adhere to these and fully meet all the requirements set by the GPL. It is recommended that a thorough legal analysis is conducted when choosing to use the GPL or other open-source licenses. **If your application restricts any of these freedoms, such as commercial or closed-source applications, then the GPL license is not suited and you must contact us to buy a commercial license at contact@linkurio.us.**
