;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  var drawIcon = function (node, x, y, size, context, threshold) {
    if(!node.icon || size < threshold) return;

    var font = node.icon.font || 'Arial',
        fgColor = node.icon.color || '#F00',
        text = node.icon.content || '?',
        px = node.icon.x || 0.5,
        py = node.icon.y || 0.5,
        height = size,
        width = size;

    var fontSizeRatio = 0.70;
    if (typeof node.icon.scale === "number") {
      fontSizeRatio = Math.abs(Math.max(0.01, node.icon.scale));
    }

    var fontSize = Math.round(fontSizeRatio * height);

    context.save();
    context.fillStyle = fgColor;

    context.font = '' + fontSize + 'px ' + font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, x, y);
    context.restore();
  };

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   * @param  {?object}                  options  Force optional parameters (e.g. color).
   */
  sigma.canvas.nodes.def = function(node, context, settings, options) {
    var o = options || {},
        prefix = settings('prefix') || '',
        x = node[prefix + 'x'],
        y = node[prefix + 'y'],
        size = node[prefix + 'size'] || 1;

    context.fillStyle = node.color || settings('defaultNodeColor');
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    if (node.icon) {
      drawIcon(node, x, y, size, context, settings('iconThreshold'));
    }

  };
})();
