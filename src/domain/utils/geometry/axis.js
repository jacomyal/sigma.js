/**
 * Compute the four axis between corners of rectangle A and corners of
 * rectangle B. This is needed later to check an eventual collision.
 *
 * @param  {array} An array of rectangle A's four corners (x, y).
 * @param  {array} An array of rectangle B's four corners (x, y).
 * @return {array} An array of four axis defined by their coordinates (x,y).
 */
export default function axis(c1, c2) {
  return [
    { x: c1[1].x - c1[0].x, y: c1[1].y - c1[0].y },
    { x: c1[1].x - c1[3].x, y: c1[1].y - c1[3].y },
    { x: c2[0].x - c2[2].x, y: c2[0].y - c2[2].y },
    { x: c2[0].x - c2[1].x, y: c2[0].y - c2[1].y }
  ];
}
