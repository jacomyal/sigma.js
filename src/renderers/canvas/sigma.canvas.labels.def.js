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
        labelWidth = 0,
        labelPlacementX,
        labelPlacementY,
        alignment;

    if (size < settings('labelThreshold'))
      return;

    if (typeof node.label !== 'string')
      return;

    if (settings('labelAlignment') === undefined) {
      alignment = settings('defaultLabelAlignment');
    } else {
      alignment = settings('labelAlignment');
    }

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    labelWidth = context.measureText(node.label).width;
    labelPlacementX = Math.round(node[prefix + 'x'] + size + 3);
    labelPlacementY = Math.round(node[prefix + 'y'] + fontSize / 3);

    switch (alignment) {
      case 'inside':
        if (labelWidth >= (size + fontSize / 3) * 2) {
          labelPlacementX = Math.round(node[prefix + 'x'] + size + 3);
          break;
        }
      /* falls through*/
      case 'center':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2);
        break;
      case 'left':
        labelPlacementX =
            Math.round(node[prefix + 'x'] - size - labelWidth - 3);
        break;
      case 'right':
        labelPlacementX = Math.round(node[prefix + 'x'] + size + 3);
        break;
      case 'top':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2);
        labelPlacementY = labelPlacementY - size - fontSize;
        break;
      case 'bottom':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2);
        labelPlacementY = labelPlacementY + size + fontSize;
        break;
      default:
        // Default is aligned 'right'
        labelPlacementX = Math.round(node[prefix + 'x'] + size + 3);
        break;
    }

    context.fillText(
      node.label,
      labelPlacementX,
      labelPlacementY
    );
  };
}).call(this);
