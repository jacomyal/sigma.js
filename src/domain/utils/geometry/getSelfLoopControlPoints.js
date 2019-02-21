/**
 * Return the coordinates of the two control points for a self loop (i.e.
 * where the start point is also the end point) computed as a cubic bezier
 * curve.
 *
 * @param  {number} x    The X coordinate of the node.
 * @param  {number} y    The Y coordinate of the node.
 * @param  {number} size The node size.
 * @return {x1,y1,x2,y2} The coordinates of the two control points.
 */
export default function getSelfLoopControlPoints(x, y, size) {
  return {
    x1: x - size * 7,
    y1: y,
    x2: x,
    y2: y + size * 7
  };
}
