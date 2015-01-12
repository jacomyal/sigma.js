[ ![Codeship Status for Linkurious/sigma.js](https://www.codeship.io/projects/327f96c0-2c93-0132-9e32-4683d3e816f8/status)](https://www.codeship.io/projects/38962)

linkurious.js
=================

The Linkurious.js toolkit speeds up the development of modern Web applications that leverage the power of graph visualization and interaction.

Graphs are also called networks: they are made of nodes linked by edges. Graphs are a powerful way to represent any relationships in data like social networks (i.e. who likes who), infrastructure (i.e. how devices are connected), flows (i.e. where does the money go), and much more.

Linkurious.js provides a collection of **HTML5** features based on [Sigma.js](http://sigmajs.org/), the fastest open source Javascript graph drawing engine on the market. Linkurious.js is published in dual licenses, **available under both commercial and GNU GPLv3 licenses** (see below).

---

### Introduction

Linkurious.js is developed in pure Javascript. It uses Sigma.js for its graph data structure and visualization engine, which provides both **Canvas**, **WebGL** and **SVG** renderers for nodes and edges. Sigma.js is highly flexible thanks to its modular architecture, and is extensible by plugins. The Linkurious.js toolkit is made of **more than 30 Sigma.js plugins**, combined to work together and tested for integration into modern Web applications.

### Resources

The [wiki](https://github.com/Linkurious/sigma.js/wiki) provides documentation on APIs, and you can start learning how to code with Linkurious.js with the `examples` and `test` directories.

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

Also, you can customize the build by adding or removing files from the `coreJsFiles` array in `Gruntfile.js` before applying the grunt task.

### Why linkurious.js?

At [Linkurious SAS](http://linkurio.us) we are big fans of Sigma.js. We use it extensively in our applications because it is an efficient graph *viewer*, but application developers like us need more high level and integration-ready features to create smart graph applications. We have thus developed more than 20 plugins, and we provide [our configuration]() to embed it into applications.

Stating the above, we define our mission as follows:

1. To work on **core fixes** and core improvements in collaboration with the Sigma.js team.
2. To develop **integration-ready features** such as filters, tooltips, or Excel exporter.
3. To provide **professional support** for developers to succeed in their projects.

### Benefits

You should consider Linkurious.js as your primary toolkit for building graph-based applications on the Web if you need:
* to ship your solution quickly;
* to focus on the core value of your application;
* to display large graphs (i.e. larger than 2000 nodes and 5000 edges);
* to interact with the graph visualization;
* development support.

### Browser Support

All modern web browsers are supported, including:
* Internet Explorer 10+
* Chrome 23+
* Firefox 15+
* Safari 6+

Touch events on tablet and mobile are currently supported as *beta* features.

### Performance

Performance depends on the graphic renderers.

* **Canvas** is supported in all modern browsers. It is a great tradeoff between flexibility and performance. We recommend to display up to 5 000 nodes and 8 000 edges with this technology.
* **WebGL** needs a graph card and is thus not suitable to all clients, but it unlock the graph size boundaries. It is great to display large graph withs a layout previously computed (e.g. from [Gephi](http://gephi.github.io/)) because the graphic card memory is loaded only once. We recommend to display up to 20 000 nodes and 30 000 edges with this technology.
* **SVG** is partially supported and is still under active development. It is great for interactivity and animations but performances drop quickly with the number of displayed items. We recommend to display up to 500 nodes and 1 000 edges with this technology. Notice that an [SVG export plugin](https://github.com/Linkurious/sigma.js/tree/linkurious-version/plugins/sigma.exporters.svg) is available to generate files for Inkscape or Adobe Illustrator.

Different kinds of renderers can be mixed, and automatic fallback from WebGL to Canvas makes adoption wider and smoother. With linkurious.js your application is not bound to a specific rendering technology anymore!

See our [performance guide]() to learn more.

### External Dependencies

Some plugins may require external dependencies. Please check their README files.

### Contributing

You can contribute by submitting [issues tickets](http://github.com/Linkurious/sigma.js/issues) and proposing [pull requests](http://github.com/Linkurious/sigma.js/pulls). Make sure that tests and linting pass before submitting any pull request by running the command `grunt`.

See our [workflow](https://github.com/Linkurious/sigma.js/wiki/Workflow) to understand where to push your code.

The whole source code is validated by the [Google Closure Linter](https://developers.google.com/closure/utilities/) and [JSHint](http://www.jshint.com/), and the comments are written in [JSDoc](http://en.wikipedia.org/wiki/JSDoc) (tags description is available [here](https://developers.google.com/closure/compiler/docs/js-for-compiler)).


### License

The Linkurious.js toolkit is dual-licensed, **available under both commercial and open-source licenses**. The open-source license is the GNU General Public License v.3 ("GPL"). In addition to GPL, the Linkurious.js toolkit is available under commercial license terms from [Linkurious SAS](http://linkurio.us).

GPL has been chosen as the open-source license for Linkurious.js, because it provides the following four degrees of freedom:

1. The freedom to run the program for any purpose.
2. The freedom to study how the program works and adapt it to specific needs.
3. The freedom to redistribute copies so you can help your neighbor.
4. The freedom to improve the program and release your improvements to the public, so that the whole community benefits.

These four degrees of freedom are very important for the success of Linkurious.js, and it is important that all users of Linkurious.js under GPL adhere to these and fully meet all the requirements set by the GPL. It is recommended that a thorough legal analysis is conducted when choosing to use the GPL or other open-source licenses. In many cases, the GPL is well suited, but it is important that the freedoms of the GPL are not restricted from the user of an application or device using a GPL library such as Linkurious.js, which may be difficult to achieve in some use cases.

**The commercial terms are therefore more suited for integration into commercial applications or closed-source applications.** In this case, simply get in touch with us at contact@linkurio.us.

