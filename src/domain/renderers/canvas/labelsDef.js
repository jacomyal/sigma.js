/**
 * This label renderer will just display the label on the right of the node.
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
export default function labelsDef(node, context, settings) {
  let fontSize;

  const prefix = settings("prefix") || "";

  const size = node[`${prefix}size`];

  if (size < settings("labelThreshold")) return;

  if (!node.label || typeof node.label !== "string") return;

  fontSize =
    settings("labelSize") === "fixed"
      ? settings("defaultLabelSize")
      : settings("labelSizeRatio") * size;

  context.font = `${(settings("fontStyle") ? `${settings("fontStyle")} ` : "") +
    fontSize}px ${settings("font")}`;
  context.fillStyle =
    settings("labelColor") === "node"
      ? node.color || settings("defaultNodeColor")
      : settings("defaultLabelColor");

  context.fillText(
    node.label,
    Math.round(node[`${prefix}x`] + size + 3),
    Math.round(node[`${prefix}y`] + fontSize / 3)
  );
}
