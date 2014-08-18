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

  var _instance = null,
      _s = null,
      _o = null;

  /**
   * Helpers
   */
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];
    return res;
  };


  /**
   * Locate Object
   * ------------------
   * @param  {sigma}   s       The related sigma instance.
   * @param  {object} options The options related to the object.
   */
  function Locate(s, options) {
    _instance = this;
    _s = s;
    _o = extend(options, settings);

    _o.zoomDef = _o.zoomDef || _s.settings('zoomMax');
  };



  /**
   * This function computes the target point (x, y, ratio) of the animation
   * given a bounding box.
   *
   *
   * @param  {number}  minX  The bounding box top.
   * @param  {number}  maxX  The bounding box bottom.
   * @param  {number}  minY  The bounding box left.
   * @param  {number}  maxY  The bounding box right.
   * @return {object}        The target point.
   */
  function target(minX, maxX, minY, maxY) {
    if (minX === undefined || isNaN(minX) ||  typeof minX !== "number")
      throw 'minX must be a number.'

    if (maxX === undefined || isNaN(maxX) || typeof maxX !== "number")
      throw 'maxX must be a number.'

    if (minY === undefined || isNaN(minY) || typeof minY !== "number")
      throw 'minY must be a number.'

    if (maxY === undefined || isNaN(maxY) || typeof maxY !== "number")
      throw 'maxY must be a number.'

    var x,
        y,
        bounds,
        width,
        height,
        rect;

    // Center of the bounding box:
    x = (minX + maxX) * 0.5;
    y = (minY + maxY) * 0.5;

    // Coordinates of the rectangle representing the camera on screen
    // for the bounding box:
    rect = _s.camera.getRectangle(maxX - minX, maxY - minY);
    width = rect.x2 - rect.x1 || 1;
    height = rect.height || 1;

    // Find graph boundaries:
    bounds = sigma.utils.getBoundaries(
      _s.graph,
      _s.camera.readPrefix
    );

    // Zoom ratio:
    var cHeight = bounds.maxY + bounds.sizeMax,
        cWidth = bounds.maxX + bounds.sizeMax,
        ratio = _s.settings('zoomMax'),
        hRatio,
        wRatio;

    hRatio = height / cHeight;
    wRatio = width / cWidth;

    // Create the ratio dealing with min / max
    // if autoRescale is active:
    if (_s.settings('autoRescale'))
      ratio = Math.max(
        _s.settings('zoomMin'),
        Math.min(
          _s.settings('zoomMax'),
          _s.camera.ratio / Math.min(hRatio, wRatio)
        )
      );
    else {
      ratio = _o.zoomDef;
    }

    /*console.log({
      x:x, y:y, ratio:ratio, hRatio:hRatio, wRatio:wRatio, height:height, width:width, cHeight:cHeight, cWidth:cWidth
    });*/

    if (x === undefined || y === undefined)
      throw 'Coordinates error.'
    
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
   */
  Locate.prototype.nodes = function(v, options) {
    if (arguments.length < 1)
      throw 'locate.nodes: Wrong arguments.';

    if (arguments.length === 3 && typeof options !== "object")
      throw 'locate.nodes: options must be an object.'

    var t,
        animationOpts = extend(options, _o.animation.node),
        ratio = _s.camera.ratio;

    // One node:
    if (typeof v === 'string') {
      var n = _s.graph.nodes(v);

      t = {
        x: n[_s.camera.readPrefix + 'x'],
        y: n[_s.camera.readPrefix + 'y'],
        ratio: _s.settings('autoRescale') ?
          _s.settings('zoomMin') : _o.zoomDef
      }
    }

    // Array of nodes:
    else if (
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var minX, maxX, minY, maxY;

      minX = Math.min.apply(Math, v.map(function(n) {
        return n[_s.camera.readPrefix + 'x'];
      }));
      maxX = Math.max.apply(Math, v.map(function(n) {
        return n[_s.camera.readPrefix + 'x'];
      }));
      minY = Math.min.apply(Math, v.map(function(n) {
        return n[_s.camera.readPrefix + 'y'];
      }));
      maxY = Math.max.apply(Math, v.map(function(n) {
        return n[_s.camera.readPrefix + 'y'];
      }));

      t = target(minX, maxX, minY, maxY);
    }
    else
      throw 'locate.nodes: Wrong arguments.';

    if (_o.focusOut && _s.settings('autoRescale')) {
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
   */
  Locate.prototype.edges = function(v, options) {
    if (arguments.length < 1)
      throw 'locate.edges: Wrong arguments.';

    if (arguments.length === 3 && typeof options !== "object")
      throw 'locate.edges: options must be an object.'

    var t,
        animationOpts = extend(options, _o.animation.edge),
        ratio = _s.camera.ratio;

    // One edge:
    if (typeof v === 'string') {
      var e = _s.graph.edges(v),
          snode = _s.graph.nodes(e.source),
          tnode = _s.graph.nodes(e.target),
          minX, maxX, minY, maxY;

      minX = Math.min(
        snode[_s.camera.readPrefix + 'x'],
        tnode[_s.camera.readPrefix + 'x']
      );
      maxX = Math.max(
        snode[_s.camera.readPrefix + 'x'],
        tnode[_s.camera.readPrefix + 'x']
      );
      minY = Math.min(
        snode[_s.camera.readPrefix + 'y'],
        tnode[_s.camera.readPrefix + 'y']
      );
      maxY = Math.max(
        snode[_s.camera.readPrefix + 'y'],
        tnode[_s.camera.readPrefix + 'y']
      );

      t = target(minX, maxX, minY, maxY);
    }

    // Array of edges:
    else if (
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var minX, maxX, minY, maxY;

      minX = Math.min.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[_s.camera.readPrefix + 'x'],
          e.target[_s.camera.readPrefix + 'x']
        );
      }));
      maxX = Math.max.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[_s.camera.readPrefix + 'x'],
          e.target[_s.camera.readPrefix + 'x']
        );
      }));
      minY = Math.min.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[_s.camera.readPrefix + 'y'],
          e.target[_s.camera.readPrefix + 'y']
        );
      }));
      maxY = Math.max.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[_s.camera.readPrefix + 'y'],
          e.target[_s.camera.readPrefix + 'y']
        );
      }));

      t = target(minX, maxX, minY, maxY, s);
    }
    else
      throw 'locate.edges: Wrong arguments.';

    if (_o.focusOut && _s.settings('autoRescale')) {
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
  };


  /**
   * This function will reset the location and zoom ratio of the camera.
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
   * @param  {number}  ratio   The target zoom ratio.
   * @param  {?object} options A dictionary with options for a possible
   *                           animation.
   */
  Locate.prototype.center = function(ratio, options) {
    var animationOpts = extend(options, _o.animation.center);
    if (_s.graph.nodes().length) {
      _instance.nodes(_s.graph.nodes(), animationOpts);
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
    if (!_instance) {
      _instance = new Locate(s, options);
    }
    return _instance;
  };

  /**
   *  This function kills the locate instance.
   */
  sigma.plugins.killLocate = function() {
    _instance = null;
    _o = null;
    _s = null;
  };

}).call(window);
