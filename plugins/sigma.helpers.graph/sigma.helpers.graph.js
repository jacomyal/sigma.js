;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  var _fixedNodesIndex = Object.create(null);

  /**
   * Sigma Graph Helpers
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1
   */

  /**
   * Attach methods to the graph to keep indexes updated.
   * ------------------
   */

  // Index the node after its insertion in the graph if `n.fixed` is `true`.
  sigma.classes.graph.attach(
    'addNode',
    'sigma.helpers.graph.addNode',
    function(n) {
      if (n.fixed) {
        _fixedNodesIndex[n.id] = this.nodesIndex[n.id];
      }
    }
  );

  // Deindex the node before its deletion from the graph.
  sigma.classes.graph.attachBefore(
    'dropNode',
    'sigma.helpers.graph.dropNode',
    function(id) {
      delete _fixedNodesIndex[id];
    }
  );

  // Deindex all nodes before the graph is cleared.
  sigma.classes.graph.attachBefore(
    'clear',
    'sigma.helpers.graph.clear',
    function() {
      var k;

      for (k in _fixedNodesIndex)
        if (!('hasOwnProperty' in _fixedNodesIndex) || _fixedNodesIndex.hasOwnProperty(k))
          delete _fixedNodesIndex[k];

      _fixedNodesIndex = Object.create(null);
    }
  );

  /**
   * This methods will set the value of `fixed` to `true` on a specified node.
   *
   * @param {string}     The node id.
   */
  if (!sigma.classes.graph.hasMethod('fixNode'))
    sigma.classes.graph.addMethod('fixNode', function(id) {
      if (this.nodesIndex[id]) {
        this.nodesIndex[id].fixed = true;
        _fixedNodesIndex[id] = this.nodesIndex[id];
      }
      return this;
    });

  /**
   * This methods will set the value of `fixed` to `false` on a specified node.
   *
   * @param {string}     The node id.
   */
  if (!sigma.classes.graph.hasMethod('unfixNode'))
    sigma.classes.graph.addMethod('unfixNode', function(id) {
      if (this.nodesIndex[id]) {
        delete this.nodesIndex[id].fixed;
        delete _fixedNodesIndex[id];
      }
      return this;
    });

  /**
   * This methods returns the list of fixed nodes.
   *
   * @return {array}     The array of fixed nodes.
   */
  if (!sigma.classes.graph.hasMethod('getFixedNodes'))
    sigma.classes.graph.addMethod('getFixedNodes', function() {
      var nid,
          nodes = [];
      for(nid in _fixedNodesIndex) {
        nodes.push(this.nodesIndex[nid]);
      }
      return nodes;
    });


  /**
   * This methods drops a set of nodes from the graph.
   *
   * @param  {string|array} v One id, or an array of ids.
   * @return {sigma.graph}    The instance itself.
   */
  if (!sigma.classes.graph.hasMethod('dropNodes'))
    sigma.classes.graph.addMethod('dropNodes', function(v) {
      if (arguments.length === 1 && (typeof v === 'string' || typeof v === 'number'))
        this.dropNode(v);

      else if (
        arguments.length === 1 &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var i, l;
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number')
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
      if (arguments.length === 1 && (typeof v === 'string' || typeof v === 'number'))
        this.dropEdge(v);

      else if (
        arguments.length === 1 &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var i, l;
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number')
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
   * @param  {number|string} id The node id.
   * @return {array}     The array of adjacent nodes.
   */
  if (!sigma.classes.graph.hasMethod('adjacentNodes'))
    sigma.classes.graph.addMethod('adjacentNodes', function(id) {
      if (typeof id !== 'string' && typeof id !== 'number')
        throw 'adjacentNodes: the node id must be a string or a number.';

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
   * @param  {number|string} id The node id.
   * @return {array}     The array of adjacent edges.
   */
  if (!sigma.classes.graph.hasMethod('adjacentEdges'))
    sigma.classes.graph.addMethod('adjacentEdges', function(id) {
      if (typeof id !== 'string' && typeof id !== 'number')
        throw 'adjacentEdges: the node id must be a string or a number.';

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
