import { Attributes } from "graphology-types";

import { Settings } from "../settings";
import { NodeDisplayData, PartialButFor } from "../types";

export type NodeLabelDrawingFunction<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = (
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings<N, E, G>,
) => void;

export function drawDiscNodeLabel<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings<N, E, G>,
): void {
  if (!data.label) return;

  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight,
    color = settings.labelColor.attribute
      ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
      : settings.labelColor.color;

  context.fillStyle = color;
  context.font = `${weight} ${size}px ${font}`;

  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
