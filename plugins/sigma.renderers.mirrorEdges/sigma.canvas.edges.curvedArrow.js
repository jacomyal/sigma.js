;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as curves with arrow heading.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.curvedArrow =
    function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
	mirror = !!edge['mirror'],
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        cp = {},
        tSize = target[prefix + 'size'],
	sSize = source[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 4.5, settings('minArrowSize')),
        d, aX, aY, vX, vY;

    cp = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(sX, sY, tSize) :
      sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY);

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
	context.fillStyle = color;
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(sX, sY);
	if (source.id === target.id)
		context.bezierCurveTo(cp.x1, cp.y1, cp.x2, cp.y2, tX, tY);
	else
		context.quadraticCurveTo(cp.x, cp.y, tX, tY);
	context.stroke();
	context.beginPath();
	if (mirror)
		if (source.id === target.id) {
			d = Math.sqrt(Math.pow(sX - cp.x1, 2) + Math.pow(sY - cp.y1, 2));
			aX = sX - (sX - cp.x1) * sSize / d;
			aY = sY - (sY - cp.y1) * sSize / d;
			vX = (sX - cp.x1) * aSize / d;
			vY = (sY - cp.y1) * aSize / d;
			context.moveTo(aX, aY);
			context.lineTo(aX - vX + vY * 0.8, aY - vY - vX * 0.3);
			context.lineTo(aX - vX - vY * 0.3, aY - vY + vX * 0.8);
			context.lineTo(aX, aY);
		} else {
			d = Math.sqrt(Math.pow(sX - cp.x, 2) + Math.pow(sY - cp.y, 2));
			aX = sX - (sX - cp.x) * sSize / d;
			aY = sY - (sY - cp.y) * sSize / d;
			vX = (sX - cp.x) * aSize / d;
			vY = (sY - cp.y) * aSize / d;
			context.moveTo(aX, aY);
			context.lineTo(aX - vX + vY * 0.6, aY - vY - vX * 0.6);
			context.lineTo(aX - vX - vY * 0.6, aY - vY + vX * 0.6);
			context.lineTo(aX, aY);
		}
	else
		if (source.id === target.id) {
			d = Math.sqrt(Math.pow(tX - cp.x2, 2) + Math.pow(tY - cp.y2, 2));
			aX = cp.x2 + (tX - cp.x2) * (d - aSize - tSize) / d;
			aY = cp.y2 + (tY - cp.y2) * (d - aSize - tSize) / d;
			vX = (tX - cp.x2) * aSize / d;
			vY = (tY - cp.y2) * aSize / d;
			context.moveTo(aX + vX, aY + vY);
			context.lineTo(aX + vY * 0.8, aY - vX * 0.3);
			context.lineTo(aX - vY * 0.3, aY + vX * 0.8);
			context.lineTo(aX + vX, aY + vY);
		} else {
			d = Math.sqrt(Math.pow(tX - cp.x, 2) + Math.pow(tY - cp.y, 2));
			aX = cp.x + (tX - cp.x) * (d - aSize - tSize) / d;
			aY = cp.y + (tY - cp.y) * (d - aSize - tSize) / d;
			vX = (tX - cp.x) * aSize / d;
			vY = (tY - cp.y) * aSize / d;
			context.moveTo(aX + vX, aY + vY);
			context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
			context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
			context.lineTo(aX + vX, aY + vY);
		}
	context.closePath();
	context.fill();
  };
})();
