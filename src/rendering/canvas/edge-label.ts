/**
 * Sigma.js Canvas Renderer Edge Label Component
 * =============================================
 *
 * Function used by the canvas renderer to display a single edge's label.
 * @module
 */
import { Settings } from "../../settings";
import { EdgeDisplayData, NodeDisplayData, PartialButFor } from "../../types";

export default function drawEdgeLabel(
  context: CanvasRenderingContext2D,
  edgeData: PartialButFor<EdgeDisplayData, "label" | "color" | "size">,
  sourceData: PartialButFor<NodeDisplayData, "x" | "y" | "size">,
  targetData: PartialButFor<NodeDisplayData, "x" | "y" | "size">,
  settings: Settings,
): void {
  const size = settings.edgeLabelSize,
    font = settings.edgeLabelFont,
    weight = settings.edgeLabelWeight,
    color = settings.edgeLabelColor.attribute
      ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
      : settings.edgeLabelColor.color;

  let label = edgeData.label;

  if (!label) return;

  context.fillStyle = color;
  context.font = `${weight} ${size}px ${font}`;

  // Computing positions without considering nodes sizes:
  const sSize = sourceData.size;
  const tSize = targetData.size;
  let sx = sourceData.x;
  let sy = sourceData.y;
  let tx = targetData.x;
  let ty = targetData.y;
  let cx = (sx + tx) / 2;
  let cy = (sy + ty) / 2;
  let dx = tx - sx;
  let dy = ty - sy;
  let d = Math.sqrt(dx * dx + dy * dy);

  if (d < sSize + tSize) return;

  // Adding nodes sizes:
  sx += (dx * sSize) / d;
  sy += (dy * sSize) / d;
  tx -= (dx * tSize) / d;
  ty -= (dy * tSize) / d;
  cx = (sx + tx) / 2;
  cy = (sy + ty) / 2;
  dx = tx - sx;
  dy = ty - sy;
  d = Math.sqrt(dx * dx + dy * dy);

  // Handling ellipsis
  let textLength = context.measureText(label).width;

  if (textLength > d) {
    const ellipsis = "…";
    label = label + ellipsis;
    textLength = context.measureText(label).width;

    while (textLength > d && label.length > 1) {
      label = label.slice(0, -2) + ellipsis;
      textLength = context.measureText(label).width;
    }

    if (label.length < 4) return;
  }

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

  context.fillText(label, -textLength / 2, edgeData.size / 2 + size);

  context.restore();
}
