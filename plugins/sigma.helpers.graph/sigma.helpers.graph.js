;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * This methods drops a set of nodes from the graph.
   *
   * @param  {string|array} v One id, or an array of ids.
   * @return {sigma.graph}    The instance itself.
   */
  if (!sigma.classes.graph.hasMethod('dropNodes'))
    sigma.classes.graph.addMethod('dropNodes', function(v) {
      if (arguments.length === 1 && typeof v === 'string')
        this.dropNode(v);

      else if (
        arguments.length === 1 &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var i, l;
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.dropNode(v[i]);
          else
            throw 'dropNodes: Wrong arguments.';
      }
      else
        throw 'dropNodes: Wrong arguments.';
      
      return this;
    });

  /**
   * This methods drops a set of edges from the graph.
   *
   * @param  {string|array} v One id, or an array of ids.
   * @return {sigma.graph}    The instance itself.
   */
  if (!sigma.classes.graph.hasMethod('dropEdges'))
    sigma.classes.graph.addMethod('dropEdges', function(v) {
      if (arguments.length === 1 && typeof v === 'string')
        this.dropEdge(v);
      
      else if (
        arguments.length === 1 &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var i, l;
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.dropEdge(v[i]);
          else
            throw 'dropEdges: Wrong arguments.';
      }
      else
        throw 'dropEdges: Wrong arguments.';
      
      return this;
    });

  /**
   * This methods returns an array of nodes that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent nodes.
   */
  if (!sigma.classes.graph.hasMethod('adjacentNodes'))
    sigma.classes.graph.addMethod('adjacentNodes', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentNodes: the node id must be a string.';

      var target,
          nodes = [];
      for(target in this.allNeighborsIndex[id]) {
        nodes.push(this.nodesIndex[target]);
      }
      return nodes;
    });

  /**
   * This methods returns an array of edges that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent edges.
   */
  if (!sigma.classes.graph.hasMethod('adjacentEdges'))
    sigma.classes.graph.addMethod('adjacentEdges', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentEdges: the node id must be a string.';

      var a = this.allNeighborsIndex[id],
          eid,
          target,
          edges = [];
      for(target in a) {
        for(eid in a[target]) {
          edges.push(a[target][eid]);
        }
      }
      return edges;
    });

}).call(this);
