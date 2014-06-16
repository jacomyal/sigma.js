;(function(undefined) {
  'use strict';

  var shapes = [];
  var register = function(name,drawShape) {
    shapes.push({
      'name': name,
      'drawShape': drawShape
    });
  }

  var enumerateShapes = function() {
    return shapes;
  }

  /**
   * For the standard closed shapes - the shape fill is drawn the same.
   * same. To facilitate this we create the generic draw functions,
   * that take a shape drawing func and return a shape-renderer
   * ----------
   */
  var genericDrawShape = function(shapeFunc) {
    return function(edge, source, target, color, prefix, context) {
      context.fillStyle = color;
      context.beginPath();
      shapeFunc(edge, source, target, color, prefix, context);
      context.closePath();
      context.fill();
    };
  }

  var drawLine = function(edge, source, target, color, prefix, context) {
    context.strokeStyle = color;
    context.lineWidth = edge[prefix + 'size'] || 1;
    context.beginPath();
    context.moveTo(
      source[prefix + 'x'],
      source[prefix + 'y']
    );
    context.lineTo(
      target[prefix + 'x'],
      target[prefix + 'y']
    );
    context.stroke();
  }


  /**
   * We now proced to use the generics to define our standard shape drawers:
   * solid, dotted, dashed
   * ----------
   */
  var drawSolidLine = function(edge, source, target, color, prefix, context) {
    drawLine(edge, source, target, color, prefix, context);
  }
  register("solid", genericDrawShape(drawSolidLine));

  var drawDottedLine = function(edge, source, target, color, prefix, context) {
    context.setLineDash([2]);
    drawLine(edge, source, target, color, prefix, context)
  }
  register("dotted", genericDrawShape(drawDottedLine));

  var drawDashedLine = function(edge, source, target, color, prefix, context) {
    context.setLineDash([8,3]);
    drawLine(edge, source, target, color, prefix, context)
  }
  register("dashed", genericDrawShape(drawDashedLine));



  /**
   * Exporting
   * ----------
   */
  this.EdgeShapeLibrary = {

    // Functions
    enumerate: enumerateShapes,
    // add: addShape,

    // Version
    version: '0.1'
  };

}).call(this);
