/**
 * Get coordinates of a rectangle's lower left corner from its top points.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @return {object} Coordinates of the corner (x, y).
 */
export default function lowerLeftCoor(r) {
  const width = Math.sqrt((r.x2 - r.x1) ** 2 + (r.y2 - r.y1) ** 2);
  return {
    x: r.x1 - ((r.y2 - r.y1) * r.height) / width,
    y: r.y1 + ((r.x2 - r.x1) * r.height) / width
  };
}
