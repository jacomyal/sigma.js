;(function() {
  'use strict';

  var edgesPackage = sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as curves with arrow heading.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  edgesPackage.curvedArrow = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        cp = {},
        thickness = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'];

    thickness = (edge.hover) ?
      settings('edgeHoverSizeRatio') * thickness : thickness;

    if (source.id === target.id) {
      cp.x = sX - tSize * 7;
      cp.y = sY;
      cp.x2 = sX;
      cp.y2 = sY + tSize * 7;
    } else {
      cp = sigma.utils.getCP(source, target, prefix);
    }

    var d = Math.sqrt(Math.pow(tX - cp.x, 2) + Math.pow(tY - cp.y, 2)),
        aSize = thickness * 2.5,
        aX = cp.x + (tX - cp.x) * (d - aSize - tSize) / d,
        aY = cp.y + (tY - cp.y) * (d - aSize - tSize) / d,
        vX = (tX - cp.x) * aSize / d,
        vY = (tY - cp.y) * aSize / d;

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

    if (edge.hover) {
      if (settings('edgeHoverColor') === 'edge') {
        color = edge.hover_color || color;
      } else {
        color = edge.hover_color || settings('defaultEdgeHoverColor') || color;
      }
    }

    context.strokeStyle = color;
    context.lineWidth = edge[prefix + 'size'] || 1;
    context.beginPath();
    context.moveTo(sX, sY);
    if (source.id === target.id) {
      context.bezierCurveTo(cp.x2, cp.y2, cp.x, cp.y, aX, aY);
    } else {
      context.quadraticCurveTo(cp.x, cp.y, aX, aY);
    }
    context.stroke();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(aX + vX, aY + vY);
    context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
    context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
    context.lineTo(aX + vX, aY + vY);
    context.closePath();
    context.fill();
  };
})();
