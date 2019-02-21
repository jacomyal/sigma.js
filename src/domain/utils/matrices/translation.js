/**
 * The returns a 3x3 translation matrix.
 *
 * @param  {number} dx The X translation.
 * @param  {number} dy The Y translation.
 * @return {array}     Returns the matrix.
 */
export default function translation(dx, dy) {
  return [1, 0, 0, 0, 1, 0, dx, dy, 1];
}
