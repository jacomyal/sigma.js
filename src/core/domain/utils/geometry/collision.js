import axis from "./axis";
import axisCollision from "./axisCollision";

/**
 * Check whether two rectangles collide on each one of their four axis. If
 * all axis collide, then the two rectangles do collide on the plane.
 *
 * @param  {array}    Rectangle A's corners.
 * @param  {array}    Rectangle B's corners.
 * @return {boolean}  True if the rectangles collide.
 */
export default function collision(c1, c2) {
  const axs = axis(c1, c2);
  let col = true;

  for (let i = 0; i < 4; i++) {
    col = col && axisCollision(axs[i], c1, c2);
  }

  return col;
}
