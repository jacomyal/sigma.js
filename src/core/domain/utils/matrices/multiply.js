/**
 * The returns a 3x3 or 2x2 homothetic transformation matrix.
 *
 * @param  {array}   a  The first matrix.
 * @param  {array}   b  The second matrix.
 * @param  {boolean} m2 If true, the function will assume both matrices are
 *                      2x2.
 * @return {array}      Returns the matrix.
 */
export default function multiply(a, b, m2) {
  const l = m2 ? 2 : 3;
  const a00 = a[0 * l + 0];
  const a01 = a[0 * l + 1];
  const a02 = a[0 * l + 2];
  const a10 = a[1 * l + 0];
  const a11 = a[1 * l + 1];
  const a12 = a[1 * l + 2];
  const a20 = a[2 * l + 0];
  const a21 = a[2 * l + 1];
  const a22 = a[2 * l + 2];
  const b00 = b[0 * l + 0];
  const b01 = b[0 * l + 1];
  const b02 = b[0 * l + 2];
  const b10 = b[1 * l + 0];
  const b11 = b[1 * l + 1];
  const b12 = b[1 * l + 2];
  const b20 = b[2 * l + 0];
  const b21 = b[2 * l + 1];
  const b22 = b[2 * l + 2];

  return m2
    ? [
        a00 * b00 + a01 * b10,
        a00 * b01 + a01 * b11,
        a10 * b00 + a11 * b10,
        a10 * b01 + a11 * b11
      ]
    : [
        a00 * b00 + a01 * b10 + a02 * b20,
        a00 * b01 + a01 * b11 + a02 * b21,
        a00 * b02 + a01 * b12 + a02 * b22,
        a10 * b00 + a11 * b10 + a12 * b20,
        a10 * b01 + a11 * b11 + a12 * b21,
        a10 * b02 + a11 * b12 + a12 * b22,
        a20 * b00 + a21 * b10 + a22 * b20,
        a20 * b01 + a21 * b11 + a22 * b21,
        a20 * b02 + a21 * b12 + a22 * b22
      ];
}
