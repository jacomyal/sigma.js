/**
 * Compute the coordinates of the point positioned
 * at length t in the quadratic bezier curve.
 *
 * @param  {number} t  In [0,1] the step percentage to reach
 *                     the point in the curve from the context point.
 * @param  {number} x1 The X coordinate of the context point.
 * @param  {number} y1 The Y coordinate of the context point.
 * @param  {number} x2 The X coordinate of the ending point.
 * @param  {number} y2 The Y coordinate of the ending point.
 * @param  {number} xi The X coordinate of the control point.
 * @param  {number} yi The Y coordinate of the control point.
 * @return {object}    {x,y}.
 */
export default function getPointsOnQuadraticCurve(t, x1, y1, x2, y2, xi, yi) {
  // http://stackoverflow.com/a/5634528
  const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * xi + t ** 2 * x2;
  const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * yi + t ** 2 * y2;
  return { x, y };
}
