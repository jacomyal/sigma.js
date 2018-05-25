/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports) {

/**
 * Graphology isGraphConstructor
 * ==============================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology constructor.
 */

/**
 * Checking the value is a graphology constructor.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraphConstructor(value) {
  return (
    value !== null &&
    typeof value === 'function' &&
    typeof value.prototype === 'object' &&
    typeof value.prototype.addUndirectedEdgeWithKey === 'function' &&
    typeof value.prototype.dropNodes === 'function'
  );
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(37);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(93),
    getValue = __webpack_require__(99);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(24),
    getRawTag = __webpack_require__(95),
    objectToString = __webpack_require__(96);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Graphology Custom Errors
 * =========================
 *
 * Defining custom errors for ease of use & easy unit tests across
 * implementations (normalized typology rather than relying on error
 * messages to check whether the correct error was found).
 */
var GraphError = exports.GraphError = function (_Error) {
  _inherits(GraphError, _Error);

  function GraphError(message, data) {
    _classCallCheck(this, GraphError);

    var _this = _possibleConstructorReturn(this, _Error.call(this));

    _this.name = 'GraphError';
    _this.message = message || '';
    _this.data = data || {};
    return _this;
  }

  return GraphError;
}(Error);

var InvalidArgumentsGraphError = exports.InvalidArgumentsGraphError = function (_GraphError) {
  _inherits(InvalidArgumentsGraphError, _GraphError);

  function InvalidArgumentsGraphError(message, data) {
    _classCallCheck(this, InvalidArgumentsGraphError);

    var _this2 = _possibleConstructorReturn(this, _GraphError.call(this, message, data));

    _this2.name = 'InvalidArgumentsGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this2, InvalidArgumentsGraphError.prototype.constructor);
    return _this2;
  }

  return InvalidArgumentsGraphError;
}(GraphError);

var NotFoundGraphError = exports.NotFoundGraphError = function (_GraphError2) {
  _inherits(NotFoundGraphError, _GraphError2);

  function NotFoundGraphError(message, data) {
    _classCallCheck(this, NotFoundGraphError);

    var _this3 = _possibleConstructorReturn(this, _GraphError2.call(this, message, data));

    _this3.name = 'NotFoundGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this3, NotFoundGraphError.prototype.constructor);
    return _this3;
  }

  return NotFoundGraphError;
}(GraphError);

var UsageGraphError = exports.UsageGraphError = function (_GraphError3) {
  _inherits(UsageGraphError, _GraphError3);

  function UsageGraphError(message, data) {
    _classCallCheck(this, UsageGraphError);

    var _this4 = _possibleConstructorReturn(this, _GraphError3.call(this, message, data));

    _this4.name = 'UsageGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this4, UsageGraphError.prototype.constructor);
    return _this4;
  }

  return UsageGraphError;
}(GraphError);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var createRange = __webpack_require__(173);

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

module.exports = range;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.assign = assign;
exports.getMatchingEdge = getMatchingEdge;
exports.isBunch = isBunch;
exports.isGraph = isGraph;
exports.isPlainObject = isPlainObject;
exports.overBunch = overBunch;
exports.prettyPrint = prettyPrint;
exports.privateProperty = privateProperty;
exports.readOnlyProperty = readOnlyProperty;
exports.incrementalId = incrementalId;
/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign() {
  var target = arguments[0] || {};

  for (var i = 1, l = arguments.length; i < l; i++) {
    if (!arguments[i]) continue;

    for (var k in arguments[i]) {
      target[k] = arguments[i][k];
    }
  }

  return target;
}

/**
 * Function returning the first matching edge for given path.
 * Note: this function does not check the existence of source & target. This
 * must be performed by the caller.
 *
 * @param  {Graph}  graph  - Target graph.
 * @param  {any}    source - Source node.
 * @param  {any}    target - Target node.
 * @param  {string} type   - Type of the edge (mixed, directed or undirected).
 * @return {string|null}
 */
function getMatchingEdge(graph, source, target, type) {
  var sourceData = graph._nodes.get(source);

  var edge = null;

  if (type === 'mixed') {
    edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
  } else if (type === 'directed') {
    edge = sourceData.out && sourceData.out[target];
  } else {
    edge = sourceData.undirected && sourceData.undirected[target];
  }

  return edge;
}

/**
 * Checks whether the given value is a potential bunch.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
function isBunch(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && (Array.isArray(value) || typeof Map === 'function' && value instanceof Map || typeof Set === 'function' && value instanceof Set || !(value instanceof Date) && !(value instanceof RegExp));
}

/**
 * Checks whether the given value is a Graph implementation instance.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
function isGraph(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.addUndirectedEdgeWithKey === 'function' && typeof value.dropNode === 'function';
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
function isPlainObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && value.constructor === Object;
}

/**
 * Iterates over the provided bunch.
 *
 * @param {object}   bunch    - Target bunch.
 * @param {function} callback - Function to call.
 */
function overBunch(bunch, callback) {

  // Array iteration
  if (Array.isArray(bunch)) {
    for (var i = 0, l = bunch.length; i < l; i++) {
      callback(bunch[i], null);
    }
  }

  // Map & Set iteration
  else if (typeof bunch.forEach === 'function') {
      var iterator = bunch.entries();

      var step = void 0;

      while (step = iterator.next()) {
        var _step = step,
            value = _step.value,
            done = _step.done;


        if (done) break;

        var k = value[0],
            v = value[1];


        if (v === k) callback(v, null);else callback(k, v);
      }
    }

    // Plain object iteration
    else {
        for (var key in bunch) {
          var attributes = bunch[key];

          callback(key, attributes);
        }
      }
}

/**
 * Pretty prints the given integer.
 *
 * @param  {number}  integer - Target integer.
 * @return {string}          - The pretty string.
 */
function prettyPrint(integer) {
  var string = '' + integer;

  var prettyString = '';

  for (var i = 0, l = string.length; i < l; i++) {
    var j = l - i - 1;

    prettyString = string[j] + prettyString;

    if (!((i - 2) % 3) && i !== l - 1) prettyString = ',' + prettyString;
  }

  return prettyString;
}

/**
 * Creates a "private" property for the given member name by concealing it
 * using the `enumerable` option.
 *
 * @param {object} target - Target object.
 * @param {string} name   - Member name.
 */
function privateProperty(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: true,
    value: value
  });
}

/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {mixed}    value  - The attached getter or fixed value.
 */
function readOnlyProperty(target, name, value) {
  var descriptor = {
    enumerable: true,
    configurable: true
  };

  if (typeof value === 'function') {
    descriptor.get = value;
  } else {
    descriptor.value = value;
    descriptor.writable = false;
  }

  Object.defineProperty(target, name, descriptor);
}

/**
 * Creates a function generating incremental ids for edges.
 *
 * @return {function}
 */
function incrementalId() {
  var i = 0;

  return function () {
    return '_geid' + i++ + '_';
  };
}

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports) {

/**
 * Obliterator Iterator Class
 * ===========================
 *
 * Simple class representing the library's iterators.
 */

/**
 * Iterator class.
 *
 * @constructor
 * @param {function} next - Next function.
 */
function Iterator(next) {

  // Hiding the given function
  Object.defineProperty(this, '_next', {
    writable: false,
    enumerable: false,
    value: next
  });

  // Is the iterator complete?
  this.done = false;
}

/**
 * Next function.
 *
 * @return {object}
 */
// NOTE: maybe this should dropped for performance?
Iterator.prototype.next = function() {
  if (this.done)
    return {done: true};

  var step = this._next();

  if (step.done)
    this.done = true;

  return step;
};

/**
 * If symbols are supported, we add `next` to `Symbol.iterator`.
 */
if (typeof Symbol !== 'undefined')
  Iterator.prototype[Symbol.iterator] = function() {
    return this;
  };

/**
 * Returning an iterator of the given values.
 *
 * @param  {any...} values - Values.
 * @return {Iterator}
 */
Iterator.of = function() {
  var args = arguments,
      l = args.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    return {done: false, value: args[i++]};
  });
};

/**
 * Returning an empty iterator.
 *
 * @return {Iterator}
 */
Iterator.empty = function() {
  var iterator = new Iterator(null);
  iterator.done = true;

  return iterator;
};

/**
 * Returning whether the given value is an iterator.
 *
 * @param  {any} value - Value.
 * @return {boolean}
 */
Iterator.is = function(value) {
  if (value instanceof Iterator)
    return true;

  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.next === 'function'
  );
};

/**
 * Exporting.
 */
module.exports = Iterator;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(83),
    listCacheDelete = __webpack_require__(84),
    listCacheGet = __webpack_require__(85),
    listCacheHas = __webpack_require__(86),
    listCacheSet = __webpack_require__(87);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(6);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(108);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(23),
    isLength = __webpack_require__(45);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(47),
    baseRest = __webpack_require__(29),
    customDefaultsMerge = __webpack_require__(148),
    mergeWith = __webpack_require__(165);

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* eslint no-constant-condition: 0 */
/**
 * Obliterator Take Function
 * ==========================
 *
 * Function taking n or every value of the given iterator and returns them
 * into an array.
 */

/**
 * Take.
 *
 * @param  {Iterator} iterator - Target iterator.
 * @param  {number}   [n]      - Optional number of items to take.
 * @return {array}
 */
module.exports = function take(iterator, n) {
  var l = arguments.length > 1 ? n : Infinity,
      array = l !== Infinity ? new Array(l) : [],
      step,
      i = 0;

  while (true) {

    if (i === l)
      return array;

    step = iterator.next();

    if (step.done) {

      if (i !== n)
        return array.slice(0, i);

      return array;
    }

    array[i++] = step.value;
  }
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MixedNodeData = MixedNodeData;
exports.DirectedNodeData = DirectedNodeData;
exports.UndirectedNodeData = UndirectedNodeData;
exports.DirectedEdgeData = DirectedEdgeData;
exports.UndirectedEdgeData = UndirectedEdgeData;
/**
 * Graphology Internal Data Classes
 * =================================
 *
 * Internal classes hopefully reduced to structs by engines & storing
 * necessary information for nodes & edges.
 *
 * Note that those classes don't rely on the `class` keyword to avoid some
 * cruft introduced by most of ES2015 transpilers.
 */

/**
 * MixedNodeData class.
 *
 * @constructor
 * @param {object} attributes - Node's attributes.
 */
function MixedNodeData(attributes) {

  // Attributes
  this.attributes = attributes;

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.undirectedDegree = 0;
  this.directedSelfLoops = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
  this.undirected = {};
}

/**
 * DirectedNodeData class.
 *
 * @constructor
 * @param {object} attributes - Node's attributes.
 */
function DirectedNodeData(attributes) {

  // Attributes
  this.attributes = attributes || {};

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
}

DirectedNodeData.prototype.upgradeToMixed = function () {

  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
};

/**
 * UndirectedNodeData class.
 *
 * @constructor
 * @param {object} attributes - Node's attributes.
 */
function UndirectedNodeData(attributes) {

  // Attributes
  this.attributes = attributes || {};

  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
}

UndirectedNodeData.prototype.upgradeToMixed = function () {

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
};

/**
 * DirectedEdgeData class.
 *
 * @constructor
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
function DirectedEdgeData(generatedKey, source, target, attributes) {

  // Attributes
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}

/**
 * UndirectedEdgeData class.
 *
 * @constructor
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
function UndirectedEdgeData(generatedKey, source, target, attributes) {

  // Attributes
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(7),
    isObject = __webpack_require__(3);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(2),
    stubFalse = __webpack_require__(130);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module)))

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(131),
    baseUnary = __webpack_require__(132),
    nodeUtil = __webpack_require__(133);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(48),
    overRest = __webpack_require__(143),
    setToString = __webpack_require__(144);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(49);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(42),
    baseKeysIn = __webpack_require__(163),
    isArrayLike = __webpack_require__(18);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(6),
    isArrayLike = __webpack_require__(18),
    isIndex = __webpack_require__(44),
    isObject = __webpack_require__(3);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Graphology mergePath
 * =====================
 *
 * Function merging the given path to the graph.
 */

/**
 * Merging the given path to the graph.
 *
 * @param  {Graph} graph - Target graph.
 * @param  {array} nodes - Nodes representing the path to merge.
 */
module.exports = function mergePath(graph, nodes) {
  if (nodes.length === 0)
    return;

  var previousNode, node, i, l;

  graph.mergeNode(nodes[0]);

  for (i = 1, l = nodes.length; i < l; i++) {
    previousNode = nodes[i - 1];
    node = nodes[i];

    graph.mergeEdge(previousNode, node);
  }
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(11);

var _easings = __webpack_require__(232);

var easings = _interopRequireWildcard(_easings);

var _utils = __webpack_require__(63);

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

    _this.x = 0.5;
    _this.y = 0.5;
    _this.angle = 0;
    _this.ratio = 1;
    _this.width = dimensions.width || 0;
    _this.height = dimensions.height || 0;

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
      var marginX = 0 * this.width / 8,
          marginY = 0 * this.height / 8;

      var p1 = this.viewportToGraph(dimensions, 0 - marginX, 0 - marginY),
          p2 = this.viewportToGraph(dimensions, this.width + marginX, 0 - marginY),
          h = this.viewportToGraph(dimensions, 0, this.height + marginY);

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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatColor = floatColor;
exports.matrixFromCamera = matrixFromCamera;
exports.extractPixel = extractPixel;

var _matrices = __webpack_require__(239);

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

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13),
    stackClear = __webpack_require__(88),
    stackDelete = __webpack_require__(89),
    stackGet = __webpack_require__(90),
    stackHas = __webpack_require__(91),
    stackSet = __webpack_require__(92);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(94)))

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(100),
    mapCacheDelete = __webpack_require__(107),
    mapCacheGet = __webpack_require__(109),
    mapCacheHas = __webpack_require__(110),
    mapCacheSet = __webpack_require__(111);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(112),
    arraySome = __webpack_require__(115),
    cacheHas = __webpack_require__(116);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(128),
    isArguments = __webpack_require__(43),
    isArray = __webpack_require__(17),
    isBuffer = __webpack_require__(25),
    isIndex = __webpack_require__(44),
    isTypedArray = __webpack_require__(27);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(129),
    isObjectLike = __webpack_require__(5);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(36),
    assignMergeValue = __webpack_require__(51),
    baseFor = __webpack_require__(149),
    baseMergeDeep = __webpack_require__(151),
    isObject = __webpack_require__(3),
    keysIn = __webpack_require__(31),
    safeGet = __webpack_require__(53);

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(30),
    eq = __webpack_require__(6);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(46);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  return key == '__proto__'
    ? undefined
    : object[key];
}

module.exports = safeGet;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Obliterator Combinations Function
 * ==================================
 *
 * Iterator returning combinations of the given array.
 */
var Iterator = __webpack_require__(12);

/**
 * Helper mapping indices to items.
 */
function indicesToItems(target, items, indices, r) {
  for (var i = 0; i < r; i++)
    target[i] = items[indices[i]];
}

/**
 * Combinations.
 *
 * @param  {array}    array - Target array.
 * @param  {number}   r     - Size of the subsequences.
 * @return {Iterator}
 */
module.exports = function combinations(array, r) {
  if (!Array.isArray(array))
    throw new Error('obliterator/combinations: first argument should be an array.');

  var n = array.length;

  if (typeof r !== 'number')
    throw new Error('obliterator/combinations: second argument should be omitted or a number.');

  if (r > n)
    throw new Error('obliterator/combinations: the size of the subsequences should not exceed the length of the array.');

  if (r === n)
    return Iterator.of(array.slice());

  var indices = new Array(r),
      subsequence = new Array(r),
      first = true,
      i;

  for (i = 0; i < r; i++)
    indices[i] = i;

  return new Iterator(function next() {
    if (first) {
      first = false;

      indicesToItems(subsequence, array, indices, r);
      return {value: subsequence};
    }

    if (indices[r - 1]++ < n - 1) {
      indicesToItems(subsequence, array, indices, r);
      return {value: subsequence};
    }

    i = r - 2;

    while (i >= 0 && indices[i] >= (n - (r - i)))
      --i;

    if (i < 0)
      return {done: true};

    indices[i]++;

    while (++i < r)
      indices[i] = indices[i - 1] + 1;

    indicesToItems(subsequence, array, indices, r);
    return {value: subsequence};
  });
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Density
 * ===================
 *
 * Functions used to compute the density of the given graph.
 */
var isGraph = __webpack_require__(0);

/**
 * Returns the undirected density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function undirectedDensity(order, size) {
  return 2 * size / (order * (order - 1));
}

/**
 * Returns the directed density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function directedDensity(order, size) {
  return size / (order * (order - 1));
}

/**
 * Returns the mixed density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function mixedDensity(order, size) {
  var d = (order * (order - 1));

  return (
    size /
    (d + d / 2)
  );
}

/**
 * Returns the size a multi graph would have if it were a simple one.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {number}
 */
function simpleSizeForMultiGraphs(graph) {
  var nodes = graph.nodes(),
      size = 0,
      i,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    size += graph.outNeighbors(nodes[i]).length;
    size += graph.undirectedNeighbors(nodes[i]).length / 2;
  }

  return size;
}

/**
 * Returns the density for the given parameters.
 *
 * Arity 3:
 * @param  {boolean} type  - Type of density.
 * @param  {boolean} multi - Compute multi density?
 * @param  {Graph}   graph - Target graph.
 *
 * Arity 4:
 * @param  {boolean} type  - Type of density.
 * @param  {boolean} multi - Compute multi density?
 * @param  {number}  order - Number of nodes in the graph.
 * @param  {number}  size  - Number of edges in the graph.
 *
 * @return {number}
 */
function abstractDensity(type, multi, graph) {
  var order,
      size;

  // Retrieving order & size
  if (arguments.length > 3) {
    order = graph;
    size = arguments[3];

    if (typeof order !== 'number')
      throw new Error('graphology-metrics/density: given order is not a number.');

    if (typeof size !== 'number')
      throw new Error('graphology-metrics/density: given size is not a number.');
  }
  else {

    if (!isGraph(graph))
      throw new Error('graphology-metrics/density: given graph is not a valid graphology instance.');

    order = graph.order;
    size = graph.size;

    if (graph.multi && multi === false)
      size = simpleSizeForMultiGraphs(graph);
  }

  // Guessing type & multi
  if (type === null)
    type = graph.type;
  if (multi === null)
    multi = graph.multi;

  // Getting the correct function
  var fn;

  if (type === 'undirected')
    fn = undirectedDensity;
  else if (type === 'directed')
    fn = directedDensity;
  else
    fn = mixedDensity;

  // Applying the function
  return fn(order, size);
}

/**
 * Creating the exported functions.
 */
var density = abstractDensity.bind(null, null, null);
density.directedDensity = abstractDensity.bind(null, 'directed', false);
density.undirectedDensity = abstractDensity.bind(null, 'undirected', false);
density.mixedDensity = abstractDensity.bind(null, 'mixed', false);
density.multiDirectedDensity = abstractDensity.bind(null, 'directed', true);
density.multiUndirectedDensity = abstractDensity.bind(null, 'undirected', true);
density.multiMixedDensity = abstractDensity.bind(null, 'mixed', true);

/**
 * Exporting.
 */
module.exports = density;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Graphology mergeStar
 * =====================
 *
 * Function merging the given star to the graph.
 */

/**
 * Merging the given star to the graph.
 *
 * @param  {Graph} graph - Target graph.
 * @param  {array} nodes - Nodes to add, first one being the center of the star.
 */
module.exports = function mergeStar(graph, nodes) {
  if (nodes.length === 0)
    return;

  var node, i, l;

  var center = nodes[0];

  graph.mergeNode(center);

  for (i = 1, l = nodes.length; i < l; i++) {
    node = nodes[i];

    graph.mergeEdge(center, node);
  }
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Unweighted Shortest Path
 * ====================================
 *
 * Basic algorithms to find the shortest paths between nodes in a graph
 * whose edges are not weighted.
 */
var isGraph = __webpack_require__(0),
    Queue = __webpack_require__(204);

/**
 * Function attempting to find the shortest path in a graph between
 * given source & target or `null` if such a path does not exist.
 *
 * @param  {Graph}      graph  - Target graph.
 * @param  {any}        source - Source node.
 * @param  {any}        target - Target node.
 * @return {array|null}        - Found path or `null`.
 */
function bidirectional(graph, source, target) {
  if (!isGraph(graph))
    throw new Error('graphology-shortest-path: invalid graphology instance.');

  if (arguments.length < 3)
    throw new Error('graphology-shortest-path: invalid number of arguments. Expecting at least 3.');

  if (!graph.hasNode(source))
    throw new Error('graphology-shortest-path: the "' + source + '" source node does not exist in the given graph.');

  if (!graph.hasNode(target))
    throw new Error('graphology-shortest-path: the "' + target + '" target node does not exist in the given graph.');

  source = '' + source;
  target = '' + target;

  // TODO: do we need a self loop to go there?
  if (source === target) {
    return [source];
  }

  // Binding functions
  var getPredecessors,
      getSuccessors;

  // TODO: move outside this function
  if (graph.type === 'mixed') {
    getPredecessors = function(node) {
      var result = graph.inNeighbors(node);

      result.push.apply(result, graph.undirectedNeighbors(node));
      return result;
    };

    getSuccessors = function(node) {
      var result = graph.outNeighbors(node);

      result.push.apply(result, graph.undirectedNeighbors(node));
      return result;
    };
  }
  else if (graph.type === 'directed') {
    getPredecessors = graph.inNeighbors.bind(graph);
    getSuccessors = graph.outNeighbors.bind(graph);
  }
  else {
    getPredecessors = getSuccessors = graph.neighbors.bind(graph);
  }

  var predecessor = {},
      successor = {};

  // Predecessor & successor
  predecessor[source] = null;
  successor[target] = null;

  // Fringes
  var forwardFringe = [source],
      reverseFringe = [target],
      currentFringe,
      node,
      neighbors,
      neighbor,
      i,
      j,
      l,
      m;

  outer:
  while (forwardFringe.length && reverseFringe.length) {
    if (forwardFringe.length <= reverseFringe.length) {
      currentFringe = forwardFringe;
      forwardFringe = [];

      for (i = 0, l = currentFringe.length; i < l; i++) {
        node = currentFringe[i];
        neighbors = getSuccessors(node);

        for (j = 0, m = neighbors.length; j < m; j++) {
          neighbor = neighbors[j];

          if (!predecessor[neighbor]) {
            forwardFringe.push(neighbor);
            predecessor[neighbor] = node;
          }

          if (successor[neighbor]) {

            // Path is found!
            break outer;
          }
        }
      }
    }
    else {
      currentFringe = reverseFringe;
      reverseFringe = [];

      for (i = 0, l = currentFringe.length; i < l; i++) {
        node = currentFringe[i];
        neighbors = getPredecessors(node);

        for (j = 0, m = neighbors.length; j < m; j++) {
          neighbor = neighbors[j];

          if (!successor[neighbor]) {
            reverseFringe.push(neighbor);
            successor[neighbor] = node;
          }

          if (predecessor[neighbor]) {

            // Path is found!
            break outer;
          }
        }
      }
    }
  }

  var path = [];

  while (neighbor) {
    path.unshift(neighbor);
    neighbor = predecessor[neighbor];
  }

  neighbor = successor[path[path.length - 1]];

  while (neighbor) {
    path.push(neighbor);
    neighbor = successor[neighbor];
  }

  return path.length ? path : null;
}

/**
 * Function attempting to find the shortest path in the graph between the
 * given source node & all the other nodes.
 *
 * @param  {Graph}  graph  - Target graph.
 * @param  {any}    source - Source node.
 * @return {object}        - The map of found paths.
 */

// TODO: cutoff option
function singleSource(graph, source) {
  if (!isGraph(graph))
    throw new Error('graphology-shortest-path: invalid graphology instance.');

  if (arguments.length < 2)
    throw new Error('graphology-shortest-path: invalid number of arguments. Expecting at least 2.');

  if (!graph.hasNode(source))
    throw new Error('graphology-shortest-path: the "' + source + '" source node does not exist in the given graph.');

  source = '' + source;

  var nextLevel = {},
      paths = {},
      currentLevel,
      neighbors,
      v,
      w,
      i,
      l;

  nextLevel[source] = true;
  paths[source] = [source];

  while (Object.keys(nextLevel).length) {
    currentLevel = nextLevel;
    nextLevel = {};

    for (v in currentLevel) {
      neighbors = graph.outNeighbors(v);
      neighbors.push.apply(neighbors, graph.undirectedNeighbors(v));

      for (i = 0, l = neighbors.length; i < l; i++) {
        w = neighbors[i];

        if (!paths[w]) {
          paths[w] = paths[v].concat(w);
          nextLevel[w] = true;
        }
      }
    }
  }

  return paths;
}

/**
 * Main polymorphic function taking either only a source or a
 * source/target combo.
 *
 * @param  {Graph}  graph      - Target graph.
 * @param  {any}    source     - Source node.
 * @param  {any}    [target]   - Target node.
 * @return {array|object|null} - The map of found paths.
 */
function shortestPath(graph, source, target) {
  if (arguments.length < 3)
    return singleSource(graph, source);

  return bidirectional(graph, source, target);
}

/**
 * Function using Ulrik Brandes' method to map single source shortest paths
 * from selected node.
 *
 * [Reference]:
 * Ulrik Brandes: A Faster Algorithm for Betweenness Centrality.
 * Journal of Mathematical Sociology 25(2):163-177, 2001.
 *
 * @param  {Graph}  graph      - Target graph.
 * @param  {any}    source     - Source node.
 * @return {array}             - [Stack, Paths, Sigma]
 */
function brandes(graph, source) {
  source = '' + source;

  var S = [],
      P = {},
      sigma = {};

  var nodes = graph.nodes(),
      Dv,
      sigmav,
      neighbors,
      v,
      w,
      i,
      j,
      l,
      m;

  for (i = 0, l = nodes.length; i < l; i++) {
    v = nodes[i];
    P[v] = [];
    sigma[v] = 0;
  }

  var D = {};

  sigma[source] = 1;
  D[source] = 0;

  var queue = Queue.of(source);

  while (queue.size) {
    v = queue.dequeue();
    S.push(v);

    Dv = D[v];
    sigmav = sigma[v];

    neighbors = graph
      .undirectedNeighbors(v)
      .concat(graph.outNeighbors(v));

    for (j = 0, m = neighbors.length; j < m; j++) {
      w = neighbors[j];

      if (!(w in D)) {
        queue.enqueue(w);
        D[w] = Dv + 1;
      }

      if (D[w] === Dv + 1) {
        sigma[w] += sigmav;
        P[w].push(v);
      }
    }
  }

  return [S, P, sigma];
}

/**
 * Exporting.
 */
shortestPath.bidirectional = bidirectional;
shortestPath.singleSource = singleSource;
shortestPath.brandes = brandes;

module.exports = shortestPath;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Mnemonist Iterate Function
 * ===========================
 *
 * Harmonized iteration over mixed targets.
 */
var isTypedArray = __webpack_require__(205).isTypedArray;

/**
 * Function used to iterate in a similar way over JavaScript iterables,
 * plain objects & arrays.
 *
 * @param  {any}      target - Iteration target.
 * @param  {function} callback - Iteration callback.
 */
function iterate(target, callback) {
  var iterator, k, i, l, s;

  // The target is an array
  if (
    iterate.isArrayLike(target) ||
    typeof target === 'string' ||
    target.toString() === '[object Arguments]'
  ) {
    for (i = 0, l = target.length; i < l; i++)
      callback(target[i], i);
    return;
  }

  // The target has a #.forEach method
  if (typeof target.forEach === 'function') {
    target.forEach(callback);
    return;
  }

  // The target is iterable
  if (typeof Symbol !== 'undefined' && Symbol.iterator in target)
    target = target[Symbol.iterator]();

  // The target is an iterator
  if (typeof target.next === 'function') {
    iterator = target;
    i = 0;

    while ((s = iterator.next(), !s.done)) {
      callback(s.value, i);
      i++;
    }

    return;
  }

  // The target is a plain object
  for (k in target) {
    if (target.hasOwnProperty(k)) {
      callback(target[k], k);
    }
  }

  return;
}

/**
 * Function used to guess the length of the structure over which we are going
 * to iterate.
 *
 * @param  {any} target - Target object.
 * @return {number|undefined}
 */
iterate.guessLength = function(target) {
  if (typeof target.length === 'number')
    return target.length;

  if (typeof target.size === 'number')
    return target.size;

  return;
};

/**
 * Function used to determine whether the given object supports array-like
 * random access.
 *
 * @param  {any} target - Target object.
 * @return {boolean}
 */
iterate.isArrayLike = function(target) {
  return Array.isArray(target) || isTypedArray(target);
};

/**
 * Exporting.
 */
module.exports = iterate;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Dijkstra Shortest Path
 * ==================================
 *
 * Graphology implementation of Dijkstra shortest path for weighted graphs.
 */
var isGraph = __webpack_require__(0),
    Heap = __webpack_require__(206);

/**
 * Defaults & helpers.
 */
var DEFAULTS = {
  weightAttribute: 'weight'
};

function DIJKSTRA_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0])
    return 1;
  if (a[0] < b[0])
    return -1;

  if (a[1] > b[1])
    return 1;
  if (a[1] < b[1])
    return -1;

  if (a[2] > b[2])
    return 1;
  if (a[2] < b[2])
    return -1;

  return 0;
}

function BRANDES_DIJKSTRA_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0])
    return 1;
  if (a[0] < b[0])
    return -1;

  if (a[1] > b[1])
    return 1;
  if (a[1] < b[1])
    return -1;

  if (a[2] > b[2])
    return 1;
  if (a[2] < b[2])
    return -1;

  if (a[3] > b[3])
    return 1;
  if (a[3] < b[3])
    return - 1;

  return 0;
}

var GET_NEIGHBORS = [
  function(graph, node) {
    return graph
      .undirectedEdges(node)
      .concat(graph.outEdges(node));
  },
  function(graph, node) {
    return graph
      .undirectedEdges(node)
      .concat(graph.inEdges(node));
  }
];

/**
 * Bidirectional Dijkstra shortest path between source & target node abstract.
 *
 * Note that this implementation was basically copied from networkx.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {string} source          - Source node.
 * @param  {string} target          - Target node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @param  {array}                  - The found path if any and its cost.
 */
function abstractBidirectionalDijkstra(graph, source, target, weightAttribute) {
  source = '' + source;
  target = '' + target;

  // Sanity checks
  if (!isGraph(graph))
    throw new Error('graphology-shortest-path/dijkstra: invalid graphology instance.');

  if (source && !graph.hasNode(source))
    throw new Error('graphology-shortest-path/dijkstra: the "' + source + '" source node does not exist in the given graph.');

  if (target && !graph.hasNode(target))
    throw new Error('graphology-shortest-path/dijkstra: the "' + target + '" target node does not exist in the given graph.');

  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  var getWeight = function(e) {
    return graph.getEdgeAttribute(e, weightAttribute);
  };

  if (source === target)
    return [0, [source]];

  var distances = [{}, {}],
      paths = [{}, {}],
      fringe = [new Heap(DIJKSTRA_HEAP_COMPARATOR), new Heap(DIJKSTRA_HEAP_COMPARATOR)],
      seen = [{}, {}];

  paths[0][source] = [source];
  paths[1][target] = [target];

  seen[0][source] = 0;
  seen[1][target] = 0;

  var finalPath,
      finalDistance = Infinity;

  var count = 0,
      dir = 1,
      item,
      edges,
      cost,
      d,
      v,
      u,
      e,
      i,
      l;

  fringe[0].push([0, count++, source]);
  fringe[1].push([0, count++, target]);

  while (fringe[0].size && fringe[1].size) {

    // Swapping direction
    dir = 1 - dir;

    item = fringe[dir].pop();
    d = item[0];
    v = item[2];

    if (v in distances[dir])
      continue;

    distances[dir][v] = d;

    // Shortest path is found?
    if (v in distances[1 - dir])
      return [finalDistance, finalPath];

    edges = GET_NEIGHBORS[dir](graph, v);

    for (i = 0, l = edges.length; i < l; i++) {
      e = edges[i];
      u = graph.opposite(v, e);
      cost = distances[dir][v] + getWeight(e);

      if (u in distances[dir] && cost < distances[dir][u]) {
        throw Error('graphology-shortest-path/dijkstra: contradictory paths found. Do some of your edges have a negative weight?');
      }
      else if (!(u in seen[dir]) || cost < seen[dir][u]) {
        seen[dir][u] = cost;
        fringe[dir].push([cost, count++, u]);
        paths[dir][u] = paths[dir][v].concat(u);

        if (u in seen[0] && u in seen[1]) {
          d = seen[0][u] + seen[1][u];

          if (!finalDistance || finalDistance > d) {
            finalDistance = d;
            finalPath = paths[0][u].concat(paths[1][u].slice(0, -1).reverse());
          }
        }
      }
    }
  }

  // No path was found
  return [Infinity, null];
}

/**
 * Multisource Dijkstra shortest path abstract function. This function is the
 * basis of the algorithm that every other will use.
 *
 * Note that this implementation was basically copied from networkx.
 * TODO: it might be more performant to use a dedicated objet for the heap's
 * items.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {array}  sources         - A list of sources.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @param  {number} cutoff          - Maximum depth of the search.
 * @param  {string} target          - Optional target to reach.
 * @param  {object} paths           - Optional paths object to maintain.
 * @return {object}                 - Returns the paths.
 */
