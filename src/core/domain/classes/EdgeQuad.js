import getQuadraticControlPoint from "../utils/geometry/getQuadraticControlPoint";
import splitSquare from "../utils/geometry/splitSquare";
import collision from "../utils/geometry/collision";
import selfLoopToSquare from "../utils/geometry/selfLoopToSquare";
import quadraticCurveToSquare from "../utils/geometry/quadraticCurveToSquare";
import lineToSquare from "../utils/geometry/lineToSquare";
import isAxisAligned from "../utils/geometry/isAxisAligned";
import axisAlignedTopPoints from "../utils/geometry/axisAlignedTopPoints";
import rectangleCorners from "../utils/geometry/rectangleCorners";

/**
 * Sigma Quadtree Module for edges
 * ===============================
 *
 * Author: Sébastien Heymann,
 *   from the quad of Guillaume Plique (Yomguithereal)
 * Version: 0.2
 */

/**
 * Creates the quadtree object itself.
 *
 * @param  {object}   bounds       The boundaries of the quad defined by an
 *                                 origin (x, y), width and heigth.
 * @param  {integer}  level        The level of the quad in the tree.
 * @param  {integer}  maxElements  The max number of element in a leaf node.
 * @param  {integer}  maxLevel     The max recursion level of the tree.
 * @return {object}                The quadtree object.
 */
function _quadTree(bounds, level, maxElements, maxLevel) {
  return {
    level: level || 0,
    bounds,
    corners: splitSquare(bounds),
    maxElements: maxElements || 40,
    maxLevel: maxLevel || 8,
    elements: [],
    nodes: []
  };
}

/**
 * Quad Functions
 * ------------
 *
 * The Quadtree functions themselves.
 * For each of those functions, we consider that in a splitted quad, the
 * index of each node is the following:
 * 0: top left
 * 1: top right
 * 2: bottom left
 * 3: bottom right
 *
 * Moreover, the hereafter quad's philosophy is to consider that if an element
 * collides with more than one nodes, this element belongs to each of the
 * nodes it collides with where other would let it lie on a higher node.
 */

/**
 * Get the index of the node containing the point in the quad
 *
 * @param  {object}  point      A point defined by coordinates (x, y).
 * @param  {object}  quadBounds Boundaries of the quad (x, y, width, heigth).
 * @return {integer}            The index of the node containing the point.
 */
function _quadIndex(point, quadBounds) {
  const xmp = quadBounds.x + quadBounds.width / 2;
  const ymp = quadBounds.y + quadBounds.height / 2;
  const top = point.y < ymp;
  const left = point.x < xmp;

  if (top) {
    if (left) return 0;
    return 1;
  }
  if (left) return 2;
  return 3;
}

/**
 * Get a list of indexes of nodes containing an axis-aligned rectangle
 *
 * @param  {object}  rectangle   A rectangle defined by two points (x1, y1),
 *                               (x2, y2) and height.
 * @param  {array}   quadCorners An array of the quad nodes' corners.
 * @return {array}               An array of indexes containing one to
 *                               four integers.
 */
function _quadIndexes(rectangle, quadCorners) {
  const indexes = [];

  // Iterating through quads
  for (let i = 0; i < 4; i++)
    if (
      rectangle.x2 >= quadCorners[i][0].x &&
      rectangle.x1 <= quadCorners[i][1].x &&
      rectangle.y1 + rectangle.height >= quadCorners[i][0].y &&
      rectangle.y1 <= quadCorners[i][2].y
    )
      indexes.push(i);

  return indexes;
}

/**
 * Get a list of indexes of nodes containing a non-axis-aligned rectangle
 *
 * @param  {array}  corners      An array containing each corner of the
 *                               rectangle defined by its coordinates (x, y).
 * @param  {array}  quadCorners  An array of the quad nodes' corners.
 * @return {array}               An array of indexes containing one to
 *                               four integers.
 */
function _quadCollision(corners, quadCorners) {
  const indexes = [];

  // Iterating through quads
  for (let i = 0; i < 4; i++)
    if (collision(corners, quadCorners[i])) indexes.push(i);

  return indexes;
}

