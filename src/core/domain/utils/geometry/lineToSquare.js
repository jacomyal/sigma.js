/**
 * Transforms a graph edge with x1, y1, x2, y2 and size into an
 * axis-aligned square.
 *
 * @param  {object} A graph edge with at least two points
 *                  (x1, y1), (x2, y2) and a size.
 * @return {object} A square: two points (x1, y1), (x2, y2) and height.
 */
export default function lineToSquare(e) {
  if (e.y1 < e.y2) {
    // (e.x1, e.y1) on top
    if (e.x1 < e.x2) {
      // (e.x1, e.y1) on left
      return {
        x1: e.x1 - e.size,
        y1: e.y1 - e.size,
        x2: e.x2 + e.size,
        y2: e.y1 - e.size,
        height: e.y2 - e.y1 + e.size * 2
      };
    }
    // (e.x1, e.y1) on right
    return {
      x1: e.x2 - e.size,
      y1: e.y1 - e.size,
      x2: e.x1 + e.size,
      y2: e.y1 - e.size,
      height: e.y2 - e.y1 + e.size * 2
    };
  }

  // (e.x2, e.y2) on top
  if (e.x1 < e.x2) {
    // (e.x1, e.y1) on left
    return {
      x1: e.x1 - e.size,
      y1: e.y2 - e.size,
      x2: e.x2 + e.size,
      y2: e.y2 - e.size,
      height: e.y1 - e.y2 + e.size * 2
    };
  }
  // (e.x2, e.y2) on right
  return {
    x1: e.x2 - e.size,
    y1: e.y2 - e.size,
    x2: e.x1 + e.size,
    y2: e.y2 - e.size,
    height: e.y1 - e.y2 + e.size * 2
  };
}
