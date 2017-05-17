/**
 * Sigma.js WebGL Renderer Utils
 * ==============================
 *
 * Miscelleanous helper functions used by sigma's WebGL renderer.
 */
import {mat3} from 'gl-matrix';

/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
const FLOAT_COLOR_CACHE = {};

const RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
const RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)\s*(,.*)?\)\s*$/;

export function floatColor(val) {

  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== 'undefined')
    return FLOAT_COLOR_CACHE[val];

  let r = 0,
      g = 0,
      b = 0;

  // Handling hexadecimal notation
  if (val[0] === '#') {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    }
    else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
  }

  // Handling rgb notation
  else if (RGBA_TEST_REGEX.text(val)) {
    const match = val.match(RGBA_EXTRACT_REGEX);

    r = +match[1];
    g = +match[2];
    b = +match[3];
  }

  const color = (
    r * 256 * 256 +
    g * 256 +
    b
  );

  FLOAT_COLOR_CACHE[val] = color;

  return color;
}

/**
 * Function returning a matrix from the current state of the camera.
 */
export function matrixFromCamera(state) {
  const {
    angle,
    ratio,
    x,
    y
  } = state;

  const matrix = mat3.fromScaling(mat3.create(), [1 / ratio, 1 / ratio]);

  mat3.rotate(matrix, matrix, angle);
  mat3.translate(matrix, matrix, [-x, -y, 0]);

  return matrix;
}
