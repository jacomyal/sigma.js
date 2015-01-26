;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.labels');

  /**
   * The default label renderer. It renders the label as a simple text.
   */
  sigma.svg.labels.def = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   node       The node object.
     * @param  {configurable}             settings   The settings function.
     */
    create: function(node, settings) {
      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          text = document.createElementNS(settings('xmlns'), 'text');

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

      var fontColor = (settings('labelColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelColor');

      text.setAttributeNS(null, 'data-label-target', node.id);
      text.setAttributeNS(null, 'class', settings('classPrefix') + '-label');
      text.setAttributeNS(null, 'font-size', fontSize);
      text.setAttributeNS(null, 'font-family', settings('font'));
      text.setAttributeNS(null, 'fill', fontColor);

      text.innerHTML = node.label;
      text.textContent = node.label;

      return text;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}             node                The node object.
     * @param  {DOMElement}         text                The label DOM element.
     * @param  {CanvasElement}      measurementCanvas   A fake canvas used by
     *                              svg renderer to perform some measurements
     *                              for the labels.
     * @param  {configurable}       settings            The settings function.
     */
    update: function(node, text, measurementCanvas, settings) {
      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          alignment,
          labelWidth,
          labelOffsetX,
          labelOffsetY,
          radius;

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

      measurementCanvas.font = (settings('fontStyle') ? settings('fontStyle') +
        ' ' : '') + fontSize + 'px ' + settings('font');

      labelWidth = measurementCanvas.measureText(node.label).width;

      // Case when we don't want to display the label
      if (!settings('forceLabels') && size < settings('labelThreshold'))
        return;

      if (typeof node.label !== 'string')
        return;

      if (settings('labelAlignment') === undefined) {
        alignment = settings('defaultLabelAlignment');
      } else {
        alignment = settings('labelAlignment');
      }

      radius = size + fontSize / 3;
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

      // Updating
      text.setAttributeNS(null, 'x',
        Math.round(node[prefix + 'x'] + labelOffsetX));
      text.setAttributeNS(null, 'y',
        Math.round(node[prefix + 'y'] + labelOffsetY));
      text.innerHTML = node.label;
      text.textContent = node.label;

      // Showing
      text.style.display = '';

      return this;
    }
  };
}).call(this);
