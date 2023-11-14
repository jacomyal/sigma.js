/**
 * Sigma.js WebGL Matrices Helpers
 * ================================
 *
 * Matrices-related helper functions used by sigma's WebGL renderer.
 * @module
 */
import { Coordinates } from "../types";

export function identity(): Float32Array {
  return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}

// TODO: optimize
export function scale(m: Float32Array, x: number, y?: number): Float32Array {
  m[0] = x;
  m[4] = typeof y === "number" ? y : x;

  return m;
}

export function rotate(m: Float32Array, r: number): Float32Array {
  const s = Math.sin(r),
    c = Math.cos(r);

  m[0] = c;
  m[1] = s;
  m[3] = -s;
  m[4] = c;

  return m;
}

export function translate(m: Float32Array, x: number, y: number): Float32Array {
  m[6] = x;
  m[7] = y;

  return m;
}

export function multiply<T extends number[] | Float32Array>(a: T, b: Float32Array | number[]): T {
  const a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  const a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  const a20 = a[6],
    a21 = a[7],
    a22 = a[8];

  const b00 = b[0],
    b01 = b[1],
    b02 = b[2];
  const b10 = b[3],
    b11 = b[4],
    b12 = b[5];
  const b20 = b[6],
    b21 = b[7],
    b22 = b[8];

  a[0] = b00 * a00 + b01 * a10 + b02 * a20;
  a[1] = b00 * a01 + b01 * a11 + b02 * a21;
  a[2] = b00 * a02 + b01 * a12 + b02 * a22;

  a[3] = b10 * a00 + b11 * a10 + b12 * a20;
  a[4] = b10 * a01 + b11 * a11 + b12 * a21;
  a[5] = b10 * a02 + b11 * a12 + b12 * a22;

  a[6] = b20 * a00 + b21 * a10 + b22 * a20;
  a[7] = b20 * a01 + b21 * a11 + b22 * a21;
  a[8] = b20 * a02 + b21 * a12 + b22 * a22;

  return a;
}

export function multiplyVec2(a: Float32Array | number[], b: Coordinates, z = 1): Coordinates {
  const a00 = a[0];
  const a01 = a[1];
  const a10 = a[3];
  const a11 = a[4];
  const a20 = a[6];
  const a21 = a[7];

  const b0 = b.x;
  const b1 = b.y;

  return { x: b0 * a00 + b1 * a10 + a20 * z, y: b0 * a01 + b1 * a11 + a21 * z };
}
