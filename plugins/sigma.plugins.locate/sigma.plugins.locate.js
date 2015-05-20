/**
 * This plugin provides a method to locate a node, a set of nodes, an edge, or
 * a set of edges.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

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
    // PADDING:
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    // GLOBAL SETTINGS:
    // **********
    // If true adds a halfway point while animating the camera.
    focusOut: false,
    // The default zoom ratio, sigma zoomMax otherwise.
    zoomDef: null
  };

  var _instance = {}

  function getRescalePosition(s) {
    var autoRescale = s.settings('autoRescale');
    if (autoRescale) {
      if (Array.isArray(autoRescale)) {
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
   * @param  {sigma}   s      The related sigma instance.
   * @param  {object} options The options related to the object.
   */
  function Locate(s, options) {
    var self = this;

    this.s = s;
    this.settings = sigma.utils.extend(options, settings);
    this.settings.zoomDef = this.settings.zoomDef || this.s.settings('zoomMax');

    this.s.bind('kill', function() {
      sigma.plugins.killLocate(self.s);
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
          height,
          rendererWidth,
          rendererHeight;

      // Center of the boundaries:
      x = (boundaries.minX + boundaries.maxX) * 0.5;
      y = (boundaries.minY + boundaries.maxY) * 0.5;

      // Zoom ratio:
      if (getRescalePosition(self.s)) {
        var graphBoundaries,
            graphRect,
            graphWidth,
            graphHeight,
            rect;

        // Coordinates of the rectangle representing the camera on screen for the selection boundaries:
        rect = self.s.camera.getRectangle(
          boundaries.maxX - boundaries.minX,
          boundaries.maxY - boundaries.minY
        );

        width = rect.x2 - rect.x1 || 1;
        height = rect.height || 1;

        // Graph boundaries:
        graphBoundaries = sigma.utils.getBoundaries(
          self.s.graph,
          self.s.camera.readPrefix
        );

        // Coordinates of the rectangle representing the camera on screen for the graph boundaries:
        graphRect = self.s.camera.getRectangle(
          graphBoundaries.maxX - graphBoundaries.minX,
          graphBoundaries.maxY - graphBoundaries.minY
        );

        graphWidth = graphRect.x2 - graphRect.x1 || 1;
        graphHeight = graphRect.height || 1;

        rendererWidth = graphWidth - self.settings.padding.left - self.settings.padding.right;
        rendererHeight = graphHeight - self.settings.padding.top - self.settings.padding.bottom;

        ratio = Math.max(width / rendererWidth, height / rendererHeight);
      }
      else {
        width = boundaries.maxX - boundaries.minX + boundaries.sizeMax * 2;
        height = boundaries.maxY - boundaries.minY + boundaries.sizeMax * 2;
        rendererWidth = self.s.renderers[0].width - self.settings.padding.left - self.settings.padding.right;
        rendererHeight = self.s.renderers[0].height - self.settings.padding.top - self.settings.padding.bottom;
        ratio = Math.max(width / rendererWidth, height / rendererHeight);
      }

      // Normalize ratio:
      ratio = Math.max(self.s.settings('zoomMin'), Math.min(self.s.settings('zoomMax'), ratio));

      // Update center:
      x += (self.settings.padding.right - self.settings.padding.left) * ratio * 0.5;
      y += (self.settings.padding.bottom - self.settings.padding.top) * ratio * 0.5;

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
        throw new TypeError('Too few arguments.');

      if (arguments.length === 3 && typeof options !== "object")
        throw new TypeError('Invalid argument: "options" is not an object, was ' + options);

      var t,
          n,
          animationOpts = sigma.utils.extend(options, self.settings.animation.node),
          ratio = self.s.camera.ratio,
          rescalePosition = getRescalePosition(self.s);

      // One node:
      if (typeof v === 'string' || typeof v === 'number') {
        n = self.s.graph.nodes(v);
        if (n === undefined)
          throw new Error('Invalid argument: the node of id "' + v + '" does not exist.');

        t = {
          x: n[self.s.camera.readPrefix + 'x'],
          y: n[self.s.camera.readPrefix + 'y'],
          ratio: rescalePosition ?
            self.s.settings('zoomMin') : self.settings.zoomDef
        }
      }

      // Array of nodes:
      else if (Array.isArray(v)) {
        var boundaries = getBoundaries(v.map(function(id) {
          return self.s.graph.nodes(id);
        }), self.s.camera.readPrefix);

        t = target(boundaries);
      }
      else
        throw new TypeError('Invalid argument: "v" is not a string, a number, or an array, was ' + v);

      if (self.settings.focusOut && rescalePosition) {
        sigma.misc.animation.camera(
          s.camera,
          {
            x: (self.s.camera.x + t.x) * 0.5,
            y: (self.s.camera.y + t.y) * 0.5,
            ratio: self.settings.zoomDef
          },
          {
            duration: animationOpts.duration,
            onComplete: function() {
              sigma.misc.animation.camera(
                self.s.camera,
                t,
                animationOpts
              );
            }
          }
        );
      } else {
        // console.log(t);
        sigma.misc.animation.camera(
          self.s.camera,
          t,
          animationOpts
        );
      }

      return self;
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
        throw new TypeError('Too few arguments.');

      if (arguments.length === 3 && typeof options !== "object")
        throw new TypeError('Invalid argument: "options" is not an object, was ' + options);

      var t,
          e,
          boundaries,
          animationOpts = sigma.utils.extend(options, self.settings.animation.edge),
          ratio = self.s.camera.ratio,
          rescalePosition = getRescalePosition(self.s);

      // One edge:
      if (typeof v === 'string' || typeof v === 'number') {
        e = self.s.graph.edges(v);
        if (e === undefined)
          throw new Error('Invalid argument: the edge of id "' + v + '" does not exist.');

        boundaries = getBoundaries([
          self.s.graph.nodes(e.source),
          self.s.graph.nodes(e.target)
        ], self.s.camera.readPrefix);

        t = target(boundaries);
      }

      // Array of edges:
      else if (Array.isArray(v)) {
        var i,
            l,
            nodes = [];

        for (i = 0, l = v.length; i < l; i++) {
          e = self.s.graph.edges(v[i]);
          nodes.push(self.s.graph.nodes(e.source));
          nodes.push(self.s.graph.nodes(e.target));
        }

        boundaries = getBoundaries(nodes, self.s.camera.readPrefix);
        t = target(boundaries);
      }
      else
        throw new TypeError('Invalid argument: "v" is not a string or a number, or an array, was ' + v);

      if (self.settings.focusOut && rescalePosition) {
        sigma.misc.animation.camera(
          s.camera,
          {
            x: (self.s.camera.x + t.x) * 0.5,
            y: (self.s.camera.y + t.y) * 0.5,
            ratio: self.settings.zoomDef
          },
          {
            duration: animationOpts.duration,
            onComplete: function() {
              sigma.misc.animation.camera(
                self.s.camera,
                t,
                animationOpts
              );
            }
          }
        );
      } else {
        sigma.misc.animation.camera(
          self.s.camera,
          t,
          animationOpts
        );
      }

      return self;
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
      var animationOpts = sigma.utils.extend(options, self.settings.animation.center);
      if (self.s.graph.nodes().length) {
        self.nodes(self.s.graph.nodes().map(function(n) {
          return n.id;
        }), animationOpts);
      }
      else {
        sigma.misc.animation.camera(
          self.s.camera,
          {
            x: 0,
            y: 0,
            ratio: ratio
          },
          animationOpts
        );
      }

      return self;
    };

    /**
     * Set the padding, i.e. the space (in screen pixels) between the renderer
     * border and the renderer content.
     * The parameters are `top`, `right`, `bottom`, `left`.
     *
     * @param  {object} options  A dictionary with padding options.
     * @return {sigma.plugins.locate} Returns the instance itself.
     */
    this.setPadding = function(options) {
      self.settings.padding = sigma.utils.extend(options, self.settings.padding);
      return self;
    }

    this.kill = function() {
      self.settings = null;
      self.s = null;
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