function abstractDijkstraMultisource(
  graph,
  sources,
  weightAttribute,
  cutoff,
  target,
  paths
) {

  if (!isGraph(graph))
    throw new Error('graphology-shortest-path/dijkstra: invalid graphology instance.');

  if (target && !graph.hasNode(target))
    throw new Error('graphology-shortest-path/dijkstra: the "' + target + '" target node does not exist in the given graph.');

  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  // Building necessary functions
  var getWeight = function(edge) {
    return graph.getEdgeAttribute(edge, weightAttribute);
  };

  var distances = {},
      seen = {},
      fringe = new Heap(DIJKSTRA_HEAP_COMPARATOR);

  var count = 0,
      edges,
      item,
      cost,
      v,
      u,
      e,
      d,
      i,
      j,
      l,
      m;

  for (i = 0, l = sources.length; i < l; i++) {
    v = sources[i];
    seen[v] = 0;
    fringe.push([0, count++, v]);

    if (paths)
      paths[v] = [v];
  }

  while (fringe.size) {
    item = fringe.pop();
    d = item[0];
    v = item[2];

    if (v in distances)
      continue;

    distances[v] = d;

    if (v === target)
      break;

    edges = graph
      .undirectedEdges(v)
      .concat(graph.outEdges(v));

    for (j = 0, m = edges.length; j < m; j++) {
      e = edges[j];
      u = graph.opposite(v, e);
      cost = getWeight(e) + distances[v];

      if (cutoff && cost > cutoff)
        continue;

      if (u in distances && cost < distances[u]) {
        throw Error('graphology-shortest-path/dijkstra: contradictory paths found. Do some of your edges have a negative weight?');
      }

      else if (!(u in seen) || cost < seen[u]) {
        seen[u] = cost;
        fringe.push([cost, count++, u]);

        if (paths)
          paths[u] = paths[v].concat(u);
      }
    }
  }

  return distances;
}

/**
 * Single source Dijkstra shortest path between given node & other nodes in
 * the graph.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {string} source          - Source node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @return {object}                 - An object of found paths.
 */
function singleSourceDijkstra(graph, source, weightAttribute) {
  var paths = {};

  abstractDijkstraMultisource(
    graph,
    [source],
    weightAttribute,
    0,
    null,
    paths
  );

  return paths;
}

function bidirectionalDijkstra(graph, source, target, weightAttribute) {
  return abstractBidirectionalDijkstra(graph, source, target, weightAttribute)[1];
}

/**
 * Function using Ulrik Brandes' method to map single source shortest paths
 * from selected node.
 *
 * [Reference]:
 * Ulrik Brandes: A Faster Algorithm for Betweenness Centrality.
 * Journal of Mathematical Sociology 25(2):163-177, 2001.
 *
 * @param  {Graph}  graph           - Target graph.
 * @param  {any}    source          - Source node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @return {array}                  - [Stack, Paths, Sigma]
 */
function brandes(graph, source, weightAttribute) {
  source = '' + source;
  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  var S = [],
      P = {},
      sigma = {};

  var nodes = graph.nodes(),
      edges,
      item,
      pred,
      dist,
      cost,
      v,
      w,
      e,
      i,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    v = nodes[i];
    P[v] = [];
    sigma[v] = 0;
  }

  var D = {};

  sigma[source] = 1;

  var seen = {};
  seen[source] = 0;

  var count = 0;

  var Q = new Heap(BRANDES_DIJKSTRA_HEAP_COMPARATOR);
  Q.push([0, count++, source, source]);

  while (Q.size) {
    item = Q.pop();
    dist = item[0];
    pred = item[2];
    v = item[3];

    if (v in D)
      continue;

    sigma[v] += sigma[pred];
    S.push(v);
    D[v] = dist;

    edges = graph
      .undirectedEdges(v)
      .concat(graph.outEdges(v));

    for (i = 0, l = edges.length; i < l; i++) {
      e = edges[i];
      w = graph.opposite(v, e);
      cost = dist + (graph.getEdgeAttribute(e, weightAttribute) || 1);

      if (!(w in D) && (!(w in seen) || cost < seen[w])) {
        seen[w] = cost;
        Q.push([cost, count++, v, w]);
        sigma[w] = 0;
        P[w] = [v];
      }
      else if (cost === seen[w]) {
        sigma[w] += sigma[v];
        P[w].push(v);
      }
    }
  }

  return [S, P, sigma];
}

/**
 * Exporting.
 */
module.exports = {
  bidirectional: bidirectionalDijkstra,
  singleSource: singleSourceDijkstra,
  brandes: brandes
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(29),
    eq = __webpack_require__(6),
    isIterateeCall = __webpack_require__(32),
    keysIn = __webpack_require__(31);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

module.exports = defaults;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Extent
 * ==================
 *
 * Simple function returning the extent of selected attributes of the graph.
 */
var isGraph = __webpack_require__(0);

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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(11);

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
/* 63 */
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
/* 64 */
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


var _extend = __webpack_require__(233);

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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _camera = __webpack_require__(34);

var _camera2 = _interopRequireDefault(_camera);

var _captor = __webpack_require__(234);

var _captor2 = _interopRequireDefault(_captor);

var _utils = __webpack_require__(235);

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
/* 66 */
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

  // TODO: unit test this
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
/* 67 */
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

var _utils = __webpack_require__(238);

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
/* 68 */
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _graphology = __webpack_require__(70);

var _graphology2 = _interopRequireDefault(_graphology);

var _browser = __webpack_require__(77);

var _browser2 = _interopRequireDefault(_browser);

var _renderer = __webpack_require__(62);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(34);

var _camera2 = _interopRequireDefault(_camera);

var _quadtree = __webpack_require__(64);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _mouse = __webpack_require__(65);

var _mouse2 = _interopRequireDefault(_mouse);

var _webgl = __webpack_require__(236);

var _webgl2 = _interopRequireDefault(_webgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sigma = {
  Renderer: _renderer2.default,
  Camera: _camera2.default,
  QuadTree: _quadtree2.default,
  MouseCaptor: _mouse2.default,
  WebGLRenderer: _webgl2.default
}; /**
    * Sigma.js + Graphology Bundle Endpoint
    * ======================================
    *
    * Endpoint for a mega bundle gathering sigma + graphology + libraries.
    */


_graphology2.default.library = _browser2.default;

window.sigma = sigma;
window.graphology = _graphology2.default;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(10);

var _graph = __webpack_require__(71);

var _graph2 = _interopRequireDefault(_graph);

var _errors = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Graphology Reference Implementation Endoint
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ============================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Importing the Graph object & creating typed constructors.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Alternative constructors.
 */
var DirectedGraph = function (_Graph) {
  _inherits(DirectedGraph, _Graph);

  function DirectedGraph(options) {
    _classCallCheck(this, DirectedGraph);

    return _possibleConstructorReturn(this, _Graph.call(this, (0, _utils.assign)({ type: 'directed' }, options)));
  }

  return DirectedGraph;
}(_graph2.default);

var UndirectedGraph = function (_Graph2) {
  _inherits(UndirectedGraph, _Graph2);

  function UndirectedGraph(options) {
    _classCallCheck(this, UndirectedGraph);

    return _possibleConstructorReturn(this, _Graph2.call(this, (0, _utils.assign)({ type: 'undirected' }, options)));
  }

  return UndirectedGraph;
}(_graph2.default);

var MultiDirectedGraph = function (_Graph3) {
  _inherits(MultiDirectedGraph, _Graph3);

  function MultiDirectedGraph(options) {
    _classCallCheck(this, MultiDirectedGraph);

    return _possibleConstructorReturn(this, _Graph3.call(this, (0, _utils.assign)({ multi: true, type: 'directed' }, options)));
  }

  return MultiDirectedGraph;
}(_graph2.default);

var MultiUndirectedGraph = function (_Graph4) {
  _inherits(MultiUndirectedGraph, _Graph4);

  function MultiUndirectedGraph(options) {
    _classCallCheck(this, MultiUndirectedGraph);

    return _possibleConstructorReturn(this, _Graph4.call(this, (0, _utils.assign)({ multi: true, type: 'undirected' }, options)));
  }

  return MultiUndirectedGraph;
}(_graph2.default);

/**
 * Attaching static #.from method to each of the constructors.
 */


function attachStaticFromMethod(Class) {

  /**
   * Builds a graph from serialized data or another graph's data.
   *
   * @param  {Graph|SerializedGraph} data      - Hydratation data.
   * @param  {object}                [options] - Options.
   * @return {Class}
   */
  Class.from = function (data, options) {
    var instance = new Class(options);
    instance.import(data);

    return instance;
  };
}

attachStaticFromMethod(_graph2.default);
attachStaticFromMethod(DirectedGraph);
attachStaticFromMethod(UndirectedGraph);
attachStaticFromMethod(MultiDirectedGraph);
attachStaticFromMethod(MultiUndirectedGraph);

/**
 * Attaching the various constructors to the Graph class itself so we can
 * keep CommonJS semantics so everyone can consume the library easily.
 */
_graph2.default.Graph = _graph2.default;
_graph2.default.DirectedGraph = DirectedGraph;
_graph2.default.UndirectedGraph = UndirectedGraph;
_graph2.default.MultiDirectedGraph = MultiDirectedGraph;
_graph2.default.MultiUndirectedGraph = MultiUndirectedGraph;

_graph2.default.InvalidArgumentsGraphError = _errors.InvalidArgumentsGraphError;
_graph2.default.NotFoundGraphError = _errors.NotFoundGraphError;
_graph2.default.UsageGraphError = _errors.UsageGraphError;

module.exports = _graph2.default;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(11);

var _iterator = __webpack_require__(12);

var _iterator2 = _interopRequireDefault(_iterator);

var _take = __webpack_require__(20);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(8);

var _data = __webpack_require__(21);

var _indices = __webpack_require__(72);

var _attributes = __webpack_require__(73);

var _edges = __webpack_require__(74);

var _neighbors = __webpack_require__(75);

var _serialization = __webpack_require__(76);

var _utils = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-nested-ternary: 0 */
/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */


/**
 * Enums.
 */
var TYPES = new Set(['directed', 'undirected', 'mixed']);

var EMITTER_PROPS = new Set(['domain', '_events', '_eventsCount', '_maxListeners']);

var EDGE_ADD_METHODS = [{
  name: function name(verb) {
    return verb + 'Edge';
  },
  generateKey: true
}, {
  name: function name(verb) {
    return verb + 'DirectedEdge';
  },
  generateKey: true,
  type: 'directed'
}, {
  name: function name(verb) {
    return verb + 'UndirectedEdge';
  },
  generateKey: true,
  type: 'undirected'
}, {
  name: function name(verb) {
    return verb + 'EdgeWithKey';
  }
}, {
  name: function name(verb) {
    return verb + 'DirectedEdgeWithKey';
  },
  type: 'directed'
}, {
  name: function name(verb) {
    return verb + 'UndirectedEdgeWithKey';
  },
  type: 'undirected'
}];

/**
 * Default options.
 */
var DEFAULTS = {
  allowSelfLoops: true,
  defaultEdgeAttributes: {},
  defaultNodeAttributes: {},
  edgeKeyGenerator: null,
  multi: false,
  type: 'mixed'
};

/**
 * Helper classes.
 */

var NodesIterator = function (_Iterator) {
  _inherits(NodesIterator, _Iterator);

  function NodesIterator() {
    _classCallCheck(this, NodesIterator);

    return _possibleConstructorReturn(this, _Iterator.apply(this, arguments));
  }

  return NodesIterator;
}(_iterator2.default);

/**
 * Abstract functions used by the Graph class for various methods.
 */

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */


function addEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {

  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.');

  if (undirected && graph.type === 'directed') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.');

  if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid attributes. Expecting an object but got "' + attributes + '"');

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;

  if (!graph.allowSelfLoops && source === target) throw new _errors.UsageGraphError('Graph.' + name + ': source & target are the same ("' + source + '"), thus creating a loop explicitly forbidden by this graph \'allowSelfLoops\' option set to false.');

  var sourceData = graph._nodes.get(source),
      targetData = graph._nodes.get(target);

  if (!sourceData) throw new _errors.NotFoundGraphError('Graph.' + name + ': source node "' + source + '" not found.');

  if (!targetData) throw new _errors.NotFoundGraphError('Graph.' + name + ': target node "' + target + '" not found.');

  // Protecting the attributes
  attributes = (0, _utils.assign)({}, graph._options.defaultEdgeAttributes, attributes);

  // Must the graph generate an id for this edge?
  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge)) throw new _errors.UsageGraphError('Graph.' + name + ': the "' + edge + '" edge already exists in the graph.');

  // Here, we might have a source / target collision
  if (!graph.multi && (undirected ? typeof sourceData.undirected[target] !== 'undefined' : typeof sourceData.out[target] !== 'undefined')) {
    throw new _errors.UsageGraphError('Graph.' + name + ': an edge linking "' + source + '" to "' + target + '" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the \'multi\' option.');
  }

  // Storing some data
  var DataClass = undirected ? _data.UndirectedEdgeData : _data.DirectedEdgeData;

  var data = new DataClass(mustGenerateKey, source, target, attributes);

  // Adding the edge to the internal register
  graph._edges.set(edge, data);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) sourceData.undirectedSelfLoops++;else sourceData.directedSelfLoops++;
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  (0, _indices.updateStructureIndex)(graph, undirected, edge, source, target, sourceData, targetData);

  if (undirected) graph._undirectedSize++;else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
}

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function mergeEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {

  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.');

  if (undirected && graph.type === 'directed') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.');

  if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid attributes. Expecting an object but got "' + attributes + '"');

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;

  if (!graph.allowSelfLoops && source === target) throw new _errors.UsageGraphError('Graph.' + name + ': source & target are the same ("' + source + '"), thus creating a loop explicitly forbidden by this graph \'allowSelfLoops\' option set to false.');

  var sourceData = graph._nodes.get(source),
      targetData = graph._nodes.get(target),
      edgeData = void 0;

  // Do we need to handle duplicate?
  var alreadyExistingEdge = null;

  if (!mustGenerateKey) {
    edgeData = graph._edges.get(edge);

    if (edgeData) {

      // Here, we need to ensure, if the user gave a key, that source & target
      // are coherent
      if (edgeData.source !== source || edgeData.target !== target || undirected && (edgeData.source !== target || edgeData.target !== source)) {
        throw new _errors.UsageGraphError('Graph.' + name + ': inconsistency detected when attempting to merge the "' + edge + '" edge with "' + source + '" source & "' + target + '" target vs. (' + edgeData.source + ', ' + edgeData.target + ').');
      }

      alreadyExistingEdge = edge;
    }
  }

  // Here, we might have a source / target collision
  if (!alreadyExistingEdge && !graph.multi && sourceData && (undirected ? typeof sourceData.undirected[target] !== 'undefined' : typeof sourceData.out[target] !== 'undefined')) {
    alreadyExistingEdge = (0, _utils.getMatchingEdge)(graph, source, target, undirected ? 'undirected' : 'directed');
  }

  // Handling duplicates
  if (alreadyExistingEdge) {

    // We can skip the attribute merging part if the user did not provide them
    if (!attributes) return alreadyExistingEdge;

    if (!edgeData) edgeData = graph._edges.get(alreadyExistingEdge);

    // Merging the attributes
    (0, _utils.assign)(edgeData.attributes, attributes);
    return alreadyExistingEdge;
  }

  // Protecting the attributes
  attributes = (0, _utils.assign)({}, graph._options.defaultEdgeAttributes, attributes);

  // Must the graph generate an id for this edge?
  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge)) throw new _errors.UsageGraphError('Graph.' + name + ': the "' + edge + '" edge already exists in the graph.');

  if (!sourceData) {
    graph.addNode(source);
    sourceData = graph._nodes.get(source);
  }
  if (!targetData) {
    graph.addNode(target);
    targetData = graph._nodes.get(target);
  }

  // Storing some data
  var DataClass = undirected ? _data.UndirectedEdgeData : _data.DirectedEdgeData;

  var data = new DataClass(mustGenerateKey, source, target, attributes);

  // Adding the edge to the internal register
  graph._edges.set(edge, data);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) sourceData.undirectedSelfLoops++;else sourceData.directedSelfLoops++;
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  (0, _indices.updateStructureIndex)(graph, undirected, edge, source, target, sourceData, targetData);

  if (undirected) graph._undirectedSize++;else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
}

/**
 * Internal method abstracting edges export.
 *
 * @param  {Graph}    graph     - Target graph.
 * @param  {string}   name      - Child method name.
 * @param  {function} predicate - Predicate to filter the bunch's edges.
 * @param  {mixed}    [bunch]   - Target edges.
 * @return {array[]}            - The serialized edges.
 *
 * @throws {Error} - Will throw if any of the edges is not found.
 */
function _exportEdges(graph, name, predicate, bunch) {
  var edges = [];

  if (!bunch) {

    // Exporting every edges of the given type
    if (name === 'exportEdges') edges = graph.edges();else if (name === 'exportDirectedEdges') edges = graph.directedEdges();else edges = graph.undirectedEdges();
  } else {

    // Exporting the bunch
    if (!(0, _utils.isBunch)(bunch)) throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid bunch.');

    (0, _utils.overBunch)(bunch, function (edge) {
      if (!graph.hasEdge(edge)) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + edge + '" edge from the bunch in the graph.');

      if (!predicate || predicate(edge)) edges.push(edge);
    });
  }

  var serializedEdges = new Array(edges.length);

  for (var i = 0, l = edges.length; i < l; i++) {
    serializedEdges[i] = graph.exportEdge(edges[i]);
  }return serializedEdges;
}

/**
 * Graph class
 *
 * @constructor
 * @param  {object}  [options] - Options:
 * @param  {boolean}   [allowSelfLoops] - Allow self loops?
 * @param  {string}    [type]           - Type of the graph.
 * @param  {boolean}   [map]            - Allow references as keys?
 * @param  {boolean}   [multi]          - Allow parallel edges?
 *
 * @throws {Error} - Will throw if the arguments are not valid.
 */

