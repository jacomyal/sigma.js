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
     * @param  {CanvasElement}      measurementCanvas   A fake canva handled by
     *                              the svg to perform some measurements and
     *                              passed by the renderer.
     * @param  {configurable}       settings            The settings function.
     */
    update: function(node, text, measurementCanvas, settings) {
      var prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          alignment,
          labelWidth = 0,
          labelPlacementX,
          labelPlacementY;

      var fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

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

      labelWidth = measurementCanvas.measureText(node.label).width;
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

      // Updating
      text.setAttributeNS(null, 'x', labelPlacementX);
      text.setAttributeNS(null, 'y', labelPlacementY);
      text.innerHTML = node.label;
      text.textContent = node.label;

      // Showing
      text.style.display = '';

      return this;
    }
  };
}).call(this);
