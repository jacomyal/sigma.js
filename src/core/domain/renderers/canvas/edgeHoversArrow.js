/**
 * This hover renderer will display the edge with a different color or size.
 *
 * @param  {object}                   edge         The edge object.
 * @param  {object}                   source node  The edge source node.
 * @param  {object}                   target node  The edge target node.
 * @param  {CanvasRenderingContext2D} context      The canvas context.
 * @param  {configurable}             settings     The settings function.
 */
export default function edgeHoversArrow(
  edge,
  source,
  target,
  context,
  settings
) {
  let { color } = edge;
  const prefix = settings("prefix") || "";
  const edgeColor = settings("edgeColor");
  const defaultNodeColor = settings("defaultNodeColor");
  const defaultEdgeColor = settings("defaultEdgeColor");
  let size = edge[`${prefix}size`] || 1;
  const tSize = target[`${prefix}size`];
  const sX = source[`${prefix}x`];
  const sY = source[`${prefix}y`];
  const tX = target[`${prefix}x`];
  const tY = target[`${prefix}y`];

  size = edge.hover ? settings("edgeHoverSizeRatio") * size : size;
  const aSize = size * 2.5;
  const d = Math.sqrt((tX - sX) ** 2 + (tY - sY) ** 2);
  const aX = sX + ((tX - sX) * (d - aSize - tSize)) / d;
  const aY = sY + ((tY - sY) * (d - aSize - tSize)) / d;
  const vX = ((tX - sX) * aSize) / d;
  const vY = ((tY - sY) * aSize) / d;

  if (!color)
    switch (edgeColor) {
      case "source":
        color = source.color || defaultNodeColor;
        break;
      case "target":
        color = target.color || defaultNodeColor;
        break;
      default:
        color = defaultEdgeColor;
        break;
    }

  if (settings("edgeHoverColor") === "edge") {
    color = edge.hover_color || color;
  } else {
    color = edge.hover_color || settings("defaultEdgeHoverColor") || color;
  }

  context.strokeStyle = color;
  context.lineWidth = size;
  context.beginPath();
  context.moveTo(sX, sY);
  context.lineTo(aX, aY);
  context.stroke();

  context.fillStyle = color;
  context.beginPath();
  context.moveTo(aX + vX, aY + vY);
  context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
  context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
  context.lineTo(aX + vX, aY + vY);
  context.closePath();
  context.fill();
}
