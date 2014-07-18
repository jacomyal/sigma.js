;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        defaultNodeColor = settings('defaultNodeColor'),
        borderSize = settings('borderSize'),
        outerBorderSize = settings('outerBorderSize'),
        color = node.active ? 
          node.active_color || settings('defaultNodeActiveColor') : 
          node.color || defaultNodeColor;

    // Node border:
    if (node.active) {
      if (outerBorderSize > 0) {
        context.beginPath();
        context.fillStyle = settings('nodeOuterBorderColor') === 'node' ?
          (color || defaultNodeColor) :
          settings('defaultNodeOuterBorderColor');
        context.arc(
          node[prefix + 'x'],
          node[prefix + 'y'],
          node[prefix + 'size'] + borderSize + outerBorderSize,
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
      }
      if (borderSize > 0) {
        context.beginPath();
        context.fillStyle = settings('nodeBorderColor') === 'node' ?
          (color || defaultNodeColor) :
          settings('defaultNodeBorderColor');
        context.arc(
          node[prefix + 'x'],
          node[prefix + 'y'],
          node[prefix + 'size'] + borderSize,
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
      }
    }

    if (node.active) {
      context.fillStyle = settings('nodeActiveColor') === 'node' ?
        (color || defaultNodeColor) :
        settings('defaultNodeActiveColor');
    }
    else {
      context.fillStyle = color;
    }
    
    context.beginPath();
    context.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      node[prefix + 'size'],
      0,
      Math.PI * 2,
      true
    );

    context.closePath();
    context.fill();
  };
})();
