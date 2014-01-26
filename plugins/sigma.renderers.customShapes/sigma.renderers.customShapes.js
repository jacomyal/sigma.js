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
        context.beginPath();
        context.fillStyle = color;
        drawShape(node,x,y,size,context);
        context.closePath();
        context.fill();
      }

      // Draw the border:
      if(drawBorder) {
        context.beginPath();
        context.lineWidth = size / 5;
        context.strokeStyle = borderColor;
        drawBorder(node,x,y,size,context);
        context.closePath();
        context.stroke();
      }
      
      // TODO add image

      context.restore();
    };
  }

  ShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name,shape.drawShape,shape.drawBorder);
  });


}).call(this);
