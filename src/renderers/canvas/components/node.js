/**
 * Sigma.js Canvas Node Component
 * ===============================
 *
 * Simple function aiming at rendering nodes as a simple disc.
 */

/**
 * Node component.
 *
 * @param {CanvasRenderingContext2D} context - Context in which to draw.
 * @param {object}                   data    - Node's display data.
 */
export default function Node(context, data) {
  context.fillStyle = data.color;
  context.beginPath();
  context.arc(
    data.x,
    data.y,
    data.size,
    0,
    Math.PI * 2,
    true
  );

  context.closePath();
  context.fill();
}
