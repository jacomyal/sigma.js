sigma.parsers.gexf
==================

Plugin developed by [Alexis Jacomy](https://github.com/jacomyal), on top of [gexf-parser](https://github.com/Yomguithereal/gexf-parser), developed by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin provides a single function, `sigma.parsers.gexf()`, that will load a GEXF encoded file, parse it, and instantiate sigma.

The most basic way to use this helper is to call it with a path and a sigma configuration object. It will then instantiate sigma, but after having added the graph into the config object.

````javascript
sigma.parsers.gexf(
  'myGraph.gexf',
  { container: 'myContainer' }
);
````

It is also possible to update an existing instance's graph instead.

````javascript
sigma.parsers.gexf(
  'myGraph.gexf',
  myExistingInstance,
  function() {
    myExistingInstance.refresh();
  }
);
````
