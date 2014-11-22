;(function(undefined) {

  /**
   * Sigma Renderer Halo Utility
   * ================================
   *
   * The aim of this plugin is to display a circled halo behind specified nodes.
   *
   * Author: Sébastien Heymann (sheymann) for Linkurious
   * Version: 0.0.1
   */

  // Terminating if sigma were not to be found
  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.halo: sigma not in scope.';

  /**
   * This methods returns an array of nodes that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent nodes.
   */
  if (!sigma.classes.graph.hasMethod('adjacentNodes'))
    sigma.classes.graph.addMethod('adjacentNodes', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentNodes: the node id must be a string.';

      var target,
          nodes = [];
      for(target in this.allNeighborsIndex[id]) {
        nodes.push(this.nodesIndex[target]);
      }
      return nodes;
    });

  /**
   * This methods returns an array of edges that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent edges.
   */
  if (!sigma.classes.graph.hasMethod('adjacentEdges'))
    sigma.classes.graph.addMethod('adjacentEdges', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentEdges: the node id must be a string.';

      var a = this.allNeighborsIndex[id],
          eid,
          target,
          edges = [];
      for(target in a) {
        for(eid in a[target]) {
          edges.push(a[target][eid]);
        }
      }
      return edges;
    });

  /**
   * Creates an array of unique values present in all provided arrays using
   * strict equality for comparisons, i.e. `===`.
   *
   * @see lodash
   * @param {...Array} [array] The arrays to inspect.
   * @returns {Array} Returns an array of shared values.
   * @example
   *
   * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
   * // => [1, 2]
   */
  function intersection() {
    var args = [],
        argsIndex = -1,
        argsLength = arguments.length;

    while (++argsIndex < argsLength) {
      var value = arguments[argsIndex];
       args.push(value);
    }
    var array = args[0],
        index = -1,
        length = array ? array.length : 0,
        result = [];

    outer:
    while (++index < length) {
      value = array[index];
      if (result.indexOf(value) < 0) {
        var argsIndex = argsLength;
        while (--argsIndex) {
          if (args[argsIndex].indexOf(value) < 0) {
            continue outer;
          }
        }
        result.push(value);
      }
    }
    return result;
  }


  // Main function
  function halo(params) {
    params = params || {};
// console.log(this);
  if (!this.domElements['background']) {
    this.initDOM('canvas', 'background');
    this.domElements['background'].width = this.container.offsetWidth;
    this.domElements['background'].height = this.container.offsetHeight;
    this.container.insertBefore(this.domElements['background'], this.container.firstChild);
  }

    var self = this,
        context = self.contexts.background,
        webgl = this instanceof sigma.renderers.webgl,
        ePrefix = self.options.prefix,
        nPrefix = webgl ? ePrefix.substr(5) : ePrefix,
        nHaloColor = params.nodeHaloColor || self.settings('nodeHaloColor'),
        nHaloSize = params.nodeHaloSize || self.settings('nodeHaloSize'),
        borderSize = self.settings('borderSize') || 0,
        outerBorderSize = self.settings('outerBorderSize') || 0,
        eHaloColor = params.edgeHaloColor || self.settings('edgeHaloColor'),
        eHaloSize = params.edgeHaloSize || self.settings('edgeHaloSize'),
        nodes = params.nodes || [],
        edges = params.edges || [],
        source,
        target,
        cp,
        sSize,
        sX,
        sY,
        tX,
        tY;

    nodes = webgl ? nodes : intersection(params.nodes, self.nodesOnScreen);
    edges = webgl ? edges : intersection(params.edges, self.edgesOnScreen);

    // clear canvas
    context.canvas.width = context.canvas.width;

    context.save();

    // EDGES
    context.strokeStyle = eHaloColor;

    edges.forEach(function(edge) {
      source = self.graph.nodes(edge.source);
      target = self.graph.nodes(edge.target);

      context.lineWidth = (edge[ePrefix + 'size'] || 1) + eHaloSize;
      context.beginPath();

      cp = {};
      sSize = source[nPrefix + 'size'];
      sX = source[nPrefix + 'x'];
      sY = source[nPrefix + 'y'];
      tX = target[nPrefix + 'x'];
      tY = target[nPrefix + 'y'];

      context.moveTo(sX, sY);

      if (edge.type === 'curve' || edge.type === 'curvedArrow') {
        if (edge.source === edge.target) {
          cp = sigma.utils.getSelfLoopControlPoints(sX, sY, sSize);
          context.bezierCurveTo(cp.x1, cp.y1, cp.x2, cp.y2, tX, tY);
        }
        else {
          cp = sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY);
          context.quadraticCurveTo(cp.x, cp.y, tX, tY);
        }
      }
      else {
        context.moveTo(sX, sY);
        context.lineTo(tX, tY);
      }
      context.stroke();

      context.closePath();
    });

    // NODES
    context.fillStyle = nHaloColor;

    nodes.forEach(function(node) {
      if (node.hidden) return;

      context.beginPath();

      context.arc(
        node[nPrefix + 'x'],
        node[nPrefix + 'y'],
        node[nPrefix + 'size'] + borderSize + outerBorderSize + nHaloSize,
        0,
        Math.PI * 2,
        true
      );

      context.closePath();
      context.fill();
    });

    context.restore();
  }

  // Extending canvas and webl renderers
  sigma.renderers.canvas.prototype.halo = halo;
  sigma.renderers.webgl.prototype.halo = halo;

  // TODO clear scene?
}).call(this);
