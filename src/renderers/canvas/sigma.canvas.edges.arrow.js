;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as arrows going from the source node
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.arrow = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        overlay = edge['overlay'] || size+2,
        percent = edge['percent'] || 0,
	partial = !!edge['partial'],
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 4.5, settings('minArrowSize')),
        d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
        aX = sX + (tX - sX) * (d - aSize - tSize) / d,
        aY = sY + (tY - sY) * (d - aSize - tSize) / d,
        vX = (tX - sX) * aSize / d,
        vY = (tY - sY) * aSize / d;

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

    var dx = (aX - sX) / 100;
    var dy = (aY - sY) / 100;

    context.strokeStyle = color;
    context.fillStyle = color;
    if (!partial) {
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(sX, sY);
	context.lineTo(aX,aY);
	context.stroke();

	context.beginPath();
	context.moveTo(aX + vX, aY + vY);
	context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
	context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
	context.lineTo(aX + vX, aY + vY);
	context.closePath();
	context.fill();
    }
    context.lineWidth = overlay;
    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(sX + (dx * percent), sY + (dy * percent));
    context.stroke();
    
    context.beginPath();
    context.moveTo(sX + (dx * percent) + vX, sY + (dy * percent) + vY);
    context.lineTo(sX + (dx * percent) + vY * 0.6, sY + (dy * percent) - vX * 0.6);
    context.lineTo(sX + (dx * percent) - vY * 0.6, sY + (dy * percent) + vX * 0.6);
    context.lineTo(sX + vX + (dx * percent), sY + vY + (dy * percent));
    context.closePath();
    context.fill();

  };
})();
