/**
 * This plugin provides a method to locate a node, a set of nodes, an edge, or
 * a set of edges.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Locate
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1
   */

  /**
  * The default settings.
  *
  * Here is the exhaustive list of every accepted parameters in the animation
  * object:
  *
  *   {?number}            duration   The duration of the animation.
  *   {?function}          onNewFrame A callback to execute when the animation
  *                                   enters a new frame.
  *   {?function}          onComplete A callback to execute when the animation
  *                                   is completed or killed.
  *   {?(string|function)} easing     The name of a function from the package
  *                                   sigma.utils.easings, or a custom easing
  *                                   function.
  */
  var settings = {
    // ANIMATION SETTINGS:
    // **********
    animation: {
      node: {
        duration: 300
      },
      edge: {
        duration: 300
      },
      center: {
        duration: 300
      }
    },
    // GLOBAL SETTINGS:
    // **********
    // If true adds a halfway point while animating the camera.
    focusOut: false,
    // The default zoom ratio, sigma zoomMax otherwise.
    zoomDef: null
  };

  var _instance = {},
      _s = null,
      _o = null;

  function getRescalePosition(s) {
    var autoRescale = s.settings('autoRescale');
    if (autoRescale) {
      if (Object.prototype.toString.call(autoRescale) === '[object Array]') {
        return (autoRescale.indexOf('nodePosition') !== -1);
      }
      return true;
    }
    return false;
  };

  function getBoundaries(nodes, prefix) {
    var i,
        l,
        sizeMax = -Infinity,
        minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    for (i = 0, l = nodes.length; i < l; i++) {
      sizeMax = Math.max(nodes[i][prefix + 'size'], sizeMax);
      maxX = Math.max(nodes[i][prefix + 'x'], maxX);
      minX = Math.min(nodes[i][prefix + 'x'], minX);
      maxY = Math.max(nodes[i][prefix + 'y'], maxY);
      minY = Math.min(nodes[i][prefix + 'y'], minY);
    }

    sizeMax = sizeMax || 1;

    return {
      sizeMax: sizeMax,
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
  };


  /**
   * Locate Object
   * ------------------
   * @param  {sigma}   s       The related sigma instance.
   * @param  {object} options The options related to the object.
   */
  function Locate(s, options) {
    var self = this,
        _s = s,
        _o = sigma.utils.extend(options, settings);

    _o.zoomDef = _o.zoomDef || _s.settings('zoomMax');

    _s.bind('kill', function() {
      sigma.plugins.killLocate(_s);
    });


    /**
     * This function computes the target point (x, y, ratio) of the animation
     * given a bounding box.
     *
     * @param {object} boundaries:
     *      {number}  minX  The bounding box top.
     *      {number}  maxX  The bounding box bottom.
     *      {number}  minY  The bounding box left.
     *      {number}  maxY  The bounding box right.
     * @return {object}        The target point.
     */
    function target(boundaries) {
      var x,
          y,
          ratio,
          width,
          height;

      // Center of the boundaries:
      x = (boundaries.minX + boundaries.maxX) * 0.5;
      y = (boundaries.minY + boundaries.maxY) * 0.5;

      // Zoom ratio:
      if (getRescalePosition(_s)) {
        var graphBoundaries,
            graphRect,
            graphWidth,
            graphHeight,
            rect;

        // Coordinates of the rectangle representing the camera on screen for the selection boundaries:
        rect = _s.camera.getRectangle(
          boundaries.maxX - boundaries.minX,
          boundaries.maxY - boundaries.minY
        );

        width = rect.x2 - rect.x1 || 1;
        height = rect.height || 1;

        // Graph boundaries:
        graphBoundaries = sigma.utils.getBoundaries(
          _s.graph,
          _s.camera.readPrefix
        );

        // Coordinates of the rectangle representing the camera on screen for the graph boundaries:
        graphRect = _s.camera.getRectangle(
          graphBoundaries.maxX - graphBoundaries.minX,
          graphBoundaries.maxY - graphBoundaries.minY
        );

        graphWidth = graphRect.x2 - graphRect.x1 || 1;
        graphHeight = graphRect.height || 1;

        ratio = Math.max(width / graphWidth, height / graphHeight);
      }
      else {
        width = boundaries.maxX - boundaries.minX + boundaries.sizeMax * 2;
        height = boundaries.maxY - boundaries.minY + boundaries.sizeMax * 2;
        ratio = Math.max(width / _s.renderers[0].width, height / _s.renderers[0].height);
      }

      // Normalize ratio:
      ratio = Math.max(_s.settings('zoomMin'), Math.min(_s.settings('zoomMax'), ratio));

      return {
        x: x,
        y: y,
        ratio: ratio
      };
    };

    /**
     * This function will locate a node or a set of nodes in the visualization.
     *
     * Recognized parameters:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the animation
     * options:
     *
     *   {?number}            duration   The duration of the animation.
     *   {?function}          onNewFrame A callback to execute when the animation
     *                                   enters a new frame.
     *   {?function}          onComplete A callback to execute when the animation
     *                                   is completed or killed.
     *   {?(string|function)} easing     The name of a function from the package
     *                                   sigma.utils.easings, or a custom easing
     *                                   function.
     *
     *
     * @param  {string|array}  v       Eventually one node id, an array of ids.
     * @param  {?object}       options A dictionary with options for a possible
     *                                 animation.
     * @return {sigma.plugins.locate}  Returns the instance itself.
     */
    this.nodes = function(v, options) {
      if (arguments.length < 1)
        throw 'locate.nodes: Wrong arguments.';

      if (arguments.length === 3 && typeof options !== "object")
        throw 'locate.nodes: options must be an object.'

      var t,
          n,
          animationOpts = sigma.utils.extend(options, _o.animation.node),
          ratio = _s.camera.ratio,
          rescalePosition = getRescalePosition(_s);

      // One node:
      if (typeof v === 'string' || typeof v === 'number') {
        n = _s.graph.nodes(v);
        if (n === undefined)
          throw 'locate.nodes: Wrong arguments.';

        t = {
          x: n[_s.camera.readPrefix + 'x'],
          y: n[_s.camera.readPrefix + 'y'],
          ratio: rescalePosition ?
            _s.settings('zoomMin') : _o.zoomDef
        }
      }

      // Array of nodes:
      else if (
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var boundaries = getBoundaries(v.map(function(id) {
          return _s.graph.nodes(id);
        }), _s.camera.readPrefix);

        t = target(boundaries);
      }
      else
        throw 'locate.nodes: Wrong arguments.';

      if (_o.focusOut && rescalePosition) {
        sigma.misc.animation.camera(
          s.camera,
          {
            x: (_s.camera.x + t.x) * 0.5,
            y: (_s.camera.y + t.y) * 0.5,
            ratio: _o.zoomDef
          },
          {
            duration: animationOpts.duration,
            onComplete: function() {
              sigma.misc.animation.camera(
                _s.camera,
                t,
                animationOpts
              );
            }
          }
        );
      } else {
        sigma.misc.animation.camera(
          _s.camera,
          t,
          animationOpts
        );
      }

      return this;
    };


    /**
     * This function will locate an edge or a set of edges in the visualization.
     *
     * Recognized parameters:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the animation
     * options:
     *
     *   {?number}            duration   The duration of the animation.
     *   {?function}          onNewFrame A callback to execute when the animation
     *                                   enters a new frame.
     *   {?function}          onComplete A callback to execute when the animation
     *                                   is completed or killed.
     *   {?(string|function)} easing     The name of a function from the package
     *                                   sigma.utils.easings, or a custom easing
     *                                   function.
     *
     *
     * @param  {string|array}  v       Eventually one edge id, an array of ids.
     * @param  {?object}       options A dictionary with options for a possible
     *                                 animation.
     * @return {sigma.plugins.locate}  Returns the instance itself.
     */
    this.edges = function(v, options) {
      if (arguments.length < 1)
        throw 'locate.edges: Wrong arguments.';

      if (arguments.length === 3 && typeof options !== "object")
        throw 'locate.edges: options must be an object.'

      var t,
          e,
          boundaries,
          animationOpts = sigma.utils.extend(options, _o.animation.edge),
          ratio = _s.camera.ratio,
          rescalePosition = getRescalePosition(_s);

      // One edge:
      if (typeof v === 'string' || typeof v === 'number') {
        e = _s.graph.edges(v);
        if (e === undefined)
          throw 'locate.edges: Wrong arguments.';

        boundaries = getBoundaries([
          _s.graph.nodes(e.source),
          _s.graph.nodes(e.target)
        ], _s.camera.readPrefix);

        t = target(boundaries);
      }

      // Array of edges:
      else if (
        Object.prototype.toString.call(v) === '[object Array]'
      ) {
        var i,
            l,
            nodes = [];

        for (i = 0, l = v.length; i < l; i++) {
          e = _s.graph.edges(v[i]);
          nodes.push(_s.graph.nodes(e.source));
          nodes.push(_s.graph.nodes(e.target));
        }

        boundaries = getBoundaries(nodes, _s.camera.readPrefix);
        t = target(boundaries);
      }
      else
        throw 'locate.edges: Wrong arguments.';

      if (_o.focusOut && rescalePosition) {
        sigma.misc.animation.camera(
          s.camera,
          {
            x: (_s.camera.x + t.x) * 0.5,
            y: (_s.camera.y + t.y) * 0.5,
            ratio: _o.zoomDef
          },
          {
            duration: animationOpts.duration,
            onComplete: function() {
              sigma.misc.animation.camera(
                _s.camera,
                t,
                animationOpts
              );
            }
          }
        );
      } else {
        sigma.misc.animation.camera(
          _s.camera,
          t,
          animationOpts
        );
      }

      return this;
    };


    /**
     * This method moves the camera to the equidistant position from all nodes,
     * or to the coordinates (0, 0) if the graph is empty, given a final zoom
     * ratio.
     *
     * Recognized parameters:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the animation
     * options:
     *
     *   {?number}            duration   The duration of the animation.
     *   {?function}          onNewFrame A callback to execute when the animation
     *                                   enters a new frame.
     *   {?function}          onComplete A callback to execute when the animation
     *                                   is completed or killed.
     *   {?(string|function)} easing     The name of a function from the package
     *                                   sigma.utils.easings, or a custom easing
     *                                   function.
     *
     *
     * @param  {number}  ratio        The final zoom ratio.
     * @param  {?object} options      A dictionary with options for a possible
     *                                animation.
     * @return {sigma.plugins.locate} Returns the instance itself.
     */
    this.center = function(ratio, options) {
      var animationOpts = sigma.utils.extend(options, _o.animation.center);
      if (_s.graph.nodes().length) {
        self.nodes(_s.graph.nodes().map(function(n) {
          return n.id;
        }), animationOpts);
      }
      else {
        sigma.misc.animation.camera(
          _s.camera,
          {
            x: 0,
            y: 0,
            ratio: ratio
          },
          animationOpts
        );
      }

      return this;
    };

    this.kill = function() {
      _o = null;
      _s = null;
    }

  };



  /**
   * Interface
   * ------------------
   *
   * > var locate = sigma.plugins.locate(s);
   * > locate.nodes('n0');
   * > locate.nodes(['n0', 'n1']);
   * > locate.edges('e0');
   * > locate.edges(['e0', 'e1']);
   */

  /**
   * @param  {sigma} s The related sigma instance.
   * @param  {object} options The options related to the object.
   */
  sigma.plugins.locate = function(s, options) {
    // Create instance if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new Locate(s, options);
    }
    return _instance[s.id];
  };

  /**
   *  This function kills the locate instance.
   */
  sigma.plugins.killLocate = function(s) {
    if (_instance[s.id] instanceof Locate) {
      _instance[s.id].kill();
    }
    delete _instance[s.id];
  };

}).call(window);
