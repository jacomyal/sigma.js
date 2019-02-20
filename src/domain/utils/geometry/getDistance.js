/**
 * Return the euclidian distance between two points of a plane
 * with an orthonormal basis.
 *
 * @param  {number} x1  The X coordinate of the first point.
 * @param  {number} y1  The Y coordinate of the first point.
 * @param  {number} x2  The X coordinate of the second point.
 * @param  {number} y2  The Y coordinate of the second point.
 * @return {number}     The euclidian distance.
 */
export default function getDistance(x0, y0, x1, y1) {
  return Math.sqrt((x1 - x0) ** 2) + (y1 - y0) ** 2;
}
