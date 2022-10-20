/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 * @module
 */
/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
import extend from "@yomguithereal/helpers/extend";

/**
 * Notes:
 *
 *   - a square can be represented as topleft + width, saying for the quad blocks,
 *     to reduce overall memory usage (which is already pretty low).
 *   - this implementation of a quadtree is often called a MX-CIF quadtree.
 *   - we could explore spatial hashing (hilbert quadtrees, notably).
 */

/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
const BLOCKS = 4;
const MAX_LEVEL = 5;

// Outside block is max block index + 1, i.e.:
// BLOCKS * ((4 * (4 ** MAX_LEVEL) - 1) / 3)
const OUTSIDE_BLOCK = 5460;

const X_OFFSET = 0;
const Y_OFFSET = 1;
const WIDTH_OFFSET = 2;
const HEIGHT_OFFSET = 3;

const TOP_LEFT = 1;
const TOP_RIGHT = 2;
const BOTTOM_LEFT = 3;
const BOTTOM_RIGHT = 4;

let hasWarnedTooMuchOutside = false;

export interface Boundaries {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

/**
 * Geometry helpers.
 */

/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {Rectangle} rect
 * @return {boolean}
 */
export function isRectangleAligned(rect: Rectangle): boolean {
  return rect.x1 === rect.x2 || rect.y1 === rect.y2;
}

/**
 * Function returning the smallest rectangle that contains the given rectangle, and that is aligned with the axis.
 *
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
export function getCircumscribedAlignedRectangle(rect: Rectangle): Rectangle {
  const width = Math.sqrt(Math.pow(rect.x2 - rect.x1, 2) + Math.pow(rect.y2 - rect.y1, 2));
  const heightVector = {
    x: ((rect.y1 - rect.y2) * rect.height) / width,
    y: ((rect.x2 - rect.x1) * rect.height) / width,
  };

  // Compute all corners:
  const tl: Vector = { x: rect.x1, y: rect.y1 };
  const tr: Vector = { x: rect.x2, y: rect.y2 };
  const bl: Vector = {
    x: rect.x1 + heightVector.x,
    y: rect.y1 + heightVector.y,
  };
  const br: Vector = {
    x: rect.x2 + heightVector.x,
    y: rect.y2 + heightVector.y,
  };

  const xL = Math.min(tl.x, tr.x, bl.x, br.x);
  const xR = Math.max(tl.x, tr.x, bl.x, br.x);
  const yT = Math.min(tl.y, tr.y, bl.y, br.y);
  const yB = Math.max(tl.y, tr.y, bl.y, br.y);

  return {
    x1: xL,
    y1: yT,
    x2: xR,
    y2: yT,
    height: yB - yT,
  };
}

/**
 *
 * @param x1
 * @param y1
 * @param w
 * @param qx
 * @param qy
 * @param qw
 * @param qh
 */
export function squareCollidesWithQuad(
  x1: number,
  y1: number,
  w: number,
  qx: number,
  qy: number,
  qw: number,
  qh: number,
): boolean {
  return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}

export function rectangleCollidesWithQuad(
  x1: number,
  y1: number,
  w: number,
  h: number,
  qx: number,
  qy: number,
  qw: number,
  qh: number,
): boolean {
  return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}

function pointIsInQuad(x: number, y: number, qx: number, qy: number, qw: number, qh: number): number {
  const xmp = qx + qw / 2,
    ymp = qy + qh / 2,
    top = y < ymp,
    left = x < xmp;

  return top ? (left ? TOP_LEFT : TOP_RIGHT) : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}

/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel: number, data: Float32Array): void {
  // [block, level]
  const stack: Array<number> = [0, 0];

  while (stack.length) {
    const level = stack.pop() as number,
      block = stack.pop() as number;

    const topLeftBlock = 4 * block + BLOCKS,
      topRightBlock = 4 * block + 2 * BLOCKS,
      bottomLeftBlock = 4 * block + 3 * BLOCKS,
      bottomRightBlock = 4 * block + 4 * BLOCKS;

    const x = data[block + X_OFFSET],
      y = data[block + Y_OFFSET],
      width = data[block + WIDTH_OFFSET],
      height = data[block + HEIGHT_OFFSET],
      hw = width / 2,
      hh = height / 2;

    data[topLeftBlock + X_OFFSET] = x;
    data[topLeftBlock + Y_OFFSET] = y;
    data[topLeftBlock + WIDTH_OFFSET] = hw;
    data[topLeftBlock + HEIGHT_OFFSET] = hh;

    data[topRightBlock + X_OFFSET] = x + hw;
    data[topRightBlock + Y_OFFSET] = y;
    data[topRightBlock + WIDTH_OFFSET] = hw;
    data[topRightBlock + HEIGHT_OFFSET] = hh;

    data[bottomLeftBlock + X_OFFSET] = x;
    data[bottomLeftBlock + Y_OFFSET] = y + hh;
    data[bottomLeftBlock + WIDTH_OFFSET] = hw;
    data[bottomLeftBlock + HEIGHT_OFFSET] = hh;

    data[bottomRightBlock + X_OFFSET] = x + hw;
    data[bottomRightBlock + Y_OFFSET] = y + hh;
    data[bottomRightBlock + WIDTH_OFFSET] = hw;
    data[bottomRightBlock + HEIGHT_OFFSET] = hh;

    if (level < maxLevel - 1) {
      stack.push(bottomRightBlock, level + 1);
      stack.push(bottomLeftBlock, level + 1);
      stack.push(topRightBlock, level + 1);
      stack.push(topLeftBlock, level + 1);
    }
  }
}

