(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sigma"] = factory();
	else
		root["Sigma"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(1);

var _easings = __webpack_require__(12);

var easings = _interopRequireWildcard(_easings);

var _utils = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js Camera Class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ======================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Class designed to store camera information & used to update it.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Defaults.
 */
var ANIMATE_DEFAULTS = {
  easing: 'quadraticInOut',
  duration: 150
};

var DEFAULT_ZOOMING_RATIO = 1.5;

// TODO: animate options = number polymorphism?
// TODO: pan, zoom, unzoom, reset, rotate, zoomTo
// TODO: add width / height to camera and add #.resize
// TODO: bind camera to renderer rather than sigma
// TODO: add #.graphToDisplay, #.displayToGraph, batch methods later

/**
 * Camera class
 *
 * @constructor
 */

var Camera = function (_EventEmitter) {
  _inherits(Camera, _EventEmitter);

  function Camera() {
    _classCallCheck(this, Camera);

    // Properties
    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    _this.x = 0.5;
    _this.y = 0.5;
    _this.angle = 0;
    _this.ratio = 1;

    // State
    _this.nextFrame = null;
    _this.previousState = _this.getState();
    _this.enabled = true;
    return _this;
  }

  /**
   * Method used to enable the camera.
   *
   * @return {Camera}
   */


  _createClass(Camera, [{
    key: 'enable',
    value: function enable() {
      this.enabled = true;
      return this;
    }

    /**
     * Method used to disable the camera.
     *
     * @return {Camera}
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.enabled = false;
      return this;
    }

    /**
     * Method used to retrieve the camera's current state.
     *
     * @return {object}
     */

  }, {
    key: 'getState',
    value: function getState() {
      return {
        x: this.x,
        y: this.y,
        angle: this.angle,
        ratio: this.ratio
      };
    }

    /**
     * Method used to retrieve the camera's previous state.
     *
     * @return {object}
     */

  }, {
    key: 'getPreviousState',
    value: function getPreviousState() {
      var state = this.previousState;

      return {
        x: state.x,
        y: state.y,
        angle: state.angle,
        ratio: state.ratio
      };
    }

    /**
     * Method used to check whether the camera is currently being animated.
     *
     * @return {boolean}
     */

  }, {
    key: 'isAnimated',
    value: function isAnimated() {
      return !!this.nextFrame;
    }

    /**
     * Method returning the coordinates of a point from the graph frame to the
     * viewport.
     *
     * @param  {object} dimensions - Dimensions of the viewport.
     * @param  {number} x          - The X coordinate.
     * @param  {number} y          - The Y coordinate.
     * @return {object}            - The point coordinates in the viewport.
     */

    // TODO: assign to gain one object
    // TODO: angles

  }, {
    key: 'graphToViewport',
    value: function graphToViewport(dimensions, x, y) {
      var smallestDimension = Math.min(dimensions.width, dimensions.height);

      var dx = smallestDimension / dimensions.width,
          dy = smallestDimension / dimensions.height;

      // TODO: we keep on the upper left corner!
      // TODO: how to normalize sizes?
      return {
        x: (x - this.x + this.ratio / 2 / dx) * (smallestDimension / this.ratio),
        y: (this.y - y + this.ratio / 2 / dy) * (smallestDimension / this.ratio)
      };
    }

    /**
     * Method returning the coordinates of a point from the viewport frame to the
     * graph frame.
     *
     * @param  {object} dimensions - Dimensions of the viewport.
     * @param  {number} x          - The X coordinate.
     * @param  {number} y          - The Y coordinate.
     * @return {object}            - The point coordinates in the graph frame.
     */

    // TODO: angles

  }, {
    key: 'viewportToGraph',
    value: function viewportToGraph(dimensions, x, y) {
      var smallestDimension = Math.min(dimensions.width, dimensions.height);

      var dx = smallestDimension / dimensions.width,
          dy = smallestDimension / dimensions.height;

      return {
        x: this.ratio / smallestDimension * x + this.x - this.ratio / 2 / dx,
        y: -(this.ratio / smallestDimension * y - this.y - this.ratio / 2 / dy)
      };
    }

    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */

    // TODO: angle

  }, {
    key: 'viewRectangle',
    value: function viewRectangle(dimensions) {

      // TODO: reduce relative margin?
      var marginX = 0 * dimensions.width / 8,
          marginY = 0 * dimensions.height / 8;

      var p1 = this.viewportToGraph(dimensions, 0 - marginX, 0 - marginY),
          p2 = this.viewportToGraph(dimensions, dimensions.width + marginX, 0 - marginY),
          h = this.viewportToGraph(dimensions, 0, dimensions.height + marginY);

      return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        height: p2.y - h.y
      };
    }

    /**
     * Method used to set the camera's state.
     *
     * @param  {object} state - New state.
     * @return {Camera}
     */

  }, {
    key: 'setState',
    value: function setState(state) {

      if (!this.enabled) return this;

      // TODO: validations
      // TODO: update by function

      // Keeping track of last state
      this.previousState = this.getState();

      if ('x' in state) this.x = state.x;

      if ('y' in state) this.y = state.y;

      if ('angle' in state) this.angle = state.angle;

      if ('ratio' in state) this.ratio = state.ratio;

      // Emitting
      // TODO: don't emit if nothing changed?
      this.emit('updated', this.getState());

      return this;
    }

    /**
     * Method used to animate the camera.
     *
     * @param  {object}   state      - State to reach eventually.
     * @param  {object}   options    - Options:
     * @param  {number}     duration - Duration of the animation.
     * @param  {function} callback   - Callback
     * @return {function}            - Return a function to cancel the animation.
     */

  }, {
    key: 'animate',
    value: function animate(state, options, callback) {
      var _this2 = this;

      if (!this.enabled) return this;

      // TODO: validation

      options = (0, _utils.assign)({}, ANIMATE_DEFAULTS, options);

      var easing = typeof options.easing === 'function' ? options.easing : easings[options.easing];

      // Canceling previous animation if needed
      if (this.nextFrame) cancelAnimationFrame(this.nextFrame);

      // State
      var start = Date.now(),
          initialState = this.getState();

      // Function performing the animation
      var fn = function fn() {
        var t = (Date.now() - start) / options.duration;

        // The animation is over:
        if (t >= 1) {
          _this2.nextFrame = null;
          _this2.setState(state);

          if (typeof callback === 'function') callback();

          return;
        }

        var coefficient = easing(t);

        var newState = {};

        if ('x' in state) newState.x = initialState.x + (state.x - initialState.x) * coefficient;
        if ('y' in state) newState.y = initialState.y + (state.y - initialState.y) * coefficient;
        if ('angle' in state) newState.angle = initialState.angle + (state.angle - initialState.angle) * coefficient;
        if ('ratio' in state) newState.ratio = initialState.ratio + (state.ratio - initialState.ratio) * coefficient;

        _this2.setState(newState);

        _this2.nextFrame = requestAnimationFrame(fn);
      };

      if (this.nextFrame) {
        cancelAnimationFrame(this.nextFrame);
        this.nextFrame = requestAnimationFrame(fn);
      } else {
        fn();
      }
    }

    /**
     * Method used to zoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */

  }, {
    key: 'animatedZoom',
    value: function animatedZoom(factorOrOptions) {

      if (!factorOrOptions) {
        return this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
      } else {
        if (typeof factorOrOptions === 'number') return this.animate({ ratio: this.ratio / factorOrOptions });else return this.animate({ ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO) }, factorOrOptions);
      }
    }

    /**
     * Method used to unzoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */

  }, {
    key: 'animatedUnzoom',
    value: function animatedUnzoom(factorOrOptions) {

      if (!factorOrOptions) {
        return this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
      } else {
        if (typeof factorOrOptions === 'number') return this.animate({ ratio: this.ratio * factorOrOptions });else return this.animate({ ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO) }, factorOrOptions);
      }
    }

    /**
     * Method used to reset the camera.
     *
     * @param  {object} options - Options.
     * @return {function}
     */

  }, {
    key: 'animatedReset',
    value: function animatedReset(options) {
      return this.animate({
        x: 0,
        y: 0,
        ratio: 1,
        angle: 0
      }, options);
    }
  }]);

  return Camera;
}(_events.EventEmitter);

exports.default = Camera;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatColor = floatColor;
exports.matrixFromCamera = matrixFromCamera;
exports.extractPixel = extractPixel;
exports.canUse32BitsIndices = canUse32BitsIndices;

var _matrices = __webpack_require__(21);

/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
var FLOAT_COLOR_CACHE = {}; /**
                             * Sigma.js WebGL Renderer Utils
                             * ==============================
                             *
                             * Miscelleanous helper functions used by sigma's WebGL renderer.
                             */

var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);

var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;

function floatColor(val) {

  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== 'undefined') return FLOAT_COLOR_CACHE[val];

  var r = 0,
      g = 0,
      b = 0,
      a = 1;

  // Handling hexadecimal notation
  if (val[0] === '#') {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    } else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
  }

  // Handling rgb notation
  else if (RGBA_TEST_REGEX.test(val)) {
      var match = val.match(RGBA_EXTRACT_REGEX);

      r = +match[1];
      g = +match[2];
      b = +match[3];

      if (match[4]) a = +match[4];
    }

  a = a * 255 | 0;

  var bits = (a << 24 | b << 16 | g << 8 | r) & 0xfeffffff;

  INT32[0] = bits;

  var color = FLOAT32[0];

  FLOAT_COLOR_CACHE[val] = color;

  return color;
}

/**
 * Function returning a matrix from the current state of the camera.
 */

// TODO: it's possible to optimize this drastically!
function matrixFromCamera(state, dimensions) {
  var angle = state.angle,
      ratio = state.ratio,
      x = state.x,
      y = state.y;
  var width = dimensions.width,
      height = dimensions.height;


  var matrix = (0, _matrices.identity)();

  var smallestDimension = Math.min(width, height);

  var cameraCentering = (0, _matrices.translate)((0, _matrices.identity)(), -x, -y),
      cameraScaling = (0, _matrices.scale)((0, _matrices.identity)(), 1 / ratio),
      cameraRotation = (0, _matrices.rotate)((0, _matrices.identity)(), -angle),
      viewportScaling = (0, _matrices.scale)((0, _matrices.identity)(), 2 * (smallestDimension / width), 2 * (smallestDimension / height));

  // Logical order is reversed
  (0, _matrices.multiply)(matrix, viewportScaling);
  (0, _matrices.multiply)(matrix, cameraRotation);
  (0, _matrices.multiply)(matrix, cameraScaling);
  (0, _matrices.multiply)(matrix, cameraCentering);

  return matrix;
}

/**
 * Function extracting the color at the given pixel.
 */
function extractPixel(gl, x, y, array) {
  var data = array || new Uint8Array(4);

  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);

  return data;
}

/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
function canUse32BitsIndices(gl) {
  var webgl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

  return webgl2 || !!gl.getExtension('OES_element_index_uint');
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js Renderer Class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Abstract classes extended by all of sigma's renderers.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Renderer class.
 *
 * @constructor
 */
var Renderer = function (_EventEmitter) {
  _inherits(Renderer, _EventEmitter);

  function Renderer() {
    _classCallCheck(this, Renderer);

    return _possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).apply(this, arguments));
  }

  return Renderer;
}(_events.EventEmitter);

exports.default = Renderer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assign = assign;
/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign(target) {
  target = target || {};

  for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }

  for (var i = 0, l = objects.length; i < l; i++) {
    if (!objects[i]) continue;

    for (var k in objects[i]) {
      target[k] = objects[i][k];
    }
  }

  return target;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 */


