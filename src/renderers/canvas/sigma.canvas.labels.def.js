;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  /**
   * This label renderer will just display the label on the right of the node.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        labelWidth,
        labelOffsetX,
        labelOffsetY,
        alignment = settings('labelAlignment');

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    labelWidth = context.measureText(node.label).width;
    labelOffsetX = - labelWidth / 2;
    labelOffsetY = fontSize / 3;

    switch (alignment) {
      case 'bottom':
        labelOffsetY = + size + 4 * fontSize / 3;
        break;
      case 'center':
        break;
      case 'left':
        labelOffsetX = - size - 3 - labelWidth;
        break;
      case 'top':
        labelOffsetY = - size - 2 * fontSize / 3;
        break;
      case 'inside':
        if (labelWidth <= (size + fontSize / 3) * 2) {
          break;
        }
      /* falls through*/
      case 'right':
      /* falls through*/
      default:
        labelOffsetX = size + 3;
        break;
    }

    context.fillText(
      node.label,
      Math.round(node[prefix + 'x'] + labelOffsetX),
      Math.round(node[prefix + 'y'] + labelOffsetY)
    );
  };
}).call(this);
