/**
 * Compute top points of an axis-aligned rectangle. This is useful in
 * cases when the rectangle has been rotated (left, right or bottom up) and
 * later operations need to know the top points.
 *
 * @param  {object} An axis-aligned rectangle defined by two points
 *                  (x1, y1), (x2, y2) and height.
 * @return {object} A rectangle: two points (x1, y1), (x2, y2) and height.
 */
export default function axisAlignedTopPoints(r) {
  // Basic
  if (r.y1 === r.y2 && r.x1 < r.x2) return r;

  // Rotated to right
  if (r.x1 === r.x2 && r.y2 > r.y1)
    return {
      x1: r.x1 - r.height,
      y1: r.y1,
      x2: r.x1,
      y2: r.y1,
      height: r.height
    };

  // Rotated to left
  if (r.x1 === r.x2 && r.y2 < r.y1)
    return {
      x1: r.x1,
      y1: r.y2,
      x2: r.x2 + r.height,
      y2: r.y2,
      height: r.height
    };

  // Bottom's up
  return {
    x1: r.x2,
    y1: r.y1 - r.height,
    x2: r.x1,
    y2: r.y1 - r.height,
    height: r.height
  };
}