/**
 * Subdivide a quad by creating a node at a precise index. The function does
 * not generate all four nodes not to potentially create unused nodes.
 *
 * @param  {integer}  index The index of the node to create.
 * @param  {object}   quad  The quad object to subdivide.
 * @return {object}         A new quad representing the node created.
 */
function _quadSubdivide(index, quad) {
  const next = quad.level + 1;
  const subw = Math.round(quad.bounds.width / 2);
  const subh = Math.round(quad.bounds.height / 2);
  const qx = Math.round(quad.bounds.x);
  const qy = Math.round(quad.bounds.y);
  let x;
  let y;

  switch (index) {
    case 0:
      x = qx;
      y = qy;
      break;
    case 1:
      x = qx + subw;
      y = qy;
      break;
    case 2:
      x = qx;
      y = qy + subh;
      break;
    case 3:
      x = qx + subw;
      y = qy + subh;
      break;
    default:
      throw new Error(`invalid quad index ${index}`);
  }

  return _quadTree(
    { x, y, width: subw, height: subh },
    next,
    quad.maxElements,
    quad.maxLevel
  );
}

/**
 * Recursively insert an element into the quadtree. Only points
 * with size, i.e. axis-aligned squares, may be inserted with this
 * method.
 *
 * @param  {object}  el         The element to insert in the quadtree.
 * @param  {object}  sizedPoint A sized point defined by two top points
 *                              (x1, y1), (x2, y2) and height.
 * @param  {object}  quad       The quad in which to insert the element.
 * @return {undefined}          The function does not return anything.
 */
function _quadInsert(el, sizedPoint, quad) {
  if (quad.level < quad.maxLevel) {
    // Searching appropriate quads
    const indexes = _quadIndexes(sizedPoint, quad.corners);

    // Iterating
    for (let i = 0, l = indexes.length; i < l; i++) {
      // Subdividing if necessary
      if (quad.nodes[indexes[i]] === undefined)
        quad.nodes[indexes[i]] = _quadSubdivide(indexes[i], quad);

      // Recursion
      _quadInsert(el, sizedPoint, quad.nodes[indexes[i]]);
    }
  } else {
    // Pushing the element in a leaf node
    quad.elements.push(el);
  }
}

/**
 * Recursively retrieve every elements held by the node containing the
 * searched point.
 *
 * @param  {object}  point The searched point (x, y).
 * @param  {object}  quad  The searched quad.
 * @return {array}         An array of elements contained in the relevant
 *                         node.
 */
function _quadRetrievePoint(point, quad) {
  if (quad.level < quad.maxLevel) {
    const index = _quadIndex(point, quad.bounds);

    // If node does not exist we return an empty list
    if (quad.nodes[index] !== undefined) {
      return _quadRetrievePoint(point, quad.nodes[index]);
    }
    return [];
  }
  return quad.elements;
}

/**
 * Recursively retrieve every elements contained within an rectangular area
 * that may or may not be axis-aligned.
 *
 * @param  {object|array} rectData       The searched area defined either by
 *                                       an array of four corners (x, y) in
 *                                       the case of a non-axis-aligned
 *                                       rectangle or an object with two top
 *                                       points (x1, y1), (x2, y2) and height.
 * @param  {object}       quad           The searched quad.
 * @param  {function}     collisionFunc  The collision function used to search
 *                                       for node indexes.
 * @param  {array?}       els            The retrieved elements.
 * @return {array}                       An array of elements contained in the
 *                                       area.
 */
function _quadRetrieveArea(rectData, quad, collisionFunc, els) {
  els = els || {};

  if (quad.level < quad.maxLevel) {
    const indexes = collisionFunc(rectData, quad.corners);

    for (let i = 0, l = indexes.length; i < l; i++)
      if (quad.nodes[indexes[i]] !== undefined)
        _quadRetrieveArea(rectData, quad.nodes[indexes[i]], collisionFunc, els);
  } else
    for (let j = 0, m = quad.elements.length; j < m; j++)
      if (els[quad.elements[j].id] === undefined)
        els[quad.elements[j].id] = quad.elements[j];

  return els;
}
/**
 * Sigma Quad Constructor
 * ----------------------
 *
 * The edgequad API as exposed to sigma
 */

