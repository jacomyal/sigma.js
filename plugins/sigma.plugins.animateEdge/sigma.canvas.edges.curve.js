;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as curves.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.curve = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        overlay = edge['overlay'] || size+2,
	percent = edge['percent'] || 0,
	partial = !!edge['partial'],
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        cp = {},
        sSize = source[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'];

    cp = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(sX, sY, sSize) :
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

    function drawQuadratic() {
	for (var i = 0;i<percent; i++) {
		var p = sigma.utils.getPointOnQuadraticCurve(i/100, sX, sY, tX, tY, cp.x, cp.y);
		context.lineTo(p.x, p.y);
	}
    }

    function drawBezier() {
	for (var i = 0; i<percent; i++) {
		var p = sigma.utils.getPointOnBezierCurve(i/100, sX, sY, tX, tY, cp.x1, cp.y1, cp.x2, cp.y2);
		context.lineTo(p.x, p.y);
	}
    }

    context.strokeStyle = color;
    context.lineWidth = size;
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
      drawBezier();
    } else {
      if (!partial) {
	context.quadraticCurveTo(cp.x, cp.y, tX, tY);
	context.stroke();
      }
      context.lineWidth = overlay;
      context.beginPath();
      context.moveTo(sX, sY);
      drawQuadratic();
    }
    context.stroke();
  };
})();
