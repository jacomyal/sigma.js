/**
 * This plugin "emulates" a graph database that provides a unique method to
 * retrieve the neighborhood of a node. Basically, it loads a graph and stores
 * it in a headless sigma.classes.graph instance.
 *
 * It is useful for people who want to provide a neighborhoods navigation
 * inside a big graph instead of just displaying it.
 *
 * This plugin also adds to the graph model a method called "neighborhood".
 * Check the comments of the method for more information.
 *
 * Here is how the plugin works:
 *
 * 1. Initialize it like this:
 *  > var db = new sigma.plugins.neighborhoods();
 *  > db.init('path/to/my/graph.json');
 *
 * 2. Wait for it to be ready, by using its "onready" method:
 *  > db.onready(function() {
 *  >   console.log('db is ready!');
 *  > });
 *
 * 3. Retrieve the neighborhood of a node:
 *  > var centerNodeID = 'anyNodeID';
 *  > mySigmaInstance
 *  >   .read(db.neighborhood(centerNodeID))
 *  >   .refresh();
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * This method takes the ID of node as argument and returns the graph of the
   * specified node, with every other nodes that are connected to it and every
   * edges that connect two of the previously cited nodes. It uses the built-in
   * indexes from sigma's graph model to search in the graph.
   *
   * @param  {string} centerId The ID of the center node.
   * @return {object}          The graph, as a simple descriptive object, in
   *                           the format required by the "read" graph method.
   */
  sigma.classes.graph.addMethod(
    'neighborhood',
    function(centerId) {
      var k1,
          k2,
          k3,
          node,
          center,
          // Those two local indexes are here just to avoid duplicates:
          localNodesIndex = {},
          localEdgesIndex = {},
          // And here is the resulted graph, empty at the moment:
          graph = {
            nodes: [],
            edges: []
          };

      // Check that the exists:
      if (!this.nodes(centerId))
        return graph;

      // Add center. It has to be cloned to add it the "center" attribute
      // without altering the current graph:
      node = this.nodes(centerId);
      center = {};
      center.center = true;
      for (k1 in node)
        center[k1] = node[k1];

      localNodesIndex[centerId] = true;
      graph.nodes.push(center);

      // Add neighbors and edges between the center and the neighbors:
      for (k1 in this.allNeighborsIndex[centerId]) {
        if (!localNodesIndex[k1]) {
          localNodesIndex[k1] = true;
          graph.nodes.push(this.nodesIndex[k1]);
        }

        for (k2 in this.allNeighborsIndex[centerId][k1])
          if (!localEdgesIndex[k2]) {
            localEdgesIndex[k2] = true;
            graph.edges.push(this.edgesIndex[k2]);
          }
      }

      // Add edges connecting two neighbors:
      for (k1 in localNodesIndex)
        if (k1 !== centerId)
          for (k2 in localNodesIndex)
            if (
              k2 !== centerId &&
              k1 !== k2 &&
              this.allNeighborsIndex[k1][k2]
            )
              for (k3 in this.allNeighborsIndex[k1][k2])
                if (!localEdgesIndex[k3]) {
                  localEdgesIndex[k3] = true;
                  graph.edges.push(this.edgesIndex[k3]);
                }

      // Finally, let's return the final graph:
      return graph;
    }
  );

  sigma.utils.pkg('sigma.plugins');

  /**
   * sigma.plugins.neighborhoods constructor.
   */
  sigma.plugins.neighborhoods = function() {
    var ready = false,
        readyCallbacks = [],
        graph = new sigma.classes.graph();

    /**
     * This method just returns the neighborhood of a node
     *
     * @param  {[type]}   centerNodeID [description]
     * @param  {Function} callback     [description]
     * @return {[type]}                [description]
     */
    this.getNeighborhood = function(centerNodeID, callback) {
      return ready ?
        graph.neighborhood(centerNodeID) :
        {
          nodes: [],
          edges: []
        };
    };
    this.onready = function(callback) {
      if (ready)
        callback();
      else
        readyCallbacks.push(callback);

      return this;
    };
    this.init = function(path) {
      // Reset unready state:
      ready = false;

      // Quick XHR polyfill:
      var xhr = (function() {
        if (window.XMLHttpRequest)
          return new XMLHttpRequest();

        var names,
            i;

        if (window.ActiveXObject) {
          names = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Msxml2.XMLHTTP',
            'Microsoft.XMLHTTP'
          ];

          for (i in names)
            try {
              return new ActiveXObject(names[i]);
            } catch (e) {}
        }

        return null;
      })();

      if (!xhr)
        throw 'XMLHttpRequest not supported, cannot load the data.';

      xhr.open('GET', path, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          // When the file is loaded, we can initialize everything and execute
          // the "ready" callbacks:
          graph.clear().read(JSON.parse(xhr.responseText));
          ready = true;console.log(readyCallbacks.length);
          readyCallbacks.forEach(function(fn) {console.log('asklmhas');
            fn();
          });
        }
      };

      // Start loading the file:
      xhr.send();

      return this;
    };
  };
}).call(window);
