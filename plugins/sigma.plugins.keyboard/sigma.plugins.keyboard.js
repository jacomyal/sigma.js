;(function(undefined) {
  'use strict';

  /**
   * Sigma Keyboard Utility
   * ================================
   *
   * The aim of this plugin is to bind any function to a combinaison of keys,
   * and to control the camera zoom and position with the keyboard.
   * Use (Alt +) Arrow to move in any direction.
   * Use (Alt +) Space + Top/Bottom Arrow to zoom in/out.
   *
   * Author: Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * Version: 0.0.1
   */

  if (typeof sigma === 'undefined')
    throw 'sigma.plugins.keyboard: sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * The default settings.
   *
   */
  var settings = {
    // {number} Camera displacement in pixels
    displacement: 100,
    // {number} Override the `mouseZoomDuration` setting of Sigma
    duration: 200,
    // {number} Override the `zoomingRatio` setting of Sigma
    zoomingRatio: 1.7
  };

  var _instance = {},
      _body,
      _keys = [],
      _currentEvents;

  /**
   * Keyboard Object
   * ------------------
   *
   * @param  {sigma}   s     The related sigma instance.
   * @param  {object} params The options related to the object.
   */
  function Keyboard(s, params) {
    params = sigma.utils.extend(params, settings);
    params.zoomingRatio = params.zoomingRatio || s.settings('zoomingRatio');
    params.duration = params.duration || s.settings('mouseZoomDuration');

    var self = this;
    _body = _body || document.getElementsByTagName('body')[0];

    sigma.classes.dispatcher.extend(this);

    function camera(o) {
      sigma.misc.animation.camera(
        s.camera,
        {
          x: s.camera.x + (o.x || 0),
          y: s.camera.y + (o.y || 0),
          ratio: s.camera.ratio * (o.ratio || 1)
        },
        { duration: o.duration}
      );
    }

    function moveLeft() {
      camera({
        x: - params.displacement,
        duration: params.duration
      });
    };

    function moveTop() {
      camera({
        y: - params.displacement,
        duration: params.duration
      });
    };

    function moveRight() {
      camera({
        x: params.displacement,
        duration: params.duration
      });
    };

    function moveDown() {
      camera({
        y: params.displacement,
        duration: params.duration
      });
    };

    function zoomIn() {
      camera({
        ratio: 1 / params.zoomingRatio,
        duration: params.duration
      });
    };

    function zoomOut() {
      camera({
        ratio: params.zoomingRatio,
        duration: params.duration
      });
    };

    this.keyDown = function(event) {
      if (!_keys[event.which]) {
        _keys[event.which] = true;
        _currentEvents = Object.keys(_keys).join('+');
        self.dispatchEvent(_currentEvents);
      }
    }

    this.keyUp = function(event) {
      delete _keys[event.which];
      _currentEvents = null;
    }

    _body.addEventListener('keydown', this.keyDown, false);
    _body.addEventListener('keyup', this.keyUp, false);

    this.bind('37 18+37', moveLeft); // (ALT +) LEFT ARROW
    this.bind('38 18+38', moveTop); // (ALT +) TOP ARROW
    this.bind('39 18+39', moveRight); // (ALT +) RIGHT ARROW
    this.bind('40 18+40', moveDown); // (ALT +) BOTTOM ARROW

    this.bind('32+38 18+32+38', zoomIn); // (ALT +) SPACE + TOP ARROW
    this.bind('32+40 18+32+40', zoomOut); // (ALT +) SPACE + BOTTOM ARROW
  };


  /**
   * Interface
   * ------------------
   */

  /**
   * This function initializes the Keyboard for a specified Sigma instance.
   *
   * Usage:
   *   var kbd = sigma.plugins.keyboard(s);
   *   kbd.bind('32', function() { console.log('"Space" key pressed'); });
   *
   * @param  {sigma} s The related sigma instance.
   * @param  {object} options The options related to the object.
   */
  sigma.plugins.keyboard = function(s, options) {
    // Create object if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new Keyboard(s, options);

      s.bind('kill', function() {
        sigma.plugins.killKeyboard(s);
      });
    }

    return _instance[s.id];
  };

  /**
   * This function kills the Keyboard instance.
   */
  sigma.plugins.killKeyboard = function(s) {
    if (_instance[s.id] instanceof Keyboard) {
      _instance[s.id].unbind();
      _body.removeEventListener('keydown', _instance[s.id].keyDown, false);
      _body.removeEventListener('keyup', _instance[s.id].keyUp, false);
      delete _instance[s.id];
    }
  };

}).call(this);
