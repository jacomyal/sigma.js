;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * This methods set the "hover" attribute of a node.
   *
   * To hover the node, call "hoverNode(id)". To un-hover the node,
   * call "hoverNode(id, false)".
   *
   * @param  {string}   id      The node id.
   * @param  {?boolean} isHover The hover value.
   */
  if (!sigma.classes.graph.hasMethod('hoverNode'))
    sigma.classes.graph.addMethod('hoverNode', function(id, isHover) {
      isHover = (isHover === undefined) ? true : !!isHover;
      this.nodesIndex[id].hover = isHover;
      return this;
    });

  /**
   * This methods set the "hover" attribute of an edge.
   *
   * To hover the edge, call "hoverEdge(id)". To un-hover the edge,
   * call "hoverEdge(id, false)".
   *
   * @param  {string}   id      The edge id.
   * @param  {?boolean} isHover The hover value.
   */
  if (!sigma.classes.graph.hasMethod('hoverEdge'))
    sigma.classes.graph.addMethod('hoverEdge', function(id, isHover) {
      isHover = (isHover === undefined) ? true : !!isHover;
      this.edgesIndex[id].hover = isHover;
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
