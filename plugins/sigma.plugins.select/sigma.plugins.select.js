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
   * @version 0.1
   */

  var _s = null,
      _a = null,
      _drag = false,
      _dragListener = null;


  /**
   * This fuction refreshes sigma without refreshing the edge quadtree.
   *
   * @param {sigma} The sigma instance.
   */
  function refresh(s) {
    // Do not refresh edgequadtree:
    var k,
        c;
    for (k in s.cameras) {
      c = s.cameras[k];
      if (c.edgequadtree !== undefined)
        c.edgequadtree._enabled = false;
    }

    // Do refresh:
    s.refresh();

    // Allow to refresh edgequadtree:
    var k,
        c;
    for (k in s.cameras) {
      c = s.cameras[k];
      if (c.edgequadtree !== undefined)
        c.edgequadtree._enabled = true;
    }
  };

  /**
   * This fuction handles the node click event. The clicked nodes are activated.
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

    // Deactivate all edges:
    _a.dropEdges();

    if (!event.data.captor.ctrlKey && !event.data.captor.metaKey) {
      // Deactivate all nodes:
      _a.dropNodes();
    }

    // Activate the target nodes:
    _a.addNodes(
      event.data.node.map(function(n) {
        return n.id;
      })
    );

    refresh(_s);
  };

  /**
   * This fuction handles the edge click event. The clicked edges are activated.
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

    // Deactivate all nodes:
    _a.dropNodes();

    if (!event.data.captor.ctrlKey && !event.data.captor.metaKey) {
      // Deactivate all edges:
      _a.dropEdges();
    }

    // Activate the target edges:
    _a.addEdges(
      event.data.edge.map(function(e) {
        return e.id;
      })
    );
    
    refresh(_s);
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

    _s.bind('clickNodes', clickNodesHandler);
    _s.bind('clickEdges', clickEdgesHandler);

    if (sigma.plugins.dragNodes !== undefined) {
      // Handle drag events:
      _dragListener = sigma.plugins.dragNodes(_s, _s.renderers[0]);
      _dragListener.bind('drag', dragHandler);
      _dragListener.bind('drop', dropHandler);
    }
  };

  /**
   *  This function kills the select instance.
   */
  sigma.plugins.killSelect = function() {
    if (_s !== null) {
      _s.unbind('clickNodes', clickNodesHandler);
      _s.unbind('clickEdges', clickEdgesHandler);
    }
    if (_dragListener !== null) {
      _dragListener.unbind('drag', dragHandler);
      _dragListener.unbind('drop', dropHandler);
    }
    _s = null;
    _a = null;
    _drag = false;
    _dragListener = null
  };

}).call(this);
