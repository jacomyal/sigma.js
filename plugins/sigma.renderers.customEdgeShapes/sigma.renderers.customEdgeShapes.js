;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof EdgeShapeLibrary === 'undefined')
    throw 'EdgeShapeLibrary is not declared';
  

  // Initialize package:
  sigma.utils.pkg('sigma.canvas.edges');

  var sigInst = undefined;

  var initPlugin = function(inst) {
    sigInst = inst;
  }


  var register = function(name,drawShape) {
    sigma.canvas.edges[name] = function(edge, source, target, context, settings) {
      var prefix = settings('prefix') || '',
          size = edge[prefix + 'size'] || 1,
          color = edge.active ? 
            edge.active_color || settings('defaultEdgeActiveColor') : 
            edge.color,
          edgeColor = settings('edgeColor'),
          defaultNodeColor = settings('defaultNodeColor'),
          defaultEdgeColor = settings('defaultEdgeColor');

      if (!color) {
        switch (edgeColor) {
          case 'source':
            color = source.color || defaultNodeColor;
            break;
          case 'target':
            color = target.color || defaultNodeColor;
            break;
          default:
            color = defaultEdgeColor;
            break;
        }
      }

      context.save();

      if (edge.hover) {
        if (settings('edgeHoverColor') === 'edge') {
          color = edge.hover_color || color;
        } else {
          color = edge.hover_color || settings('defaultEdgeHoverColor') || color;
        }
        size *= settings('edgeHoverSizeRatio');
      }
      else if (edge.active) {
        color = settings('edgeActiveColor') === 'edge' ?
          (color || defaultEdgeColor) :
          settings('defaultEdgeActiveColor');
      }

      context.strokeStyle = color;

      if(drawShape) {
        drawShape(edge, source, target, color, size, prefix, context);
      }

      context.restore();
    };
  }

  EdgeShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name, shape.drawShape);
  });

  /**
   * Exporting
   * ----------
   */
  this.CustomEdgeShapes = {

    // Functions
    init: initPlugin,

    // Version
    version: '0.1'
  };



}).call(this);
