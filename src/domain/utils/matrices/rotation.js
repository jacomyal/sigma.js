/**
 * The returns a 3x3 or 2x2 rotation matrix.
 *
 * @param  {number}  angle The rotation angle.
 * @param  {boolean} m2    If true, the function will return a 2x2 matrix.
 * @return {array}         Returns the matrix.
 */
export default function rotation(angle, m2) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return m2 ? [cos, -sin, sin, cos] : [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
}
