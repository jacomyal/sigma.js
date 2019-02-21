import getPointOnQuadraticCurve from "./getPointOnQuadraticCurve";

/**
 * Transforms a graph edge of type 'curve' with x1, y1, x2, y2,
 * control point and size into an axis-aligned square.
 *
 * @param  {object} e  A graph edge with at least two points
 *                     (x1, y1), (x2, y2) and a size.
 * @param  {object} cp A control point (x,y).
 * @return {object}    A square: two points (x1, y1), (x2, y2) and height.
 */
export default function quadraticCurveToSquare(e, cp) {
  const pt = getPointOnQuadraticCurve(0.5, e.x1, e.y1, e.x2, e.y2, cp.x, cp.y);

  // Bounding box of the two points and the point at the middle of the
  // curve:
  const minX = Math.min(e.x1, e.x2, pt.x);
  const maxX = Math.max(e.x1, e.x2, pt.x);
  const minY = Math.min(e.y1, e.y2, pt.y);
  const maxY = Math.max(e.y1, e.y2, pt.y);

  return {
    x1: minX - e.size,
    y1: minY - e.size,
    x2: maxX + e.size,
    y2: minY - e.size,
    height: maxY - minY + e.size * 2
  };
}
