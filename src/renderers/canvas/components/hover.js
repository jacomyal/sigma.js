/**
 * Sigma.js Canvas Renderer Hover Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's hovered
 * state.
 */
import drawNode from './node';
import drawLabel from './label';

export default function drawHover(context, data) {

  // Then we draw the label background
  context.beginPath();
  context.fillStyle = '#fff';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = '#000';

  const textWidth = context.measureText(data.label).width;

  const x = Math.round(data.x - 14 / 2 - 2),
        y = Math.round(data.y - 14 / 2 - 2),
        w = Math.round(textWidth + 14 / 2 + data.size + 9),
        h = Math.round(14 + 4),
        e = Math.round(14 / 2 + 2);

  context.moveTo(x, y + e);
  context.moveTo(x, y + e);
  context.arcTo(x, y, x + e, y, e);
  context.lineTo(x + w, y);
  context.lineTo(x + w, y + h);
  context.lineTo(x + e, y + h);
  context.arcTo(x, y + h, x, y + h - e, e);
  context.lineTo(x, y + e);

  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // Then we need to draw the node
  drawNode(context, data);

  // And finally we draw the label
  drawLabel(context, data);
}

// ;(function(undefined) {
//   'use strict';

//   if (typeof sigma === 'undefined')
//     throw 'sigma is not declared';

//   // Initialize packages:
//   sigma.utils.pkg('sigma.canvas.hovers');

//   /**
//    * This hover renderer will basically display the label with a background.
//    *
//    * @param  {object}                   node     The node object.
//    * @param  {CanvasRenderingContext2D} context  The canvas context.
//    * @param  {configurable}             settings The settings function.
//    */
//   sigma.canvas.hovers.def = function(node, context, settings) {
//     var x,
//         y,
//         w,
//         h,
//         e,
//         fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
//         prefix = settings('prefix') || '',
//         size = node[prefix + 'size'],
//         fontSize = (settings('labelSize') === 'fixed') ?
//           settings('defaultLabelSize') :
//           settings('labelSizeRatio') * size;

//     // Label background:
//     context.font = (fontStyle ? fontStyle + ' ' : '') +
//       fontSize + 'px ' + (settings('hoverFont') || settings('font'));

//     context.beginPath();
//     context.fillStyle = settings('labelHoverBGColor') === 'node' ?
//       (node.color || settings('defaultNodeColor')) :
//       settings('defaultHoverLabelBGColor');

//     if (node.label && settings('labelHoverShadow')) {
//       context.shadowOffsetX = 0;
//       context.shadowOffsetY = 0;
//       context.shadowBlur = 8;
//       context.shadowColor = settings('labelHoverShadowColor');
//     }

//     if (node.label && typeof node.label === 'string') {
//       x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
//       y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
//       w = Math.round(
//         context.measureText(node.label).width + fontSize / 2 + size + 7
//       );
//       h = Math.round(fontSize + 4);
//       e = Math.round(fontSize / 2 + 2);

//       context.moveTo(x, y + e);
//       context.arcTo(x, y, x + e, y, e);
//       context.lineTo(x + w, y);
//       context.lineTo(x + w, y + h);
//       context.lineTo(x + e, y + h);
//       context.arcTo(x, y + h, x, y + h - e, e);
//       context.lineTo(x, y + e);

//       context.closePath();
//       context.fill();

//       context.shadowOffsetX = 0;
//       context.shadowOffsetY = 0;
//       context.shadowBlur = 0;
//     }

//     // Node border:
//     if (settings('borderSize') > 0) {
//       context.beginPath();
//       context.fillStyle = settings('nodeBorderColor') === 'node' ?
//         (node.color || settings('defaultNodeColor')) :
//         settings('defaultNodeBorderColor');
//       context.arc(
//         node[prefix + 'x'],
//         node[prefix + 'y'],
//         size + settings('borderSize'),
//         0,
//         Math.PI * 2,
//         true
//       );
//       context.closePath();
//       context.fill();
//     }

//     // Node:
//     var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
//     nodeRenderer(node, context, settings);

//     // Display the label:
//     if (node.label && typeof node.label === 'string') {
//       context.fillStyle = (settings('labelHoverColor') === 'node') ?
//         (node.color || settings('defaultNodeColor')) :
//         settings('defaultLabelHoverColor');

//       context.fillText(
//         node.label,
//         Math.round(node[prefix + 'x'] + size + 3),
//         Math.round(node[prefix + 'y'] + fontSize / 3)
//       );
//     }
//   };
// }).call(this);