var _extend = __webpack_require__(13);

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.

// TODO: a square can be represented as topleft + width, saying for the quad blocks (reduce mem)

// TODO: jsdoc

// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size

// TODO: filtering unwanted labels beforehand through the filter function

// NOTE: this is basically a MX-CIF Quadtree at this point
// NOTE: need to explore R-Trees for edges
// NOTE: need to explore 2d segment tree for edges

// NOTE: probably can do faster using spatial hashing

/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
var BLOCKS = 4,
    MAX_LEVEL = 5;

var X_OFFSET = 0,
    Y_OFFSET = 1,
    WIDTH_OFFSET = 2,
    HEIGHT_OFFSET = 3;

var TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM_RIGHT = 4;

/**
 * Geometry helpers.
 */

/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @return {boolean}
 */
function isAxisAligned(x1, y1, x2, y2) {
  return x1 === x2 || y1 === y2;
}

function squareCollidesWithQuad(x1, y1, w, qx, qy, qw, qh) {
  return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}

function rectangleCollidesWithQuad(x1, y1, w, h, qx, qy, qw, qh) {
  return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}

function pointIsInQuad(x, y, qx, qy, qw, qh) {
  var xmp = qx + qw / 2,
      ymp = qy + qh / 2,
      top = y < ymp,
      left = x < xmp;

  return top ? left ? TOP_LEFT : TOP_RIGHT : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}

/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {

  // [block, level]
  var stack = [0, 0];

  while (stack.length) {
    var level = stack.pop(),
        block = stack.pop();

    var topLeftBlock = 4 * block + BLOCKS,
        topRightBlock = 4 * block + 2 * BLOCKS,
        bottomLeftBlock = 4 * block + 3 * BLOCKS,
        bottomRightBlock = 4 * block + 4 * BLOCKS;

    var x = data[block + X_OFFSET],
        y = data[block + Y_OFFSET],
        width = data[block + WIDTH_OFFSET],
        height = data[block + HEIGHT_OFFSET],
        hw = width / 2,
        hh = height / 2;

    data[topLeftBlock + X_OFFSET] = x;
    data[topLeftBlock + Y_OFFSET] = y;
    data[topLeftBlock + WIDTH_OFFSET] = hw;
    data[topLeftBlock + HEIGHT_OFFSET] = hh;

    data[topRightBlock + X_OFFSET] = x + hw;
    data[topRightBlock + Y_OFFSET] = y;
    data[topRightBlock + WIDTH_OFFSET] = hw;
    data[topRightBlock + HEIGHT_OFFSET] = hh;

    data[bottomLeftBlock + X_OFFSET] = x;
    data[bottomLeftBlock + Y_OFFSET] = y + hh;
    data[bottomLeftBlock + WIDTH_OFFSET] = hw;
    data[bottomLeftBlock + HEIGHT_OFFSET] = hh;

    data[bottomRightBlock + X_OFFSET] = x + hw;
    data[bottomRightBlock + Y_OFFSET] = y + hh;
    data[bottomRightBlock + WIDTH_OFFSET] = hw;
    data[bottomRightBlock + HEIGHT_OFFSET] = hh;

    if (level < maxLevel - 1) {
      stack.push(bottomRightBlock, level + 1);
      stack.push(bottomLeftBlock, level + 1);
      stack.push(topRightBlock, level + 1);
      stack.push(topLeftBlock, level + 1);
    }
  }
}

function insertNode(maxLevel, data, containers, key, x, y, size) {
  var x1 = x - size,
      y1 = y - size,
      w = size * 2;

  var level = 0,
      block = 0;

  while (true) {

    // If we reached max level
    if (level >= maxLevel) {
      containers[block] = containers[block] || [];
      containers[block].push(key);
      return;
    }

    var topLeftBlock = 4 * block + BLOCKS,
        topRightBlock = 4 * block + 2 * BLOCKS,
        bottomLeftBlock = 4 * block + 3 * BLOCKS,
        bottomRightBlock = 4 * block + 4 * BLOCKS;

    var collidingWithTopLeft = squareCollidesWithQuad(x1, y1, w, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);

    var collidingWithTopRight = squareCollidesWithQuad(x1, y1, w, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);

    var collidingWithBottomLeft = squareCollidesWithQuad(x1, y1, w, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);

    var collidingWithBottomRight = squareCollidesWithQuad(x1, y1, w, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);

    var collisions = collidingWithTopLeft + collidingWithTopRight + collidingWithBottomLeft + collidingWithBottomRight;

    // If we don't have at least a collision, there is an issue
    if (collisions === 0) throw new Error('sigma/quadtree.insertNode: no collision (level: ' + level + ', key: ' + key + ', x: ' + x + ', y: ' + y + ', size: ' + size + ').');

    // If we have 3 collisions, we have a geometry problem obviously
    if (collisions === 3) throw new Error('sigma/quadtree.insertNode: 3 impossible collisions (level: ' + level + ', key: ' + key + ', x: ' + x + ', y: ' + y + ', size: ' + size + ').');

    // If we have more that one collision, we stop here and store the node
    // in the relevant containers
    if (collisions > 1) {

      // NOTE: this is a nice way to optimize for hover, but not for frustum
      // since it requires to uniq the collected nodes
      // if (collisions < 4) {

      //   // If we intersect two quads, we place the node in those two
      //   if (collidingWithTopLeft) {
      //     containers[topLeftBlock] = containers[topLeftBlock] || [];
      //     containers[topLeftBlock].push(key);
      //   }
      //   if (collidingWithTopRight) {
      //     containers[topRightBlock] = containers[topRightBlock] || [];
      //     containers[topRightBlock].push(key);
      //   }
      //   if (collidingWithBottomLeft) {
      //     containers[bottomLeftBlock] = containers[bottomLeftBlock] || [];
      //     containers[bottomLeftBlock].push(key);
      //   }
      //   if (collidingWithBottomRight) {
      //     containers[bottomRightBlock] = containers[bottomRightBlock] || [];
      //     containers[bottomRightBlock].push(key);
      //   }
      // }
      // else {

      //   // Else we keep the node where it is to avoid more pointless computations
      //   containers[block] = containers[block] || [];
      //   containers[block].push(key);
      // }

      containers[block] = containers[block] || [];
      containers[block].push(key);

      return;
    } else {
      level++;
    }

    // Else we recurse into the correct quads
    if (collidingWithTopLeft) block = topLeftBlock;

    if (collidingWithTopRight) block = topRightBlock;

    if (collidingWithBottomLeft) block = bottomLeftBlock;

    if (collidingWithBottomRight) block = bottomRightBlock;
  }
}

function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {

  // [block, level]
  var stack = [0, 0];

  var collectedNodes = [];

  var container = void 0;

  while (stack.length) {
    var level = stack.pop(),
        block = stack.pop();

    // Collecting nodes
    container = containers[block];

    if (container) (0, _extend2.default)(collectedNodes, container);

    // If we reached max level
    if (level >= maxLevel) continue;

    var topLeftBlock = 4 * block + BLOCKS,
        topRightBlock = 4 * block + 2 * BLOCKS,
        bottomLeftBlock = 4 * block + 3 * BLOCKS,
        bottomRightBlock = 4 * block + 4 * BLOCKS;

    var collidingWithTopLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);

    var collidingWithTopRight = rectangleCollidesWithQuad(x1, y1, w, h, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);

    var collidingWithBottomLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);

    var collidingWithBottomRight = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);

    if (collidingWithTopLeft) stack.push(topLeftBlock, level + 1);

    if (collidingWithTopRight) stack.push(topRightBlock, level + 1);

    if (collidingWithBottomLeft) stack.push(bottomLeftBlock, level + 1);

    if (collidingWithBottomRight) stack.push(bottomRightBlock, level + 1);
  }

  return collectedNodes;
}

/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */

var QuadTree = function () {
  function QuadTree(params) {
    _classCallCheck(this, QuadTree);

    params = params || {};

    // Allocating the underlying byte array
    var L = Math.pow(4, MAX_LEVEL);

    this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
    this.containers = {};
    this.cache = null;
    this.lastRectangle = null;

    if (params.boundaries) this.resize(params.boundaries);else this.resize({
      x: 0,
      y: 0,
      width: 1,
      height: 1
    });

    if (typeof params.filter === 'function') this.nodeFilter = params.filter;
  }

  _createClass(QuadTree, [{
    key: 'add',
    value: function add(key, x, y, size) {
      insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);

      return this;
    }
  }, {
    key: 'resize',
    value: function resize(boundaries) {
      this.clear();

      // Building the quadrants
      this.data[X_OFFSET] = boundaries.x;
      this.data[Y_OFFSET] = boundaries.y;
      this.data[WIDTH_OFFSET] = boundaries.width;
      this.data[HEIGHT_OFFSET] = boundaries.height;

      buildQuadrants(MAX_LEVEL, this.data);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.containers = {};

      return this;
    }
  }, {
    key: 'point',
    value: function point(x, y) {
      var nodes = [];

      var block = 0,
          level = 0;

      do {
        if (this.containers[block]) nodes.push.apply(nodes, this.containers[block]);

        var quad = pointIsInQuad(x, y, this.data[block + X_OFFSET], this.data[block + Y_OFFSET], this.data[block + WIDTH_OFFSET], this.data[block + HEIGHT_OFFSET]);

        block = 4 * block + quad * BLOCKS;
        level++;
      } while (level <= MAX_LEVEL);

      return nodes;
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x1, y1, x2, y2, height) {
      var lr = this.lastRectangle;

      if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
        return this.cache;
      }

      this.lastRectangle = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        height: height
      };

      // Is the rectangle axis aligned?
      if (!isAxisAligned(x1, y1, x2, y2)) throw new Error('sigma/quadtree.rectangle: shifted view is not yet implemented.');

      var collectedNodes = getNodesInAxisAlignedRectangleArea(MAX_LEVEL, this.data, this.containers, x1, y1, Math.abs(x1 - x2) || Math.abs(y1 - y2), height);

      this.cache = collectedNodes;

      return this.cache;
    }
  }]);

  return QuadTree;
}();

exports.default = QuadTree;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _camera = __webpack_require__(0);

var _camera2 = _interopRequireDefault(_camera);

var _captor = __webpack_require__(14);

var _captor2 = _interopRequireDefault(_captor);

var _utils = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js Mouse Captor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ======================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma's captor dealing with the user's mouse.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Constants.
 */
var DRAG_TIMEOUT = 200,
    MOUSE_INERTIA_DURATION = 200,
    MOUSE_INERTIA_RATIO = 3,
    MOUSE_ZOOM_DURATION = 200,
    ZOOMING_RATIO = 1.7,
    DOUBLE_CLICK_TIMEOUT = 300,
    DOUBLE_CLICK_ZOOMING_RATIO = 2.2,
    DOUBLE_CLICK_ZOOMING_DURATION = 200;

/**
 * Mouse captor class.
 *
 * @constructor
 */

