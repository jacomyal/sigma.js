;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edgehovers');

  /**
   * This hover renderer will display the edge with a different color or size.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edgehovers.curvedArrow =
    function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        cp = {},
        size = settings('edgeHoverSizeRatio') * (edge[prefix + 'size'] || 1),
        count = edge.count || 0,
        overlay = edge['overlay'] || size+2,
        percent = edge['percent'] || 0,
	partial = !!edge['partial'],
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        d,
        aSize,
        aX,
        aY,
        vX,
        vY;

    cp = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(sX, sY, tSize, count) :
      sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY, count);

    if (source.id === target.id) {
      d = Math.sqrt(Math.pow(tX - cp.x1, 2) + Math.pow(tY - cp.y1, 2));
      aSize = size * 2.5;
      aX = cp.x1 + (tX - cp.x1) * (d - aSize - tSize) / d;
      aY = cp.y1 + (tY - cp.y1) * (d - aSize - tSize) / d;
      vX = (tX - cp.x1) * aSize / d;
      vY = (tY - cp.y1) * aSize / d;
    }
    else {
      d = Math.sqrt(Math.pow(tX - cp.x, 2) + Math.pow(tY - cp.y, 2));
      aSize = size * 2.5;
      aX = cp.x + (tX - cp.x) * (d - aSize - tSize) / d;
      aY = cp.y + (tY - cp.y) * (d - aSize - tSize) / d;
      vX = (tX - cp.x) * aSize / d;
      vY = (tY - cp.y) * aSize / d;
    }

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

    if (settings('edgeHoverColor') === 'edge') {
      color = edge.hover_color || color;
    } else {
      color = edge.hover_color || settings('defaultEdgeHoverColor') || color;
    }

    size = (edge.hover) ? settings('edgeHoverSizeRatio') * size : size;
    overlay = (edge.hover) ? settings('edgeHoverSizeRatio') * overlay : overlay;

    function drawQuadratic() {
	var p;
	for (var i = 0;i<percent; i++) {
		p = sigma.utils.getPointOnQuadraticCurve(i/100, sX, sY, tX, tY, cp.x, cp.y);
		context.lineTo(p.x, p.y);
	}
	return p;
    }

    function drawBezier() {
	var p;
	for (var i = 0; i<percent; i++) {
		p = sigma.utils.getPointOnBezierCurve(i/100, sX, sY, tX, tY, cp.x1, cp.y1, cp.x2, cp.y2);
		context.lineTo(p.x, p.y);
	}
	return p;
    }

    var pt;

    context.strokeStyle = color;
    context.lineWidth = size;

    context.fillStyle = color;
    if (!partial) {
	context.beginPath();
	context.moveTo(aX + vX, aY + vY);
	context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
	context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
	context.lineTo(aX + vX, aY + vY);
	context.closePath();
	context.fill();
    }

    context.beginPath();
    context.moveTo(sX, sY);
    if (source.id === target.id) {
      if (!partial) {
	context.bezierCurveTo(cp.x1, cp.y1, cp.x2, cp.y2, tX, tY);
	context.stroke();
      }
      context.lineWidth = overlay;
      context.beginPath();
      context.moveTo(sX, sY);
      pt = drawBezier();
//      d = Math.sqrt(Math.pow(pt.x - cp.x1, 2) + Math.pow(pt.y - cp.y1, 2));
//      aX = cp.x1 + (pt.x - cp.x1) * (d - aSize - tSize) / d;
//      aY = cp.y1 + (pt.y - cp.y1) * (d - aSize - tSize) / d;
//      vX = (pt.x - cp.x1) * aSize / d;
//      vY = (pt.y - cp.y1) * aSize / d;
    } else {
      if (!partial) {
	context.quadraticCurveTo(cp.x, cp.y, tX, tY);
	context.stroke();
      }
      context.lineWidth = overlay;
      context.beginPath();
      context.moveTo(sX, sY);
      pt = drawQuadratic();
//      d = Math.sqrt(Math.pow(pt.x - cp.x, 2) + Math.pow(pt.y - cp.y, 2));
//      aX = cp.x + (pt.x - cp.x) * (d - aSize - tSize) / d;
//      aY = cp.y + (pt.y - cp.y) * (d - aSize - tSize) / d;
//      vX = (pt.x - cp.x) * aSize / d;
//      vY = (pt.y - cp.y) * aSize / d;
    }
    context.stroke();

//----------------TODO---------------------
//--------Draw the arrow head--------------
//    context.fillStyle = color;
//    context.beginPath();
//    context.moveTo(pt.x, pt.y);
//    context.lineTo(pt.x - vY * 0.6, pt.y + vX * 0.6);
//    context.lineTo(pt.x + vY * 0.6, pt.y - vX * 0.6);
//    context.lineTo(pt.x + vX, pt.y + vY);
//    context.closePath();
//    context.fill();
  };})();
