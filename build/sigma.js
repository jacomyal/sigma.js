(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sigma"] = factory();
	else
		root["Sigma"] = factory();
})(this, function() {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(2);

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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatColor = floatColor;
exports.matrixFromCamera = matrixFromCamera;
exports.extractPixel = extractPixel;

var _matrices = __webpack_require__(18);

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


var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)\s*(,.*)?\)\s*$/;

function floatColor(val) {

  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== 'undefined') return FLOAT_COLOR_CACHE[val];

  var r = 0,
      g = 0,
      b = 0;

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
    }

  var color = r * 256 * 256 + g * 256 + b;

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

  var scaling = (0, _matrices.scale)((0, _matrices.identity)(), 1 / ratio),
      rotation = (0, _matrices.rotate)((0, _matrices.identity)(), -angle),
      translation = (0, _matrices.translate)((0, _matrices.identity)(), -x, -y),
      dimensionTranslation = (0, _matrices.translate)((0, _matrices.identity)(), width / 2, height / 2);

  (0, _matrices.multiply)(matrix, scaling);
  (0, _matrices.multiply)(matrix, rotation);
  (0, _matrices.multiply)(matrix, translation);
  matrix = (0, _matrices.multiply)(dimensionTranslation, matrix);

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

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(2);

var _easings = __webpack_require__(14);

var easings = _interopRequireWildcard(_easings);

