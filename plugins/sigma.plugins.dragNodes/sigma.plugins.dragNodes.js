/**
 * This plugin provides a method to drag & drop nodes. Check the
 * sigma.plugins.dragNodes function doc or the examples/basic.html &
 * examples/api-candy.html code samples to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');

  /**
   * This function will add `mousedown`, `mouseup` & `mousemove` events to the
   * nodes in the `overNode`event to perform drag & drop operations. It uses
   * `linear interpolation` [http://en.wikipedia.org/wiki/Linear_interpolation]
   * and `rotation matrix` [http://en.wikipedia.org/wiki/Rotation_matrix] to
   * calculate the X and Y coordinates from the `cam` or `renderer` node
   * attributes. These attributes represent the coordinates of the nodes in
   * the real container, not in canvas.
   *
   * Recognized parameters:
   * **********************
   * @param  {sigma}    s        The related sigma instance.
   * @param  {renderer} renderer The related renderer instance.
   */
  sigma.plugins.dragNodes = function(s, renderer) {
    // A quick hardcoded rule to prevent people from using this plugin with the
    // WebGL renderer (which is impossible at the moment):
    if (
      sigma.renderers.webgl &&
      renderer instanceof sigma.renderers.webgl
    )
      throw new Error(
        'The sigma.plugins.dragNodes is not compatible with the WebGL renderer'
      );

    var _body = document.body,
        _container = renderer.container,
        _mouse = _container.lastChild,
        _camera = renderer.camera,
        _node = null,
        _prefix = '',
        _hoverStack = [],
        _isMouseDown = false,
        _isMouseOverCanvas = false;

    // It removes the initial substring ('read_') if it's a WegGL renderer.
    if (renderer instanceof sigma.renderers.webgl) {
      _prefix = renderer.options.prefix.substr(5);
    } else {
      _prefix = renderer.options.prefix;
    }

    // Calculates the global offset of the given element more accurately than
    // element.offsetTop and element.offsetLeft.
    var calculateOffset = function(element) {
      var style = window.getComputedStyle(element);
      var getCssProperty = function(prop) {
        return parseInt(style.getPropertyValue(prop).replace('px', '')) || 0;
      };
      return {
        left: element.getBoundingClientRect().left + getCssProperty('padding-left'),
        top: element.getBoundingClientRect().top + getCssProperty('padding-top')
      };
    };

    var nodeMouseOver = function(event) {
      // Add node to array of current nodes over
      _hoverStack.push(event.data.node);

      if(_hoverStack.length && ! _isMouseDown) {
        // Set the current node to be the last one in the array
        _node = _hoverStack[_hoverStack.length - 1];
        _mouse.addEventListener('mousedown', nodeMouseDown);
      }
    };

    var treatOutNode = function(event) {
      // Remove the node from the array
      var indexCheck = _hoverStack.map(function(e) { return e; }).indexOf(event.data.node);
      _hoverStack.splice(indexCheck, 1);

      if(_hoverStack.length && ! _isMouseDown) {
        // On out, set the current node to be the next stated in array
        _node = _hoverStack[_hoverStack.length - 1];
      } else {
        _mouse.removeEventListener('mousedown', nodeMouseDown);
      }
    };

    var nodeMouseDown = function(event) {
      _isMouseDown = true;
      var size = s.graph.nodes().length;
      if (size > 1) {
        _mouse.removeEventListener('mousedown', nodeMouseDown);
        _body.addEventListener('mousemove', nodeMouseMove);
        _body.addEventListener('mouseup', nodeMouseUp);

        // Deactivate drag graph.
        renderer.settings({mouseEnabled: false, enableHovering: false});
        s.refresh();
      }
    };

    var nodeMouseUp = function(event) {
      _isMouseDown = false;
      _mouse.addEventListener('mousedown', nodeMouseDown);
      _body.removeEventListener('mousemove', nodeMouseMove);
      _body.removeEventListener('mouseup', nodeMouseUp);

      // Activate drag graph.
      renderer.settings({mouseEnabled: true, enableHovering: true});
      s.refresh();
    };

    var nodeMouseMove = function(event) {
      if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        clearTimeout(timeOut);
        var timeOut = setTimeout(executeNodeMouseMove, 0);
      } else {
        executeNodeMouseMove();
      }

      function executeNodeMouseMove() {
        var offset = calculateOffset(_container),
            x = event.pageX - offset.left,
            y = event.pageY - offset.top,
            cos = Math.cos(_camera.angle),
            sin = Math.sin(_camera.angle),
            nodes = s.graph.nodes(),
            ref = [];

        // Getting and derotating the reference coordinates.
        for (var i = 0; i < 2; i++) {
          var n = nodes[i];
          var aux = {
            x: n.x * cos + n.y * sin,
            y: n.y * cos - n.x * sin,
            renX: n[_prefix + 'x'],
            renY: n[_prefix + 'y'],
          };
          ref.push(aux);
        }

        // Applying linear interpolation.
        x = ((x - ref[0].renX) / (ref[1].renX - ref[0].renX)) *
          (ref[1].x - ref[0].x) + ref[0].x;
        y = ((y - ref[0].renY) / (ref[1].renY - ref[0].renY)) *
          (ref[1].y - ref[0].y) + ref[0].y;

        // Rotating the coordinates.
        _node.x = x * cos - y * sin;
        _node.y = y * cos + x * sin;

        s.refresh();
      }
    };

    renderer.bind('overNode', nodeMouseOver);
    renderer.bind('outNode', treatOutNode);
  };

}).call(window);