function insertNode(
  maxLevel: number,
  data: Float32Array,
  containers: Record<number, string[]>,
  key: string,
  x: number,
  y: number,
  size: number,
) {
  const x1 = x - size,
    y1 = y - size,
    w = size * 2;

  let level = 0,
    block = 0;

  while (true) {
    // If we reached max level
    if (level >= maxLevel) {
      containers[block] = containers[block] || [];
      containers[block].push(key);
      return;
    }

    const topLeftBlock = 4 * block + BLOCKS,
      topRightBlock = 4 * block + 2 * BLOCKS,
      bottomLeftBlock = 4 * block + 3 * BLOCKS,
      bottomRightBlock = 4 * block + 4 * BLOCKS;

    const collidingWithTopLeft = squareCollidesWithQuad(
      x1,
      y1,
      w,
      data[topLeftBlock + X_OFFSET],
      data[topLeftBlock + Y_OFFSET],
      data[topLeftBlock + WIDTH_OFFSET],
      data[topLeftBlock + HEIGHT_OFFSET],
    );

    const collidingWithTopRight = squareCollidesWithQuad(
      x1,
      y1,
      w,
      data[topRightBlock + X_OFFSET],
      data[topRightBlock + Y_OFFSET],
      data[topRightBlock + WIDTH_OFFSET],
      data[topRightBlock + HEIGHT_OFFSET],
    );

    const collidingWithBottomLeft = squareCollidesWithQuad(
      x1,
      y1,
      w,
      data[bottomLeftBlock + X_OFFSET],
      data[bottomLeftBlock + Y_OFFSET],
      data[bottomLeftBlock + WIDTH_OFFSET],
      data[bottomLeftBlock + HEIGHT_OFFSET],
    );

    const collidingWithBottomRight = squareCollidesWithQuad(
      x1,
      y1,
      w,
      data[bottomRightBlock + X_OFFSET],
      data[bottomRightBlock + Y_OFFSET],
      data[bottomRightBlock + WIDTH_OFFSET],
      data[bottomRightBlock + HEIGHT_OFFSET],
    );

    const collisions: number = [
      collidingWithTopLeft,
      collidingWithTopRight,
      collidingWithBottomLeft,
      collidingWithBottomRight,
    ].reduce((acc: number, current: boolean) => {
      if (current) return acc + 1;
      else return acc;
    }, 0);

    // If we have no collision at root level, inject node in the outside block
    if (collisions === 0 && level === 0) {
      containers[OUTSIDE_BLOCK].push(key);

      if (!hasWarnedTooMuchOutside && containers[OUTSIDE_BLOCK].length >= 5) {
        hasWarnedTooMuchOutside = true;
        console.warn(
          "sigma/quadtree.insertNode: At least 5 nodes are outside the global quadtree zone. " +
            "You might have a problem with the normalization function or the custom bounding box.",
        );
      }

      return;
    }

    // If we don't have at least a collision but deeper, there is an issue
    if (collisions === 0)
      throw new Error(
        `sigma/quadtree.insertNode: no collision (level: ${level}, key: ${key}, x: ${x}, y: ${y}, size: ${size}).`,
      );

    // If we have 3 collisions, we have a geometry problem obviously
    if (collisions === 3)
      throw new Error(
        `sigma/quadtree.insertNode: 3 impossible collisions (level: ${level}, key: ${key}, x: ${x}, y: ${y}, size: ${size}).`,
      );

    // If we have more that one collision, we stop here and store the node
    // in the relevant containers
    if (collisions > 1) {
      containers[block] = containers[block] || [];
      containers[block].push(key);

      return;
    } else {
      level++;
    }

    // Else we recurse into the correct quads
    if (collidingWithTopLeft) block = topLeftBlock;

    if (collidingWithTopRight) block = topRightBlock;

    if (collidingWithBottomLeft) block = bottomLeftBlock;

    if (collidingWithBottomRight) block = bottomRightBlock;
  }
}