var _utils = __webpack_require__(9);

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

  function Camera(dimensions) {
    _classCallCheck(this, Camera);

    dimensions = dimensions || {};

    // Properties
    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    _this.x = 0;
    _this.y = 0;
    _this.angle = 0;
    _this.ratio = 1;
    _this.width = dimensions.width || 0;
    _this.height = dimensions.height || 0;

    // State
    _this.nextFrame = null;
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
     * Method used to retrieve the camera's dimensions.
     *
     * @return {object}
     */

  }, {
    key: 'getDimensions',
    value: function getDimensions() {
      return {
        width: this.width,
        height: this.height
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
     * Method returning the coordinates of a point from the display frame to the
     * graph one but ignores the offset and dimensions of the container.
     *
     * @param  {number} x - The X coordinate.
     * @param  {number} y - The Y coordinate.
     * @return {object}     The point coordinates in the frame of the graph.
     */

  }, {
    key: 'abstractDisplayToGraph',
    value: function abstractDisplayToGraph(x, y) {
      var cos = Math.cos(this.angle),
          sin = Math.sin(this.angle);

      return {
        x: (x * cos - y * sin) * this.ratio,
        y: (y * cos + x * sin) * this.ratio
      };
    }

    /**
     * Method returning the coordinates of a point from the display frame to the
     * graph one.
     *
     * @param  {number} x - The X coordinate.
     * @param  {number} y - The Y coordinate.
     * @return {object}   - The point coordinates in the frame of the graph.
     */

  }, {
    key: 'displayToGraph',
    value: function displayToGraph(x, y) {
      var cos = Math.cos(this.angle),
          sin = Math.sin(this.angle);

      var xOffset = this.width / 2 - (this.x * cos + this.y * sin) / this.ratio,
          yOffset = this.height / 2 - (this.y * cos - this.x * sin) / this.ratio;

      var X = x - xOffset,
          Y = y - yOffset;

      return {
        x: (X * cos - Y * sin) * this.ratio,
        y: (Y * cos + X * sin) * this.ratio
      };
    }

    /**
     * Method returning the coordinates of a point from the graph frame to the
     * display one.
     *
     * @param  {number} x - The X coordinate.
     * @param  {number} y - The Y coordinate.
     * @return {object}   - The point coordinates in the frame of the display.
     */

  }, {
    key: 'graphToDisplay',
    value: function graphToDisplay(x, y) {
      var relCos = Math.cos(this.angle) / this.ratio,
          relSin = Math.sin(this.angle) / this.ratio,
          xOffset = this.width / 2 - this.x * relCos - this.y * relSin,
          yOffset = this.height / 2 - this.y * relCos + this.x * relSin;

      return {
        x: x * relCos + y * relSin + xOffset,
        y: y * relCos - x * relSin + yOffset
      };
    }

    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */

  }, {
    key: 'viewRectangle',
    value: function viewRectangle() {
      var widthVect = this.abstractDisplayToGraph(this.width, 0),
          heightVect = this.abstractDisplayToGraph(0, this.height),
          centerVect = this.abstractDisplayToGraph(this.width / 2, this.height / 2),
          marginX = this.abstractDisplayToGraph(this.width / 4, 0).x,
          marginY = this.abstractDisplayToGraph(0, this.height / 4, 0).y;

      return {
        x1: this.x - centerVect.x - marginX,
        y1: this.y - centerVect.y - marginY,
        x2: this.x - centerVect.x + marginX + widthVect.x,
        y2: this.y - centerVect.y - marginY + widthVect.y,
        height: Math.sqrt(Math.pow(heightVect.x, 2) + Math.pow(heightVect.y + 2 * marginY, 2))
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
     * Method used to resize the camera's dimensions.
     *
     * @param  {object} dimensions - New dimensions.
     * @return {Camera}
     */

  }, {
    key: 'resize',
    value: function resize(dimensions) {

      if (!this.enabled) return this;

      if ('width' in dimensions) this.width = dimensions.width;

      if ('height' in dimensions) this.height = dimensions.height;

      this.emit('resized', this.getDimensions());

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
    value: function animate(state, options /*, callback */) {
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _captor = __webpack_require__(12);

var _captor2 = _interopRequireDefault(_captor);

var _utils = __webpack_require__(13);

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
    _this.startMouseX = null;
    _this.startMouseY = null;
    _this.isMouseDown = false;
    _this.isMoving = true;
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

      var ratio = 1 / DOUBLE_CLICK_ZOOMING_RATIO;

      var center = (0, _utils.getCenter)(e);

      var cameraState = this.camera.getState();

      var position = this.camera.abstractDisplayToGraph((0, _utils.getX)(e) - center.x, (0, _utils.getY)(e) - center.y);

      this.camera.animate({
        x: position.x * (1 - ratio) + cameraState.x,
        y: position.y * (1 - ratio) + cameraState.y,
        ratio: ratio * cameraState.ratio
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

      this.startMouseX = (0, _utils.getX)(e);
      this.startMouseY = (0, _utils.getY)(e);

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

      var cameraState = this.camera.getState();

      if (this.isMoving) {
        this.camera.animate({
          x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - this.lastCameraState.x),
          y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - this.lastCameraState.y)
        }, {
          duration: MOUSE_INERTIA_DURATION,
          easing: 'quadraticOut'
        });
      } else if (this.startMouseX !== x || this.startMouseY !== y) {
        this.camera.setState({
          x: cameraState.x,
          y: cameraState.y
        });
      }

      this.emit('mouseup', (0, _utils.getMouseCoords)(e));
      this.isMoving = false;
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

        var position = this.camera.abstractDisplayToGraph((0, _utils.getX)(e) - this.startMouseX, (0, _utils.getY)(e) - this.startMouseY);

        var x = this.startCameraState.x - position.x,
            y = this.startCameraState.y - position.y;

        var cameraState = this.camera.getState();

        if (cameraState.x !== x || cameraState.y !== y) {

          this.lastCameraState = cameraState;

          this.camera.setState({
            x: x,
            y: y
          });
        }
      }

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;

      e.stopPropagation();

      return false;
    }
  }, {
    key: 'handleWheel',
    value: function handleWheel(e) {
      var _this4 = this;

      if (!this.enabled) return false;

      var delta = (0, _utils.getWheelDelta)(e);

      if (!delta) return false;

      if (this.wheelLock) return false;

      this.wheelLock = true;
      setTimeout(function () {
        return _this4.wheelLock = false;
      }, 30);

      // TODO: handle max zoom
      var ratio = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;

      var cameraState = this.camera.getState();

      var newRatio = ratio * cameraState.ratio;

      var center = (0, _utils.getCenter)(e);

      var position = this.camera.abstractDisplayToGraph((0, _utils.getX)(e) - center.x, (0, _utils.getY)(e) - center.y);

      this.camera.animate({
        x: position.x * (1 - ratio) + cameraState.x,
        y: position.y * (1 - ratio) + cameraState.y,
        ratio: newRatio
      }, {
        easing: this.camera.isAnimated() ? 'quadraticOut' : 'quadraticInOut',
        duration: MOUSE_ZOOM_DURATION
      });

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;

      e.stopPropagation();

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 */

// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.

// TODO: a square can be represented as topleft + width

// TODO: jsdoc

// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size

// TODO: filtering unwanted labels beforehand through the filter function

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

    if (container) collectedNodes.push.apply(collectedNodes, container);

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

    if (params.boundaries) this.resize(params.boundaries);

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
exports.default = drawLabel;
/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 */
function drawLabel(context, data) {
  context.fillStyle = '#000';
  context.font = '14px arial';

  context.fillText(data.label, data.x + data.size + 3, data.y + 14 / 3);
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = createElement;
exports.getPixelRatio = getPixelRatio;
exports.createNodeRescalingFunction = createNodeRescalingFunction;
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
 * Default rescale options.
 */
var DEFAULT_NODE_RESCALE_OPTIONS = {
  mode: 'inside',
  margin: 0,
  minSize: 1,
  maxSize: 8
};

var DEFAULT_EDGE_RESCALE_OPTIONS = {
  minSize: 0.5,
  maxSize: 1
};

// TODO: should we let the user handle size through, for instance, d3 scales?
// TODO: should we put the rescaling in the camera itself?

/**
 * Factory returning a function rescaling the given node's position and/or size.
 *
 * @param  {object}   options - Options.
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
function createNodeRescalingFunction(options, extent) {
  options = options || {};

  var mode = options.mode || DEFAULT_NODE_RESCALE_OPTIONS.mode,
      height = options.height || 1,
      width = options.width || 1;

  var maxX = extent.maxX,
      maxY = extent.maxY,
      minX = extent.minX,
      minY = extent.minY;


  var hx = (maxX + minX) / 2,
      hy = (maxY + minY) / 2;

  var scale = mode === 'outside' ? Math.max(width / Math.max(maxX - minX, 1), height / Math.max(maxY - minY, 1)) : Math.min(width / Math.max(maxX - minX, 1), height / Math.max(maxY - minY, 1));

  var fn = function fn(data) {
    return {
      x: (data.x - hx) * scale,
      y: (data.y - hy) * scale
    };
  };

  fn.inverse = function (data) {
    return {
      x: data.x / scale + hx,
      y: data.y / scale + hy
    };
  };

  return fn;
}

/***/ }),
/* 8 */
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


var _utils = __webpack_require__(21);

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

exports.default = Program;

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = __webpack_require__(0);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(3);

var _camera2 = _interopRequireDefault(_camera);

var _mouse = __webpack_require__(4);

var _mouse2 = _interopRequireDefault(_mouse);

var _quadtree = __webpack_require__(5);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _node = __webpack_require__(20);

var _node2 = _interopRequireDefault(_node);

var _edge = __webpack_require__(19);

var _edge2 = _interopRequireDefault(_edge);

var _label = __webpack_require__(6);

var _label2 = _interopRequireDefault(_label);

var _hover = __webpack_require__(16);

var _hover2 = _interopRequireDefault(_hover);

var _utils = __webpack_require__(9);

var _utils2 = __webpack_require__(7);

var _utils3 = __webpack_require__(1);

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
  hideEdgesOnMove: false
};

/**
 * Main class.
 *
 * @constructor
 * @param {HTMLElement} container - The graph's container.
 */

var WebGLRenderer = function (_Renderer) {
  _inherits(WebGLRenderer, _Renderer);

  function WebGLRenderer(container, settings) {
    _classCallCheck(this, WebGLRenderer);

    var _this = _possibleConstructorReturn(this, (WebGLRenderer.__proto__ || Object.getPrototypeOf(WebGLRenderer)).call(this));

    settings = settings || {};

    _this.settings = (0, _utils.assign)({}, DEFAULT_SETTINGS, settings);

    // Validating
    if (!(container instanceof HTMLElement)) throw new Error('sigma/renderers/webgl: container should be an html element.');

    // Properties
    _this.sigma = null;
    _this.captors = {};
    _this.container = container;
    _this.elements = {};
    _this.contexts = {};
    _this.listeners = {};

    _this.quadtree = new _quadtree2.default();

    _this.nodeArray = null;
    _this.nodeIndicesArray = null;
    _this.nodeOrder = {};

    // TODO: this could be improved by key => index => floatArray
    _this.nodeDataCache = {};
    _this.edgeArray = null;
    _this.edgeIndicesArray = null;
    _this.edgeOrder = {};

    // TODO: if we drop size scaling => this should become "rescalingFunction"
    _this.nodeRescalingFunction = null;

    // Starting dimensions
    _this.width = 0;
    _this.height = 0;

    // State
    _this.highlightedNodes = new Set();
    _this.hoveredNode = null;
    _this.wasRenderedInThisFrame = false;
    _this.renderFrame = null;
    _this.renderHighlightedNodesFrame = null;
    _this.needToProcess = false;
    _this.needToSoftProcess = false;
    _this.pixel = new Uint8Array(4);

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
    return _this;
  }

  /**---------------------------------------------------------------------------
   * Internal methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to test a pixel of the given context.
   *
   * @param  {WebGLContext} gl - Context.
   * @param  {number}       x  - Client x.
   * @param  {number}       y  - Client y.
   * @return {boolean}
   */


  _createClass(WebGLRenderer, [{
    key: 'testPixel',
    value: function testPixel(gl, x, y) {
      (0, _utils3.extractPixel)(gl, x * WEBGL_OVERSAMPLING_RATIO, (this.height - y) * WEBGL_OVERSAMPLING_RATIO, this.pixel);

      return this.pixel[3] !== 0;
    }

    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string}  id    - Context's id.
     * @param  {boolean} webgl - Whether the context is a webgl or canvas one.
     * @return {WebGLRenderer}
     */

  }, {
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
        preserveDrawingBuffer: true,
        antialias: false
      };

      var context = element.getContext(webgl ? 'webgl' : '2d', contextOptions);

      this.contexts[id] = context;

      return this;
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

        var mouseGraphPosition = _this3.camera.displayToGraph(mouseX, mouseY);

        return _this3.quadtree.point(mouseGraphPosition.x, mouseGraphPosition.y);
      };

      // Handling mouse move
      this.listeners.handleMove = function (e) {

        // NOTE: for the canvas renderer, testing the pixel's alpha should
        // give some boost but this slows things down for WebGL empirically.

        // TODO: this should be a method from the camera (or can be passed to graph to display somehow)
        var sizeRatio = Math.pow(_this3.camera.getState().ratio, 0.5);

        var quadNodes = getQuadNodes(e.x, e.y);

        for (var i = 0, l = quadNodes.length; i < l; i++) {
          var node = quadNodes[i];

          var data = _this3.nodeDataCache[node];

          var pos = _this3.camera.graphToDisplay(data.x, data.y);

          var size = data.size / sizeRatio;

          if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
            _this3.hoveredNode = node;

            _this3.emit('overNode', { node: node });
            return _this3.scheduleHighlightedNodesRender();
          }
        }

        // Checking if the hovered node is still hovered
        if (_this3.hoveredNode) {
          var _data = _this3.nodeDataCache[_this3.hoveredNode];

          var _pos = _this3.camera.graphToDisplay(_data.x, _data.y);

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

          var pos = _this3.camera.graphToDisplay(data.x, data.y);

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

          var pos = _this3.camera.graphToDisplay(data.x, data.y);

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

      var graph = this.sigma.getGraph();

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


      var graph = this.sigma.getGraph();

      // TODO: possible to index this somehow using two byte arrays or so
      var extent = this.sigma.getGraphExtent();

      // Rescaling function
      this.nodeRescalingFunction = (0, _utils2.createNodeRescalingFunction)({ width: this.width, height: this.height }, extent);

      var minRescaled = this.nodeRescalingFunction({
        x: extent.minX,
        y: extent.minY
      });

      var maxRescaled = this.nodeRescalingFunction({
        x: extent.maxX,
        y: extent.maxY
      });

      this.quadtree.resize({
        x: minRescaled.x,
        y: minRescaled.y,
        width: maxRescaled.x - minRescaled.x,
        height: maxRescaled.y - minRescaled.y
      });

      this.nodeRescaleCache = {};

      var nodeProgram = this.nodePrograms.def;

      if (!keepArrays) {
        this.nodeArray = new Float32Array(_node2.default.POINTS * _node2.default.ATTRIBUTES * graph.order);

        this.nodeOrder = {};
      }

      var nodes = graph.nodes();

      for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];

        this.nodeOrder[node] = i;

        var data = this.sigma.getNodeData(node);

        var rescaledData = this.nodeRescalingFunction(data);

        // TODO: Optimize this to be save a loop and one object, by using a reversed assign
        var displayData = (0, _utils.assign)({}, data, rescaledData);

        this.quadtree.add(node, displayData.x, displayData.y, displayData.size);

        this.nodeDataCache[node] = displayData;

        nodeProgram.process(this.nodeArray, displayData, i * _node2.default.POINTS * _node2.default.ATTRIBUTES);
      }

      nodeProgram.bufferData(this.contexts.nodes, this.nodeArray);

      var edgeProgram = this.edgePrograms.def;

      if (!keepArrays) {
        this.edgeArray = new Float32Array(_edge2.default.POINTS * _edge2.default.ATTRIBUTES * graph.size);

        this.edgeOrder = {};
      }

      var edges = graph.edges();

      for (var _i = 0, _l = edges.length; _i < _l; _i++) {
        var edge = edges[_i];

        this.edgeOrder[edge] = _i;

        var _data2 = this.sigma.getEdgeData(edge),
            extremities = graph.extremities(edge),
            sourceData = this.nodeDataCache[extremities[0]],
            targetData = this.nodeDataCache[extremities[1]];

        edgeProgram.process(this.edgeArray, sourceData, targetData, _data2, _i * _edge2.default.POINTS * _edge2.default.ATTRIBUTES);
      }

      // Computing edge indices if necessary
      if (!keepArrays && typeof edgeProgram.computeIndices === 'function') this.edgeIndicesArray = edgeProgram.computeIndices(this.edgeArray);

      edgeProgram.bufferData(this.contexts.edges, this.edgeArray, this.edgeIndicesArray);

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

      var data = this.sigma.getNodeData(key);

      nodeProgram.process(this.nodeArray, data, this.nodeOrder[key] * _node2.default.POINTS * _node2.default.ATTRIBUTES);

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

      var graph = this.sigma.getGraph();

      var edgeProgram = this.edgePrograms.def;

      var data = this.sigma.getEdgeData(key),
          extremities = graph.extremities(key),
          sourceData = this.sigma.getNodeData(extremities[0]),
          targetData = this.sigma.getNodeData(extremities[1]);

      edgeProgram.process(this.edgeArray, sourceData, targetData, data, this.edgeOrder[key] * _edge2.default.POINTS * _edge2.default.ATTRIBUTES);

      return this;
    }

    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */

    /**
     * Method used to bind the renderer to a sigma instance.
     *
     * @param  {Sigma} sigma - Target sigma instance.
     * @return {WebGLRenderer}
     */

  }, {
    key: 'bind',
    value: function bind(sigma) {

      // Binding instance
      this.sigma = sigma;

      this.bindGraphHandlers();

      // Processing initial data
      this.process();

      return this;
    }

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

      // If nothing has changed, we can stop right here
      if (previousWidth === this.width && previousHeight === this.height) return this;

      // Resizing camera
      // TODO: maybe move this elsewhere
      if (this.camera) this.camera.resize({ width: this.width, height: this.height });

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
      var context = this.contexts.nodes;
      context.clear(context.COLOR_BUFFER_BIT);

      context = this.contexts.edges;
      context.clear(context.COLOR_BUFFER_BIT);

      context = this.contexts.labels;
      context.clearRect(0, 0, this.width, this.height);

      context = this.contexts.hovers;
      context.clearRect(0, 0, this.width, this.height);

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

      // First we need to resize
      this.resize();

      // Clearing the canvases
      this.clear();

      // Then we need to extract a matrix from the camera
      var cameraState = this.camera.getState(),
          cameraMatrix = (0, _utils3.matrixFromCamera)(cameraState, { width: this.width, height: this.height });

      var program = void 0,
          gl = void 0;

      // Drawing nodes
      gl = this.contexts.nodes;
      program = this.nodePrograms.def;

      // TODO: should probably use another name for the `program` abstraction
      program.render(gl, this.nodeArray, {
        matrix: cameraMatrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        nodesPowRatio: 0.5,
        scalingRatio: WEBGL_OVERSAMPLING_RATIO
      });

      // Drawing edges
      if (!this.settings.hideEdgesOnMove || !this.camera.isAnimated()) {
        gl = this.contexts.edges;
        program = this.edgePrograms.def;

        program.render(gl, this.edgeArray, {
          matrix: cameraMatrix,
          width: this.width,
          height: this.height,
          ratio: cameraState.ratio,
          edgesPowRatio: 0.5,
          scalingRatio: WEBGL_OVERSAMPLING_RATIO,
          indices: this.edgeIndicesArray
        });
      }

      // Finding visible nodes to display their labels
      var visibleNodes = void 0;

      if (cameraState.ratio >= 1) {

        // Camera is unzoomed so no need to ask the quadtree for visible nodes
        visibleNodes = this.sigma.getGraph().nodes();
      } else {

        // Let's ask the quadtree
        var viewRectangle = this.camera.viewRectangle();

        visibleNodes = this.quadtree.rectangle(viewRectangle.x1, viewRectangle.y1, viewRectangle.x2, viewRectangle.y2, viewRectangle.height);
      }

      // Drawing labels
      // TODO: POW RATIO is currently default 0.5 and harcoded
      var context = this.contexts.labels;

      var sizeRatio = Math.pow(cameraState.ratio, 0.5);

      for (var i = 0, l = visibleNodes.length; i < l; i++) {
        var data = this.nodeDataCache[visibleNodes[i]];

        var _camera$graphToDispla = this.camera.graphToDisplay(data.x, data.y),
            x = _camera$graphToDispla.x,
            y = _camera$graphToDispla.y;

        // TODO: we can cache the labels we need to render until the camera's ratio changes


        var size = data.size / sizeRatio;

        // TODO: this is the label threshold hardcoded
        if (size < 8) continue;

        (0, _label2.default)(context, {
          label: data.label,
          size: size,
          x: x,
          y: y
        });
      }

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

        var _camera$graphToDispla2 = camera.graphToDisplay(data.x, data.y),
            x = _camera$graphToDispla2.x,
            y = _camera$graphToDispla2.y;

        var size = data.size / sizeRatio;

        (0, _hover2.default)(context, {
          label: data.label,
          color: data.color,
          size: size,
          x: x,
          y: y
        });
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
  }]);

  return WebGLRenderer;
}(_renderer2.default);

