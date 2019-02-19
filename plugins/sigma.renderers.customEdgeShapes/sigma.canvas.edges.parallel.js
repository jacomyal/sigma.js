(function() {
  sigma.utils.pkg("sigma.canvas.edges");

  /**
   * This method renders the edge as two parallel lines.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.parallel = function(
    edge,
    source,
    target,
    context,
    settings
  ) {
    let color = edge.active
      ? edge.active_color || settings("defaultEdgeActiveColor")
      : edge.color;

    const prefix = settings("prefix") || "";

    const size = edge[`${prefix}size`] || 1;

    const edgeColor = settings("edgeColor");

    const defaultNodeColor = settings("defaultNodeColor");

    const defaultEdgeColor = settings("defaultEdgeColor");

    const sX = source[`${prefix}x`];

    const sY = source[`${prefix}y`];

    const tX = target[`${prefix}x`];

    const tY = target[`${prefix}y`];

    let c;

    let d;

    const dist = sigma.utils.getDistance(sX, sY, tX, tY);

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

    // Intersection points of the source node circle:
    c = sigma.utils.getCircleIntersection(sX, sY, size, tX, tY, dist);

    // Intersection points of the target node circle:
    d = sigma.utils.getCircleIntersection(tX, tY, size, sX, sY, dist);

    context.save();

    if (edge.active) {
      context.strokeStyle =
        settings("edgeActiveColor") === "edge"
          ? color || defaultEdgeColor
          : settings("defaultEdgeActiveColor");
    } else {
      context.strokeStyle = color;
    }

    context.lineWidth = size;
    context.beginPath();
    context.moveTo(c.xi, c.yi);
    context.lineTo(d.xi_prime, d.yi_prime);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(c.xi_prime, c.yi_prime);
    context.lineTo(d.xi, d.yi);
    context.closePath();
    context.stroke();

    context.restore();
  };
})();
