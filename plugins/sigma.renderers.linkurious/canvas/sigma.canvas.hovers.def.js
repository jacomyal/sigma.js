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
        fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'] || 1,
        defaultNodeColor = settings('defaultNodeColor'),
        borderSize = settings('borderSize'),
        alignment = settings('labelAlignment'),
        fontSize = (settings('labelSize') === 'fixed') ?
          settings('defaultLabelSize') :
          settings('labelSizeRatio') * size,
        color = node.color || defaultNodeColor;

    if (alignment !== 'center') {
      prepareLabelBackground(context);
      drawHoverBorder(alignment, context, fontSize, node);
    }

    // Node border:
    if (borderSize > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        size + borderSize,
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

    if (alignment === 'center') {
      prepareLabelBackground(context);
      drawHoverBorder(alignment, context, fontSize, node);
    }

    // Display the label:
    if (typeof node.label === 'string') {
      context.fillStyle = (settings('labelHoverColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelHoverColor');

      var labelWidth = context.measureText(node.label).width,
          labelOffsetX = - labelWidth / 2,
          labelOffsetY = fontSize / 3;

      switch (alignment) {
        case 'bottom':
          labelOffsetY = + size + 4 * fontSize / 3;
          break;
        case 'center':
          break;
        case 'left':
          labelOffsetX = - size - borderSize - settings('outerBorderSize') - 3 - labelWidth;
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
          labelOffsetX = size + borderSize + settings('outerBorderSize') + 3;
          break;
      }

      context.fillText(
        node.label,
        Math.round(node[prefix + 'x'] + labelOffsetX),
        Math.round(node[prefix + 'y'] + labelOffsetY)
      );
    }

    function prepareLabelBackground(context) {
      context.font = (fontStyle ? fontStyle + ' ' : '') +
        fontSize + 'px ' + (settings('hoverFont') || settings('font'));

      context.beginPath();
      context.fillStyle = settings('labelHoverBGColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultHoverLabelBGColor');

      if (node.label && settings('labelHoverShadow')) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 8;
        context.shadowColor = settings('labelHoverShadowColor');
      }
    }

    function drawHoverBorder(alignment, context, fontSize, node) {
      var x = Math.round(node[prefix + 'x']),
          y = Math.round(node[prefix + 'y']),
          w = Math.round(
            context.measureText(node.label).width + size + 1.5 + fontSize / 3
          ),
          h = fontSize + 4,
          e = Math.round(size + fontSize / 4);

      if (node.label && typeof node.label === 'string') {
        // draw a rectangle for the label
        switch (alignment) {
          case 'center':
            y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
            context.rect(x - w / 2, y, w, h);
            break;
          case 'left':
            x = Math.round(node[prefix + 'x'] + fontSize / 2 + 2);
            y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);

            context.moveTo(x, y + e);
            context.arcTo(x, y, x - e, y, e);
            context.lineTo(x - w - borderSize - e, y);
            context.lineTo(x - w - borderSize - e, y + h);
            context.lineTo(x - e, y + h);
            context.arcTo(x, y + h, x, y + h - e, e);
            context.lineTo(x, y + e);
            break;
          case 'top':
            context.rect(x - w / 2, y - e - h, w, h);
            break;
          case 'bottom':
            context.rect(x - w / 2, y + e, w, h);
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
            x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
            y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);

            context.moveTo(x, y + e);
            context.arcTo(x, y, x + e, y, e);
            context.lineTo(x + w + borderSize + e, y);
            context.lineTo(x + w + borderSize + e, y + h);
            context.lineTo(x + e, y + h);
            context.arcTo(x, y + h, x, y + h - e, e);
            context.lineTo(x, y + e);
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