function getNodesInAxisAlignedRectangleArea(
  maxLevel: number,
  data: Float32Array,
  containers: Record<number, string[]>,
  x1: number,
  y1: number,
  w: number,
  h: number,
): string[] {
  // [block, level]
  const stack = [0, 0];

  const collectedNodes: string[] = [];

  let container;

  while (stack.length) {
    const level = stack.pop() as number,
      block = stack.pop() as number;

    // Collecting nodes
    container = containers[block];

    if (container) extend(collectedNodes, container);

    // If we reached max level
    if (level >= maxLevel) continue;

    const topLeftBlock = 4 * block + BLOCKS,
      topRightBlock = 4 * block + 2 * BLOCKS,
      bottomLeftBlock = 4 * block + 3 * BLOCKS,
      bottomRightBlock = 4 * block + 4 * BLOCKS;

    const collidingWithTopLeft = rectangleCollidesWithQuad(
      x1,
      y1,
      w,
      h,
      data[topLeftBlock + X_OFFSET],
      data[topLeftBlock + Y_OFFSET],
      data[topLeftBlock + WIDTH_OFFSET],
      data[topLeftBlock + HEIGHT_OFFSET],
    );

    const collidingWithTopRight = rectangleCollidesWithQuad(
      x1,
      y1,
      w,
      h,
      data[topRightBlock + X_OFFSET],
      data[topRightBlock + Y_OFFSET],
      data[topRightBlock + WIDTH_OFFSET],
      data[topRightBlock + HEIGHT_OFFSET],
    );

    const collidingWithBottomLeft = rectangleCollidesWithQuad(
      x1,
      y1,
      w,
      h,
      data[bottomLeftBlock + X_OFFSET],
      data[bottomLeftBlock + Y_OFFSET],
      data[bottomLeftBlock + WIDTH_OFFSET],
      data[bottomLeftBlock + HEIGHT_OFFSET],
    );

    const collidingWithBottomRight = rectangleCollidesWithQuad(
      x1,
      y1,
      w,
      h,
      data[bottomRightBlock + X_OFFSET],
      data[bottomRightBlock + Y_OFFSET],
      data[bottomRightBlock + WIDTH_OFFSET],
      data[bottomRightBlock + HEIGHT_OFFSET],
    );

    if (collidingWithTopLeft) stack.push(topLeftBlock, level + 1);

    if (collidingWithTopRight) stack.push(topRightBlock, level + 1);

    if (collidingWithBottomLeft) stack.push(bottomLeftBlock, level + 1);

    if (collidingWithBottomRight) stack.push(bottomRightBlock, level + 1);
  }

  return collectedNodes;
}

/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */
export default class QuadTree {
  data: Float32Array;
  containers: Record<number, string[]> = { [OUTSIDE_BLOCK]: [] };
  cache: string[] | null = null;
  lastRectangle: Rectangle | null = null;

  constructor(params: { boundaries?: Boundaries } = {}) {
    // Allocating the underlying byte array
    const L = Math.pow(4, MAX_LEVEL);
    this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));

    if (params.boundaries) this.resize(params.boundaries);
    else
      this.resize({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      });
  }

  add(key: string, x: number, y: number, size: number): QuadTree {
    insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);

    return this;
  }

  resize(boundaries: Boundaries): void {
    this.clear();

    // Building the quadrants
    this.data[X_OFFSET] = boundaries.x;
    this.data[Y_OFFSET] = boundaries.y;
    this.data[WIDTH_OFFSET] = boundaries.width;
    this.data[HEIGHT_OFFSET] = boundaries.height;

    buildQuadrants(MAX_LEVEL, this.data);
  }

  clear(): QuadTree {
    this.containers = { [OUTSIDE_BLOCK]: [] };

    return this;
  }

  point(x: number, y: number): string[] {
    const nodes = this.containers[OUTSIDE_BLOCK].slice();

    let block = 0,
      level = 0;

    do {
      if (this.containers[block]) extend(nodes, this.containers[block]);

      const quad = pointIsInQuad(
        x,
        y,
        this.data[block + X_OFFSET],
        this.data[block + Y_OFFSET],
        this.data[block + WIDTH_OFFSET],
        this.data[block + HEIGHT_OFFSET],
      );

      block = 4 * block + quad * BLOCKS;
      level++;
    } while (level <= MAX_LEVEL);

    return nodes;
  }

  rectangle(x1: number, y1: number, x2: number, y2: number, height: number): string[] {
    const lr = this.lastRectangle;

    if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
      return this.cache as string[];
    }

    this.lastRectangle = {
      x1,
      y1,
      x2,
      y2,
      height,
    };

    // If the rectangle is shifted, we use the smallest aligned rectangle that contains the shifted one:
    if (!isRectangleAligned(this.lastRectangle))
      this.lastRectangle = getCircumscribedAlignedRectangle(this.lastRectangle);

    this.cache = getNodesInAxisAlignedRectangleArea(
      MAX_LEVEL,
      this.data,
      this.containers,
      x1,
      y1,
      Math.abs(x1 - x2) || Math.abs(y1 - y2),
      height,
    );

    // Add all the nodes in the outside block, since they might be relevant, and since they should be very few:
    extend(this.cache, this.containers[OUTSIDE_BLOCK]);

    return this.cache;
  }
}