var MouseCaptor = function (_Captor) {
  _inherits(MouseCaptor, _Captor);

  function MouseCaptor(container, camera) {
    _classCallCheck(this, MouseCaptor);

    // Properties
    var _this = _possibleConstructorReturn(this, (MouseCaptor.__proto__ || Object.getPrototypeOf(MouseCaptor)).call(this, container, camera));

    _this.container = container;
    _this.camera = camera;

    // State
    _this.enabled = true;
    _this.hasDragged = false;
    _this.downStartTime = null;
    _this.lastMouseX = null;
    _this.lastMouseY = null;
    _this.isMouseDown = false;
    _this.isMoving = false;
    _this.movingTimeout = null;
    _this.startCameraState = null;
    _this.lastCameraState = null;
    _this.clicks = 0;
    _this.doubleClickTimeout = null;
    _this.wheelLock = false;

    // Binding methods
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleDown = _this.handleDown.bind(_this);
    _this.handleUp = _this.handleUp.bind(_this);
    _this.handleMove = _this.handleMove.bind(_this);
    _this.handleWheel = _this.handleWheel.bind(_this);
    _this.handleOut = _this.handleOut.bind(_this);

    // Binding events
    container.addEventListener('click', _this.handleClick, false);
    container.addEventListener('mousedown', _this.handleDown, false);
    container.addEventListener('mousemove', _this.handleMove, false);
    container.addEventListener('DOMMouseScroll', _this.handleWheel, false);
    container.addEventListener('mousewheel', _this.handleWheel, false);
    container.addEventListener('mouseout', _this.handleOut, false);

    document.addEventListener('mouseup', _this.handleUp, false);
    return _this;
  }

  _createClass(MouseCaptor, [{
    key: 'kill',
    value: function kill() {
      var container = this.container;

      container.removeEventListener('click', this.handleClick);
      container.removeEventListener('mousedown', this.handleDown);
      container.removeEventListener('mousemove', this.handleMove);
      container.removeEventListener('DOMMouseScroll', this.handleWheel);
      container.removeEventListener('mousewheel', this.handleWheel);
      container.removeEventListener('mouseout', this.handleOut);

      document.removeEventListener('mouseup', this.handleUp);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      var _this2 = this;

      if (!this.enabled) return;

      this.clicks++;

      if (this.clicks === 2) {
        this.clicks = 0;

        clearTimeout(this.doubleClickTimeout);
        this.doubleClickTimeout = null;

        return this.handleDoubleClick(e);
      }

      setTimeout(function () {
        _this2.clicks = 0;
        _this2.doubleClickTimeout = null;
      }, DOUBLE_CLICK_TIMEOUT);

      this.emit('click', (0, _utils.getMouseCoords)(e));
    }
  }, {
    key: 'handleDoubleClick',
    value: function handleDoubleClick(e) {
      if (!this.enabled) return;

      var center = (0, _utils.getCenter)(e);

      var cameraState = this.camera.getState();

      var newRatio = cameraState.ratio / DOUBLE_CLICK_ZOOMING_RATIO;

      // TODO: factorize
      var dimensions = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      };

      var clickX = (0, _utils.getX)(e),
          clickY = (0, _utils.getY)(e);

      // TODO: baaaad we mustn't mutate the camera, create a Camera.from or #.copy
      // TODO: factorize pan & zoomTo
      var cameraWithNewRatio = new _camera2.default();
      cameraWithNewRatio.ratio = newRatio;
      cameraWithNewRatio.x = cameraState.x;
      cameraWithNewRatio.y = cameraState.y;

      var clickGraph = this.camera.viewportToGraph(dimensions, clickX, clickY),
          centerGraph = this.camera.viewportToGraph(dimensions, center.x, center.y);

      var clickGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, clickX, clickY),
          centerGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, center.x, center.y);

      var deltaX = clickGraphNew.x - centerGraphNew.x - clickGraph.x + centerGraph.x,
          deltaY = clickGraphNew.y - centerGraphNew.y - clickGraph.y + centerGraph.y;

      this.camera.animate({
        x: cameraState.x - deltaX,
        y: cameraState.y - deltaY,
        ratio: newRatio
      }, {
        easing: 'quadraticInOut',
        duration: DOUBLE_CLICK_ZOOMING_DURATION
      });

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;

      e.stopPropagation();

      return false;
    }
  }, {
    key: 'handleDown',
    value: function handleDown(e) {
      if (!this.enabled) return;

      this.startCameraState = this.camera.getState();
      this.lastCameraState = this.startCameraState;

      this.lastMouseX = (0, _utils.getX)(e);
      this.lastMouseY = (0, _utils.getY)(e);

      this.hasDragged = false;

      this.downStartTime = Date.now();

      // TODO: dispatch events
      switch (e.which) {
        default:

          // Left button pressed
          this.isMouseDown = true;
          this.emit('mousedown', (0, _utils.getMouseCoords)(e));
      }
    }
  }, {
    key: 'handleUp',
    value: function handleUp(e) {
      if (!this.enabled || !this.isMouseDown) return;

      this.isMouseDown = false;

      if (this.movingTimeout) {
        this.movingTimeout = null;
        clearTimeout(this.movingTimeout);
      }

      var x = (0, _utils.getX)(e),
          y = (0, _utils.getY)(e);

      var cameraState = this.camera.getState(),
          previousCameraState = this.camera.getPreviousState();

      if (this.isMoving) {
        this.camera.animate({
          x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
          y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y)
        }, {
          duration: MOUSE_INERTIA_DURATION,
          easing: 'quadraticOut'
        });
      } else if (this.lastMouseX !== x || this.lastMouseY !== y) {
        this.camera.setState({
          x: cameraState.x,
          y: cameraState.y
        });
      }

      this.isMoving = false;
      this.hasDragged = false;
      this.emit('mouseup', (0, _utils.getMouseCoords)(e));
    }
  }, {
    key: 'handleMove',
    value: function handleMove(e) {
      var _this3 = this;

      if (!this.enabled) return;

      this.emit('mousemove', (0, _utils.getMouseCoords)(e));

      if (this.isMouseDown) {

        // TODO: dispatch events
        this.isMoving = true;
        this.hasDragged = true;

        if (this.movingTimeout) clearTimeout(this.movingTimeout);

        this.movingTimeout = setTimeout(function () {
          _this3.movingTimeout = null;
          _this3.isMoving = false;
        }, DRAG_TIMEOUT);

        var dimensions = {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight
        };

        var eX = (0, _utils.getX)(e),
            eY = (0, _utils.getY)(e);

        var lastMouse = this.camera.viewportToGraph(dimensions, this.lastMouseX, this.lastMouseY);

        var mouse = this.camera.viewportToGraph(dimensions, eX, eY);

        var offsetX = lastMouse.x - mouse.x,
            offsetY = lastMouse.y - mouse.y;

        var cameraState = this.camera.getState();

        var x = cameraState.x + offsetX,
            y = cameraState.y + offsetY;

        this.camera.setState({ x: x, y: y });

        this.lastMouseX = eX;
        this.lastMouseY = eY;
      }

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;

      e.stopPropagation();

      return false;
    }
  }, {
    key: 'handleWheel',
    value: function handleWheel(e) {
      var _this4 = this;

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;

      e.stopPropagation();

      if (!this.enabled) return false;

      var delta = (0, _utils.getWheelDelta)(e);

      if (!delta) return false;

      if (this.wheelLock) return false;

      this.wheelLock = true;

      // TODO: handle max zoom
      var ratio = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;

      var cameraState = this.camera.getState();

      var newRatio = ratio * cameraState.ratio;

      var center = (0, _utils.getCenter)(e);

      var dimensions = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      };

      var clickX = (0, _utils.getX)(e),
          clickY = (0, _utils.getY)(e);

      // TODO: baaaad we mustn't mutate the camera, create a Camera.from or #.copy
      // TODO: factorize pan & zoomTo
      var cameraWithNewRatio = new _camera2.default();
      cameraWithNewRatio.ratio = newRatio;
      cameraWithNewRatio.x = cameraState.x;
      cameraWithNewRatio.y = cameraState.y;

      var clickGraph = this.camera.viewportToGraph(dimensions, clickX, clickY),
          centerGraph = this.camera.viewportToGraph(dimensions, center.x, center.y);

      var clickGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, clickX, clickY),
          centerGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, center.x, center.y);

      var deltaX = clickGraphNew.x - centerGraphNew.x - clickGraph.x + centerGraph.x,
          deltaY = clickGraphNew.y - centerGraphNew.y - clickGraph.y + centerGraph.y;

      this.camera.animate({
        x: cameraState.x - deltaX,
        y: cameraState.y - deltaY,
        ratio: newRatio
      }, {
        easing: 'linear',
        duration: MOUSE_ZOOM_DURATION
      }, function () {
        return _this4.wheelLock = false;
      });

      return false;
    }
  }, {
    key: 'handleOut',
    value: function handleOut() {
      // TODO: dispatch event
    }
  }]);

  return MouseCaptor;
}(_captor2.default);

exports.default = MouseCaptor;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createElement = createElement;
exports.getPixelRatio = getPixelRatio;
exports.createNormalizationFunction = createNormalizationFunction;
/**
 * Sigma.js Rendering Utils
 * ===========================
 *
 * Helpers used by most renderers.
 */

/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
function createElement(tag, attributes) {
  var element = document.createElement(tag);

  if (!attributes) return element;

  for (var k in attributes) {
    if (k === 'style') {
      for (var s in attributes[k]) {
        element.style[s] = attributes[k][s];
      }
    } else {
      element.setAttribute(k, attributes[k]);
    }
  }

  return element;
}

/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
function getPixelRatio() {
  var screen = window.screen;

  if (typeof screen.deviceXDPI !== 'undefined' && typeof screen.logicalXDPI !== 'undefined' && screen.deviceXDPI > screen.logicalXDPI) return screen.systemXDPI / screen.logicalXDPI;else if (typeof window.devicePixelRatio !== 'undefined') return window.devicePixelRatio;

  return 1;
}

/**
 * Factory returning a function normalizing the given node's position & size.
 *
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
function createNormalizationFunction(extent) {
  var _extent$x = _slicedToArray(extent.x, 2),
      minX = _extent$x[0],
      maxX = _extent$x[1],
      _extent$y = _slicedToArray(extent.y, 2),
      minY = _extent$y[0],
      maxY = _extent$y[1];

  var ratio = Math.max(maxX - minX, maxY - minY);

  var dX = (maxX + minX) / 2,
      dY = (maxY + minY) / 2;

  var fn = function fn(data) {
    return {
      x: 0.5 + (data.x - dX) / ratio,
      y: 0.5 + (data.y - dY) / ratio
    };
  };

  // TODO: possibility to apply this in batch over array of indices
  fn.applyTo = function (data) {
    data.x = 0.5 + (data.x - dX) / ratio;
    data.y = 0.5 + (data.y - dY) / ratio;
  };

  fn.inverse = function (data) {
    return {
      x: dX + ratio * (data.x - 0.5),
      y: dY + ratio * (data.y - 0.5)
    };
  };

  fn.ratio = ratio;

  return fn;
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNodes === 'function' &&
    typeof value.multi === 'boolean'
  );
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Sigma.js WebGL Renderer Program
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * ================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Class representing a single WebGL program used by sigma's WebGL renderer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.createCompoundProgram = createCompoundProgram;

var _utils = __webpack_require__(20);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Program class.
 *
 * @constructor
 */
var Program = function () {
  function Program(gl, vertexShaderSource, fragmentShaderSource) {
    _classCallCheck(this, Program);

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;

    this.load(gl);
  }

  /**
   * Method used to load the program into a webgl context.
   *
   * @param  {WebGLContext} gl - The WebGL context.
   * @return {WebGLProgram}
   */


  _createClass(Program, [{
    key: 'load',
    value: function load(gl) {
      this.vertexShader = (0, _utils.loadVertexShader)(gl, this.vertexShaderSource);
      this.fragmentShader = (0, _utils.loadFragmentShader)(gl, this.fragmentShaderSource);

      this.program = (0, _utils.loadProgram)(gl, [this.vertexShader, this.fragmentShader]);

      return this.program;
    }
  }]);

  return Program;
}();

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */

// TODO: maybe those should handle their own canvases


