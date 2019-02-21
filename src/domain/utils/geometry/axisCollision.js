import projection from "./projection";

/**
 * Check whether two rectangles collide on one particular axis.
 *
 * @param  {object}   An axis' coordinates (x, y).
 * @param  {array}    Rectangle A's corners.
 * @param  {array}    Rectangle B's corners.
 * @return {boolean}  True if the rectangles collide on the axis.
 */
export default function axisCollision(a, c1, c2) {
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