var Graph = function (_EventEmitter) {
  _inherits(Graph, _EventEmitter);

  function Graph(options) {
    _classCallCheck(this, Graph);

    //-- Solving options
    var _this2 = _possibleConstructorReturn(this, _EventEmitter.call(this));

    options = (0, _utils.assign)({}, DEFAULTS, options);

    // Enforcing options validity
    if (options.edgeKeyGenerator && typeof options.edgeKeyGenerator !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'edgeKeyGenerator\' option. Expecting a function but got "' + options.edgeKeyGenerator + '".');

    if (typeof options.multi !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'multi\' option. Expecting a boolean but got "' + options.multi + '".');

    if (!TYPES.has(options.type)) throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "' + options.type + '".');

    if (typeof options.allowSelfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'allowSelfLoops\' option. Expecting a boolean but got "' + options.allowSelfLoops + '".');

    if (!(0, _utils.isPlainObject)(options.defaultEdgeAttributes)) throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'defaultEdgeAttributes\' option. Expecting a plain object but got "' + options.defaultEdgeAttributes + '".');

    if (!(0, _utils.isPlainObject)(options.defaultNodeAttributes)) throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'defaultNodeAttributes\' option. Expecting a plain object but got "' + options.defaultNodeAttributes + '".');

    //-- Private properties

    // Indexes
    (0, _utils.privateProperty)(_this2, '_attributes', {});
    (0, _utils.privateProperty)(_this2, '_nodes', new Map());
    (0, _utils.privateProperty)(_this2, '_edges', new Map());
    (0, _utils.privateProperty)(_this2, '_directedSize', 0);
    (0, _utils.privateProperty)(_this2, '_undirectedSize', 0);
    (0, _utils.privateProperty)(_this2, '_edgeKeyGenerator', options.edgeKeyGenerator || (0, _utils.incrementalId)());

    // Options
    (0, _utils.privateProperty)(_this2, '_options', options);

    // Emitter properties
    EMITTER_PROPS.forEach(function (prop) {
      return (0, _utils.privateProperty)(_this2, prop, _this2[prop]);
    });

    //-- Properties readers
    (0, _utils.readOnlyProperty)(_this2, 'order', function () {
      return _this2._nodes.size;
    });
    (0, _utils.readOnlyProperty)(_this2, 'size', function () {
      return _this2._edges.size;
    });
    (0, _utils.readOnlyProperty)(_this2, 'directedSize', function () {
      return _this2._directedSize;
    });
    (0, _utils.readOnlyProperty)(_this2, 'undirectedSize', function () {
      return _this2._undirectedSize;
    });
    (0, _utils.readOnlyProperty)(_this2, 'multi', _this2._options.multi);
    (0, _utils.readOnlyProperty)(_this2, 'type', _this2._options.type);
    (0, _utils.readOnlyProperty)(_this2, 'allowSelfLoops', _this2._options.allowSelfLoops);
    return _this2;
  }

  /**---------------------------------------------------------------------------
   * Read
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning whether the given node is found in the graph.
   *
   * @param  {any}     node - The node.
   * @return {boolean}
   */


  Graph.prototype.hasNode = function hasNode(node) {
    return this._nodes.has('' + node);
  };

  /**
   * Method returning whether the given directed edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasDirectedEdge = function hasDirectedEdge(source, target) {

    // Early termination
    if (this.type === 'undirected') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && edgeData instanceof _data.DirectedEdgeData;
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = nodeData.out[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasDirectedEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning whether the given undirected edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasUndirectedEdge = function hasUndirectedEdge(source, target) {

    // Early termination
    if (this.type === 'directed') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && edgeData instanceof _data.UndirectedEdgeData;
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasDirectedEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning whether the given edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasEdge = function hasEdge(source, target) {

    if (arguments.length === 1) {
      var edge = '' + source;

      return this._edges.has(edge);
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = typeof nodeData.out !== 'undefined' && nodeData.out[target];

      if (!edges) edges = typeof nodeData.undirected !== 'undefined' && nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning the edge matching source & target in a directed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.directedEdge = function directedEdge(source, target) {

    if (this.type === 'undirected') return;

    source = '' + source;
    target = '' + target;

    if (this.multi) throw new _errors.UsageGraphError('Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.directedEdge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.directedEdge: could not find the "' + target + '" target node in the graph.');

    return sourceData.out && sourceData.out[target] || undefined;
  };

  /**
   * Method returning the edge matching source & target in a undirected fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.undirectedEdge = function undirectedEdge(source, target) {

    if (this.type === 'directed') return;

    source = '' + source;
    target = '' + target;

    if (this.multi) throw new _errors.UsageGraphError('Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.undirectedEdge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.undirectedEdge: could not find the "' + target + '" target node in the graph.');

    return sourceData.undirected && sourceData.undirected[target] || undefined;
  };

  /**
   * Method returning the edge matching source & target in a mixed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.edge = function edge(source, target) {
    if (this.multi) throw new _errors.UsageGraphError('Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.');

    source = '' + source;
    target = '' + target;

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.edge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.edge: could not find the "' + target + '" target node in the graph.');

    return sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || undefined;
  };

  /**
   * Method returning the given node's in degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} allowSelfLoops - Count self-loops?
   * @return {number}            - The node's in degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.inDegree = function inDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.inDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new _errors.NotFoundGraphError('Graph.inDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    var loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.inDegree + loops;
  };

  /**
   * Method returning the given node's out degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's out degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.outDegree = function outDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.outDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new _errors.NotFoundGraphError('Graph.outDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    var loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.outDegree + loops;
  };

  /**
   * Method returning the given node's directed degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's directed degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.directedDegree = function directedDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.directedDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.directedDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    return this.inDegree(node, selfLoops) + this.outDegree(node, selfLoops);
  };

  /**
   * Method returning the given node's undirected degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's undirected degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.undirectedDegree = function undirectedDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.undirectedDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.undirectedDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'directed') return 0;

    var data = this._nodes.get(node),
        loops = selfLoops ? data.undirectedSelfLoops * 2 : 0;

    return data.undirectedDegree + loops;
  };

  /**
   * Method returning the given node's degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.degree = function degree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.degree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.degree: could not find the "' + node + '" node in the graph.');

    var degree = 0;

    if (this.type !== 'undirected') degree += this.directedDegree(node, selfLoops);

    if (this.type !== 'directed') degree += this.undirectedDegree(node, selfLoops);

    return degree;
  };

  /**
   * Method returning the given edge's source.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's source.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.source = function source(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.source: could not find the "' + edge + '" edge in the graph.');

    return data.source;
  };

  /**
   * Method returning the given edge's target.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's target.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.target = function target(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.target: could not find the "' + edge + '" edge in the graph.');

    return data.target;
  };

  /**
   * Method returning the given edge's extremities.
   *
   * @param  {any}   edge - The edge's key.
   * @return {array}      - The edge's extremities.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.extremities = function extremities(edge) {
    edge = '' + edge;

    var edgeData = this._edges.get(edge);

    if (!edgeData) throw new _errors.NotFoundGraphError('Graph.extremities: could not find the "' + edge + '" edge in the graph.');

    return [edgeData.source, edgeData.target];
  };

  /**
   * Given a node & an edge, returns the other extremity of the edge.
   *
   * @param  {any}   node - The node's key.
   * @param  {any}   edge - The edge's key.
   * @return {any}        - The related node.
   *
   * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
   */


  Graph.prototype.opposite = function opposite(node, edge) {
    node = '' + node;
    edge = '' + edge;

    if (!this._nodes.has(node)) throw new _errors.NotFoundGraphError('Graph.opposite: could not find the "' + node + '" node in the graph.');

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.opposite: could not find the "' + edge + '" edge in the graph.');

    var source = data.source,
        target = data.target;


    if (node !== source && node !== target) throw new _errors.NotFoundGraphError('Graph.opposite: the "' + node + '" node is not attached to the "' + edge + '" edge (' + source + ', ' + target + ').');

    return node === source ? target : source;
  };

  /**
   * Method returning whether the given edge is undirected.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.undirected = function undirected(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.undirected: could not find the "' + edge + '" edge in the graph.');

    return data instanceof _data.UndirectedEdgeData;
  };

  /**
   * Method returning whether the given edge is directed.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.directed = function directed(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.directed: could not find the "' + edge + '" edge in the graph.');

    return data instanceof _data.DirectedEdgeData;
  };

  /**
   * Method returning whether the given edge is a self loop.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.selfLoop = function selfLoop(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.selfLoop: could not find the "' + edge + '" edge in the graph.');

    return data.source === data.target;
  };

  /**---------------------------------------------------------------------------
   * Mutation
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to add a node to the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   *
   * @throws {Error} - Will throw if the given node already exist.
   * @throws {Error} - Will throw if the given attributes are not an object.
   */


  Graph.prototype.addNode = function addNode(node, attributes) {
    if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.addNode: invalid attributes. Expecting an object but got "' + attributes + '"');

    // String coercion
    node = '' + node;

    if (this._nodes.has(node)) throw new _errors.UsageGraphError('Graph.addNode: the "' + node + '" node already exist in the graph.');

    // Protecting the attributes
    attributes = (0, _utils.assign)({}, this._options.defaultNodeAttributes, attributes);

    var DataClass = this.type === 'mixed' ? _data.MixedNodeData : this.type === 'directed' ? _data.DirectedNodeData : _data.UndirectedNodeData;

    var data = new DataClass(attributes);

    // Adding the node to internal register
    this._nodes.set(node, data);

    // Emitting
    this.emit('nodeAdded', {
      key: node,
      attributes: attributes
    });

    return node;
  };

  /**
   * Method used to merge a node into the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   */


  Graph.prototype.mergeNode = function mergeNode(node, attributes) {
    node = '' + node;

    // If the node already exists, we merge the attributes
    var data = this._nodes.get(node);

    if (data) {
      if (attributes) (0, _utils.assign)(data.attributes, attributes);
      return node;
    }

    // Else, we create it
    return this.addNode(node, attributes);
  };

  /**
   * Method used to add a nodes from a bunch.
   *
   * @param  {bunch}  bunch - The node.
   * @return {Graph}        - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if the given bunch is not valid.
   */


  Graph.prototype.addNodesFrom = function addNodesFrom(bunch) {
    var _this3 = this;

    if (!(0, _utils.isBunch)(bunch)) throw new _errors.InvalidArgumentsGraphError('Graph.addNodesFrom: invalid bunch provided ("' + bunch + '").');

    (0, _utils.overBunch)(bunch, function (node, attributes) {
      _this3.addNode(node, attributes);
    });

    return this;
  };

  /**
   * Method used to drop a single node & all its attached edges from the graph.
   *
   * @param  {any}    node - The node.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node doesn't exist.
   */


  Graph.prototype.dropNode = function dropNode(node) {
    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.dropNode: could not find the "' + node + '" node in the graph.');

    // Removing attached edges
    var edges = this.edges(node);

    // NOTE: we could go faster here
    for (var i = 0, l = edges.length; i < l; i++) {
      this.dropEdge(edges[i]);
    }var data = this._nodes.get(node);

    // Dropping the node from the register
    this._nodes.delete(node);

    // Emitting
    this.emit('nodeDropped', {
      key: node,
      attributes: data.attributes
    });
  };

  /**
   * Method used to drop a single edge from the graph.
   *
   * Arity 1:
   * @param  {any}    edge - The edge.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the edge doesn't exist.
   */


  Graph.prototype.dropEdge = function dropEdge(edge) {
    if (arguments.length > 1) {
      var _source = '' + arguments[0],
          _target = '' + arguments[1];

      if (!this.hasNode(_source)) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + _source + '" source node in the graph.');

      if (!this.hasNode(_target)) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + _target + '" target node in the graph.');

      if (!this.hasEdge(_source, _target)) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + _source + '" -> "' + _target + '" edge in the graph.');

      edge = (0, _utils.getMatchingEdge)(this, _source, _target, this.type);
    } else {
      edge = '' + edge;

      if (!this.hasEdge(edge)) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + edge + '" edge in the graph.');
    }

    var data = this._edges.get(edge);

    // Dropping the edge from the register
    this._edges.delete(edge);

    // Updating related degrees
    var source = data.source,
        target = data.target,
        attributes = data.attributes;


    var undirected = data instanceof _data.UndirectedEdgeData;

    var sourceData = this._nodes.get(source),
        targetData = this._nodes.get(target);

    if (source === target) {
      sourceData.selfLoops--;
    } else {
      if (undirected) {
        sourceData.undirectedDegree--;
        targetData.undirectedDegree--;
      } else {
        sourceData.outDegree--;
        targetData.inDegree--;
      }
    }

    // Clearing index
    (0, _indices.clearEdgeFromStructureIndex)(this, undirected, edge, data);

    if (undirected) this._undirectedSize--;else this._directedSize--;

    // Emitting
    this.emit('edgeDropped', {
      key: edge,
      attributes: attributes,
      source: source,
      target: target,
      undirected: undirected
    });

    return this;
  };

  /**
   * Method used to drop a bunch of nodes or every node from the graph.
   *
   * @param  {bunch} nodes - Bunch of nodes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if an invalid bunch is provided.
   * @throws {Error} - Will throw if any of the nodes doesn't exist.
   */


  Graph.prototype.dropNodes = function dropNodes(nodes) {
    var _this4 = this;

    if (!arguments.length) return this.clear();

    if (!(0, _utils.isBunch)(nodes)) throw new _errors.InvalidArgumentsGraphError('Graph.dropNodes: invalid bunch.');

    (0, _utils.overBunch)(nodes, function (node) {
      _this4.dropNode(node);
    });

    return this;
  };

  /**
   * Method used to drop a bunch of edges or every edges from the graph.
   *
   * Arity 1:
   * @param  {bunch} edges - Bunch of edges.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if an invalid bunch is provided.
   * @throws {Error} - Will throw if any of the edges doesn't exist.
   */


  Graph.prototype.dropEdges = function dropEdges(edges) {
    var _this5 = this;

    if (!arguments.length) {

      // Dropping every edge from the graph
      this._edges.clear();

      // Without edges, we've got no 'structure'
      this.clearIndex();

      return this;
    }

    if (arguments.length === 2) {
      var source = arguments[0],
          target = arguments[1];

      edges = this.edges(source, target);
    }

    if (!(0, _utils.isBunch)(edges)) throw new _errors.InvalidArgumentsGraphError('Graph.dropEdges: invalid bunch.');

    (0, _utils.overBunch)(edges, function (edge) {
      _this5.dropEdge(edge);
    });

    return this;
  };

  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */


  Graph.prototype.clear = function clear() {

    // Dropping edges
    this._edges.clear();

    // Dropping nodes
    this._nodes.clear();

    // Handling indices
    for (var name in this._indices) {
      var index = this._indices[name];

      if (index.lazy) index.computed = false;
    }

    // Emitting
    this.emit('cleared');
  };

  /**---------------------------------------------------------------------------
   * Attributes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the desired graph's attribute.
   *
   * @param  {string} name - Name of the attribute.
   * @return {any}
   */


  Graph.prototype.getAttribute = function getAttribute(name) {
    return this._attributes[name];
  };

  /**
   * Method returning the graph's attributes.
   *
   * @return {object}
   */


  Graph.prototype.getAttributes = function getAttributes() {
    return this._attributes;
  };

  /**
   * Method returning whether the graph has the desired attribute.
   *
   * @param  {string}  name - Name of the attribute.
   * @return {boolean}
   */


  Graph.prototype.hasAttribute = function hasAttribute(name) {
    return this._attributes.hasOwnProperty(name);
  };

  /**
   * Method setting a value for the desired graph's attribute.
   *
   * @param  {string}  name  - Name of the attribute.
   * @param  {any}     value - Value for the attribute.
   * @return {Graph}
   */


  Graph.prototype.setAttribute = function setAttribute(name, value) {
    this._attributes[name] = value;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };

  /**
   * Method using a function to update the desired graph's attribute's value.
   *
   * @param  {string}   name    - Name of the attribute.
   * @param  {function} updater - Function use to update the attribute's value.
   * @return {Graph}
   */


  Graph.prototype.updateAttribute = function updateAttribute(name, updater) {
    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    this._attributes[name] = updater(this._attributes[name]);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name: name,
        value: this._attributes[name]
      }
    });

    return this;
  };

  /**
   * Method removing the desired graph's attribute.
   *
   * @param  {string} name  - Name of the attribute.
   * @return {Graph}
   */


  Graph.prototype.removeAttribute = function removeAttribute(name) {
    delete this._attributes[name];

    // Emitting
    this.emit('attributesUpdated', {
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };

  /**
   * Method replacing the graph's attributes.
   *
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */


  Graph.prototype.replaceAttributes = function replaceAttributes(attributes) {
    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.replaceAttributes: provided attributes are not a plain object.');

    var before = this._attributes;

    this._attributes = attributes;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'replace',
      meta: {
        before: before,
        after: attributes
      }
    });

    return this;
  };

  /**
   * Method merging the graph's attributes.
   *
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */


  Graph.prototype.mergeAttributes = function mergeAttributes(attributes) {
    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.mergeAttributes: provided attributes are not a plain object.');

    this._attributes = (0, _utils.assign)(this._attributes, attributes);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'merge',
      meta: {
        data: this._attributes
      }
    });

    return this;
  };

  /**
   * Method returning the desired attribute for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to get.
   * @return {any}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.getNodeAttribute = function getNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.getNodeAttribute: could not find the "' + node + '" node in the graph.');

    return data.attributes[name];
  };

  /**
   * Method returning the attributes for the given node.
   *
   * @param  {any}    node - Target node.
   * @return {object}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.getNodeAttributes = function getNodeAttributes(node) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.getNodeAttributes: could not find the "' + node + '" node in the graph.');

    return data.attributes;
  };

  /**
   * Method checking whether the given attribute exists for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to check.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.hasNodeAttribute = function hasNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.hasNodeAttribute: could not find the "' + node + '" node in the graph.');

    return data.attributes.hasOwnProperty(name);
  };

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to set.
   * @param  {any}    value - Value for the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.setNodeAttribute = function setNodeAttribute(node, name, value) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.setNodeAttribute: could not find the "' + node + '" node in the graph.');

    if (arguments.length < 3) throw new _errors.InvalidArgumentsGraphError('Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    data.attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}      node    - Target node.
   * @param  {string}   name    - Name of the attribute to set.
   * @param  {function} updater - Function that will update the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if updater is not a function.
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.updateNodeAttribute = function updateNodeAttribute(node, name, updater) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.updateNodeAttribute: could not find the "' + node + '" node in the graph.');

    if (arguments.length < 3) throw new _errors.InvalidArgumentsGraphError('Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    var attributes = data.attributes;

    attributes[name] = updater(attributes[name]);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name: name,
        value: attributes[name]
      }
    });

    return this;
  };

  /**
   * Method removing the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to remove.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.removeNodeAttribute = function removeNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.hasNodeAttribute: could not find the "' + node + '" node in the graph.');

    delete data.attributes[name];

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };

  /**
   * Method completely replacing the attributes of the given node.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */


  Graph.prototype.replaceNodeAttributes = function replaceNodeAttributes(node, attributes) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.replaceNodeAttributes: could not find the "' + node + '" node in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.replaceNodeAttributes: provided attributes are not a plain object.');

    var oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  };

  /**
   * Method merging the attributes of the given node with the provided ones.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */


  Graph.prototype.mergeNodeAttributes = function mergeNodeAttributes(node, attributes) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.mergeNodeAttributes: could not find the "' + node + '" node in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.mergeNodeAttributes: provided attributes are not a plain object.');

    (0, _utils.assign)(data.attributes, attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
  };

  /**---------------------------------------------------------------------------
   * Iteration-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the list of the graph's nodes.
   *
   * @return {array} - The nodes.
   */


  Graph.prototype.nodes = function nodes() {
    return (0, _take2.default)(this._nodes.keys(), this._nodes.size);
  };

  /**
   * Method returning an iterator over the graph's nodes.
   *
   * @return {Iterator}
   */


  Graph.prototype.nodesIterator = function nodesIterator() {
    var iterator = this._nodes.keys();

    return new NodesIterator(iterator.next.bind(iterator));
  };

  /**---------------------------------------------------------------------------
   * Serialization
   **---------------------------------------------------------------------------
   */

  /**
   * Method exporting the target node.
   *
   * @param  {any}   node - Target node.
   * @return {array}      - The serialized node.
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.exportNode = function exportNode(node) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.exportNode: could not find the "' + node + '" node in the graph.');

    return (0, _serialization.serializeNode)(node, data);
  };

  /**
   * Method exporting the target edge.
   *
   * @param  {any}   edge - Target edge.
   * @return {array}      - The serialized edge.
   *
   * @throws {Error} - Will throw if the edge is not found.
   */


  Graph.prototype.exportEdge = function exportEdge(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.exportEdge: could not find the "' + edge + '" edge in the graph.');

    return (0, _serialization.serializeEdge)(edge, data);
  };

  /**
   * Method exporting every nodes or the bunch ones.
   *
   * @param  {mixed}   [bunch] - Target nodes.
   * @return {array[]}         - The serialized nodes.
   *
   * @throws {Error} - Will throw if any of the nodes is not found.
   */


  Graph.prototype.exportNodes = function exportNodes(bunch) {
    var _this6 = this;

    var nodes = [];

    if (!arguments.length) {

      // Exporting every node
      nodes = this.nodes();
    } else {

      // Exporting the bunch
      if (!(0, _utils.isBunch)(bunch)) throw new _errors.InvalidArgumentsGraphError('Graph.exportNodes: invalid bunch.');

      (0, _utils.overBunch)(bunch, function (node) {
        if (!_this6.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.exportNodes: could not find the "' + node + '" node from the bunch in the graph.');
        nodes.push(node);
      });
    }

    var serializedNodes = new Array(nodes.length);

    for (var i = 0, l = nodes.length; i < l; i++) {
      serializedNodes[i] = this.exportNode(nodes[i]);
    }return serializedNodes;
  };

  /**
   * Method exporting every edges or the bunch ones.
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   * @throws {Error} - Will throw if any of the edges is not found.
   */


  Graph.prototype.exportEdges = function exportEdges(bunch) {
    return _exportEdges(this, 'exportEdges', null, bunch);
  };

  /**
   * Method exporting every directed edges or the bunch ones which are directed.
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   * @throws {Error} - Will throw if any of the edges is not found.
   */


  Graph.prototype.exportDirectedEdges = function exportDirectedEdges(bunch) {
    var _this7 = this;

    return _exportEdges(this, 'exportDirectedEdges', function (edge) {
      return _this7.directed(edge);
    }, bunch);
  };

  /**
   * Method exporting every undirected edges or the bunch ones which are
   * undirected
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   * @throws {Error} - Will throw if any of the edges is not found.
   */


  Graph.prototype.exportUndirectedEdges = function exportUndirectedEdges(bunch) {
    var _this8 = this;

    return _exportEdges(this, 'exportUndirectedEdges', function (edge) {
      return _this8.undirected(edge);
    }, bunch);
  };

  /**
   * Method used to export the whole graph.
   *
   * @return {object} - The serialized graph.
   */


  Graph.prototype.export = function _export() {
    return {
      attributes: this.getAttributes(),
      nodes: this.exportNodes(),
      edges: this.exportEdges()
    };
  };

  /**
   * Method used to import a serialized node.
   *
   * @param  {object} data   - The serialized node.
   * @param  {boolean} merge - Whether to merge the given node.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importNode = function importNode(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Validating
    var error = (0, _serialization.validateSerializedNode)(data);

    if (error) {

      if (error === 'not-object') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
      if (error === 'no-key') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: no key provided.');
      if (error === 'invalid-attributes') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.');
    }

    // Adding the node
    var key = data.key,
        _data$attributes = data.attributes,
        attributes = _data$attributes === undefined ? {} : _data$attributes;


    if (merge) this.mergeNode(key, attributes);else this.addNode(key, attributes);

    return this;
  };

  /**
   * Method used to import a serialized edge.
   *
   * @param  {object}  data  - The serialized edge.
   * @param  {boolean} merge - Whether to merge the given edge.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importEdge = function importEdge(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Validating
    var error = (0, _serialization.validateSerializedEdge)(data);

    if (error) {

      if (error === 'not-object') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
      if (error === 'no-source') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: missing souce.');
      if (error === 'no-target') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: missing target.');
      if (error === 'invalid-attributes') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.');
      if (error === 'invalid-undirected') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.');
    }

    // Adding the edge
    var source = data.source,
        target = data.target,
        _data$attributes2 = data.attributes,
        attributes = _data$attributes2 === undefined ? {} : _data$attributes2,
        _data$undirected = data.undirected,
        undirected = _data$undirected === undefined ? false : _data$undirected;


    var method = void 0;

    if ('key' in data) {
      method = merge ? undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;

      method.call(this, data.key, source, target, attributes);
    } else {
      method = merge ? undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected ? this.addUndirectedEdge : this.addDirectedEdge;

      method.call(this, source, target, attributes);
    }

    return this;
  };

  /**
   * Method used to import serialized nodes.
   *
   * @param  {array}   nodes - The serialized nodes.
   * @param  {boolean} merge - Whether to merge the given nodes.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importNodes = function importNodes(nodes) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!Array.isArray(nodes)) throw new _errors.InvalidArgumentsGraphError('Graph.importNodes: invalid argument. Expecting an array.');

    for (var i = 0, l = nodes.length; i < l; i++) {
      this.importNode(nodes[i], merge);
    }return this;
  };

  /**
   * Method used to import serialized edges.
   *
   * @param  {array}   edges - The serialized edges.
   * @param  {boolean} merge - Whether to merge the given edges.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importEdges = function importEdges(edges) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!Array.isArray(edges)) throw new _errors.InvalidArgumentsGraphError('Graph.importEdges: invalid argument. Expecting an array.');

    for (var i = 0, l = edges.length; i < l; i++) {
      this.importEdge(edges[i], merge);
    }return this;
  };

  /**
   * Method used to import a serialized graph.
   *
   * @param  {object|Graph} data  - The serialized graph.
   * @param  {boolean}      merge - Whether to merge data.
   * @return {Graph}              - Returns itself for chaining.
   */


  Graph.prototype.import = function _import(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Importing a Graph instance
    if ((0, _utils.isGraph)(data)) {

      this.import(data.export(), merge);
      return this;
    }

    // Importing a serialized graph
    if (!(0, _utils.isPlainObject)(data)) throw new _errors.InvalidArgumentsGraphError('Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.');

    if (data.attributes) {
      if (!(0, _utils.isPlainObject)(data.attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.import: invalid attributes. Expecting a plain object.');

      if (merge) this.mergeAttributes(data.attributes);else this.replaceAttributes(data.attributes);
    }

    if (data.nodes) this.importNodes(data.nodes, merge);

    if (data.edges) this.importEdges(data.edges, merge);

    return this;
  };

  /**---------------------------------------------------------------------------
   * Utils
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning an empty copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @return {Graph} - The empty copy.
   */


  Graph.prototype.emptyCopy = function emptyCopy() {
    return new Graph(this._options);
  };

  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.copy = function copy() {
    var graph = new Graph(this._options);
    graph.import(this);

    return graph;
  };

  /**
   * Method upgrading the graph to a mixed one.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.upgradeToMixed = function upgradeToMixed() {
    if (this.type === 'mixed') return this;

    // Upgrading node data:
    // NOTE: maybe this could lead to some de-optimization by usual
    // JavaScript engines but I cannot be sure of it. Another solution
    // would be to reinstantiate the classes but this surely has a performance
    // and memory impact.
    this._nodes.forEach(function (data) {
      return data.upgradeToMixed();
    });

    // Mutating the options & the instance
    this._options.type = 'mixed';
    (0, _utils.readOnlyProperty)(this, 'type', this._options.type);

    return this;
  };

  /**
   * Method upgrading the graph to a multi one.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.upgradeToMulti = function upgradeToMulti() {
    if (this.multi) return this;

    // Mutating the options & the instance
    this._options.multi = true;
    (0, _utils.readOnlyProperty)(this, 'multi', true);

    // Upgrading indices
    (0, _indices.upgradeStructureIndexToMulti)(this);

    return this;
  };

  /**---------------------------------------------------------------------------
   * Indexes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to clear the desired index to clear memory.
   *
   * @return {Graph}       - Returns itself for chaining.
   */


  Graph.prototype.clearIndex = function clearIndex() {
    (0, _indices.clearStructureIndex)(this);
    return this;
  };

  /**---------------------------------------------------------------------------
   * Known methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used by JavaScript to perform JSON serialization.
   *
   * @return {object} - The serialized graph.
   */


  Graph.prototype.toJSON = function toJSON() {
    return this.export();
  };

  /**
   * Method used to perform string coercion and returning useful information
   * about the Graph instance.
   *
   * @return {string} - String representation of the graph.
   */


  Graph.prototype.toString = function toString() {
    var pluralOrder = this.order > 1 || this.order === 0,
        pluralSize = this.size > 1 || this.size === 0;

    return 'Graph<' + (0, _utils.prettyPrint)(this.order) + ' node' + (pluralOrder ? 's' : '') + ', ' + (0, _utils.prettyPrint)(this.size) + ' edge' + (pluralSize ? 's' : '') + '>';
  };

  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {object} - Formatted object representation of the graph.
   */


  Graph.prototype.inspect = function inspect() {
    var nodes = {};
    this._nodes.forEach(function (data, key) {
      nodes[key] = data.attributes;
    });

    var edges = {};
    this._edges.forEach(function (data, key) {
      var direction = data instanceof _data.UndirectedEdgeData ? '--' : '->';

      var label = '';

      if (!data.generatedKey) label += '[' + key + ']: ';

      label += '(' + data.source + ')' + direction + '(' + data.target + ')';

      edges[label] = data.attributes;
    });

    var dummy = {};

    for (var k in this) {
      if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== 'function') dummy[k] = this[k];
    }

    dummy.attributes = this._attributes;
    dummy.nodes = nodes;
    dummy.edges = edges;

    (0, _utils.privateProperty)(dummy, 'constructor', this.constructor);

    return dummy;
  };

  return Graph;
}(_events.EventEmitter);

/**
 * Attaching methods to the prototype.
 *
 * Here, we are attaching a wide variety of methods to the Graph class'
 * prototype when those are very numerous and when their creation is
 * abstracted.
 */

/**
 * Related to edge addition.
 */


exports.default = Graph;
EDGE_ADD_METHODS.forEach(function (method) {
  ['add', 'merge'].forEach(function (verb) {
    var name = method.name(verb),
        fn = verb === 'add' ? addEdge : mergeEdge;

    if (method.generateKey) {
      Graph.prototype[name] = function (source, target, attributes) {
        return fn(this, name, true, (method.type || this.type) === 'undirected', null, source, target, attributes);
      };
    } else {
      Graph.prototype[name] = function (edge, source, target, attributes) {
        return fn(this, name, false, (method.type || this.type) === 'undirected', edge, source, target, attributes);
      };
    }
  });
});

/**
 * Attributes-related.
 */
(0, _attributes.attachAttributesMethods)(Graph);

/**
 * Edge iteration-related.
 */
(0, _edges.attachEdgeIterationMethods)(Graph);

/**
 * Neighbor iteration-related.
 */
(0, _neighbors.attachNeighborIterationMethods)(Graph);

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStructureIndex = updateStructureIndex;
exports.clearEdgeFromStructureIndex = clearEdgeFromStructureIndex;
exports.clearStructureIndex = clearStructureIndex;
exports.upgradeStructureIndexToMulti = upgradeStructureIndexToMulti;
/**
 * Graphology Indexes Functions
 * =============================
 *
 * Bunch of functions used to compute or clear indexes.
 */

/**
 * Function updating the 'structure' index with the given edge's data.
 * Note that in the case of the multi graph, related edges are stored in a
 * set that is the same for A -> B & B <- A.
 *
 * @param {Graph}    graph      - Target Graph instance.
 * @param {any}      edge       - Added edge.
 * @param {NodeData} sourceData - Source node's data.
 * @param {NodeData} targetData - Target node's data.
 */
function updateStructureIndex(graph, undirected, edge, source, target, sourceData, targetData) {
  var multi = graph.multi;

  var outKey = undirected ? 'undirected' : 'out',
      inKey = undirected ? 'undirected' : 'in';

  // Handling source
  if (typeof sourceData[outKey][target] === 'undefined') sourceData[outKey][target] = multi ? new Set() : edge;

  if (multi) sourceData[outKey][target].add(edge);

  // If selfLoop, we break here
  if (source === target) return;

  // Handling target (we won't add the edge because it was already taken
  // care of with source above)
  if (typeof targetData[inKey][source] === 'undefined') targetData[inKey][source] = sourceData[outKey][target];
}

/**
 * Function clearing the 'structure' index data related to the given edge.
 *
 * @param {Graph}  graph - Target Graph instance.
 * @param {any}    edge  - Dropped edge.
 * @param {object} data  - Attached data.
 */
function clearEdgeFromStructureIndex(graph, undirected, edge, data) {
  var multi = graph.multi;

  var source = data.source,
      target = data.target;

  // NOTE: since the edge set is the same for source & target, we can only
  // affect source

  var sourceData = graph._nodes.get(source),
      outKey = undirected ? 'undirected' : 'out',
      sourceIndex = sourceData[outKey];

  // NOTE: possible to clear empty sets from memory altogether
  if (target in sourceIndex) {

    if (multi) sourceIndex[target].delete(edge);else delete sourceIndex[target];
  }

  if (multi) return;

  var targetData = graph._nodes.get(target),
      inKey = undirected ? 'undirected' : 'in',
      targetIndex = targetData[inKey];

  delete targetIndex[source];
}

/**
 * Function clearing the whole 'structure' index.
 *
 * @param {Graph} graph - Target Graph instance.
 */
function clearStructureIndex(graph) {
  graph._nodes.forEach(function (data) {

    // Clearing now useless properties
    data.in = {};
    data.out = {};
    data.undirected = {};
  });
}

/**
 * Function used to upgrade a simple `structure` index to a multi on.
 *
 * @param {Graph}  graph - Target Graph instance.
 */
function upgradeStructureIndexToMulti(graph) {
  graph._nodes.forEach(function (data, node) {

    // Directed
    if (data.out) {

      for (var neighbor in data.out) {
        var edges = new Set();
        edges.add(data.out[neighbor]);
        data.out[neighbor] = edges;
        graph._nodes.get(neighbor).in[node] = edges;
      }
    }

    // Undirected
    if (data.undirected) {
      for (var _neighbor in data.undirected) {
        if (_neighbor > node) continue;

        var _edges = new Set();
        _edges.add(data.undirected[_neighbor]);
        data.undirected[_neighbor] = _edges;
        graph._nodes.get(_neighbor).undirected[node] = _edges;
      }
    }
  });
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachAttributesMethods = attachAttributesMethods;

var _utils = __webpack_require__(10);

var _errors = __webpack_require__(8);

/**
 * Attach an attribute getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 */
/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
function attachAttributeGetter(Class, method, checker, type) {

  /**
   * Get the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {mixed}          - The attribute's value.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    var data = this._edges.get(element);

    return data.attributes[name];
  };
}

/**
 * Attach an attributes getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesGetter(Class, method, checker, type) {

  /**
   * Retrieves all the target element's attributes.
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   *
   * @return {object}          - The element's attributes.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element) {
    if (arguments.length > 1) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + arguments[1];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    var data = this._edges.get(element);

    return data.attributes;
  };
}

/**
 * Attach an attribute checker method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeChecker(Class, method, checker, type) {

  /**
   * Checks whether the desired attribute is set for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    var data = this._edges.get(element);

    return data.attributes.hasOwnProperty(name);
  };
}

/**
 * Attach an attribute setter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeSetter(Class, method, checker, type) {

  /**
   * Set the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, value) {
    if (arguments.length > 3) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];
      value = arguments[3];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    var data = this._edges.get(element);

    data.attributes[name] = value;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };
}

/**
 * Attach an attribute updater method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeUpdater(Class, method, checker, type) {

  /**
   * Update the desired attribute for the given element (node or edge) using
   * the provided function.
   *
   * Arity 2:
   * @param  {any}      element - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * Arity 3 (only for edges):
   * @param  {any}      source  - Source element.
   * @param  {any}      target  - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, updater) {
    if (arguments.length > 3) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];
      updater = arguments[3];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': updater should be a function.');

    var data = this._edges.get(element);

    data.attributes[name] = updater(data.attributes[name]);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'set',
      meta: {
        name: name,
        value: data.attributes[name]
      }
    });

    return this;
  };
}

/**
 * Attach an attribute remover method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeRemover(Class, method, checker, type) {

  /**
   * Remove the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    var data = this._edges.get(element);

    delete data.attributes[name];

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };
}

/**
 * Attach an attribute replacer method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesReplacer(Class, method, checker, type) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - New attributes.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - New attributes.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + attributes;

      attributes = arguments[2];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': provided attributes are not a plain object.');

    var data = this._edges.get(element);

    var oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  };
}

/**
 * Attach an attribute merger method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesMerger(Class, method, checker, type) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - Attributes to merge.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - Attributes to merge.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + attributes;

      attributes = arguments[2];

      if (!this[checker](source, target)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');

      element = (0, _utils.getMatchingEdge)(this, source, target, type);
    } else {
      element = '' + element;
    }

    if (!this[checker](element)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': provided attributes are not a plain object.');

    var data = this._edges.get(element);

    (0, _utils.assign)(data.attributes, attributes);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
  };
}

/**
 * List of methods to attach.
 */
var ATTRIBUTES_METHODS = [{
  name: function name(element) {
    return 'get' + element + 'Attribute';
  },
  attacher: attachAttributeGetter
}, {
  name: function name(element) {
    return 'get' + element + 'Attributes';
  },
  attacher: attachAttributesGetter
}, {
  name: function name(element) {
    return 'has' + element + 'Attribute';
  },
  attacher: attachAttributeChecker
}, {
  name: function name(element) {
    return 'set' + element + 'Attribute';
  },
  attacher: attachAttributeSetter
}, {
  name: function name(element) {
    return 'update' + element + 'Attribute';
  },
  attacher: attachAttributeUpdater
}, {
  name: function name(element) {
    return 'remove' + element + 'Attribute';
  },
  attacher: attachAttributeRemover
}, {
  name: function name(element) {
    return 'replace' + element + 'Attributes';
  },
  attacher: attachAttributesReplacer
}, {
  name: function name(element) {
    return 'merge' + element + 'Attributes';
  },
  attacher: attachAttributesMerger
}];

/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */
function attachAttributesMethods(Graph) {
  ATTRIBUTES_METHODS.forEach(function (_ref) {
    var name = _ref.name,
        attacher = _ref.attacher;


    // For edges
    attacher(Graph, name('Edge'), 'hasEdge', 'mixed');

    // For directed edges
    attacher(Graph, name('DirectedEdge'), 'hasDirectedEdge', 'directed');

    // For undirected edges
    attacher(Graph, name('UndirectedEdge'), 'hasUndirectedEdge', 'undirected');
  });
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachEdgeIteratorCreator = attachEdgeIteratorCreator;
exports.attachEdgeIterationMethods = attachEdgeIterationMethods;

var _iterator = __webpack_require__(12);

var _iterator2 = _interopRequireDefault(_iterator);

var _take = __webpack_require__(20);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(8);

var _data = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Graphology Edge Iteration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ==========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Attaching some methods to the Graph class to be able to iterate over a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * graph's edges.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Definitions.
 */
var EDGES_ITERATION = [{
  name: 'edges',
  type: 'mixed'
}, {
  name: 'inEdges',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outEdges',
  type: 'directed',
  direction: 'out'
}, {
  name: 'directedEdges',
  type: 'directed'
}, {
  name: 'undirectedEdges',
  type: 'undirected'
}];

/**
 * Helper classes.
 */

var EdgesIterator = function (_Iterator) {
  _inherits(EdgesIterator, _Iterator);

  function EdgesIterator() {
    _classCallCheck(this, EdgesIterator);

    return _possibleConstructorReturn(this, _Iterator.apply(this, arguments));
  }

  return EdgesIterator;
}(_iterator2.default);

/**
 * Function collecting edges from the given object.
 *
 * @param  {array}            edges  - Edges array to populate.
 * @param  {object|undefined} object - Target object.
 * @return {array}                   - The found edges.
 */


function collect(edges, object) {
  for (var k in object) {
    if (object[k] instanceof Set) edges.push.apply(edges, (0, _take2.default)(object[k].values(), object[k].size));else edges.push(object[k]);
  }
}

/**
 * Function collecting edges from the given object at given key.
 *
 * @param  {array}            edges  - Edges array to populate.
 * @param  {object|undefined} object - Target object.
 * @param  {mixed}            key    - Neighbor key.
 * @return {array}                   - The found edges.
 */
function collectForKey(edges, object, key) {

  if (!(key in object)) return;

  if (object[key] instanceof Set) edges.push.apply(edges, (0, _take2.default)(object[key].values(), object[key].size));else edges.push(object[key]);

  return;
}

/**
 * Function creating an array of edges for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */
function createEdgeArray(graph, type) {
  if (graph.size === 0) return [];

  if (type === 'mixed') return (0, _take2.default)(graph._edges.keys(), graph._edges.size);

  var list = [];

  graph._edges.forEach(function (data, edge) {

    if (data instanceof _data.UndirectedEdgeData === (type === 'undirected')) list.push(edge);
  });

  return list;
}

/**
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}       - Edge iterator.
 */
function createEdgeIterator(graph, type) {
  if (graph.size === 0) return EdgesIterator.empty();

  var inner = void 0;

  if (type === 'mixed') {
    inner = graph._edges.keys();
    return new EdgesIterator(inner.next.bind(inner));
  }

  inner = graph._edges.entries();

  return new EdgesIterator(function next() {
    var step = inner.next();

    if (step.done) return step;

    var data = step.value[1];

    if (data instanceof _data.UndirectedEdgeData === (type === 'undirected')) return { value: step.value[0] };

    return next();
  });
}

/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {Graph}   graph     - Target Graph instance.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(graph, type, direction, nodeData) {
  var edges = [];

  if (type !== 'undirected') {

    if (direction !== 'out') collect(edges, nodeData.in);
    if (direction !== 'in') collect(edges, nodeData.out);
  }

  if (type !== 'directed') {
    collect(edges, nodeData.undirected);
  }

  return edges;
}

/**
 * Function creating an array of edges for the given path.
 *
 * @param  {Graph}   graph  - Target Graph instance.
 * @param  {string}  type   - Type of edges to retrieve.
 * @param  {any}     source - Source node.
 * @param  {any}     target - Target node.
 * @return {array}          - Array of edges.
 */
function createEdgeArrayForPath(graph, type, source, target) {
  var edges = [];

  var sourceData = graph._nodes.get(source);

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined') collectForKey(edges, sourceData.in, target);

    if (typeof sourceData.out !== 'undefined') collectForKey(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') collectForKey(edges, sourceData.undirected, target);
  }

  return edges;
}

/**
 * Function attaching an edge array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;

  /**
   * Function returning an array of certain edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1a: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant edges of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (source, target) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];

    if (!arguments.length) return createEdgeArray(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + source + '" node in the graph.');

      // Iterating over a node's edges
      return createEdgeArrayForNode(this, type, direction, nodeData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      if (!this._nodes.has(source)) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + source + '" source node in the graph.');

      if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + target + '" target node in the graph.');

      // Iterating over the edges between source & target
      return createEdgeArrayForPath(this, type, source, target);
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': too many arguments (expecting 0, 1 or 2 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching an edge array iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeIteratorCreator(Class, description) {
  var originalName = description.name,
      type = description.type;


  var name = originalName + 'Iterator';

  /**
   * Function returning an iterator over the graph's edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1a: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant edges of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function () {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return _iterator2.default.empty();

    if (!arguments.length) return createEdgeIterator(this, type);

    // TODO: complete here...
    // if (arguments.length === 1) {
    //   source = '' + source;

    //   if (!this._nodes.has(source))
    //     throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);

    //   // Iterating over a node's edges
    //   return createEdgeArrayForNode(this, type, direction, source);
    // }

    // if (arguments.length === 2) {
    //   source = '' + source;
    //   target = '' + target;

    //   if (!this._nodes.has(source))
    //     throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

    //   if (!this._nodes.has(target))
    //     throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

    //   // Iterating over the edges between source & target
    //   return createEdgeArrayForPath(this, type, source, target);
    // }

    // throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(function (description) {
    attachEdgeArrayCreator(Graph, description);
    attachEdgeIteratorCreator(Graph, description);
  });
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachNeighborIterationMethods = attachNeighborIterationMethods;

var _take = __webpack_require__(20);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Definitions.
 */
/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
var NEIGHBORS_ITERATION = [{
  name: 'neighbors',
  type: 'mixed'
}, {
  name: 'inNeighbors',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outNeighbors',
  type: 'directed',
  direction: 'out'
}, {
  name: 'directedNeighbors',
  type: 'directed'
}, {
  name: 'undirectedNeighbors',
  type: 'undirected'
}];

/**
 * Function merging neighbors into the given set iterating over the given object.
 *
 * @param {BasicSet} neighbors - Neighbors set.
 * @param {object}   object    - Target object.
 */
function merge(neighbors, object) {
  if (typeof object === 'undefined') return;

  for (var neighbor in object) {
    neighbors.add(neighbor);
  }
}

/**
 * Function creating a set of relevant neighbors for the given node.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {any}          nodeData  - Target node's data.
 * @return {Array}                  - The list of neighbors.
 */
function createNeighborSetForNode(graph, type, direction, nodeData) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return Object.keys(nodeData.undirected);

    if (typeof direction === 'string') return Object.keys(nodeData[direction]);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  var neighbors = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      merge(neighbors, nodeData.in);
    }
    if (direction !== 'in') {
      merge(neighbors, nodeData.out);
    }
  }

  if (type !== 'directed') {
    merge(neighbors, nodeData.undirected);
  }

  return (0, _take2.default)(neighbors.values(), neighbors.size);
}

/**
 * Function returning whether the given node has target neighbor.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbor.
 * @param  {string}       direction - Direction.
 * @param  {any}          node      - Target node.
 * @param  {any}          neighbor  - Target neighbor.
 * @return {boolean}
 */
function nodeHasNeighbor(graph, type, direction, node, neighbor) {

  var nodeData = graph._nodes.get(node);

  if (type !== 'undirected') {

    if (direction !== 'out' && typeof nodeData.in !== 'undefined') {
      for (var k in nodeData.in) {
        if (k === neighbor) return true;
      }
    }
    if (direction !== 'in' && typeof nodeData.out !== 'undefined') {
      for (var _k in nodeData.out) {
        if (_k === neighbor) return true;
      }
    }
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    for (var _k2 in nodeData.undirected) {
      if (_k2 === neighbor) return true;
    }
  }

  return false;
}

/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;

  /**
   * Function returning an array or the count of certain neighbors.
   *
   * Arity 1a: Return all of a node's relevant neighbors.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant neighbors of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
   *
   * Arity 2: Return whether the two nodes are indeed neighbors.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The neighbors or the number of neighbors.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (node) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];

    if (arguments.length === 2) {
      var node1 = '' + arguments[0],
          node2 = '' + arguments[1];

      if (!this._nodes.has(node1)) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node1 + '" node in the graph.');

      if (!this._nodes.has(node2)) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node2 + '" node in the graph.');

      // Here, we want to assess whether the two given nodes are neighbors
      return nodeHasNeighbor(this, type, direction, node1, node2);
    } else if (arguments.length === 1) {
      node = '' + node;

      var nodeData = this._nodes.get(node);

      if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node + '" node in the graph.');

      // Here, we want to iterate over a node's relevant neighbors
      var neighbors = createNeighborSetForNode(this, type, direction, nodeData);

      return neighbors;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid number of arguments (expecting 1 or 2 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching every neighbor iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(function (description) {
    attachNeighborArrayCreator(Graph, description);
  });
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeNode = serializeNode;
exports.serializeEdge = serializeEdge;
exports.validateSerializedNode = validateSerializedNode;
exports.validateSerializedEdge = validateSerializedEdge;

var _data = __webpack_require__(21);

var _utils = __webpack_require__(10);

/**
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */
/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used to validate import-export formats & to ouput
 * them from internal graph data.
 *
 * Serialized Node:
 * {key, ?attributes}
 *
 * Serialized Edge:
 * {key?, source, target, attributes?, undirected?}
 *
 * Serialized Graph:
 * {nodes[], edges?[]}
 */
function serializeNode(key, data) {
  var serialized = { key: key };

  if (Object.keys(data.attributes).length) serialized.attributes = data.attributes;

  return serialized;
}

/**
 * Formats internal edge data into a serialized edge.
 *
 * @param  {any}    key  - The edge's key.
 * @param  {object} data - Internal edge's data.
 * @return {array}       - The serialized edge.
 */
function serializeEdge(key, data) {
  var serialized = {
    source: data.source,
    target: data.target
  };

  // We export the key unless if it was provided by the user
  if (!data.generatedKey) serialized.key = key;

  if (Object.keys(data.attributes).length) serialized.attributes = data.attributes;

  if (data instanceof _data.UndirectedEdgeData) serialized.undirected = true;

  return serialized;
}

/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
function validateSerializedNode(value) {
  if (!(0, _utils.isPlainObject)(value)) return 'not-object';

  if (!('key' in value)) return 'no-key';

  if ('attributes' in value && (!(0, _utils.isPlainObject)(value.attributes) || value.attributes === null)) return 'invalid-attributes';

  return null;
}

/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
function validateSerializedEdge(value) {
  if (!(0, _utils.isPlainObject)(value)) return 'not-object';

  if (!('source' in value)) return 'no-source';

  if (!('target' in value)) return 'no-target';

  if ('attributes' in value && (!(0, _utils.isPlainObject)(value.attributes) || value.attributes === null)) return 'invalid-attributes';

  if ('undirected' in value && typeof value.undirected !== 'boolean') return 'invalid-undirected';

  return null;
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Standard Library
 * ============================
 *
 * Library endpoint for the browser.
 */
exports.assertions = __webpack_require__(78);
exports.communitiesLouvain = __webpack_require__(141);
exports.components = __webpack_require__(167);
exports.generators = __webpack_require__(169);
exports.hits = __webpack_require__(190);
exports.layout = __webpack_require__(192);
exports.layoutForceAtlas2 = __webpack_require__(195);
exports.metrics = __webpack_require__(200);
exports.operators = __webpack_require__(212);
exports.pagerank = __webpack_require__(216);
exports.shortestPath = __webpack_require__(218);
exports.utils = __webpack_require__(220);

// Browser specific
exports.FA2Layout = __webpack_require__(224);
exports.gexf = __webpack_require__(225);


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(79);


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var isEqual = __webpack_require__(80);

/**
 * Function returning whether the given graphs have the same nodes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
exports.sameNodes = function(G, H) {

  if (G.order !== H.order)
    return false;

  var ng = G.nodes(),
      l = G.order,
      i;

  for (i = 0; i < l; i++) {
    if (!H.hasNode(ng[i]))
      return false;
  }

  return true;
};

/**
 * Function returning whether the given graphs have the same nodes & if these
 * nodes have the same attributes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
exports.sameDeepNodes = function(G, H) {

  if (G.order !== H.order)
    return false;

  var ng = G.nodes(),
      l = G.order,
      e,
      i;

  for (i = 0; i < l; i++) {
    if (!H.hasNode(ng[i]))
      return false;

    e = isEqual(
      G.getNodeAttributes(ng[i]),
      H.getNodeAttributes(ng[i])
    );

    if (!e)
      return false;
  }

  return true;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(81);

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(82),
    isObjectLike = __webpack_require__(5);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(36),
    equalArrays = __webpack_require__(40),
    equalByTag = __webpack_require__(117),
    equalObjects = __webpack_require__(120),
    getTag = __webpack_require__(136),
    isArray = __webpack_require__(17),
    isBuffer = __webpack_require__(25),
    isTypedArray = __webpack_require__(27);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 83 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 89 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 91 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13),
    Map = __webpack_require__(22),
    MapCache = __webpack_require__(39);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(23),
    isMasked = __webpack_require__(97),
    isObject = __webpack_require__(3),
    toSource = __webpack_require__(38);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 94 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(24);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(98);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 99 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(101),
    ListCache = __webpack_require__(13),
    Map = __webpack_require__(22);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(102),
    hashDelete = __webpack_require__(103),
    hashGet = __webpack_require__(104),
    hashHas = __webpack_require__(105),
    hashSet = __webpack_require__(106);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 103 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(39),
    setCacheAdd = __webpack_require__(113),
    setCacheHas = __webpack_require__(114);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 113 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 114 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 115 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 116 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(24),
    Uint8Array = __webpack_require__(41),
    eq = __webpack_require__(6),
    equalArrays = __webpack_require__(40),
    mapToArray = __webpack_require__(118),
    setToArray = __webpack_require__(119);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 118 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 119 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(121);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(122),
    getSymbols = __webpack_require__(124),
    keys = __webpack_require__(127);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(123),
    isArray = __webpack_require__(17);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 123 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(125),
    stubArray = __webpack_require__(126);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 125 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(42),
    baseKeys = __webpack_require__(134),
    isArrayLike = __webpack_require__(18);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 128 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(7),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 130 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(7),
    isLength = __webpack_require__(45),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(37);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module)))

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(28),
    nativeKeys = __webpack_require__(135);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(46);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(137),
    Map = __webpack_require__(22),
    Promise = __webpack_require__(138),
    Set = __webpack_require__(139),
    WeakMap = __webpack_require__(140),
    baseGetTag = __webpack_require__(7),
    toSource = __webpack_require__(38);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(142);


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Louvain Algorithm
 * =============================
 *
 * JavaScript implementation of the Louvain algorithm for community detection
 * using the `graphology` Graph library.
 *
 * [Reference]:
 * https://arxiv.org/pdf/0803.0476v2.pdf
 *
 * [Article]:
 * Fast unfolding of communities in large networks
 * Vincent D. Blondel, Jean-Loup Guillaume, Renaud Lambiotte, Etienne Lefebvre
 *
 * [Notes]:
 * 'altered' set heuristic:
 * A set of altered communities is stored and used at each iteration of the
 * phase 1.
 * Indeed, every time a movement is made from C1 to C2
 * Then for the next iteration through every node each movement from a
 * not-altered to another not-altered community is pointless to check
 * because the ∆Q would be the same (negative movement then).
 * A old set is used to store the altered comm. from the previous phase 1 iteration
 * A new set is used to store the altered comm. of the current phase 1 iteration
 * A flag is used to handle the first phase-1 iteration
 */
var defaults = __webpack_require__(19),
    isGraph = __webpack_require__(0);

var DEFAULTS = {
  attributes: {
    community: 'community',
    weight: 'weight'
  }
};

/**
 * Function returning the communities mapping of the graph.
 *
 * @param  {boolean} assign        - Assign communities to nodes attributes?
 * @param  {Graph}   graph         - Target graph.
 * @param  {object}  options       - Options:
 * @param  {object}    attributes  - Attribute names:
 * @param  {string}      community - Community node attribute name.
 * @param  {string}      weight    - Weight edge attribute name.
 * @return {object}
 */
function louvain(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-communities-louvain: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-communities-louvain: multi graphs are not handled.');

  if (!graph.size)
    throw new Error('graphology-communities-louvain: the graph has no edges.');

  // Attributes name
  options = defaults({}, options, DEFAULTS);

  var nodes = graph.nodes(),
      edges,
      dendogram = {};

  // Pass variables
  var pgraph = graph,
      bgraph,
      M,
      belongings,
      indegree,
      outdegree,
      altered,
      enhancingPass,
      possessions,
      w, weight, weights;

  // Phase 1 variables
  var bufferDQ,
      deltaQ,
      moveMade,
      neighbors,
      nextCommunity,
      between,
      oldc, newc,
      stack,
      visited;

  // Iterations variables
  var i, l1,
      j, l2,
      k, l3,
      keys,
      node, node2, edge, edge2, bounds,
      community, community2;

  for (i = 0, l1 = nodes.length; i < l1; i++)
    dendogram[nodes[i]] = [nodes[i]];

  /**
   * Starting passes
   * ***************
   */
  do {
    // Pass initialization
    enhancingPass = false;
    nodes = pgraph.nodes();
    edges = pgraph.edges();
    M = 0;
    belongings = {};
    possessions = {};
    weights = {};
    indegree = {};
    outdegree = {};
    altered = {prev: {}, curr: {}, flag: false}; // see top notes
    for (i = 0, l1 = nodes.length; i < l1; i++) {
      node = nodes[i];
      belongings[node] = node;
      possessions[node] = {};
      possessions[node][node] = true;
      indegree[node] = 0;
      outdegree[node] = 0;
    }
    for (i = 0, l1 = edges.length; i < l1; i++) {
      edge = edges[i];
      bounds = pgraph.extremities(edge);
      w = pgraph.getEdgeAttribute(edge, options.attributes.weight);
      weight = isNaN(w) ? 1 : w;
      weights[edge] = weight;

      outdegree[bounds[0]] += weight;
      indegree[bounds[1]] += weight;
      if (pgraph.undirected(edge) && bounds[0] !== bounds[1]) {
        indegree[bounds[0]] += weight;
        outdegree[bounds[1]] += weight;
        M += 2 * weight;
      }
      else
        M += weight;
    }

    /**
     * Phase 1 :
     * For each node, it looks for the best move to one if its neighbors' community
     * and it does the best one - according to the modularity addition value
     *
     * After every node has been visited and each respective move - or not - has been done,
     * it iterates again until no enhancing move has been done through any node
     * -------------------------------------------------------------------------------------
     */
    do {
      moveMade = false;

      // see top notes
      altered.prev = altered.curr;
      altered.curr = {};

      for (i = 0, l1 = nodes.length; i < l1; i++) {
        node = nodes[i];
        community = belongings[node];
        deltaQ = 0;
        bufferDQ = 0;
        visited = {};
        visited[community] = true;
        between = {old: 0, new: 0};
        oldc = {in: 0, out: 0};

        // Computing current community values
        stack = Object.keys(possessions[community]);
        for (j = 0, l2 = stack.length; j < l2; j++) {
          node2 = stack[j];
          if (node !== node2) {
            oldc.in += indegree[node2];
            oldc.out += outdegree[node2];
            between.old += weights[pgraph.edge(node, node2)] || 0;
            between.old += weights[pgraph.edge(node2, node)] || 0;
          }
        }

        // Iterating through neighbors
        neighbors = pgraph.neighbors(node);
        for (j = 0, l2 = neighbors.length; j < l2; j++) {
          community2 = belongings[neighbors[j]];
          if (visited[community2])
            continue;
          visited[community2] = true;
          // see top notes
          if (altered.flag && !altered.prev[community] && !altered.prev[community2])
            continue;

          between.new = 0;
          newc = {in: 0, out: 0};

          stack = Object.keys(possessions[community2]);
          for (k = 0, l3 = stack.length; k < l3; k++) {
            node2 = stack[k];
            newc.in += indegree[node2];
            newc.out += outdegree[node2];
            between.new += weights[pgraph.edge(node, node2)] || 0;
            between.new += weights[pgraph.edge(node2, node)] || 0;
          }

          deltaQ = (between.new - between.old) / M;
          deltaQ += indegree[node] * (oldc.out - newc.out) / (M * M);
          deltaQ += outdegree[node] * (oldc.in - newc.in) / (M * M);
          if (deltaQ > bufferDQ) {
            bufferDQ = deltaQ;
            nextCommunity = community2;
          }
        }

        // If a positive mode has been found
        if (bufferDQ > 0) {
          moveMade = true;
          enhancingPass = true;
          altered.curr[community] = true; // see top notes
          altered.curr[nextCommunity] = true;
          delete possessions[community][node];
          if (Object.keys(possessions[community]).length === 0)
            delete possessions[community];

          belongings[node] = nextCommunity;
          possessions[nextCommunity][node] = node;
        }
      }
      altered.flag = true; // SEE NOTES AT THE TOP
    } while (moveMade);

    /**
     * Phase 2 :
     * If a move has been made, we create a new graph,
     * nodes being communities and edges the links betweem them
     * -------------------------------------------------------------------------------------
     */
    if (enhancingPass) {
      bgraph = pgraph.emptyCopy();
      bgraph.upgradeToMixed();

      // Adding the nodes
      keys = Object.keys(possessions);
      for (i = 0, l1 = keys.length; i < l1; i++)
        bgraph.addNode(keys[i]);

      // Adding the edges
      for (i = 0, l1 = edges.length; i < l1; i++) {
        edge = edges[i];
        bounds = pgraph.extremities(edge);
        community = belongings[bounds[0]];
        community2 = belongings[bounds[1]];
        w = weights[edge];

        edge2 = bgraph.directedEdge(community, community2);
        if (edge2 === undefined)
          bgraph.addDirectedEdge(community, community2, {weight: w});
        else {
          weight = bgraph.getEdgeAttribute(edge2, options.attributes.weight);
          bgraph.setEdgeAttribute(edge2, options.attributes.weight, weight + w);
        }

        if (pgraph.undirected(edge) && bounds[0] !== bounds[1]) {
          edge2 = bgraph.directedEdge(community2, community);
          if (edge2 === undefined)
            bgraph.addDirectedEdge(community2, community, {weight: w});
          else {
            weight = bgraph.getEdgeAttribute(edge2, options.attributes.weight);
            bgraph.setEdgeAttribute(edge2, options.attributes.weight, weight + w);
          }
        }
      }

      // Updating the dendogram
      nodes = Object.keys(dendogram);
      for (i = 0, l1 = nodes.length; i < l1; i++) {
        node = nodes[i];
        community = belongings[dendogram[node][dendogram[node].length - 1]];
        dendogram[node].push(community);
      }

      // Now using the new graph
      pgraph = bgraph;
    }
  } while (enhancingPass);

  nodes = Object.keys(dendogram);

  // Assigning
  if (assign)
    for (i = 0, l1 = nodes.length; i < l1; i ++) {
      node = nodes[i];
      graph.setNodeAttribute(node, options.attributes.community, dendogram[node][dendogram[node].length - 1]);
    }

  // Standard case ; getting the final partitions from the dendogram
  for (node in dendogram)
    dendogram[node] = dendogram[node][dendogram[node].length - 1];

  return dendogram;
}

/**
 * Exporting.
 */
var fn = louvain.bind(null, false);
fn.assign = louvain.bind(null, true);

module.exports = fn;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(47);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(145),
    shortOut = __webpack_require__(147);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(146),
    defineProperty = __webpack_require__(49),
    identity = __webpack_require__(48);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 146 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 147 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(50),
    isObject = __webpack_require__(3);

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

module.exports = customDefaultsMerge;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(150);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 150 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var assignMergeValue = __webpack_require__(51),
    cloneBuffer = __webpack_require__(152),
    cloneTypedArray = __webpack_require__(153),
    copyArray = __webpack_require__(155),
    initCloneObject = __webpack_require__(156),
    isArguments = __webpack_require__(43),
    isArray = __webpack_require__(17),
    isArrayLikeObject = __webpack_require__(158),
    isBuffer = __webpack_require__(25),
    isFunction = __webpack_require__(23),
    isObject = __webpack_require__(3),
    isPlainObject = __webpack_require__(159),
    isTypedArray = __webpack_require__(27),
    safeGet = __webpack_require__(53),
    toPlainObject = __webpack_require__(160);

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(2);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module)))

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(154);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(41);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 155 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(157),
    getPrototype = __webpack_require__(52),
    isPrototype = __webpack_require__(28);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(18),
    isObjectLike = __webpack_require__(5);

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(7),
    getPrototype = __webpack_require__(52),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(161),
    keysIn = __webpack_require__(31);

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(162),
    baseAssignValue = __webpack_require__(30);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(30),
    eq = __webpack_require__(6);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3),
    isPrototype = __webpack_require__(28),
    nativeKeysIn = __webpack_require__(164);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(50),
    createAssigner = __webpack_require__(166);

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(29),
    isIterateeCall = __webpack_require__(32);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(168);


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Components
 * ======================
 *
 * Basic connected components-related functions.
 */
