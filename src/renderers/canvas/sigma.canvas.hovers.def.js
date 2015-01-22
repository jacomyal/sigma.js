;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.hovers');

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.hovers.def = function(node, context, settings) {
    var x,
        y,
        w,
        h,
        e,
        alignment,
        fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        fontSize = (settings('labelSize') === 'fixed') ?
          settings('defaultLabelSize') :
          settings('labelSizeRatio') * size;

    // Label background:
    context.font = (fontStyle ? fontStyle + ' ' : '') +
      fontSize + 'px ' + (settings('hoverFont') || settings('font'));

    context.beginPath();
    context.fillStyle = settings('labelHoverBGColor') === 'node' ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultHoverLabelBGColor');

    if (settings('labelHoverShadow')) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = settings('labelHoverShadowColor');
    }

    if (settings('labelAlignment') === undefined) {
      alignment = settings('defaultLabelAlignment');
    } else {
      alignment = settings('labelAlignment');
    }

    drawHoverBorder(alignment, context, fontSize, node);

    // Node border:
    if (settings('borderSize') > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        size + settings('borderSize'),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();
    }

    // Node:
    var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
    nodeRenderer(node, context, settings);

    displayLabel(alignment, context, fontSize, node);

    function displayLabel(alignment, context, fontSize, node) {
      if (node.label === null || node.label === undefined ||
          typeof node.label !== 'string') {
        return;
      }

      context.fillStyle = (settings('labelHoverColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelHoverColor');
      var labelWidth = context.measureText(node.label).width,
        xOffset = 0,
        yOffset = fontSize / 3;

      switch (alignment) {
        case 'bottom':
          xOffset = - labelWidth / 2;
          yOffset = + size + 4 * fontSize / 3;
          break;
        case 'center':
          xOffset = - labelWidth / 2;
          break;
        case 'left':
          xOffset = - size - 3 - labelWidth;
          break;
        case 'top':
          xOffset = - labelWidth / 2;
          yOffset = - size - 2 * fontSize / 3;
          break;
        case 'inside':
          if (labelWidth <= (size + fontSize / 3) * 2) {
            xOffset = - labelWidth / 2;
            break;
          }
        /* falls through*/
        case 'right':
        /* falls through*/
        default:
          xOffset = size + 3;
          break;
      }
      context.fillText(
        node.label,
        Math.round(node[prefix + 'x'] + xOffset),
        Math.round(node[prefix + 'y'] + yOffset)
      );
    }

    function drawHoverBorder(alignment, context, fontSize, node) {
      x = Math.round(node[prefix + 'x']);
      y = Math.round(node[prefix + 'y']);
      w = Math.round(
        context.measureText(node.label).width + size + 1.5 + fontSize / 3
      );
      h = Math.round(fontSize + 4);
      e = size + fontSize / 3;

      // draw a circle for the node first
      context.moveTo(x, y - e);
      context.arcTo(x + e, y - e, x + e, y, e);
      context.arcTo(x + e, y + e, x, y + e, e);
      context.arcTo(x - e, y + e, x - e, y, e);
      context.arcTo(x - e, y - e, x, y - e, e);

      if (node.label && typeof node.label === 'string') {
        // then a rectangle for the label
        switch (alignment) {
          case 'center':
            break;
          case 'left':
            y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
            context.moveTo(x, y);
            context.lineTo(x, y + h);
            context.lineTo(x - w, y + h);
            context.lineTo(x - w, y);
            context.lineTo(x, y);
            break;
          case 'top':
            y = Math.round(node[prefix + 'y'] - e);

            context.moveTo(x, y);
            context.lineTo(x + w / 2 , y);
            context.lineTo(x + w / 2, y - h);
            context.lineTo(x - w / 2, y - h);
            context.lineTo(x - w / 2, y);
            context.lineTo(x, y);
            break;
          case 'bottom':
            y = Math.round(node[prefix + 'y'] + e);

            context.moveTo(x, y);
            context.lineTo(x + w / 2 , y);
            context.lineTo(x + w / 2, y + h);
            context.lineTo(x - w / 2, y + h);
            context.lineTo(x - w / 2, y);
            context.lineTo(x, y);
            break;
          case 'inside':
            if (context.measureText(node.label).width <= e * 2) {
              // don't draw anything
              break;
            }
            // use default setting, falling through
          /* falls through*/
          case 'right':
          /* falls through*/
          default:
            y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);

            context.moveTo(x, y);
            context.lineTo(x + w, y);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.lineTo(x, y);
            break;
        }
      }

      context.closePath();
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
    }
  };
}).call(this);
