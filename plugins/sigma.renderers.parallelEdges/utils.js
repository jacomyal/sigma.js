;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  var _root = this;

  // Initialize packages:
  sigma.utils = sigma.utils || {};

  /**
   * Return the control point coordinates for a quadratic bezier curve.
   *
   * @param  {number} x1  The X coordinate of the start point.
   * @param  {number} y1  The Y coordinate of the start point.
   * @param  {number} x2  The X coordinate of the end point.
   * @param  {number} y2  The Y coordinate of the end point.
   * @param  {number} a   Modifier for the amplitude of the curve.
   * @return {x,y}        The control point coordinates.
   */
  sigma.utils.getQuadraticControlPoint = function(x1, y1, x2, y2, a) {
    a = a || 0;
    return {
      x: (x1 + x2) / 2 + (y2 - y1) / (60 / (15 + a)),
      y: (y1 + y2) / 2 + (x1 - x2) / (60 / (15 + a))
    };
  };

  /**
   * Return the coordinates of the two control points for a self loop (i.e.
   * where the start point is also the end point) computed as a cubic bezier
   * curve.
   *
   * @param  {number} x    The X coordinate of the node.
   * @param  {number} y    The Y coordinate of the node.
   * @param  {number} size The node size.
   * @param  {number} a    Modifier to the loop size.
   * @return {x1,y1,x2,y2} The coordinates of the two control points.
   */
  sigma.utils.getSelfLoopControlPoints = function(x , y, size, a) {
    a = a || 0;
    return {
      x1: x - (size + a) * 7,
      y1: y,
      x2: x,
      y2: y + (size + a) * 7
    };
  };
}).call(this);
