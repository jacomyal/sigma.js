;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.middlewares');
  sigma.utils.pkg('sigma.utils');

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
  sigma.middlewares.rescale = function(readPrefix, writePrefix, options) {
    var i,
        l,
        a,
        b,
        c,
        d,
        scale,
        margin,
        n = this.graph.nodes(),
        e = this.graph.edges(),
        settings = this.settings.embedObjects(options || {}),
        bounds = settings('bounds') || sigma.utils.getBoundaries(
          this.graph,
          readPrefix,
          true
        ),
        minX = bounds.minX,
        minY = bounds.minY,
        maxX = bounds.maxX,
        maxY = bounds.maxY,
        sizeMax = bounds.sizeMax,
        weightMax = bounds.weightMax,
        w = settings('width') || 1,
        h = settings('height') || 1,
        rescaleSettings = settings('autoRescale');

    /**
     * What elements should we rescale?
     */
    if (!(rescaleSettings instanceof Array))
      rescaleSettings = ['nodePosition', 'nodeSize', 'edgeSize'];

    var np = ~rescaleSettings.indexOf('nodePosition'),
        ns = ~rescaleSettings.indexOf('nodeSize'),
        es = ~rescaleSettings.indexOf('edgeSize');

    /**
     * First, we compute the scaling ratio, without considering the sizes
     * of the nodes : Each node will have its center in the canvas, but might
     * be partially out of it.
     */
    scale = settings('scalingMode') === 'outside' ?
      Math.max(
        w / Math.max(maxX - minX, 1),
        h / Math.max(maxY - minY, 1)
      ) :
      Math.min(
        w / Math.max(maxX - minX, 1),
        h / Math.max(maxY - minY, 1)
      );

    /**
     * Then, we correct that scaling ratio considering a margin, which is
     * basically the size of the biggest node.
     * This has to be done as a correction since to compare the size of the
     * biggest node to the X and Y values, we have to first get an
     * approximation of the scaling ratio.
     **/
    margin =
      (
        settings('rescaleIgnoreSize') ?
          0 :
          (settings('maxNodeSize') || sizeMax) / scale
      ) +
      (settings('sideMargin') || 0);
    maxX += margin;
    minX -= margin;
    maxY += margin;
    minY -= margin;

    // Fix the scaling with the new extrema:
    scale = settings('scalingMode') === 'outside' ?
      Math.max(
        w / Math.max(maxX - minX, 1),
        h / Math.max(maxY - minY, 1)
      ) :
      Math.min(
        w / Math.max(maxX - minX, 1),
        h / Math.max(maxY - minY, 1)
      );

    // Size homothetic parameters:
    if (!settings('maxNodeSize') && !settings('minNodeSize')) {
      a = 1;
      b = 0;
    } else if (settings('maxNodeSize') === settings('minNodeSize')) {
      a = 0;
      b = +settings('maxNodeSize');
    } else {
      a = (settings('maxNodeSize') - settings('minNodeSize')) / sizeMax;
      b = +settings('minNodeSize');
    }

    if (!settings('maxEdgeSize') && !settings('minEdgeSize')) {
      c = 1;
      d = 0;
    } else if (settings('maxEdgeSize') === settings('minEdgeSize')) {
      c = 0;
      d = +settings('minEdgeSize');
    } else {
      c = (settings('maxEdgeSize') - settings('minEdgeSize')) / weightMax;
      d = +settings('minEdgeSize');
    }

    // Rescale the nodes and edges:
    for (i = 0, l = e.length; i < l; i++)
      e[i][writePrefix + 'size'] =
        e[i][readPrefix + 'size'] * (es ? c : 1) + (es ? d : 0);

    for (i = 0, l = n.length; i < l; i++) {
      n[i][writePrefix + 'size'] =
        n[i][readPrefix + 'size'] * (ns ? a : 1) + (ns ? b : 0);
      n[i][writePrefix + 'x'] =
        (n[i][readPrefix + 'x'] - (maxX + minX) / 2) * (np ? scale : 1);
      n[i][writePrefix + 'y'] =
        (n[i][readPrefix + 'y'] - (maxY + minY) / 2) * (np ? scale : 1);
    }
  };

  sigma.utils.getBoundaries = function(graph, prefix, doEdges) {
    var i,
        l,
        e = graph.edges(),
        n = graph.nodes(),
        weightMax = -Infinity,
        sizeMax = -Infinity,
        minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    if (doEdges)
      for (i = 0, l = e.length; i < l; i++)
        weightMax = Math.max(e[i][prefix + 'size'], weightMax);

    for (i = 0, l = n.length; i < l; i++) {
      sizeMax = Math.max(n[i][prefix + 'size'], sizeMax);
      maxX = Math.max(n[i][prefix + 'x'], maxX);
      minX = Math.min(n[i][prefix + 'x'], minX);
      maxY = Math.max(n[i][prefix + 'y'], maxY);
      minY = Math.min(n[i][prefix + 'y'], minY);
    }

    weightMax = weightMax || 1;
    sizeMax = sizeMax || 1;

    return {
      weightMax: weightMax,
      sizeMax: sizeMax,
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
  };
}).call(this);
