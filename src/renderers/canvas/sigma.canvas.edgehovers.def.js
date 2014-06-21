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
        size = edge[prefix + 'size'],
        edgeHoverHighlightNodes = settings('edgeHoverHighlightNodes');

    // Edge:
    var edgeRenderer = sigma.canvas.edges[edge.type] || sigma.canvas.edges.def;
    edgeRenderer(edge, source, target, context, settings);

    // Source Node:
    var nodeRenderer = sigma.canvas.nodes[source.type] || sigma.canvas.nodes.def;
    nodeRenderer(source, context, settings);

    // Target Node:
    nodeRenderer = sigma.canvas.nodes[target.type] || sigma.canvas.nodes.def;
    nodeRenderer(target, context, settings);

    // Circle around the node:
    function drawCircle(node) {
      context.beginPath();
      context.lineWidth = 0.5;
      context.fillStyle = node.color;
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'] * 1.618,
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.stroke();
    }

    if (edgeHoverHighlightNodes == 'circle') {
      drawCircle(source);
      drawCircle(target);
    }
  };
}).call(this);
