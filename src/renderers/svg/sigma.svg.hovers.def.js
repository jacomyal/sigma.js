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
    create: function(node, nodeCircle, settings) {
      // Creating elements
      var circle = document.createElementNS(settings('xmlns'), 'circle'),
          group = document.createElementNS(settings('xmlns'), 'g'),
          prefix = settings('prefix') || '';

      // Defining properties
      group.setAttributeNS(null, 'class', settings('classPrefix') + '-hover');
      group.setAttributeNS(null, 'data-node-id', node.id);

      // drawing hover circle
      circle.setAttributeNS(
        null,
        'class',
        settings('classPrefix') + '-hover-node-border');
      circle.setAttributeNS(null, 'fill', '#fff');
      circle.setAttributeNS(null, 'stroke', '#000');
      circle.setAttributeNS(null, 'stroke-opacity', '0.3');
      circle.setAttributeNS(null, 'stroke-width', 2);
      circle.setAttributeNS(null, 'pointer-events', 'none');

      group.appendChild(circle);

      if (typeof node.label === 'string' && node.label !== '') {
        // Text
        var fontColor = (settings('labelHoverColor') === 'node') ?
              (node.color || settings('defaultNodeColor')) :
              settings('defaultLabelHoverColor'),
            fontSize = (settings('labelSize') === 'fixed') ?
              settings('defaultLabelSize') :
              settings('labelSizeRatio') * node[prefix + 'size'],
            rectangle = document.createElementNS(settings('xmlns'), 'rect'),
            text = document.createElementNS(settings('xmlns'), 'text');

        text.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-label');
        text.setAttributeNS(null, 'font-size', fontSize);
        text.setAttributeNS(null, 'font-family', settings('font'));
        text.setAttributeNS(null, 'fill', fontColor);
        text.setAttributeNS(null, 'pointer-events', 'none');
        text.textContent = node.label;

        // Hover Rectangle
        rectangle.setAttributeNS(
          null,
          'class',
          settings('classPrefix') + '-hover-label-border');
        rectangle.setAttributeNS(null, 'fill', '#fff');
        rectangle.setAttributeNS(null, 'stroke', '#000');
        rectangle.setAttributeNS(null, 'stroke-opacity', '0.3');
        rectangle.setAttributeNS(null, 'stroke-width', 2);
        rectangle.setAttributeNS(null, 'pointer-events', 'none');

        // Appending childs
        group.appendChild(rectangle);
        group.appendChild(nodeCircle);
        group.appendChild(text);
      } else {
        group.appendChild(nodeCircle);
      }

      return group;
    },

    /**
     * SVG Hover Element Update.
     *
     * @param  {object}           node               The node object.
     * @param  {DOMElement}       group              The parent node containing
     *                            all hover elements.
     * @param  {CanvasElement}    measurementCanvas  A fake canvas handled by
     *                            the svg to perform some measurements and
     *                            passed by the renderer.
     * @param  {configurable}     settings           The settings function.
     * @param  {object}           lastKnownPos       The last known position of
     *                            the hovered node moved by the mouse
     */
    update: function(node, group, measurementCanvas, settings, lastKnownPos) {
      var circle,
          classPrefix = settings('classPrefix'),
          distanceTraveled = 0,
          fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          fontSize = (settings('labelSize') === 'fixed') ?
            settings('defaultLabelSize') :
            settings('labelSizeRatio') * size,
          e = size + fontSize / 3,
          x = node[prefix + 'x'],
          y = node[prefix + 'y'];

      if (!group.getElementsByClassName(classPrefix + '-hover-node-border')) {
        return;
      }

      // with forced field applied, the node may get moved.
      // if the hovered node is not within the radius of the last known
      // position, the hovered area should be hidden
      if (lastKnownPos && lastKnownPos.x && lastKnownPos.y) {
        distanceTraveled = Math.sqrt(Math.pow(x - lastKnownPos.x, 2) +
          Math.pow(y - lastKnownPos.y, 2));
      }

      circle = group.getElementsByClassName(classPrefix +
        '-hover-node-border')[0];
      // drawing hover circle
      circle.setAttributeNS(null, 'cx', Math.round(x));
      circle.setAttributeNS(null, 'cy', Math.round(y));
      circle.setAttributeNS(null, 'r', Math.round(e));

      if (distanceTraveled > e) {
        circle.setAttributeNS(null, 'display', 'none');
      }

      if (typeof node.label === 'string' && node.label !== '') {
         // set context font and font size
        measurementCanvas.font = (fontStyle ? fontStyle + ' ' : '') +
          fontSize + 'px ' + (settings('hoverFont') || settings('font'));

        var alignment,
            fontColor = (settings('labelHoverColor') === 'node') ?
                          (node.color || settings('defaultNodeColor')) :
                          settings('defaultLabelHoverColor'),
            h = fontSize + 4,
            labelWidth = measurementCanvas.measureText(node.label).width,
            labelOffsetX = - labelWidth / 2,
            labelOffsetY = fontSize / 3,
            rectangle,
            rectOffsetX,
            rectOffsetY,
            text,
            w = labelWidth + size + 1.5 + fontSize / 3;

        if (!group.getElementsByClassName(classPrefix +
              '-hover-label-border') ||
            !group.getElementsByClassName(classPrefix + '-hover-label')) {
          return;
        }

        rectangle = group.getElementsByClassName(classPrefix +
          '-hover-label-border')[0];
        text = group.getElementsByClassName(classPrefix + '-hover-label')[0];

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
        text.textContent = node.label;

        // Hover Rectangle
        if (alignment !== 'center' &&
            (alignment !== 'inside' || labelWidth > e * 2)) {
          rectangle.setAttributeNS(null, 'width', w);
          rectangle.setAttributeNS(null, 'height', h);
        }

        if (distanceTraveled > e) {
          text.setAttributeNS(null, 'display', 'none');
          rectangle.setAttributeNS(null, 'display', 'none');
        }
      }
    }
  };
}).call(this);
