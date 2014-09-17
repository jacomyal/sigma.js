;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Fullscreen
   * =============================
   *
   * @author Martin de la Taille <https://github.com/Martindelataille>
   * @version 0.1
   */

  var _s = null,
      _btn = null,
      _renderer = null;

    // Use webkit or moz fullscreen method
    function fullscreen(){
         if(_renderer.container.webkitRequestFullScreen)
             _renderer.container.webkitRequestFullScreen();
        else
           _renderer.container.mozRequestFullScreen();
    }

  /**
   * Interface
   * ------------------
   */

  /**
   * This plugin enables the activation of fullscreen by clicking on btn
   * If btn not exist, this plugin will take graph as a btn
   *
   * @param  {sigma}                     s The related sigma instance.
   * @object  {btn} a The btn id from the page.
   */
  sigma.plugins.fullScreen = function(s, btn) {
    _s = s;
    _renderer = s.renderers[0];
    _btn = btn;

    var eventListenerElement;
    // Get the btn element reference from the DOM
    if(_btn)
      eventListenerElement = document.getElementById(_btn.id);
    else
      eventListenerElement = _renderer.contexts.mouse.canvas;

    eventListenerElement.addEventListener("click",fullscreen);
  };

  /**
   *  This function kills the fullscreen instance.
   */
  sigma.plugins.killFullscreen = function() {
    _s = null;
    _btn = null;
    _renderer = null;
  };

}).call(this);
