/* eslint-disable camelcase */

/**
 * Return the coordinates of the intersection points of two circles.
 *
 * @param  {number} x0  The X coordinate of center location of the first
 *                      circle.
 * @param  {number} y0  The Y coordinate of center location of the first
 *                      circle.
 * @param  {number} r0  The radius of the first circle.
 * @param  {number} x1  The X coordinate of center location of the second
 *                      circle.
 * @param  {number} y1  The Y coordinate of center location of the second
 *                      circle.
 * @param  {number} r1  The radius of the second circle.
 * @return {xi,yi}      The coordinates of the intersection points.
 */
export default function getCircleIntersection(x0, y0, r0, x1, y1, r1) {
  // http://stackoverflow.com/a/12219802

  // dx and dy are the vertical and horizontal distances between the circle
  // centers:
  const dx = x1 - x0;
  const dy = y1 - y0;

  // Determine the straight-line distance between the centers:
  const d = Math.sqrt(dy * dy + dx * dx);

  // Check for solvability:
  if (d > r0 + r1) {
    // No solution. circles do not intersect.
    return false;
  }
  if (d < Math.abs(r0 - r1)) {
    // No solution. one circle is contained in the other.
    return false;
  }

  // 'point 2' is the point where the line through the circle intersection
  // points crosses the line between the circle centers.

  // Determine the distance from point 0 to point 2:
  const a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  // Determine the coordinates of point 2:
  const x2 = x0 + (dx * a) / d;
  const y2 = y0 + (dy * a) / d;

  // Determine the distance from point 2 to either of the intersection
  // points:
  const h = Math.sqrt(r0 * r0 - a * a);

  // Determine the offsets of the intersection points from point 2:
  const rx = -dy * (h / d);
  const ry = dx * (h / d);

  // Determine the absolute intersection points:
  const xi = x2 + rx;
  const xi_prime = x2 - rx;
  const yi = y2 + ry;
  const yi_prime = y2 - ry;

  return { xi, xi_prime, yi, yi_prime };
}