var isGraph = __webpack_require__(0);

/**
 * Function returning a list of connected components.
 *
 * @param  {Graph} graph - Target graph.
 * @return {array}
 */
exports.connectedComponents = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  var components = [],
      nodes = graph.nodes(),
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++) {
      components.push([nodes[i]]);
    }
    return components;
  }

  var component,
      stack = [],
      node,
      neighbor,
      visited = new Set();

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];

    if (!visited.has(node)) {
      visited.add(node);
      component = [node];
      components.push(component);

      stack.push.apply(stack, graph.neighbors(node));

      while (stack.length) {
        neighbor = stack.pop();

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          component.push(neighbor);
          stack.push.apply(stack, graph.neighbors(neighbor));
        }
      }
    }
  }

  return components;
};

/**
 * Function returning a list of strongly connected components.
 *
 * @param  {Graph} graph - Target directed graph.
 * @return {array}
 */
exports.stronglyConnectedComponents = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  if (graph.type === 'undirected')
    throw new Error('graphology-components: the given graph is undirected');

  var nodes = graph.nodes(),
      components = [],
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++)
      components.push([nodes[i]]);
    return components;
  }

  var count = 1,
      P = [],
      S = [],
      preorder = new Map(),
      assigned = new Set(),
      component,
      pop,
      vertex;

  var DFS = function(node) {
    var neighbor,
        neighbors = graph.outNeighbors(node).concat(graph.undirectedNeighbors(node)),
        neighborOrder;

    preorder.set(node, count++);
    P.push(node);
    S.push(node);

    for (var k = 0, n = neighbors.length; k < n; k++) {
      neighbor = neighbors[k];

      if (preorder.has(neighbor)) {
        neighborOrder = preorder.get(neighbor);
        if (!assigned.has(neighbor))
          while (preorder.get(P[P.length - 1]) > neighborOrder)
            P.pop();
      }
      else
        DFS(neighbor);
    }

    if (preorder.get(P[P.length - 1]) === preorder.get(node)) {
      component = [];
      do {
        pop = S.pop();
        component.push(pop);
        assigned.add(pop);
      } while (pop !== node);
      components.push(component);
      P.pop();
    }
  };

  for (i = 0, l = nodes.length; i < l; i++) {
    vertex = nodes[i];
    if (!assigned.has(vertex))
      DFS(vertex);
  }

  return components;
};


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(170);


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Graph Generators
 * ============================
 *
 * Library endpoint.
 */
exports.classic = __webpack_require__(171);
exports.random = __webpack_require__(181);
exports.small = __webpack_require__(185);
exports.social = __webpack_require__(187);


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Classic Graph Generators
 * ====================================
 *
 * Classic graph generators endpoint.
 */
exports.complete = __webpack_require__(172);
exports.empty = __webpack_require__(178);
exports.ladder = __webpack_require__(179);
exports.path = __webpack_require__(180);


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Complete Graph Generator
 * ====================================
 *
 * Function generating complete graphs.
 */
var isGraphConstructor = __webpack_require__(1),
    combinations = __webpack_require__(54),
    range = __webpack_require__(9);

/**
 * Generates a complete graph with n nodes.
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} order      - Number of nodes of the graph.
 * @return {Graph}
 */
module.exports = function complete(GraphClass, order) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/complete: invalid Graph constructor.');

  var graph = new GraphClass();

  for (var i = 0; i < order; i++)
    graph.addNode(i);

  if (order > 1) {
    var iterator = combinations(range(order), 2),
        path,
        step;

    while ((step = iterator.next(), !step.done)) {
      path = step.value;

      if (graph.type !== 'directed')
        graph.addUndirectedEdge(path[0], path[1]);

      if (graph.type !== 'undirected') {
        graph.addDirectedEdge(path[0], path[1]);
        graph.addDirectedEdge(path[1], path[0]);
      }
    }
  }

  return graph;
};


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var baseRange = __webpack_require__(174),
    isIterateeCall = __webpack_require__(32),
    toFinite = __webpack_require__(175);

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

module.exports = createRange;


/***/ }),
/* 174 */
/***/ (function(module, exports) {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

module.exports = baseRange;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(176);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3),
    isSymbol = __webpack_require__(177);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(7),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Empty Graph Generator
 * =================================
 *
 * Function generating empty graphs.
 */
var isGraphConstructor = __webpack_require__(1),
    range = __webpack_require__(9);

/**
 * Generates an empty graph with n nodes and 0 edges.
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} order      - Number of nodes of the graph.
 * @return {Graph}
 */
module.exports = function empty(GraphClass, order) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/empty: invalid Graph constructor.');

  var graph = new GraphClass();

  graph.addNodesFrom(range(order));

  return graph;
};


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Ladder Graph Generator
 * ==================================
 *
 * Function generating ladder graphs.
 */
var isGraphConstructor = __webpack_require__(1),
    mergePath = __webpack_require__(33),
    range = __webpack_require__(9);

/**
 * Generates a ladder graph of length n (order will therefore be 2 * n).
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} length     - Length of the ladder.
 * @return {Graph}
 */
module.exports = function ladder(GraphClass, length) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/ladder: invalid Graph constructor.');

  var graph = new GraphClass();

  mergePath(graph, range(length));
  mergePath(graph, range(length, length * 2));

  for (var i = 0; i < length; i++)
    graph.addEdge(i, i + length);

  return graph;
};


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Path Graph Generator
 * ================================
 *
 * Function generating path graphs.
 */
var isGraphConstructor = __webpack_require__(1),
    mergePath = __webpack_require__(33),
    range = __webpack_require__(9);

/**
 * Generates a path graph with n nodes.
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} order      - Number of nodes of the graph.
 * @return {Graph}
 */
module.exports = function path(GraphClass, order) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/path: invalid Graph constructor.');

  var graph = new GraphClass();

  mergePath(graph, range(order));

  return graph;
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Random Graph Generators
 * ===================================
 *
 * Random graph generators endpoint.
 */
exports.clusters = __webpack_require__(182);
exports.erdosRenyi = __webpack_require__(183);
exports.girvanNewman = __webpack_require__(184);


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Random Clusters Graph Generator
 * ===========================================
 *
 * Function generating a graph containing the desired number of nodes & edges
 * and organized in the desired number of clusters.
 *
 * [Author]:
 * Alexis Jacomy
 */
var isGraphConstructor = __webpack_require__(1);

/**
 * Generates a random graph with clusters.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     clusterDensity - Probability that an edge will link two
 *                                       nodes of the same cluster.
 * @param  {number}     order          - Number of nodes.
 * @param  {number}     size           - Number of edges.
 * @param  {number}     clusters       - Number of clusters.
 * @param  {function}   rng            - Custom RNG function.
 * @return {Graph}
 */
module.exports = function(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/clusters: invalid Graph constructor.');

  options = options || {};

  var clusterDensity = ('clusterDensity' in options) ? options.clusterDensity : 0.5,
      rng = options.rng || Math.random,
      N = options.order,
      E = options.size,
      C = options.clusters;

  if (typeof clusterDensity !== 'number' || clusterDensity > 1 || clusterDensity < 0)
    throw new Error('graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/clusters: `rng` option should be a function.');

  if (typeof N !== 'number' || N <= 0)
    throw new Error('graphology-generators/random/clusters: `order` option should be a positive number.');

  if (typeof E !== 'number' || E <= 0)
    throw new Error('graphology-generators/random/clusters: `size` option should be a positive number.');

  if (typeof C !== 'number' || C <= 0)
    throw new Error('graphology-generators/random/clusters: `clusters` option should be a positive number.');

  // Creating graph
  var graph = new GraphClass();

  // Adding nodes
  if (!N)
    return graph;

  // Initializing clusters
  var clusters = new Array(C),
      cluster,
      nodes,
      i;

  for (i = 0; i < C; i++)
    clusters[i] = [];

  for (i = 0; i < N; i++) {
    cluster = (rng() * C) | 0;
    graph.addNode(i, {cluster: cluster});
    clusters[cluster].push(i);
  }

  // Adding edges
  if (!E)
    return graph;

  var source,
      target,
      l;

  for (i = 0; i < E; i++) {

    // Adding a link between two random nodes
    if (rng() < 1 - clusterDensity) {
      source = (rng() * N) | 0;

      do {
        target = (rng() * N) | 0;
      } while (source === target);
    }

    // Adding a link between two nodes from the same cluster
    else {
      cluster = (rng() * C) | 0;
      nodes = clusters[cluster];
      l = nodes.length;

      if (!l || l < 2) {

        // TODO: in those case we may have fewer edges than required
        // TODO: check where E is over full clusterDensity
        continue;
      }

      source = nodes[(rng() * l) | 0];

      do {
        target = nodes[(rng() * l) | 0];
      } while (source === target);
    }

    if (!graph.multi)
      graph.mergeEdge(source, target);
    else
      graph.addEdge(source, target);
  }

  return graph;
};


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Erdos-Renyi Graph Generator
 * =======================================
 *
 * Function generating binomial graphs.
 */
var isGraphConstructor = __webpack_require__(1),
    combinations = __webpack_require__(54),
    range = __webpack_require__(9),
    density = __webpack_require__(55);

/**
 * Generates a binomial graph graph with n nodes.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     order       - Number of nodes in the graph.
 * @param  {number}     probability - Probability for edge creation.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
function erdosRenyi(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/erdos-renyi: invalid Graph constructor.');

  var order = options.order,
      probability = options.probability,
      rng = options.rng || Math.random;

  var graph = new GraphClass();

  // If user gave a size, we need to compute probability
  if (typeof options.approximateSize === 'number') {
    var densityFunction = density[graph.type + 'Density'];
    probability = densityFunction(order, options.approximateSize);
  }

  if (typeof order !== 'number' || order <= 0)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `order`. Should be a positive number.');

  if (typeof probability !== 'number' || probability < 0 || probability > 1)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `probability`. Should be a number between 0 and 1. Or maybe you gave an `approximateSize` exceeding the graph\'s density.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/erdos-renyi: invalid `rng`. Should be a function.');

  for (var i = 0; i < order; i++)
    graph.addNode(i);

  if (probability <= 0)
    return graph;

  if (order > 1) {
    var iterator = combinations(range(order), 2),
        path,
        step;

    while ((step = iterator.next(), !step.done)) {
      path = step.value;

      if (graph.type !== 'directed') {
        if (rng() < probability)
          graph.addUndirectedEdge(path[0], path[1]);
      }

      if (graph.type !== 'undirected') {

        if (rng() < probability)
          graph.addDirectedEdge(path[0], path[1]);

        if (rng() < probability)
          graph.addDirectedEdge(path[1], path[0]);
      }
    }
  }

  return graph;
}

/**
 * Generates a binomial graph graph with n nodes using a faster algorithm
 * for sparse graphs.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     order       - Number of nodes in the graph.
 * @param  {number}     probability - Probability for edge creation.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
function erdosRenyiSparse(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/erdos-renyi: invalid Graph constructor.');

  var order = options.order,
      probability = options.probability,
      rng = options.rng || Math.random;

  var graph = new GraphClass();

  // If user gave a size, we need to compute probability
  if (typeof options.approximateSize === 'number') {
    var densityFunction = density[graph.type + 'Density'];
    probability = densityFunction(order, options.approximateSize);
  }

  if (typeof order !== 'number' || order <= 0)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `order`. Should be a positive number.');

  if (typeof probability !== 'number' || probability < 0 || probability > 1)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `probability`. Should be a number between 0 and 1. Or maybe you gave an `approximateSize` exceeding the graph\'s density.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/erdos-renyi: invalid `rng`. Should be a function.');

  for (var i = 0; i < order; i++)
    graph.addNode(i);

  if (probability <= 0)
    return graph;

  var w = -1,
      lp = Math.log(1 - probability),
      lr,
      v;

  if (graph.type !== 'undirected') {
    v = 0;

    while (v < order) {
      lr = Math.log(1 - rng());
      w += 1 + ((lr / lp) | 0);

      // Avoiding self loops
      if (v === w) {
        w++;
      }

      while (v < order && order <= w) {
        w -= order;
        v++;

        // Avoiding self loops
        if (v === w)
          w++;
      }

      if (v < order)
        graph.addDirectedEdge(v, w);
    }
  }

  w = -1;

  if (graph.type !== 'directed') {
    v = 1;

    while (v < order) {
      lr = Math.log(1 - rng());

      w += 1 + ((lr / lp) | 0);

      while (w >= v && v < order) {
        w -= v;
        v++;
      }

      if (v < order)
        graph.addUndirectedEdge(v, w);
    }
  }

  return graph;
}

/**
 * Exporting.
 */
erdosRenyi.sparse = erdosRenyiSparse;
module.exports = erdosRenyi;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Girvan-Newman Graph Generator
 * =========================================
 *
 * Function generating graphs liks the one used to test the Girvan-Newman
 * community algorithm.
 *
 * [Reference]:
 * http://www.pnas.org/content/99/12/7821.full.pdf
 *
 * [Article]:
 * Community Structure in  social and biological networks.
 * Girvan Newman, 2002. PNAS June, vol 99 n 12
 */
var isGraphConstructor = __webpack_require__(1);

/**
 * Generates a binomial graph graph with n nodes.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     zOut        - zOut parameter.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
module.exports = function girvanNewman(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/girvan-newman: invalid Graph constructor.');

  var zOut = options.zOut,
      rng = options.rng || Math.random;

  if (typeof zOut !== 'number')
    throw new Error('graphology-generators/random/girvan-newman: invalid `zOut`. Should be a number.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/girvan-newman: invalid `rng`. Should be a function.');

  var pOut = zOut / 96,
      pIn = (16 - pOut * 96) / 31,
      graph = new GraphClass(),
      random,
      i,
      j;

  for (i = 0; i < 128; i++)
    graph.addNode(i);

  for (i = 0; i < 128; i++) {
    for (j = i + 1; j < 128; j++) {
      random = rng();

      if (i % 4 === j % 4) {
        if (random < pIn)
          graph.addEdge(i, j);
      }
      else {
        if (random < pOut)
          graph.addEdge(i, j);
      }
    }
  }

  return graph;
};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Small Graph Generators
 * ==================================
 *
 * Small graph generators endpoint.
 */
exports.krackhardtKite = __webpack_require__(186);


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Krackhardt Kite Graph Generator
 * ===========================================
 *
 * Function generating the Krackhardt kite graph.
 */
var isGraphConstructor = __webpack_require__(1),
    mergeStar = __webpack_require__(56);

/**
 * Data.
 */
var ADJACENCY = [
  ['Andre', 'Beverley', 'Carol', 'Diane', 'Fernando'],
  ['Beverley', 'Andre', 'Ed', 'Garth'],
  ['Carol', 'Andre', 'Diane', 'Fernando'],
  ['Diane', 'Andre', 'Beverley', 'Carol', 'Ed', 'Fernando', 'Garth'],
  ['Ed', 'Beverley', 'Diane', 'Garth'],
  ['Fernando', 'Andre', 'Carol', 'Diane', 'Garth', 'Heather'],
  ['Garth', 'Beverley', 'Diane', 'Ed', 'Fernando', 'Heather'],
  ['Heather', 'Fernando', 'Garth', 'Ike'],
  ['Ike', 'Heather', 'Jane'],
  ['Jane', 'Ike']
];

/**
 * Function generating the Krackhardt kite graph.
 *
 * @param  {Class} GraphClass - The Graph Class to instantiate.
 * @return {Graph}
 */
module.exports = function krackhardtKite(GraphClass) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/social/krackhardt-kite: invalid Graph constructor.');

  var graph = new GraphClass(),
      i,
      l;

  for (i = 0, l = ADJACENCY.length; i < l; i++)
    mergeStar(graph, ADJACENCY[i]);

  return graph;
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Social Graph Generators
 * ===================================
 *
 * Social graph generators endpoint.
 */
exports.florentineFamilies = __webpack_require__(188);
exports.karateClub = __webpack_require__(189);


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Florentine Families Graph Generator
 * ===============================================
 *
 * Function generating the Florentine Families graph.
 *
 * [Reference]:
 * Ronald L. Breiger and Philippa E. Pattison
 * Cumulated social roles: The duality of persons and their algebras,1
 * Social Networks, Volume 8, Issue 3, September 1986, Pages 215-256
 */
var isGraphConstructor = __webpack_require__(1);

/**
 * Data.
 */
var EDGES = [
  ['Acciaiuoli', 'Medici'],
  ['Castellani', 'Peruzzi'],
  ['Castellani', 'Strozzi'],
  ['Castellani', 'Barbadori'],
  ['Medici', 'Barbadori'],
  ['Medici', 'Ridolfi'],
  ['Medici', 'Tornabuoni'],
  ['Medici', 'Albizzi'],
  ['Medici', 'Salviati'],
  ['Salviati', 'Pazzi'],
  ['Peruzzi', 'Strozzi'],
  ['Peruzzi', 'Bischeri'],
  ['Strozzi', 'Ridolfi'],
  ['Strozzi', 'Bischeri'],
  ['Ridolfi', 'Tornabuoni'],
  ['Tornabuoni', 'Guadagni'],
  ['Albizzi', 'Ginori'],
  ['Albizzi', 'Guadagni'],
  ['Bischeri', 'Guadagni'],
  ['Guadagni', 'Lamberteschi']
];

/**
 * Function generating the florentine families graph.
 *
 * @param  {Class} GraphClass - The Graph Class to instantiate.
 * @return {Graph}
 */
module.exports = function florentineFamilies(GraphClass) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/social/florentine-families: invalid Graph constructor.');

  var graph = new GraphClass(),
      edge,
      i,
      l;

  for (i = 0, l = EDGES.length; i < l; i++) {
    edge = EDGES[i];

    graph.mergeEdge(edge[0], edge[1]);
  }

  return graph;
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Karate Graph Generator
 * ==================================
 *
 * Function generating Zachary's karate club graph.
 *
 * [Reference]:
 * Zachary, Wayne W.
 * "An Information Flow Model for Conflict and Fission in Small Groups."
 * Journal of Anthropological Research, 33, 452--473, (1977).
 */
var isGraphConstructor = __webpack_require__(1);

/**
 * Data.
 */
var DATA = [
  '0111111110111100010101000000000100',
  '1011000100000100010101000000001000',
  '1101000111000100000000000001100010',
  '1110000100001100000000000000000000',
  '1000001000100000000000000000000000',
  '1000001000100000100000000000000000',
  '1000110000000000100000000000000000',
  '1111000000000000000000000000000000',
  '1010000000000000000000000000001011',
  '0010000000000000000000000000000001',
  '1000110000000000000000000000000000',
  '1000000000000000000000000000000000',
  '1001000000000000000000000000000000',
  '1111000000000000000000000000000001',
  '0000000000000000000000000000000011',
  '0000000000000000000000000000000011',
  '0000011000000000000000000000000000',
  '1100000000000000000000000000000000',
  '0000000000000000000000000000000011',
  '1100000000000000000000000000000001',
  '0000000000000000000000000000000011',
  '1100000000000000000000000000000000',
  '0000000000000000000000000000000011',
  '0000000000000000000000000101010011',
  '0000000000000000000000000101000100',
  '0000000000000000000000011000000100',
  '0000000000000000000000000000010001',
  '0010000000000000000000011000000001',
  '0010000000000000000000000000000101',
  '0000000000000000000000010010000011',
  '0100000010000000000000000000000011',
  '1000000000000000000000001100100011',
  '0010000010000011001010110000011101',
  '0000000011000111001110110011111110'
];

var CLUB1 = new Set([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 16, 17, 19, 21
]);

/**
 * Function generating the karate club graph.
 *
 * @param  {Class} GraphClass - The Graph Class to instantiate.
 * @return {Graph}
 */
module.exports = function karateClub(GraphClass) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/social/karate: invalid Graph constructor.');

  var graph = new GraphClass(),
      club;

  for (var i = 0; i < 34; i++) {
    club = CLUB1.has(i) ? 'Mr. Hi' : 'Officer';

    graph.addNode(i, {club: club});
  }

  var line,
      entry,
      row,
      column,
      l,
      m;

  for (row = 0, l = DATA.length; row < l; row++) {
    line = DATA[row].split('');

    for (column = row + 1, m = line.length; column < m; column++) {
      entry = +line[column];

      if (entry)
        graph.addEdgeWithKey(row + '->' + column, row, column);
    }
  }

  return graph;
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(191);


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology HITS Algorithm
 * ==========================
 *
 * Implementation of the HITS algorithm for the graphology specs.
 */
var defaults = __webpack_require__(19),
    isGraph = __webpack_require__(0);

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    authority: 'authority',
    hub: 'hub',
    weight: 'weight'
  },
  maxIterations: 100,
  normalize: true,
  tolerance: 1e-8
};

/**
 * Function returning an object with the given keys set to the given value.
 *
 * @param  {array}  keys  - Keys to set.
 * @param  {number} value - Value to set.
 * @return {object}       - The created object.
 */
function dict(keys, value) {
  var o = Object.create(null);

  var i, l;

  for (i = 0, l = keys.length; i < l; i++)
    o[keys[i]] = value;

  return o;
}

/**
 * Function returning the sum of an object's values.
 *
 * @param  {object} o - Target object.
 * @return {number}   - The sum.
 */
