/**
 * Split a square defined by its boundaries into four.
 *
 * @param  {object} Boundaries of the square (x, y, width, height).
 * @return {array}  An array containing the four new squares, themselves
 *                  defined by an array of their four corners (x, y).
 */
export default function splitSquare(b) {
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
