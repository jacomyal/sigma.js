;(function(undefined) {
  'use strict';

  /**
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
   * requestAnimationFrame polyfill by Erik Möller.
   * fixes from Paul Irish and Tino Zijdel
   * MIT license
   */
  var x,
      lastTime = 0,
      vendors = ['ms', 'moz', 'webkit', 'o'];

  for (x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
    window.requestAnimationFrame =
      window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime(),
          timeToCall = Math.max(0, 16 - (currTime - lastTime)),
          id = window.setTimeout(
            function() {
              callback(currTime + timeToCall);
            },
            timeToCall
          );

      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

  /**
   * Function.prototype.bind polyfill found on MDN.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
   * Public domain
   */
  if (!Function.prototype.bind)
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function')
        // Closest thing possible to the ECMAScript 5 internal IsCallable
        // function:
        throw new TypeError(
          'Function.prototype.bind - what is trying to be bound is not callable'
        );

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP,
          fBound;

      fNOP = function() {};
      fBound = function() {
        return fToBind.apply(
          this instanceof fNOP && oThis ?
            this :
            oThis,
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
}).call(this);
