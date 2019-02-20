/**
 * The returns a 3x3 or 2x2 homothetic transformation matrix.
 *
 * @param  {number}  ratio The scaling ratio.
 * @param  {boolean} m2    If true, the function will return a 2x2 matrix.
 * @return {array}         Returns the matrix.
 */
export default function scale(ratio, m2) {
  return m2 ? [ratio, 0, 0, ratio] : [ratio, 0, 0, 0, ratio, 0, 0, 0, 1];
}
