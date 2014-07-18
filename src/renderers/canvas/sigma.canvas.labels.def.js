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
        fontStyle = node.active ? 
          settings('activeFontStyle') : settings('fontStyle');

    if (size < settings('labelThreshold'))
      return;

    if (typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (fontStyle ? fontStyle + ' ' : '') +
      fontSize + 'px ' +
      (node.active ?
        settings('activeFont') || settings('font') :
        settings('font'));

    if (node.active)
      context.fillStyle =
        (settings('labelActiveColor') === 'node') ?
        node.active_color || settings('defaultNodeActiveColor') :
        settings('defaultLabelActiveColor');
    else
      context.fillStyle = 
        (settings('labelColor') === 'node') ?
        node.color || settings('defaultNodeColor') :
        settings('defaultLabelColor');

    context.fillText(
      node.label,
      Math.round(node[prefix + 'x'] + 
        size + 
        (node.active ? settings('borderSize') + settings('outerBorderSize') : 0) +
        3),
      Math.round(node[prefix + 'y'] + fontSize / 3)
    );
  };
}).call(this);
