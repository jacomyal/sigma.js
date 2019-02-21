/**
 * Checks whether a rectangle is axis-aligned.
 *
 * @param  {object}  A rectangle defined by two points
 *                   (x1, y1) and (x2, y2).
 * @return {boolean} True if the rectangle is axis-aligned.
 */
export default function isAxisAligned(r) {
  return r.x1 === r.x2 || r.y1 === r.y2;
}
