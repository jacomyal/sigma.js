;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Select
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.2
   */

  var _s = null,
      _a = null,
      _kbd = null,
      _body = null,
      _spacebar = false,
      _drag = false,
      _dragListener = null;

  /**
   * Utility function to make the difference between two arrays.
   * See https://github.com/lodash/lodash/blob/master/lodash.js#L1627
   *
   * @param  {array} array  The array to inspect.
   * @param  {array} values The values to exclude.
   * @return {array}        Returns the new array of filtered values.
   */
  function difference(array, values) {
    var length = array ? array.length : 0;
    if (!length) {
      return [];
    }
    var index = -1,
        result = [],
        valuesLength = values.length;

    outer:
    while (++index < length) {
      var value = array[index];

      if (value === value) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === value) {
            continue outer;
          }
        }
        result.push(value);
      }
      else if (values.indexOf(value) < 0) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * This fuction handles the node click event. The clicked nodes are activated.
   * The clicked active nodes are deactivated.
   * If the Ctrl or Meta key is hold, it adds the nodes to the list of active
   * nodes instead of clearing the list. It clears the list of active edges. It
   * prevent nodes to be selected while dragging.
   *
   * @param {event} The event.
   */
  function clickNodesHandler(event) {
    // Prevent nodes to be selected while dragging:
    if (_drag)
      return;

    var targets = event.data.node.map(function(n) {
      return n.id;
    });
    var actives = _a.nodes().map(function(n) {
      return n.id;
    });
    var newTargets = difference(targets, actives);

    _a.dropEdges();

    if (_spacebar) {
      var existingTargets = difference(targets, newTargets);
      _a.dropNodes(existingTargets);
    }
    else {
      _a.dropNodes();
      if (actives.length > 1) {
        _a.addNodes(targets);
      }
    }

    _a.addNodes(newTargets);

    _s.refresh({skipIndexation: true});
  };

  /**
   * This fuction handles the edge click event. The clicked edges are activated.
   * The clicked active edges are deactivated.
   * If the Ctrl or Meta key is hold, it adds the edges to the list of active
   * edges instead of clearing the list. It clears the list of active nodes. It
   * prevent edges to be selected while dragging.
   *
   * @param {event} The event.
   */
  function clickEdgesHandler(event) {
    // Prevent edges to be selected while dragging:
    if (_drag)
      return;

    var targets = event.data.edge.map(function(e) {
      return e.id;
    });
    var actives = _a.edges().map(function(e) {
      return e.id;
    });
    var newTargets = difference(targets, actives);

    _a.dropNodes();

    if (_spacebar) {
      var existingTargets = difference(targets, newTargets);
      _a.dropEdges(existingTargets);
    }
    else {
      _a.dropEdges();
      if (actives.length > 1) {
        _a.addEdges(targets);
      }
    }

    _a.addEdges(newTargets);

    _s.refresh({skipIndexation: true});
  };

  /**
   * This function handles the 'drag' event.
   */
  function dragHandler() {
    _drag = true;
  };

  /**
   * This function handles the 'drop' event.
   */
  function dropHandler() {
    setTimeout(function() {
      _drag = false;
    }, 300);
  };

  function keyDown(event) {
    _spacebar = event.which === 32;
  }

  function keyUp(event) {
    _spacebar = false;
  }

  // Select all nodes or deselect them if all nodes are active
  function spaceA() {
    _a.dropEdges();

    if (_a.nodes().length === _s.graph.nodes().length) {
      _a.dropNodes();
    }
    else {
      _a.addNodes();
    }
    _s.refresh({skipIndexation: true});
  }

  // Deselect all nodes and edges
  function spaceU() {
    _a.dropEdges();
    _a.dropNodes();
    _s.refresh({skipIndexation: true});
  }

  // Drop selected nodes and edges
  function spaceDel() {
    _s.graph.dropNodes(_a.nodes().map(function(n) { return n.id; }));
    _s.graph.dropEdges(_a.edges().map(function(e) { return e.id; }));
    _s.refresh();
  }

  // Select neighbors of selected nodes
  function spaceE() {
    _a.addNeighbors();
    _s.refresh({skipIndexation: true});
  }

  // Select isolated nodes (i.e. of degree 0)
  function spaceI() {
    _a.dropEdges();
    _a.setNodesBy(function(n) {
      return _s.graph.degree(n.id) === 0;
    });
    _s.refresh({skipIndexation: true});
  }

  // Select leaf nodes (i.e. nodes with 1 adjacent node)
  function spaceL() {
    _a.dropEdges();
    _a.setNodesBy(function(n) {
      return _s.graph.adjacentNodes(n.id).length === 1;
    });
    _s.refresh({skipIndexation: true});
  }

  /**
   * Interface
   * ------------------
   */

  /**
   * This plugin enables the activation of nodes and edges by clicking on them
   * (i.e. selection). Multiple nodes or edges may be activated by holding the
   * Ctrl or Meta key while clicking on them (i.e. multi selection).
   *
   * @param  {sigma}                     s The related sigma instance.
   * @param  {sigma.plugins.activeState} a The activeState plugin instance.
   */
  sigma.plugins.select = function(s, a) {
    _s = s;
    _a = a;
    _body = _body || document.getElementsByTagName('body')[0];

    _s.bind('clickNodes', clickNodesHandler);
    _s.bind('clickEdges', clickEdgesHandler);

    _body.addEventListener('keydown', keyDown, false);
    _body.addEventListener('keyup', keyUp, false);

    if (sigma.plugins.dragNodes) {
      // Handle drag events:
      _dragListener = sigma.plugins.dragNodes(_s, _s.renderers[0]);
      _dragListener.bind('drag', dragHandler);
      _dragListener.bind('drop', dropHandler);
    }

    if (sigma.plugins.keyboard) {
      _kbd = sigma.plugins.keyboard(s);
      _kbd.bind('32+65 18+32+65', spaceA);
      _kbd.bind('32+85 18+32+85', spaceU);
      _kbd.bind('32+46 18+32+46', spaceDel);
      _kbd.bind('32+69 18+32+69', spaceE);
      _kbd.bind('32+73 18+32+73', spaceI);
      _kbd.bind('32+76 18+32+76', spaceL);
    }

    _s.bind('kill', function() {
      sigma.plugins.killSelect();
    });
  };

  /**
   *  This function kills the select instance.
   */
  sigma.plugins.killSelect = function() {
    if (_s) {
      _s.unbind('clickNodes', clickNodesHandler);
      _s.unbind('clickEdges', clickEdgesHandler);
    }
    if (_dragListener) {
      _dragListener.unbind('drag', dragHandler);
      _dragListener.unbind('drop', dropHandler);
    }
    if (_body) {
      _body.removeEventListener('keydown', keyDown, false);
      _body.removeEventListener('keyup', keyUp, false);
    }

    _s = null;
    _a = null;
    _drag = false;
    _dragListener = null
  };

}).call(this);
