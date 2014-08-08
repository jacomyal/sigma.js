/**
 * This plugin provides a method to locate a node, a set of nodes, an edge, or
 * a set of edges.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');


  // TOOLING FUNCTIONS:
  // ******************
  function target(minX, maxX, minY, maxY, s) {
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
    rect = s.camera.getRectangle(maxX - minX, maxY - minY);
    width = rect.x2 - rect.x1 || 1;
    height = rect.height || 1;

    // Find graph boundaries:
    bounds = sigma.utils.getBoundaries(
      s.graph,
      s.camera.readPrefix
    );

    // Zoom ratio:
    var cHeight = bounds.maxY + bounds.sizeMax,
        cWidth = bounds.maxX + bounds.sizeMax,
        ratio,
        hRatio,
        wRatio;

    hRatio = height / cHeight;
    wRatio = width / cWidth;

    // Create the ratio dealing with min / max:
    ratio = Math.max(
      s.settings('zoomMin'),
      Math.min(
        s.settings('zoomMax'),
        s.camera.ratio / Math.min(hRatio, wRatio)
      )
    );

    console.log({
      x:x, y:y, ratio:ratio, hRatio:hRatio, wRatio:wRatio, height:height, width:width, cHeight:cHeight, cWidth:cWidth
    });

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
   * @param  {sigma}         s       The related sigma instance.
   * @param  {string|array}  v       Eventually one id, an array of ids.
   * @param  {?object}       options A dictionary with options for a possible
   *                                 animation.
   */
  sigma.plugins.locateNodes = function(s, v, options) {
    if (arguments.length < 2)
      throw 'locateNodes: Wrong arguments.';

    if (arguments.length === 3 && typeof options !== "object")
      throw 'locateNodes: options must be an object.'

    var t,
        ratio = s.camera.ratio;

    // One node:
    if (typeof v === 'string') {
      var n = s.graph.nodes(v);

      t = {
        x: n[s.camera.readPrefix + 'x'],
        y: n[s.camera.readPrefix + 'y'],
        ratio: s.settings('zoomMin')
      }
    }

    // Array of nodes:
    else if (
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var minX, maxX, minY, maxY;

      minX = Math.min.apply(Math, v.map(function(n) {
        return n[s.camera.readPrefix + 'x'];
      }));
      maxX = Math.max.apply(Math, v.map(function(n) {
        return n[s.camera.readPrefix + 'x'];
      }));
      minY = Math.min.apply(Math, v.map(function(n) {
        return n[s.camera.readPrefix + 'y'];
      }));
      maxY = Math.max.apply(Math, v.map(function(n) {
        return n[s.camera.readPrefix + 'y'];
      }));

      t = target(minX, maxX, minY, maxY, s);
    }
    else
      throw 'locateNodes: Wrong arguments.';

    sigma.misc.animation.camera(
      s.camera, 
      t,
      options
    );
  };




  sigma.plugins.locateEdges = function(s, v, options) {
    if (arguments.length < 2)
      throw 'locateNodes: Wrong arguments.';

    if (arguments.length === 3 && typeof options !== "object")
      throw 'locateNodes: options must be an object.'

    var t, 
        ratio = s.camera.ratio;

    // One edge:
    if (typeof v === 'string') {
      var e = s.graph.edges(v),
          snode = s.graph.nodes(e.source),
          tnode = s.graph.nodes(e.target),
          minX, maxX, minY, maxY;

      minX = Math.min(
        snode[s.camera.readPrefix + 'x'],
        tnode[s.camera.readPrefix + 'x']
      );
      maxX = Math.max(
        snode[s.camera.readPrefix + 'x'],
        tnode[s.camera.readPrefix + 'x']
      );
      minY = Math.min(
        snode[s.camera.readPrefix + 'y'],
        tnode[s.camera.readPrefix + 'y']
      );
      maxY = Math.max(
        snode[s.camera.readPrefix + 'y'],
        tnode[s.camera.readPrefix + 'y']
      );

      t = target(minX, maxX, minY, maxY, s);
    }

    // Array of edges:
    else if (
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var minX, maxX, minY, maxY;

      minX = Math.min.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[s.camera.readPrefix + 'x'],
          e.target[s.camera.readPrefix + 'x']
        );
      }));
      maxX = Math.max.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[s.camera.readPrefix + 'x'],
          e.target[s.camera.readPrefix + 'x']
        );
      }));
      minY = Math.min.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[s.camera.readPrefix + 'y'],
          e.target[s.camera.readPrefix + 'y']
        );
      }));
      maxY = Math.max.apply(Math, v.map(function(e) {
        return Math.min(
          e.source[s.camera.readPrefix + 'y'],
          e.target[s.camera.readPrefix + 'y']
        );
      }));

      t = target(minX, maxX, minY, maxY, s);
    }
    else
      throw 'locateEdges: Wrong arguments.';

    sigma.misc.animation.camera(
      s.camera, 
      t,
      options
    );
  };


}).call(window);
