import getSelfLoopControlPoints from "./getSelfLoopControlPoints";
/**
 * Transforms a graph self loop into an axis-aligned square.
 *
 * @param  {object} n A graph node with a point (x, y) and a size.
 * @return {object}   A square: two points (x1, y1), (x2, y2) and height.
 */
export default function selfLoopToSquare(n) {
  // Fitting to the curve is too costly, we compute a larger bounding box
  // using the control points:
  const cp = getSelfLoopControlPoints(n.x, n.y, n.size);

  // Bounding box of the point and the two control points:
  const minX = Math.min(n.x, cp.x1, cp.x2);
  const maxX = Math.max(n.x, cp.x1, cp.x2);
  const minY = Math.min(n.y, cp.y1, cp.y2);
  const maxY = Math.max(n.y, cp.y1, cp.y2);
  return {
    x1: minX - n.size,
    y1: minY - n.size,
    x2: maxX + n.size,
    y2: minY - n.size,
    height: maxY - minY + n.size * 2
  };
}
