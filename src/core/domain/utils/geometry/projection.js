/**
 * Project a rectangle's corner on an axis.
 *
 * @param  {object} Coordinates of a corner (x, y).
 * @param  {object} Coordinates of an axis (x, y).
 * @return {object} The projection defined by coordinates (x, y).
 */
export default function projection(c, a) {
  const l = (c.x * a.x + c.y * a.y) / (a.x ** 2 + a.y ** 2);

  return {
    x: l * a.x,
    y: l * a.y
  };
}
