sigma.plugins.neighborhood
==========================

Plugin developed by [Alexis Jacomy](https://github.com/jacomyal).

---

This plugin provides a method to retrieve the neighborhood of a node. Basically, it loads a graph and stores it in a headless `sigma.classes.graph` instance, that you can query to retrieve neighborhoods.

It is useful for people who want to provide a neighborhoods navigation inside a big graph instead of just displaying it, and without having to deploy an API or the list of every neighborhoods. But please note that this plugin is here as an example of what you can do with the graph model, and do not hesitate to try customizing your navigation through graphs.

This plugin also adds to the graph model a method called "neighborhood". Check the code for more information.

Here is how to use it:

````javascript
var db = new sigma.plugins.neighborhoods();
db.load('path/to/my/graph.json', function() {
  var nodeId = 'anyNodeID';
  mySigmaInstance
    .read(db.neighborhood(nodeId))
    .refresh();
});
````