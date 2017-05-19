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
 */
const BLOCKS = 4,
      MAX_LEVEL = 5;

const X_OFFSET = 0,
      Y_OFFSET = 1,
      WIDTH_OFFSET = 2,
      HEIGHT_OFFSET = 3;

/**
 * Geometry helpers.
 */
function pointToSquare(point) {
  return {
    x1: point.x - point.size,
    y1: point.y - point.size,
    x2: point.x + point.size,
    y2: point.y - point.size,
    height: point.size * 2
  };
}

/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function insert(key) {

}

/**
 * QuadTree class.
 *
 * @constructor
 * @param {array} nodes - Nodes to index represented as an array of sized points.
 */
export default class QuadTree {
  constructor(graph) {

    // Allocating the underlying byte array
    this.data = new Float32Array(BLOCKS * Math.pow(MAX_LEVEL, 4));
  }
}