function sum(o) {
  var nb = 0;

  for (var k in o)
    nb += o[k];

  return nb;
}

/**
 * HITS function taking a Graph instance & some options and returning a map
 * of nodes to their hubs & authorities.
 *
 * @param  {boolean} assign    - Should we assign the results as node attributes?
 * @param  {Graph}   graph     - A Graph instance.
 * @param  {object}  [options] - Options:
 * @param  {number}    [maxIterations] - Maximum number of iterations to perform.
 * @param  {boolean}   [normalize]     - Whether to normalize the results by the
 *                                       sum of all values.
 * @param  {number}    [tolerance]     - Error tolerance used to check
 *                                       convergence in power method iteration.
 */
function hits(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-hits: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-hits: the HITS algorithm does not work with MultiGraphs.');

  options = defaults(options, DEFAULTS);

  // Variables
  var order = graph.order,
      size = graph.size,
      nodes = graph.nodes(),
      edges = graph.edges(),
      hubs = dict(nodes, 1 / order),
      weights = {},
      converged = false,
      lastHubs,
      authorities;

  // Iteration variables
  var node,
      neighbor,
      edge,
      iteration,
      maxAuthority,
      maxHub,
      error,
      s,
      i,
      j, m;

  // Indexing weights
  for (i = 0; i < size; i++) {
    edge = edges[i];
    weights[edge] = graph.getEdgeAttribute(edge, options.attributes.weight) || 1;
  }

  // Performing iterations
  for (iteration = 0; iteration < options.maxIterations; iteration++) {
    lastHubs = hubs;
    hubs = dict(nodes, 0);
    authorities = dict(nodes, 0);
    maxHub = 0;
    maxAuthority = 0;

    // Iterating over nodes to update authorities
    for (i = 0; i < order; i++) {
      node = nodes[i];
      edges = graph
        .outEdges(node)
        .concat(graph.undirectedEdges(node));

      // Iterating over neighbors
      for (j = 0, m = edges.length; j < m; j++) {
        edge = edges[j];
        neighbor = graph.opposite(node, edge);

        authorities[neighbor] += lastHubs[node] * weights[edge];

        if (authorities[neighbor] > maxAuthority)
          maxAuthority = authorities[neighbor];
      }
    }

    // Iterating over nodes to update hubs
    for (i = 0; i < order; i++) {
      node = nodes[i];
      edges = graph
        .outEdges(node)
        .concat(graph.undirectedEdges(node));

      for (j = 0, m = edges.length; j < m; j++) {
        edge = edges[j];
        neighbor = graph.opposite(node, edge);

        hubs[node] += authorities[neighbor] * weights[edge];

        if (hubs[neighbor] > maxHub)
          maxHub = hubs[neighbor];
      }
    }

    // Normalizing
    s = 1 / maxHub;

    for (node in hubs)
      hubs[node] *= s;

    s = 1 / maxAuthority;

    for (node in authorities)
      authorities[node] *= s;

    // Checking convergence
    error = 0;

    for (node in hubs)
      error += Math.abs(hubs[node] - lastHubs[node]);

    if (error < options.tolerance) {
      converged = true;
      break;
    }
  }

  // Should we normalize the result?
  if (options.normalize) {
    s = 1 / sum(authorities);

    for (node in authorities)
      authorities[node] *= s;

    s = 1 / sum(hubs);

    for (node in hubs)
      hubs[node] *= s;
  }

  // Should we assign the results to the graph?
  if (assign) {
    for (i = 0; i < order; i++) {
      node = nodes[i];
      graph.setNodeAttribute(
        node,
        options.attributes.authority,
        authorities[node]
      );
      graph.setNodeAttribute(
        node,
        options.attributes.hub,
        hubs[node]
      );
    }
  }

  return {converged: converged, hubs: hubs, authorities: authorities};
}

/**
 * Exporting.
 */
var main = hits.bind(null, false);
main.assign = hits.bind(null, true);

module.exports = main;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(193);


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Layout
 * ==================
 *
 * Library endpoint.
 */
var random = __webpack_require__(194);

exports.random = random;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Random Layout
 * =========================
 *
 * Simple layout giving uniform random positions to the nodes.
 */
var defaults = __webpack_require__(19),
    isGraph = __webpack_require__(0);

/**
 * Default options.
 */
var DEFAULTS = {
  attributes: {
    x: 'x',
    y: 'y'
  },
  center: 0.5,
  rng: Math.random,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {object}     [attributes] - Attributes names to map.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {function}   [rng]        - Custom RNG function to be used.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericRandomLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-layout/random: the given graph is not a valid graphology instance.');

  options = defaults(options, DEFAULTS);

  var positions = {},
      nodes = graph.nodes(),
      center = options.center,
      rng = options.rng,
      scale = options.scale;

  var l = nodes.length,
      node,
      x,
      y,
      i;

  for (i = 0; i < l; i++) {
    node = nodes[i];

    x = rng() * scale;
    y = rng() * scale;

    if (center !== 0.5) {
      x += center - 0.5 * scale;
      y += center - 0.5 * scale;
    }

    positions[node] = {
      x: x,
      y: y
    };

    if (assign) {
      graph.setNodeAttribute(node, options.attributes.x, x);
      graph.setNodeAttribute(node, options.attributes.y, y);
    }
  }

  return positions;
}

var randomLayout = genericRandomLayout.bind(null, false);
randomLayout.assign = genericRandomLayout.bind(null, true);

module.exports = randomLayout;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(196);


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology ForceAtlas2 Layout
 * ==============================
 *
 * Library endpoint.
 */
var isGraph = __webpack_require__(0),
    iterate = __webpack_require__(197),
    helpers = __webpack_require__(198);

var DEFAULT_SETTINGS = __webpack_require__(199);

/**
 * Asbtract function used to run a certain number of iterations.
 *
 * @param  {boolean}       assign       - Whether to assign positions.
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - If number, params.iterations, else:
 * @param  {number}          iterations - Number of iterations.
 * @param  {object}          [settings] - Settings.
 * @return {object|undefined}
 */
function abstractSynchronousLayout(assign, graph, params) {
  if (!isGraph(graph))
    throw new Error('graphology-layout-forceatlas2: the given graph is not a valid graphology instance.');

  if (typeof params === 'number')
    params = {iterations: params};

  var iterations = params.iterations;

  if (typeof iterations !== 'number')
    throw new Error('graphology-layout-forceatlas2: invalid number of iterations.');

  if (iterations <= 0)
    throw new Error('graphology-layout-forceatlas2: you should provide a positive number of iterations.');

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings),
      validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error('graphology-layout-forceatlas2: ' + validationError.message);

  // Building matrices
  var matrices = helpers.graphToByteArrays(graph),
      i;

  // Iterating
  for (i = 0; i < iterations; i++)
    iterate(settings, matrices.nodes, matrices.edges);

  // Applying
  if (assign) {
    helpers.applyLayoutChanges(graph, matrices.nodes);
    return;
  }

  return helpers.collectLayoutChanges(graph, matrices.nodes);
}

/**
 * Exporting.
 */
var synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);

module.exports = synchronousLayout;


/***/ }),
/* 197 */
/***/ (function(module, exports) {

/* eslint no-constant-condition: 0 */
/**
 * Graphology ForceAtlas2 Iteration
 * =================================
 *
 * Function used to perform a single iteration of the algorithm.
 */

/**
 * Matrices properties accessors.
 */
var NODE_X = 0,
    NODE_Y = 1,
    NODE_DX = 2,
    NODE_DY = 3,
    NODE_OLD_DX = 4,
    NODE_OLD_DY = 5,
    NODE_MASS = 6,
    NODE_CONVERGENCE = 7,
    NODE_SIZE = 8,
    NODE_FIXED = 9;

var EDGE_SOURCE = 0,
    EDGE_TARGET = 1,
    EDGE_WEIGHT = 2;

var REGION_NODE = 0,
    REGION_CENTER_X = 1,
    REGION_CENTER_Y = 2,
    REGION_SIZE = 3,
    REGION_NEXT_SIBLING = 4,
    REGION_FIRST_CHILD = 5,
    REGION_MASS = 6,
    REGION_MASS_CENTER_X = 7,
    REGION_MASS_CENTER_Y = 8;

var SUBDIVISION_ATTEMPTS = 3;

/**
 * Constants.
 */
var PPN = 10,
    PPE = 3,
    PPR = 9;

var MAX_FORCE = 10;

/**
 * Function used to perform a single interation of the algorithm.
 *
 * @param  {object}       options    - Layout options.
 * @param  {Float32Array} NodeMatrix - Node data.
 * @param  {Float32Array} EdgeMatrix - Edge data.
 * @return {object}                  - Some metadata.
 */
module.exports = function iterate(options, NodeMatrix, EdgeMatrix) {

  // Initializing variables
  var l, r, n, n1, n2, e, w, g;

  var order = NodeMatrix.length,
      size = EdgeMatrix.length;

  var outboundAttCompensation,
      coefficient,
      xDist,
      yDist,
      ewc,
      distance,
      factor;

  var RegionMatrix = [];

  // 1) Initializing layout data
  //-----------------------------

  // Resetting positions & computing max values
  for (n = 0; n < order; n += PPN) {
    NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];
    NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];
    NodeMatrix[n + NODE_DX] = 0;
    NodeMatrix[n + NODE_DY] = 0;
  }

  // If outbound attraction distribution, compensate
  if (options.outboundAttractionDistribution) {
    outboundAttCompensation = 0;
    for (n = 0; n < order; n += PPN) {
      outboundAttCompensation += NodeMatrix[n + NODE_MASS];
    }

    outboundAttCompensation /= order;
  }


  // 1.bis) Barnes-Hut computation
  //------------------------------

  if (options.barnesHutOptimize) {

    // Setting up
    var minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        q, q2, subdivisionAttempts;

    // Computing min and max values
    for (n = 0; n < order; n += PPN) {
      minX = Math.min(minX, NodeMatrix[n + NODE_X]);
      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
    }

    // squarify bounds, it's a quadtree
    var dx = maxX - minX, dy = maxY - minY;
    if (dx > dy) {
      minY -= (dx - dy) / 2;
      maxY = minY + dx;
    }
    else {
      minX -= (dy - dx) / 2;
      maxX = minX + dy;
    }

    // Build the Barnes Hut root region
    RegionMatrix[0 + REGION_NODE] = -1;
    RegionMatrix[0 + REGION_CENTER_X] = (minX + maxX) / 2;
    RegionMatrix[0 + REGION_CENTER_Y] = (minY + maxY) / 2;
    RegionMatrix[0 + REGION_SIZE] = Math.max(maxX - minX, maxY - minY);
    RegionMatrix[0 + REGION_NEXT_SIBLING] = -1;
    RegionMatrix[0 + REGION_FIRST_CHILD] = -1;
    RegionMatrix[0 + REGION_MASS] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_X] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_Y] = 0;

    // Add each node in the tree
    l = 1;
    for (n = 0; n < order; n += PPN) {

      // Current region, starting with root
      r = 0;
      subdivisionAttempts = SUBDIVISION_ATTEMPTS;

      while (true) {
        // Are there sub-regions?

        // We look at first child index
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {

          // There are sub-regions

          // We just iterate to find a "leaf" of the tree
          // that is an empty region or a region with a single node
          // (see next case)

          // Find the quadrant of n
          if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {

            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

              // Top Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD];
            }
            else {

              // Bottom Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
            }
          }
          else {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

              // Top Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            }
            else {

              // Bottom Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            }
          }

          // Update center of mass and mass (we only do it for non-leave regions)
          RegionMatrix[r + REGION_MASS_CENTER_X] =
            (RegionMatrix[r + REGION_MASS_CENTER_X] * RegionMatrix[r + REGION_MASS] +
             NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS_CENTER_Y] =
            (RegionMatrix[r + REGION_MASS_CENTER_Y] * RegionMatrix[r + REGION_MASS] +
             NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS];

          // Iterate on the right quadrant
          r = q;
          continue;
        }
        else {

          // There are no sub-regions: we are in a "leaf"

          // Is there a node in this leave?
          if (RegionMatrix[r + REGION_NODE] < 0) {

            // There is no node in region:
            // we record node n and go on
            RegionMatrix[r + REGION_NODE] = n;
            break;
          }
          else {

            // There is a node in this region

            // We will need to create sub-regions, stick the two
            // nodes (the old one r[0] and the new one n) in two
            // subregions. If they fall in the same quadrant,
            // we will iterate.

            // Create sub-regions
            RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;
            w = RegionMatrix[r + REGION_SIZE] / 2; // new size (half)

            // NOTE: we use screen coordinates
            // from Top Left to Bottom Right

            // Top Left sub-region
            g = RegionMatrix[r + REGION_FIRST_CHILD];

            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Left sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Top Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = RegionMatrix[r + REGION_NEXT_SIBLING];
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            l += 4;

            // Now the goal is to find two different sub-regions
            // for the two nodes: the one previously recorded (r[0])
            // and the one we want to add (n)

            // Find the quadrant of the old node
            if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

                // Top Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD];
              }
              else {

                // Bottom Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            }
            else {
              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

                // Top Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              }
              else {

                // Bottom Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            // We remove r[0] from the region r, add its mass to r and record it in q
            RegionMatrix[r + REGION_MASS] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];
            RegionMatrix[r + REGION_MASS_CENTER_X] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
            RegionMatrix[r + REGION_MASS_CENTER_Y] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];

            RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];
            RegionMatrix[r + REGION_NODE] = -1;

            // Find the quadrant of n
            if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

                // Top Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD];
              }
              else {
                // Bottom Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            }
            else {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {

                // Top Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              }
              else {

                // Bottom Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            if (q === q2) {

              // If both nodes are in the same quadrant,
              // we have to try it again on this quadrant
              if (subdivisionAttempts--) {
                r = q;
                continue; // while
              }
              else {
                // we are out of precision here, and we cannot subdivide anymore
                // but we have to break the loop anyway
                subdivisionAttempts = SUBDIVISION_ATTEMPTS;
                break; // while
              }

            }

            // If both quadrants are different, we record n
            // in its quadrant
            RegionMatrix[q2 + REGION_NODE] = n;
            break;
          }
        }
      }
    }
  }


  // 2) Repulsion
  //--------------
  // NOTES: adjustSizes = antiCollision & scalingRatio = coefficient

  if (options.barnesHutOptimize) {
    coefficient = options.scalingRatio;

    // Applying repulsion through regions
    for (n = 0; n < order; n += PPN) {

      // Computing leaf quad nodes iteration

      r = 0; // Starting with root region
      while (true) {

        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {

          // The region has sub-regions

          // We run the Barnes Hut test to see if we are at the right distance
          distance = Math.sqrt(
            (Math.pow(NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X], 2)) +
            (Math.pow(NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y], 2))
          );

          if (2 * RegionMatrix[r + REGION_SIZE] / distance < options.barnesHutTheta) {

            // We treat the region as a single body, and we repulse

            xDist = NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];
            yDist = NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];

            if (options.adjustSizes) {

              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] *
                  RegionMatrix[r + REGION_MASS] / distance / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
              else if (distance < 0) {
                factor = -coefficient * NodeMatrix[n + NODE_MASS] *
                  RegionMatrix[r + REGION_MASS] / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }
            else {

              //-- Linear Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] *
                  RegionMatrix[r + REGION_MASS] / distance / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }

            // When this is done, we iterate. We have to look at the next sibling.
            if (RegionMatrix[r + REGION_NEXT_SIBLING] < 0)
              break; // No next sibling: we have finished the tree
            r = RegionMatrix[r + REGION_NEXT_SIBLING];
            continue;

          }
          else {

            // The region is too close and we have to look at sub-regions
            r = RegionMatrix[r + REGION_FIRST_CHILD];
            continue;
          }

        }
        else {

          // The region has no sub-region
          // If there is a node r[0] and it is not n, then repulse

          if (RegionMatrix[r + REGION_NODE] >= 0 && RegionMatrix[r + REGION_NODE] !== n) {
            xDist = NodeMatrix[n + NODE_X] - NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
            yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];

            distance = Math.sqrt(xDist * xDist + yDist * yDist);

            if (options.adjustSizes) {

              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] *
                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
              else if (distance < 0) {
                factor = -coefficient * NodeMatrix[n + NODE_MASS] *
                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }
            else {

              //-- Linear Repulsion
              if (distance > 0) {
                factor = coefficient * NodeMatrix[n + NODE_MASS] *
                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance / distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }

          }

          // When this is done, we iterate. We have to look at the next sibling.
          if (RegionMatrix[r + REGION_NEXT_SIBLING] < 0)
            break; // No next sibling: we have finished the tree
          r = RegionMatrix[r + REGION_NEXT_SIBLING];
          continue;
        }
      }
    }
  }
  else {
    coefficient = options.scalingRatio;

    // Square iteration
    for (n1 = 0; n1 < order; n1 += PPN) {
      for (n2 = 0; n2 < n1; n2 += PPN) {

        // Common to both methods
        xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
        yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

        if (options.adjustSizes) {

          //-- Anticollision Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist) -
            NodeMatrix[n1 + NODE_SIZE] -
            NodeMatrix[n2 + NODE_SIZE];

          if (distance > 0) {
            factor = coefficient *
              NodeMatrix[n1 + NODE_MASS] *
              NodeMatrix[n2 + NODE_MASS] /
              distance / distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] += xDist * factor;
            NodeMatrix[n2 + NODE_DY] += yDist * factor;
          }
          else if (distance < 0) {
            factor = 100 * coefficient *
              NodeMatrix[n1 + NODE_MASS] *
              NodeMatrix[n2 + NODE_MASS];

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        }
        else {

          //-- Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            factor = coefficient *
              NodeMatrix[n1 + NODE_MASS] *
              NodeMatrix[n2 + NODE_MASS] /
              distance / distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        }
      }
    }
  }


  // 3) Gravity
  //------------
  g = options.gravity / options.scalingRatio;
  coefficient = options.scalingRatio;
  for (n = 0; n < order; n += PPN) {
    factor = 0;

    // Common to both methods
    xDist = NodeMatrix[n + NODE_X];
    yDist = NodeMatrix[n + NODE_Y];
    distance = Math.sqrt(
      Math.pow(xDist, 2) + Math.pow(yDist, 2)
    );

    if (options.strongGravityMode) {

      //-- Strong gravity
      if (distance > 0)
        factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
    }
    else {

      //-- Linear Anti-collision Repulsion n
      if (distance > 0)
        factor = coefficient * NodeMatrix[n + NODE_MASS] * g / distance;
    }

    // Updating node's dx and dy
    NodeMatrix[n + NODE_DX] -= xDist * factor;
    NodeMatrix[n + NODE_DY] -= yDist * factor;
  }

  // 4) Attraction
  //---------------
  coefficient = 1 *
    (options.outboundAttractionDistribution ?
      outboundAttCompensation :
      1);

  // TODO: simplify distance
  // TODO: coefficient is always used as -c --> optimize?
  for (e = 0; e < size; e += PPE) {
    n1 = EdgeMatrix[e + EDGE_SOURCE];
    n2 = EdgeMatrix[e + EDGE_TARGET];
    w = EdgeMatrix[e + EDGE_WEIGHT];

    // Edge weight influence
    ewc = Math.pow(w, options.edgeWeightInfluence);

    // Common measures
    xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
    yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

    // Applying attraction to nodes
    if (options.adjustSizes) {

      distance = Math.sqrt(
        (Math.pow(xDist, 2) + Math.pow(yDist, 2)) -
        NodeMatrix[n1 + NODE_SIZE] -
        NodeMatrix[n2 + NODE_SIZE]
      );

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {

          //-- LinLog Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) /
            distance /
            NodeMatrix[n1 + NODE_MASS];
          }
        }
        else {

          //-- LinLog Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) / distance;
          }
        }
      }
      else {
        if (options.outboundAttractionDistribution) {

          //-- Linear Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
          }
        }
        else {

          //-- Linear Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc;
          }
        }
      }
    }
    else {

      distance = Math.sqrt(
        Math.pow(xDist, 2) + Math.pow(yDist, 2)
      );

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {

          //-- LinLog Degree Distributed Attraction
          if (distance > 0) {
            factor = -coefficient * ewc * Math.log(1 + distance) /
              distance /
              NodeMatrix[n1 + NODE_MASS];
          }
        }
        else {

          //-- LinLog Attraction
          if (distance > 0)
            factor = -coefficient * ewc * Math.log(1 + distance) / distance;
        }
      }
      else {
        if (options.outboundAttractionDistribution) {

          //-- Linear Attraction Mass Distributed
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];
        }
        else {

          //-- Linear Attraction
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc;
        }
      }
    }

    // Updating nodes' dx and dy
    // TODO: if condition or factor = 1?
    if (distance > 0) {

      // Updating nodes' dx and dy
      NodeMatrix[n1 + NODE_DX] += xDist * factor;
      NodeMatrix[n1 + NODE_DY] += yDist * factor;

      NodeMatrix[n2 + NODE_DX] -= xDist * factor;
      NodeMatrix[n2 + NODE_DY] -= yDist * factor;
    }
  }


  // 5) Apply Forces
  //-----------------
  var force,
      swinging,
      traction,
      nodespeed;

  // MATH: sqrt and square distances
  if (options.adjustSizes) {

    for (n = 0; n < order; n += PPN) {
      if (!NodeMatrix[n + NODE_FIXED]) {
        force = Math.sqrt(
          Math.pow(NodeMatrix[n + NODE_DX], 2) +
          Math.pow(NodeMatrix[n + NODE_DY], 2)
        );

        if (force > MAX_FORCE) {
          NodeMatrix[n + NODE_DX] =
            NodeMatrix[n + NODE_DX] * MAX_FORCE / force;
          NodeMatrix[n + NODE_DY] =
            NodeMatrix[n + NODE_DY] * MAX_FORCE / force;
        }

        swinging = NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction = Math.sqrt(
          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
        ) / 2;

        nodespeed =
          0.1 * Math.log(1 + traction) / (1 + Math.sqrt(swinging));

        // Updating node's positon
        NodeMatrix[n + NODE_X] =
          NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] *
          (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] =
          NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] *
          (nodespeed / options.slowDown);
      }
    }
  }
  else {

    for (n = 0; n < order; n += PPN) {
      if (!NodeMatrix[n + NODE_FIXED]) {

        swinging = NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction = Math.sqrt(
          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
        ) / 2;

        nodespeed = NodeMatrix[n + NODE_CONVERGENCE] *
          Math.log(1 + traction) / (1 + Math.sqrt(swinging));

        // Updating node convergence
        NodeMatrix[n + NODE_CONVERGENCE] =
          Math.min(1, Math.sqrt(
            nodespeed *
            (Math.pow(NodeMatrix[n + NODE_DX], 2) +
             Math.pow(NodeMatrix[n + NODE_DY], 2)) /
            (1 + Math.sqrt(swinging))
          ));

        // Updating node's positon
        NodeMatrix[n + NODE_X] =
          NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] *
          (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] =
          NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] *
          (nodespeed / options.slowDown);
      }
    }
  }

  // We return the information about the layout (no need to return the matrices)
  return {};
};


/***/ }),
/* 198 */
/***/ (function(module, exports) {

/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Constants.
 */
var PPN = 10,
    PPE = 3;

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
exports.assign = function(target) {
  target = target || {};

  var objects = Array.prototype.slice.call(arguments).slice(1),
      i,
      k,
      l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i])
      continue;

    for (k in objects[i])
      target[k] = objects[i][k];
  }

  return target;
};

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */
exports.validateSettings = function(settings) {

  if ('linLogMode' in settings &&
      typeof settings.linLogMode !== 'boolean')
    return {message: 'the `linLogMode` setting should be a boolean.'};

  if ('outboundAttractionDistribution' in settings &&
      typeof settings.outboundAttractionDistribution !== 'boolean')
    return {message: 'the `outboundAttractionDistribution` setting should be a boolean.'};

  if ('adjustSizes' in settings &&
      typeof settings.adjustSizes !== 'boolean')
    return {message: 'the `adjustSizes` setting should be a boolean.'};

  if ('edgeWeightInfluence' in settings &&
      typeof settings.edgeWeightInfluence !== 'number' &&
      settings.edgeWeightInfluence < 0)
    return {message: 'the `edgeWeightInfluence` setting should be a number >= 0.'};

  if ('scalingRatio' in settings &&
      typeof settings.scalingRatio !== 'number' &&
      settings.scalingRatio < 0)
    return {message: 'the `scalingRatio` setting should be a number >= 0.'};

  if ('strongGravityMode' in settings &&
      typeof settings.strongGravityMode !== 'boolean')
    return {message: 'the `strongGravityMode` setting should be a boolean.'};

  if ('gravity' in settings &&
      typeof settings.gravity !== 'number' &&
      settings.gravity < 0)
    return {message: 'the `gravity` setting should be a number >= 0.'};

  if ('slowDown' in settings &&
      typeof settings.slowDown !== 'number' &&
      settings.slowDown < 0)
    return {message: 'the `slowDown` setting should be a number >= 0.'};

  if ('barnesHutOptimize' in settings &&
      typeof settings.barnesHutOptimize !== 'boolean')
    return {message: 'the `barnesHutOptimize` setting should be a boolean.'};

  if ('barnesHutTheta' in settings &&
      typeof settings.barnesHutTheta !== 'number' &&
      settings.barnesHutTheta < 0)
    return {message: 'the `barnesHutTheta` setting should be a number >= 0.'};

  return null;
};

/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {object}       - Both matrices.
 */
exports.graphToByteArrays = function(graph) {
  var nodes = graph.nodes(),
      edges = graph.edges(),
      order = nodes.length,
      size = edges.length,
      index = {},
      i,
      j;

  var NodeMatrix = new Float32Array(order * PPN),
      EdgeMatrix = new Float32Array(size * PPE);

  // Iterate through nodes
  for (i = j = 0; i < order; i++) {

    // Node index
    index[nodes[i]] = j;

    // Populating byte array
    NodeMatrix[j] = graph.getNodeAttribute(nodes[i], 'x');
    NodeMatrix[j + 1] = graph.getNodeAttribute(nodes[i], 'y');
    NodeMatrix[j + 2] = 0;
    NodeMatrix[j + 3] = 0;
    NodeMatrix[j + 4] = 0;
    NodeMatrix[j + 5] = 0;
    NodeMatrix[j + 6] = 1 + graph.degree(nodes[i]);
    NodeMatrix[j + 7] = 1;
    NodeMatrix[j + 8] = graph.getNodeAttribute(nodes[i], 'size') || 1;
    NodeMatrix[j + 9] = 0;
    j += PPN;
  }

  // Iterate through edges
  for (i = j = 0; i < size; i++) {

    // Populating byte array
    EdgeMatrix[j] = index[graph.source(edges[i])];
    EdgeMatrix[j + 1] = index[graph.target(edges[i])];
    EdgeMatrix[j + 2] = graph.getEdgeAttribute(edges[i], 'weight') || 0;
    j += PPE;
  }

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
};

/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */
exports.applyLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes();

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    graph.setNodeAttribute(nodes[j], 'x', NodeMatrix[i]);
    graph.setNodeAttribute(nodes[j], 'y', NodeMatrix[i + 1]);
    j++;
  }
};

/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}        graph      - Target graph.
 * @param  {Float32Array} NodeMatrix - Node matrix.
 * @return {object}                  - Map to node positions.
 */
exports.collectLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes(),
      positions = Object.create(null);

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    positions[nodes[j]] = {
      x: NodeMatrix[i],
      y: NodeMatrix[i + 1]
    };

    j++;
  }

  return positions;
};


/***/ }),
/* 199 */
/***/ (function(module, exports) {

/**
 * Graphology ForceAtlas2 Layout Default Settings
 * ===============================================
 */
module.exports = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 0,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: false,
  barnesHutTheta: 0.5
};


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(201);


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Metrics
 * ===================
 *
 * Library endpoint.
 */
exports.centrality = __webpack_require__(202);
exports.density = __webpack_require__(55);
exports.extent = __webpack_require__(61);
exports.modularity = __webpack_require__(209);
exports.weightedDegree = __webpack_require__(210);
exports.weightedSize = __webpack_require__(211);


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Metrics Centrality
 * ==============================
 *
 * Sub module endpoint.
 */
exports.betweenness = __webpack_require__(203);
exports.degree = __webpack_require__(208);


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Betweenness Centrality
 * ==================================
 *
 * Function computing betweenness centrality.
 */
var isGraph = __webpack_require__(0),
    unweightedShortestPath = __webpack_require__(57),
    dijkstraShotestPath = __webpack_require__(59),
    defaults = __webpack_require__(60);

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    centrality: 'beetweennessCentrality',
    weight: 'weight'
  },
  normalized: true,
  weighted: false
};

/**
 * Abstract function computing beetweenness centrality for the given graph.
 *
 * @param  {boolean} assign           - Assign the results to node attributes?
 * @param  {Graph}   graph            - Target graph.
 * @param  {object}  [options]        - Options:
 * @param  {object}    [attributes]   - Attribute names:
 * @param  {string}      [weight]     - Name of the weight attribute.
 * @param  {string}      [centrality] - Name of the attribute to assign.
 * @param  {boolean} [normalized]     - Should the centrality be normalized?
 * @param  {boolean} [weighted]       - Weighted graph?
 * @param  {object}
 */
function abstractBetweennessCentrality(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-centrality/beetweenness-centrality: the given graph is not a valid graphology instance.');

  var centralities = {};

  // Solving options
  options = defaults({}, options, DEFAULTS);

  var weightAttribute = options.attributes.weight,
      centralityAttribute = options.attributes.centrality,
      normalized = options.normalized,
      weighted = options.weighted;

  var shortestPath = weighted ?
    dijkstraShotestPath.brandes :
    unweightedShortestPath.brandes;

  var nodes = graph.nodes(),
      node,
      result,
      S,
      P,
      sigma,
      delta,
      coefficient,
      i,
      j,
      l,
      m,
      v,
      w;

  // Initializing centralities
  for (i = 0, l = nodes.length; i < l; i++)
    centralities[nodes[i]] = 0;

  // Iterating over each node
  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];

    result = shortestPath(graph, node, weightAttribute);

    S = result[0];
    P = result[1];
    sigma = result[2];

    delta = {};

    // Accumulating
    for (j = 0, m = S.length; j < m; j++)
      delta[S[j]] = 0;

    while (S.length) {
      w = S.pop();
      coefficient = (1 + delta[w]) / sigma[w];

      for (j = 0, m = P[w].length; j < m; j++) {
        v = P[w][j];
        delta[v] += sigma[v] * coefficient;
      }

      if (w !== node)
        centralities[w] += delta[w];
    }
  }

  // Rescaling
  var n = graph.order,
      scale = null;

  if (normalized)
    scale = n <= 2 ? null : (1 / ((n - 1) * (n - 2)));
  else
    scale = graph.type === 'undirected' ? 0.5 : null;

  if (scale !== null) {
    for (node in centralities)
      centralities[node] *= scale;
  }

  if (assign) {
    for (node in centralities)
      graph.setNodeAttribute(node, centralityAttribute, centralities[node]);
  }

  return centralities;
}

/**
 * Exporting.
 */
var beetweennessCentrality = abstractBetweennessCentrality.bind(null, false);
beetweennessCentrality.assign = abstractBetweennessCentrality.bind(null, true);

module.exports = beetweennessCentrality;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Mnemonist Queue
 * ================
 *
 * Queue implementation based on the ideas of Queue.js that seems to beat
 * a LinkedList one in performance.
 */
var Iterator = __webpack_require__(12),
    iterate = __webpack_require__(58);

/**
 * Queue
 *
 * @constructor
 */
function Queue() {
  this.clear();
}

/**
 * Method used to clear the queue.
 *
 * @return {undefined}
 */
Queue.prototype.clear = function() {

  // Properties
  this.items = [];
  this.offset = 0;
  this.size = 0;
};

/**
 * Method used to add an item to the queue.
 *
 * @param  {any}    item - Item to enqueue.
 * @return {number}
 */
Queue.prototype.enqueue = function(item) {

  this.items.push(item);
  return ++this.size;
};

/**
 * Method used to retrieve & remove the first item of the queue.
 *
 * @return {any}
 */
Queue.prototype.dequeue = function() {
  if (!this.size)
    return;

  var item = this.items[this.offset];

  if (++this.offset * 2 >= this.items.length) {
    this.items = this.items.slice(this.offset);
    this.offset = 0;
  }

  this.size--;

  return item;
};

/**
 * Method used to retrieve the first item of the queue.
 *
 * @return {any}
 */
Queue.prototype.peek = function() {
  if (!this.size)
    return;

  return this.items[this.offset];
};

/**
 * Method used to iterate over the queue.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
Queue.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = this.offset, j = 0, l = this.items.length; i < l; i++, j++)
    callback.call(scope, this.items[i], j, this);
};

/*
 * Method used to convert the queue to a JavaScript array.
 *
 * @return {array}
 */
Queue.prototype.toArray = function() {
  return this.items.slice(this.offset);
};

/**
 * Method used to create an iterator over a queue's values.
 *
 * @return {Iterator}
 */
