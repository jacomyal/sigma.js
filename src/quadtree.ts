/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 */
import extend from "@yomguithereal/helpers/extend";

// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.

// TODO: a square can be represented as topleft + width, saying for the quad blocks (reduce mem)

// TODO: jsdoc

// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size

// TODO: filtering unwanted labels beforehand through the filter function

// NOTE: this is basically a MX-CIF Quadtree at this point
// NOTE: need to explore R-Trees for edges
// NOTE: need to explore 2d segment tree for edges

// NOTE: probably can do faster using spatial hashing

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
const BLOCKS = 4,
  MAX_LEVEL = 5;

const X_OFFSET = 0,
  Y_OFFSET = 1,
  WIDTH_OFFSET = 2,
  HEIGHT_OFFSET = 3;

const TOP_LEFT = 1,
  TOP_RIGHT = 2,
  BOTTOM_LEFT = 3,
  BOTTOM_RIGHT = 4;

/**
 * Geometry helpers.
 */

/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @return {boolean}
 */
function isAxisAligned(x1: number, y1: number, x2: number, y2: number): boolean {
  return x1 === x2 || y1 === y2;
}

function squareCollidesWithQuad(
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

function rectangleCollidesWithQuad(
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
function buildQuadrants(maxLevel, data) {
  // [block, level]
  const stack = [0, 0];

  while (stack.length) {
    const level = stack.pop(),
      block = stack.pop();

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

function insertNode(maxLevel, data, containers, key, x, y, size) {
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

    // If we don't have at least a collision, there is an issue
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
      // NOTE: this is a nice way to optimize for hover, but not for frustum
      // since it requires to uniq the collected nodes
      // if (collisions < 4) {

      //   // If we intersect two quads, we place the node in those two
      //   if (collidingWithTopLeft) {
      //     containers[topLeftBlock] = containers[topLeftBlock] || [];
      //     containers[topLeftBlock].push(key);
      //   }
      //   if (collidingWithTopRight) {
      //     containers[topRightBlock] = containers[topRightBlock] || [];
      //     containers[topRightBlock].push(key);
      //   }
      //   if (collidingWithBottomLeft) {
      //     containers[bottomLeftBlock] = containers[bottomLeftBlock] || [];
      //     containers[bottomLeftBlock].push(key);
      //   }
      //   if (collidingWithBottomRight) {
      //     containers[bottomRightBlock] = containers[bottomRightBlock] || [];
      //     containers[bottomRightBlock].push(key);
      //   }
      // }
      // else {

      //   // Else we keep the node where it is to avoid more pointless computations
      //   containers[block] = containers[block] || [];
      //   containers[block].push(key);
      // }

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

function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {
  // [block, level]
  const stack = [0, 0];

  const collectedNodes = [];

  let container;

  while (stack.length) {
    const level = stack.pop(),
      block = stack.pop();

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
  containers: any = {};
  cache: any = null;
  lastRectangle: any = null;
  nodeFilter: any;

  constructor(params: { [key: string]: any } = {}) {
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

    if (typeof params.filter === "function") this.nodeFilter = params.filter;
  }

  add(key: any, x: number, y: number, size: number) {
    insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);

    return this;
  }

  resize(boundaries: { x: number; y: number; width: number; height: number }) {
    this.clear();

    // Building the quadrants
    this.data[X_OFFSET] = boundaries.x;
    this.data[Y_OFFSET] = boundaries.y;
    this.data[WIDTH_OFFSET] = boundaries.width;
    this.data[HEIGHT_OFFSET] = boundaries.height;

    buildQuadrants(MAX_LEVEL, this.data);
  }

  clear() {
    this.containers = {};

    return this;
  }

  point(x: number, y: number) {
    const nodes = [];

    let block = 0,
      level = 0;

    do {
      if (this.containers[block]) nodes.push.apply(nodes, this.containers[block]);

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

  rectangle(x1: number, y1: number, x2: number, y2: number, height: number) {
    const lr = this.lastRectangle;

    if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
      return this.cache;
    }

    this.lastRectangle = {
      x1,
      y1,
      x2,
      y2,
      height,
    };

    // Is the rectangle axis aligned?
    if (!isAxisAligned(x1, y1, x2, y2))
      throw new Error("sigma/quadtree.rectangle: shifted view is not yet implemented.");

    const collectedNodes = getNodesInAxisAlignedRectangleArea(
      MAX_LEVEL,
      this.data,
      this.containers,
      x1,
      y1,
      Math.abs(x1 - x2) || Math.abs(y1 - y2),
      height,
    );

    this.cache = collectedNodes;

    return this.cache;
  }
}
