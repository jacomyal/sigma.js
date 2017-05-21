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
  sigma.canvas.edgehovers.def = function(edge, source, target, context, settings) {
      var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        overlay = edge['overlay'] || size+2,
        percent = edge['percent'] || 0,
	partial = !!edge['partial'],
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor');

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

    var dx = (target[prefix + 'x'] - source[prefix + 'x']) / 100;
    var dy = (target[prefix + 'y'] - source[prefix + 'y']) / 100;

    context.strokeStyle = color;
    if (!partial) {
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(
	  source[prefix + 'x'],
	  source[prefix + 'y']
	);
	context.lineTo(
	  target[prefix + 'x'],
	  target[prefix + 'y']
	);
	context.stroke();
    }
    context.lineWidth = overlay;
    context.beginPath();
    context.moveTo(
      source[prefix + 'x'],
      source[prefix + 'y']
    );
    context.lineTo(
      source[prefix + 'x'] + (dx * percent),
      source[prefix + 'y'] + (dy * percent)
    );
    context.stroke();
  };
})();
