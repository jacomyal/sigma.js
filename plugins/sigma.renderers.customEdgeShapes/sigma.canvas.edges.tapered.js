;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This method renders the edge as a tapered line.
   * Danny Holten, Petra Isenberg, Jean-Daniel Fekete, and J. Van Wijk (2010)
   * Performance Evaluation of Tapered, Curved, and Animated Directed-Edge
   * Representations in Node-Link Graphs. Research Report, Sep 2010.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.tapered = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
        prefix = settings('prefix') || '',
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'];

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    // The goal is to draw a triangle where the target node is a point of 
    // the triangle, and the two other points are the intersection of the
    // source circle and the circle (target, distance(source, target)).
    var r_s = edge[prefix + 'size'],
        r_t = sigma.utils.getDistance(sX, sY, tX, tY);

    // Intersection points:
    var c = sigma.utils.getCircleIntersection(sX, sY, r_s, tX, tY, r_t);

    context.save();

    // Turn transparency on:
    context.globalAlpha = 0.65;

    // Draw the triangle:
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(tX, tY);
    context.lineTo(c.xi, c.yi);
    context.lineTo(c.xi_prime, c.yi_prime);
    context.fill();

    context.restore();

    /*if (settings('drawEdgeLabels'))
      sigma.canvas.labels.edges.def(
        edge,
        source,
        target,
        context,
        settings
    );*/
  };
})();
