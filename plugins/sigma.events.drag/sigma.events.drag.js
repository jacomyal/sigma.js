/**
 * This plugin dispatch 'drag' and 'drop' events while listening to mouse
 * events on a renderer. Check the sigma.events.drag function doc or the
 * examples/drag-nodes.html code sample to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.events');


  /**
   * Dispatch 'drag' and 'drop' events while listening
   * to mouse events on a renderer.
   *
   * @param {object} renderer The renderer to listen.
   */
  sigma.events.drag = function(renderer) {
    sigma.classes.dispatcher.extend(this);

    var _self = this,
        _drag = false,
        _x = 0,
        _y = 0;

    // Set _drag to true if the mouse position has changed.
    var detectDrag = function(e) {
      //console.log('mousemove');
      if(Math.abs(e.clientX - _x) || Math.abs(e.clientY - _y) > 1) {
        _drag = true;
        //console.log('drag');
        _self.dispatchEvent('drag');
      }
    };

    // Initialize the mouse position and attach the 'mousemove' event
    // to detect dragging.
    renderer.container.addEventListener('mousedown', function(e) {
      //console.log('mousedown');
      _drag = false;
      _x = e.clientX;
      _y = e.clientY;
      renderer.container.addEventListener('mousemove', detectDrag);
    });

    renderer.container.addEventListener('mouseup', function() {
      // 'mouseup' event is called at the end of the call stack
      // so that 'mousemove' is called before. 
      setTimeout(function() {
        //console.log('mouseup');
        if (_drag) {
          _self.dispatchEvent('drop');
        }
        _drag = false;
        renderer.container.removeEventListener('mousemove', detectDrag);
      }, 1);
    });
  };

}).call(window);
