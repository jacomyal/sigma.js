import getBoundaries from "../utils/geometry/getBoundaries";

/**
 * This middleware will rescale the graph such that it takes an optimal space
 * on the renderer.
 *
 * As each middleware, this function is executed in the scope of the sigma
 * instance.
 *
 * @param {?string} readPrefix  The read prefix.
 * @param {?string} writePrefix The write prefix.
 * @param {object}  options     The parameters.
 */
export default function rescale(readPrefix, writePrefix, options) {
  let i;
  let l;
  let a;
  let b;
  let c;
  let d;
  let scale;
  let margin;
  const n = this.graph.nodes();
  const e = this.graph.edges();
  const settings = this.settings.embedObjects(options || {});
  const bounds =
    settings("bounds") || getBoundaries(this.graph, readPrefix, true);

  const { minX, minY, maxX, maxY, sizeMax, weightMax } = bounds;
  const w = settings("width") || 1;
  const h = settings("height") || 1;

  let rescaleSettings = settings("autoRescale");

  const validSettings = {
    nodePosition: 1,
    nodeSize: 1,
    edgeSize: 1
  };

  /**
   * What elements should we rescale?
   */
  if (!(rescaleSettings instanceof Array))
    rescaleSettings = ["nodePosition", "nodeSize", "edgeSize"];

  for (i = 0, l = rescaleSettings.length; i < l; i++)
    if (!validSettings[rescaleSettings[i]])
      throw new Error(
        `The rescale setting "${rescaleSettings[i]}" is not recognized.`
      );

  const np = ~rescaleSettings.indexOf("nodePosition");
  const ns = ~rescaleSettings.indexOf("nodeSize");
  const es = ~rescaleSettings.indexOf("edgeSize");

  /**
   * First, we compute the scaling ratio, without considering the sizes
   * of the nodes : Each node will have its center in the canvas, but might
   * be partially out of it.
   */
  scale =
    settings("scalingMode") === "outside"
      ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1))
      : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));

  /**
   * Then, we correct that scaling ratio considering a margin, which is
   * basically the size of the biggest node.
   * This has to be done as a correction since to compare the size of the
   * biggest node to the X and Y values, we have to first get an
   * approximation of the scaling ratio.
   * */
  margin =
    (settings("rescaleIgnoreSize")
      ? 0
      : (settings("maxNodeSize") || sizeMax) / scale) +
    (settings("sideMargin") || 0);
  maxX += margin;
  minX -= margin;
  maxY += margin;
  minY -= margin;

  // Fix the scaling with the new extrema:
  scale =
    settings("scalingMode") === "outside"
      ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1))
      : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));

  // Size homothetic parameters:
  if (!settings("maxNodeSize") && !settings("minNodeSize")) {
    a = 1;
    b = 0;
  } else if (settings("maxNodeSize") === settings("minNodeSize")) {
    a = 0;
    b = +settings("maxNodeSize");
  } else {
    a = (settings("maxNodeSize") - settings("minNodeSize")) / sizeMax;
    b = +settings("minNodeSize");
  }

  if (!settings("maxEdgeSize") && !settings("minEdgeSize")) {
    c = 1;
    d = 0;
  } else if (settings("maxEdgeSize") === settings("minEdgeSize")) {
    c = 0;
    d = +settings("minEdgeSize");
  } else {
    c = (settings("maxEdgeSize") - settings("minEdgeSize")) / weightMax;
    d = +settings("minEdgeSize");
  }

  // Rescale the nodes and edges:
  for (i = 0, l = e.length; i < l; i++)
    e[i][`${writePrefix}size`] =
      e[i][`${readPrefix}size`] * (es ? c : 1) + (es ? d : 0);

  for (i = 0, l = n.length; i < l; i++) {
    n[i][`${writePrefix}size`] =
      n[i][`${readPrefix}size`] * (ns ? a : 1) + (ns ? b : 0);
    n[i][`${writePrefix}x`] =
      (n[i][`${readPrefix}x`] - (maxX + minX) / 2) * (np ? scale : 1);
    n[i][`${writePrefix}y`] =
      (n[i][`${readPrefix}y`] - (maxY + minY) / 2) * (np ? scale : 1);
  }
}
