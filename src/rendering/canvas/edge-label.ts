/**
 * Sigma.js Canvas Renderer Edge Label Component
 * =============================================
 *
 * Function used by the canvas renderer to display a single edge's label.
 * @module
 */
import { Settings } from "../../settings";
import { EdgeAttributes, NodeAttributes, PartialButFor } from "../../types";

export default function drawEdgeLabel(
  context: CanvasRenderingContext2D,
  edgeData: PartialButFor<EdgeAttributes, "label" | "color" | "size">,
  sourceData: PartialButFor<NodeAttributes, "x" | "y">,
  targetData: PartialButFor<NodeAttributes, "x" | "y">,
  settings: Settings,
): void {
  const size = settings.edgeLabelSize,
    font = settings.edgeLabelFont,
    weight = settings.edgeLabelWeight,
    label = edgeData.label;

  context.fillStyle = edgeData.color;
  context.font = `${weight} ${size}px ${font}`;
  const textWidth = context.measureText(label).width;

  const cx = (sourceData.x + targetData.x) / 2;
  const cy = (sourceData.y + targetData.y) / 2;
  const dx = targetData.x - sourceData.x;
  const dy = targetData.y - sourceData.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  let angle;
  if (dx > 0) {
    if (dy > 0) angle = Math.acos(dx / d);
    else angle = Math.asin(dy / d);
  } else {
    if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
    else angle = Math.asin(dx / d) + Math.PI / 2;
  }

  context.save();
  context.translate(cx, cy);
  context.rotate(angle);

  context.fillText(label, -textWidth / 2, edgeData.size / 2 + size);

  context.restore();
}
