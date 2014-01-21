;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc.animation.running');

  /**
   * Generates a unique ID for the animation.
   *
   * @return {string} Returns the new ID.
   */
  var _getID = (function() {
    var id = 0;
    return function() {
      return '' + (++id);
    };
  })();

  /**
   * This function animates a camera. It has to be called with the camera to
   * animate, the values of the coordinates to reach and eventually some
   * options. It returns a number id, that you can use to kill the animation,
   * with the method sigma.misc.animation.kill(id).
   *
   * The available options are:
   *
   *   {?number}            duration   The duration of the animation.
   *   {?function}          onNewFrame A callback to execute when the animation
   *                                   enter a new frame.
   *   {?function}          onComplete A callback to execute when the animation
   *                                   is completed or killed.
   *   {?(string|function)} easing     The name of a function from the package
   *                                   sigma.utils.easings, or a custom easing
   *                                   function.
   *
   * @param  {camera}  camera  The camera to animate.
   * @param  {object}  target  The coordinates to reach.
   * @param  {?object} options Eventually an object to specify some options to
   *                           the function. The available options are
   *                           presented in the description of the function.
   * @return {number}          The animation id, to make it easy to kill
   *                           through the method "sigma.misc.animation.kill".
   */
  sigma.misc.animation.camera = function(camera, val, options) {
    if (
      !(camera instanceof sigma.classes.camera) ||
      typeof val !== 'object' ||
      !val
    )
      throw 'animation.camera: Wrong arguments.';

    if (
      typeof val.x !== 'number' &&
      typeof val.y !== 'number' &&
      typeof val.ratio !== 'number' &&
      typeof val.angle !== 'number'
    )
      throw 'There must be at least one valid coordinate in the given val.';

    var fn,
        id,
        anim,
        easing,
        duration,
        initialVal,
        o = options || {},
        start = sigma.utils.dateNow();

    // Store initial values:
    initialVal = {
      x: camera.x,
      y: camera.y,
      ratio: camera.ratio,
      angle: camera.angle
    };

    duration = o.duration;
    easing = typeof o.easing !== 'function' ?
      sigma.utils.easings[o.easing || 'quadraticInOut'] :
      o.easing;

    fn = function() {
      var coef,
          t = o.duration ? (sigma.utils.dateNow() - start) / o.duration : 1;

      // If the animation is over:
      if (t >= 1) {
        camera.isAnimated = false;
        camera.goTo({
          x: val.x !== undefined ? val.x : initialVal.x,
          y: val.y !== undefined ? val.y : initialVal.y,
          ratio: val.ratio !== undefined ? val.ratio : initialVal.ratio,
          angle: val.angle !== undefined ? val.angle : initialVal.angle
        });

        cancelAnimationFrame(id);
        delete sigma.misc.animation.running[id];

        // Check callbacks:
        if (typeof o.onComplete === 'function')
          o.onComplete();

      // Else, let's keep going:
      } else {
        coef = easing(t);
        camera.isAnimated = true;
        camera.goTo({
          x: val.x !== undefined ?
            initialVal.x + (val.x - initialVal.x) * coef :
            initialVal.x,
          y: val.y !== undefined ?
            initialVal.y + (val.y - initialVal.y) * coef :
            initialVal.y,
          ratio: val.ratio !== undefined ?
            initialVal.ratio + (val.ratio - initialVal.ratio) * coef :
            initialVal.ratio,
          angle: val.angle !== undefined ?
            initialVal.angle + (val.angle - initialVal.angle) * coef :
            initialVal.angle
        });

        // Check callbacks:
        if (typeof o.onNewFrame === 'function')
          o.onNewFrame();

        anim.frameId = requestAnimationFrame(fn);
      }
    };

    id = _getID();
    anim = {
      frameId: requestAnimationFrame(fn),
      target: camera,
      type: 'camera',
      options: o,
      fn: fn
    };
    sigma.misc.animation.running[id] = anim;

    return id;
  };

  /**
   * Kills a running animation. It triggers the eventual onComplete callback.
   *
   * @param  {number} id  The id of the animation to kill.
   * @return {object}     Returns the sigma.misc.animation package.
   */
  sigma.misc.animation.kill = function(id) {
    if (arguments.length !== 1 || typeof id !== 'number')
      throw 'animation.kill: Wrong arguments.';

    var o = sigma.misc.animation.running[id];

    if (o) {
      cancelAnimationFrame(id);
      delete sigma.misc.animation.running[o.frameId];

      if (o.type === 'camera')
        o.target.isAnimated = false;

      // Check callbacks:
      if (typeof (o.options || {}).onComplete === 'function')
        o.options.onComplete();
    }

    return this;
  };

  /**
   * Kills every running animations, or only the one with the specified type,
   * if a string parameter is given.
   *
   * @param  {?(string|object)} filter A string to filter the animations to kill
   *                                   on their type (example: "camera"), or an
   *                                   object to filter on their target.
   * @return {number}                  Returns the number of animations killed
   *                                   that way.
   */
  sigma.misc.animation.killAll = function(filter) {
    var o,
        id,
        count = 0,
        type = typeof filter === 'string' ? filter : null,
        target = typeof filter === 'object' ? filter : null,
        running = sigma.misc.animation.running;

    for (id in running)
      if (
        (!type || running[id].type === type) &&
        (!target || running[id].target === target)
      ) {
        o = sigma.misc.animation.running[id];
        cancelAnimationFrame(o.frameId);
        delete sigma.misc.animation.running[id];

        if (o.type === 'camera')
          o.target.isAnimated = false;

        // Increment counter:
        count++;

        // Check callbacks:
        if (typeof (o.options || {}).onComplete === 'function')
          o.options.onComplete();
      }

    return count;
  };

  /**
   * Returns "true" if any animation that is currently still running matches
   * the filter given to the function.
   *
   * @param  {string|object} filter A string to filter the animations to kill
   *                                on their type (example: "camera"), or an
   *                                object to filter on their target.
   * @return {boolean}              Returns true if any running animation
   *                                matches.
   */
  sigma.misc.animation.has = function(filter) {
    var id,
        type = typeof filter === 'string' ? filter : null,
        target = typeof filter === 'object' ? filter : null,
        running = sigma.misc.animation.running;

    for (id in running)
      if (
        (!type || running[id].type === type) &&
        (!target || running[id].target === target)
      )
        return true;

    return false;
  };
}).call(this);
