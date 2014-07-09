;(function(undefined) {
  'use strict';

  var shapes = [];
  var register = function(name,drawShape) {
    shapes.push({
      'name': name,
      'drawShape': drawShape
    });
  };

  var enumerateShapes = function() {
    return shapes;
  };

  /**
   * Return the distance between two points in the plan.
   */
  var distance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  /**
   * Return the coordinates of the intersection points of two circles.
   * http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
   */
  var circleIntersection = function(x0, y0, r0, x1, y1, r1) {
      var a, dx, dy, d, h, rx, ry;
      var x2, y2;

      /* dx and dy are the vertical and horizontal distances between
       * the circle centers.
       */
      dx = x1 - x0;
      dy = y1 - y0;

      /* Determine the straight-line distance between the centers. */
      d = Math.sqrt((dy*dy) + (dx*dx));

      /* Check for solvability. */
      if (d > (r0 + r1)) {
          /* no solution. circles do not intersect. */
          return false;
      }
      if (d < Math.abs(r0 - r1)) {
          /* no solution. one circle is contained in the other */
          return false;
      }

      /* 'point 2' is the point where the line through the circle
       * intersection points crosses the line between the circle
       * centers.  
       */

      /* Determine the distance from point 0 to point 2. */
      a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

      /* Determine the coordinates of point 2. */
      x2 = x0 + (dx * a/d);
      y2 = y0 + (dy * a/d);

      /* Determine the distance from point 2 to either of the
       * intersection points.
       */
      h = Math.sqrt((r0*r0) - (a*a));

      /* Now determine the offsets of the intersection points from
       * point 2.
       */
      rx = -dy * (h/d);
      ry = dx * (h/d);

      /* Determine the absolute intersection points. */
      var xi = x2 + rx;
      var xi_prime = x2 - rx;
      var yi = y2 + ry;
      var yi_prime = y2 - ry;

      return {xi: xi, xi_prime: xi_prime, yi: yi, yi_prime: yi_prime};
  };

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
  };

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
  };


  /**
   * We now proced to use the generics to define our standard shape drawers:
   * solid, dotted, dashed, tapered, parallel
   * ----------
   */
  var drawSolidLine = function(edge, source, target, color, prefix, context) {
    drawLine(edge, source, target, color, prefix, context);
  };
  register("solid", genericDrawShape(drawSolidLine));

  var drawDottedLine = function(edge, source, target, color, prefix, context) {
    context.setLineDash([2]);
    drawLine(edge, source, target, color, prefix, context)
  };
  register("dotted", genericDrawShape(drawDottedLine));

  var drawDashedLine = function(edge, source, target, color, prefix, context) {
    context.setLineDash([8,3]);
    drawLine(edge, source, target, color, prefix, context)
  };
  register("dashed", genericDrawShape(drawDashedLine));

  /**
   * Implementation of tapered edges.
   * Danny Holten, Petra Isenberg, Jean-Daniel Fekete, and J. Van Wijk (2010)
   * Performance Evaluation of Tapered, Curved, and Animated Directed-Edge
   * Representations in Node-Link Graphs. Research Report, Sep 2010.
   */
  var drawTapered = function(edge, source, target, color, prefix, context) {
    // The goal is to draw a triangle where the target node is a point of 
    // the triangle, and the two other points are the intersection of the
    // source circle and the circle (target, distance(source, target)).
    var r_s = edge['renderer1:size'],
        r_t = distance(
          source['renderer1:x'], 
          source['renderer1:y'], 
          target['renderer1:x'], 
          target['renderer1:y']
    );

    // Intersection points
    var c = circleIntersection(
      source['renderer1:x'], 
      source['renderer1:y'], 
      r_s,
      target['renderer1:x'], 
      target['renderer1:y'], 
      r_t);

    // Turn transparency on
    context.globalAlpha = 0.65;

    // Draw the triangle
    context.moveTo(target['renderer1:x'], target['renderer1:y']);
    context.lineTo(c.xi, c.yi);
    context.lineTo(c.xi_prime, c.yi_prime);
  };
  register("tapered", genericDrawShape(drawTapered));

  /**
   * Draw two parallel lines.
   */
  var drawParallelLines = function(edge, source, target, color, prefix, context) {
    var size = edge['renderer1:size'],
        dist = distance(
          source['renderer1:x'], 
          source['renderer1:y'], 
          target['renderer1:x'], 
          target['renderer1:y']
    );

    // Intersection points of the source node circle
    var c = circleIntersection(
      source['renderer1:x'], 
      source['renderer1:y'], 
      size,
      target['renderer1:x'], 
      target['renderer1:y'], 
      dist);

    // Intersection points of the target node circle
    var d = circleIntersection(
      target['renderer1:x'], 
      target['renderer1:y'], 
      size,
      source['renderer1:x'], 
      source['renderer1:y'], 
      dist);


    context.strokeStyle = color;
    context.lineWidth = edge[prefix + 'size'] || 1;
    context.beginPath();
    context.moveTo(c.xi, c.yi);
    context.lineTo(d.xi_prime, d.yi_prime);
    context.stroke();

    context.beginPath();
    context.moveTo(c.xi_prime, c.yi_prime);
    context.lineTo(d.xi, d.yi);
    context.stroke();
  };
  register("parallel", genericDrawShape(drawParallelLines));


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
