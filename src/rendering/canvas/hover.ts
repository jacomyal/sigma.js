/**
 * Sigma.js Canvas Renderer Hover Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's hovered
 * state.
 * @module
 */
import { Settings } from "../../settings";
import { NodeDisplayData, PartialButFor } from "../../types";
import drawNode from "./node";
import drawLabel from "./label";

/**
 * Draw an hovered node.
 * - if there is no label => display a shadow on the node
 * - if the label box is bigger than node size => display a label box that contains the node with a shadow
 * - else node with shadow and the label box
 */
export default function drawHover(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings,
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

  const MARGIN = 2;

  if (data.label.length > 0) {
    const textWidth = context.measureText(data.label).width,
      boxWidth = Math.round(textWidth + 9),
      boxHeight = Math.round(size + 2 * MARGIN),
      radious = Math.max(data.size, size / 2) + MARGIN;

    const angleRadian = Math.asin(boxHeight / 2 / radious);
    const xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radious, 2) - Math.pow(boxHeight / 2, 2)));

    context.beginPath();
    context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
    context.lineTo(data.x + radious + boxWidth, data.y + boxHeight / 2);
    context.lineTo(data.x + radious + boxWidth, data.y - boxHeight / 2);
    context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
    context.arc(data.x, data.y, radious, angleRadian, -angleRadian);
    context.closePath();
    context.fill();
  } else {
    context.beginPath();
    context.arc(data.x, data.y, data.size + MARGIN, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
  // the inner node of the label box
  drawNode(context, data);

  // And finally we draw the label
  drawLabel(context, data, settings);
}
