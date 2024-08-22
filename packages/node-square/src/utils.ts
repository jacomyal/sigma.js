import { Attributes } from "graphology-types";
import { drawDiscNodeLabel } from "sigma/rendering";
import { Settings } from "sigma/settings";
import { NodeDisplayData, PartialButFor } from "sigma/types";

export function drawSquareNodeLabel<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings<N, E, G>,
): void {
  return drawDiscNodeLabel<N, E, G>(context, data, settings);
}

export function drawSquareNodeHover<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings<N, E, G>,
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.font = `${weight} ${size}px ${font}`;

  // Then we draw the label background
  context.fillStyle = "#FFF";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  const PADDING = 2;

  if (typeof data.label === "string") {
    const textWidth = context.measureText(data.label).width,
      boxWidth = Math.round(textWidth + 5),
      boxHeight = Math.round(size + 2 * PADDING),
      radius = Math.max(data.size, size / 2) + PADDING;

    context.beginPath();
    context.moveTo(data.x + radius, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
    context.lineTo(data.x + radius, data.y - boxHeight / 2);
    context.lineTo(data.x + radius, data.y - radius);
    context.lineTo(data.x - radius, data.y - radius);
    context.lineTo(data.x - radius, data.y + radius);
    context.lineTo(data.x + radius, data.y + radius);
    context.moveTo(data.x + radius, data.y + boxHeight / 2);
    context.closePath();
    context.fill();
  } else {
    const radius = data.size + PADDING;
    context.fillRect(data.x - radius, data.y - radius, radius * 2, radius * 2);
  }

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  drawSquareNodeLabel(context, data, settings);
}