exports.default = Program;
function createCompoundProgram(programClasses) {
  return function () {
    function CompoundProgram(gl) {
      _classCallCheck(this, CompoundProgram);

      this.programs = programClasses.map(function (ProgramClass) {
        return new ProgramClass(gl);
      });
    }

    _createClass(CompoundProgram, [{
      key: 'allocate',
      value: function allocate(capacity) {
        this.programs.forEach(function (program) {
          return program.allocate(capacity);
        });
      }
    }, {
      key: 'process',
      value: function process() {
        var args = arguments;

        this.programs.forEach(function (program) {
          return program.process.apply(program, _toConsumableArray(args));
        });
      }
    }, {
      key: 'computeIndices',
      value: function computeIndices() {
        this.programs.forEach(function (program) {
          if (typeof program.computeIndices === 'function') program.computeIndices();
        });
      }
    }, {
      key: 'bufferData',
      value: function bufferData() {
        this.programs.forEach(function (program) {
          return program.bufferData();
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var args = arguments;

        this.programs.forEach(function (program) {
          program.bind();
          program.bufferData();
          program.render.apply(program, _toConsumableArray(args));
        });
      }
    }]);

    return CompoundProgram;
  }();
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawLabel;
/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 */
function drawLabel(context, data, settings) {
  var size = settings.labelSize,
      font = settings.labelFont,
      weight = settings.labelWeight;

  context.fillStyle = '#000';
  context.font = weight + ' ' + size + 'px ' + font;

  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGLRenderer = exports.MouseCaptor = exports.QuadTree = exports.Camera = exports.Renderer = undefined;

var _renderer = __webpack_require__(3);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(0);

var _camera2 = _interopRequireDefault(_camera);

var _quadtree = __webpack_require__(5);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _mouse = __webpack_require__(6);

var _mouse2 = _interopRequireDefault(_mouse);

var _webgl = __webpack_require__(16);

var _webgl2 = _interopRequireDefault(_webgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Renderer = _renderer2.default;
exports.Camera = _camera2.default;
exports.QuadTree = _quadtree2.default;
exports.MouseCaptor = _mouse2.default;
exports.WebGLRenderer = _webgl2.default; /**
                                          * Sigma.js Library Endpoint
                                          * ==========================
                                          *
                                          * The library endpoint.
                                          */

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 */
var linear = exports.linear = function linear(k) {
  return k;
};

var quadraticIn = exports.quadraticIn = function quadraticIn(k) {
  return k * k;
};

var quadraticOut = exports.quadraticOut = function quadraticOut(k) {
  return k * (2 - k);
};

var quadraticInOut = exports.quadraticInOut = function quadraticInOut(k) {
  if ((k *= 2) < 1) return 0.5 * k * k;
  return -0.5 * (--k * (k - 2) - 1);
};

var cubicIn = exports.cubicIn = function cubicIn(k) {
  return k * k * k;
};

var cubicOut = exports.cubicOut = function cubicOut(k) {
  return --k * k * k + 1;
};

var cubicInOut = exports.cubicInOut = function cubicInOut(k) {
  if ((k *= 2) < 1) return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 *
 * Its strategy is to mutate target array's length then setting the new indices
 * to be the values to add.
 *
 * A benchmark proved that it is faster than the following strategies:
 *   1) `array.push.apply(array, values)`.
 *   2) A loop of pushes.
 *   3) `array = array.concat(values)`, obviously.
 *
 * Intuitively, this is correct because when adding a lot of elements, the
 * chosen strategies does not need to handle the `arguments` object to
 * execute #.apply's variadicity and because the array know its final length
 * at the beginning, avoiding potential multiple reallocations of the underlying
 * contiguous array. Some engines may be able to optimize the loop of push
 * operations but empirically they don't seem to do so.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - Values to add.
 */
module.exports = function extend(array, values) {
  var l1 = array.length,
      l2 = values.length;

  if (l2 === 0)
    return;

  array.length += values.length;

  for (var i = 0; i < l2; i++)
    array[l1 + i] = values[i];
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js Captor Class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ======================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Abstract class representing a captor like the user's mouse or touch controls.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Captor = function (_EventEmitter) {
  _inherits(Captor, _EventEmitter);

  function Captor(container, camera) {
    _classCallCheck(this, Captor);

    // Properties
    var _this = _possibleConstructorReturn(this, (Captor.__proto__ || Object.getPrototypeOf(Captor)).call(this));

    _this.container = container;
    _this.camera = camera;
    return _this;
  }

  return Captor;
}(_events.EventEmitter);

exports.default = Captor;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getX = getX;
exports.getY = getY;
exports.getWidth = getWidth;
exports.getHeight = getHeight;
exports.getCenter = getCenter;
exports.getMouseCoords = getMouseCoords;
exports.getWheelDelta = getWheelDelta;

var _utils = __webpack_require__(7);

/**
 * Extract the local X position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local X value of the mouse.
 */
function getX(e) {
  if (typeof e.offsetX !== 'undefined') return e.offsetX;

  if (typeof e.layerX !== 'undefined') return e.layerX;

  if (typeof e.clientX !== 'undefined') return e.clientX;

  throw new Error('sigma/captors/utils.getX: could not extract x from event.');
}

/**
 * Extract the local Y position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local Y value of the mouse.
 */
/**
 * Sigma.js Captor Utils
 * ======================
 *
 * Miscellenous helper functions related to the captors.
 */
function getY(e) {
  if (typeof e.offsetY !== 'undefined') return e.offsetY;

  if (typeof e.layerY !== 'undefined') return e.layerY;

  if (typeof e.clientY !== 'undefined') return e.clientY;

  throw new Error('sigma/captors/utils.getY: could not extract y from event.');
}

/**
 * Extract the width from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The width of the event's target.
 */
function getWidth(e) {
  var w = !e.target.ownerSVGElement ? e.target.width : e.target.ownerSVGElement.width;

  if (typeof w === 'number') return w;

  if (w !== undefined && w.baseVal !== undefined) return w.baseVal.value;

  throw new Error('sigma/captors/utils.getWidth: could not extract width from event.');
}

/**
 * Extract the height from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The height of the event's target.
 */
function getHeight(e) {
  var w = !e.target.ownerSVGElement ? e.target.height : e.target.ownerSVGElement.height;

  if (typeof w === 'number') return w;

  if (w !== undefined && w.baseVal !== undefined) return w.baseVal.value;

  throw new Error('sigma/captors/utils.getHeight: could not extract height from event.');
}

/**
 * Extract the center from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {object}     The center of the event's target.
 */
function getCenter(e) {
  var ratio = e.target.namespaceURI.indexOf('svg') !== -1 ? 1 : (0, _utils.getPixelRatio)();

  return {
    x: getWidth(e) / (2 * ratio),
    y: getHeight(e) / (2 * ratio)
  };
}

/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}   e   - A mouse or touch event.
 * @param  {number}  [x] - The x coord to convert
 * @param  {number}  [y] - The y coord to convert
 *
 * @return {object}
 */
function getMouseCoords(e) {
  return {
    x: getX(e),
    y: getY(e),
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey
  };
}

/**
 * Extract the wheel delta from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The wheel delta of the mouse.
 */
function getWheelDelta(e) {
  if (typeof e.wheelDelta !== 'undefined') return e.wheelDelta / 360;

  if (typeof e.detail !== 'undefined') return e.detail / -9;

  throw new Error('sigma/captors/utils.getDelta: could not extract delta from event.');
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = __webpack_require__(17);

var _isGraph = __webpack_require__(8);

var _isGraph2 = _interopRequireDefault(_isGraph);

var _renderer = __webpack_require__(3);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(0);

var _camera2 = _interopRequireDefault(_camera);

var _mouse = __webpack_require__(6);

var _mouse2 = _interopRequireDefault(_mouse);

var _quadtree = __webpack_require__(5);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _displayData2 = __webpack_require__(18);

var _node = __webpack_require__(19);

var _node2 = _interopRequireDefault(_node);

var _edge = __webpack_require__(24);

var _edge2 = _interopRequireDefault(_edge);

var _label = __webpack_require__(10);

var _label2 = _interopRequireDefault(_label);

var _hover = __webpack_require__(27);

var _hover2 = _interopRequireDefault(_hover);

var _utils = __webpack_require__(4);

var _utils2 = __webpack_require__(7);

var _utils3 = __webpack_require__(2);

var _labels = __webpack_require__(29);

var _zIndex = __webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js WebGL Renderer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * File implementing sigma's WebGL Renderer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Constants.
 */
var PIXEL_RATIO = (0, _utils2.getPixelRatio)();
var WEBGL_OVERSAMPLING_RATIO = (0, _utils2.getPixelRatio)();

/**
 * Defaults.
 */
var DEFAULT_SETTINGS = {

  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,

  // Component rendering
  defaultNodeColor: '#999',
  defaultEdgeColor: '#ccc',
  labelFont: 'Arial',
  labelSize: 14,
  labelWeight: 'normal',
  nodeReducer: null,
  edgeReducer: null,

  // Features
  zIndex: false
};

/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */

var WebGLRenderer = function (_Renderer) {
  _inherits(WebGLRenderer, _Renderer);

  function WebGLRenderer(graph, container, settings) {
    _classCallCheck(this, WebGLRenderer);

    var _this = _possibleConstructorReturn(this, (WebGLRenderer.__proto__ || Object.getPrototypeOf(WebGLRenderer)).call(this));

    settings = settings || {};

    _this.settings = (0, _utils.assign)({}, DEFAULT_SETTINGS, settings);

    // Validating
    if (!(0, _isGraph2.default)(graph)) throw new Error('sigma/renderers/webgl: invalid graph instance.');

    if (!(container instanceof HTMLElement)) throw new Error('sigma/renderers/webgl: container should be an html element.');

    // Properties
    _this.graph = graph;
    _this.captors = {};
    _this.container = container;
    _this.elements = {};
    _this.contexts = {};
    _this.listeners = {};

    // Indices & cache
    // TODO: this could be improved by key => index => floatArray
    // TODO: the cache should erase keys on node delete & add new
    _this.quadtree = new _quadtree2.default();
    _this.nodeDataCache = {};
    _this.edgeDataCache = {};
    _this.nodeExtent = null;
    _this.edgeExtent = null;

    _this.initializeCache();

    // Normalization function
    _this.normalizationFunction = null;

    // Starting dimensions
    _this.width = 0;
    _this.height = 0;

    // State
    _this.highlightedNodes = new Set();
    _this.displayedLabels = new Set();
    _this.hoveredNode = null;
    _this.wasRenderedInThisFrame = false;
    _this.renderFrame = null;
    _this.renderHighlightedNodesFrame = null;
    _this.needToProcess = false;
    _this.needToSoftProcess = false;

    // Initializing contexts
    _this.createContext('edges');
    _this.createContext('nodes');
    _this.createContext('labels', false);
    _this.createContext('hovers', false);
    _this.createContext('mouse', false);

    // Blending
    var gl = _this.contexts.nodes;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    gl = _this.contexts.edges;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // Loading programs
    _this.nodePrograms = {
      def: new _node2.default(_this.contexts.nodes)
    };
    _this.edgePrograms = {
      def: new _edge2.default(_this.contexts.edges)
    };

    // Initial resize
    _this.resize();

    // Initializing the camera
    _this.camera = new _camera2.default({
      width: _this.width,
      height: _this.height
    });

    // Binding camera events
    _this.bindCameraHandlers();

    // Initializing captors
    _this.captors = {
      mouse: new _mouse2.default(_this.elements.mouse, _this.camera)
    };

    // Binding event handlers
    _this.bindEventHandlers();

    // Binding graph handlers
    _this.bindGraphHandlers();

    // Processing data for the first time & render
    _this.process();
    _this.render();
    return _this;
  }

  /**---------------------------------------------------------------------------
   * Internal methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Internal function used to create a canvas context and add the relevant
   * DOM elements.
   *
   * @param  {string}  id    - Context's id.
   * @param  {boolean} webgl - Whether the context is a webgl or canvas one.
   * @return {WebGLRenderer}
   */


  _createClass(WebGLRenderer, [{
    key: 'createContext',
    value: function createContext(id) {
      var webgl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var element = (0, _utils2.createElement)('canvas', {
        class: 'sigma-' + id,
        style: {
          position: 'absolute'
        }
      });

      this.elements[id] = element;
      this.container.appendChild(element);

      var contextOptions = {
        preserveDrawingBuffer: false,
        antialias: false
      };

      var context = void 0;

      if (webgl) {

        // First we try webgl2 for an easy performance boost
        context = element.getContext('webgl2', contextOptions);

        // Else we fall back to webgl
        if (!context) context = element.getContext('webgl', contextOptions);

        // Edge, I am looking right at you...
        if (!context) context = element.getContext('experimental-webgl', contextOptions);
      } else {
        context = element.getContext('2d', contextOptions);
      }

      this.contexts[id] = context;

      return this;
    }

    /**
     * Method used to initialize display data cache.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'initializeCache',
    value: function initializeCache() {
      var graph = this.graph;

      var nodes = graph.nodes();

      for (var i = 0, l = nodes.length; i < l; i++) {
        this.nodeDataCache[nodes[i]] = new _displayData2.NodeDisplayData(i, this.settings);
      }var edges = graph.edges();

      for (var _i = 0, _l = edges.length; _i < _l; _i++) {
        this.edgeDataCache[edges[_i]] = new _displayData2.EdgeDisplayData(_i, this.settings);
      }
    }

    /**
     * Method binding camera handlers.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'bindCameraHandlers',
    value: function bindCameraHandlers() {
      var _this2 = this;

      this.listeners.camera = function () {
        _this2.scheduleRender();
      };

      this.camera.on('updated', this.listeners.camera);

      return this;
    }

    /**
     * Method binding event handlers.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'bindEventHandlers',
    value: function bindEventHandlers() {
      var _this3 = this;

      // Handling window resize
      this.listeners.handleResize = function () {
        _this3.needToSoftProcess = true;
        _this3.scheduleRender();
      };

      window.addEventListener('resize', this.listeners.handleResize);

      // Function checking if the mouse is on the given node
      var mouseIsOnNode = function mouseIsOnNode(mouseX, mouseY, nodeX, nodeY, size) {
        return mouseX > nodeX - size && mouseX < nodeX + size && mouseY > nodeY - size && mouseY < nodeY + size && Math.sqrt(Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2)) < size;
      };

      // Function returning the nodes in the mouse's quad
      var getQuadNodes = function getQuadNodes(mouseX, mouseY) {

        var mouseGraphPosition = _this3.camera.viewportToGraph(_this3, mouseX, mouseY);

        // TODO: minus 1? lol
        return _this3.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
      };

      // Handling mouse move
      this.listeners.handleMove = function (e) {

        // NOTE: for the canvas renderer, testing the pixel's alpha should
        // give some boost but this slows things down for WebGL empirically.

        // TODO: this should be a method from the camera (or can be passed to graph to display somehow)
        var sizeRatio = Math.pow(_this3.camera.getState().ratio, 0.5);

        var quadNodes = getQuadNodes(e.x, e.y);

        // We will hover the node whose center is closest to mouse
        var minDistance = Infinity,
            nodeToHover = null;

        for (var i = 0, l = quadNodes.length; i < l; i++) {
          var node = quadNodes[i];

          var data = _this3.nodeDataCache[node];

          var pos = _this3.camera.graphToViewport(_this3, data.x, data.y);

          var size = data.size / sizeRatio;

          if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
            var distance = Math.sqrt(Math.pow(e.x - pos.x, 2) + Math.pow(e.y - pos.y, 2));

            // TODO: sort by min size also for cases where center is the same
            if (distance < minDistance) {
              minDistance = distance;
              nodeToHover = node;
            }
          }
        }

        if (nodeToHover) {
          _this3.hoveredNode = nodeToHover;
          _this3.emit('overNode', { node: nodeToHover });
          return _this3.scheduleHighlightedNodesRender();
        }

        // Checking if the hovered node is still hovered
        if (_this3.hoveredNode) {
          var _data = _this3.nodeDataCache[_this3.hoveredNode];

          var _pos = _this3.camera.graphToViewport(_this3, _data.x, _data.y);

          var _size = _data.size / sizeRatio;

          if (!mouseIsOnNode(e.x, e.y, _pos.x, _pos.y, _size)) {
            _this3.hoveredNode = null;

            _this3.emit('outNode', { node: _this3.hoveredNode });
            return _this3.scheduleHighlightedNodesRender();
          }
        }
      };

      // Handling down
      this.listeners.handleDown = function (e) {
        var sizeRatio = Math.pow(_this3.camera.getState().ratio, 0.5);

        var quadNodes = getQuadNodes(e.x, e.y);

        for (var i = 0, l = quadNodes.length; i < l; i++) {
          var node = quadNodes[i];

          var data = _this3.nodeDataCache[node];

          var pos = _this3.camera.graphToViewport(_this3, data.x, data.y);

          var size = data.size / sizeRatio;

          if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) return _this3.emit('downNode', { node: node });
        }
      };

      // Handling click
      this.listeners.handleClick = function (e) {
        var sizeRatio = Math.pow(_this3.camera.getState().ratio, 0.5);

        var quadNodes = getQuadNodes(e.x, e.y);

        for (var i = 0, l = quadNodes.length; i < l; i++) {
          var node = quadNodes[i];

          var data = _this3.nodeDataCache[node];

          var pos = _this3.camera.graphToViewport(_this3, data.x, data.y);

          var size = data.size / sizeRatio;

          if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) return _this3.emit('clickNode', { node: node });
        }

        return _this3.emit('clickStage');
      };

      // TODO: optimize, we don't need to repeat collisions
      this.captors.mouse.on('mousemove', this.listeners.handleMove);
      this.captors.mouse.on('mousedown', this.listeners.handleDown);
      this.captors.mouse.on('click', this.listeners.handleClick);

      return this;
    }

    /**
     * Method binding graph handlers
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'bindGraphHandlers',
    value: function bindGraphHandlers() {
      var _this4 = this;

      var graph = this.graph;

      this.listeners.graphUpdate = function () {
        _this4.needToProcess = true;
        _this4.scheduleRender();
      };

      this.listeners.softGraphUpdate = function () {
        _this4.needToSoftProcess = true;
        _this4.scheduleRender();
      };

      // TODO: bind this on composed state events
      // TODO: it could be possible to update only specific node etc. by holding
      // a fixed-size pool of updated items
      graph.on('nodeAdded', this.listeners.graphUpdate);
      graph.on('nodeDropped', this.listeners.graphUpdate);
      graph.on('nodeAttributesUpdated', this.listeners.softGraphUpdate);
      graph.on('edgeAdded', this.listeners.graphUpdate);
      graph.on('nodeDropped', this.listeners.graphUpdate);
      graph.on('edgeAttributesUpdated', this.listeners.softGraphUpdate);
      graph.on('cleared', this.listeners.graphUpdate);

      return this;
    }

    /**
     * Method used to process the whole graph's data.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'process',
    value: function process() {
      var keepArrays = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      var graph = this.graph,
          settings = this.settings;

      // Clearing the quad
      this.quadtree.clear();

      // Computing extents
      var nodeExtentProperties = ['x', 'y'];

      if (this.settings.zIndex) {
        nodeExtentProperties.push('z');
        this.edgeExtent = (0, _extent.edgeExtent)(graph, ['z']);
      }

      this.nodeExtent = (0, _extent.nodeExtent)(graph, nodeExtentProperties);

      // Rescaling function
      this.normalizationFunction = (0, _utils2.createNormalizationFunction)(this.nodeExtent);

      var nodeProgram = this.nodePrograms.def;

      if (!keepArrays) nodeProgram.allocate(graph.order);

      var nodes = graph.nodes();

      // Handling node z-index
      // TODO: z-index needs us to compute display data before hand
      // TODO: remains to be seen if reducers are a good or bad thing and if we
      // should store display data in flat byte arrays indices
      if (this.settings.zIndex) nodes = (0, _zIndex.zIndexOrdering)(this.edgeExtent.z, function (node) {
        return graph.getNodeAttribute(node, 'z');
      }, nodes);

      for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];

        var data = graph.getNodeAttributes(node);

        var displayData = this.nodeDataCache[node];

        if (settings.nodeReducer) data = settings.nodeReducer(node, data);

        // TODO: should assign default also somewhere here if there is a reducer
        displayData.assign(data);
        this.normalizationFunction.applyTo(displayData);

        this.quadtree.add(node, displayData.x, 1 - displayData.y, displayData.size / this.width);

        nodeProgram.process(displayData, i);

        displayData.index = i;
      }

      nodeProgram.bufferData();

      var edgeProgram = this.edgePrograms.def;

      if (!keepArrays) edgeProgram.allocate(graph.size);

      var edges = graph.edges();

      // Handling edge z-index
      if (this.settings.zIndex) edges = (0, _zIndex.zIndexOrdering)(this.edgeExtent.z, function (edge) {
        return graph.getEdgeAttribute(edge, 'z');
      }, edges);

      for (var _i2 = 0, _l2 = edges.length; _i2 < _l2; _i2++) {
        var edge = edges[_i2];

        var _data2 = graph.getEdgeAttributes(edge);

        var _displayData = this.edgeDataCache[edge];

        if (settings.edgeReducer) _data2 = settings.edgeReducer(edge, _data2);

        _displayData.assign(_data2);

        var extremities = graph.extremities(edge),
            sourceData = this.nodeDataCache[extremities[0]],
            targetData = this.nodeDataCache[extremities[1]];

        edgeProgram.process(sourceData, targetData, _displayData, _i2);

        _displayData.index = _i2;
      }

      // Computing edge indices if necessary
      if (!keepArrays && typeof edgeProgram.computeIndices === 'function') edgeProgram.computeIndices();

      edgeProgram.bufferData();

      return this;
    }

    /**
     * Method used to process a single node.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'processNode',
    value: function processNode(key) {

      var nodeProgram = this.nodePrograms.def;

      var data = this.graph.getNodeAttributes(key);

      nodeProgram.process(data, this.nodeDataCache[key].index);

      return this;
    }

    /**
     * Method used to process a single edge.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'processEdge',
    value: function processEdge(key) {

      var graph = this.graph;

      var edgeProgram = this.edgePrograms.def;

      var data = graph.getEdgeAttributes(key),
          extremities = graph.extremities(key),
          sourceData = graph.getNodeAttributes(extremities[0]),
          targetData = graph.getNodeAttributes(extremities[1]);

      edgeProgram.process(sourceData, targetData, data, this.edgeDataCache[key].index);

      return this;
    }

    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */

    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */

  }, {
    key: 'getCamera',
    value: function getCamera() {
      return this.camera;
    }

    /**
     * Method returning the mouse captor.
     *
     * @return {Camera}
     */

  }, {
    key: 'getMouseCaptor',
    value: function getMouseCaptor() {
      return this.captors.mouse;
    }

    /**
     * Method used to resize the renderer.
     *
     * @param  {number} width  - Target width.
     * @param  {number} height - Target height.
     * @return {WebGLRenderer}
     */

  }, {
    key: 'resize',
    value: function resize(width, height) {
      var previousWidth = this.width,
          previousHeight = this.height;

      if (arguments.length > 1) {
        this.width = width;
        this.height = height;
      } else {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
      }

      if (this.width === 0) throw new Error('sigma/renderers/webgl: container as no width.');

      if (this.height === 0) throw new Error('sigma/renderers/webgl: container as no height.');

      // If nothing has changed, we can stop right here
      if (previousWidth === this.width && previousHeight === this.height) return this;

      // Sizing dom elements
      for (var id in this.elements) {
        var element = this.elements[id];

        element.style.width = this.width + 'px';
        element.style.height = this.height + 'px';
      }

      // Sizing contexts
      for (var _id in this.contexts) {
        var context = this.contexts[_id];

        // Canvas contexts
        if (context.scale) {
          this.elements[_id].setAttribute('width', this.width * PIXEL_RATIO + 'px');
          this.elements[_id].setAttribute('height', this.height * PIXEL_RATIO + 'px');

          if (PIXEL_RATIO !== 1) context.scale(PIXEL_RATIO, PIXEL_RATIO);
        }

        // WebGL contexts
        else {
            this.elements[_id].setAttribute('width', this.width * WEBGL_OVERSAMPLING_RATIO + 'px');
            this.elements[_id].setAttribute('height', this.height * WEBGL_OVERSAMPLING_RATIO + 'px');
          }

        if (context.viewport) {
          context.viewport(0, 0, this.width * WEBGL_OVERSAMPLING_RATIO, this.height * WEBGL_OVERSAMPLING_RATIO);
        }
      }

      return this;
    }

    /**
     * Method used to clear the canvases.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'clear',
    value: function clear() {

      // NOTE: don't need to clear with preserveDrawingBuffer to false

      // let context = this.contexts.nodes;
      // context.clear(context.COLOR_BUFFER_BIT);

      // context = this.contexts.edges;
      // context.clear(context.COLOR_BUFFER_BIT);

      var context = this.contexts.labels;
      context.clearRect(0, 0, this.width, this.height);

      // context = this.contexts.hovers;
      // context.clearRect(0, 0, this.width, this.height);

      return this;
    }

    /**
     * Method used to render.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'render',
    value: function render() {

      // If a render was scheduled, we cancel it
      if (this.renderFrame) {
        cancelAnimationFrame(this.renderFrame);
        this.renderFrame = null;
        this.needToProcess = false;
        this.needToSoftProcess = false;
      }

      // TODO: improve this heuristic
      var moving = this.camera.isAnimated() || this.captors.mouse.isMoving || this.captors.mouse.hasDragged || this.captors.mouse.wheelLock;

      // First we need to resize
      this.resize();

      // Clearing the canvases
      this.clear();

      // Then we need to extract a matrix from the camera
      var cameraState = this.camera.getState(),
          cameraMatrix = (0, _utils3.matrixFromCamera)(cameraState, { width: this.width, height: this.height });

      var program = void 0;

      // Drawing nodes
      program = this.nodePrograms.def;

      program.render({
        matrix: cameraMatrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        nodesPowRatio: 0.5,
        scalingRatio: WEBGL_OVERSAMPLING_RATIO
      });

      // Drawing edges
      if (!this.settings.hideEdgesOnMove || !moving) {
        program = this.edgePrograms.def;

        program.render({
          matrix: cameraMatrix,
          width: this.width,
          height: this.height,
          ratio: cameraState.ratio,
          nodesPowRatio: 0.5,
          edgesPowRatio: 0.5,
          scalingRatio: WEBGL_OVERSAMPLING_RATIO
        });
      }

      // Do not display labels on move per setting
      if (this.settings.hideLabelsOnMove && moving) return this;

      // Finding visible nodes to display their labels
      var visibleNodes = void 0;

      if (cameraState.ratio >= 1) {

        // Camera is unzoomed so no need to ask the quadtree for visible nodes
        visibleNodes = this.graph.nodes();
      } else {

        // Let's ask the quadtree
        var viewRectangle = this.camera.viewRectangle(this);

        visibleNodes = this.quadtree.rectangle(viewRectangle.x1, 1 - viewRectangle.y1, viewRectangle.x2, 1 - viewRectangle.y2, viewRectangle.height);
      }

      if (!this.settings.renderLabels) return this;

      // Selecting labels to draw
      var labelsToDisplay = (0, _labels.labelsToDisplayFromGrid)({
        cache: this.nodeDataCache,
        camera: this.camera,
        displayedLabels: this.displayedLabels,
        visibleNodes: visibleNodes,
        dimensions: this,
        graph: this.graph
      });

      // Drawing labels
      // TODO: POW RATIO is currently default 0.5 and harcoded
      var context = this.contexts.labels;

      var sizeRatio = Math.pow(cameraState.ratio, 0.5);

      for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
        var data = this.nodeDataCache[labelsToDisplay[i]];

        var _camera$graphToViewpo = this.camera.graphToViewport(this, data.x, data.y),
            x = _camera$graphToViewpo.x,
            y = _camera$graphToViewpo.y;

        // TODO: we can cache the labels we need to render until the camera's ratio changes


        var size = data.size / sizeRatio;

        // TODO: this is the label threshold hardcoded
        // if (size < 8)
        //   continue;

        (0, _label2.default)(context, {
          label: data.label,
          size: size,
          x: x,
          y: y
        }, this.settings);
      }

      // Caching visible nodes and displayed labels
      this.displayedLabels = new Set(labelsToDisplay);

      // Rendering highlighted nodes
      this.renderHighlightedNodes();

      return this;
    }

    /**
     * Method used to render the highlighted nodes.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'renderHighlightedNodes',
    value: function renderHighlightedNodes() {
      var _this5 = this;

      var camera = this.camera;

      var sizeRatio = Math.pow(camera.getState().ratio, 0.5);

      var context = this.contexts.hovers;

      // Clearing
      context.clearRect(0, 0, this.width, this.height);

      // Rendering
      var render = function render(node) {
        var data = _this5.nodeDataCache[node];

        var _camera$graphToViewpo2 = camera.graphToViewport(_this5, data.x, data.y),
            x = _camera$graphToViewpo2.x,
            y = _camera$graphToViewpo2.y;

        var size = data.size / sizeRatio;

        (0, _hover2.default)(context, {
          label: data.label,
          color: data.color,
          size: size,
          x: x,
          y: y
        }, _this5.settings);
      };

      if (this.hoveredNode) render(this.hoveredNode);

      this.highlightedNodes.forEach(render);
    }

    /**
     * Method used to schedule a render.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'scheduleRender',
    value: function scheduleRender() {
      var _this6 = this;

      // A frame is already scheduled
      if (this.renderFrame) return this;

      // Let's schedule a frame
      this.renderFrame = requestAnimationFrame(function () {

        // Do we need to process data?
        if (_this6.needToProcess || _this6.needToSoftProcess) _this6.process(_this6.needToSoftProcess);

        // Resetting state
        _this6.renderFrame = null;
        _this6.needToProcess = false;
        _this6.needToSoftProcess = false;

        // Rendering
        _this6.render();
      });
    }

    /**
     * Method used to schedule a hover render.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'scheduleHighlightedNodesRender',
    value: function scheduleHighlightedNodesRender() {
      var _this7 = this;

      if (this.renderHighlightedNodesFrame || this.renderFrame) return this;

      this.renderHighlightedNodesFrame = requestAnimationFrame(function () {

        // Resetting state
        _this7.renderHighlightedNodesFrame = null;

        // Rendering
        _this7.renderHighlightedNodes();
      });
    }

    /**
     * Method used to manually refresh.
     *
     * @return {WebGLRenderer}
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.needToSoftProcess = true;
      this.scheduleRender();

      return this;
    }

    /**
     * Method used to highlight a node.
     *
     * @param  {string} key - The node's key.
     * @return {WebGLRenderer}
     */

  }, {
    key: 'highlightNode',
    value: function highlightNode(key) {

      // TODO: check the existence of the node
      // TODO: coerce?
      this.highlightedNodes.add(key);

      // Rendering
      this.scheduleHighlightedNodesRender();

      return this;
    }

    /**
     * Method used to unhighlight a node.
     *
     * @param  {string} key - The node's key.
     * @return {WebGLRenderer}
     */

  }, {
    key: 'unhighlightNode',
    value: function unhighlightNode(key) {

      // TODO: check the existence of the node
      // TODO: coerce?
      this.highlightedNodes.delete(key);

      // Rendering
      this.scheduleHighlightedNodesRender();

      return this;
    }

    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */

  }, {
    key: 'kill',
    value: function kill() {
      var graph = this.graph;

      // Releasing camera handlers
      this.camera.removeListener('updated', this.listeners.camera);

      // Releasing DOM events & captors
      window.removeEventListener('resize', this.listeners.handleResize);
      this.captors.mouse.kill();

      // Releasing graph handlers
      graph.removeListener('nodeAdded', this.listeners.graphUpdate);
      graph.removeListener('nodeDropped', this.listeners.graphUpdate);
      graph.removeListener('nodeAttributesUpdated', this.listeners.softGraphUpdate);
      graph.removeListener('edgeAdded', this.listeners.graphUpdate);
      graph.removeListener('nodeDropped', this.listeners.graphUpdate);
      graph.removeListener('edgeAttributesUpdated', this.listeners.softGraphUpdate);
      graph.removeListener('cleared', this.listeners.graphUpdate);

      // Releasing cache & state
      this.quadtree = null;
      this.nodeDataCache = null;
      this.edgeDataCache = null;

      this.highlightedNodes = null;
      this.previousVisibleNodes = null;
      this.displayedLabels = null;

      // Destroying canvases
      var container = this.container;

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }]);

  return WebGLRenderer;
}(_renderer2.default);

exports.default = WebGLRenderer;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Extent
 * ==================
 *
 * Simple function returning the extent of selected attributes of the graph.
 */
var isGraph = __webpack_require__(8);

/**
 * Function returning the extent of the selected node attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function nodeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/extent: the given graph is not a valid graphology instance.');

  var attributes = [].concat(attribute);

  var nodes = graph.nodes(),
      node,
      data,
      value,
      key,
      a,
      i,
      l;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    data = graph.getNodeAttributes(node);

    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0])
        results[key][0] = value;

      if (value > results[key][1])
        results[key][1] = value;
    }
  }

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Function returning the extent of the selected edge attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function edgeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/extent: the given graph is not a valid graphology instance.');

  var attributes = [].concat(attribute);

  var edges = graph.edges(),
      edge,
      data,
      value,
      key,
      a,
      i,
      l;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  for (i = 0, l = edges.length; i < l; i++) {
    edge = edges[i];
    data = graph.getEdgeAttributes(edge);

    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0])
        results[key][0] = value;

      if (value > results[key][1])
        results[key][1] = value;
    }
  }

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Exporting.
 */
var extent = nodeExtent;
extent.nodeExtent = nodeExtent;
extent.edgeExtent = edgeExtent;

module.exports = extent;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sigma.js Display Data Classes
 * ==============================
 *
 * Classes representing nodes & edges display data aiming at facilitating
 * the engine's memory representation and keep them in a pool to avoid
 * requiring to allocate memory too often.
 *
 * NOTE: it's possible to optimize this further by maintaining display data
 * in byte arrays but this would prove more tedious for the rendering logic
 * afterwards.
 */
var NodeDisplayData = exports.NodeDisplayData = function () {
  function NodeDisplayData(index, settings) {
    _classCallCheck(this, NodeDisplayData);

    this.index = index;
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.color = settings.defaultNodeColor;
    this.hidden = false;
    this.label = '';
  }

  _createClass(NodeDisplayData, [{
    key: 'assign',
    value: function assign(data) {
      if ('x' in data) this.x = data.x;

      if ('y' in data) this.y = data.y;

      if ('size' in data) this.size = data.size;

      if ('color' in data) this.color = data.color;

      if ('hidden' in data) this.hidden = data.hidden;

      if ('label' in data) this.label = data.label;
    }
  }]);

  return NodeDisplayData;
}();

var EdgeDisplayData = exports.EdgeDisplayData = function () {
  function EdgeDisplayData(index, settings) {
    _classCallCheck(this, EdgeDisplayData);

    this.index = index;
    this.size = 1;
    this.color = settings.defaultEdgeColor;
    this.hidden = false;
  }

  _createClass(EdgeDisplayData, [{
    key: 'assign',
    value: function assign(data) {
      if ('size' in data) this.size = data.size;

      if ('color' in data) this.color = data.color;

      if ('hidden' in data) this.hidden = data.hidden;
    }
  }]);

  return EdgeDisplayData;
}();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(9);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(2);

var _nodeFastVert = __webpack_require__(22);

var _nodeFastVert2 = _interopRequireDefault(_nodeFastVert);

var _nodeFastFrag = __webpack_require__(23);

var _nodeFastFrag2 = _interopRequireDefault(_nodeFastFrag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js WebGL Renderer Node Program
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * =====================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Simple program rendering nodes using GL_POINTS. This is faster than the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * three triangle option but has some quirks and is not supported equally by
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * every GPU.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var POINTS = 1,
    ATTRIBUTES = 4;

var NodeProgramFast = function (_Program) {
  _inherits(NodeProgramFast, _Program);

  function NodeProgramFast(gl) {
    _classCallCheck(this, NodeProgramFast);

    // Binding context
    var _this = _possibleConstructorReturn(this, (NodeProgramFast.__proto__ || Object.getPrototypeOf(NodeProgramFast)).call(this, gl, _nodeFastVert2.default, _nodeFastFrag2.default));

    _this.gl = gl;

    // Array data
    _this.array = null;

    // Initializing buffers
    _this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffer);

    var program = _this.program;

    // Locations
    _this.positionLocation = gl.getAttribLocation(program, 'a_position');
    _this.sizeLocation = gl.getAttribLocation(program, 'a_size');
    _this.colorLocation = gl.getAttribLocation(program, 'a_color');
    _this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    _this.ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    _this.scaleLocation = gl.getUniformLocation(program, 'u_scale');

    // Bindings
    gl.enableVertexAttribArray(_this.positionLocation);
    gl.enableVertexAttribArray(_this.sizeLocation);
    gl.enableVertexAttribArray(_this.colorLocation);

    gl.vertexAttribPointer(_this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(_this.sizeLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(_this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
    return _this;
  }

  _createClass(NodeProgramFast, [{
    key: 'allocate',
    value: function allocate(capacity) {
      this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
    }
  }, {
    key: 'process',
    value: function process(data, offset) {
      var color = (0, _utils.floatColor)(data.color);

      var i = offset * POINTS * ATTRIBUTES;

      var array = this.array;

      if (data.hidden) {
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;
        array[i++] = 0;

        return;
      }

      array[i++] = data.x;
      array[i++] = data.y;
      array[i++] = data.size;
      array[i] = color;
    }
  }, {
    key: 'bufferData',
    value: function bufferData() {
      var gl = this.gl;

      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    }
  }, {
    key: 'render',
    value: function render(params) {
      var gl = this.gl;

      var program = this.program;
      gl.useProgram(program);

      gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
      gl.uniform1f(this.scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

      gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    }
  }]);

  return NodeProgramFast;
}(_program2.default);

exports.default = NodeProgramFast;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadProgram = loadProgram;
/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 */

/**
 * Function used to load a shader.
 */
function loadShader(type, gl, source) {
  var glType = type === 'VERTEX' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

  // Creating the shader
  var shader = gl.createShader(glType);

  // Loading source
  gl.shaderSource(shader, source);

  // Compiling the shader
  gl.compileShader(shader);

  // Retrieving compilation status
  var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  // Throwing if something went awry
  if (!successfullyCompiled) {
    var infoLog = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);
    throw new Error('sigma/renderers/weblg/shaders/utils.loadShader: error while compiling the shader:\n' + infoLog + '\n' + source);
  }

  return shader;
}

var loadVertexShader = loadShader.bind(null, 'VERTEX'),
    loadFragmentShader = loadShader.bind(null, 'FRAGMENT');

exports.loadVertexShader = loadVertexShader;
exports.loadFragmentShader = loadFragmentShader;

/**
 * Function used to load a program.
 */

function loadProgram(gl, shaders) {
  var program = gl.createProgram();

  var i = void 0,
      l = void 0;

  // Attaching the shaders
  for (i = 0, l = shaders.length; i < l; i++) {
    gl.attachShader(program, shaders[i]);
  }gl.linkProgram(program);

  // Checking status
  var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!successfullyLinked) {

    gl.deleteProgram(program);
    throw new Error('sigma/renderers/weblg/shaders/utils.loadProgram: error while linking the program.');
  }

  return program;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
exports.scale = scale;
exports.rotate = rotate;
exports.translate = translate;
exports.multiply = multiply;
/**
 * Sigma.js WebGL Matrices Helpers
 * ================================
 *
 * Matrices-related helper functions used by sigma's WebGL renderer.
 */
function identity() {
  return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}

// TODO: optimize
function scale(m, x, y) {
  m[0] = x;
  m[4] = arguments.length > 2 ? y : x;

  return m;
}

function rotate(m, r) {
  var s = Math.sin(r),
      c = Math.cos(r);

  m[0] = c;
  m[1] = s;
  m[3] = -s;
  m[4] = c;

  return m;
}

function translate(m, x, y) {
  m[6] = x;
  m[7] = y;

  return m;
}

function multiply(a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];

  a[0] = b00 * a00 + b01 * a10 + b02 * a20;
  a[1] = b00 * a01 + b01 * a11 + b02 * a21;
  a[2] = b00 * a02 + b01 * a12 + b02 * a22;

  a[3] = b10 * a00 + b11 * a10 + b12 * a20;
  a[4] = b10 * a01 + b11 * a11 + b12 * a21;
  a[5] = b10 * a02 + b11 * a12 + b12 * a22;

  a[6] = b20 * a00 + b21 * a10 + b22 * a20;
  a[7] = b20 * a01 + b21 * a11 + b22 * a21;
  a[8] = b20 * a02 + b21 * a12 + b22 * a22;

  return a;
}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute float a_size;\nattribute vec4 a_color;\n\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float radius = 0.5;\n\nvoid main(void) {\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > v_border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / v_border;\n\n  // gl_FragColor = mix(color0, v_color, t);\n  gl_FragColor = mix(color0, v_color, t);\n}\n"

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(9);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(2);

var _edgeVert = __webpack_require__(25);

var _edgeVert2 = _interopRequireDefault(_edgeVert);

var _edgeFrag = __webpack_require__(26);

var _edgeFrag2 = _interopRequireDefault(_edgeFrag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js WebGL Renderer Edge Program
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * =====================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Program rendering edges as thick lines using four points translated
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * orthogonally from the source & target's centers by half thickness.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Rendering two triangles by using only four points is made possible through
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the use of indices.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This method should be faster than the 6 points / 2 triangles approach and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * should handle thickness better than with gl.LINES.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This version of the shader balances geometry computation evenly between
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the CPU & GPU (normals are computed on the CPU side).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var POINTS = 4,
    ATTRIBUTES = 6,
    STRIDE = POINTS * ATTRIBUTES;

var EdgeProgram = function (_Program) {
  _inherits(EdgeProgram, _Program);

  function EdgeProgram(gl) {
    _classCallCheck(this, EdgeProgram);

    // Binding context
    var _this = _possibleConstructorReturn(this, (EdgeProgram.__proto__ || Object.getPrototypeOf(EdgeProgram)).call(this, gl, _edgeVert2.default, _edgeFrag2.default));

    _this.gl = gl;

    // Array data
    _this.array = null;
    _this.indicesArray = null;

    // Initializing buffers
    _this.buffer = gl.createBuffer();
    _this.indicesBuffer = gl.createBuffer();

    // Locations
    _this.positionLocation = gl.getAttribLocation(_this.program, 'a_position');
    _this.normalLocation = gl.getAttribLocation(_this.program, 'a_normal');
    _this.thicknessLocation = gl.getAttribLocation(_this.program, 'a_thickness');
    _this.colorLocation = gl.getAttribLocation(_this.program, 'a_color');
    _this.resolutionLocation = gl.getUniformLocation(_this.program, 'u_resolution');
    _this.ratioLocation = gl.getUniformLocation(_this.program, 'u_ratio');
    _this.matrixLocation = gl.getUniformLocation(_this.program, 'u_matrix');
    _this.scaleLocation = gl.getUniformLocation(_this.program, 'u_scale');

    _this.bind();

    // Enabling the OES_element_index_uint extension
    // NOTE: on older GPUs, this means that really large graphs won't
    // have all their edges rendered. But it seems that the
    // `OES_element_index_uint` is quite everywhere so we'll handle
    // the potential issue if it really arises.
    // NOTE: when using webgl2, the extension is enabled by default
    _this.canUse32BitsIndices = (0, _utils.canUse32BitsIndices)(gl);
    _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
    _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    return _this;
  }

  _createClass(EdgeProgram, [{
    key: 'bind',
    value: function bind() {
      var gl = this.gl;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

      // Bindings
      gl.enableVertexAttribArray(this.positionLocation);
      gl.enableVertexAttribArray(this.normalLocation);
      gl.enableVertexAttribArray(this.thicknessLocation);
      gl.enableVertexAttribArray(this.colorLocation);

      gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
      gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
      gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    }
  }, {
    key: 'allocate',
    value: function allocate(capacity) {
      this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
    }
  }, {
    key: 'process',
    value: function process(sourceData, targetData, data, offset) {

      if (sourceData.hidden || targetData.hidden || data.hidden) {
        for (var _i = offset * STRIDE, l = _i + STRIDE; _i < l; _i++) {
          this.array[_i] = 0;
        }return;
      }

      var thickness = data.size || 1,
          x1 = sourceData.x,
          y1 = sourceData.y,
          x2 = targetData.x,
          y2 = targetData.y,
          color = (0, _utils.floatColor)(data.color);

      // Computing normals
      var dx = x2 - x1,
          dy = y2 - y1;

      var len = dx * dx + dy * dy,
          n1 = 0,
          n2 = 0;

      if (len) {
        len = 1 / Math.sqrt(len);

        n1 = -dy * len;
        n2 = dx * len;
      }

      var i = POINTS * ATTRIBUTES * offset;

      var array = this.array;

      // First point
      array[i++] = x1;
      array[i++] = y1;
      array[i++] = n1;
      array[i++] = n2;
      array[i++] = thickness;
      array[i++] = color;

      // First point flipped
      array[i++] = x1;
      array[i++] = y1;
      array[i++] = -n1;
      array[i++] = -n2;
      array[i++] = thickness;
      array[i++] = color;

      // Second point
      array[i++] = x2;
      array[i++] = y2;
      array[i++] = n1;
      array[i++] = n2;
      array[i++] = thickness;
      array[i++] = color;

      // Second point flipped
      array[i++] = x2;
      array[i++] = y2;
      array[i++] = -n1;
      array[i++] = -n2;
      array[i++] = thickness;
      array[i] = color;
    }
  }, {
    key: 'computeIndices',
    value: function computeIndices() {
      var l = this.array.length / ATTRIBUTES;

      var size = l + l / 2;

      var indices = new this.IndicesArray(size);

      for (var i = 0, c = 0; i < l; i += 4) {
        indices[c++] = i;
        indices[c++] = i + 1;
        indices[c++] = i + 2;
        indices[c++] = i + 2;
        indices[c++] = i + 1;
        indices[c++] = i + 3;
      }

      this.indicesArray = indices;
    }
  }, {
    key: 'bufferData',
    value: function bufferData() {
      var gl = this.gl;

      // Vertices data
      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);

      // Indices data
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    }
  }, {
    key: 'render',
    value: function render(params) {
      var gl = this.gl;

      var program = this.program;
      gl.useProgram(program);

      // Binding uniforms
      // TODO: precise the uniform names
      gl.uniform2f(this.resolutionLocation, params.width, params.height);
      gl.uniform1f(this.ratioLocation,
      // 1 / Math.pow(params.ratio, params.edgesPowRatio)
      params.ratio);

      gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

      gl.uniform1f(this.scaleLocation, params.scalingRatio);

      // Drawing:
      gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    }
  }]);

  return EdgeProgram;
}(_program2.default);

exports.default = EdgeProgram;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_thickness;\nattribute vec4 a_color;\n\nuniform vec2 u_resolution;\nuniform float u_ratio;\nuniform mat3 u_matrix;\nuniform float u_scale;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float min_thickness = 1.8;\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n\n  // Computing thickness in pixels\n  float pow_ratio = 1.0 / pow(u_ratio, 0.5);\n  float thickness = a_thickness * pow_ratio / u_scale;\n\n  // Min thickness for AA\n  thickness = max(min_thickness, thickness);\n\n  // Computing delta relative to viewport\n  vec2 delta = (a_normal * thickness) / u_resolution;\n\n  vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n  position += delta;\n\n  // Applying\n  gl_Position = vec4(position, 0, 1);\n\n  v_normal = a_normal;\n  v_thickness = thickness;\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 2.6;\nconst vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, color0, t);\n}\n"

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.default = drawHover;

var _node = __webpack_require__(28);

var _node2 = _interopRequireDefault(_node);

var _label = __webpack_require__(10);

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sigma.js Canvas Renderer Hover Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's hovered
 * state.
 */
function drawHover(context, data, settings) {
      var size = settings.labelSize,
          font = settings.labelFont,
          weight = settings.labelWeight;

      context.font = weight + ' ' + size + 'px ' + font;

      // Then we draw the label background
      context.beginPath();
      context.fillStyle = '#fff';
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = '#000';

      var textWidth = context.measureText(data.label).width;

      var x = Math.round(data.x - size / 2 - 2),
          y = Math.round(data.y - size / 2 - 2),
          w = Math.round(textWidth + size / 2 + data.size + 9),
          h = Math.round(size + 4),
          e = Math.round(size / 2 + 2);

      context.moveTo(x, y + e);
      context.moveTo(x, y + e);
      context.arcTo(x, y, x + e, y, e);
      context.lineTo(x + w, y);
      context.lineTo(x + w, y + h);
      context.lineTo(x + e, y + h);
      context.arcTo(x, y + h, x, y + h - e, e);
      context.lineTo(x, y + e);

      context.closePath();
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;

      // Then we need to draw the node
      (0, _node2.default)(context, data);

      // And finally we draw the label
      (0, _label2.default)(context, data, settings);
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawNode;
/**
 * Sigma.js Canvas Renderer Node Component
 * ========================================
 *
 * Function used by the canvas renderer to display a single node.
 */
var PI_TIMES_2 = Math.PI * 2;

function drawNode(context, data) {

  context.fillStyle = data.color;
  context.beginPath();
  context.arc(data.x, data.y, data.size, 0, PI_TIMES_2, true);

  context.closePath();
  context.fill();
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _camera = __webpack_require__(0);

var _camera2 = _interopRequireDefault(_camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */

// Dimensions of a normal cell
var DEFAULT_CELL = {
  width: 250,
  height: 175
};

// Dimensions of an unzoomed cell. This one is usually larger than the normal
// one to account for the fact that labels will more likely collide.
/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 */
var DEFAULT_UNZOOMED_CELL = {
  width: 400,
  height: 300
};

/**
 * Helpers.
 */
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// TODO: cache camera position of selected nodes to avoid costly computations
// in anti-collision step
// TODO: minSize to be displayed
// TOOD: document a little bit more so future people can understand this mess

/**
 * Label grid heuristic selecting labels to display.
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @param  {Graph}    graph                - The rendered graph.
 * @return {Array}                         - The selected labels.
 */
exports.labelsToDisplayFromGrid = function (params) {
  var cache = params.cache,
      camera = params.camera,
      displayedLabels = params.displayedLabels,
      visibleNodes = params.visibleNodes,
      dimensions = params.dimensions,
      graph = params.graph;


  var cameraState = camera.getState(),
      previousCameraState = camera.getPreviousState();

  var previousCamera = new _camera2.default();
  previousCamera.setState(previousCameraState);

  // Camera hasn't moved?
  var still = cameraState.x === previousCameraState.x && cameraState.y === previousCameraState.y && cameraState.ratio === previousCameraState.ratio;

  // State
  var zooming = cameraState.ratio < previousCameraState.ratio,
      panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.y,
      unzooming = cameraState.ratio > previousCameraState.ratio,
      unzoomedPanning = !zooming && !unzooming && cameraState.ratio >= 1,
      zoomedPanning = panning && displayedLabels.size && !zooming && !unzooming;

  // Trick to discretize unzooming
  if (unzooming && Math.trunc(cameraState.ratio * 100) % 5 !== 0) return Array.from(displayedLabels);

  // If panning while unzoomed, we shouldn't change label selection
  if ((unzoomedPanning || still) && displayedLabels.size !== 0) return Array.from(displayedLabels);

  // When unzoomed & zooming
  if (zooming && cameraState.ratio >= 1) return Array.from(displayedLabels);

  // Adapting cell dimensions
  var cell = cameraState.ratio >= 1.3 ? DEFAULT_UNZOOMED_CELL : DEFAULT_CELL;

  var cwr = dimensions.width % cell.width;
  var cellWidth = cell.width + cwr / Math.floor(dimensions.width / cell.width);

  var chr = dimensions.height % cell.height;
  var cellHeight = cell.height + chr / Math.floor(dimensions.height / cell.height);

  var adjustedWidth = dimensions.width + cellWidth,
      adjustedHeight = dimensions.height + cellHeight,
      adjustedX = -cellWidth,
      adjustedY = -cellHeight;

  var panningWidth = dimensions.width + cellWidth / 2,
      panningHeight = dimensions.height + cellHeight / 2,
      panningX = -(cellWidth / 2),
      panningY = -(cellHeight / 2);

  // console.log(cellWidth, cellHeight, dimensions.width / cellWidth, dimensions.height / cellHeight);

  var worthyLabels = [];
  var grid = {};

  var maxSize = -Infinity,
      biggestNode = null;

  for (var i = 0, l = visibleNodes.length; i < l; i++) {
    var node = visibleNodes[i],
        nodeData = cache[node];

    // Finding our node's cell in the grid
    var pos = camera.graphToViewport(dimensions, nodeData.x, nodeData.y);

    // Node is not actually visible on screen
    // NOTE: can optimize margin on the right side (only if we know where the labels go)
    if (pos.x < adjustedX || pos.x > adjustedWidth || pos.y < adjustedY || pos.y > adjustedHeight) continue;

    // Keeping track of the maximum node size for certain cases
    if (nodeData.size > maxSize) {
      maxSize = nodeData.size;
      biggestNode = node;
    }

    // If panning when zoomed, we consider only displayed labels and newly
    // visible nodes
    if (zoomedPanning) {
      var ppos = previousCamera.graphToViewport(dimensions, nodeData.x, nodeData.y);

      // Was node visible earlier?
      if (ppos.x >= panningX && ppos.x <= panningWidth && ppos.y >= panningY && ppos.y <= panningHeight) {

        // Was the label displayed?
        if (!displayedLabels.has(node)) continue;
      }
    }

    var xKey = Math.floor(pos.x / cellWidth),
        yKey = Math.floor(pos.y / cellHeight);

    var key = xKey + '\xA7' + yKey;

    if (typeof grid[key] === 'undefined') {

      // This cell is not yet occupied
      grid[key] = node;
    } else {

      // We must solve a conflict in this cell
      var currentNode = grid[key],
          currentNodeData = cache[currentNode];

      // We prefer already displayed labels
      if (displayedLabels.size > 0) {
        var n1 = displayedLabels.has(node),
            n2 = displayedLabels.has(currentNode);

        if (!n1 && n2) {
          continue;
        }

        if (n1 && !n2) {
          grid[key] = node;
          continue;
        }

        if ((zoomedPanning || zooming) && n1 && n2) {
          worthyLabels.push(node);
          continue;
        }
      }

      // In case of size & degree equality, we use the node's key so that the
      // process remains deterministic
      var won = false;

      if (nodeData.size > currentNodeData.size) {
        won = true;
      } else if (nodeData.size === currentNodeData.size) {

        var nodeDegree = graph.degree(node),
            currentNodeDegree = graph.degree(currentNode);

        if (nodeDegree > currentNodeDegree) {
          won = true;
        } else if (nodeDegree === currentNodeDegree) {

          if (node > currentNode) won = true;
        }
      }

      if (won) grid[key] = node;
    }
  }

  // Compiling the labels
  var biggestNodeShown = worthyLabels.some(function (node) {
    return node === biggestNode;
  });

  for (var _key in grid) {

    var _node = grid[_key];

    if (_node === biggestNode) biggestNodeShown = true;

    worthyLabels.push(_node);
  }

  // Always keeping biggest node shown on screen
  if (!biggestNodeShown && biggestNode) worthyLabels.push(biggestNode);

  // Basic anti-collision
  var collisions = new Set();

  for (var _i = 0, _l = worthyLabels.length; _i < _l; _i++) {
    var _n = worthyLabels[_i],
        d1 = cache[_n],
        p1 = camera.graphToViewport(dimensions, d1.x, d1.y);

    if (collisions.has(_n)) continue;

    for (var j = _i + 1; j < _l; j++) {
      var _n2 = worthyLabels[j],
          d2 = cache[_n2],
          p2 = camera.graphToViewport(dimensions, d2.x, d2.y);

      var c = collision(p1.x, p1.y, d1.label.length * 8, 14, p2.x, p2.y, d2.label.length * 8, 14);

      if (c) {

        // NOTE: add degree as tie-breaker here if required in the future
        if (d1.size < d2.size) collisions.add(_n);else collisions.add(_n2);
      }
    }
  }

  // console.log(collisions)

  return worthyLabels.filter(function (l) {
    return !collisions.has(l);
  });
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sigma.js zIndex Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to z-index ordering of nodes & edges.
 */

/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
exports.zIndexOrdering = function (extent, getter, elements) {
  // const n = elements.length;

  // const [min, max] = extent;

  // const k = max - min;

  // No ordering needs to be done
  // if (k === 0 || k === -Infinity)
  //   return elements;

  // If k is > n, we'll use a standard sort
  return elements.sort(function (a, b) {
    var zA = getter(a) || 0,
        zB = getter(b) || 0;

    if (zA < zB) return -1;
    if (zA > zB) return 1;

    return 0;
  });

  // TODO: counting sort optimization
};

/***/ })
/******/ ]);
});