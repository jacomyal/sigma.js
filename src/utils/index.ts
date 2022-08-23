/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 * @module
 */
import Graph, { Attributes } from "graphology-types";
import isGraph from "graphology-utils/is-graph";
import { CameraState, Coordinates, Dimensions, Extent, PlainObject } from "../types";
import { multiply, identity, scale, rotate, translate, multiplyVec2 } from "./matrices";
import { HTML_COLORS } from "./data";

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
 * Helper to use Object.assign with more than two objects.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
export function assign<T>(target: Partial<T> | undefined, ...objects: Array<Partial<T | undefined>>): T {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    const o = objects[i];

    if (!o) continue;

    Object.assign(target, o);
  }

  return target as T;
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
 * Function returning the graph's node extent in x & y.
 *
 * @param  {Graph}
 * @return {object}
 */
export function graphExtent(graph: Graph): { x: Extent; y: Extent } {
  if (!graph.order) return { x: [0, 1], y: [0, 1] };

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  graph.forEachNode((_, attr) => {
    const { x, y } = attr;

    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;

    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });

  return { x: [xMin, xMax], y: [yMin, yMax] };
}

/**
 * Factory returning a function normalizing the given node's position & size.
 *
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
export interface NormalizationFunction {
  (data: Coordinates): Coordinates;
  ratio: number;
  inverse(data: Coordinates): Coordinates;
  applyTo(data: Coordinates): void;
}
export function createNormalizationFunction(extent: { x: Extent; y: Extent }): NormalizationFunction {
  const {
    x: [minX, maxX],
    y: [minY, maxY],
  } = extent;

  let ratio = Math.max(maxX - minX, maxY - minY),
    dX = (maxX + minX) / 2,
    dY = (maxY + minY) / 2;

  if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio)) ratio = 1;
  if (isNaN(dX)) dX = 0;
  if (isNaN(dY)) dY = 0;

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
export function zIndexOrdering<T>(extent: Extent, getter: (e: T) => number, elements: Array<T>): Array<T> {
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
const INT8 = new Int8Array(4);
const INT32 = new Int32Array(INT8.buffer, 0, 1);
const FLOAT32 = new Float32Array(INT8.buffer, 0, 1);

const RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
const RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;

type RGBAColor = { r: number; g: number; b: number; a: number };

export function parseColor(val: string): RGBAColor {
  let r = 0; // byte
  let g = 0; // byte
  let b = 0; // byte
  let a = 1; // float

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
    if (val.length === 9) {
      a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
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

  return { r, g, b, a };
}

const FLOAT_COLOR_CACHE: { [key: string]: number } = {};
for (const htmlColor in HTML_COLORS) {
  FLOAT_COLOR_CACHE[htmlColor] = floatColor(HTML_COLORS[htmlColor]);
  // Replicating cache for hex values for free
  FLOAT_COLOR_CACHE[HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}

export function floatArrayColor(val: string): Float32Array {
  val = HTML_COLORS[val] || val;

  // NOTE: this variant is not cached because it is mostly used for uniforms
  const { r, g, b, a } = parseColor(val);

  return new Float32Array([r / 255, g / 255, b / 255, a]);
}

export function floatColor(val: string): number {
  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];

  const parsed = parseColor(val);
  const { r, g, b } = parsed;
  let { a } = parsed;

  a = (a * 255) | 0;

  INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;

  const color = FLOAT32[0];

  FLOAT_COLOR_CACHE[val] = color;

  return color;
}

/**
 * In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
 * helps dealing with quadtree in particular.
 * But at some point, we need to rescale it so that it takes the best place in the screen, ie. we always want to see two
 * nodes "touching" opposite sides of the graph, with the camera being at its default state.
 *
 * This function determines this ratio.
 */
export function getCorrectionRatio(
  viewportDimensions: { width: number; height: number },
  graphDimensions: { width: number; height: number },
): number {
  const viewportRatio = viewportDimensions.height / viewportDimensions.width;
  const graphRatio = graphDimensions.height / graphDimensions.width;

  // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
  // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
  if ((viewportRatio < 1 && graphRatio > 1) || (viewportRatio > 1 && graphRatio < 1)) {
    return 1;
  }

  // Else, we need to fit the graph inside the stage:
  // 1. If the graph is "squarer" (ie. with a ratio closer to 1), we need to make the largest sides touch;
  // 2. If the stage is "squarer", we need to make the smallest sides touch.
  return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}

/**
 * Function returning a matrix from the current state of the camera.
 */

// TODO: it's possible to optimize this drastically!
export function matrixFromCamera(
  state: CameraState,
  viewportDimensions: { width: number; height: number },
  graphDimensions: { width: number; height: number },
  padding: number,
  inverse?: boolean,
): Float32Array {
  const { angle, ratio, x, y } = state;

  const { width, height } = viewportDimensions;

  const matrix = identity();

  const smallestDimension = Math.min(width, height) - 2 * padding;

  const correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);

  if (!inverse) {
    multiply(
      matrix,
      scale(
        identity(),
        2 * (smallestDimension / width) * correctionRatio,
        2 * (smallestDimension / height) * correctionRatio,
      ),
    );
    multiply(matrix, rotate(identity(), -angle));
    multiply(matrix, scale(identity(), 1 / ratio));
    multiply(matrix, translate(identity(), -x, -y));
  } else {
    multiply(matrix, translate(identity(), x, y));
    multiply(matrix, scale(identity(), ratio));
    multiply(matrix, rotate(identity(), angle));
    multiply(
      matrix,
      scale(
        identity(),
        width / smallestDimension / 2 / correctionRatio,
        height / smallestDimension / 2 / correctionRatio,
      ),
    );
  }

  return matrix;
}

/**
 * All these transformations we apply on the matrix to get it rescale the graph
 * as we want make it very hard to get pixel-perfect distances in WebGL. This
 * function returns a factor that properly cancels the matrix effect on lengths.
 *
 * [jacomyal]
 * To be fully honest, I can't really explain happens here... I notice that the
 * following ratio works (ie. it correctly compensates the matrix impact on all
 * camera states I could try):
 * > `R = size(V) / size(M * V) / W`
 * as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
 * as well with H and a vector that transforms into something parallel to (Oy).
 *
 * Also, note that we use `angle` and not `-angle` (that would seem logical,
 * since we want to anticipate the rotation), because of the fact that in WebGL,
 * the image is vertically swapped.
 */
export function getMatrixImpact(
  matrix: Float32Array,
  cameraState: CameraState,
  viewportDimensions: Dimensions,
): number {
  const { x, y } = multiplyVec2(matrix, { x: Math.cos(cameraState.angle), y: Math.sin(cameraState.angle) }, 0);
  return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
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
