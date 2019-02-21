const _methods = Object.create(null);
const _indexes = Object.create(null);
const _initBindings = Object.create(null);
const _methodBindings = Object.create(null);
const _methodBeforeBindings = Object.create(null);
const _defaultSettings = {
  immutable: true,
  clone: true
};
const _defaultSettingsFunction = function _defaultSettingsFunction(key) {
  return _defaultSettings[key];
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
function bindGraphMethod(methodName, scope, fn) {
  return (...boundArgs) => {
    // Execute "before" bound functions:
    const beforeBindings = _methodBeforeBindings[methodName];
    Object.keys(beforeBindings).forEach(k => {
      beforeBindings[k].apply(scope, boundArgs);
    });

    // Apply the method:
    const res = fn.apply(scope, boundArgs);

    // Execute bound functions:
    const methodBindings = _methodBindings[methodName];
    Object.keys(methodBindings).forEach(k => {
      methodBindings[k].apply(scope, boundArgs);
    });

    // Return res:
    return res;
  };
}

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
function graph(settings) {
  /**
   * DATA:
   * *****
   * Every data that is callable from graph methods are stored in this "data"
   * object. This object will be served as context for all these methods,
   * and it is possible to add other type of data in it.
   */
  const data = {
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

  // Execute bindings:
  Object.keys(_initBindings).forEach(k => _initBindings[k].call(data));

  // Add methods to both the scope and the data objects:
  Object.keys(_methods).forEach(methodName => {
    const method = bindGraphMethod(methodName, data, _methods[methodName]);
    this[methodName] = method;
    data[methodName] = method;
  });
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
  Object.keys(obj).forEach(k => {
    // eslint-disable-next-line no-prototype-builtins
    if (!("hasOwnProperty" in obj) || obj.hasOwnProperty(k)) {
      delete obj[k];
    }
  });
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
graph.addMethod = function addMethod(methodName, fn) {
  if (
    typeof methodName !== "string" ||
    typeof fn !== "function" ||
    arguments.length !== 2
  )
    throw new Error("addMethod: Wrong arguments.");

  if (_methods[methodName] || graph[methodName])
    throw new Error(`The method "${methodName}" already exists.`);

  _methods[methodName] = fn;
  _methodBindings[methodName] = Object.create(null);
  _methodBeforeBindings[methodName] = Object.create(null);

  return this;
};

/**
 * This global method returns true if the method has already been added, and
 * false else.
 *
 * Here are some examples:
 *
 *  > graph.hasMethod('addNode'); // returns true
 *  > graph.hasMethod('hasMethod'); // returns true
 *  > graph.hasMethod('unexistingMethod'); // returns false
 *
 * @param  {string}  methodName The name of the method.
 * @return {boolean}            The result.
 */
graph.hasMethod = function hasMethod(methodName) {
  return !!(_methods[methodName] || graph[methodName]);
};

/**
 * This global methods attaches a function to a method. Anytime the specified
 * method is called, the attached function is called right after, with the
 * same arguments and in the same scope. The attached function is called
 * right before if the last argument is true, unless the method is the graph
 * constructor.
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
 * The idea for calling a function before is to provide pre-processors, for
 * instance:
 *
 *  > var colorPalette = { Person: '#C3CBE1', Place: '#9BDEBD' };
 *  > graph.attach('addNode', 'applyNodeColorPalette', function(n) {
 *  >   n.color = colorPalette[n.category];
 *  > }, true);
 *  >
 *  > var myGraph = new graph();
 *  > myGraph.addNode({ id: 'n0', category: 'Person' });
 *  > console.log(myGraph.nodes('n0').color); // outputs '#C3CBE1'
 *
 * @param  {string}   methodName The name of the related method or
 *                               "constructor".
 * @param  {string}   key        The key to identify the function to attach.
 * @param  {function} fn         The function to bind.
 * @param  {boolean}  before     If true the function is called right before.
 * @return {object}              The global graph constructor.
 */
graph.attach = function attach(methodName, key, fn, before) {
  if (
    typeof methodName !== "string" ||
    typeof key !== "string" ||
    typeof fn !== "function" ||
    arguments.length < 3 ||
    arguments.length > 4
  )
    throw new Error("attach: Wrong arguments.");

  let bindings;

  if (methodName === "constructor") bindings = _initBindings;
  else if (before) {
    if (!_methodBeforeBindings[methodName])
      throw new Error(`The method "${methodName}" does not exist.`);

    bindings = _methodBeforeBindings[methodName];
  } else {
    if (!_methodBindings[methodName])
      throw new Error(`The method "${methodName}" does not exist.`);

    bindings = _methodBindings[methodName];
  }

  if (bindings[key])
    throw new Error(
      `A function "${key}" is already attached ` +
        `to the method "${methodName}".`
    );

  bindings[key] = fn;

  return this;
};

/**
 * Alias of attach(methodName, key, fn, true).
 */
graph.attachBefore = function attachBefore(methodName, key, fn) {
  return this.attach(methodName, key, fn, true);
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
graph.addIndex = function addIndex(name, bindings) {
  if (
    typeof name !== "string" ||
    Object(bindings) !== bindings ||
    arguments.length !== 2
  )
    throw new Error("addIndex: Wrong arguments.");

  if (_indexes[name]) throw new Error(`The index "${name}" already exists.`);

  // Store the bindings:
  _indexes[name] = bindings;

  // Attach the bindings:
  Object.keys(bindings).forEach(k => {
    if (typeof bindings[k] !== "function") {
      throw new Error("The bindings must be functions.");
    }
    graph.attach(k, name, bindings[k]);
  });

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
graph.addMethod("addNode", function addNode(node) {
  // Check that the node is an object and has an id:
  if (Object(node) !== node || arguments.length !== 1)
    throw new Error("addNode: Wrong arguments.");

  if (typeof node.id !== "string" && typeof node.id !== "number")
    throw new Error("The node must have a string or number id.");

  if (this.nodesIndex[node.id])
    throw new Error(`The node "${node.id}" already exists.`);

  const { id } = node;
  let validNode = Object.create(null);

  // Check the "clone" option:
  if (this.settings("clone")) {
    Object.keys(node).forEach(k => {
      if (k !== "id") {
        validNode[k] = node[k];
      }
    });
  } else validNode = node;

  // Check the "immutable" option:
  if (this.settings("immutable"))
    Object.defineProperty(validNode, "id", {
      value: id,
      enumerable: true
    });
  else validNode.id = id;

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
graph.addMethod("addEdge", function addEdge(edge) {
  // Check that the edge is an object and has an id:
  if (Object(edge) !== edge || arguments.length !== 1)
    throw new Error("addEdge: Wrong arguments.");

  if (typeof edge.id !== "string" && typeof edge.id !== "number")
    throw new Error("The edge must have a string or number id.");

  if (
    (typeof edge.source !== "string" && typeof edge.source !== "number") ||
    !this.nodesIndex[edge.source]
  )
    throw new Error("The edge source must have an existing node id.");

  if (
    (typeof edge.target !== "string" && typeof edge.target !== "number") ||
    !this.nodesIndex[edge.target]
  )
    throw new Error("The edge target must have an existing node id.");

  if (this.edgesIndex[edge.id])
    throw new Error(`The edge "${edge.id}" already exists.`);

  let validEdge = Object.create(null);

  // Check the "clone" option:
  if (this.settings("clone")) {
    Object.keys(edge).forEach(k => {
      if (k !== "id" && k !== "source" && k !== "target")
        validEdge[k] = edge[k];
    });
  } else validEdge = edge;

  // Check the "immutable" option:
  if (this.settings("immutable")) {
    Object.defineProperty(validEdge, "id", {
      value: edge.id,
      enumerable: true
    });

    Object.defineProperty(validEdge, "source", {
      value: edge.source,
      enumerable: true
    });

    Object.defineProperty(validEdge, "target", {
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

  if (!this.inNeighborsIndex[validEdge.target][validEdge.source])
    this.inNeighborsIndex[validEdge.target][validEdge.source] = Object.create(
      null
    );
  this.inNeighborsIndex[validEdge.target][validEdge.source][
    validEdge.id
  ] = validEdge;

  if (!this.outNeighborsIndex[validEdge.source][validEdge.target])
    this.outNeighborsIndex[validEdge.source][validEdge.target] = Object.create(
      null
    );
  this.outNeighborsIndex[validEdge.source][validEdge.target][
    validEdge.id
  ] = validEdge;

  if (!this.allNeighborsIndex[validEdge.source][validEdge.target])
    this.allNeighborsIndex[validEdge.source][validEdge.target] = Object.create(
      null
    );
  this.allNeighborsIndex[validEdge.source][validEdge.target][
    validEdge.id
  ] = validEdge;

  if (validEdge.target !== validEdge.source) {
    if (!this.allNeighborsIndex[validEdge.target][validEdge.source])
      this.allNeighborsIndex[validEdge.target][
        validEdge.source
      ] = Object.create(null);
    this.allNeighborsIndex[validEdge.target][validEdge.source][
      validEdge.id
    ] = validEdge;
  }

  // Keep counts up to date:
  this.inNeighborsCount[validEdge.target]++;
  this.outNeighborsCount[validEdge.source]++;
  this.allNeighborsCount[validEdge.target]++;
  this.allNeighborsCount[validEdge.source]++;

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
graph.addMethod("dropNode", function dropNode(id) {
  // Check that the arguments are valid:
  if (
    (typeof id !== "string" && typeof id !== "number") ||
    arguments.length !== 1
  )
    throw new Error("dropNode: Wrong arguments.");

  if (!this.nodesIndex[id]) throw new Error(`The node "${id}" does not exist.`);

  const l = this.nodesArray.length;

  // Remove the node from indexes:
  delete this.nodesIndex[id];
  for (let i = 0; i < l; i++)
    if (this.nodesArray[i].id === id) {
      this.nodesArray.splice(i, 1);
      break;
    }

  // Remove related edges:
  for (let i = this.edgesArray.length - 1; i >= 0; i--)
    if (this.edgesArray[i].source === id || this.edgesArray[i].target === id)
      this.dropEdge(this.edgesArray[i].id);

  // Remove related edge indexes:
  delete this.inNeighborsIndex[id];
  delete this.outNeighborsIndex[id];
  delete this.allNeighborsIndex[id];

  delete this.inNeighborsCount[id];
  delete this.outNeighborsCount[id];
  delete this.allNeighborsCount[id];

  Object.keys(this.nodesIndex).forEach(k => {
    delete this.inNeighborsIndex[k][id];
    delete this.outNeighborsIndex[k][id];
    delete this.allNeighborsIndex[k][id];
  });

  return this;
});

/**
 * This method drops an edge from the graph. An error is thrown if the edge
 * does not exist.
 *
 * @param  {string} id The edge id.
 * @return {object}    The graph instance.
 */
graph.addMethod("dropEdge", function dropEdge(id) {
  // Check that the arguments are valid:
  if (
    (typeof id !== "string" && typeof id !== "number") ||
    arguments.length !== 1
  )
    throw new Error("dropEdge: Wrong arguments.");

  if (!this.edgesIndex[id]) throw new Error(`The edge "${id}" does not exist.`);

  // Remove the edge from indexes:
  const edge = this.edgesIndex[id];
  delete this.edgesIndex[id];
  for (let i = 0; i < this.edgesArray.length; i++)
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

  if (edge.target !== edge.source) {
    delete this.allNeighborsIndex[edge.target][edge.source][edge.id];
    if (!Object.keys(this.allNeighborsIndex[edge.target][edge.source]).length)
      delete this.allNeighborsIndex[edge.target][edge.source];
  }

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
graph.addMethod("kill", function kill() {
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
graph.addMethod("clear", function clear() {
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
graph.addMethod("read", function read(g) {
  let i;
  let a;
  let l;

  a = g.nodes || [];
  for (i = 0, l = a.length; i < l; i++) this.addNode(a[i]);

  a = g.edges || [];
  for (i = 0, l = a.length; i < l; i++) this.addEdge(a[i]);

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
graph.addMethod("nodes", function nodes(v) {
  // Clone the array of nodes and return it:
  if (!arguments.length) return this.nodesArray.slice(0);

  // Return the related node:
  if (
    arguments.length === 1 &&
    (typeof v === "string" || typeof v === "number")
  )
    return this.nodesIndex[v];

  // Return an array of the related node:
  if (
    arguments.length === 1 &&
    Object.prototype.toString.call(v) === "[object Array]"
  ) {
    let i;

    let l;

    const a = [];

    for (i = 0, l = v.length; i < l; i++)
      if (typeof v[i] === "string" || typeof v[i] === "number")
        a.push(this.nodesIndex[v[i]]);
      else throw new Error("nodes: Wrong arguments.");

    return a;
  }

  throw new Error("nodes: Wrong arguments.");
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
graph.addMethod("degree", function degree(v, which) {
  // Check which degree is required:
  which =
    {
      in: this.inNeighborsCount,
      out: this.outNeighborsCount
    }[which || ""] || this.allNeighborsCount;

  // Return the related node:
  if (typeof v === "string" || typeof v === "number") return which[v];

  // Return an array of the related node:
  if (Object.prototype.toString.call(v) === "[object Array]") {
    let i;

    let l;

    const a = [];

    for (i = 0, l = v.length; i < l; i++)
      if (typeof v[i] === "string" || typeof v[i] === "number")
        a.push(which[v[i]]);
      else throw new Error("degree: Wrong arguments.");

    return a;
  }

  throw new Error("degree: Wrong arguments.");
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
graph.addMethod("edges", function edges(v) {
  // Clone the array of edges and return it:
  if (!arguments.length) return this.edgesArray.slice(0);

  // Return the related edge:
  if (
    arguments.length === 1 &&
    (typeof v === "string" || typeof v === "number")
  )
    return this.edgesIndex[v];

  // Return an array of the related edge:
  if (
    arguments.length === 1 &&
    Object.prototype.toString.call(v) === "[object Array]"
  ) {
    let i;

    let l;

    const a = [];

    for (i = 0, l = v.length; i < l; i++)
      if (typeof v[i] === "string" || typeof v[i] === "number")
        a.push(this.edgesIndex[v[i]]);
      else throw new Error("edges: Wrong arguments.");

    return a;
  }

  throw new Error("edges: Wrong arguments.");
});
export default graph;