Queue.prototype.values = function() {
  var items = this.items,
      i = this.offset;

  return new Iterator(function() {
    if (i >= items.length)
      return {
        done: true
      };

    var value = items[i];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a queue's entries.
 *
 * @return {Iterator}
 */
Queue.prototype.entries = function() {
  var items = this.items,
      i = this.offset,
      j = 0;

  return new Iterator(function() {
    if (i >= items.length)
      return {
        done: true
      };

    var value = items[i];
    i++;

    return {
      value: [j++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Queue.prototype[Symbol.iterator] = Queue.prototype.values;

/**
 * Convenience known methods.
 */
Queue.prototype.toString = function() {
  return this.toArray().join(',');
};

Queue.prototype.toJSON = function() {
  return this.toArray();
};

Queue.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: Queue,
    enumerable: false
  });

  return array;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a queue.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Queue}
 */
Queue.from = function(iterable) {
  var queue = new Queue();

  iterate(iterable, function(value) {
    queue.enqueue(value);
  });

  return queue;
};

/**
 * Static @.of function taking an abitrary number of arguments & converting it
 * into a queue.
 *
 * @param  {...any} args
 * @return {Queue}
 */
Queue.of = function() {
  return Queue.from(arguments);
};

/**
 * Exporting.
 */
module.exports = Queue;


/***/ }),
/* 205 */
/***/ (function(module, exports) {

/**
 * Mnemonist Typed Array Helpers
 * ==============================
 *
 * Miscellaneous helpers related to typed arrays.
 */

/**
 * When using an unsigned integer array to store pointers, one might want to
 * choose the optimal word size in regards to the actual numbers of pointers
 * to store.
 *
 * This helpers does just that.
 *
 * @param  {number} size - Expected size of the array to map.
 * @return {TypedArray}
 */
var MAX_8BIT_INTEGER = Math.pow(2, 8) - 1,
    MAX_16BIT_INTEGER = Math.pow(2, 16) - 1,
    MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;

exports.getPointerArray = function(size) {
  var maxIndex = size - 1;

  if (maxIndex <= MAX_8BIT_INTEGER)
    return Uint8Array;

  if (maxIndex <= MAX_16BIT_INTEGER)
    return Uint16Array;

  if (maxIndex <= MAX_32BIT_INTEGER)
    return Uint32Array;

  return Float64Array;
};

/**
 * Function returning the minimal type able to represent the given number.
 *
 * @param  {number} value - Value to test.
 * @return {TypedArrayClass}
 */
exports.getNumberType = function(value) {

  // <= 32 bits itnteger?
  if (value === (value | 0)) {

    // Negative
    if (Math.sign(value) === -1) {
      if (value <= 127 && value >= -128)
        return Int8Array;

      if (value <= 32767 && value >= -32768)
        return Int16Array;

      return Int32Array;
    }
    else {

      if (value <= 255)
        return Uint8Array;

      if (value <= 65535)
        return Uint16Array;

      return Uint32Array;
    }
  }

  // 53 bits integer & floats
  // NOTE: it's kinda hard to tell whether we could use 32bits or not...
  return Float64Array;
};

/**
 * Function returning the minimal type able to represent the given array
 * of JavaScript numbers.
 *
 * @param  {array}    array  - Array to represent.
 * @param  {function} getter - Optional getter.
 * @return {TypedArrayClass}
 */
var TYPE_PRIORITY = {
  Uint8Array: 1,
  Int8Array: 2,
  Uint16Array: 3,
  Int16Array: 4,
  Uint32Array: 5,
  Int32Array: 6,
  Float32Array: 7,
  Float64Array: 8
};

// TODO: make this a one-shot for one value
exports.getMinimalRepresentation = function(array, getter) {
  var maxType = null,
      maxPriority = 0,
      p,
      t,
      v,
      i,
      l;

  for (i = 0, l = array.length; i < l; i++) {
    v = getter ? getter(array[i]) : array[i];
    t = exports.getNumberType(v);
    p = TYPE_PRIORITY[t.name];

    if (p > maxPriority) {
      maxPriority = p;
      maxType = t;
    }
  }

  return maxType;
};

/**
 * Function returning whether the given value is a typed array.
 *
 * @param  {any} value - Value to test.
 * @return {boolean}
 */
exports.isTypedArray = function(value) {
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(value);
};

/**
 * Function used to concat byte arrays.
 *
 * @param  {...ByteArray}
 * @return {ByteArray}
 */
exports.concat = function() {
  var length = 0,
      i,
      o,
      l;

  for (i = 0, l = arguments.length; i < l; i++)
    length += arguments[i].length;

  var array = new (arguments[0].constructor)(length);

  for (i = 0, o = 0; i < l; i++) {
    array.set(arguments[i], o);
    o += arguments[i].length;
  }

  return array;
};


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Mnemonist Binary Heap
 * ======================
 *
 * Binary heap implementation.
 */
var comparators = __webpack_require__(207),
    iterate = __webpack_require__(58);

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    reverseComparator = comparators.reverseComparator;

/**
 * Binary Minimum Heap.
 *
 * @constructor
 */
function Heap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/Heap.constructor: given comparator should be a function.');
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
Heap.prototype.clear = function() {

  // Properties
  this.items = [];
  this.size = 0;
};

/**
 * Function used to bubble up.
 *
 * @param {function} compare - Comparator function.
 * @param {array}    data    - Data to edit.
 * @param {number}   index   - Target index.
 */
function bubbleUp(compare, items, index) {
  // Item needing to be moved
  var item = items[index],
      parentIndex = ((index - 1) / 2) | 0;

  // Iterating
  while (index > 0 && compare(items[parentIndex], item) > 0) {
    items[index] = items[parentIndex];
    items[parentIndex] = item;
    index = parentIndex;
    parentIndex = ((index - 1) / 2) | 0;
  }
}

/**
 * Function used to sink down.
 *
 * @param {function} compare - Comparator function.
 * @param {array}    data    - Data to edit.
 * @param {number}   index   - Target index.
 */
function sinkDown(compare, items, index) {
  var size = items.length,
      item = items[index],
      left = 2 * index + 1,
      right = 2 * index + 2,
      min;

  if (right >= size) {
    if (left >= size)
      min = -1;
    else
      min = left;
  }
  else if (compare(items[left], items[right]) <= 0) {
    min = left;
  }
  else {
    min = right;
  }

  while (min >= 0 && compare(items[index], items[min]) > 0) {
    items[index] = items[min];
    items[min] = item;
    index = min;

    left = 2 * index + 1;
    right = 2 * index + 2;

    if (right >= size) {
      if (left >= size)
        min = -1;
      else
        min = left;
    }
    else if (compare(items[left], items[right]) <= 0) {
      min = left;
    }
    else {
      min = right;
    }
  }
}

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
Heap.prototype.push = function(item) {
  this.items.push(item);
  bubbleUp(this.comparator, this.items, this.size);
  return ++this.size;
};

/**
 * Method used to retrieve the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.peek = function() {
  return this.items[0];
};

/**
 * Method used to retrieve & remove the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.pop = function() {
  if (!this.size)
    return undefined;

  var item = this.items[0],
      last = this.items.pop();

  this.size--;

  if (this.size) {
    this.items[0] = last;
    sinkDown(this.comparator, this.items, 0);
  }

  return item;
};

/**
 * Convenience known methods.
 */
Heap.prototype.inspect = function() {
  var proxy = {
    size: this.size
  };

  if (this.items.length)
    proxy.top = this.items[0];

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: Heap,
    enumerable: false
  });

  return proxy;
};

/**
 * Binary Maximum Heap.
 *
 * @constructor
 */
function MaxHeap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/Heap.constructor: given comparator should be a function.');

  this.comparator = reverseComparator(this.comparator);
}

MaxHeap.prototype = Heap.prototype;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a heap.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} comparator - Custom comparator function.
 * @return {Heap}
 */
Heap.from = function(iterable, comparator) {
  var heap = new Heap(comparator);

  iterate(iterable, function(value) {
    heap.push(value);
  });

  return heap;
};

MaxHeap.from = function(iterable, comparator) {
  var heap = new MaxHeap(comparator);

  iterate(iterable, function(value) {
    heap.push(value);
  });

  return heap;
};

/**
 * Exporting.
 */
Heap.MinHeap = Heap;
Heap.MaxHeap = MaxHeap;
module.exports = Heap;


/***/ }),
/* 207 */
/***/ (function(module, exports) {

/**
 * Mnemonist Heap Comparators
 * ===========================
 *
 * Default comparators & functions dealing with comparators reversing etc.
 */
var DEFAULT_COMPARATOR = function(a, b) {
  if (a < b)
    return -1;
  if (a > b)
    return 1;

  return 0;
};

/**
 * Function used to reverse a comparator.
 */
function reverseComparator(comparator) {
  return function(a, b) {
    return comparator(b, a);
  };
}

/**
 * Exporting.
 */
exports.DEFAULT_COMPARATOR = DEFAULT_COMPARATOR;
exports.reverseComparator = reverseComparator;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Degree Centrality
 * =============================
 *
 * Function computing degree centrality.
 */
var isGraph = __webpack_require__(0);

/**
 * Asbtract function to perform any kind of degree centrality.
 *
 * Intuitively, the degree centrality of a node is the fraction of nodes it
 * is connected to.
 *
 * @param  {boolean} assign        - Whether to assign the result to the nodes.
 * @param  {string}  method        - Method of the graph to get the degree.
 * @param  {Graph}   graph         - A graphology instance.
 * @param  {object}  [options]     - Options:
 * @param  {string}    [attribute] - Name of the attribute to assign.
 * @return {object|void}
 */
function abstractDegreeCentrality(assign, method, graph, options) {
  var name = method + 'Centrality';

  if (!isGraph(graph))
    throw new Error('graphology-centrality/' + name + ': the given graph is not a valid graphology instance.');

  if (method !== 'degree' && graph.type === 'undirected')
    throw new Error('graphology-centrality/' + name + ': cannot compute ' + method + ' centrality on an undirected graph.');

  // Solving options
  options = options || {};

  var attribute = options.attribute || name;

  // Variables
  var order = graph.order,
      nodes = graph.nodes(),
      getDegree = graph[method].bind(graph),
      centralities = {};

  if (order === 0)
    return assign ? undefined : centralities;

  var s = 1 / (order - 1);

  // Iteration variables
  var node,
      centrality,
      i;

  for (i = 0; i < order; i++) {
    node = nodes[i];
    centrality = getDegree(node) * s;

    if (assign)
      graph.setNodeAttribute(node, attribute, centrality);
    else
      centralities[node] = centrality;
  }

  return assign ? undefined : centralities;
}

/**
 * Building various functions to export.
 */
var degreeCentrality = abstractDegreeCentrality.bind(null, false, 'degree'),
    inDegreeCentrality = abstractDegreeCentrality.bind(null, false, 'inDegree'),
    outDegreeCentrality = abstractDegreeCentrality.bind(null, false, 'outDegree');

degreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'degree');
inDegreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'inDegree');
outDegreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'outDegree');

/**
 * Exporting.
 */
degreeCentrality.degreeCentrality = degreeCentrality;
degreeCentrality.inDegreeCentrality = inDegreeCentrality;
degreeCentrality.outDegreeCentrality = outDegreeCentrality;
module.exports = degreeCentrality;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Modularity
 * ======================
 *
 * Notes:
 * The following code is taken from Gephi and Gephi doesn't consider directed
 * edges:
 *
 * Directed edges produces the same modularity as if they were undirected
 *   - if there are a->b and b->a : consider a<->b
 *   - if there is a-> only or b->a only : consider ALSO a<->b
 *   - if there are a->b , b->a with differents weights, only one is considered
 *
 * The order chosen by Gephi is unknown, it is a sensitive case and is not
 * handled.
 *
 * Self-loops are not considered at all, not in the total weights, not in the
 * computing part (remove them and it will be the same modularity score).
 */
var defaults = __webpack_require__(19),
    isGraph = __webpack_require__(0);

var DEFAULTS = {
  attributes: {
    community: 'community',
    weight: 'weight'
  }
};

/**
 * Function returning the modularity of the given graph.
 *
 * @param  {Graph}  graph         - Target graph.
 * @param  {object} options       - Options:
 * @param  {object}   communities - Communities mapping.
 * @param  {object}   attributes  - Attribute names:
 * @param  {string}     community - Name of the community attribute.
 * @param  {string}     weight    - Name of the weight attribute.
 * @return {number}
 */
function modularity(graph, options) {

  // Handling errors
  if (!isGraph(graph))
    throw new Error('graphology-metrics/modularity: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-metrics/modularity: multi graphs are not handled.');

  if (!graph.size)
    throw new Error('graphology-metrics/modularity: the given graph has no edges.');

  // Solving options
  options = defaults({}, options, DEFAULTS);

  var communities,
      nodes = graph.nodes(),
      edges = graph.edges(),
      i,
      l;

  // Do we have a community mapping?
  if (typeof options.communities === 'object') {
    communities = options.communities;
  }

  // Else we need to extract it from the graph
  else {
    communities = {};

    for (i = 0, l = nodes.length; i < l; i++)
      communities[nodes[i]] = graph.getNodeAttribute(nodes[i], options.attributes.community);
  }

  var M = 0,
      Q = 0,
      internalW = {},
      totalW = {},
      bounds,
      node1, node2, edge,
      community1, community2,
      w, weight;

  for (i = 0, l = edges.length; i < l; i++) {
    edge = edges[i];
    bounds = graph.extremities(edge);
    node1 = bounds[0];
    node2 = bounds[1];

    if (node1 === node2)
      continue;

    community1 = communities[node1];
    community2 = communities[node2];

    if (community1 === undefined)
      throw new Error('graphology-metrics/modularity: the "' + node1 + '" node is not in the partition.');

    if (community2 === undefined)
      throw new Error('graphology-metrics/modularity: the "' + node2 + '" node is not in the partition.');

    w = graph.getEdgeAttribute(edge, options.attributes.weight);
    weight = isNaN(w) ? 1 : w;

    totalW[community1] = (totalW[community1] || 0) + weight;
    if (graph.undirected(edge) || !graph.hasDirectedEdge(node2, node1)) {
      totalW[community2] = (totalW[community2] || 0) + weight;
      M += 2 * weight;
    }
    else {
      M += weight;
    }

    if (!graph.hasDirectedEdge(node2, node1))
      weight *= 2;

    if (community1 === community2)
      internalW[community1] = (internalW[community1] || 0) + weight;
  }

  for (community1 in totalW)
    Q += ((internalW[community1] || 0) - (totalW[community1] * totalW[community1] / M));

  return Q / M;
}

module.exports = modularity;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Weighted Degree
 * ===========================
 *
 * Function computing the weighted degree of nodes. The weighted degree is the
 * sum of a node's edges' weights.
 */
var isGraph = __webpack_require__(0);

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * Asbtract function to perform any kind of weighted degree.
 *
 * Signature n°1 - computing weighted degree for every node:
 *
 * @param  {string}  name            - Name of the implemented function.
 * @param  {boolean} assign          - Whether to assign the result to the nodes.
 * @param  {string}  method          - Method of the graph to get the edges.
 * @param  {Graph}   graph           - A graphology instance.
 * @param  {object}  [options]       - Options:
 * @param  {object}    [attributes]    - Custom attribute names:
 * @param  {string}      [weight]         - Name of the weight attribute.
 * @param  {string}      [weightedDegree] - Name of the attribute to set.
 * @param  {boolean}   [averaged]      - Return averaged weighted degree?
 *
 * Signature n°2 - computing weighted degree for a single node:
 *
 * @param  {string}  name            - Name of the implemented function.
 * @param  {boolean} assign          - Whether to assign the result to the nodes.
 * @param  {string}  edgeGetter      - Graph's method used to get edges.
 * @param  {Graph}   graph           - A graphology instance.
 * @param  {any}     node            - Key of node.
 * @param  {object}  [options]       - Options:
 * @param  {object}    [attributes]    - Custom attribute names:
 * @param  {string}      [weight]         - Name of the weight attribute.
 * @param  {string}      [weightedDegree] - Name of the attribute to set.
 * @param  {boolean}   [averaged]      - Return averaged weighted degrees?
 *
 * @return {object|void}
 */
function abstractWeightedDegree(name, assign, edgeGetter, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/' + name + ': the given graph is not a valid graphology instance.');

  if (edgeGetter !== 'edges' && graph.type === 'undirected')
    throw new Error('graphology-metrics/' + name + ': cannot compute ' + name + ' on an undirected graph.');

  var singleNode = null;

  // Solving arguments
  if (arguments.length === 5 && typeof arguments[4] !== 'object') {
    singleNode = arguments[4];
  }
  else if (arguments.length === 6) {
    singleNode = arguments[4];
    options = arguments[5];
  }

  // Solving options
  options = options || {};

  var attributes = options.attributes || {};

  var weightAttribute = attributes.weight || DEFAULT_WEIGHT_ATTRIBUTE,
      weightedDegreeAttribute = attributes.weightedDegree || name;

  var averaged = options.averaged === true;

  var edges,
      d,
      W,
      w,
      i,
      l;

  // Computing weighted degree for a single node
  if (singleNode) {
    edges = graph[edgeGetter](singleNode);
    d = 0;

    for (i = 0, l = edges.length; i < l; i++) {
      w = graph.getEdgeAttribute(edges[i], weightAttribute);

      if (typeof w === 'number')
        d += w;
    }

    if (averaged)
      d /= l || 1;

    if (assign) {
      graph.setNodeAttribute(singleNode, weightedDegreeAttribute, d);
      return;
    }
    else {
      return d;
    }
  }

  // Computing weighted degree for every node
  // TODO: it might be more performant to iterate on the edges here.
  var nodes = graph.nodes(),
      node,
      weightedDegrees = {},
      j,
      m;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    edges = graph[edgeGetter](node);
    d = 0;

    for (j = 0, m = edges.length; j < m; j++) {
      w = graph.getEdgeAttribute(edges[j], weightAttribute);

      if (typeof w === 'number')
        d += w;
    }

    if (averaged)
      d /= m || 1;

    if (assign)
      graph.setNodeAttribute(node, weightedDegreeAttribute, d);
    else
      weightedDegrees[node] = d;
  }

  if (!assign)
    return weightedDegrees;
}

/**
 * Building various functions to export.
 */
var weightedDegree = abstractWeightedDegree.bind(null, 'weightedDegree', false, 'edges'),
    weightedInDegree = abstractWeightedDegree.bind(null, 'weightedInDegree', false, 'inEdges'),
    weightedOutDegree = abstractWeightedDegree.bind(null, 'weightedOutDegree', false, 'outEdges');

weightedDegree.assign = abstractWeightedDegree.bind(null, 'weightedDegree', true, 'edges');
weightedInDegree.assign = abstractWeightedDegree.bind(null, 'weightedInDegree', true, 'inEdges');
weightedOutDegree.assign = abstractWeightedDegree.bind(null, 'weightedOutDegree', true, 'outEdges');

/**
 * Exporting.
 */
weightedDegree.weightedDegree = weightedDegree;
weightedDegree.weightedInDegree = weightedInDegree;
weightedDegree.weightedOutDegree = weightedOutDegree;
module.exports = weightedDegree;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Weighted Size
 * =========================
 *
 * Function returning the sum of the graph's edges' weights.
 */
var isGraph = __webpack_require__(0);

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * Weighted size function.
 *
 * @param  {Graph}  graph             - Target graph.
 * @param  {string} [weightAttribute] - Name of the weight attribute.
 * @return {number}
 */
module.exports = function weightedSize(graph, weightAttribute) {

  // Handling errors
  if (!isGraph(graph))
    throw new Error('graphology-metrics/weighted-size: the given graph is not a valid graphology instance.');

  weightAttribute = weightAttribute || DEFAULT_WEIGHT_ATTRIBUTE;

  var edges = graph.edges(),
      W = 0,
      w,
      i,
      l;

  for (i = 0, l = edges.length; i < l; i++) {
    w = graph.getEdgeAttribute(edges[i], weightAttribute);

    if (typeof w === 'number')
      W += w;
  }

  return W;
}


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(213);


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Operators
 * =====================
 *
 * Library endpoint.
 */
exports.reverse = __webpack_require__(214);
exports.union = __webpack_require__(215);


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Revers Operator
 * ===========================
 */
var isGraph = __webpack_require__(0);

/**
 * Function reversing the given graph.
 *
 * @param  {Graph} graph - Target graph.
 * @return {Graph}
 */
module.exports = function reverse(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/reverse: invalid graph.');

  var reversed = graph.emptyCopy();

  // Importing the nodes
  reversed.importNodes(graph.exportNodes());

  // Importing undirected edges
  reversed.importEdges(graph.exportUndirectedEdges());

  // Reversing directed edges
  var edges = graph.directedEdges(),
      edge,
      source,
      i,
      l;

  for (i = 0, l = edges.length; i < l; i++) {
    edge = graph.exportEdge(edges[i]);
    source = edge.source;
    edge.source = edge.target;
    edge.target = source;

    reversed.importEdge(edge);
  }

  return reversed;
};


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Union Operator
 * ==========================
 */
var isGraph = __webpack_require__(0);

/**
 * Function returning the union of two given graphs.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function union(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/union: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error('graphology-operators/union: both graph should be simple or multi.');

  var R = G.copy();
  R.import(H, true);

  return R;
};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(217);


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Pagerank
 * ====================
 *
 * JavaScript implementation of the pagerank algorithm for graphology.
 *
 * [Reference]:
 * Page, Lawrence; Brin, Sergey; Motwani, Rajeev and Winograd, Terry,
 * The PageRank citation ranking: Bringing order to the Web. 1999
 */
var isGraph = __webpack_require__(0),
    defaults = __webpack_require__(60);

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    pagerank: 'pagerank',
    weight: 'weight'
  },
  alpha: 0.85,
  maxIterations: 100,
  tolerance: 1e-6,
  weighted: false
};

/**
 * Abstract function applying the pagerank algorithm to the given graph.
 *
 * @param  {boolean}  assign        - Should we assign the result to nodes.
 * @param  {Graph}    graph         - Target graph.
 * @param  {?object}  option        - Options:
 * @param  {?object}    attributes  - Custom attribute names:
 * @param  {?string}      pagerank  - Name of the pagerank attribute to assign.
 * @param  {?string}      weight    - Name of the weight algorithm.
 * @param  {?number}  alpha         - Damping parameter.
 * @param  {?number}  maxIterations - Maximum number of iterations to perform.
 * @param  {?number}  tolerance     - Error tolerance when checking for convergence.
 * @param  {?boolean} weighted      - Should we use the graph's weights.
 * @return {object|undefined}
 */
function abstractPagerank(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-pagerank: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-pagerank: the pagerank algorithm does not work with MultiGraphs.');

  options = defaults(options, DEFAULTS);

  var pagerankAttribute = options.attributes.pagerank,
      weightAttribute = options.attributes.weight,
      alpha = options.alpha,
      maxIterations = options.maxIterations,
      tolerance = options.tolerance,
      weighted = options.weighted;

  var N = graph.order,
      p = 1 / N,
      x = {};

  var danglingNodes = [];

  var nodes = graph.nodes(),
      edges,
      weights = {},
      degrees = {},
      weight,
      iteration = 0,
      dangleSum,
      xLast,
      neighbor,
      error,
      d,
      k,
      n,
      e,
      i,
      j,
      l,
      m;

  // Initialization
  for (i = 0; i < N; i++) {
    n = nodes[i];
    x[n] = p;

    if (weighted) {

      // Here, we need to factor in edges' weight
      d = 0;

      edges = graph
        .undirectedEdges()
        .concat(graph.outEdges(n));

      for (j = 0, m = edges.length; j < m; j++) {
        e = edges[j];
        d += graph.getEdgeAttribute(e, weightAttribute) || 1;
      }
    }
    else {
      d = graph.undirectedDegree(n) + graph.outDegree(n);
    }

    degrees[n] = d;

    if (d === 0)
      danglingNodes.push(n);
  }

  // Precompute normalized edge weights
  edges = graph.edges();
  for (i = 0, l = graph.size; i < l; i++) {
    e = edges[i];
    n = graph.source(e);

    d = degrees[n];

    weight = weighted ?
      (graph.getEdgeAttribute(e, weightAttribute) || 1) :
      1;

    weights[e] = weight / d;
  }

  // Performing the power iterations
  while (iteration < maxIterations) {
    xLast = x;
    x = {};

    for (k in xLast)
      x[k] = 0;

    dangleSum = 0;

    for (i = 0, l = danglingNodes.length; i < l; i++)
      dangleSum += xLast[danglingNodes[i]];

    dangleSum *= alpha;

    for (i = 0; i < N; i++) {
      n = nodes[i];
      edges = graph
        .undirectedEdges(n)
        .concat(graph.outEdges(n));

      for (j = 0, m = edges.length; j < m; j++) {
        e = edges[j];
        neighbor = graph.opposite(n, e);
        x[neighbor] += alpha * xLast[n] * weights[e];
      }

      x[n] += dangleSum * p + (1 - alpha) * p;
    }

    // Checking convergence
    error = 0;

    for (n in x)
      error += Math.abs(x[n] - xLast[n]);

    if (error < N * tolerance) {

      if (assign) {
        for (n in x)
          graph.setNodeAttribute(n, pagerankAttribute, x[n]);
      }

      return x;
    }

    iteration++;
  }

  throw Error('graphology-pagerank: failed to converge.');
}

/**
 * Exporting.
 */
var pagerank = abstractPagerank.bind(null, false);
pagerank.assign = abstractPagerank.bind(null, true);

module.exports = pagerank;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(219);


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Shortest Path
 * =========================
 *
 * Library endpoint.
 */
var dijkstra = __webpack_require__(59);
var unweighted = __webpack_require__(57);

unweighted.dijkstra = dijkstra;
unweighted.unweighted = unweighted;

module.exports = unweighted;


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(221);


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Utils
 * =================
 *
 * Library endpoint.
 */
exports.isGraph = __webpack_require__(0);
exports.isGraphConstructor = __webpack_require__(1);
exports.mergeClique = __webpack_require__(222);
exports.mergeCycle = __webpack_require__(223);
exports.mergePath = __webpack_require__(33);
exports.mergeStar = __webpack_require__(56);


