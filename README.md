<img src="http://sigmajs.org/img/sigmajs.png"></img>

*sigma.js* is a free and open-source JavaScript library to draw graphs, using the HTML5 canvas element. It has been especially designed to share interactive network maps on a Web page or to explore dynamically a network database. It is distributed under the [MIT License](https://github.com/jacomyal/sigma.js/blob/master/LICENSE.txt).

###Use
To initialize *sigma.js* on a DOM element, use :

    var sigInst = sigma.init(domElement);

This method will return an object, with its own graph and the different public methods you can use to interact with your sigma instance.

To fill the graph, use :

    sigInst.addNode('hello', {
      label: 'Hello',
      x: Math.random(),
      y: Math.random()
    }).addNode('world', {
      label: 'World!',
      x: Math.random(),
      y: Math.random()
    }).addEdge('hello','world');

Also, a lot of different parameters are available to customize the way your instance work. For example :

    sigInst.drawingProperties({
      defaultEdgeType: 'curve'
    }).mouseProperties({
      maxRatio: 32
    });

will set the maximum zooming ratio to 32/1, and display each edge as a curve if its type is not indicated.

Some full examples are available at [sigmajs.org/examples.html](http://sigmajs.org/examples.html). You can also check '**src/core/sigmapublic.js**' for an exhaustive list of the different available public methods.

###Features
* Chainable methods
* Custom events management
* Possibility to add plugins, including :
    * [GEXF](http://gexf.net/format/) parser
    * [ForceAtlas2](https://gephi.org/2011/forceatlas2-the-new-version-of-our-home-brew-layout/) layout algorithm
* Simple and accessible public API
* Customisable drawing / graph management
* Frame insertion, to make the drawing process fluid

###Build
To build *sigma.js* :

* Download the [Google Closure Compiler](http://code.google.com/closure/compiler/) and put the .jar file in `/build`
* Use `make minify-simple` or `make minify-advanced` to minify concatenation result (*Warning*: `make minify-advanced` is pretty agressive on renaming, and this minification has not been tested yet).
* You can also just use `make concat` to obtain an unminified but working version of *sigma.js*, without the need of the Closure Compiler

###Thanks
*sigma.js* is mostly inspired by [Gephi](http://gephi.org) and the maps of [Antonin Rohmer](http://antonin.rohmer.free.fr/) from [Linkfluence](http://labs.linkfluence.net) (one nice example [here](http://www.guardian.co.uk/news/datablog/interactive/2011/sep/07/norway-breivik-manifesto-mapped)) - thanks to him also for his wise advices.

Much thanks also to [Mathieu Jacomy](http://www.medialab.sciences-po.fr/fr/team/mathieu-jacomy/) for having developped the main plugins, and for his help on the API and his experienced advices.

###Want to contribute?
The `TODO.txt` file at the root of the project contains different ideas of features that would improve *sigma.js*. You can also fill an [issue ticket](http://github.com/jacomyal/sigma.js/issues) if you find a bug.
