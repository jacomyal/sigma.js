;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof ShapeLibrary === 'undefined')
    throw 'ShapeLibrary is not declared';
  

  // Initialize package:
  sigma.utils.pkg('sigma.canvas.nodes');

  var register = function(name,drawShape,drawBorder) {
    sigma.canvas.nodes[name] = function(node, context, settings) {
      var args = arguments,
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'],
          color = node.color || settings('defaultNodeColor'),
          borderColor = node.borderColor || color,
          x = node[prefix + 'x'],
          y = node[prefix + 'y'];

      context.save();

      // Draw shape
      if(drawShape) {
        drawShape(node,x,y,size,color,context);
      }

      // Draw the border:
      if(drawBorder) {
        drawBorder(node,x,y,size,borderColor,context);
      }
      
      // TODO add image

      context.restore();
    };
  }

  ShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name,shape.drawShape,shape.drawBorder);
  });


}).call(this);