/***/ }),
/* 222 */
/***/ (function(module, exports) {

/**
 * Graphology mergeClique
 * =======================
 *
 * Function merging the given clique to the graph.
 */

/**
 * Merging the given clique to the graph.
 *
 * @param  {Graph} graph - Target graph.
 * @param  {array} nodes - Nodes representing the clique to merge.
 */
module.exports = function mergeClique(graph, nodes) {
  if (nodes.length === 0)
    return;

  var source,
      target,
      i,
      j,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    source = nodes[i];

    for (j = i + 1; j < l; j++) {
      target = nodes[j];

      graph.mergeEdge(source, target);
    }
  }
};


/***/ }),
/* 223 */
/***/ (function(module, exports) {

/**
 * Graphology mergeCycle
 * =====================
 *
 * Function merging the given cycle to the graph.
 */

/**
 * Merging the given cycle to the graph.
 *
 * @param  {Graph} graph - Target graph.
 * @param  {array} nodes - Nodes representing the cycle to merge.
 */
module.exports = function mergeCycle(graph, nodes) {
  if (nodes.length === 0)
    return;

  var previousNode, node, i, l;

  graph.mergeNode(nodes[0]);

  if (nodes.length === 1)
    return;

  for (i = 1, l = nodes.length; i < l; i++) {
    previousNode = nodes[i - 1];
    node = nodes[i];

    graph.mergeEdge(previousNode, node);
  }

  graph.mergeEdge(node, nodes[0]);
};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FA2LayoutSupervisor"] = factory();
	else
		root["FA2LayoutSupervisor"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology ForceAtlas2 Layout Supervisor
 * =========================================
 *
 * Supervisor class able to spawn a web worker to run the FA2 layout in a
 * separate thread not to block UI with heavy synchronous computations.
 */
var Worker = __webpack_require__(1),
    isGraph = __webpack_require__(3),
    helpers = __webpack_require__(4);

var DEFAULT_SETTINGS = __webpack_require__(5);

/**
 * Class representing a FA2 layout run by a webworker.
 *
 * @constructor
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - Parameters:
 * @param  {object}          [settings] - Settings.
 */
function FA2LayoutSupervisor(graph, params) {
  params = params || {};

  // Validation
  if (!isGraph(graph))
    throw new Error('graphology-layout-forceatlas2/worker: the given graph is not a valid graphology instance.');

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings),
      validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error('graphology-layout-forceatlas2/worker: ' + validationError.message);

  // Properties
  this.worker = new Worker();
  this.graph = graph;
  this.settings = settings;
  this.matrices = null;
  this.running = false;
  this.killed = false;

  // Binding listeners
  this.handleMessage = this.handleMessage.bind(this);

  this.worker.addEventListener('message', this.handleMessage.bind(this));
}

/**
 * Internal method used to handle the worker's messages.
 *
 * @param {object} event - Event to handle.
 */
FA2LayoutSupervisor.prototype.handleMessage = function(event) {
  if (!this.running)
    return;

  var matrix = new Float32Array(event.data.nodes);

  helpers.applyLayoutChanges(this.graph, matrix);
  this.matrices.nodes = matrix;

  // Looping
  this.askForIterations();
};

/**
 * Internal method used to ask for iterations from the worker.
 *
 * @param  {boolean} withEdges - Should we send edges along?
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.askForIterations = function(withEdges) {
  var matrices = this.matrices;

  var payload = {
    settings: this.settings,
    nodes: matrices.nodes.buffer
  };

  var buffers = [matrices.nodes.buffer];

  if (withEdges) {
    payload.edges = matrices.edges.buffer;
    buffers.push(matrices.edges.buffer);
  }

  this.worker.postMessage(payload, buffers);

  return this;
};

/**
 * Method used to start the layout.
 *
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.start = function() {
  if (this.killed)
    throw new Error('graphology-layout-forceatlas2/worker.start: layout was killed.');

  if (this.running)
    return this;

  // Building matrices
  this.matrices = helpers.graphToByteArrays(this.graph);

  this.running = true;
  this.askForIterations(true);

  return this;
};

/**
 * Method used to stop the layout.
 *
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.stop = function() {
  this.running = false;

  return this;
};

/**
 * Method used to kill the layout.
 *
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.kill = function() {
  if (this.killed)
    return this;

  this.running = false;
  this.killed = true;

  // Clearing memory
  this.matrices = null;

  // Terminating worker
  this.worker.terminate();

  // Unbinding listeners
  // TODO: for graph listeners
};

/**
 * Exporting.
 */
module.exports = FA2LayoutSupervisor;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return __webpack_require__(2)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/**\n * Graphology ForceAtlas2 Layout Webworker\n * ========================================\n *\n * Web worker able to run the layout in a separate thread.\n */\nvar iterate = __webpack_require__(1);\n\nvar NODES,\n    EDGES;\n\nself.addEventListener('message', function(event) {\n  var data = event.data;\n\n  NODES = new Float32Array(data.nodes);\n\n  if (data.edges)\n    EDGES = new Float32Array(data.edges);\n\n  // Running the iteration\n  iterate(\n    data.settings,\n    NODES,\n    EDGES\n  );\n\n  // Sending result to supervisor\n  self.postMessage({\n    nodes: NODES.buffer\n  }, [NODES.buffer]);\n});\n\n\n/***/ }),\n/* 1 */\n/***/ (function(module, exports) {\n\n/* eslint no-constant-condition: 0 */\n/**\n * Graphology ForceAtlas2 Iteration\n * =================================\n *\n * Function used to perform a single iteration of the algorithm.\n */\n\n/**\n * Matrices properties accessors.\n */\nvar NODE_X = 0,\n    NODE_Y = 1,\n    NODE_DX = 2,\n    NODE_DY = 3,\n    NODE_OLD_DX = 4,\n    NODE_OLD_DY = 5,\n    NODE_MASS = 6,\n    NODE_CONVERGENCE = 7,\n    NODE_SIZE = 8,\n    NODE_FIXED = 9;\n\nvar EDGE_SOURCE = 0,\n    EDGE_TARGET = 1,\n    EDGE_WEIGHT = 2;\n\nvar REGION_NODE = 0,\n    REGION_CENTER_X = 1,\n    REGION_CENTER_Y = 2,\n    REGION_SIZE = 3,\n    REGION_NEXT_SIBLING = 4,\n    REGION_FIRST_CHILD = 5,\n    REGION_MASS = 6,\n    REGION_MASS_CENTER_X = 7,\n    REGION_MASS_CENTER_Y = 8;\n\nvar SUBDIVISION_ATTEMPTS = 3;\n\n/**\n * Constants.\n */\nvar PPN = 10,\n    PPE = 3,\n    PPR = 9;\n\nvar MAX_FORCE = 10;\n\n/**\n * Function used to perform a single interation of the algorithm.\n *\n * @param  {object}       options    - Layout options.\n * @param  {Float32Array} NodeMatrix - Node data.\n * @param  {Float32Array} EdgeMatrix - Edge data.\n * @return {object}                  - Some metadata.\n */\nmodule.exports = function iterate(options, NodeMatrix, EdgeMatrix) {\n\n  // Initializing variables\n  var l, r, n, n1, n2, e, w, g;\n\n  var order = NodeMatrix.length,\n      size = EdgeMatrix.length;\n\n  var outboundAttCompensation,\n      coefficient,\n      xDist,\n      yDist,\n      ewc,\n      distance,\n      factor;\n\n  var RegionMatrix = [];\n\n  // 1) Initializing layout data\n  //-----------------------------\n\n  // Resetting positions & computing max values\n  for (n = 0; n < order; n += PPN) {\n    NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];\n    NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];\n    NodeMatrix[n + NODE_DX] = 0;\n    NodeMatrix[n + NODE_DY] = 0;\n  }\n\n  // If outbound attraction distribution, compensate\n  if (options.outboundAttractionDistribution) {\n    outboundAttCompensation = 0;\n    for (n = 0; n < order; n += PPN) {\n      outboundAttCompensation += NodeMatrix[n + NODE_MASS];\n    }\n\n    outboundAttCompensation /= order;\n  }\n\n\n  // 1.bis) Barnes-Hut computation\n  //------------------------------\n\n  if (options.barnesHutOptimize) {\n\n    // Setting up\n    var minX = Infinity,\n        maxX = -Infinity,\n        minY = Infinity,\n        maxY = -Infinity,\n        q, q2, subdivisionAttempts;\n\n    // Computing min and max values\n    for (n = 0; n < order; n += PPN) {\n      minX = Math.min(minX, NodeMatrix[n + NODE_X]);\n      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);\n      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);\n      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);\n    }\n\n    // squarify bounds, it's a quadtree\n    var dx = maxX - minX, dy = maxY - minY;\n    if (dx > dy) {\n      minY -= (dx - dy) / 2;\n      maxY = minY + dx;\n    }\n    else {\n      minX -= (dy - dx) / 2;\n      maxX = minX + dy;\n    }\n\n    // Build the Barnes Hut root region\n    RegionMatrix[0 + REGION_NODE] = -1;\n    RegionMatrix[0 + REGION_CENTER_X] = (minX + maxX) / 2;\n    RegionMatrix[0 + REGION_CENTER_Y] = (minY + maxY) / 2;\n    RegionMatrix[0 + REGION_SIZE] = Math.max(maxX - minX, maxY - minY);\n    RegionMatrix[0 + REGION_NEXT_SIBLING] = -1;\n    RegionMatrix[0 + REGION_FIRST_CHILD] = -1;\n    RegionMatrix[0 + REGION_MASS] = 0;\n    RegionMatrix[0 + REGION_MASS_CENTER_X] = 0;\n    RegionMatrix[0 + REGION_MASS_CENTER_Y] = 0;\n\n    // Add each node in the tree\n    l = 1;\n    for (n = 0; n < order; n += PPN) {\n\n      // Current region, starting with root\n      r = 0;\n      subdivisionAttempts = SUBDIVISION_ATTEMPTS;\n\n      while (true) {\n        // Are there sub-regions?\n\n        // We look at first child index\n        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {\n\n          // There are sub-regions\n\n          // We just iterate to find a \"leaf\" of the tree\n          // that is an empty region or a region with a single node\n          // (see next case)\n\n          // Find the quadrant of n\n          if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {\n\n            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n              // Top Left quarter\n              q = RegionMatrix[r + REGION_FIRST_CHILD];\n            }\n            else {\n\n              // Bottom Left quarter\n              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;\n            }\n          }\n          else {\n            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n              // Top Right quarter\n              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;\n            }\n            else {\n\n              // Bottom Right quarter\n              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;\n            }\n          }\n\n          // Update center of mass and mass (we only do it for non-leave regions)\n          RegionMatrix[r + REGION_MASS_CENTER_X] =\n            (RegionMatrix[r + REGION_MASS_CENTER_X] * RegionMatrix[r + REGION_MASS] +\n             NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) /\n            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);\n\n          RegionMatrix[r + REGION_MASS_CENTER_Y] =\n            (RegionMatrix[r + REGION_MASS_CENTER_Y] * RegionMatrix[r + REGION_MASS] +\n             NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) /\n            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);\n\n          RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS];\n\n          // Iterate on the right quadrant\n          r = q;\n          continue;\n        }\n        else {\n\n          // There are no sub-regions: we are in a \"leaf\"\n\n          // Is there a node in this leave?\n          if (RegionMatrix[r + REGION_NODE] < 0) {\n\n            // There is no node in region:\n            // we record node n and go on\n            RegionMatrix[r + REGION_NODE] = n;\n            break;\n          }\n          else {\n\n            // There is a node in this region\n\n            // We will need to create sub-regions, stick the two\n            // nodes (the old one r[0] and the new one n) in two\n            // subregions. If they fall in the same quadrant,\n            // we will iterate.\n\n            // Create sub-regions\n            RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;\n            w = RegionMatrix[r + REGION_SIZE] / 2; // new size (half)\n\n            // NOTE: we use screen coordinates\n            // from Top Left to Bottom Right\n\n            // Top Left sub-region\n            g = RegionMatrix[r + REGION_FIRST_CHILD];\n\n            RegionMatrix[g + REGION_NODE] = -1;\n            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;\n            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;\n            RegionMatrix[g + REGION_SIZE] = w;\n            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;\n            RegionMatrix[g + REGION_FIRST_CHILD] = -1;\n            RegionMatrix[g + REGION_MASS] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;\n\n            // Bottom Left sub-region\n            g += PPR;\n            RegionMatrix[g + REGION_NODE] = -1;\n            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] - w;\n            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;\n            RegionMatrix[g + REGION_SIZE] = w;\n            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;\n            RegionMatrix[g + REGION_FIRST_CHILD] = -1;\n            RegionMatrix[g + REGION_MASS] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;\n\n            // Top Right sub-region\n            g += PPR;\n            RegionMatrix[g + REGION_NODE] = -1;\n            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;\n            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] - w;\n            RegionMatrix[g + REGION_SIZE] = w;\n            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;\n            RegionMatrix[g + REGION_FIRST_CHILD] = -1;\n            RegionMatrix[g + REGION_MASS] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;\n\n            // Bottom Right sub-region\n            g += PPR;\n            RegionMatrix[g + REGION_NODE] = -1;\n            RegionMatrix[g + REGION_CENTER_X] = RegionMatrix[r + REGION_CENTER_X] + w;\n            RegionMatrix[g + REGION_CENTER_Y] = RegionMatrix[r + REGION_CENTER_Y] + w;\n            RegionMatrix[g + REGION_SIZE] = w;\n            RegionMatrix[g + REGION_NEXT_SIBLING] = RegionMatrix[r + REGION_NEXT_SIBLING];\n            RegionMatrix[g + REGION_FIRST_CHILD] = -1;\n            RegionMatrix[g + REGION_MASS] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;\n            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;\n\n            l += 4;\n\n            // Now the goal is to find two different sub-regions\n            // for the two nodes: the one previously recorded (r[0])\n            // and the one we want to add (n)\n\n            // Find the quadrant of the old node\n            if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {\n              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n                // Top Left quarter\n                q = RegionMatrix[r + REGION_FIRST_CHILD];\n              }\n              else {\n\n                // Bottom Left quarter\n                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;\n              }\n            }\n            else {\n              if (NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n                // Top Right quarter\n                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;\n              }\n              else {\n\n                // Bottom Right quarter\n                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;\n              }\n            }\n\n            // We remove r[0] from the region r, add its mass to r and record it in q\n            RegionMatrix[r + REGION_MASS] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];\n            RegionMatrix[r + REGION_MASS_CENTER_X] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];\n            RegionMatrix[r + REGION_MASS_CENTER_Y] = NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];\n\n            RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];\n            RegionMatrix[r + REGION_NODE] = -1;\n\n            // Find the quadrant of n\n            if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {\n              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n                // Top Left quarter\n                q2 = RegionMatrix[r + REGION_FIRST_CHILD];\n              }\n              else {\n                // Bottom Left quarter\n                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;\n              }\n            }\n            else {\n              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {\n\n                // Top Right quarter\n                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;\n              }\n              else {\n\n                // Bottom Right quarter\n                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;\n              }\n            }\n\n            if (q === q2) {\n\n              // If both nodes are in the same quadrant,\n              // we have to try it again on this quadrant\n              if (subdivisionAttempts--) {\n                r = q;\n                continue; // while\n              }\n              else {\n                // we are out of precision here, and we cannot subdivide anymore\n                // but we have to break the loop anyway\n                subdivisionAttempts = SUBDIVISION_ATTEMPTS;\n                break; // while\n              }\n\n            }\n\n            // If both quadrants are different, we record n\n            // in its quadrant\n            RegionMatrix[q2 + REGION_NODE] = n;\n            break;\n          }\n        }\n      }\n    }\n  }\n\n\n  // 2) Repulsion\n  //--------------\n  // NOTES: adjustSizes = antiCollision & scalingRatio = coefficient\n\n  if (options.barnesHutOptimize) {\n    coefficient = options.scalingRatio;\n\n    // Applying repulsion through regions\n    for (n = 0; n < order; n += PPN) {\n\n      // Computing leaf quad nodes iteration\n\n      r = 0; // Starting with root region\n      while (true) {\n\n        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {\n\n          // The region has sub-regions\n\n          // We run the Barnes Hut test to see if we are at the right distance\n          distance = Math.sqrt(\n            (Math.pow(NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X], 2)) +\n            (Math.pow(NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y], 2))\n          );\n\n          if (2 * RegionMatrix[r + REGION_SIZE] / distance < options.barnesHutTheta) {\n\n            // We treat the region as a single body, and we repulse\n\n            xDist = NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];\n            yDist = NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];\n\n            if (options.adjustSizes) {\n\n              //-- Linear Anti-collision Repulsion\n              if (distance > 0) {\n                factor = coefficient * NodeMatrix[n + NODE_MASS] *\n                  RegionMatrix[r + REGION_MASS] / distance / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n              else if (distance < 0) {\n                factor = -coefficient * NodeMatrix[n + NODE_MASS] *\n                  RegionMatrix[r + REGION_MASS] / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n            }\n            else {\n\n              //-- Linear Repulsion\n              if (distance > 0) {\n                factor = coefficient * NodeMatrix[n + NODE_MASS] *\n                  RegionMatrix[r + REGION_MASS] / distance / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n            }\n\n            // When this is done, we iterate. We have to look at the next sibling.\n            if (RegionMatrix[r + REGION_NEXT_SIBLING] < 0)\n              break; // No next sibling: we have finished the tree\n            r = RegionMatrix[r + REGION_NEXT_SIBLING];\n            continue;\n\n          }\n          else {\n\n            // The region is too close and we have to look at sub-regions\n            r = RegionMatrix[r + REGION_FIRST_CHILD];\n            continue;\n          }\n\n        }\n        else {\n\n          // The region has no sub-region\n          // If there is a node r[0] and it is not n, then repulse\n\n          if (RegionMatrix[r + REGION_NODE] >= 0 && RegionMatrix[r + REGION_NODE] !== n) {\n            xDist = NodeMatrix[n + NODE_X] - NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];\n            yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];\n\n            distance = Math.sqrt(xDist * xDist + yDist * yDist);\n\n            if (options.adjustSizes) {\n\n              //-- Linear Anti-collision Repulsion\n              if (distance > 0) {\n                factor = coefficient * NodeMatrix[n + NODE_MASS] *\n                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n              else if (distance < 0) {\n                factor = -coefficient * NodeMatrix[n + NODE_MASS] *\n                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n            }\n            else {\n\n              //-- Linear Repulsion\n              if (distance > 0) {\n                factor = coefficient * NodeMatrix[n + NODE_MASS] *\n                  NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS] / distance / distance;\n\n                NodeMatrix[n + NODE_DX] += xDist * factor;\n                NodeMatrix[n + NODE_DY] += yDist * factor;\n              }\n            }\n\n          }\n\n          // When this is done, we iterate. We have to look at the next sibling.\n          if (RegionMatrix[r + REGION_NEXT_SIBLING] < 0)\n            break; // No next sibling: we have finished the tree\n          r = RegionMatrix[r + REGION_NEXT_SIBLING];\n          continue;\n        }\n      }\n    }\n  }\n  else {\n    coefficient = options.scalingRatio;\n\n    // Square iteration\n    for (n1 = 0; n1 < order; n1 += PPN) {\n      for (n2 = 0; n2 < n1; n2 += PPN) {\n\n        // Common to both methods\n        xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];\n        yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];\n\n        if (options.adjustSizes) {\n\n          //-- Anticollision Linear Repulsion\n          distance = Math.sqrt(xDist * xDist + yDist * yDist) -\n            NodeMatrix[n1 + NODE_SIZE] -\n            NodeMatrix[n2 + NODE_SIZE];\n\n          if (distance > 0) {\n            factor = coefficient *\n              NodeMatrix[n1 + NODE_MASS] *\n              NodeMatrix[n2 + NODE_MASS] /\n              distance / distance;\n\n            // Updating nodes' dx and dy\n            NodeMatrix[n1 + NODE_DX] += xDist * factor;\n            NodeMatrix[n1 + NODE_DY] += yDist * factor;\n\n            NodeMatrix[n2 + NODE_DX] += xDist * factor;\n            NodeMatrix[n2 + NODE_DY] += yDist * factor;\n          }\n          else if (distance < 0) {\n            factor = 100 * coefficient *\n              NodeMatrix[n1 + NODE_MASS] *\n              NodeMatrix[n2 + NODE_MASS];\n\n            // Updating nodes' dx and dy\n            NodeMatrix[n1 + NODE_DX] += xDist * factor;\n            NodeMatrix[n1 + NODE_DY] += yDist * factor;\n\n            NodeMatrix[n2 + NODE_DX] -= xDist * factor;\n            NodeMatrix[n2 + NODE_DY] -= yDist * factor;\n          }\n        }\n        else {\n\n          //-- Linear Repulsion\n          distance = Math.sqrt(xDist * xDist + yDist * yDist);\n\n          if (distance > 0) {\n            factor = coefficient *\n              NodeMatrix[n1 + NODE_MASS] *\n              NodeMatrix[n2 + NODE_MASS] /\n              distance / distance;\n\n            // Updating nodes' dx and dy\n            NodeMatrix[n1 + NODE_DX] += xDist * factor;\n            NodeMatrix[n1 + NODE_DY] += yDist * factor;\n\n            NodeMatrix[n2 + NODE_DX] -= xDist * factor;\n            NodeMatrix[n2 + NODE_DY] -= yDist * factor;\n          }\n        }\n      }\n    }\n  }\n\n\n  // 3) Gravity\n  //------------\n  g = options.gravity / options.scalingRatio;\n  coefficient = options.scalingRatio;\n  for (n = 0; n < order; n += PPN) {\n    factor = 0;\n\n    // Common to both methods\n    xDist = NodeMatrix[n + NODE_X];\n    yDist = NodeMatrix[n + NODE_Y];\n    distance = Math.sqrt(\n      Math.pow(xDist, 2) + Math.pow(yDist, 2)\n    );\n\n    if (options.strongGravityMode) {\n\n      //-- Strong gravity\n      if (distance > 0)\n        factor = coefficient * NodeMatrix[n + NODE_MASS] * g;\n    }\n    else {\n\n      //-- Linear Anti-collision Repulsion n\n      if (distance > 0)\n        factor = coefficient * NodeMatrix[n + NODE_MASS] * g / distance;\n    }\n\n    // Updating node's dx and dy\n    NodeMatrix[n + NODE_DX] -= xDist * factor;\n    NodeMatrix[n + NODE_DY] -= yDist * factor;\n  }\n\n  // 4) Attraction\n  //---------------\n  coefficient = 1 *\n    (options.outboundAttractionDistribution ?\n      outboundAttCompensation :\n      1);\n\n  // TODO: simplify distance\n  // TODO: coefficient is always used as -c --> optimize?\n  for (e = 0; e < size; e += PPE) {\n    n1 = EdgeMatrix[e + EDGE_SOURCE];\n    n2 = EdgeMatrix[e + EDGE_TARGET];\n    w = EdgeMatrix[e + EDGE_WEIGHT];\n\n    // Edge weight influence\n    ewc = Math.pow(w, options.edgeWeightInfluence);\n\n    // Common measures\n    xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];\n    yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];\n\n    // Applying attraction to nodes\n    if (options.adjustSizes) {\n\n      distance = Math.sqrt(\n        (Math.pow(xDist, 2) + Math.pow(yDist, 2)) -\n        NodeMatrix[n1 + NODE_SIZE] -\n        NodeMatrix[n2 + NODE_SIZE]\n      );\n\n      if (options.linLogMode) {\n        if (options.outboundAttractionDistribution) {\n\n          //-- LinLog Degree Distributed Anti-collision Attraction\n          if (distance > 0) {\n            factor = -coefficient * ewc * Math.log(1 + distance) /\n            distance /\n            NodeMatrix[n1 + NODE_MASS];\n          }\n        }\n        else {\n\n          //-- LinLog Anti-collision Attraction\n          if (distance > 0) {\n            factor = -coefficient * ewc * Math.log(1 + distance) / distance;\n          }\n        }\n      }\n      else {\n        if (options.outboundAttractionDistribution) {\n\n          //-- Linear Degree Distributed Anti-collision Attraction\n          if (distance > 0) {\n            factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];\n          }\n        }\n        else {\n\n          //-- Linear Anti-collision Attraction\n          if (distance > 0) {\n            factor = -coefficient * ewc;\n          }\n        }\n      }\n    }\n    else {\n\n      distance = Math.sqrt(\n        Math.pow(xDist, 2) + Math.pow(yDist, 2)\n      );\n\n      if (options.linLogMode) {\n        if (options.outboundAttractionDistribution) {\n\n          //-- LinLog Degree Distributed Attraction\n          if (distance > 0) {\n            factor = -coefficient * ewc * Math.log(1 + distance) /\n              distance /\n              NodeMatrix[n1 + NODE_MASS];\n          }\n        }\n        else {\n\n          //-- LinLog Attraction\n          if (distance > 0)\n            factor = -coefficient * ewc * Math.log(1 + distance) / distance;\n        }\n      }\n      else {\n        if (options.outboundAttractionDistribution) {\n\n          //-- Linear Attraction Mass Distributed\n          // NOTE: Distance is set to 1 to override next condition\n          distance = 1;\n          factor = -coefficient * ewc / NodeMatrix[n1 + NODE_MASS];\n        }\n        else {\n\n          //-- Linear Attraction\n          // NOTE: Distance is set to 1 to override next condition\n          distance = 1;\n          factor = -coefficient * ewc;\n        }\n      }\n    }\n\n    // Updating nodes' dx and dy\n    // TODO: if condition or factor = 1?\n    if (distance > 0) {\n\n      // Updating nodes' dx and dy\n      NodeMatrix[n1 + NODE_DX] += xDist * factor;\n      NodeMatrix[n1 + NODE_DY] += yDist * factor;\n\n      NodeMatrix[n2 + NODE_DX] -= xDist * factor;\n      NodeMatrix[n2 + NODE_DY] -= yDist * factor;\n    }\n  }\n\n\n  // 5) Apply Forces\n  //-----------------\n  var force,\n      swinging,\n      traction,\n      nodespeed;\n\n  // MATH: sqrt and square distances\n  if (options.adjustSizes) {\n\n    for (n = 0; n < order; n += PPN) {\n      if (!NodeMatrix[n + NODE_FIXED]) {\n        force = Math.sqrt(\n          Math.pow(NodeMatrix[n + NODE_DX], 2) +\n          Math.pow(NodeMatrix[n + NODE_DY], 2)\n        );\n\n        if (force > MAX_FORCE) {\n          NodeMatrix[n + NODE_DX] =\n            NodeMatrix[n + NODE_DX] * MAX_FORCE / force;\n          NodeMatrix[n + NODE_DY] =\n            NodeMatrix[n + NODE_DY] * MAX_FORCE / force;\n        }\n\n        swinging = NodeMatrix[n + NODE_MASS] *\n          Math.sqrt(\n            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *\n            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +\n            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *\n            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])\n          );\n\n        traction = Math.sqrt(\n          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *\n          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +\n          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *\n          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])\n        ) / 2;\n\n        nodespeed =\n          0.1 * Math.log(1 + traction) / (1 + Math.sqrt(swinging));\n\n        // Updating node's positon\n        NodeMatrix[n + NODE_X] =\n          NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] *\n          (nodespeed / options.slowDown);\n        NodeMatrix[n + NODE_Y] =\n          NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] *\n          (nodespeed / options.slowDown);\n      }\n    }\n  }\n  else {\n\n    for (n = 0; n < order; n += PPN) {\n      if (!NodeMatrix[n + NODE_FIXED]) {\n\n        swinging = NodeMatrix[n + NODE_MASS] *\n          Math.sqrt(\n            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *\n            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +\n            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *\n            (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])\n          );\n\n        traction = Math.sqrt(\n          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *\n          (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +\n          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *\n          (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])\n        ) / 2;\n\n        nodespeed = NodeMatrix[n + NODE_CONVERGENCE] *\n          Math.log(1 + traction) / (1 + Math.sqrt(swinging));\n\n        // Updating node convergence\n        NodeMatrix[n + NODE_CONVERGENCE] =\n          Math.min(1, Math.sqrt(\n            nodespeed *\n            (Math.pow(NodeMatrix[n + NODE_DX], 2) +\n             Math.pow(NodeMatrix[n + NODE_DY], 2)) /\n            (1 + Math.sqrt(swinging))\n          ));\n\n        // Updating node's positon\n        NodeMatrix[n + NODE_X] =\n          NodeMatrix[n + NODE_X] + NodeMatrix[n + NODE_DX] *\n          (nodespeed / options.slowDown);\n        NodeMatrix[n + NODE_Y] =\n          NodeMatrix[n + NODE_Y] + NodeMatrix[n + NODE_DY] *\n          (nodespeed / options.slowDown);\n      }\n    }\n  }\n\n  // We return the information about the layout (no need to return the matrices)\n  return {};\n};\n\n\n/***/ })\n/******/ ]);", null);
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;
module.exports = function(content, url) {
  try {
    try {
      var blob;
      try { // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        blob = new BlobBuilder();
        blob.append(content);
        blob = blob.getBlob();
      } catch(e) { // The proposed API
        blob = new Blob([content]);
      }
      return new Worker(URL.createObjectURL(blob));
    } catch(e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch(e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }
    return new Worker(url);
  }
}


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Constants.
 */
var PPN = 10,
    PPE = 3;

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
exports.assign = function(target) {
  target = target || {};

  var objects = Array.prototype.slice.call(arguments).slice(1),
      i,
      k,
      l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i])
      continue;

    for (k in objects[i])
      target[k] = objects[i][k];
  }

  return target;
};

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */
exports.validateSettings = function(settings) {

  if ('linLogMode' in settings &&
      typeof settings.linLogMode !== 'boolean')
    return {message: 'the `linLogMode` setting should be a boolean.'};

  if ('outboundAttractionDistribution' in settings &&
      typeof settings.outboundAttractionDistribution !== 'boolean')
    return {message: 'the `outboundAttractionDistribution` setting should be a boolean.'};

  if ('adjustSizes' in settings &&
      typeof settings.adjustSizes !== 'boolean')
    return {message: 'the `adjustSizes` setting should be a boolean.'};

  if ('edgeWeightInfluence' in settings &&
      typeof settings.edgeWeightInfluence !== 'number' &&
      settings.edgeWeightInfluence < 0)
    return {message: 'the `edgeWeightInfluence` setting should be a number >= 0.'};

  if ('scalingRatio' in settings &&
      typeof settings.scalingRatio !== 'number' &&
      settings.scalingRatio < 0)
    return {message: 'the `scalingRatio` setting should be a number >= 0.'};

  if ('strongGravityMode' in settings &&
      typeof settings.strongGravityMode !== 'boolean')
    return {message: 'the `strongGravityMode` setting should be a boolean.'};

  if ('gravity' in settings &&
      typeof settings.gravity !== 'number' &&
      settings.gravity < 0)
    return {message: 'the `gravity` setting should be a number >= 0.'};

  if ('slowDown' in settings &&
      typeof settings.slowDown !== 'number' &&
      settings.slowDown < 0)
    return {message: 'the `slowDown` setting should be a number >= 0.'};

  if ('barnesHutOptimize' in settings &&
      typeof settings.barnesHutOptimize !== 'boolean')
    return {message: 'the `barnesHutOptimize` setting should be a boolean.'};

  if ('barnesHutTheta' in settings &&
      typeof settings.barnesHutTheta !== 'number' &&
      settings.barnesHutTheta < 0)
    return {message: 'the `barnesHutTheta` setting should be a number >= 0.'};

  return null;
};

/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {object}       - Both matrices.
 */
exports.graphToByteArrays = function(graph) {
  var nodes = graph.nodes(),
      edges = graph.edges(),
      order = nodes.length,
      size = edges.length,
      index = {},
      i,
      j;

  var NodeMatrix = new Float32Array(order * PPN),
      EdgeMatrix = new Float32Array(size * PPE);

  // Iterate through nodes
  for (i = j = 0; i < order; i++) {

    // Node index
    index[nodes[i]] = j;

    // Populating byte array
    NodeMatrix[j] = graph.getNodeAttribute(nodes[i], 'x');
    NodeMatrix[j + 1] = graph.getNodeAttribute(nodes[i], 'y');
    NodeMatrix[j + 2] = 0;
    NodeMatrix[j + 3] = 0;
    NodeMatrix[j + 4] = 0;
    NodeMatrix[j + 5] = 0;
    NodeMatrix[j + 6] = 1 + graph.degree(nodes[i]);
    NodeMatrix[j + 7] = 1;
    NodeMatrix[j + 8] = graph.getNodeAttribute(nodes[i], 'size') || 1;
    NodeMatrix[j + 9] = 0;
    j += PPN;
  }

  // Iterate through edges
  for (i = j = 0; i < size; i++) {

    // Populating byte array
    EdgeMatrix[j] = index[graph.source(edges[i])];
    EdgeMatrix[j + 1] = index[graph.target(edges[i])];
    EdgeMatrix[j + 2] = graph.getEdgeAttribute(edges[i], 'weight') || 0;
    j += PPE;
  }

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
};

/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */
exports.applyLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes();

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    graph.setNodeAttribute(nodes[j], 'x', NodeMatrix[i]);
    graph.setNodeAttribute(nodes[j], 'y', NodeMatrix[i + 1]);
    j++;
  }
};

/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}        graph      - Target graph.
 * @param  {Float32Array} NodeMatrix - Node matrix.
 * @return {object}                  - Map to node positions.
 */
exports.collectLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes(),
      positions = Object.create(null);

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    positions[nodes[j]] = {
      x: NodeMatrix[i],
      y: NodeMatrix[i + 1]
    };

    j++;
  }

  return positions;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Graphology ForceAtlas2 Layout Default Settings
 * ===============================================
 */
module.exports = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 0,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: false,
  barnesHutTheta: 0.5
};


/***/ })
/******/ ]);
});

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Browser GEXF Endpoint
 * =================================
 *
 * Endpoint gathering both parser & writer for the browser.
 */
exports.parse = __webpack_require__(226);
exports.write = __webpack_require__(229);


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Browser GEXF Parser
 * ===============================
 *
 * Browser version of the graphology GEXF parser.
 */
var createParserFunction = __webpack_require__(227);

module.exports = createParserFunction(DOMParser, Document);


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint no-self-compare: 0 */
/**
 * Graphology Browser GEXF Parser
 * ===============================
 *
 * Browser version of the graphology GEXF parser using DOMParser to function.
 */
var isGraphConstructor = __webpack_require__(1),
    helpers = __webpack_require__(228);

var cast = helpers.cast;

/**
 * Function checking whether the given value is a NaN.
 *
 * @param  {any} value - Value to test.
 * @return {boolean}
 */
function isReallyNaN(value) {
  return value !== value;
}

/**
 * Function used to convert a viz:color attribute into a CSS rgba? string.
 *
 * @param  {Node}   element - DOM element.
 * @return {string}
 */
function toRGBString(element) {
  var a = element.getAttribute('a'),
      r = element.getAttribute('r'),
      g = element.getAttribute('g'),
      b = element.getAttribute('b');

  return a ?
    ('rgba(' + r + ',' + g + ',' + b + ',' + a + ')') :
    ('rgb(' + r + ',' + g + ',' + b + ')');
}

/**
 * Function returning the first matching tag of the `viz` namespace matching
 * the desired tag name.
 *
 * @param  {Node}   element - Target DOM element.
 * @param  {string} name    - Tag name.
 * @return {Node}
 */
function getFirstMatchingVizTag(element, name) {
  var vizElement = element.getElementsByTagName('viz:' + name)[0];

  if (!vizElement)
    vizElement = element.getElementsByTagNameNS('viz', name)[0];

  if (!vizElement)
    vizElement = element.getElementsByTagName(name)[0];

  return vizElement;
}

/**
 * Function used to collect meta information.
 *
 * @param  {Array<Node>} elements - Target DOM element.
 * @return {object}
 */
function collectMeta(elements) {
  var meta = {},
      element;

  for (var i = 0, l = elements.length; i < l; i++) {
    element = elements[i];

    if (element.nodeName === '#text')
      continue;

    meta[element.tagName.toLowerCase()] = element.textContent;
  }

  return meta;
}

/**
 * Function used to extract the model from the right elements.
 *
 * @param  {Array<Node>} elements - Target DOM elements.
 * @return {array}                - The model & default attributes.
 */
function extractModel(elements) {
  var model = {},
      defaults = {},
      element,
      defaultElement,
      id;

  for (var i = 0, l = elements.length; i < l; i++) {
    element = elements[i];
    id = element.getAttribute('id') || element.getAttribute('for');

    model[id] = {
      id: id,
      type: element.getAttribute('type') || 'string',
      title: !isReallyNaN(+id) ?
        (element.getAttribute('title') || id) :
        id
    };

    // Default?
    defaultElement = element.getElementsByTagName('default')[0];

    if (defaultElement)
      defaults[model[id].title] = cast(
        model[id].type,
        defaultElement.textContent
      );
  }

  return [model, defaults];
}

/**
 * Function used to collect an element's attributes.
 *
 * @param  {object} model   - Data model to use.
 * @param  {Node}   element - Target DOM element.
 * @return {object}         - The collected attributes.
 */
function collectAttributes(model, element) {
  var data = {},
      label = element.getAttribute('label'),
      weight = element.getAttribute('weight');

  if (label)
    data.label = label;

  if (weight)
    data.weight = +weight;

  var valueElements = element.getElementsByTagName('attvalue'),
      valueElement,
      id;

  for (var i = 0, l = valueElements.length; i < l; i++) {
    valueElement = valueElements[i];
    id = (
      valueElement.getAttribute('id') ||
      valueElement.getAttribute('for')
    );

    data[model[id].title] = cast(
      model[id].type,
      valueElement.getAttribute('value')
    );
  }

  // TODO: shortcut here to avoid viz when namespace is not set

  // Attempting to find viz namespace tags

  //-- 1) Color
  var vizElement = getFirstMatchingVizTag(element, 'color');

  if (vizElement)
    data.color = toRGBString(vizElement);

  //-- 2) Size
  vizElement = getFirstMatchingVizTag(element, 'size');

  if (vizElement)
    data.size = +vizElement.getAttribute('value');

  //-- 3) Position
  var x, y, z;

  vizElement = getFirstMatchingVizTag(element, 'position');

  if (vizElement) {
    x = vizElement.getAttribute('x');
    y = vizElement.getAttribute('y');
    z = vizElement.getAttribute('z');

    if (x)
      data.x = +x;
    if (y)
      data.y = +y;
    if (z)
      data.z = +z;
  }

  //-- 4) Shape
  vizElement = getFirstMatchingVizTag(element, 'shape');

  if (vizElement)
    data.shape = vizElement.getAttribute('value');

  //-- 5) Thickness
  vizElement = getFirstMatchingVizTag(element, 'thickness');

  if (vizElement)
    data.thickness = +vizElement.getAttribute('value');

  return data;
}

/**
 * Factory taking implementations of `DOMParser` & `Document` returning
 * the parser function.
 */
module.exports = function createParserFunction(DOMParser, Document) {

  /**
   * Function taking either a string or a document and returning a
   * graphology instance.
   *
   * @param  {function}        Graph  - A graphology constructor.
   * @param  {string|Document} source - The source to parse.
   */

  // TODO: option to map the data to the attributes for customization, nodeModel, edgeModel, nodeReducer, edgeReducer
  // TODO: option to disable the model mapping heuristic
  return function parse(Graph, source) {
    var xmlDoc = source;

    var element,
        result,
        type,
        attributes,
        id,
        s,
        t,
        i,
        l;

    if (!isGraphConstructor(Graph))
      throw new Error('graphology-gexf/browser/parser: invalid Graph constructor.');

    // If source is a string, we are going to parse it
    if (typeof source === 'string')
      xmlDoc = (new DOMParser()).parseFromString(source, 'application/xml');

    if (!(xmlDoc instanceof Document))
      throw new Error('graphology-gexf/browser/parser: source should either be a XML document or a string.');

    // Finding useful elements
    var GRAPH_ELEMENT = xmlDoc.getElementsByTagName('graph')[0],
        META_ELEMENT = xmlDoc.getElementsByTagName('meta')[0],
        META_ELEMENTS = (META_ELEMENT && META_ELEMENT.childNodes) || [],
        NODE_ELEMENTS = xmlDoc.getElementsByTagName('node'),
        EDGE_ELEMENTS = xmlDoc.getElementsByTagName('edge'),
        MODEL_ELEMENTS = xmlDoc.getElementsByTagName('attributes'),
        NODE_MODEL_ELEMENTS = [],
        EDGE_MODEL_ELEMENTS = [];

    for (i = 0, l = MODEL_ELEMENTS.length; i < l; i++) {
      element = MODEL_ELEMENTS[i];

      if (element.getAttribute('class') === 'node')
        NODE_MODEL_ELEMENTS = element.getElementsByTagName('attribute');
      else if (element.getAttribute('class') === 'edge')
        EDGE_MODEL_ELEMENTS = element.getElementsByTagName('attribute');
    }

    // Information
    var DEFAULT_EDGE_TYPE = GRAPH_ELEMENT.getAttribute('defaultedgetype') || 'undirected';

    if (DEFAULT_EDGE_TYPE === 'mutual')
      DEFAULT_EDGE_TYPE = 'undirected';

    // Computing models
    result = extractModel(NODE_MODEL_ELEMENTS);

    var NODE_MODEL = result[0],
        NODE_DEFAULT_ATTRIBUTES = result[1];

    result = extractModel(EDGE_MODEL_ELEMENTS);

    var EDGE_MODEL = result[0],
        EDGE_DEFAULT_ATTRIBUTES = result[1];

    // Polling the first edge to guess the type of the edges
    var graphType = EDGE_ELEMENTS[0] ?
      (EDGE_ELEMENTS[0].getAttribute('type') || DEFAULT_EDGE_TYPE) :
      'mixed';

    // Instantiating our graph
    var graph = new Graph({
      type: graphType,
      defaultNodeAttributes: NODE_DEFAULT_ATTRIBUTES,
      defaultEdgeAttributes: EDGE_DEFAULT_ATTRIBUTES
    });

    // Collecting meta
    var meta = collectMeta(META_ELEMENTS),
        lastModifiedDate = META_ELEMENT && META_ELEMENT.getAttribute('lastmodifieddate');

    graph.replaceAttributes(meta);

    if (lastModifiedDate)
      graph.setAttribute('lastModifiedDate', lastModifiedDate);

    // Adding nodes
    for (i = 0, l = NODE_ELEMENTS.length; i < l; i++) {
      element = NODE_ELEMENTS[i];

      graph.addNode(
        element.getAttribute('id'),
        collectAttributes(NODE_MODEL, element)
      );
    }

    // Adding edges
    for (i = 0, l = EDGE_ELEMENTS.length; i < l; i++) {
      element = EDGE_ELEMENTS[i];

      id = element.getAttribute('id');
      type = element.getAttribute('type') || DEFAULT_EDGE_TYPE;
      s = element.getAttribute('source');
      t = element.getAttribute('target');
      attributes = collectAttributes(EDGE_MODEL, element);

      // If we encountered an edge with a different type, we upgrade the graph
      if (type !== graph.type && graph.type !== 'mixed') {
        graph.upgradeToMixed();
      }

      // If we encountered twice the same edge, we upgrade the graph
      if (
        !graph.multi &&
        (
          (type === 'directed' && graph.hasDirectedEdge(s, t)) ||
          (graph.hasUndirectedEdge(s, t))
        )
      ) {
        graph.upgradeToMulti();
      }

      if (id) {
        if (type === 'directed')
          graph.addDirectedEdgeWithKey(id, s, t, attributes);
        else
          graph.addUndirectedEdgeWithKey(id, s, t, attributes);
      }
      else {
        if (type === 'directed')
          graph.addDirectedEdge(s, t, attributes);
        else
          graph.addUndirectedEdge(s, t, attributes);
      }
    }

    return graph;
  };
};


