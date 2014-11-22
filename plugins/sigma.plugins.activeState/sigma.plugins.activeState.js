;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma ActiveState
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1
   */

  var _instance = null,
      // Indexes are working now, i.e. before the ActiveState constructor is
      // called, to index active nodes and edges when a graph object is passed
      // to sigma at instantiation.
      _activeNodesIndex = Object.create(null),
      _activeEdgesIndex = Object.create(null),
      _g = null,
      _enableEvents = true;


  /**
   * Dispatch the 'activeNodes' event.
   */
  function dispatchNodeEvent() {
    if(_instance !== null && _enableEvents) {
      _instance.dispatchEvent('activeNodes');
    }
  };

  /**
   * Dispatch the 'activeEdges' event.
   */
  function dispatchEdgeEvent() {
    if(_instance !== null && _enableEvents) {
      _instance.dispatchEvent('activeEdges');
    }
  };

  /**
   * Attach methods to the graph to keep indexes updated.
   * They may be called before the ActiveState constructor is called.
   * ------------------
   */

  // Index the node after its insertion in the graph if `n.active` is `true`.
  sigma.classes.graph.attach(
    'addNode',
    'sigma.plugins.activeState.addNode',
    function(n) {
      if (n.active) {
        _activeNodesIndex[n.id] = this.nodesIndex[n.id];
        dispatchNodeEvent();
      }
    }
  );

  // Index the edge after its insertion in the graph if `e.active` is `true`.
  sigma.classes.graph.attach(
    'addEdge',
    'sigma.plugins.activeState.addEdge',
    function(e) {
      if (e.active) {
        _activeEdgesIndex[e.id] = this.edgesIndex[e.id];
        dispatchEdgeEvent();
      }
    }
  );

  // Deindex the node before its deletion from the graph if `n.active` is
  // `true`.
  sigma.classes.graph.attachBefore(
    'dropNode',
    'sigma.plugins.activeState.dropNode',
    function(id) {
      if (this.nodesIndex[id] !== undefined) {
        var active = this.nodesIndex[id].active;
        delete _activeNodesIndex[id];
        if (active) {
          dispatchNodeEvent();
        }
      }
    }
  );

  // Deindex the edge before its deletion from the graph if `e.active` is
  // `true`.
  sigma.classes.graph.attachBefore(
    'dropEdge',
    'sigma.plugins.activeState.dropEdge',
    function(id) {
      if (this.edgesIndex[id] !== undefined) {
        var active = this.edgesIndex[id].active;
        delete _activeEdgesIndex[id];
        if (active) {
          dispatchEdgeEvent();
        }
      }
    }
  );

  // Deindex all nodes and edges before the graph is cleared.
  sigma.classes.graph.attachBefore(
    'clear',
    'sigma.plugins.activeState.clear',
    function() {
      _activeNodesIndex = Object.create(null);
      _activeEdgesIndex = Object.create(null);
      dispatchEdgeEvent();
    }
  );

  /**
   * ActiveState Object
   * ------------------
   * @param  {sigma} s                   The sigma instance.
   * @return {sigma.plugins.activeState} The instance itself.
   */
  function ActiveState(s) {
    _instance = this;
    _g = s.graph;

    if (_activeNodesIndex === null) {
      // It happens after a kill. Index nodes:
      _activeNodesIndex = Object.create(null);
      _g.nodes().forEach(function(o) {
        if (o.active)
          _activeNodesIndex[o.id] = o;
      });
    }
    if (_activeEdgesIndex === null) {
      // It happens after a kill. Index edges:
      _activeEdgesIndex = Object.create(null);
      _g.edges().forEach(function(o) {
        if (o.active)
          _activeEdgesIndex[o.id] = o;
      });
    }

    sigma.classes.dispatcher.extend(this);

    // Binding on kill to properly clear the references
    s.bind('kill', function() {
      _instance.kill();
    });
  };

  ActiveState.prototype.kill = function() {
    this.unbind();
    _activeNodesIndex = null;
    _activeEdgesIndex = null;
    _g = null;
    _instance = null;
  };

  /**
   * This method will set one or several nodes as 'active', depending on how it
   * is called.
   *
   * To activate allnodes, call it without argument.
   * To activate a specific node, call it with the id of the node. To activate
   * multiple nodes, call it with an array of ids.
   *
   * @param  {(number|string|array)} v   Eventually one id, an array of ids.
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.addNodes = function(v) {
    var n;

    // Activate all nodes:
    if (!arguments.length) {
      _g.nodes().forEach(function(o) {
        if (!o.hidden) {
          o.active = true;
          _activeNodesIndex[o.id] = o;
        }
      });
    }

    // Activate one node:
    else if (typeof v === 'string' || typeof v === 'number') {
      if (arguments.length === 1) {
        n = _g.nodes(v);
        if (!n.hidden) {
          n.active = true;
          _activeNodesIndex[v] = n;
        }
      }
      else
        throw 'activateState.addNodes: Wrong arguments.';
    }

    // Activate a set of nodes:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l,
          a = [];

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number') {
            n = _g.nodes(v[i]);
            if (!n.hidden) {
              n.active = true;
              _activeNodesIndex[v[i]] = n;
            }
          }
          else
            throw 'activateState.addNodes: Wrong arguments.';
      }
      else
        throw 'activateState.addNodes: Wrong arguments.';
    }

    dispatchNodeEvent();
    return this;
  };

  /**
   * This method will set one or several visible edges as 'active', depending
   * on how it is called.
   *
   * To activate all visible edges, call it without argument.
   * To activate a specific visible edge, call it with the id of the edge.
   * To activate multiple visible edges, call it with an array of ids.
   *
   * @param  {(number|string|array)} v   Eventually one id, an array of ids.
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.addEdges = function(v) {
    var e;

    // Activate all edges:
    if (!arguments.length) {
      _g.edges().forEach(function(o) {
        if (!o.hidden) {
          o.active = true;
          _activeEdgesIndex[o.id] = o;
        }
      });
    }

    // Activate one edge:
    else if (typeof v === 'string' || typeof v === 'number') {
      if (arguments.length === 1) {
        e = _g.edges(v);
        if (!e.hidden) {
          e.active = true;
          _activeEdgesIndex[v] = e;
        }
      }
      else
        throw 'activateState.addEdges: Wrong arguments.';
    }

    // Activate a set of edges:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l,
          a = [];

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number') {
            e = _g.edges(v[i]);
            if (!e.hidden) {
              e.active = true;
              _activeEdgesIndex[v[i]] = e;
            }
          }
          else
            throw 'activateState.addEdges: Wrong arguments.';
      }
      else
        throw 'activateState.addEdges: Wrong arguments.';
    }

    dispatchEdgeEvent();
    return this;
  };

  /**
   * This method will set one or several nodes as 'inactive', depending on how
   * it is called.
   *
   * To deactivate all nodes, call it without argument.
   * To deactivate a specific node, call it with the id of the node. To
   * deactivate multiple nodes, call it with an array of ids.
   *
   * @param  {(number|string|array)} v   Eventually one id, an array of ids.
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.dropNodes = function(v) {
    // Deactivate all nodes:
    if (!arguments.length) {
      _g.nodes().forEach(function(o) {
        o.active = false;
        delete _activeNodesIndex[o.id];
      });
    }

    // Deactivate one node:
    else if (typeof v === 'string' || typeof v === 'number') {
      if (arguments.length === 1) {
        _g.nodes(v).active = false;
        delete _activeNodesIndex[v];
      }
      else
        throw 'activateState.dropNodes: Wrong arguments.';
    }

    // Deactivate a set of nodes:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l;

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number') {
            _g.nodes(v[i]).active = false;
            delete _activeNodesIndex[v[i]];
          }
          else
            throw 'activateState.dropNodes: Wrong arguments.';
      }
      else
        throw 'activateState.dropNodes: Wrong arguments.';
    }

    dispatchNodeEvent();
    return this;
  };

  /**
   * This method will set one or several edges as 'inactive', depending on how
   * it is called.
   *
   * To deactivate all edges, call it without argument.
   * To deactivate a specific edge, call it with the id of the edge. To
   * deactivate multiple edges, call it with an array of ids.
   *
   * @param  {(number|string|array)} v   Eventually one id, an array of ids.
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.dropEdges = function(v) {
    // Deactivate all edges:
    if (!arguments.length) {
      _g.edges().forEach(function(o) {
        o.active = false;
        delete _activeEdgesIndex[o.id];
      });
    }

    // Deactivate one edge:
    else if (typeof v === 'string' || typeof v === 'number') {
      if (arguments.length === 1) {
        _g.edges(v).active = false;
        delete _activeEdgesIndex[v];
      }
      else
        throw 'activateState.dropEdges: Wrong arguments.';
    }

    // Deactivate a set of edges:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l;

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string' || typeof v[i] === 'number') {
            _g.edges(v[i]).active = false;
            delete _activeEdgesIndex[v[i]];
          }
          else
            throw 'activateState.dropEdges: Wrong arguments.';
      }
      else
        throw 'activateState.dropEdges: Wrong arguments.';
    }

    dispatchEdgeEvent();
    return this;
  };

  /**
   * This method will set the visible neighbors of all active nodes as 'active'.
   *
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.addNeighbors = function() {
    if (!('adjacentNodes' in _g))
      throw 'Missing method graph.adjacentNodes';

    var a,
        id;

    a = Object.keys(_activeNodesIndex);

    if (a.length) {
      for (id in _activeNodesIndex) {
        _g.adjacentNodes(id).forEach(function (adj) {
          if (!adj.hidden)
            a.push(adj.id);
        });
      };

      _enableEvents = false;
      this.dropNodes().dropEdges();
      _enableEvents = true;
      this.addNodes(a);
    }

    return this;
  };

  /**
   * This method will set the nodes that pass a specified truth test (i.e.
   * predicate) as 'active', or as 'inactive' otherwise. The method must be
   * called with the predicate, which is a function that takes a node as
   * argument and returns a boolean. The context of the predicate is
   * {{sigma.graph}}.
   *
   * // Activate isolated nodes:
   * > var activeState = new sigma.plugins.activeState(sigInst.graph);
   * > activeState.setNodesBy(function(n) {
   * >   return this.degree(n.id) === 0;
   * > });
   *
   * @param  {function}                  fn The predicate.
   * @return {sigma.plugins.activeState}    Returns the instance itself.
   */
  ActiveState.prototype.setNodesBy = function(fn) {
    var a = [];

    _g.nodes().forEach(function (o) {
      if (fn.call(_g, o)) {
        if (!o.hidden)
          a.push(o.id);
      }
    });

    _enableEvents = false;
    this.dropNodes();
    _enableEvents = true;
    this.addNodes(a);

    return this;
  };

  /**
   * This method will set the edges that pass a specified truth test (i.e.
   * predicate) as 'active', or as 'inactive' otherwise. The method must be
   * called with the predicate, which is a function that takes a node as
   * argument and returns a boolean. The context of the predicate is
   * {{sigma.graph}}.
   *
   * @param  {function}                  fn The predicate.
   * @return {sigma.plugins.activeState}    Returns the instance itself.
   */
  ActiveState.prototype.setEdgesBy = function(fn) {
    var a = [];

    _g.edges().forEach(function (o) {
      if (fn.call(_g, o)) {
        if (!o.hidden)
          a.push(o.id);
      }
    });

    _enableEvents = false;
    this.dropEdges();
    _enableEvents = true;
    this.addEdges(a);

    return this;
  };

  /**
   * This method will set the active nodes as 'inactive' and the other nodes as
   * 'active'.
   *
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.invertNodes = function() {
    var a = _g.nodes().filter(function (o) {
      return !o.hidden && !o.active;
    }).map(function (o) {
      return o.id;
    });

    _enableEvents = false;
    this.dropNodes();
    _enableEvents = true;
    this.addNodes(a);

    return this;
  };

  /**
   * This method will set the active edges as 'inactive' and the other edges as
   * 'active'.
   *
   * @return {sigma.plugins.activeState} Returns the instance itself.
   */
  ActiveState.prototype.invertEdges = function() {
    var a = _g.edges().filter(function (o) {
      return !o.hidden && !o.active;
    }).map(function (o) {
      return o.id;
    });

    _enableEvents = false;
    this.dropEdges();
    _enableEvents = true;
    this.addEdges(a);

    return this;
  };

  /**
   * This method returns an array of the active nodes.
   * @return {array} The active nodes.
   */
  ActiveState.prototype.nodes = function() {
    var id,
        a = [];
    for (id in _activeNodesIndex) {
        a.push(_activeNodesIndex[id]);
    }
    return a;
  };

  /**
   * This method returns an array of the active edges.
   * @return {array} The active edges.
   */
  ActiveState.prototype.edges = function() {
    var id,
        a = [];
    for (id in _activeEdgesIndex) {
        a.push(_activeEdgesIndex[id]);
    }
    return a;
  };


  /**
   * Interface
   * ------------------
   */

  /**
   * @param {sigma} s The sigma instance.
   */
  sigma.plugins.activeState = function(s) {
    // Create object if undefined
    if (!_instance) {
      _instance = new ActiveState(s);
    }
    return _instance;
  };

  /**
   *  This function kills the activeState instance.
   */
  sigma.plugins.killActiveState = function() {
    if (_instance instanceof ActiveState) {
      _instance.kill();
      _instance = null;
    }
  };

}).call(this);
