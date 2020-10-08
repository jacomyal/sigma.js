/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 */
import { PartialButFor } from "../../../utils";
import { WebGLSettings, SigmaNode } from "../../webgl/settings";

export default function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<SigmaNode, "x" | "y" | "size" | "label" | "color">,
  settings: WebGLSettings,
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.fillStyle = data.color;
  context.font = `${weight} ${size}px ${font}`;

  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
