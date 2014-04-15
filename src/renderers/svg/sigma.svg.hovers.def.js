;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.hovers');

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The SVG context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.svg.hovers.def = {
    create: function(node, settings) {

      // Defining visual properties
      var x,
          y,
          w,
          h,
          e,
          d,
          fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          fontSize = (settings('labelSize') === 'fixed') ?
            settings('defaultLabelSize') :
            settings('labelSizeRatio') * size;

      // Creating elements
      var group = document.createElementNS(settings('xmlns'), 'g'),
          text = document.createElementNS(settings('xmlns'), 'text'),
          rectangle = document.createElementNS(settings('xmlns'), 'path');

      // Defining properties
      if (typeof node.label === 'string') {

        // Label
        text.innerHTML = node.label;

        // Measures
        x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
        y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
        w = Math.round(
          text.getBBox().width + fontSize / 2 + size + 7
        );
        h = Math.round(fontSize + 4);
        e = Math.round(fontSize / 2 + 2);

        // Rectangle
        d = 'M' + x + ',' + (y + e) +
            // ' A' + x + ',' + y + ' ' + (x + e) + ' ' + y + ' ' + e +
            ' L' + (x + w) + ',' + y +
            ' L' + (x + w) + ',' + (y + h) +
            ' L' + (x + e) + ',' + (y + h) +
          // ' A' + x + ',' + (y + h) + ' ' + x + ' ' + (y + h - e) + ' ' + e +
            ' L' + x + ',' + (y + e);

        rectangle.setAttributeNS(null, 'd', d);
        rectangle.setAttributeNS(null, 'fill', '#fff');
      }

      // Appending childs
      group.appendChild(rectangle);
      group.appendChild(text);

      return group;
    }
  };
}).call(this);
