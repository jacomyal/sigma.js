/**
 * Get coordinates of a rectangle's lower right corner from its top points
 * and its lower left corner.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @param  {object} A corner's coordinates (x, y).
 * @return {object} Coordinates of the corner (x, y).
 */
export default function lowerRightCoor(r, llc) {
  return {
    x: llc.x - r.x1 + r.x2,
    y: llc.y - r.y1 + r.y2
  };
}
