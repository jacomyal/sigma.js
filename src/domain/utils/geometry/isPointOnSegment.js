/**
 * Check if a point is on a line segment.
 *
 * @param  {number} x       The X coordinate of the point to check.
 * @param  {number} y       The Y coordinate of the point to check.
 * @param  {number} x1      The X coordinate of the line start point.
 * @param  {number} y1      The Y coordinate of the line start point.
 * @param  {number} x2      The X coordinate of the line end point.
 * @param  {number} y2      The Y coordinate of the line end point.
 * @param  {number} epsilon The precision (consider the line thickness).
 * @return {boolean}        True if point is "close to" the line
 *                          segment, false otherwise.
 */
export default function isPointOnSegment(x, y, x1, y1, x2, y2, epsilon) {
  // http://stackoverflow.com/a/328122
  const crossProduct = Math.abs((y - y1) * (x2 - x1) - (x - x1) * (y2 - y1));

  const d = sigma.utils.getDistance(x1, y1, x2, y2);

  const nCrossProduct = crossProduct / d; // normalized cross product

  return (
    nCrossProduct < epsilon &&
    Math.min(x1, x2) <= x &&
    x <= Math.max(x1, x2) &&
    Math.min(y1, y2) <= y &&
    y <= Math.max(y1, y2)
  );
}
