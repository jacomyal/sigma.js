/**
 * Compute the coordinates of the point positioned
 * at length t in the cubic bezier curve.
 *
 * @param  {number} t  In [0,1] the step percentage to reach
 *                     the point in the curve from the context point.
 * @param  {number} x1 The X coordinate of the context point.
 * @param  {number} y1 The Y coordinate of the context point.
 * @param  {number} x2 The X coordinate of the end point.
 * @param  {number} y2 The Y coordinate of the end point.
 * @param  {number} cx The X coordinate of the first control point.
 * @param  {number} cy The Y coordinate of the first control point.
 * @param  {number} dx The X coordinate of the second control point.
 * @param  {number} dy The Y coordinate of the second control point.
 * @return {object}    {x,y} The point at t.
 */
export default function getPointOnBezierCurve(
  t,
  x1,
  y1,
  x2,
  y2,
  cx,
  cy,
  dx,
  dy
) {
  // http://stackoverflow.com/a/15397596
  // Blending functions:
  const b0t = (1 - t) ** 3;
  const b1t = 3 * t * (1 - t) ** 2;
  const b2t = 3 * t ** 2 * (1 - t);
  const b3t = t ** 3;

  return {
    x: b0t * x1 + b1t * cx + b2t * dx + b3t * x2,
    y: b0t * y1 + b1t * cy + b2t * dy + b3t * y2
  };
}
