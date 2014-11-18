;(function (undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Lasso
   * =============================
   *
   * @author Florent Schildknecht <florent.schildknecht@gmail.com> (Florent Schildknecht)
   * @version 0.0.1
   */
   var _sigmaInstance = undefined,
       _graph = undefined,
       _renderer = undefined,
       _body,
       _activated = false,
       _path = [],
       _settings = {
         "activationKeyCode": 76,
         "activationWithAltKey": true
       };

  /**
   * Overwrites object1's values with object2's and adds object2's if non existent in object1
   * @param object1
   * @param object2
   * @returns object3 a new object based on object1 and object2
   */
  function mergeOptions (object1, object2) {
      var object3 = {}, attrname;
      for (attrname in object1) {
        object3[attrname] = object1[attrname];
      }
      for (attrname in object2) {
        object3[attrname] = object2[attrname];
      }
      return object3;
  }

  function onKeyUp (event) {
    console.log(event);

    if (!_settings.activationWithAltKey || (_settings.activationWithAltKey && event.altKey) && event.keyCode === _settings.activationKeyCode) {
      if (_activated) {
        lasso.unactivate();
      } else {
        lasso.activate();
      }
    }
  }

  function onMouseDown (event) {
    if (_activated) {
      console.log(event);

      event.stopPropagation();
    }
  }

  function onMouseMove (event) {
    if (_activated) {
      console.log(event);

      event.stopPropagation();
    }
  }

  function onMouseUp (event) {
    if (_activated) {
      console.log(event);

      event.stopPropagation();
    }
  }

  /**
   * Lasso Object
   * ------------------
   * @param  {sigma}    sigmaInstance The related sigma instance.
   * @param  {renderer} renderer      The sigma instance renderer.
   * @param  {object}   settings      A list of settings.
   */
  function Lasso (sigmaInstance, renderer, settings) {
    // A quick hardcoded rule to prevent people from using this plugin with the
    // WebGL renderer (which is impossible at the moment):
    if (
      sigma.renderers.webgl &&
      renderer instanceof sigma.renderers.webgl
    )
      throw new Error(
        'The sigma.plugins.lasso is not compatible with the WebGL renderer'
      );

    _sigmaInstance = sigmaInstance;
    _graph = sigmaInstance.graph;
    _renderer = renderer;
    _settings = mergeOptions(_settings, settings || {});
    _body = document.body;

    console.log(_body);

    // Bind keyboard events to listen for activation key
    _body.addEventListener('keyup', onKeyUp);

    console.log('created with', _settings);
  };

  /**
   * This method is used to destroy the lasso.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.clear();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.clear = function () {
    lasso = null;

    return this;
  };

  /**
   * This method is used to activate the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.activate = function () {
    _activated = true;

    // Add a new background layout canvas to draw the path on
    if (!_renderer.domElements['lasso-background']) {
      _renderer.initDOM('canvas', 'lasso-background');
      _renderer.domElements['lasso-background'].width = _renderer.container.offsetWidth;
      _renderer.domElements['lasso-background'].height = _renderer.container.offsetHeight;
      _renderer.container.insertBefore(_renderer.domElements['lasso-background'], _renderer.container.firstChild);
    }

    this.bindAll();

    console.log('activated');

    return this;
  };

  /**
   * This method is used to unactivate the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.unactivate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.unactivate = function () {
    _activated = false;

    if (_renderer.domElements['lasso-background']) {
      console.log(_renderer, _renderer.container);
      _renderer.container.removeChild(_renderer.domElements['lasso-background']);
    }

    this.unbindAll();

    console.log('unactivated');

    return this;
  };

  /**
   * This method is used to bind all events of the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.bindAll = function () {
    _body.addEventListener('mousedown', onMouseDown);
    _body.addEventListener('mousemove', onMouseMove);
    _body.addEventListener('mouseup', onMouseUp);

    return this;
  };

  /**
   * This method is used to unbind all events of the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.unbindAll = function () {
    _body.removeEventListener('mousedown', onMouseDown);
    _body.removeEventListener('mousemove', onMouseMove);
    _body.removeEventListener('mouseup', onMouseUp);

    return this;
  };


  /**
   * Interface
   * ------------------
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   */
  var lasso = null;

  /**
   * @param  {sigma}    sigmaInstance The related sigma instance.
   * @param  {renderer} renderer      The sigma instance renderer.
   * @param  {object}   settings      A list of settings.
   *
   * @return {sigma.plugins.lasso} Returns the instance
   */
  sigma.plugins.lasso = function (sigmaInstance, renderer, settings) {
    // Create lasso if undefined
    if (!lasso) {
      lasso = new Lasso(sigmaInstance, renderer, settings);
    }

    return lasso;
  };

}).call(this);
