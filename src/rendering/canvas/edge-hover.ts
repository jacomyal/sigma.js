import { EdgeDisplayData, NodeDisplayData, PartialButFor } from "../../types";
import { Settings } from "../../settings";

export default function drawEdgeHover(
  context: CanvasRenderingContext2D,
  data: PartialButFor<EdgeDisplayData, "size" | "label" | "color"> & {
    source: { key: string; data: NodeDisplayData };
    target: { key: string; data: NodeDisplayData };
  },
  settings: Settings,
): void {
  if (data.highlightColor && data.highlightColor.size > 0) {
    const highlightWidth = data.size * settings.edgeHighlightWidthFactor;

    const [startX, startY] = [data.source.data.x, data.source.data.y];
    const [endX, endY] = [data.target.data.x, data.target.data.y];

    const numPieces = data.highlightColor.size;
    const deltaX = (endX - startX) / numPieces;
    const deltaY = (endY - startY) / numPieces;

    let [x, y] = [startX, startY];

    context.globalAlpha = settings.edgeHighlightAlpha;
    // context.lineCap = "round";
    context.lineWidth = highlightWidth;

    for (const color of data.highlightColor) {
      context.beginPath();
      context.moveTo(x, y);
      [x, y] = [x + deltaX, y + deltaY];
      context.lineTo(x, y);
      context.strokeStyle = color;
      context.stroke();
    }
  }
}
