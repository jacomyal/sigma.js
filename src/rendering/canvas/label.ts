/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 * @module
 */
import { Settings } from "../../settings";
import { NodeAttributes, PartialButFor } from "../../types";

export default function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeAttributes, "x" | "y" | "size" | "label" | "color">,
  settings: Settings,
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.fillStyle = "#000";
  context.font = `${weight} ${size}px ${font}`;

  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