exports.default = WebGLRenderer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Sigma.js Core Class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * ====================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Core class holding state for the bound graph and using a combination of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * a renderer & camera to display the bound graph on screen.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _isGraph = __webpack_require__(22);

var _isGraph2 = _interopRequireDefault(_isGraph);

var _renderer = __webpack_require__(0);

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: sigma should only hold the graph and compose state to give to renderer,
// does it need to orchestrate?

// TODO: should be able to take n renderers
// TODO: what to do with refresh methods? We should probably drop them

// TODO: create a thumbnail renderer

/**
 * Sigma class
 *
 * @constructor
 * @param {Graph}    graph    - A graphology Graph instance.
 * @param {Renderer} renderer - A Renderer instance.
 */
var Sigma = function () {
  function Sigma(graph, renderer) {
    _classCallCheck(this, Sigma);

    // Checking the arguments
    if (!(0, _isGraph2.default)(graph)) throw new Error('Sigma.constructor: given graph is not an instance of a graphology implementation.');

    if (!(renderer instanceof _renderer2.default)) throw new Error('Sigma.constructor: given renderer is not an instance of a sigma Renderer.');

    // Properties
    this.graph = graph;
    this.renderer = renderer;
    this.renderer.bind(this);

    // Userland state
    this.state = {};
    this.nodeStates = null;
    this.edgeStates = null;

    // First time render
    this.renderer.render();
  }

  /**---------------------------------------------------------------------------
   * Internals
   **---------------------------------------------------------------------------
   */

  /**---------------------------------------------------------------------------
   * Getters
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the graph bound to the instance.
   *
   * @return {Graph} - The bound graph.
   */


  _createClass(Sigma, [{
    key: 'getGraph',
    value: function getGraph() {
      return this.graph;
    }

    /**
     * Method returning the composed data of the target node.
     *
     * @return {string} key - The node's key.
     * @return {object}     - The node's attributes.
     */

  }, {
    key: 'getNodeData',
    value: function getNodeData(key) {

      // TODO: this will change to compose state later
      return this.graph.getNodeAttributes(key);
    }

    /**
     * Method returning the composed data of the target edge.
     *
     * @return {string} key - The edge's key.
     * @return {object}     - The edge's attributes.
     */

  }, {
    key: 'getEdgeData',
    value: function getEdgeData(key) {

      // TODO: this will change to compose state later
      return this.graph.getEdgeAttributes(key);
    }

    /**
     * Method returning the extent of the bound graph.
     *
     * @return {object} - The graph's extent.
     */

  }, {
    key: 'getGraphExtent',
    value: function getGraphExtent() {
      var graph = this.graph;

      var nodes = graph.nodes(),
          edges = graph.edges();

      var maxX = -Infinity,
          maxY = -Infinity,
          minX = Infinity,
          minY = Infinity,
          maxNodeSize = -Infinity,
          maxEdgeSize = -Infinity;

      for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];

        var data = this.getNodeData(node);

        if (data.x > maxX) maxX = data.x;
        if (data.y > maxY) maxY = data.y;

        if (data.x < minX) minX = data.x;
        if (data.y < minY) minY = data.y;

        var size = data.size || 1;

        if (size > maxNodeSize) maxNodeSize = size;
      }

      for (var _i = 0, _l = edges.length; _i < _l; _i++) {
        var edge = edges[_i];

        var _data = this.getEdgeData(edge);

        var _size = _data.size || 1;

        if (_size > maxEdgeSize) maxEdgeSize = _size;
      }

      return {
        maxX: maxX,
        maxY: maxY,
        minX: minX,
        minY: minY,
        maxNodeSize: maxNodeSize,
        maxEdgeSize: maxEdgeSize
      };
    }
  }]);

  return Sigma;
}();

