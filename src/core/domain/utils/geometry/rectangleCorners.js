import lowerLeftCoor from "./lowerLeftCoor";
import lowerRightCoor from "./lowerRightCoor";

/**
 * Get the coordinates of all the corners of a rectangle from its top point.
 *
 * @param  {object} A rectangle defined by two points (x1, y1) and (x2, y2).
 * @return {array}  An array of the four corners' coordinates (x, y).
 */
export default function rectangleCorners(r) {
  const llc = lowerLeftCoor(r);
  const lrc = lowerRightCoor(r, llc);

  return [
    { x: r.x1, y: r.y1 },
    { x: r.x2, y: r.y2 },
    { x: llc.x, y: llc.y },
    { x: lrc.x, y: lrc.y }
  ];
}
