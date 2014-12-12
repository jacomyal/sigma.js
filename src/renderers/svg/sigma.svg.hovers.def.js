;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.svg.hovers');

  /**
   * The default hover renderer.
   */
  sigma.svg.hovers.def = {

    /**
     * SVG Element creation.
     *
     * @param  {object}           node               The node object.
     * @param  {CanvasElement}    measurementCanvas  A fake canvas handled by
     *                            the svg to perform some measurements and
     *                            passed by the renderer.
     * @param  {DOMElement}       nodeCircle         The node DOM Element.
     * @param  {configurable}     settings           The settings function.
     */
    create: function(node, nodeCircle, measurementCanvas, settings) {

      // Defining visual properties
      var x,
          y,
          w,
          h,
          e,
          d,
          alignment,
          labelWidth,
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

      if (node.label && typeof node.label === 'string') {
        if (settings('labelAlignment') === undefined) {
          alignment = settings('defaultLabelAlignment');
        } else {
          alignment = settings('labelAlignment');
        }

        // Measures
        // OPTIMIZE: Find a better way than a measurement canvas
        x = Math.round(node[prefix + 'x']);
        y = Math.round(node[prefix + 'y']);
        labelWidth = measurementCanvas.measureText(node.label).width;
        w = Math.round(
          labelWidth + size + 1.5 + fontSize / 3
        );
        h = Math.round(fontSize + 4);
        e = size + fontSize / 3;

        // update x and y positions of rectangle and label
        switch (alignment) {
          case 'center':
            text.setAttributeNS(null, 'x', x - labelWidth / 2);
            text.setAttributeNS(null, 'y', y + fontSize / 3);
            break;
          case 'left':
            text.setAttributeNS(null, 'x', x - size - 3 - labelWidth);
            text.setAttributeNS(null, 'y', y + fontSize / 3);
            rectangle.setAttributeNS(null, 'x', x - w);
            rectangle.setAttributeNS(null, 'y', y - fontSize / 2 - 2);
            break;
          case 'top':
            text.setAttributeNS(null, 'x', x - labelWidth / 2);
            text.setAttributeNS(null, 'y', y - size - 2 * fontSize / 3);
            rectangle.setAttributeNS(null, 'x', x - w / 2);
            rectangle.setAttributeNS(null, 'y', y - e);
            break;
          case 'bottom':
            text.setAttributeNS(null, 'x', x - labelWidth / 2);
            text.setAttributeNS(null, 'y', y + size + 4 * fontSize / 3);
            rectangle.setAttributeNS(null, 'x', x - w / 2);
            rectangle.setAttributeNS(null, 'y', y + e);
            break;
          case 'inside':
            if (labelWidth <= e * 2) {
              text.setAttributeNS(null, 'x', x - labelWidth / 2);
              text.setAttributeNS(null, 'y', y + fontSize / 3);
              break;
            }
            /* falls through */
          case 'right':
            /* falls through */
          default:
            text.setAttributeNS(null, 'x', x + size + 3);
            text.setAttributeNS(null, 'y', y + fontSize / 3);
            rectangle.setAttributeNS(null, 'x', x);
            rectangle.setAttributeNS(null, 'y', y - fontSize / 2 - 2);
            break;
        }

        // Text
        text.innerHTML = node.label;
        text.textContent = node.label;
        text.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-label');
        text.setAttributeNS(null, 'font-size', fontSize);
        text.setAttributeNS(null, 'font-family', settings('font'));
        text.setAttributeNS(null, 'fill', fontColor);

        // Circle
        circle.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-area');
        circle.setAttributeNS(null, 'fill', '#f00');
        circle.setAttributeNS(null, 'cx', x);
        circle.setAttributeNS(null, 'cy', y);
        circle.setAttributeNS(null, 'r', e);

        // Rectangle
        if (alignment !== 'center' &&
            (alignment !== 'inside' || labelWidth > e * 2)) {
          rectangle.setAttributeNS(
            null,
            'class',
            settings('classPrefix') + '-hover-area');
          rectangle.setAttributeNS(null, 'fill', '#f00');
          rectangle.setAttributeNS(null, 'width', w);
          rectangle.setAttributeNS(null, 'height', h);
        } 
      }

      // Appending childs
      group.appendChild(circle);
      group.appendChild(rectangle);
      group.appendChild(nodeCircle);
      group.appendChild(text);

      return group;
    }
  };
}).call(this);
