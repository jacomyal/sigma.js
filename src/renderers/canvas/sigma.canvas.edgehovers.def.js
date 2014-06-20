;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.edgehovers');

  /**
   * This hover renderer will display the edge with a modified color or size.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edgehovers.def = function(edge, source, target, context, settings) {
    var x,
        y,
        w,
        h,
        e,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'];

    // Edge:
    var edgeRenderer = sigma.canvas.edges[edge.type] || sigma.canvas.edges.def;
    edgeRenderer(edge, source, target, context, settings);

    // Source Node:
    var nodeRenderer = sigma.canvas.nodes[source.type] || sigma.canvas.nodes.def;
    nodeRenderer(source, context, settings);

    // Target Node:
    var nodeRenderer = sigma.canvas.nodes[target.type] || sigma.canvas.nodes.def;
    nodeRenderer(target, context, settings);

  };
}).call(this);
