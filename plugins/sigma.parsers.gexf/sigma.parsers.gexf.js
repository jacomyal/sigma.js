;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');

  // Just a basic ID generator:
  var _id = 0;
  function edgeId() {
    return 'e' + (_id++);
  }

  /**
   * This function loads a GEXF file and creates a new sigma instance or
   * updates the graph of a given instance. It is possible to give a callback
   * that will be executed at the end of the process.
   *
   * @param  {string}       url      The URL of the GEXF file.
   * @param  {object|sigma} sig      A sigma configuration object or a sigma
   *                                 instance.
   * @param  {?function}    callback Eventually a callback to execute after
   *                                 having parsed the file. It will be called
   *                                 with the related sigma instance as
   *                                 parameter.
   */
  sigma.parsers.gexf = function(url, sig, callback) {
    var i,
        l,
        arr,
        obj;

    GexfParser.fetch(url, function(graph) {
      // Adapt the graph:
      arr = graph.nodes;
      for (i = 0, l = arr.length; i < l; i++) {
        obj = arr[i];

        obj.id = obj.id;
        obj.x = obj.viz.position.x;
        obj.y = obj.viz.position.y;
        obj.size = obj.viz.size;
        obj.color = obj.viz.color;
      }

      arr = graph.edges;
      for (i = 0, l = arr.length; i < l; i++) {
        obj = arr[i];

        obj.id = typeof obj.id === 'string' ? obj.id : edgeId();
        obj.size = obj.weight;
        obj.source = '' + obj.source;
        obj.target = '' + obj.target;
      }

      // Update the instance's graph:
      if (sig instanceof sigma) {
        sig.graph.clear();

        arr = graph.nodes;
        for (i = 0, l = arr.length; i < l; i++)
          sig.graph.addNode(arr[i]);

        arr = graph.edges;
        for (i = 0, l = arr.length; i < l; i++)
          sig.graph.addEdge(arr[i]);

      // ...or instanciate sigma if needed:
      } else if (typeof sig === 'object') {
        sig.graph = graph;
        sig = new sigma(sig);

      // ...or it's finally the callback:
      } else if (typeof sig === 'function') {
        sig = null;
        callback = sig;
      }

      // Call the callback if specified:
      if (callback)
        callback(sig || graph);
    });
  };
}).call(this);
