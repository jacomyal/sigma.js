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
        thickness = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        controlX = (source[prefix + 'x'] + target[prefix + 'x']) / 2 +
                   (target[prefix + 'y'] - source[prefix + 'y']) / 4,
        controlY = (source[prefix + 'y'] + target[prefix + 'y']) / 2 +
                   (source[prefix + 'x'] - target[prefix + 'x']) / 4,
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = thickness * 2.5,
        d = Math.sqrt(Math.pow(tX - controlX, 2) + Math.pow(tY - controlY, 2)),
        aX = controlX + (tX - controlX) * (d - aSize - tSize) / d,
        aY = controlY + (tY - controlY) * (d - aSize - tSize) / d,
        vX = (tX - controlX) * aSize / d,
        vY = (tY - controlY) * aSize / d;

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

    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.beginPath();
    context.moveTo(sX, sY);
    context.quadraticCurveTo(controlX, controlY, aX, aY);
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