/***/ }),
/* 228 */
/***/ (function(module, exports) {

/**
 * Graphology Common GEXF Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both instance of the code.
 */

/**
 * Function used to cast a string value to the desired type.
 *
 * @param  {string} type - Value type.
 * @param  {string} type - String value.
 * @return {any}         - Parsed type.
 */
exports.cast = function(type, value) {
  switch (type) {
    case 'boolean':
      value = (value === 'true');
      break;

    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      value = +value;
      break;

    case 'liststring':
      value = value ? value.split('|') : [];
      break;

    default:
  }

  return value;
};


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Graphology Common GEXF Writer
 * ==============================
 *
 * GEXF writer working for both node.js & the browser.
 */
var isGraph = __webpack_require__(0),
    XMLWriter = __webpack_require__(230);

// TODO: options => prettyPrint, nodeModel, edgeModel
// TODO: handle object in color, position with object for viz

/**
 * Constants.
 */
var GEXF_NAMESPACE = 'http://www.gexf.net/1.2draft',
    GEXF_VIZ_NAMESPACE = 'http:///www.gexf.net/1.1draft/viz';

var DEFAULTS = {
  encoding: 'UTF-8',
  pretty: true
};

// var VALID_GEXF_TYPES = new Set([
//   'integer',
//   'long',
//   'double',
//   'float',
//   'boolean',
//   'liststring',
//   'string',
//   'anyURI'
// ]);

var VIZ_RESERVED_NAMES = new Set([
  'color',
  'size',
  'x',
  'y',
  'z',
  'shape',
  'thickness'
]);

var RGBA_TEST = /^\s*rgba?\s*\(/i,
    RGBA_MATCH = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)\s*(?:,\s*([.0-9]*))?\)\s*$/;

/**
 * Function used to transform a CSS color into a RGBA object.
 *
 * @param  {string} value - Target value.
 * @return {object}
 */
function CSSColorToRGBA(value) {
  if (!value || typeof value !== 'string')
    return {};

  if (value[0] === '#') {
    value = value.slice(1);

    return (value.length === 3) ?
      {
        r: parseInt(value[0] + value[0], 16),
        g: parseInt(value[1] + value[1], 16),
        b: parseInt(value[2] + value[2], 16)
      } :
      {
        r: parseInt(value[0] + value[1], 16),
        g: parseInt(value[2] + value[3], 16),
        b: parseInt(value[4] + value[5], 16)
      };
  }
  else if (RGBA_TEST.test(value)) {
    var result = {};

    value = value.match(RGBA_MATCH);
    result.r = +value[1];
    result.g = +value[2];
    result.b = +value[3];

    if (value[4])
      result.a = +value[4];

    return result;
  }

  return {};
}

/**
 * Function used to map an element's attributes to a standardized map of
 * GEXF expected properties (label, viz, attributes).
 *
 * @param  {string} type       - The element's type
 * @param  {object} attributes - The element's attributes.
 * @return {object}
 */
function DEFAULT_ELEMENT_REDUCER(type, attributes) {
  var output = {},
      name;

  for (name in attributes) {
    if (name === 'label') {
      output.label = attributes.label;
    }
    else if (type === 'edge' && name === 'weight') {
      output.weight = attributes.weight;
    }
    else if (VIZ_RESERVED_NAMES.has(name)) {
      output.viz = output.viz || {};
      output.viz[name] = attributes[name];
    }
    else {
      output.attributes = output.attributes || {};
      output.attributes[name] = attributes[name];
    }
  }

  return output;
}

var DEFAULT_NODE_REDUCER = DEFAULT_ELEMENT_REDUCER.bind(null, 'node'),
    DEFAULT_EDGE_REDUCER = DEFAULT_ELEMENT_REDUCER.bind(null, 'edge');

/**
 * Function used to check whether the given integer is 32 bits or not.
 *
 * @param  {number} number - Target number.
 * @return {boolean}
 */
function is32BitInteger(number) {
  return number <= 0x7FFFFFFF && number >= -0x7FFFFFFF;
}

/**
 * Function used to detect a JavaScript's value type in the GEXF model.
 *
 * @param  {any}    value - Target value.
 * @return {string}
 */
function detectValueType(value) {
  if (Array.isArray(value))
    return 'liststring';
  if (typeof value === 'boolean')
    return 'boolean';
  if (typeof value === 'object')
    return 'string';

  // Numbers
  if (typeof value === 'number') {

    // Integer
    if (value === (value | 0)) {

      // Long (JavaScript integer can go up to 53 bit)?
      return is32BitInteger(value) ? 'integer' : 'long';
    }

    // JavaScript numbers are 64 bit float, hence the double
    return 'double';
  }

  return 'string';
}

/**
 * Function used to cast the given value into the given type.
 *
 * @param  {string} type  - Target type.
 * @param  {any}    value - Value to cast.
 * @return {string}
 */
function cast(type, value) {
  if (type === 'liststring' && Array.isArray(value))
    return value.join('|');
  return '' + value;
}

/**
 * Function used to collect data from a graph's nodes.
 *
 * @param  {Graph}    graph   - Target graph.
 * @param  {function} reducer - Function reducing the nodes attributes.
 * @return {array}
 */
function collectNodeData(graph, reducer) {
  var nodes = graph.nodes(),
      data;

  for (var i = 0, l = nodes.length; i < l; i++) {
    data = reducer(graph.getNodeAttributes(nodes[i]));
    data.key = nodes[i];
    nodes[i] = data;
  }

  return nodes;
}

/**
 * Function used to collect data from a graph's edges.
 *
 * @param  {Graph}    graph   - Target graph.
 * @param  {function} reducer - Function reducing the edges attributes.
 * @return {array}
 */
function collectEdgeData(graph, reducer) {
  var edges = graph.edges(),
      data;

  for (var i = 0, l = edges.length; i < l; i++) {
    data = reducer(graph.getEdgeAttributes(edges[i]));
    data.key = edges[i];
    data.source = graph.source(edges[i]);
    data.target = graph.target(edges[i]);
    data.undirected = graph.undirected(edges[i]);
    edges[i] = data;
  }

  return edges;
}

/**
 * Function used to infer the model of the graph's nodes or edges.
 *
 * @param  {array} elements - The graph's relevant elements.
 * @return {array}
 */
function inferModel(elements) {
  var model = {},
      attributes,
      type,
      k;

  // Testing every attributes
  for (var i = 0, l = elements.length; i < l; i++) {
    attributes = elements[i].attributes;

    if (!attributes)
      continue;

    for (k in attributes) {
      type = detectValueType(attributes[k]);

      if (!model[k])
        model[k] = type;
      else {
        if (model[k] === 'integer' && type === 'long')
          model[k] = type;
        else if (model[k] !== type)
          model[k] = 'string';
      }
    }
  }

  // TODO: check default values
  return model;
}

/**
 * Function used to write a model.
 *
 * @param {XMLWriter} writer     - The writer to use.
 * @param {object}    model      - Model to write.
 * @param {string}    modelClass - Class of the model.
 */
function writeModel(writer, model, modelClass) {
  var name;

  if (!Object.keys(model).length)
    return;

  writer.startElement('attributes');
  writer.writeAttribute('class', modelClass);

  for (name in model) {
    writer.startElement('attribute');
    writer.writeAttribute('id', name);
    writer.writeAttribute('title', name);
    writer.writeAttribute('type', model[name]);
    writer.endElement();
  }

  writer.endElement();
}

function writeElements(writer, type, model, elements) {
  var emptyModel = !Object.keys(model).length,
      element,
      name,
      color,
      edgeType,
      attributes,
      viz,
      k,
      i,
      l;

  writer.startElement(type + 's');

  for (i = 0, l = elements.length; i < l; i++) {
    element = elements[i];
    attributes = element.attributes;
    viz = element.viz;

    writer.startElement(type);
    writer.writeAttribute('id', element.key);

    if (type === 'edge') {
      edgeType = element.undirected ? 'undirected' : 'directed';

      if (edgeType !== writer.defaultEdgeType)
        writer.writeAttribute('type', edgeType);

      writer.writeAttribute('source', element.source);
      writer.writeAttribute('target', element.target);

      if ('weight' in element)
        writer.writeAttribute('weight', element.weight);
    }

    if (element.label)
      writer.writeAttribute('label', element.label);

    if (!emptyModel && attributes) {
      writer.startElement('attvalues');

      for (name in model) {
        if (name in attributes) {
          writer.startElement('attvalue');
          writer.writeAttribute('for', name);
          writer.writeAttribute('value', cast(model[name], attributes[name]));
          writer.endElement();
        }
      }

      writer.endElement();
    }

    if (viz) {

      //-- 1) Color
      if (viz.color) {
        color = CSSColorToRGBA(viz.color);

        writer.startElementNS('viz', 'color');

        for (k in color)
          writer.writeAttribute(k, color[k]);

        writer.endElement();
      }

      //-- 2) Size
      if ('size' in viz) {
        writer.startElementNS('viz', 'size');
        writer.writeAttribute('value', viz.size);
        writer.endElement();
      }

      //-- 3) Position
      if ('x' in viz || 'y' in viz || 'z' in viz) {
        writer.startElementNS('viz', 'position');

        if ('x' in viz)
          writer.writeAttribute('x', viz.x);

        if ('y' in viz)
          writer.writeAttribute('y', viz.y);

        if ('z' in viz)
          writer.writeAttribute('z', viz.z);

        writer.endElement();
      }

      //-- 4) Shape
      if (viz.shape) {
        writer.startElementNS('viz', 'shape');
        writer.writeAttribute('value', viz.shape);
        writer.endElement();
      }

      //-- 5) Thickness
      if ('thickness' in viz) {
        writer.startElementNS('viz', 'thickness');
        writer.writeAttribute('value', viz.thickness);
        writer.endElement();
      }
    }

    writer.endElement();
  }

  writer.endElement();
}

/**
 * Function taking a graphology instance & outputting a gexf string.
 *
 * @param  {Graph}  graph        - Target graphology instance.
 * @param  {object} options      - Options:
 * @param  {string}   [encoding]   - Character encoding.
 * @paral  {boolean}  [pretty]     - Whether to pretty print output.
 * @return {string}              - GEXF string.
 */
module.exports = function write(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-gexf/writer: invalid graphology instance.');

  options = options || {};

  var indent = options.pretty === false ? false : '  ';

  var writer = new XMLWriter(indent);

  writer.startDocument('1.0', options.encoding || DEFAULTS.encoding);

  // Starting gexf
  writer.startElement('gexf');
  writer.writeAttribute('version', '1.2');
  writer.writeAttribute('xmlns', GEXF_NAMESPACE);
  writer.writeAttribute('xmlns:viz', GEXF_VIZ_NAMESPACE);

  // Processing meta
  writer.startElement('meta');
  var graphAttributes = graph.getAttributes();

  if (graphAttributes.lastModifiedDate)
    writer.writeAttribute('lastmodifieddate', graphAttributes.lastModifiedDate);

  for (var k in graphAttributes) {
    if (k !== 'lastModifiedDate')
      writer.writeElement(k, graphAttributes[k]);
  }

  writer.endElement();
  writer.startElement('graph');
  writer.defaultEdgeType = graph.type === 'mixed' ?
    'directed' :
    graph.type;

  writer.writeAttribute(
    'defaultedgetype',
    writer.defaultEdgeType
  );

  // Processing model
  var nodes = collectNodeData(graph, DEFAULT_NODE_REDUCER),
      edges = collectEdgeData(graph, DEFAULT_EDGE_REDUCER);

  var nodeModel = inferModel(nodes);

  writeModel(writer, nodeModel, 'node');

  var edgeModel = inferModel(edges);

  writeModel(writer, edgeModel, 'edge');

  // Processing nodes
  writeElements(writer, 'node', nodeModel, nodes);

  // Processing edges
  writeElements(writer, 'edge', edgeModel, edges);

  return writer.toString();
};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(231);


/***/ }),
/* 231 */
/***/ (function(module, exports) {


function isFalse(s) {
  return typeof s !== 'number' && !s;
}

function strval(s) {
  if (typeof s == 'string') {
    return s;
  }
  else if (typeof s == 'number') {
    return s+'';
  }
  else if (typeof s == 'function') {
    return s();
  }
  else if (s instanceof XMLWriter) {
    return s.toString();
  }
  else throw Error('Bad Parameter');
}

function XMLWriter(indent, callback) {

    if (!(this instanceof XMLWriter)) {
        return new XMLWriter();
    }

    this.name_regex = /[_:A-Za-z][-._:A-Za-z0-9]*/;
    this.indent = indent ? true : false;
    this.indentString = this.indent && typeof indent === 'string' ? indent : '    ';
    this.output = '';
    this.stack = [];
    this.tags = 0;
    this.attributes = 0;
    this.attribute = 0;
    this.texts = 0;
    this.comment = 0;
    this.dtd = 0;
    this.root = '';
    this.pi = 0;
    this.cdata = 0;
    this.started_write = false;
    this.writer;
    this.writer_encoding = 'UTF-8';

    if (typeof callback == 'function') {
        this.writer = callback;
    } else {
        this.writer = function (s, e) {
            this.output += s;
        }
    }
}

XMLWriter.prototype = {
    toString : function () {
        this.flush();
        return this.output;
    },

    indenter : function () {
      if (this.indent) {
        this.write('\n');
        for (var i = 1; i < this.tags; i++) {
          this.write(this.indentString);
        }
      }
    },

    write : function () {
        for (var i = 0; i < arguments.length; i++) {
            this.writer(arguments[i], this.writer_encoding);
        }
    },


    flush : function () {
        for (var i = this.tags; i > 0; i--) {
            this.endElement();
        }
        this.tags = 0;
    },

    startDocument : function (version, encoding, standalone) {
        if (this.tags || this.attributes) return this;

        this.startPI('xml');
        this.startAttribute('version');
        this.text(typeof version == "string" ? version : "1.0");
        this.endAttribute();
        if (typeof encoding == "string") {
            this.startAttribute('encoding');
            this.text(encoding);
            this.endAttribute();
            this.writer_encoding = encoding;
        }
        if (standalone) {
            this.startAttribute('standalone');
            this.text("yes");
            this.endAttribute();
        }
        this.endPI();
        if (!this.indent) {
          this.write('\n');
        }
        return this;
    },

    endDocument : function () {
        if (this.attributes) this.endAttributes();
        return this;
    },

    writeElement : function (name, content) {
        return this.startElement(name).text(content).endElement();
    },

    writeElementNS : function (prefix, name, uri, content) {
        if (!content) {
            content = uri;
        }
        return this.startElementNS(prefix, name, uri).text(content).endElement();
    },

    startElement : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.tags === 0 && this.root && this.root !== name) throw Error('Invalid Parameter');
        if (this.attributes) this.endAttributes();
        ++this.tags;
        this.texts = 0;
        if (this.stack.length > 0)
          this.stack[this.stack.length-1].containsTag = true;

        this.stack.push({
            name: name,
            tags: this.tags
        });
        if (this.started_write) this.indenter();
        this.write('<', name);
        this.startAttributes();
        this.started_write = true;
        return this;
    },
    startElementNS : function (prefix, name, uri) {
        prefix = strval(prefix);
        name = strval(name);

        if (!prefix.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.attributes) this.endAttributes();
        ++this.tags;
        this.texts = 0;
        if (this.stack.length > 0)
          this.stack[this.stack.length-1].containsTag = true;

        this.stack.push({
            name: prefix + ':' + name,
            tags: this.tags
        });
        if (this.started_write) this.indenter();
        this.write('<', prefix + ':' + name);
        this.startAttributes();
        this.started_write = true;
        return this;
    },

    endElement : function () {
        if (!this.tags) return this;
        var t = this.stack.pop();
        if (this.attributes > 0) {
            if (this.attribute) {
                if (this.texts) this.endAttribute();
                this.endAttribute();
            }
            this.write('/');
            this.endAttributes();
        } else {
            if (t.containsTag) this.indenter();
            this.write('</', t.name, '>');
        }
        --this.tags;
        this.texts = 0;
        return this;
    },

    writeAttribute : function (name, content) {
        if (typeof content == 'function') {
          content = content();
        }
        if (isFalse(content)) {
           return this;
        }
        return this.startAttribute(name).text(content).endAttribute();
    },
    writeAttributeNS : function (prefix, name, uri, content) {
        if (!content) {
            content = uri;
        }
        if (typeof content == 'function') {
          content = content();
        }
        if (isFalse(content)) {
          return this;
        }
        return this.startAttributeNS(prefix, name, uri).text(content).endAttribute();
    },

    startAttributes : function () {
        this.attributes = 1;
        return this;
    },

    endAttributes : function () {
        if (!this.attributes) return this;
        if (this.attribute) this.endAttribute();
        this.attributes = 0;
        this.attribute = 0;
        this.texts = 0;
        this.write('>');
        return this;
    },

    startAttribute : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!this.attributes && !this.pi) return this;
        if (this.attribute) return this;
        this.attribute = 1;
        this.write(' ', name, '="');
        return this;
    },
    startAttributeNS : function (prefix, name, uri) {
        prefix = strval(prefix);
        name = strval(name);

        if (!prefix.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!this.attributes && !this.pi) return this;
        if (this.attribute) return this;
        this.attribute = 1;
        this.write(' ', prefix + ':' + name, '="');
        return this;
    },
    endAttribute : function () {
        if (!this.attribute) return this;
        this.attribute = 0;
        this.texts = 0;
        this.write('"');
        return this;
    },

    text : function (content) {
        content = strval(content);
        if (!this.tags && !this.comment && !this.pi && !this.cdata) return this;
        if (this.attributes && this.attribute) {
            ++this.texts;
            this.write(content
                       .replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/"/g, '&quot;')
                       .replace(/\t/g, '&#x9;')
                       .replace(/\n/g, '&#xA;')
                       .replace(/\r/g, '&#xD;')
                      );
            return this;
        } else if (this.attributes && !this.attribute) {
            this.endAttributes();
        }
        if (this.comment || this.cdata) {
            this.write(content);
        }
        else {
          this.write(content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
        ++this.texts;
        this.started_write = true;
        return this;
    },

    writeComment : function (content) {
        return this.startComment().text(content).endComment();
    },

    startComment : function () {
        if (this.comment) return this;
        if (this.attributes) this.endAttributes();
        this.indenter();
        this.write('<!--');
        this.comment = 1;
        this.started_write = true;
        return this;
    },

    endComment : function () {
        if (!this.comment) return this;
        this.write('-->');
        this.comment = 0;
        return this;
    },

    writeDocType : function (name, pubid, sysid, subset) {
        return this.startDocType(name, pubid, sysid, subset).endDocType()
    },

    startDocType : function (name, pubid, sysid, subset) {
        if (this.dtd || this.tags) return this;

        name = strval(name);
        pubid = pubid ? strval(pubid) : pubid;
        sysid = sysid ? strval(sysid) : sysid;
        subset = subset ? strval(subset) : subset;

        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (pubid && !pubid.match(/^[\w\-][\w\s\-\/\+\:\.]*/)) throw Error('Invalid Parameter');
        if (sysid && !sysid.match(/^[\w\.][\w\-\/\\\:\.]*/)) throw Error('Invalid Parameter');
        if (subset && !subset.match(/[\w\s\<\>\+\.\!\#\-\?\*\,\(\)\|]*/)) throw Error('Invalid Parameter');

        pubid = pubid ? ' PUBLIC "' + pubid + '"' : (sysid) ? ' SYSTEM' : '';
        sysid = sysid ? ' "' + sysid + '"' : '';
        subset = subset ? ' [' + subset + ']': '';

        if (this.started_write) this.indenter();
        this.write('<!DOCTYPE ', name, pubid, sysid, subset);
        this.root = name;
        this.dtd = 1;
        this.started_write = true;
        return this;
    },

    endDocType : function () {
        if (!this.dtd) return this;
        this.write('>');
        return this;
    },

    writePI : function (name, content) {
        return this.startPI(name).text(content).endPI()
    },

    startPI : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.pi) return this;
        if (this.attributes) this.endAttributes();
        if (this.started_write) this.indenter();
        this.write('<?', name);
        this.pi = 1;
        this.started_write = true;
        return this;
    },

    endPI : function () {
        if (!this.pi) return this;
        this.write('?>');
        this.pi = 0;
        return this;
    },

    writeCData : function (content) {
        return this.startCData().text(content).endCData();
    },

    startCData : function () {
        if (this.cdata) return this;
        if (this.attributes) this.endAttributes();
        this.indenter();
        this.write('<![CDATA[');
        this.cdata = 1;
        this.started_write = true;
        return this;
    },

    endCData : function () {
        if (!this.cdata) return this;
        this.write(']]>');
        this.cdata = 0;
        return this;
    },

    writeRaw : function(content) {
        content = strval(content);
        if (!this.tags && !this.comment && !this.pi && !this.cdata) return this;
        if (this.attributes && this.attribute) {
            ++this.texts;
            this.write(content.replace('&', '&amp;').replace('"', '&quot;'));
            return this;
        } else if (this.attributes && !this.attribute) {
            this.endAttributes();
        }
        ++this.texts;
        this.write(content);
        this.started_write = true;
        return this;
    }

}

module.exports = XMLWriter;


/***/ }),
/* 232 */
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
/* 233 */
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
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(11);

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
/* 235 */
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

var _utils = __webpack_require__(66);

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
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = __webpack_require__(61);

var _extent2 = _interopRequireDefault(_extent);

var _isGraph = __webpack_require__(0);

var _isGraph2 = _interopRequireDefault(_isGraph);

var _renderer = __webpack_require__(62);

var _renderer2 = _interopRequireDefault(_renderer);

var _camera = __webpack_require__(34);

var _camera2 = _interopRequireDefault(_camera);

var _mouse = __webpack_require__(65);

var _mouse2 = _interopRequireDefault(_mouse);

var _quadtree = __webpack_require__(64);

var _quadtree2 = _interopRequireDefault(_quadtree);

var _node = __webpack_require__(237);

var _node2 = _interopRequireDefault(_node);

var _edge = __webpack_require__(242);

var _edge2 = _interopRequireDefault(_edge);

var _label = __webpack_require__(68);

var _label2 = _interopRequireDefault(_label);

var _hover = __webpack_require__(245);

var _hover2 = _interopRequireDefault(_hover);

var _utils = __webpack_require__(63);

var _utils2 = __webpack_require__(66);

var _utils3 = __webpack_require__(35);

var _labels = __webpack_require__(247);

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
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,

  // TEMPORARY LABEL SETTINGS
  labelFont: 'Arial',
  labelSize: 14,
  labelWeight: 'normal'
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

    // Indices
    // TODO: this could be improved by key => index => floatArray
    // TODO: the cache should erase keys on node delete
    _this.quadtree = new _quadtree2.default();
    _this.nodeOrder = {};
    _this.nodeDataCache = {};
    _this.edgeOrder = {};

    // Normalization function
    _this.normalizationFunction = null;

    // Starting dimensions
    _this.width = 0;
    _this.height = 0;

    // State
    _this.highlightedNodes = new Set();
    _this.previousVisibleNodes = new Set();
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
        preserveDrawingBuffer: true,
        antialias: false
      };

      var context = void 0;

      if (webgl) {
        context = element.getContext('webgl', contextOptions);

        // Edge, I am looking right at you...
        if (!context) context = element.getContext('experimental-webgl', contextOptions);
      } else {
        context = element.getContext('2d', contextOptions);
      }

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


      var graph = this.graph;

      // TODO: possible to index this somehow using two byte arrays or so
      var extent = (0, _extent2.default)(graph, ['x', 'y']);

      // Rescaling function
      this.normalizationFunction = (0, _utils2.createNormalizationFunction)(extent);

      var nodeProgram = this.nodePrograms.def;

      if (!keepArrays) {
        nodeProgram.allocate(graph.order);
        this.nodeOrder = {};
      }

      var nodes = graph.nodes();

      for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];

        this.nodeOrder[node] = i;

        var data = graph.getNodeAttributes(node);

        var rescaledData = this.normalizationFunction(data);

        // TODO: Optimize this to save a loop and one object, by using a reversed assign
        var displayData = (0, _utils.assign)({}, data, rescaledData);

        // TODO: this size normalization does not work
        this.quadtree.add(node, displayData.x, 1 - displayData.y, displayData.size / this.width);

        this.nodeDataCache[node] = displayData;

        nodeProgram.process(displayData, i);
      }

      nodeProgram.bufferData();

      var edgeProgram = this.edgePrograms.def;

      if (!keepArrays) {
        edgeProgram.allocate(graph.size);
        this.edgeOrder = {};
      }

      var edges = graph.edges();

      for (var _i = 0, _l = edges.length; _i < _l; _i++) {
        var edge = edges[_i];

        this.edgeOrder[edge] = _i;

        var _data2 = graph.getEdgeAttributes(edge),
            extremities = graph.extremities(edge),
            sourceData = this.nodeDataCache[extremities[0]],
            targetData = this.nodeDataCache[extremities[1]];

        edgeProgram.process(sourceData, targetData, _data2, _i);
      }

      // Computing edge indices if necessary
      if (!keepArrays && typeof edgeProgram.computeIndices === 'function') this.edgeIndicesArray = edgeProgram.computeIndices();

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

      nodeProgram.process(data, this.nodeOrder[key]);

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

      edgeProgram.process(sourceData, targetData, data, this.edgeOrder[key]);

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

      // TODO: should probably use another name for the `program` abstraction
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

      // Selecting labels to draw
      var labelsToDisplay = (0, _labels.labelsToDisplayFromGrid)({
        cache: this.nodeDataCache,
        camera: this.camera,
        displayedLabels: this.displayedLabels,
        previousVisibleNodes: this.previousVisibleNodes,
        visibleNodes: visibleNodes
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
      this.previousVisibleNodes = new Set(visibleNodes);
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
      this.nodeOrder = null;
      this.nodeDataCache = null;
      this.edgeOrder = null;

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
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(67);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(35);

var _nodeFastVert = __webpack_require__(240);

var _nodeFastVert2 = _interopRequireDefault(_nodeFastVert);

var _nodeFastFrag = __webpack_require__(241);

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
    _this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    _this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    _this.ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    _this.scaleLocation = gl.getUniformLocation(program, 'u_scale');

    // Bindings
    gl.enableVertexAttribArray(_this.positionLocation);
    gl.enableVertexAttribArray(_this.sizeLocation);
    gl.enableVertexAttribArray(_this.colorLocation);

    gl.vertexAttribPointer(_this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(_this.sizeLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(_this.colorLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
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

      gl.uniform2f(this.resolutionLocation, params.width, params.height);
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
/* 238 */
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
/* 239 */
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
/* 240 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute float a_size;\nattribute float a_color;\n\nuniform vec2 u_resolution;\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 color;\nvarying float border;\n\nvoid main() {\n\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  float c = a_color;\n  color.b = mod(c, 256.0); c = floor(c / 256.0);\n  color.g = mod(c, 256.0); c = floor(c / 256.0);\n  color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;\n  color.a = 1.0;\n}\n"

/***/ }),
/* 241 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 color;\nvarying float border;\n\nconst float radius = 0.5;\n\nvoid main(void) {\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / border;\n\n  gl_FragColor = mix(color0, color, t);\n}\n"

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _program = __webpack_require__(67);

var _program2 = _interopRequireDefault(_program);

var _utils = __webpack_require__(35);

var _edgeVert = __webpack_require__(243);

var _edgeVert2 = _interopRequireDefault(_edgeVert);

var _edgeFrag = __webpack_require__(244);

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
    ATTRIBUTES = 6;

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
    var extension = gl.getExtension('OES_element_index_uint');
    _this.canUse32BitsIndices = !!extension;
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
      gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
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
        for (var l = i + POINTS * ATTRIBUTES; i < l; i++) {
          this.array[i] = 0;
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

      for (var _i = 0, c = 0; _i < size; _i += 4) {
        indices[c++] = _i;
        indices[c++] = _i + 1;
        indices[c++] = _i + 2;
        indices[c++] = _i + 2;
        indices[c++] = _i + 1;
        indices[c++] = _i + 3;
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
/* 243 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_thickness;\nattribute float a_color;\n\nuniform vec2 u_resolution;\nuniform float u_ratio;\nuniform mat3 u_matrix;\nuniform float u_scale;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.8;\n\nvoid main() {\n\n  // Computing thickness in pixels\n  float pow_ratio = 1.0 / pow(u_ratio, 0.5);\n  float thickness = a_thickness / 2.0 * pow_ratio / u_scale;\n\n  // Adding a small feather for AA\n  thickness += feather;\n\n  // Computing delta relative to viewport\n  vec2 delta = (a_normal * thickness) / u_resolution;\n\n  vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n  position += delta;\n\n  // Applying\n  gl_Position = vec4(position, 0, 1);\n\n  v_normal = a_normal;\n  v_thickness = thickness;\n\n  // Extract the color:\n  float c = a_color;\n  v_color.b = mod(c, 256.0); c = floor(c / 256.0);\n  v_color.g = mod(c, 256.0); c = floor(c / 256.0);\n  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;\n  v_color.a = 1.0;\n}\n"

/***/ }),
/* 244 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.8;\nconst vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, color0, t);\n}\n"

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.default = drawHover;

var _node = __webpack_require__(246);

var _node2 = _interopRequireDefault(_node);

var _label = __webpack_require__(68);

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
/* 246 */
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
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 */

/**
 * Constants.
 */

// Dimensions of a normal cell
var DEFAULT_CELL = {
  width: 200,
  height: 150
};

// Dimensions of an unzoomed cell. This one is usually smaller than the normal
// one to account for the fact that labels will more likely collide.
var DEFAULT_UNZOOMED_CELL = {
  width: 400,
  height: 300
};

// TODO: use degree as secondary tie-breaker

/**
 * Label grid heuristic selecting labels to display according to the following
 * parameters:
 *   1) Only one label per grid cell.
 *   2) Greater labels win.
 *   3) Already displayed label should stay displayed.
 *
 * Note: It is possible to apply a size threshold to the labels (but should
 * really be done at quad level for performance).
 *
 * Note: It might be possible to not use last displayed labels by measurements
 * and a margin.
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Set}      previousVisibleNodes - Nodes visible last render.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @return {Array}                         - The selected labels.
 */
exports.labelsToDisplayFromGrid = function (params) {
  var cache = params.cache,
      camera = params.camera,
      displayedLabels = params.displayedLabels,
      previousVisibleNodes = params.previousVisibleNodes,
      visibleNodes = params.visibleNodes;


  var cameraState = camera.getState(),
      previousCameraState = camera.getPreviousState(),
      dimensions = camera.getDimensions();

  // State
  // TODO: the panning is false because of not working y condition, though
  // if I fix it, the whole heuristic fails. I am saddness... :(
  var zooming = cameraState.ratio < previousCameraState.ratio,
      panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.x,
      unzooming = cameraState.ratio > previousCameraState.ratio,
      unzoomedPanning = !zooming && !unzooming && cameraState.ratio >= 1;

  // Trick to discretize unzooming
  if (unzooming && Math.trunc(cameraState.ratio * 10) % 3 !== 0) return Array.from(displayedLabels);

  // If panning while unzoomed, we shouldn't change label selection
  if (unzoomedPanning && displayedLabels.size !== 0) return Array.from(displayedLabels);

  // Selecting cell
  var baseCell = cameraState.ratio >= 1.3 ? DEFAULT_UNZOOMED_CELL : DEFAULT_CELL;

  // Adapting cell dimensions
  var cellWidthRemainder = dimensions.width % baseCell.width;
  var cellWidth = baseCell.width + cellWidthRemainder / Math.floor(dimensions.width / baseCell.width);

  var cellHeightRemainder = dimensions.height % baseCell.height;
  var cellHeight = baseCell.height + cellHeightRemainder / Math.floor(dimensions.height / baseCell.height);

  // Building the grid
  var grid = {};

  var worthyBuckets = new Set();
  var worthyLabels = [];

  // Selecting worthy labels
  for (var i = 0, l = visibleNodes.length; i < l; i++) {
    var node = visibleNodes[i],
        nodeData = cache[node];

    // When panning, we should not consider nodes that were previously shown
    if (panning && !zooming && !unzooming) {
      if (!displayedLabels.has(node) && previousVisibleNodes.has(node)) continue;
    }

    // Finding our node's cell in the grid
    // TODO: pass dimensions to the function
    var pos = camera.graphToViewport(dimensions, nodeData.x, nodeData.y);

    var xKey = Math.floor(pos.x / cellWidth),
        yKey = Math.floor(pos.y / cellHeight);

    // NOTE: there seems to be overflowing keys but this is actually a good
    // thing since it means we grasp margins.
    var key = xKey + ';' + yKey;

    // When zooming or panning, we aim at keeping the already displayed labels
    if ((zooming || panning && !unzooming) && displayedLabels.has(node)) {
      worthyBuckets.add(key);
      worthyLabels.push(node);
      continue;
    }

    if (worthyBuckets.has(key)) continue;

    // Label resolution
    if (typeof grid[key] === 'undefined') {

      // The cell is empty
      grid[key] = node;
    } else {

      // We must solve a conflict in this cell
      var currentNode = grid[key],
          currentNodeData = cache[currentNode];

      // In case of size equality, we use the node's key so that the
      // process remains deterministic
      if (nodeData.size > currentNodeData.size || nodeData.size === currentNodeData.size && node > currentNode) {
        grid[key] = node;
      }
    }
  }

  // Compiling the labels
  for (var _key in grid) {
    worthyLabels.push(grid[_key]);
  }return worthyLabels;
};

/***/ })
/******/ ]);