/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 */

// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.

/**
 * Constants.
 *
 * Note that since we are reprenting a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
const BLOCKS = 6,
      MAX_LEVEL = 5;

const X_OFFSET = 0,
      Y_OFFSET = 1,
      WIDTH_OFFSET = 2,
      HEIGHT_OFFSET = 3,
      START_OFFSET = 4,
      END_OFFSET = 5;

/**
 * Geometry helpers.
 */
// function quadCollisions() {
//   let quads = 0; // 0b0000

//   const hw = width / 2,
//         hh = height / 2;

//   if (

//   ) {
//     quads |= (1 << 0);
//   }
// }

/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {
  let i = 0;

  const stack = [i, 0];

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

    data[topRightBlock + X_OFFSET] = hw;
    data[topRightBlock + Y_OFFSET] = y;
    data[topRightBlock + WIDTH_OFFSET] = hw;
    data[topRightBlock + HEIGHT_OFFSET] = hh;

    data[bottomLeftBlock + X_OFFSET] = x;
    data[bottomLeftBlock + Y_OFFSET] = hh;
    data[bottomLeftBlock + WIDTH_OFFSET] = hw;
    data[bottomLeftBlock + HEIGHT_OFFSET] = hh;

    data[bottomRightBlock + X_OFFSET] = hw;
    data[bottomRightBlock + Y_OFFSET] = hh;
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

/**
 * QuadTree class.
 *
 * @constructor
 * @param {Graph} graph - A graph instance.
 */
export default class QuadTree {
  constructor(graph, boundaries) {

    // Allocating the underlying byte array
    const L = Math.pow(4, MAX_LEVEL);

    this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
    this.pointers = [];

    // Building the quadrants
    this.data[X_OFFSET] = boundaries.x;
    this.data[Y_OFFSET] = boundaries.y;
    this.data[WIDTH_OFFSET] = boundaries.width;
    this.data[HEIGHT_OFFSET] = boundaries.height;

    buildQuadrants(MAX_LEVEL, this.data);
  }
}
