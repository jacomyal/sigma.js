/**
 * The default node renderer. It renders the node as a simple disc.
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
export default function nodesDef(node, context, settings) {
  const prefix = settings("prefix") || "";

  context.fillStyle = node.color || settings("defaultNodeColor");
  context.beginPath();
  context.arc(
    node[`${prefix}x`],
    node[`${prefix}y`],
    node[`${prefix}size`],
    0,
    Math.PI * 2,
    true
  );

  context.closePath();
  context.fill();
}
