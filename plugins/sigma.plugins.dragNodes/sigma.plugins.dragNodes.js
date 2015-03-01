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
   * Fired events:
   * *************
   * startdrag  Fired at the beginning of the drag.
   * drag       Fired while the node is dragged.
   * drop       Fired at the end of the drag if the node has been dragged.
   * dragend    Fired at the end of the drag.
   *
   * Recognized parameters:
   * **********************
   * @param  {sigma}    s        The related sigma instance.
   * @param  {renderer} renderer The related renderer instance.
   * @param  {sigma.plugins.activeState} a The activeState plugin instance.
   */
  function DragNodes(s, renderer, a) {
    sigma.classes.dispatcher.extend(this);

    // A quick hardcoded rule to prevent people from using this plugin with the
    // WebGL renderer (which is impossible at the moment):
    if (
      sigma.renderers.webgl &&
      renderer instanceof sigma.renderers.webgl
    )
      throw new Error(
        'The sigma.plugins.dragNodes is not compatible with the WebGL renderer'
      );

    // Init variables:
    var _self = this,
      _s = s,
      _a = a,
      _body = document.body,
      _renderer = renderer,
      _mouse = renderer.container.lastChild,
      _camera = renderer.camera,
      _node = null,
      _draggingNode = null,
      _prefix = renderer.options.prefix,
      _hoverStack = [],
      _hoverIndex = {},
      _isMouseDown = false,
      _isMouseOverCanvas = false,
      _drag = false;

    if (renderer instanceof sigma.renderers.svg) {
        _mouse = renderer.container.firstChild;
    }

    renderer.bind('overNode', nodeMouseOver);
    renderer.bind('outNode', treatOutNode);
    renderer.bind('click', click);

    _s.bind('kill', function() {
      _self.unbindAll();
    });

    /**
     * Unbind all event listeners.
     */
    this.unbindAll = function() {
      _mouse.removeEventListener('mousedown', nodeMouseDown);
      _body.removeEventListener('mousemove', nodeMouseMove);
      _body.removeEventListener('mouseup', nodeMouseUp);
      _renderer.unbind('overNode', nodeMouseOver);
      _renderer.unbind('outNode', treatOutNode);
    }

    // Calculates the global offset of the given element more accurately than
    // element.offsetTop and element.offsetLeft.
    function calculateOffset(element) {
      var style = window.getComputedStyle(element);
      var getCssProperty = function(prop) {
        return parseInt(style.getPropertyValue(prop).replace('px', '')) || 0;
      };
      return {
        left: element.getBoundingClientRect().left + getCssProperty('padding-left'),
        top: element.getBoundingClientRect().top + getCssProperty('padding-top')
      };
    };

    function click(event) {
      // event triggered at the end of the click
      _isMouseDown = false;
      _body.removeEventListener('mousemove', nodeMouseMove);
      _body.removeEventListener('mouseup', nodeMouseUp);

      if (!_hoverStack.length) {
        _node = null;
      }
      else {
        // Drag node right after click instead of needing mouse out + mouse over:
        setTimeout(function() {
          // Set the current node to be the last one in the array
          _node = _hoverStack[_hoverStack.length - 1];
          _mouse.addEventListener('mousedown', nodeMouseDown);
        }, 0);
      }
    };

    function nodeMouseOver(event) {
      // Don't treat the node if it is already registered
      if (_hoverIndex[event.data.node.id]) {
        return;
      }

      // Add node to array of current nodes over
      _hoverStack.push(event.data.node);
      _hoverIndex[event.data.node.id] = true;

      if(!_isMouseDown) {
        // Set the current node to be the last one in the array
        _node = _hoverStack[_hoverStack.length - 1];
        _mouse.addEventListener('mousedown', nodeMouseDown);
      }
    };

    function treatOutNode(event) {
      // Remove the node from the array
      var indexCheck = _hoverStack.map(function(e) { return e; }).indexOf(event.data.node);
      _hoverStack.splice(indexCheck, 1);
      delete _hoverIndex[event.data.node.id];

      if(_hoverStack.length && ! _isMouseDown) {
        // On out, set the current node to be the next stated in array
        _node = _hoverStack[_hoverStack.length - 1];
      } else {
        _mouse.removeEventListener('mousedown', nodeMouseDown);
      }
    };

    function nodeMouseDown(event) {
      _isMouseDown = true;
      if (_node && _s.graph.nodes().length > 0) {
        _mouse.removeEventListener('mousedown', nodeMouseDown);
        _body.addEventListener('mousemove', nodeMouseMove);
        _body.addEventListener('mouseup', nodeMouseUp);

        // Deactivate drag graph.
        _renderer.settings({mouseEnabled: false, enableHovering: false});

        _self.dispatchEvent('startdrag', {
          node: _node,
          captor: event,
          renderer: _renderer
        });
      }
    };

    function nodeMouseUp(event) {
      _isMouseDown = false;
      _mouse.addEventListener('mousedown', nodeMouseDown);
      _body.removeEventListener('mousemove', nodeMouseMove);
      _body.removeEventListener('mouseup', nodeMouseUp);

      // Activate drag graph.
      _renderer.settings({mouseEnabled: true, enableHovering: true});

      if (_drag) {
        _self.dispatchEvent('drop', {
          node: _node,
          captor: event,
          renderer: _renderer
        });

        if(_a) {
          var activeNodes = _a.nodes();
          for(var i = 0; i < activeNodes.length; i++) {
            delete activeNodes[i].alphaX;
            delete activeNodes[i].alphaY;
          }
        }

        _s.refresh();
      }
      _self.dispatchEvent('dragend', {
        node: _node,
        captor: event,
        renderer: _renderer
      });

      _drag = false;
      _node = null;
    };

    function nodeMouseMove(event) {
      if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        clearTimeout(timeOut);
        var timeOut = setTimeout(executeNodeMouseMove, 0);
      } else {
        executeNodeMouseMove();
      }

      function executeNodeMouseMove() {
        var offset = calculateOffset(_renderer.container),
            x = event.clientX - offset.left,
            y = event.clientY - offset.top,
            cos = Math.cos(_camera.angle),
            sin = Math.sin(_camera.angle),
            nodes = _s.graph.nodes(),
            ref = [];

        if (nodes.length < 2) return;

        // Getting and derotating the reference coordinates.
        for (var i = 0; i < 2; i++) {
          var n = nodes[i];
          if (n) {
            var aux = {
              x: n.x * cos + n.y * sin,
              y: n.y * cos - n.x * sin,
              renX: n[_prefix + 'x'],
              renY: n[_prefix + 'y'],
            };
            ref.push(aux);
          }
        }

        // Applying linear interpolation.
        x = ((x - ref[0].renX) / (ref[1].renX - ref[0].renX)) *
          (ref[1].x - ref[0].x) + ref[0].x;
        y = ((y - ref[0].renY) / (ref[1].renY - ref[0].renY)) *
          (ref[1].y - ref[0].y) + ref[0].y;

        // Drag multiple nodes, Keep distance
        var x2, y2;
        if(_a) {
          var activeNodes = _a.nodes();
          for(var i = 0; i < activeNodes.length; i++) {

            // Delete old reference
            if(_draggingNode != _node) {
              delete activeNodes[i].alphaX;
              delete activeNodes[i].alphaY;
            }

            // Calcul first position of activeNodes
            if(!activeNodes[i].alphaX || !activeNodes[i].alphaY) {

              activeNodes[i].alphaX = activeNodes[i].x - x;
              activeNodes[i].alphaY = activeNodes[i].y - y;
            }

            // Move activeNodes to keep same distance between dragged nodes and active nodes
            x2 = _node.x + activeNodes[i].alphaX;
            y2 = _node.y + activeNodes[i].alphaY;

            activeNodes[i].x = x2;
            activeNodes[i].y = y2;
          }
        }

        // Rotating the coordinates.
        _node.x = x * cos - y * sin;
        _node.y = y * cos + x * sin;

        _s.refresh({skipIndexation: true});

        _drag = true;
        _self.dispatchEvent('drag', {
          node: _node,
          captor: event,
          renderer: _renderer
        });

        _draggingNode = _node;
      }
    };
  };

  /**
   * Interface
   * ------------------
   *
   * > var dragNodesListener = sigma.plugins.dragNodes(s, s.renderers[0], a);
   */
  var _instance = {};

  /**
   * @param  {sigma} s The related sigma instance.
   * @param  {renderer} renderer The related renderer instance.
   * @param  {sigma.plugins.activeState} a The activeState plugin instance.
   */
  sigma.plugins.dragNodes = function(s, renderer, a) {
    // Create object if undefined
    if (!_instance[s.id]) {
      // Handle drag events:
      _instance[s.id] = new DragNodes(s, renderer, a);
    }

    s.bind('kill', function() {
      sigma.plugins.killDragNodes(s);
    });

    return _instance[s.id];
  };

  /**
   * This method removes the event listeners and kills the dragNodes instance.
   *
   * @param  {sigma} s The related sigma instance.
   */
  sigma.plugins.killDragNodes = function(s) {
    if (_instance[s.id] instanceof DragNodes) {
      _instance[s.id].unbindAll();
      delete _instance[s.id];
    }
  };

}).call(window);
