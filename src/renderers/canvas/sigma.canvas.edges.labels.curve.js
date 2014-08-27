;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.edges.labels');

  /**
   * This label renderer will just display the label on the curve of the edge.
   * The label is rendered at half distance of the edge extremities, and is
   * always oriented from left to right on the top side of the curve.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.labels.curve =
    function(edge, source, target, context, settings) {
    if (typeof edge.label !== 'string')
      return;

    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1;

    if (size < settings('edgeLabelThreshold'))
      return;

    var fontSize,
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        dX = tX - sX,
        dY = tY - sY,
        sign = (sX < tX) ? 1 : -1,
        cp,
        c,
        angle,
        t = 0.5;  //length of the curve

    // The font size is sublineraly proportional to the edge size, in order to
    // avoid very large labels on screen.
    // This is achieved by f(x) = x * x^(-a), where 'x' is the size and 'a' is
    // the edgeLabelSizePowRatio.
    // We garantee that for size = 1, fontSize = defaultEdgeLabelSize by adding
    // this number as a multiplicator, thus the final form:
    // f(x) = b * x * x^(-a)
    fontSize = (settings('edgeLabelSize') === 'fixed') ?
      settings('defaultEdgeLabelSize') :
      settings('defaultEdgeLabelSize') *
      size *
      Math.pow(size, - settings('edgeLabelSizePowRatio'));

    context.save();

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('edgeLabelColor') === 'edge') ?
      (edge.color || settings('defaultEdgeColor')) :
      settings('defaultEdgeLabelColor');

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';

    if (source.id === target.id) {
      cp = sigma.utils.getSelfLoopControlPoints(
        sX, sY, source[prefix + 'size']
      );
      c = sigma.utils.getPointOnBezierCurve(
        t, sX, sY, tX, tY, cp.x1, cp.y1, cp.x2, cp.y2
      );
      angle = Math.atan2(1, 1); // 45°
    } else {
      cp = sigma.utils.getCP(source, target, prefix);
      c = sigma.utils.getPointOnQuadraticCurve(t, sX, sY, tX, tY, cp.x, cp.y);
      angle = Math.atan2(dY * sign, dX * sign);
    }

    context.translate(c.x, c.y);
    context.rotate(angle);
    context.fillText(
      edge.label,
      0,
      (-size / 2) - 3
    );

    context.restore();
  };
}).call(this);
