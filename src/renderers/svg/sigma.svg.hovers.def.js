;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.hovers');

  function arcTo(x1, y1, x2, y2, r) {
    return 'A' + x1 + ',' + x2 +
           ' ' + r + ' 0,0 ' +
           x2 + ',' + y2;
  }

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
            settings('labelSizeRatio') * size,
          fontColor = (settings('labelHoverColor') === 'node') ?
                        (node.color || settings('defaultNodeColor')) :
                        settings('defaultLabelHoverColor');

      // Creating elements
      var group = document.createElementNS(settings('xmlns'), 'g'),
          rectangle = document.createElementNS(settings('xmlns'), 'rect'),
          circle = document.createElementNS(settings('xmlns'), 'circle'),
          text = document.createElementNS(settings('xmlns'), 'text');

      // Defining properties
      group.setAttributeNS(null, 'class', settings('classPrefix') + '-hover');
      group.setAttributeNS(null, 'data-node-id', node.id);

      if (typeof node.label === 'string') {

        // Text
        text.innerHTML = node.label;
        text.setAttributeNS(null, 'font-size', fontSize);
        text.setAttributeNS(null, 'font-family', settings('font'));
        text.setAttributeNS(null, 'fill', fontColor);
        text.setAttributeNS(null, 'x',
          Math.round(node[prefix + 'x'] + size + 3));
        text.setAttributeNS(null, 'y',
          Math.round(node[prefix + 'y'] + fontSize / 3));

        // Measures
        // OPTIMIZE: The width of a SVG element is not computed before its
        // insertion into the dom. It would be nice to find a workaround.
        // Replace the hardcoded 54 below
        x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
        y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
        w = Math.round(
          54 + fontSize / 2 + size + 7
        );
        h = Math.round(fontSize + 4);
        e = Math.round(fontSize / 2 + 2);

        // Circle
        circle.setAttributeNS(null, 'fill', '#fff');
        circle.setAttributeNS(null, 'cx', node[prefix + 'x']);
        circle.setAttributeNS(null, 'cy', node[prefix + 'y']);
        circle.setAttributeNS(null, 'r', e);

        // Rectangle
        rectangle.setAttributeNS(null, 'fill', '#fff');
        rectangle.setAttributeNS(null, 'x', node[prefix + 'x'] + e / 4);
        rectangle.setAttributeNS(null, 'y', node[prefix + 'y'] - e);
        rectangle.setAttributeNS(null, 'width', w);
        rectangle.setAttributeNS(null, 'height', h);
      }

      // Appending childs
      group.appendChild(circle);
      group.appendChild(rectangle);
      group.appendChild(text);

      return group;
    }
  };
}).call(this);