exports.default = Sigma;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(2);

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
/* 13 */
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
  if (typeof e.wheelDelta !== 'undefined') return e.wheelDelta;

  if (typeof e.detail !== 'undefined') return -e.detail;

  throw new Error('sigma/captors/utils.getDelta: could not extract delta from event.');
}

/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sigma = __webpack_require__(11);

var _sigma2 = _interopRequireDefault(_sigma);

var _renderer = __webpack_require__(0);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(3);

var _camera2 = _interopRequireDefault(_camera);

var _quadtree = __webpack_require__(5);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _mouse = __webpack_require__(4);

var _mouse2 = _interopRequireDefault(_mouse);

var _webgl = __webpack_require__(10);

var _webgl2 = _interopRequireDefault(_webgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sigma.js Library Endpoint
 * ==========================
 *
 * The library endpoint.
 */
var library = {
  Sigma: _sigma2.default,
  Renderer: _renderer2.default,
  Camera: _camera2.default,
  QuadTree: _quadtree2.default,
  MouseCaptor: _mouse2.default,
  WebGLRenderer: _webgl2.default
};

for (var k in library) {
  _sigma2.default[k] = library[k];
}module.exports = _sigma2.default;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = drawHover;

var _node = __webpack_require__(17);

var _node2 = _interopRequireDefault(_node);

var _label = __webpack_require__(6);

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sigma.js Canvas Renderer Hover Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's hovered
 * state.
 */
function drawHover(context, data) {

  context.font = '14px arial';

  // Then we draw the label background
  context.beginPath();
  context.fillStyle = '#fff';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = '#000';

  var textWidth = context.measureText(data.label).width;

  var x = Math.round(data.x - 14 / 2 - 2),
      y = Math.round(data.y - 14 / 2 - 2),
      w = Math.round(textWidth + 14 / 2 + data.size + 9),
      h = Math.round(14 + 4),
      e = Math.round(14 / 2 + 2);

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
  (0, _label2.default)(context, data);
}

// ;(function(undefined) {
//   'use strict';

//   if (typeof sigma === 'undefined')
//     throw 'sigma is not declared';

//   // Initialize packages:
//   sigma.utils.pkg('sigma.canvas.hovers');

//   /**
//    * This hover renderer will basically display the label with a background.
//    *
//    * @param  {object}                   node     The node object.
//    * @param  {CanvasRenderingContext2D} context  The canvas context.
//    * @param  {configurable}             settings The settings function.
//    */
//   sigma.canvas.hovers.def = function(node, context, settings) {
//     var x,
//         y,
//         w,
//         h,
//         e,
//         fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
//         prefix = settings('prefix') || '',
//         size = node[prefix + 'size'],
//         fontSize = (settings('labelSize') === 'fixed') ?
//           settings('defaultLabelSize') :
//           settings('labelSizeRatio') * size;

//     // Label background:
//     context.font = (fontStyle ? fontStyle + ' ' : '') +
//       fontSize + 'px ' + (settings('hoverFont') || settings('font'));

//     context.beginPath();
//     context.fillStyle = settings('labelHoverBGColor') === 'node' ?
//       (node.color || settings('defaultNodeColor')) :
//       settings('defaultHoverLabelBGColor');

//     if (node.label && settings('labelHoverShadow')) {
//       context.shadowOffsetX = 0;
//       context.shadowOffsetY = 0;
//       context.shadowBlur = 8;
//       context.shadowColor = settings('labelHoverShadowColor');
//     }

//     if (node.label && typeof node.label === 'string') {
//       x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
//       y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
//       w = Math.round(
//         context.measureText(node.label).width + fontSize / 2 + size + 7
//       );
//       h = Math.round(fontSize + 4);
//       e = Math.round(fontSize / 2 + 2);

//       context.moveTo(x, y + e);
//       context.arcTo(x, y, x + e, y, e);
//       context.lineTo(x + w, y);
//       context.lineTo(x + w, y + h);
//       context.lineTo(x + e, y + h);
//       context.arcTo(x, y + h, x, y + h - e, e);
//       context.lineTo(x, y + e);

//       context.closePath();
//       context.fill();

//       context.shadowOffsetX = 0;
//       context.shadowOffsetY = 0;
//       context.shadowBlur = 0;
//     }

//     // Node border:
//     if (settings('borderSize') > 0) {
//       context.beginPath();
//       context.fillStyle = settings('nodeBorderColor') === 'node' ?
//         (node.color || settings('defaultNodeColor')) :
//         settings('defaultNodeBorderColor');
//       context.arc(
//         node[prefix + 'x'],
//         node[prefix + 'y'],
//         size + settings('borderSize'),
//         0,
//         Math.PI * 2,
//         true
//       );
//       context.closePath();
//       context.fill();
//     }

//     // Node:
//     var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
//     nodeRenderer(node, context, settings);

//     // Display the label:
//     if (node.label && typeof node.label === 'string') {
//       context.fillStyle = (settings('labelHoverColor') === 'node') ?
//         (node.color || settings('defaultNodeColor')) :
//         settings('defaultLabelHoverColor');

//       context.fillText(
//         node.label,
//         Math.round(node[prefix + 'x'] + size + 3),
//         Math.round(node[prefix + 'y'] + fontSize / 3)
//       );
//     }
//   };
// }).call(this);

/***/ }),
/* 17 */
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
/* 18 */
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

