/**
 * Check if a point is on a quadratic bezier curve segment with a thickness.
 *
 * @param  {number} x       The X coordinate of the point to check.
 * @param  {number} y       The Y coordinate of the point to check.
 * @param  {number} x1      The X coordinate of the curve start point.
 * @param  {number} y1      The Y coordinate of the curve start point.
 * @param  {number} x2      The X coordinate of the curve end point.
 * @param  {number} y2      The Y coordinate of the curve end point.
 * @param  {number} cpx     The X coordinate of the curve control point.
 * @param  {number} cpy     The Y coordinate of the curve control point.
 * @param  {number} epsilon The precision (consider the line thickness).
 * @return {boolean}        True if (x,y) is on the curve segment,
 *                          false otherwise.
 */
export default function isPointOnQuadraticCurve(
  x,
  y,
  x1,
  y1,
  x2,
  y2,
  cpx,
  cpy,
  epsilon
) {
  // Fails if the point is too far from the extremities of the segment,
  // preventing for more costly computation:
  const dP1P2 = sigma.utils.getDistance(x1, y1, x2, y2);
  if (Math.abs(x - x1) > dP1P2 || Math.abs(y - y1) > dP1P2) {
    return false;
  }

  const dP1 = sigma.utils.getDistance(x, y, x1, y1);

  const dP2 = sigma.utils.getDistance(x, y, x2, y2);

  let t = 0.5;

  let r = dP1 < dP2 ? -0.01 : 0.01;

  const rThreshold = 0.001;

  let i = 100;

  let pt = sigma.utils.getPointOnQuadraticCurve(t, x1, y1, x2, y2, cpx, cpy);

  let dt = sigma.utils.getDistance(x, y, pt.x, pt.y);

  let old_dt;

  // This algorithm minimizes the distance from the point to the curve. It
  // find the optimal t value where t=0 is the start point and t=1 is the end
  // point of the curve, starting from t=0.5.
  // It terminates because it runs a maximum of i interations.
  while (
    i-- > 0 &&
    t >= 0 &&
    t <= 1 &&
    dt > epsilon &&
    (r > rThreshold || r < -rThreshold)
  ) {
    old_dt = dt;
    pt = sigma.utils.getPointOnQuadraticCurve(t, x1, y1, x2, y2, cpx, cpy);
    dt = sigma.utils.getDistance(x, y, pt.x, pt.y);

    if (dt > old_dt) {
      // not the right direction:
      // halfstep in the opposite direction
      r = -r / 2;
      t += r;
    } else if (t + r < 0 || t + r > 1) {
      // oops, we've gone too far:
      // revert with a halfstep
      r /= 2;
      dt = old_dt;
    } else {
      // progress:
      t += r;
    }
  }

  return dt < epsilon;
}
