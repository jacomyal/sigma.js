;(function(undefined) {
  'use strict';

  var _methods = Object.create(null),
      _indexes = Object.create(null),
      _initBindings = Object.create(null),
      _methodBindings = Object.create(null),
      _defaultSettings = {
        immutable: true,
        clone: true
      },
      _defaultSettingsFunction = function(key) {
        return _defaultSettings[key];
      };

  /**
   * The graph constructor. It initializes the data and the indexes, and binds
   * the custom indexes and methods to its own scope.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the settings
   * object:
   *
   *   {boolean} clone     Indicates if the data have to be cloned in methods
   *                       to add nodes or edges.
   *   {boolean} immutable Indicates if nodes "id" values and edges "id",
   *                       "source" and "target" values must be set as
   *                       immutable.
   *
   * @param  {?configurable} settings Eventually a settings function.
   * @return {graph}                  The new graph instance.
   */
  var graph = function(settings) {
    var k,
        fn,
        data,
        _self = this;


    /**
     * DATA:
     * *****
     * Every data that is callable from graph methods are stored in this "data"
     * object. This object will be served as context for all these methods,
     * and it is possible to add other type of data in it.
     */
    data = {
      /**
       * SETTINGS FUNCTION:
       * ******************
       */
      settings: settings || _defaultSettingsFunction,

      /**
       * MAIN DATA:
       * **********
       */
      nodesArray: [],
      edgesArray: [],

      /**
       * GLOBAL INDEXES:
       * ***************
       * These indexes just index data by ids.
       */
      nodesIndex: Object.create(null),
      edgesIndex: Object.create(null),

      /**
       * LOCAL INDEXES:
       * **************
       * These indexes refer from node to nodes. Each key is an id, and each
       * value is the array of the ids of related nodes.
       */
      inNeighborsIndex: Object.create(null),
      outNeighborsIndex: Object.create(null),
      allNeighborsIndex: Object.create(null),

      inNeighborsCount: Object.create(null),
      outNeighborsCount: Object.create(null),
      allNeighborsCount: Object.create(null)
    };

    // Dispatch events:
    sigma.classes.dispatcher.extend(data);
    sigma.classes.dispatcher.extend(this);

    // Add a custom handler, to redispatch events from renderers:
    this._handler = (function(e) {
      var k,
          data = {};

      for (k in e.data)
        data[k] = e.data[k];

      this.dispatchEvent(e.type, data);
    }).bind(this);

    data.bind(
      [
        'activeNodes',
        'activeEdges'
      ],
      this._handler
    );

    // Execute bindings:
    for (k in _initBindings)
      _initBindings[k].call(data);

    // Add methods to both the scope and the data objects:
    for (k in _methods) {
      fn = __bindGraphMethod(k, data, _methods[k]);
      this[k] = fn;
      data[k] = fn;
    }
  };


  /**
   * A custom tool to bind methods such that function that are bound to it will
   * be executed anytime the method is called.
   *
   * @param  {string}   methodName The name of the method to bind.
   * @param  {object}   scope      The scope where the method must be executed.
   * @param  {function} fn         The method itself.
   * @return {function}            The new method.
   */
  function __bindGraphMethod(methodName, scope, fn) {
    var result = function() {
      var k,
          res;

      // Apply the method:
      res = fn.apply(scope, arguments);

      // Execute bound functions:
      for (k in _methodBindings[methodName])
        _methodBindings[methodName][k].apply(scope, arguments);

      // Return res:
      return res;
    };

    return result;
  }

  /**
   * This custom tool function removes every pair key/value from an hash. The
   * goal is to avoid creating a new object while some other references are
   * still hanging in some scopes...
   *
   * @param  {object} obj The object to empty.
   * @return {object}     The empty object.
   */
  function __emptyObject(obj) {
    var k;

    for (k in obj)
      if (!('hasOwnProperty' in obj) || obj.hasOwnProperty(k))
        delete obj[k];

    return obj;
  }




  /**
   * This global method adds a method that will be bound to the futurly created
   * graph instances.
   *
   * Since these methods will be bound to their scope when the instances are
   * created, it does not use the prototype. Because of that, methods have to
   * be added before instances are created to make them available.
   *
   * Here is an example:
   *
   *  > graph.addMethod('getNodesCount', function() {
   *  >   return this.nodesArray.length;
   *  > });
   *  >
   *  > var myGraph = new graph();
   *  > console.log(myGraph.getNodesCount()); // outputs 0
   *
   * @param  {string}   methodName The name of the method.
   * @param  {function} fn         The method itself.
   * @return {object}              The global graph constructor.
   */
  graph.addMethod = function(methodName, fn) {
    if (
      typeof methodName !== 'string' ||
      typeof fn !== 'function' ||
      arguments.length !== 2
    )
      throw 'addMethod: Wrong arguments.';

    if (_methods[methodName])
      throw 'The method "' + methodName + '" already exists.';

    _methods[methodName] = fn;
    _methodBindings[methodName] = Object.create(null);

    return this;
  };

  /**
   * This global methods attaches a function to a method. Anytime the specified
   * method is called, the attached function is called right after, with the
   * same arguments and in the same scope.
   *
   * To attach a function to the graph constructor, use 'constructor' as the
   * method name (first argument).
   *
   * The main idea is to have a clean way to keep custom indexes up to date,
   * for instance:
   *
   *  > var timesAddNodeCalled = 0;
   *  > graph.attach('addNode', 'timesAddNodeCalledInc', function() {
   *  >   timesAddNodeCalled++;
   *  > });
   *  >
   *  > var myGraph = new graph();
   *  > console.log(timesAddNodeCalled); // outputs 0
   *  >
   *  > myGraph.addNode({ id: '1' }).addNode({ id: '2' });
   *  > console.log(timesAddNodeCalled); // outputs 2
   *
   * @param  {string}   methodName The name of the related method or
   *                               "constructor".
   * @param  {string}   key        The key to identify the function to attach.
   * @param  {function} fn         The function to bind.
   * @return {object}              The global graph constructor.
   */
  graph.attach = function(methodName, key, fn) {
    if (
      typeof methodName !== 'string' ||
      typeof key !== 'string' ||
      typeof fn !== 'function' ||
      arguments.length !== 3
    )
      throw 'attach: Wrong arguments.';

    var bindings;

    if (methodName === 'constructor')
      bindings = _initBindings;
    else {
      if (!_methodBindings[methodName])
        throw 'The method "' + methodName + '" does not exist.';

      bindings = _methodBindings[methodName];
    }

    if (bindings[key])
      throw 'A function "' + key + '" is already attached ' +
            'to the method "' + methodName + '".';

    bindings[key] = fn;

    return this;
  };

  /**
   * This methods is just an helper to deal with custom indexes. It takes as
   * arguments the name of the index and an object containing all the different
   * functions to bind to the methods.
   *
   * Here is a basic example, that creates an index to keep the number of nodes
   * in the current graph. It also adds a method to provide a getter on that
   * new index:
   *
   *  > sigma.classes.graph.addIndex('nodesCount', {
   *  >   constructor: function() {
   *  >     this.nodesCount = 0;
   *  >   },
   *  >   addNode: function() {
   *  >     this.nodesCount++;
   *  >   },
   *  >   dropNode: function() {
   *  >     this.nodesCount--;
   *  >   }
   *  > });
   *  >
   *  > sigma.classes.graph.addMethod('getNodesCount', function() {
   *  >   return this.nodesCount;
   *  > });
   *  >
   *  > var myGraph = new sigma.classes.graph();
   *  > console.log(myGraph.getNodesCount()); // outputs 0
   *  >
   *  > myGraph.addNode({ id: '1' }).addNode({ id: '2' });
   *  > console.log(myGraph.getNodesCount()); // outputs 2
   *
   * @param  {string} name     The name of the index.
   * @param  {object} bindings The object containing the functions to bind.
   * @return {object}          The global graph constructor.
   */
  graph.addIndex = function(name, bindings) {
    if (
      typeof name !== 'string' ||
      Object(bindings) !== bindings ||
      arguments.length !== 2
    )
      throw 'addIndex: Wrong arguments.';

    if (_indexes[name])
      throw 'The index "' + name + '" already exists.';

    var k;

    // Store the bindings:
    _indexes[name] = bindings;

    // Attach the bindings:
    for (k in bindings)
      if (typeof bindings[k] !== 'function')
        throw 'The bindings must be functions.';
      else
        graph.attach(k, name, bindings[k]);

    return this;
  };




  /**
   * This method adds a node to the graph. The node must be an object, with a
   * string under the key "id". Except for this, it is possible to add any
   * other attribute, that will be preserved all along the manipulations.
   *
   * If the graph option "clone" has a truthy value, the node will be cloned
   * when added to the graph. Also, if the graph option "immutable" has a
   * truthy value, its id will be defined as immutable.
   *
   * @param  {object} node The node to add.
   * @return {object}      The graph instance.
   */
  graph.addMethod('addNode', function(node) {
    // Check that the node is an object and has an id:
    if (Object(node) !== node || arguments.length !== 1)
      throw 'addNode: Wrong arguments.';

    if (typeof node.id !== 'string')
      throw 'The node must have a string id.';

    if (this.nodesIndex[node.id])
      throw 'The node "' + node.id + '" already exists.';

    var k,
        id = node.id,
        validNode = Object.create(null);

    // Check the "clone" option:
    if (this.settings('clone')) {
      for (k in node)
        if (k !== 'id')
          validNode[k] = node[k];
    } else
      validNode = node;

    // Check the "immutable" option:
    if (this.settings('immutable'))
      Object.defineProperty(validNode, 'id', {
        value: id,
        enumerable: true
      });
    else
      validNode.id = id;

    // Add empty containers for edges indexes:
    this.inNeighborsIndex[id] = Object.create(null);
    this.outNeighborsIndex[id] = Object.create(null);
    this.allNeighborsIndex[id] = Object.create(null);

    this.inNeighborsCount[id] = 0;
    this.outNeighborsCount[id] = 0;
    this.allNeighborsCount[id] = 0;

    // Add the node to indexes:
    this.nodesArray.push(validNode);
    this.nodesIndex[validNode.id] = validNode;

    // Return the current instance:
    return this;
  });

  /**
   * This method adds an edge to the graph. The edge must be an object, with a
   * string under the key "id", and strings under the keys "source" and
   * "target" that design existing nodes. Except for this, it is possible to
   * add any other attribute, that will be preserved all along the
   * manipulations.
   *
   * If the graph option "clone" has a truthy value, the edge will be cloned
   * when added to the graph. Also, if the graph option "immutable" has a
   * truthy value, its id, source and target will be defined as immutable.
   *
   * @param  {object} edge The edge to add.
   * @return {object}      The graph instance.
   */
  graph.addMethod('addEdge', function(edge) {
    // Check that the edge is an object and has an id:
    if (Object(edge) !== edge || arguments.length !== 1)
      throw 'addEdge: Wrong arguments.';

    if (typeof edge.id !== 'string')
      throw 'The edge must have a string id.';

    if (typeof edge.source !== 'string' || !this.nodesIndex[edge.source])
      throw 'The edge source must have an existing node id.';

    if (typeof edge.target !== 'string' || !this.nodesIndex[edge.target])
      throw 'The edge target must have an existing node id.';

    if (this.edgesIndex[edge.id])
      throw 'The edge "' + edge.id + '" already exists.';

    var k,
        validEdge = Object.create(null);

    // Check the "clone" option:
    if (this.settings('clone')) {
      for (k in edge)
        if (k !== 'id' && k !== 'source' && k !== 'target')
          validEdge[k] = edge[k];
    } else
      validEdge = edge;

    // Check the "immutable" option:
    if (this.settings('immutable')) {
      Object.defineProperty(validEdge, 'id', {
        value: edge.id,
        enumerable: true
      });

      Object.defineProperty(validEdge, 'source', {
        value: edge.source,
        enumerable: true
      });

      Object.defineProperty(validEdge, 'target', {
        value: edge.target,
        enumerable: true
      });
    } else {
      validEdge.id = edge.id;
      validEdge.source = edge.source;
      validEdge.target = edge.target;
    }

    // Add the edge to indexes:
    this.edgesArray.push(validEdge);
    this.edgesIndex[validEdge.id] = validEdge;

    if (!this.inNeighborsIndex[edge.target][edge.source])
      this.inNeighborsIndex[edge.target][edge.source] = Object.create(null);
    this.inNeighborsIndex[edge.target][edge.source][edge.id] = edge;

    if (!this.outNeighborsIndex[edge.source][edge.target])
      this.outNeighborsIndex[edge.source][edge.target] = Object.create(null);
    this.outNeighborsIndex[edge.source][edge.target][edge.id] = edge;

    if (!this.allNeighborsIndex[edge.source][edge.target])
      this.allNeighborsIndex[edge.source][edge.target] = Object.create(null);
    this.allNeighborsIndex[edge.source][edge.target][edge.id] = edge;

    if (!this.allNeighborsIndex[edge.target][edge.source])
      this.allNeighborsIndex[edge.target][edge.source] = Object.create(null);
    this.allNeighborsIndex[edge.target][edge.source][edge.id] = edge;

    // Keep counts up to date:
    this.inNeighborsCount[edge.target]++;
    this.outNeighborsCount[edge.source]++;
    this.allNeighborsCount[edge.target]++;
    this.allNeighborsCount[edge.source]++;

    return this;
  });

  /**
   * This method drops a node from the graph. It also removes each edge that is
   * bound to it, through the dropEdge method. An error is thrown if the node
   * does not exist.
   *
   * @param  {string} id The node id.
   * @return {object}    The graph instance.
   */
  graph.addMethod('dropNode', function(id) {
    // Check that the arguments are valid:
    if (typeof id !== 'string' || arguments.length !== 1)
      throw 'dropNode: Wrong arguments.';

    if (!this.nodesIndex[id])
      throw 'The node "' + id + '" does not exist.';

    var i, k, l;

    // Remove the node from indexes:
    delete this.nodesIndex[id];
    for (i = 0, l = this.nodesArray.length; i < l; i++)
      if (this.nodesArray[i].id === id) {
        this.nodesArray.splice(i, 1);
        break;
      }

    // Remove related edges:
    for (i = this.edgesArray.length - 1; i >= 0; i--)
      if (this.edgesArray[i].source === id || this.edgesArray[i].target === id)
        this.dropEdge(this.edgesArray[i].id);

    // Remove related edge indexes:
    delete this.inNeighborsIndex[id];
    delete this.outNeighborsIndex[id];
    delete this.allNeighborsIndex[id];

    delete this.inNeighborsCount[id];
    delete this.outNeighborsCount[id];
    delete this.allNeighborsCount[id];

    for (k in this.nodesIndex) {
      delete this.inNeighborsIndex[k][id];
      delete this.outNeighborsIndex[k][id];
      delete this.allNeighborsIndex[k][id];
    }

    return this;
  });

  /**
   * This method drops an edge from the graph. An error is thrown if the edge
   * does not exist.
   *
   * @param  {string} id The edge id.
   * @return {object}    The graph instance.
   */
  graph.addMethod('dropEdge', function(id) {
    // Check that the arguments are valid:
    if (typeof id !== 'string' || arguments.length !== 1)
      throw 'dropEdge: Wrong arguments.';

    if (!this.edgesIndex[id])
      throw 'The edge "' + id + '" does not exist.';

    var i, l, edge;

    // Remove the edge from indexes:
    edge = this.edgesIndex[id];
    delete this.edgesIndex[id];
    for (i = 0, l = this.edgesArray.length; i < l; i++)
      if (this.edgesArray[i].id === id) {
        this.edgesArray.splice(i, 1);
        break;
      }

    delete this.inNeighborsIndex[edge.target][edge.source][edge.id];
    if (!Object.keys(this.inNeighborsIndex[edge.target][edge.source]).length)
      delete this.inNeighborsIndex[edge.target][edge.source];

    delete this.outNeighborsIndex[edge.source][edge.target][edge.id];
    if (!Object.keys(this.outNeighborsIndex[edge.source][edge.target]).length)
      delete this.outNeighborsIndex[edge.source][edge.target];

    delete this.allNeighborsIndex[edge.source][edge.target][edge.id];
    if (!Object.keys(this.allNeighborsIndex[edge.source][edge.target]).length)
      delete this.allNeighborsIndex[edge.source][edge.target];

    delete this.allNeighborsIndex[edge.target][edge.source][edge.id];
    if (!Object.keys(this.allNeighborsIndex[edge.target][edge.source]).length)
      delete this.allNeighborsIndex[edge.target][edge.source];

    this.inNeighborsCount[edge.target]--;
    this.outNeighborsCount[edge.source]--;
    this.allNeighborsCount[edge.source]--;
    this.allNeighborsCount[edge.target]--;

    return this;
  });

  /**
   * This method destroys the current instance. It basically empties each index
   * and methods attached to the graph.
   */
  graph.addMethod('kill', function() {
    // Delete arrays:
    this.nodesArray.length = 0;
    this.edgesArray.length = 0;
    delete this.nodesArray;
    delete this.edgesArray;

    // Delete indexes:
    delete this.nodesIndex;
    delete this.edgesIndex;
    delete this.inNeighborsIndex;
    delete this.outNeighborsIndex;
    delete this.allNeighborsIndex;
    delete this.inNeighborsCount;
    delete this.outNeighborsCount;
    delete this.allNeighborsCount;
  });

  /**
   * This method empties the nodes and edges arrays, as well as the different
   * indexes.
   *
   * @return {object} The graph instance.
   */
  graph.addMethod('clear', function() {
    this.nodesArray.length = 0;
    this.edgesArray.length = 0;

    // Due to GC issues, I prefer not to create new object. These objects are
    // only available from the methods and attached functions, but still, it is
    // better to prevent ghost references to unrelevant data...
    __emptyObject(this.nodesIndex);
    __emptyObject(this.edgesIndex);
    __emptyObject(this.nodesIndex);
    __emptyObject(this.inNeighborsIndex);
    __emptyObject(this.outNeighborsIndex);
    __emptyObject(this.allNeighborsIndex);
    __emptyObject(this.inNeighborsCount);
    __emptyObject(this.outNeighborsCount);
    __emptyObject(this.allNeighborsCount);

    return this;
  });

  /**
   * This method reads an object and adds the nodes and edges, through the
   * proper methods "addNode" and "addEdge".
   *
   * Here is an example:
   *
   *  > var myGraph = new graph();
   *  > myGraph.read({
   *  >   nodes: [
   *  >     { id: 'n0' },
   *  >     { id: 'n1' }
   *  >   ],
   *  >   edges: [
   *  >     {
   *  >       id: 'e0',
   *  >       source: 'n0',
   *  >       target: 'n1'
   *  >     }
   *  >   ]
   *  > });
   *  >
   *  > console.log(
   *  >   myGraph.nodes().length,
   *  >   myGraph.edges().length
   *  > ); // outputs 2 1
   *
   * @param  {object} g The graph object.
   * @return {object}   The graph instance.
   */
  graph.addMethod('read', function(g) {
    var i,
        a,
        l;

    a = g.nodes || [];
    for (i = 0, l = a.length; i < l; i++)
      this.addNode(a[i]);

    a = g.edges || [];
    for (i = 0, l = a.length; i < l; i++)
      this.addEdge(a[i]);

    return this;
  });

  /**
   * This methods returns one or several nodes, depending on how it is called.
   *
   * To get the array of nodes, call "nodes" without argument. To get a
   * specific node, call it with the id of the node. The get multiple node,
   * call it with an array of ids, and it will return the array of nodes, in
   * the same order.
   *
   * @param  {?(string|array)} v Eventually one id, an array of ids.
   * @return {object|array}      The related node or array of nodes.
   */
  graph.addMethod('nodes', function(v) {
    // Clone the array of nodes and return it:
    if (!arguments.length)
      return this.nodesArray.slice(0);

    // Return the related node:
    if (arguments.length === 1 && typeof v === 'string')
      return this.nodesIndex[v];

    // Return an array of the related node:
    if (
      arguments.length === 1 &&
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var i,
          l,
          a = [];

      for (i = 0, l = v.length; i < l; i++)
        if (typeof v[i] === 'string')
          a.push(this.nodesIndex[v[i]]);
        else
          throw 'nodes: Wrong arguments.';

      return a;
    }

    throw 'nodes: Wrong arguments.';
  });

  /**
   * This methods returns the degree of one or several nodes, depending on how
   * it is called. It is also possible to get incoming or outcoming degrees
   * instead by specifying 'in' or 'out' as a second argument.
   *
   * @param  {string|array} v     One id, an array of ids.
   * @param  {?string}      which Which degree is required. Values are 'in',
   *                              'out', and by default the normal degree.
   * @return {number|array}       The related degree or array of degrees.
   */
  graph.addMethod('degree', function(v, which) {
    // Check which degree is required:
    which = {
      'in': this.inNeighborsCount,
      'out': this.outNeighborsCount
    }[which || ''] || this.allNeighborsCount;

    // Return the related node:
    if (typeof v === 'string')
      return which[v];

    // Return an array of the related node:
    if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l,
          a = [];

      for (i = 0, l = v.length; i < l; i++)
        if (typeof v[i] === 'string')
          a.push(which[v[i]]);
        else
          throw 'degree: Wrong arguments.';

      return a;
    }

    throw 'degree: Wrong arguments.';
  });

  /**
   * This methods returns one or several edges, depending on how it is called.
   *
   * To get the array of edges, call "edges" without argument. To get a
   * specific edge, call it with the id of the edge. The get multiple edge,
   * call it with an array of ids, and it will return the array of edges, in
   * the same order.
   *
   * @param  {?(string|array)} v Eventually one id, an array of ids.
   * @return {object|array}      The related edge or array of edges.
   */
  graph.addMethod('edges', function(v) {
    // Clone the array of edges and return it:
    if (!arguments.length)
      return this.edgesArray.slice(0);

    // Return the related edge:
    if (arguments.length === 1 && typeof v === 'string')
      return this.edgesIndex[v];

    // Return an array of the related edge:
    if (
      arguments.length === 1 &&
      Object.prototype.toString.call(v) === '[object Array]'
    ) {
      var i,
          l,
          a = [];

      for (i = 0, l = v.length; i < l; i++)
        if (typeof v[i] === 'string')
          a.push(this.edgesIndex[v[i]]);
        else
          throw 'edges: Wrong arguments.';

      return a;
    }

    throw 'edges: Wrong arguments.';
  });

  /**
   * This methods set one or several nodes as 'active', depending on how it is
   * called.
   *
   * To activate the array of nodes, call "activateNodes" without argument. 
   * To activate a specific node, call it with the id of the node. To activate
   * multiple nodes, call it with an array of ids. To deactivate a node or a
   * set of nodes, call it with the second argument to "false".
   *
   * @param  {(string|array)} v        Eventually one id, an array of ids.
   * @param  {?boolean}       isActive The 'active' value.
   * @return {sigma.classes.graph}     Returns the instance itself.
   */
  graph.addMethod('activateNodes', function(v, isActive) {
    // Activate all nodes:
    if (!arguments.length) {
      this.nodesArray.forEach(function(o) {
        o.active = true;
      });
    }
    else if (arguments.length === 1 && typeof v === 'boolean') {
      this.nodesArray.forEach(function(o) {
        o.active = !!v;
      });
    }

    // Activate one node:
    else if (typeof v === 'string') {
      if (arguments.length === 1) {
        this.nodesIndex[v].active = true;
        
      }
      else if (arguments.length === 2) {
        this.nodesIndex[v].active = !!isActive;
      }
      else
        throw 'activateNodes: Wrong arguments.';
    }

    // Activate a set of nodes:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l,
          a = [];

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.nodesIndex[v[i]].active = true;
          else
            throw 'activateNodes: Wrong arguments.';
      }
      else if (arguments.length === 2) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.nodesIndex[v[i]].active = !!isActive;
          else
            throw 'activateNodes: Wrong arguments.';
      }
      else
        throw 'activateNodes: Wrong arguments.';
    }
    return this;
  });

  /**
   * This methods set one or several edges as 'active', depending on how it is
   * called.
   *
   * To activate the array of edges, call "activateEdges" without argument. 
   * To activate a specific edge, call it with the id of the edge. To activate
   * multiple edges, call it with an array of ids. To deactivate a edge or a
   * set of edges, call it with the second argument to "false".
   *
   * @param  {(string|array)} v        Eventually one id, an array of ids.
   * @param  {?boolean}       isActive The 'active' value.
   * @return {sigma.classes.graph}     Returns the instance itself.
   */
  graph.addMethod('activateEdges', function(v, isActive) {
    // Activate all edges:
    if (!arguments.length) {
      this.edgesArray.forEach(function(o) {
        o.active = true;
      });
    }
    else if (arguments.length === 1 && typeof v === 'boolean') {
      this.edgesArray.forEach(function(o) {
        o.active = !!v;
      });
    }

    // Activate one edge:
    else if (typeof v === 'string') {
      if (arguments.length === 1) {
        this.edgesIndex[v].active = true;
        
      }
      else if (arguments.length === 2) {
        this.edgesIndex[v].active = !!isActive;
      }
      else
        throw 'activateEdges: Wrong arguments.';
    }

    // Activate a set of edges:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i,
          l,
          a = [];

      if (arguments.length === 1) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.edgesIndex[v[i]].active = true;
          else
            throw 'activateEdges: Wrong arguments.';
      }
      else if (arguments.length === 2) {
        for (i = 0, l = v.length; i < l; i++)
          if (typeof v[i] === 'string')
            this.edgesIndex[v[i]].active = !!isActive;
          else
            throw 'activateEdges: Wrong arguments.';
      }
      else
        throw 'activateEdges: Wrong arguments.';
    }
    return this;
  });

  graph.addIndex('activeNodesIndex', {
    constructor: function() {
      this.activeNodesIndex = Object.create(null);
    },
    addNode: function(n) {
      if (n.active)
        this.activeNodesIndex[n.id] = this.nodesIndex[n.id];
    },
    dropNode: function(n) {
      delete this.activeNodesIndex[n.id];
    },
    activateNodes: function(v, isActive) {
      // Index all nodes
      if (!arguments.length) {
        this.nodesArray.forEach(function(o) {
          this.activeNodesIndex[o.id] = o;
        }, this);
      }
      else if (arguments.length === 1 && typeof v === 'boolean') {
        if (v) {
          this.nodesArray.forEach(function(o) {
            this.activeNodesIndex[o.id] = o;
          }, this);
        } else {
          this.activeNodesIndex = Object.create(null);
        }
      }

      // Index one node:
      else if (typeof v === 'string') {
        if (arguments.length === 1) {
          this.activeNodesIndex[v] = this.nodesIndex[v];
        }
        else if (arguments.length === 2) {
          if (isActive)
            this.activeNodesIndex[v] = this.nodesIndex[v];
          else
            delete this.activeNodesIndex[v];
        }
        else
          throw 'activateNodesIndex: Wrong arguments.';
      }

      // Index a set of nodes:
      else if (Object.prototype.toString.call(v) === '[object Array]') {
        var i,
            l,
            a = [];

        if (arguments.length === 1) {
          for (i = 0, l = v.length; i < l; i++)
            if (typeof v[i] === 'string')
              this.activeNodesIndex[v[i]] = this.nodesIndex[v[i]];
            else
              throw 'activateNodesIndex: Wrong arguments.';
        }
        else if (arguments.length === 2) {
          for (i = 0, l = v.length; i < l; i++)
            if (typeof v[i] === 'string') {
              if (isActive)
                this.activeNodesIndex[v[i]] = this.nodesIndex[v[i]];
              else
                delete this.activeNodesIndex[v[i]];
            }
            else
              throw 'activateNodesIndex: Wrong arguments.';
        }
        else
          throw 'activateNodesIndex: Wrong arguments.';
      }

      this.dispatchEvent('activeNodes', {
        nodes: this.activeNodes()
      });
    }
  });

  graph.addIndex('activeEdgesIndex', {
    constructor: function() {
      this.activeEdgesIndex = Object.create(null);
    },
    addEdge: function(e) {
      if (e.active)
        this.activeEdgesIndex[e.id] = this.edgesIndex[e.id];
    },
    dropEdge: function(e) {
      delete this.activeEdgesIndex[e.id];
    },
    activateEdges: function(v, isActive) {
      // Index all edges
      if (!arguments.length) {
        this.edgesArray.forEach(function(o) {
          this.activeEdgesIndex[o.id] = o;
        }, this);
      }
      else if (arguments.length === 1 && typeof v === 'boolean') {
        if (v) {
          this.edgesArray.forEach(function(o) {
            this.activeEdgesIndex[o.id] = o;
          }, this);
        } else {
          this.activeEdgesIndex = Object.create(null);
        }
      }

      // Index one edge:
      else if (typeof v === 'string') {
        if (arguments.length === 1) {
          this.activeEdgesIndex[v] = this.edgesIndex[v];
        }
        else if (arguments.length === 2) {
          if (isActive)
            this.activeEdgesIndex[v] = this.edgesIndex[v];
          else
            delete this.activeEdgesIndex[v];
        }
        else
          throw 'activeEdgesIndex: Wrong arguments.';
      }

      // Index a set of edges:
      else if (Object.prototype.toString.call(v) === '[object Array]') {
        var i,
            l,
            a = [];

        if (arguments.length === 1) {
          for (i = 0, l = v.length; i < l; i++)
            if (typeof v[i] === 'string')
              this.activeEdgesIndex[v[i]] = this.edgesIndex[v[i]];
            else
              throw 'activeEdgesIndex: Wrong arguments.';
        }
        else if (arguments.length === 2) {
          for (i = 0, l = v.length; i < l; i++)
            if (typeof v[i] === 'string') {
              if (isActive)
                this.activeEdgesIndex[v[i]] = this.edgesIndex[v[i]];
              else
                delete this.activeEdgesIndex[v[i]];
            }
            else
              throw 'activeEdgesIndex: Wrong arguments.';
        }
        else
          throw 'activeEdgesIndex: Wrong arguments.';
      }

      this.dispatchEvent('activeEdges', {
        edges: this.activeEdges()
      });
    }
  });

  graph.addMethod('activeNodes', function() {
    // Return an array of the active nodes:
    var a = [];
    for(var id in this.activeNodesIndex) {
        a.push(this.activeNodesIndex[id]);
    }
    return a;
  });

  graph.addMethod('activeEdges', function() {
    // Return an array of the active edges:
    var a = [];
    for(var id in this.activeEdgesIndex) {
        a.push(this.activeEdgesIndex[id]);
    }
    return a;
  });




  /**
   * EXPORT:
   * *******
   */
  if (typeof sigma !== 'undefined') {
    sigma.classes = sigma.classes || Object.create(null);
    sigma.classes.graph = graph;
  } else if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = graph;
    exports.graph = graph;
  } else
    this.graph = graph;
}).call(this);
