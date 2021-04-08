/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 * @module
 */
import Graph from "graphology";
import { Attributes } from "graphology-types";
import isGraph from "graphology-utils/is-graph";
import { CameraState, Coordinates, Extent, PlainObject } from "../types";
import { multiply, identity, scale, rotate, translate } from "./matrices";

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isPlainObject(value: any): boolean {
  return typeof value === "object" && value !== null && value.constructor === Object;
}

/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
export function assignDeep<T>(target: Partial<T> | undefined, ...objects: Array<Partial<T | undefined>>): T {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    const o = objects[i];

    if (!o) continue;

    for (const k in o) {
      if (isPlainObject(o[k])) {
        target[k] = assignDeep(target[k], o[k]);
      } else {
        target[k] = o[k];
      }
    }
  }

  return target as T;
}

/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
export const requestFrame =
  typeof requestAnimationFrame !== "undefined"
    ? (callback: FrameRequestCallback) => requestAnimationFrame(callback)
    : (callback: FrameRequestCallback) => setTimeout(callback, 0);
export const cancelFrame =
  typeof cancelAnimationFrame !== "undefined"
    ? (requestID: number) => cancelAnimationFrame(requestID)
    : (requestID: number) => clearTimeout(requestID);

/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
export function createElement<T extends HTMLElement>(
  tag: string,
  style?: Partial<CSSStyleDeclaration>,
  attributes?: PlainObject<string>,
): T {
  const element: T = document.createElement(tag) as T;

  if (style) {
    for (const k in style) {
      element.style[k] = style[k] as string;
    }
  }

  if (attributes) {
    for (const k in attributes) {
      element.setAttribute(k, attributes[k]);
    }
  }

  return element;
}

/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
export function getPixelRatio(): number {
  if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;

  return 1;
}

/**
 * Factory returning a function normalizing the given node's position & size.
 *
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
export interface NormalizationFunction {
  (data: Coordinates): Coordinates;
  inverse(data: Coordinates): Coordinates;
  applyTo(data: Coordinates): void;
}
export function createNormalizationFunction(extent: { x: Extent; y: Extent }): NormalizationFunction {
  const {
    x: [minX, maxX],
    y: [minY, maxY],
  } = extent;

  let ratio = Math.max(maxX - minX, maxY - minY);

  if (ratio === 0) ratio = 1;

  const dX = (maxX + minX) / 2,
    dY = (maxY + minY) / 2;

  const fn = (data: Coordinates): Coordinates => {
    return {
      x: 0.5 + (data.x - dX) / ratio,
      y: 0.5 + (data.y - dY) / ratio,
    };
  };

  // TODO: possibility to apply this in batch over array of indices
  fn.applyTo = (data: Coordinates): void => {
    data.x = 0.5 + (data.x - dX) / ratio;
    data.y = 0.5 + (data.y - dY) / ratio;
  };

  fn.inverse = (data: Coordinates): Coordinates => {
    return {
      x: dX + ratio * (data.x - 0.5),
      y: dY + ratio * (data.y - 0.5),
    };
  };

  fn.ratio = ratio;

  return fn;
}

/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
export function zIndexOrdering<T>(extent: [number, number], getter: (e: T) => number, elements: Array<T>): Array<T> {
  // If k is > n, we'll use a standard sort
  return elements.sort(function (a, b) {
    const zA = getter(a) || 0,
      zB = getter(b) || 0;

    if (zA < zB) return -1;
    if (zA > zB) return 1;

    return 0;
  });

  // TODO: counting sort optimization
}

/**
 * WebGL utils
 * ===========
 */

/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
const FLOAT_COLOR_CACHE: { [key: string]: number } = {};
const INT8 = new Int8Array(4);
const INT32 = new Int32Array(INT8.buffer, 0, 1);
const FLOAT32 = new Float32Array(INT8.buffer, 0, 1);

const RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
const RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;

export function floatColor(val: string): number {
  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];

  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  // Handling hexadecimal notation
  if (val[0] === "#") {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    } else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
  }

  // Handling rgb notation
  else if (RGBA_TEST_REGEX.test(val)) {
    const match = val.match(RGBA_EXTRACT_REGEX);
    if (match) {
      r = +match[1];
      g = +match[2];
      b = +match[3];

      if (match[4]) a = +match[4];
    }
  }

  a = (a * 255) | 0;

  INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;

  const color = FLOAT32[0];

  FLOAT_COLOR_CACHE[val] = color;

  return color;
}

/**
 * Function returning a matrix from the current state of the camera.
 */

// TODO: it's possible to optimize this drastically!
export function matrixFromCamera(state: CameraState, dimensions: { width: number; height: number }): Float32Array {
  const { angle, ratio, x, y } = state;

  const { width, height } = dimensions;

  const matrix = identity();

  const smallestDimension = Math.min(width, height);

  const cameraCentering = translate(identity(), -x, -y),
    cameraScaling = scale(identity(), 1 / ratio),
    cameraRotation = rotate(identity(), -angle),
    viewportScaling = scale(identity(), 2 * (smallestDimension / width), 2 * (smallestDimension / height));

  // Logical order is reversed
  multiply(matrix, viewportScaling);
  multiply(matrix, cameraRotation);
  multiply(matrix, cameraScaling);
  multiply(matrix, cameraCentering);

  return matrix;
}

/**
 * Function extracting the color at the given pixel.
 */
export function extractPixel(gl: WebGLRenderingContext, x: number, y: number, array: Uint8Array): Uint8Array {
  const data = array || new Uint8Array(4);

  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);

  return data;
}

/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
export function canUse32BitsIndices(gl: WebGLRenderingContext): boolean {
  const webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

  return webgl2 || !!gl.getExtension("OES_element_index_uint");
}

/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
export function validateGraph(graph: Graph): void {
  // check if it's a valid graphology instance
  if (!isGraph(graph)) throw new Error("Sigma: invalid graph instance.");

  // check if nodes have x/y attributes
  graph.forEachNode((key: string, attributes: Attributes) => {
    if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
      throw new Error(
        `Sigma: Coordinates of node ${key} are invalid. A node must have a numeric 'x' and 'y' attribute.`,
      );
    }
  });
}
