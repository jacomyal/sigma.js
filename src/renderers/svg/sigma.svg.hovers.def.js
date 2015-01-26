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
      var labelWidth,
          fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          fontSize = (settings('labelSize') === 'fixed') ?
            settings('defaultLabelSize') :
            settings('labelSizeRatio') * size;

       // set context font and font size
      measurementCanvas.font = (fontStyle ? fontStyle + ' ' : '') +
        fontSize + 'px ' + (settings('hoverFont') || settings('font'));

      labelWidth = measurementCanvas.measureText(node.label).width;

      // Creating elements
      var group = document.createElementNS(settings('xmlns'), 'g'),
          circle = document.createElementNS(settings('xmlns'), 'circle');

      // Defining properties
      group.setAttributeNS(null, 'class', settings('classPrefix') + '-hover');
      group.setAttributeNS(null, 'data-node-id', node.id);

      // drawing hover circle
      circle.setAttributeNS(
        null,
        'class',
        settings('classPrefix') + '-hover-area');
      circle.setAttributeNS(null, 'fill', '#fff');
      circle.setAttributeNS(null, 'stroke', '#000');
      circle.setAttributeNS(null, 'stroke-opacity', '0.3');
      circle.setAttributeNS(null, 'stroke-width', 2);
      circle.setAttributeNS(null, 'cx', Math.round(node[prefix + 'x']));
      circle.setAttributeNS(null, 'cy', Math.round(node[prefix + 'y']));
      circle.setAttributeNS(null, 'r', Math.round(size + fontSize / 3));

      group.appendChild(circle);

      if (node.label && typeof node.label === 'string') {
        drawHoverBorderAndLabel(
          fontSize,
          group,
          labelWidth,
          size,
          node,
          nodeCircle);
      } else {
        group.appendChild(nodeCircle);
      }

      return group;

      function drawHoverBorderAndLabel(
        fontSize,
        group,
        labelWidth,
        size,
        node,
        nodeCircle) {
        var alignment,
            e = size + fontSize / 3,
            fontColor = (settings('labelHoverColor') === 'node') ?
                          (node.color || settings('defaultNodeColor')) :
                          settings('defaultLabelHoverColor'),
            h = fontSize + 4,
            labelOffsetX = - labelWidth / 2,
            labelOffsetY = fontSize / 3,
            prefix = settings('prefix') || '',
            rectangle = document.createElementNS(settings('xmlns'), 'rect'),
            rectOffsetX,
            rectOffsetY,
            text = document.createElementNS(settings('xmlns'), 'text'),
            w = labelWidth + size + 1.5 + fontSize / 3,
            x = node[prefix + 'x'],
            y = node[prefix + 'y'];

        if (settings('labelAlignment') === undefined) {
          alignment = settings('defaultLabelAlignment');
        } else {
          alignment = settings('labelAlignment');
        }

        // update x and y positions of hover rectangle and label
        switch (alignment) {
          case 'bottom':
            labelOffsetY = + size + 4 * fontSize / 3;
            rectangle.setAttributeNS(null, 'x', Math.round(x - w / 2));
            rectangle.setAttributeNS(null, 'y', Math.round(y + e));
            break;
          case 'center':
            break;
          case 'left':
            labelOffsetX = - size - 3 - labelWidth;
            rectangle.setAttributeNS(null, 'x', Math.round(x - w));
            rectangle.setAttributeNS(null, 'y',
              Math.round(y - fontSize / 2 - 2));
            break;
          case 'top':
            labelOffsetY = - size - 2 * fontSize / 3;
            rectangle.setAttributeNS(null, 'x', Math.round(x - w / 2));
            rectangle.setAttributeNS(null, 'y', Math.round(y - e - h));
            break;
          case 'inside':
            if (labelWidth <= e * 2) {
              break;
            }
            /* falls through */
          case 'right':
            /* falls through */
          default:
            labelOffsetX = size + 3;
            rectangle.setAttributeNS(null, 'x', Math.round(x));
            rectangle.setAttributeNS(null, 'y',
              Math.round(y - fontSize / 2 - 2));
            break;
        }

        // Text
        text.setAttributeNS(null, 'x', Math.round(x + labelOffsetX));
        text.setAttributeNS(null, 'y', Math.round(y + labelOffsetY));
        text.innerHTML = node.label;
        text.textContent = node.label;
        text.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-label');
        text.setAttributeNS(null, 'font-size', fontSize);
        text.setAttributeNS(null, 'font-family', settings('font'));
        text.setAttributeNS(null, 'fill', fontColor);

        // Hover Rectangle
        rectangle.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-area');

        if (alignment !== 'center' &&
            (alignment !== 'inside' || labelWidth > e * 2)) {
          rectangle.setAttributeNS(null, 'fill', '#fff');
          rectangle.setAttributeNS(null, 'stroke', '#000');
          rectangle.setAttributeNS(null, 'stroke-opacity', '0.3');
          rectangle.setAttributeNS(null, 'stroke-width', 2);
          rectangle.setAttributeNS(null, 'width', w);
          rectangle.setAttributeNS(null, 'height', h);
        }

        // Appending childs
        group.appendChild(rectangle);
        group.appendChild(nodeCircle);
        group.appendChild(text);
      }
    }
  };
}).call(this);
