export default function extend(sigma) {
  sigma.utils.pkg("sigma.canvas.edges");

  /**
   * This edge renderer will display edges as curves.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.curve = function(edge, source, target, context, settings) {
    let color = edge.color;

    const prefix = settings("prefix") || "";

    const size = edge[`${prefix}size`] || 1;

    const count = edge.count || 0;

    const edgeColor = settings("edgeColor");

    const defaultNodeColor = settings("defaultNodeColor");

    const defaultEdgeColor = settings("defaultEdgeColor");

    let cp = {};

    const sSize = source[`${prefix}size`];

    const sX = source[`${prefix}x`];

    const sY = source[`${prefix}y`];

    const tX = target[`${prefix}x`];

    const tY = target[`${prefix}y`];

    cp =
      source.id === target.id
        ? sigma.utils.getSelfLoopControlPoints(sX, sY, sSize, count)
        : sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY, count);

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

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(sX, sY);
    if (source.id === target.id) {
      context.bezierCurveTo(cp.x1, cp.y1, cp.x2, cp.y2, tX, tY);
    } else {
      context.quadraticCurveTo(cp.x, cp.y, tX, tY);
    }
    context.stroke();
  };
}
