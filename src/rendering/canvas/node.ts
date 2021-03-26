/**
 * Sigma.js Canvas Renderer Node Component
 * ========================================
 *
 * Function used by the canvas renderer to display a single node.
 * @module
 */
import { NodeAttributes, PartialButFor } from "../../types";

const PI_TIMES_2 = Math.PI * 2;

export default function drawNode(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeAttributes, "x" | "y" | "size" | "color">,
): void {
  context.fillStyle = data.color;
  context.beginPath();
  context.arc(data.x, data.y, data.size, 0, PI_TIMES_2, true);

  context.closePath();
  context.fill();
}
