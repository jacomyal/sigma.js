;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  /**
   * Sigma Fullscreen
   * =============================
   *
   * @author Martin de la Taille <https://github.com/Martindelataille>
   * @author Sébastien Heymann <https://github.com/sheymann>
   * @version 0.2
   */

  var _self = null,
      _eventListenerElement = null;

  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (_self.container.requestFullscreen) {
        _self.container.requestFullscreen();
      } else if (_self.container.msRequestFullscreen) {
        _self.container.msRequestFullscreen();
      } else if (_self.container.mozRequestFullScreen) {
        _self.container.mozRequestFullScreen();
      } else if (_self.container.webkitRequestFullscreen) {
        _self.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  /**
   * This plugin enables the activation of full screen mode by clicking on btn.
   * If btn does not exist, this plugin will leave the full screen mode.
   *
   * @param  {?object} btn The btn id from the page.
   */
  function fullScreen(btn) {
    _self = this,
    _eventListenerElement = null;
    
    // Get the btn element reference from the DOM
    if(btn) {
      _eventListenerElement = document.getElementById(btn.id);
      _eventListenerElement.removeEventListener("click", toggleFullScreen);
      _eventListenerElement.addEventListener("click", toggleFullScreen);
    } 
    else {
      toggleFullScreen();
    }
  };

  /**
   *  This function kills the fullScreen instance.
   */
  function killFullScreen() {
    toggleFullScreen();
    _self = null;
    
    if (_eventListenerElement)
      _eventListenerElement.removeEventListener("click", toggleFullScreen);
  };

  // Extending canvas and webl renderers
  sigma.renderers.canvas.prototype.fullScreen = fullScreen;
  sigma.renderers.webgl.prototype.fullScreen = fullScreen;

  sigma.renderers.canvas.prototype.killFullScreen = killFullScreen;
  sigma.renderers.webgl.prototype.killFullScreen = killFullScreen;

}).call(this);
