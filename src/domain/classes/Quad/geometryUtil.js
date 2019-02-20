/**
 * Quad Geometric Operations
 * -------------------------
 *
 * A useful batch of geometric operations used by the quadtree.
 */

/**
 * Transforms a graph node with x, y and size into an
 * axis-aligned square.
 *
 * @param  {object} A graph node with at least a point (x, y) and a size.
 * @return {object} A square: two points (x1, y1), (x2, y2) and height.
 */
export function pointToSquare(n) {
  return {
    x1: n.x - n.size,
    y1: n.y - n.size,
    x2: n.x + n.size,
    y2: n.y - n.size,
    height: n.size * 2
  };
}

/**
 * Checks whether a rectangle is axis-aligned.
 *
 * @param  {object}  A rectangle defined by two points
 *                   (x1, y1) and (x2, y2).
 * @return {boolean} True if the rectangle is axis-aligned.
 */
export function isAxisAligned(r) {
  return r.x1 === r.x2 || r.y1 === r.y2;
}

/**
 * Compute top points of an axis-aligned rectangle. This is useful in
 * cases when the rectangle has been rotated (left, right or bottom up) and
 * later operations need to know the top points.
 *
 * @param  {object} An axis-aligned rectangle defined by two points
 *                  (x1, y1), (x2, y2) and height.
 * @return {object} A rectangle: two points (x1, y1), (x2, y2) and height.
 */
export function axisAlignedTopPoints(r) {
  // Basic
  if (r.y1 === r.y2 && r.x1 < r.x2) return r;

  // Rotated to right
  if (r.x1 === r.x2 && r.y2 > r.y1)
    return {
      x1: r.x1 - r.height,
      y1: r.y1,
      x2: r.x1,
      y2: r.y1,
      height: r.height
    };

  // Rotated to left
  if (r.x1 === r.x2 && r.y2 < r.y1)
    return {
      x1: r.x1,
      y1: r.y2,
      x2: r.x2 + r.height,
      y2: r.y2,
      height: r.height
    };

  // Bottom's up
  return {
    x1: r.x2,
    y1: r.y1 - r.height,
    x2: r.x1,
    y2: r.y1 - r.height,
    height: r.height
  };
}

/**
 * Get coordinates of a rectangle's lower left corner from its top points.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @return {object} Coordinates of the corner (x, y).
 */
export function lowerLeftCoor(r) {
  const width = Math.sqrt((r.x2 - r.x1) ** 2 + (r.y2 - r.y1) ** 2);
  return {
    x: r.x1 - ((r.y2 - r.y1) * r.height) / width,
    y: r.y1 + ((r.x2 - r.x1) * r.height) / width
  };
}

/**
 * Get coordinates of a rectangle's lower right corner from its top points
 * and its lower left corner.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @param  {object} A corner's coordinates (x, y).
 * @return {object} Coordinates of the corner (x, y).
 */
export function lowerRightCoor(r, llc) {
  return {
    x: llc.x - r.x1 + r.x2,
    y: llc.y - r.y1 + r.y2
  };
}

/**
 * Get the coordinates of all the corners of a rectangle from its top point.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @return {array}  An array of the four corners' coordinates (x, y).
 */
export function rectangleCorners(r) {
  const llc = lowerLeftCoor(r);
  const lrc = lowerRightCoor(r, llc);

  return [
    { x: r.x1, y: r.y1 },
    { x: r.x2, y: r.y2 },
    { x: llc.x, y: llc.y },
    { x: lrc.x, y: lrc.y }
  ];
}

/**
 * Split a square defined by its boundaries into four.
 *
 * @param  {object} Boundaries of the square (x, y, width, height).
 * @return {array}  An array containing the four new squares, themselves
 *                  defined by an array of their four corners (x, y).
 */
export function splitSquare(b) {
  return [
    [
      { x: b.x, y: b.y },
      { x: b.x + b.width / 2, y: b.y },
      { x: b.x, y: b.y + b.height / 2 },
      { x: b.x + b.width / 2, y: b.y + b.height / 2 }
    ],
    [
      { x: b.x + b.width / 2, y: b.y },
      { x: b.x + b.width, y: b.y },
      { x: b.x + b.width / 2, y: b.y + b.height / 2 },
      { x: b.x + b.width, y: b.y + b.height / 2 }
    ],
    [
      { x: b.x, y: b.y + b.height / 2 },
      { x: b.x + b.width / 2, y: b.y + b.height / 2 },
      { x: b.x, y: b.y + b.height },
      { x: b.x + b.width / 2, y: b.y + b.height }
    ],
    [
      { x: b.x + b.width / 2, y: b.y + b.height / 2 },
      { x: b.x + b.width, y: b.y + b.height / 2 },
      { x: b.x + b.width / 2, y: b.y + b.height },
      { x: b.x + b.width, y: b.y + b.height }
    ]
  ];
}

/**
 * Compute the four axis between corners of rectangle A and corners of
 * rectangle B. This is needed later to check an eventual collision.
 *
 * @param  {array} An array of rectangle A's four corners (x, y).
 * @param  {array} An array of rectangle B's four corners (x, y).
 * @return {array} An array of four axis defined by their coordinates (x,y).
 */
export function axis(c1, c2) {
  return [
    { x: c1[1].x - c1[0].x, y: c1[1].y - c1[0].y },
    { x: c1[1].x - c1[3].x, y: c1[1].y - c1[3].y },
    { x: c2[0].x - c2[2].x, y: c2[0].y - c2[2].y },
    { x: c2[0].x - c2[1].x, y: c2[0].y - c2[1].y }
  ];
}

/**
 * Project a rectangle's corner on an axis.
 *
 * @param  {object} Coordinates of a corner (x, y).
 * @param  {object} Coordinates of an axis (x, y).
 * @return {object} The projection defined by coordinates (x, y).
 */
export function projection(c, a) {
  const l = (c.x * a.x + c.y * a.y) / (a.x ** 2 + a.y ** 2);

  return {
    x: l * a.x,
    y: l * a.y
  };
}

/**
 * Check whether two rectangles collide on one particular axis.
 *
 * @param  {object}   An axis' coordinates (x, y).
 * @param  {array}    Rectangle A's corners.
 * @param  {array}    Rectangle B's corners.
 * @return {boolean}  True if the rectangles collide on the axis.
 */
export function axisCollision(a, c1, c2) {
  const sc1 = [];
  const sc2 = [];

  for (let ci = 0; ci < 4; ci++) {
    const p1 = projection(c1[ci], a);
    const p2 = projection(c2[ci], a);
    sc1.push(p1.x * a.x + p1.y * a.y);
    sc2.push(p2.x * a.x + p2.y * a.y);
  }

  const maxc1 = Math.max(...sc1);
  const maxc2 = Math.max(...sc2);
  const minc1 = Math.min(...sc1);
  const minc2 = Math.min(...sc2);
  return minc2 <= maxc1 && maxc2 >= minc1;
}

/**
 * Check whether two rectangles collide on each one of their four axis. If
 * all axis collide, then the two rectangles do collide on the plane.
 *
 * @param  {array}    Rectangle A's corners.
 * @param  {array}    Rectangle B's corners.
 * @return {boolean}  True if the rectangles collide.
 */
export function collision(c1, c2) {
  const axs = axis(c1, c2);
  let col = true;

  for (let i = 0; i < 4; i++) col = col && axisCollision(axs[i], c1, c2);

  return col;
}