function scale(m, x) {
  m[0] = x;
  m[4] = x;

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(8);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(1);

var _edgeVert = __webpack_require__(24);

var _edgeVert2 = _interopRequireDefault(_edgeVert);

var _edgeFrag = __webpack_require__(23);

var _edgeFrag2 = _interopRequireDefault(_edgeFrag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Sigma.js WebGL Renderer Node Program
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


var EdgeProgram = function (_Program) {
  _inherits(EdgeProgram, _Program);

  function EdgeProgram(gl) {
    _classCallCheck(this, EdgeProgram);

    // Initializing buffers
    var _this = _possibleConstructorReturn(this, (EdgeProgram.__proto__ || Object.getPrototypeOf(EdgeProgram)).call(this, gl, _edgeVert2.default, _edgeFrag2.default));

    _this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffer);

    _this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.indicesBuffer);

    // Locations
    _this.positionLocation = gl.getAttribLocation(_this.program, 'a_position');
    _this.normalLocation = gl.getAttribLocation(_this.program, 'a_normal');
    _this.thicknessLocation = gl.getAttribLocation(_this.program, 'a_thickness');
    _this.colorLocation = gl.getAttribLocation(_this.program, 'a_color');
    _this.resolutionLocation = gl.getUniformLocation(_this.program, 'u_resolution');
    _this.ratioLocation = gl.getUniformLocation(_this.program, 'u_ratio');
    _this.matrixLocation = gl.getUniformLocation(_this.program, 'u_matrix');

    // Bindings
    gl.enableVertexAttribArray(_this.positionLocation);
    gl.enableVertexAttribArray(_this.normalLocation);
    gl.enableVertexAttribArray(_this.thicknessLocation);
    gl.enableVertexAttribArray(_this.colorLocation);

    gl.vertexAttribPointer(_this.positionLocation, 2, gl.FLOAT, false, EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(_this.normalLocation, 2, gl.FLOAT, false, EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(_this.thicknessLocation, 1, gl.FLOAT, false, EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    gl.vertexAttribPointer(_this.colorLocation, 1, gl.FLOAT, false, EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);

    // Enabling the OES_element_index_uint extension
    // NOTE: on older GPUs, this means that really large graphs won't
    // have all their edges rendered. But it seems that the
    // `OES_element_index_uint` is quite everywhere so we'll handle
    // the potential issue if it really arises.
    var extension = gl.getExtension('OES_element_index_uint');
    _this.canUse32BitsIndices = !!extension;
    _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
    _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    return _this;
  }

  _createClass(EdgeProgram, [{
    key: 'process',
    value: function process(array, sourceData, targetData, data, i) {

      if (sourceData.hidden || targetData.hidden || data.hidden) {
        for (var l = i + EdgeProgram.POINTS * EdgeProgram.ATTRIBUTES; i < l; i++) {
          array[i] = 0;
        }
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
      array[i++] = color;
    }
  }, {
    key: 'computeIndices',
    value: function computeIndices(array) {
      var l = array.length / EdgeProgram.ATTRIBUTES;

      var size = l + l / 2;

      var indices = new this.IndicesArray(size);

      for (var i = 0, c = 0; i < size; i += 4) {
        indices[c++] = i;
        indices[c++] = i + 1;
        indices[c++] = i + 2;
        indices[c++] = i + 2;
        indices[c++] = i + 1;
        indices[c++] = i + 3;
      }

      return indices;
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl, array, indicesArray) {

      // Vertices data
      gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

      // Indices data
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);
    }
  }, {
    key: 'render',
    value: function render(gl, array, params) {
      var program = this.program;
      gl.useProgram(program);

      // Binding uniforms
      gl.uniform2f(this.resolutionLocation, params.width, params.height);
      gl.uniform1f(this.ratioLocation, params.ratio / Math.pow(params.ratio, params.edgesPowRatio));

      gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

      // Drawing:
      gl.drawElements(gl.TRIANGLES, params.indices.length, this.indicesType, 0);
    }
  }]);

  return EdgeProgram;
}(_program2.default);

exports.default = EdgeProgram;


EdgeProgram.POINTS = 4;
EdgeProgram.ATTRIBUTES = 6;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(8);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(1);

var _nodeFastVert = __webpack_require__(26);

var _nodeFastVert2 = _interopRequireDefault(_nodeFastVert);

var _nodeFastFrag = __webpack_require__(25);

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


var NodeProgramFast = function (_Program) {
  _inherits(NodeProgramFast, _Program);

  function NodeProgramFast(gl) {
    _classCallCheck(this, NodeProgramFast);

    // Initializing buffers
    var _this = _possibleConstructorReturn(this, (NodeProgramFast.__proto__ || Object.getPrototypeOf(NodeProgramFast)).call(this, gl, _nodeFastVert2.default, _nodeFastFrag2.default));

    _this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffer);

    var program = _this.program;

    // Locations
    _this.positionLocation = gl.getAttribLocation(program, 'a_position');
    _this.sizeLocation = gl.getAttribLocation(program, 'a_size');
    _this.colorLocation = gl.getAttribLocation(program, 'a_color');
    _this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    _this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    _this.ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    _this.scaleLocation = gl.getUniformLocation(program, 'u_scale');

    // Bindings
    gl.enableVertexAttribArray(_this.positionLocation);
    gl.enableVertexAttribArray(_this.sizeLocation);
    gl.enableVertexAttribArray(_this.colorLocation);

    gl.vertexAttribPointer(_this.positionLocation, 2, gl.FLOAT, false, NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(_this.sizeLocation, 1, gl.FLOAT, false, NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(_this.colorLocation, 1, gl.FLOAT, false, NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
    return _this;
  }

  _createClass(NodeProgramFast, [{
    key: 'process',
    value: function process(array, data, i) {
      var color = (0, _utils.floatColor)(data.color);

      array[i++] = data.x;
      array[i++] = data.y;
      array[i++] = data.size;
      array[i++] = color;
    }
  }, {
    key: 'bufferData',
    value: function bufferData(gl, array) {
      gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
    }
  }, {
    key: 'render',
    value: function render(gl, array, params) {
      var program = this.program;
      gl.useProgram(program);

      gl.uniform2f(this.resolutionLocation, params.width, params.height);
      gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
      gl.uniform1f(this.scaleLocation, params.scalingRatio);
      gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

      gl.drawArrays(gl.POINTS, 0, array.length / NodeProgramFast.ATTRIBUTES);
    }
  }]);

  return NodeProgramFast;
}(_program2.default);

exports.default = NodeProgramFast;


NodeProgramFast.POINTS = 1;
NodeProgramFast.ATTRIBUTES = 4;

/***/ }),
/* 21 */
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
/* 22 */
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
/* 23 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nvoid main(void) {\n  float feather = 1.3;\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n\n  float radius = v_thickness;\n\n  float dist = length(v_normal) * radius;\n\n  float t = smoothstep(\n    radius - feather,\n    radius,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, color0, t);\n}\n"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_thickness;\nattribute float a_color;\n\nuniform vec2 u_resolution;\nuniform float u_ratio;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nvoid main() {\n\n  float feather = 0.5;\n\n  v_thickness = a_thickness * u_ratio / 2.0 + feather;\n\n  // Scale from [[-1 1] [-1 1]] to the container:\n  vec2 delta = vec2(a_normal * v_thickness);\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n  position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);\n\n  // Applying\n  gl_Position = vec4(position, 0, 1);\n\n  v_normal = a_normal;\n  v_thickness = max(1.0, length(delta) * u_matrix[0][0]);\n\n  // Extract the color:\n  float c = a_color;\n  v_color.b = mod(c, 256.0); c = floor(c / 256.0);\n  v_color.g = mod(c, 256.0); c = floor(c / 256.0);\n  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;\n  v_color.a = 1.0;\n}\n"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 color;\nvarying float ratio;\n\nvoid main(void) {\n  float border = 0.05 * ratio;\n  float radius = 0.5;\n\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / border;\n\n  gl_FragColor = mix(color0, color, t);\n}\n"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute float a_size;\nattribute float a_color;\n\nuniform vec2 u_resolution;\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 color;\nvarying float ratio;\n\nvoid main() {\n\n  gl_Position = vec4(\n    ((u_matrix * vec3(a_position, 1)).xy /\n      u_resolution * 2.0 - 1.0) * vec2(1, -1),\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  ratio = 1.0 / u_ratio;\n\n  // Extract the color:\n  float c = a_color;\n  color.b = mod(c, 256.0); c = floor(c / 256.0);\n  color.g = mod(c, 256.0); c = floor(c / 256.0);\n  color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;\n  color.a = 1.0;\n}\n"

/***/ })
/******/ ]);
});