/**
 * The edgequad core that will become the sigma interface with the quadtree.
 *
 * property {object} _tree     Property holding the quadtree object.
 * property {object} _cache    Cache for the area method.
 * property {boolean} _enabled Can index and retreive elements.
 */
export default function EdgeQuad() {
  this._tree = null;
  this._cache = {
    query: false,
    result: false
  };
  this._enabled = true;
}

/**
 * Index a graph by inserting its edges into the quadtree.
 *
 * @param  {object} graph   A graph instance.
 * @param  {object} params  An object of parameters with at least the quad
 *                          bounds.
 * @return {object}         The quadtree object.
 *
 * Parameters:
 * ----------
 * bounds:      {object}   boundaries of the quad defined by its origin (x, y)
 *                         width and heigth.
 * prefix:      {string?}  a prefix for edge geometric attributes.
 * maxElements: {integer?} the max number of elements in a leaf node.
 * maxLevel:    {integer?} the max recursion level of the tree.
 */
EdgeQuad.prototype.index = function index(graph, params) {
  if (!this._enabled) return this._tree;

  // Enforcing presence of boundaries
  if (!params.bounds)
    throw new Error("EdgeQuad.index: bounds information not given.");

  // Prefix
  const prefix = params.prefix || "";
  let cp;
  let source;
  let target;
  let n;
  let e;

  // Building the tree
  this._tree = _quadTree(params.bounds, 0, params.maxElements, params.maxLevel);

  const edges = graph.edges();

  // Inserting graph edges into the tree
  for (let i = 0, l = edges.length; i < l; i++) {
    source = graph.nodes(edges[i].source);
    target = graph.nodes(edges[i].target);
    e = {
      x1: source[`${prefix}x`],
      y1: source[`${prefix}y`],
      x2: target[`${prefix}x`],
      y2: target[`${prefix}y`],
      size: edges[i][`${prefix}size`] || 0
    };

    // Inserting edge
    if (edges[i].type === "curve" || edges[i].type === "curvedArrow") {
      if (source.id === target.id) {
        n = {
          x: source[`${prefix}x`],
          y: source[`${prefix}y`],
          size: source[`${prefix}size`] || 0
        };
        _quadInsert(edges[i], selfLoopToSquare(n), this._tree);
      } else {
        cp = getQuadraticControlPoint(e.x1, e.y1, e.x2, e.y2);
        _quadInsert(edges[i], quadraticCurveToSquare(e, cp), this._tree);
      }
    } else {
      _quadInsert(edges[i], lineToSquare(e), this._tree);
    }
  }

  // Reset cache:
  this._cache = {
    query: false,
    result: false
  };

  // remove?
  return this._tree;
};

/**
 * Retrieve every graph edges held by the quadtree node containing the
 * searched point.
 *
 * @param  {number} x of the point.
 * @param  {number} y of the point.
 * @return {array}  An array of edges retrieved.
 */
EdgeQuad.prototype.point = function point(x, y) {
  if (!this._enabled) return [];

  return this._tree ? _quadRetrievePoint({ x, y }, this._tree) || [] : [];
};

/**
 * Retrieve every graph edges within a rectangular area. The methods keep the
 * last area queried in cache for optimization reason and will act differently
 * for the same reason if the area is axis-aligned or not.
 *
 * @param  {object} A rectangle defined by two top points (x1, y1), (x2, y2)
 *                  and height.
 * @return {array}  An array of edges retrieved.
 */
EdgeQuad.prototype.area = function area(rect) {
  if (!this._enabled) return [];

  const serialized = JSON.stringify(rect);
  let collisionFunc;
  let rectData;

  // Returning cache?
  if (this._cache.query === serialized) return this._cache.result;

  // Axis aligned ?
  if (isAxisAligned(rect)) {
    collisionFunc = _quadIndexes;
    rectData = axisAlignedTopPoints(rect);
  } else {
    collisionFunc = _quadCollision;
    rectData = rectangleCorners(rect);
  }

  // Retrieving edges
  const edges = this._tree
    ? _quadRetrieveArea(rectData, this._tree, collisionFunc)
    : [];

  // Object to array
  const edgesArray = Object.keys(edges).map(e => edges[e]);

  // Caching
  this._cache.query = serialized;
  this._cache.result = edgesArray;

  return edgesArray;
};
