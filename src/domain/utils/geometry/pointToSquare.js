/**
 * Transforms a graph node with x, y and size into an
 * axis-aligned square.
 *
 * @param  {object} A graph node with at least a point (x, y) and a size.
 * @return {object} A square: two points (x1, y1), (x2, y2) and height.
 */
export default function pointToSquare(n) {
  return {
    x1: n.x - n.size,
    y1: n.y - n.size,
    x2: n.x + n.size,
    y2: n.y - n.size,
    height: n.size * 2
  };
}
