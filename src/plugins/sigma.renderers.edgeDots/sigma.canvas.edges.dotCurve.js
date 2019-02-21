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
  sigma.canvas.edges.dotCurve = function(
    edge,
    source,
    target,
    context,
    settings
  ) {
    let color = edge.color;

    const prefix = settings("prefix") || "";

    const size = edge[`${prefix}size`] || 1;

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
        ? sigma.utils.getSelfLoopControlPoints(sX, sY, sSize)
        : sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY);

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
    if (edge.sourceDotColor != undefined || edge.targetDotColor != undefined) {
      let dotOffset = edge.dotOffset || 3;
      let dotSize = edge.dotSize || 1;
      dotSize = size * dotSize;
      dotOffset *= sSize;
      if (edge.sourceDotColor != undefined) {
        createDot(
          context,
          sX,
          sY,
          cp,
          tX,
          tY,
          dotOffset,
          dotSize,
          edge.sourceDotColor
        );
      }
      if (edge.targetDotColor != undefined) {
        createDot(
          context,
          tX,
          tY,
          cp,
          sX,
          sY,
          dotOffset,
          dotSize,
          edge.targetDotColor
        );
      }
    }
  };

  function createDot(context, sX, sY, cp, tX, tY, offset, size, color) {
    context.beginPath();
    context.fillStyle = color;
    const dot = getPointOnBezier(sX, sY, cp.x, cp.y, tX, tY, offset);
    context.arc(dot.x, dot.y, size * 3, 0, 2 * Math.PI, false);
    context.fill();
  }

  function getQBezierValue(t, p1, p2, p3) {
    const iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
  }

  function getQuadraticCurvePoint(
    startX,
    startY,
    cpX,
    cpY,
    endX,
    endY,
    position
  ) {
    return {
      x: getQBezierValue(position, startX, cpX, endX),
      y: getQBezierValue(position, startY, cpY, endY)
    };
  }
  function getDistanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  /* Function to get a point on a bezier curve a certain distance away from
     its source. Needed since the position on a beziercurve is given to the
     formula as a percentage (t). */
  function getPointOnBezier(startX, startY, cpX, cpY, endX, endY, distance) {
    let bestT = 0;
    let bestAccuracy = 1000;
    const stepSize = 0.001;
    for (let t = 0; t < 1; t += stepSize) {
      const currentPoint = getQuadraticCurvePoint(
        startX,
        startY,
        cpX,
        cpY,
        endX,
        endY,
        t
      );
      const currentDistance = getDistanceBetweenPoints(
        startX,
        startY,
        currentPoint.x,
        currentPoint.y
      );
      if (Math.abs(currentDistance - distance) < bestAccuracy) {
        bestAccuracy = Math.abs(currentDistance - distance);
        bestT = t;
      }
    }
    return getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, bestT);
  }
}
