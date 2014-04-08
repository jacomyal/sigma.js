;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  var _root = this;

  // Initialize packages:
  sigma.utils = sigma.utils || {};

  /**
   * MISC UTILS:
   */
  /**
   * This function takes any number of objects as arguments, copies from each
   * of these objects each pair key/value into a new object, and finally
   * returns this object.
   *
   * The arguments are parsed from the last one to the first one, such that
   * when several objects have keys in common, the "earliest" object wins.
   *
   * Example:
   * ********
   *  > var o1 = {
   *  >       a: 1,
   *  >       b: 2,
   *  >       c: '3'
   *  >     },
   *  >     o2 = {
   *  >       c: '4',
   *  >       d: [ 5 ]
   *  >     };
   *  > sigma.utils.extend(o1, o2);
   *  > // Returns: {
   *  > //   a: 1,
   *  > //   b: 2,
   *  > //   c: '3',
   *  > //   d: [ 5 ]
   *  > // };
   *
   * @param  {object+} Any number of objects.
   * @return {object}  The merged object.
   */
  sigma.utils.extend = function() {
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
   * A short "Date.now()" polyfill.
   *
   * @return {Number} The current time (in ms).
   */
  sigma.utils.dateNow = function() {
    return Date.now ? Date.now() : new Date().getTime();
  };

  /**
   * Takes a package name as parameter and checks at each lebel if it exists,
   * and if it does not, creates it.
   *
   * Example:
   * ********
   *  > sigma.utils.pkg('a.b.c');
   *  > a.b.c;
   *  > // Object {};
   *  >
   *  > sigma.utils.pkg('a.b.d');
   *  > a.b;
   *  > // Object { c: {}, d: {} };
   *
   * @param  {string} pkgName The name of the package to create/find.
   * @return {object}         The related package.
   */
  sigma.utils.pkg = function(pkgName) {
    return (pkgName || '').split('.').reduce(function(context, objName) {
      return (objName in context) ?
        context[objName] :
        (context[objName] = {});
    }, _root);
  };

  /**
   * Returns a unique incremental number ID.
   *
   * Example:
   * ********
   *  > sigma.utils.id();
   *  > // 1;
   *  >
   *  > sigma.utils.id();
   *  > // 2;
   *  >
   *  > sigma.utils.id();
   *  > // 3;
   *
   * @param  {string} pkgName The name of the package to create/find.
   * @return {object}         The related package.
   */
  sigma.utils.id = (function() {
    var i = 0;
    return function() {
      return ++i;
    };
  })();

  /**
   * This function takes an hexa color (for instance "#ffcc00" or "#fc0") or a
   * rgb / rgba color (like "rgb(255,255,12)" or "rgba(255,255,12,1)") and
   * returns an integer equal to "r * 255 * 255 + g * 255 + b", to gain some
   * memory in the data given to WebGL shaders.
   *
   * @param  {string} val The hexa or rgba color.
   * @return {number}     The number value.
   */
  sigma.utils.floatColor = function(val) {
    var result = [0, 0, 0];

    if (val.match(/^#/)) {
      val = (val || '').replace(/^#/, '');
      result = (val.length === 3) ?
        [
          parseInt(val.charAt(0) + val.charAt(0), 16),
          parseInt(val.charAt(1) + val.charAt(1), 16),
          parseInt(val.charAt(2) + val.charAt(2), 16)
        ] :
        [
          parseInt(val.charAt(0) + val.charAt(1), 16),
          parseInt(val.charAt(2) + val.charAt(3), 16),
          parseInt(val.charAt(4) + val.charAt(5), 16)
        ];
    } else if (val.match(/^ *rgba? *\(/)) {
      val = val.match(
        /^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/
      );
      result = [
        +val[1],
        +val[2],
        +val[3]
      ];
    }

    return (
      result[0] * 256 * 256 +
      result[1] * 256 +
      result[2]
    );
  };

    /**
   * Perform a zoom into a camera, with or without animation, to the
   * coordinates indicated using a specified ratio.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the animation
   * object:
   *
   *   {?number} duration     An amount of time that means the duration of the
   *                          animation. If this parameter doesn't exist the
   *                          zoom will be performed without animation.
   *   {?function} onComplete A function to perform it after the animation. It
   *                          will be performed even if there is no duration.
   *
   * @param {camera}     The camera where perform the zoom.
   * @param {x}          The X coordiantion where the zoom goes.
   * @param {y}          The Y coordiantion where the zoom goes.
   * @param {ratio}      The ratio to apply it to the current camera ratio.
   * @param {?animation} A dictionary with options for a possible animation.
   */
  sigma.utils.zoomTo = function(camera, x, y, ratio, animation) {
    var settings = camera.settings,
        count,
        newRatio,
        animationSettings,
        coordinates;

    // Create the newRatio dealing with min / max:
    newRatio = Math.max(
      settings('zoomMin'),
      Math.min(
        settings('zoomMax'),
        camera.ratio * ratio
      )
    );

    // Check that the new ratio is different from the initial one:
    if (newRatio !== camera.ratio) {
      // Create the coordinates variable:
      ratio = newRatio / camera.ratio;
      coordinates = {
        x: x * (1 - ratio) + camera.x,
        y: y * (1 - ratio) + camera.y,
        ratio: newRatio
      };

      if (animation && animation.duration) {
        // Complete the animation setings:
        count = sigma.misc.animation.killAll(camera);
        animation = sigma.utils.extend(
          animation,
          {
            easing: count ? 'quadraticOut' : 'quadraticInOut'
          }
        );

        sigma.misc.animation.camera(camera, coordinates, animation);
      } else {
        camera.goTo(coordinates);
        if (animation && animation.onComplete)
          animation.onComplete();
      }
    }
  };




  /**
   * ************
   * EVENTS UTILS:
   * ************
   */
  /**
   * Here are some useful functions to unify extraction of the information we
   * need with mouse events and touch events, from different browsers:
   */

  /**
   * Extract the local X position from a mouse or touch event.
   *
   * @param  {event}  e A mouse or touch event.
   * @return {number}   The local X value of the mouse.
   */
  sigma.utils.getX = function(e) {
    return (
      (e.offsetX !== undefined && e.offsetX) ||
      (e.layerX !== undefined && e.layerX) ||
      (e.clientX !== undefined && e.clientX)
    );
  };

  /**
   * Extract the local Y position from a mouse or touch event.
   *
   * @param  {event}  e A mouse or touch event.
   * @return {number}   The local Y value of the mouse.
   */
  sigma.utils.getY = function(e) {
    return (
      (e.offsetY !== undefined && e.offsetY) ||
      (e.layerY !== undefined && e.layerY) ||
      (e.clientY !== undefined && e.clientY)
    );
  };

  /**
   * Extract the wheel delta from a mouse or touch event.
   *
   * @param  {event}  e A mouse or touch event.
   * @return {number}   The wheel delta of the mouse.
   */
  sigma.utils.getDelta = function(e) {
    return (
      (e.wheelDelta !== undefined && e.wheelDelta) ||
      (e.detail !== undefined && -e.detail)
    );
  };

  /**
   * Returns the offset of a DOM element.
   *
   * @param  {DOMElement} dom The element to retrieve the position.
   * @return {object}         The offset of the DOM element (top, left).
   */
  sigma.utils.getOffset = function(dom) {
    var left = 0,
        top = 0;

    while (dom) {
      top = top + parseInt(dom.offsetTop);
      left = left + parseInt(dom.offsetLeft);
      dom = dom.offsetParent;
    }

    return {
      top: top,
      left: left
    };
  };

  /**
   * Simulates a "double click" event.
   *
   * @param  {HTMLElement} target   The event target.
   * @param  {string}      type     The event type.
   * @param  {function}    callback The callback to execute.
   */
  sigma.utils.doubleClick = function(target, type, callback) {
    var clicks = 0,
        self = this,
        handlers;

    target._doubleClickHandler = target._doubleClickHandler || {};
    target._doubleClickHandler[type] = target._doubleClickHandler[type] || [];
    handlers = target._doubleClickHandler[type];

    handlers.push(function(e) {
      clicks++;

      if (clicks === 2) {
        clicks = 0;
        return callback(e);
      } else if (clicks === 1) {
        setTimeout(function() {
          clicks = 0;
        }, sigma.settings.doubleClickTimeout);
      }
    });

    target.addEventListener(type, handlers[handlers.length - 1], false);
  };

  /**
   * Unbind simulated "double click" events.
   *
   * @param  {HTMLElement} target   The event target.
   * @param  {string}      type     The event type.
   */
  sigma.utils.unbindDoubleClick = function(target, type) {
    var handler,
        handlers = (target._doubleClickHandler || {})[type] || [];

    while ((handler = handlers.pop())) {
      target.removeEventListener(type, handler);
    }

    delete (target._doubleClickHandler || {})[type];
  };




  /**
   * Here are just some of the most basic easing functions, used for the
   * animated camera "goTo" calls.
   *
   * If you need some more easings functions, don't hesitate to add them to
   * sigma.utils.easings. But I will not add some more here or merge PRs
   * containing, because I do not want sigma sources full of overkill and never
   * used stuff...
   */
  sigma.utils.easings = sigma.utils.easings || {};
  sigma.utils.easings.linearNone = function(k) {
    return k;
  };
  sigma.utils.easings.quadraticIn = function(k) {
    return k * k;
  };
  sigma.utils.easings.quadraticOut = function(k) {
    return k * (2 - k);
  };
  sigma.utils.easings.quadraticInOut = function(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k;
    return - 0.5 * (--k * (k - 2) - 1);
  };
  sigma.utils.easings.cubicIn = function(k) {
    return k * k * k;
  };
  sigma.utils.easings.cubicOut = function(k) {
    return --k * k * k + 1;
  };
  sigma.utils.easings.cubicInOut = function(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
  };




  /**
   * ************
   * WEBGL UTILS:
   * ************
   */
  /**
   * Loads a WebGL shader and returns it.
   *
   * @param  {WebGLContext}           gl           The WebGLContext to use.
   * @param  {string}                 shaderSource The shader source.
   * @param  {number}                 shaderType   The type of shader.
   * @param  {function(string): void} error        Callback for errors.
   * @return {WebGLShader}                         The created shader.
   */
  sigma.utils.loadShader = function(gl, shaderSource, shaderType, error) {
    var compiled,
        shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    // If something went wrong:
    if (!compiled) {
      if (error) {
        error(
          'Error compiling shader "' + shader + '":' +
          gl.getShaderInfoLog(shader)
        );
      }

      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  /**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   *
   * @param  {Array.<WebGLShader>}    shaders   The shaders to attach.
   * @param  {Array.<string>}         attribs   The attribs names.
   * @param  {Array.<number>}         locations The locations for the attribs.
   * @param  {function(string): void} error     Callback for errors.
   * @return {WebGLProgram}                     The created program.
   */
  sigma.utils.loadProgram = function(gl, shaders, attribs, loc, error) {
    var i,
        linked,
        program = gl.createProgram();

    for (i = 0; i < shaders.length; ++i)
      gl.attachShader(program, shaders[i]);

    if (attribs)
      for (i = 0; i < attribs.length; ++i)
        gl.bindAttribLocation(
          program,
          locations ? locations[i] : i,
          opt_attribs[i]
        );

    gl.linkProgram(program);

    // Check the link status
    linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      if (error)
        error('Error in program linking: ' + gl.getProgramInfoLog(program));

      gl.deleteProgram(program);
      return null;
    }

    return program;
  };




  /**
   * *********
   * MATRICES:
   * *********
   * The following utils are just here to help generating the transformation
   * matrices for the WebGL renderers.
   */
  sigma.utils.pkg('sigma.utils.matrices');

  /**
   * The returns a 3x3 translation matrix.
   *
   * @param  {number} dx The X translation.
   * @param  {number} dy The Y translation.
   * @return {array}     Returns the matrix.
   */
  sigma.utils.matrices.translation = function(dx, dy) {
    return [
      1, 0, 0,
      0, 1, 0,
      dx, dy, 1
    ];
  };

  /**
   * The returns a 3x3 or 2x2 rotation matrix.
   *
   * @param  {number}  angle The rotation angle.
   * @param  {boolean} m2    If true, the function will return a 2x2 matrix.
   * @return {array}         Returns the matrix.
   */
  sigma.utils.matrices.rotation = function(angle, m2) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);

    return m2 ? [
      cos, -sin,
      sin, cos
    ] : [
      cos, -sin, 0,
      sin, cos, 0,
      0, 0, 1
    ];
  };

  /**
   * The returns a 3x3 or 2x2 homothetic transformation matrix.
   *
   * @param  {number}  ratio The scaling ratio.
   * @param  {boolean} m2    If true, the function will return a 2x2 matrix.
   * @return {array}         Returns the matrix.
   */
  sigma.utils.matrices.scale = function(ratio, m2) {
    return m2 ? [
      ratio, 0,
      0, ratio
    ] : [
      ratio, 0, 0,
      0, ratio, 0,
      0, 0, 1
    ];
  };

  /**
   * The returns a 3x3 or 2x2 homothetic transformation matrix.
   *
   * @param  {array}   a  The first matrix.
   * @param  {array}   b  The second matrix.
   * @param  {boolean} m2 If true, the function will assume both matrices are
   *                      2x2.
   * @return {array}      Returns the matrix.
   */
  sigma.utils.matrices.multiply = function(a, b, m2) {
    var l = m2 ? 2 : 3,
        a00 = a[0 * l + 0],
        a01 = a[0 * l + 1],
        a02 = a[0 * l + 2],
        a10 = a[1 * l + 0],
        a11 = a[1 * l + 1],
        a12 = a[1 * l + 2],
        a20 = a[2 * l + 0],
        a21 = a[2 * l + 1],
        a22 = a[2 * l + 2],
        b00 = b[0 * l + 0],
        b01 = b[0 * l + 1],
        b02 = b[0 * l + 2],
        b10 = b[1 * l + 0],
        b11 = b[1 * l + 1],
        b12 = b[1 * l + 2],
        b20 = b[2 * l + 0],
        b21 = b[2 * l + 1],
        b22 = b[2 * l + 2];

    return m2 ? [
      a00 * b00 + a01 * b10,
      a00 * b01 + a01 * b11,
      a10 * b00 + a11 * b10,
      a10 * b01 + a11 * b11
    ] : [
      a00 * b00 + a01 * b10 + a02 * b20,
      a00 * b01 + a01 * b11 + a02 * b21,
      a00 * b02 + a01 * b12 + a02 * b22,
      a10 * b00 + a11 * b10 + a12 * b20,
      a10 * b01 + a11 * b11 + a12 * b21,
      a10 * b02 + a11 * b12 + a12 * b22,
      a20 * b00 + a21 * b10 + a22 * b20,
      a20 * b01 + a21 * b11 + a22 * b21,
      a20 * b02 + a21 * b12 + a22 * b22
    ];
  };
}).call(this);
