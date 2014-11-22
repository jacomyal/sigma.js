;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');


  var _instance = {};

  // Add custom graph methods:
  /**
   * This methods returns an array of nodes that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent nodes.
   */
  if (!sigma.classes.graph.hasMethod('adjacentNodes'))
    sigma.classes.graph.addMethod('adjacentNodes', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentNodes: the node id must be a string.';

      var target,
          nodes = [];
      for(target in this.allNeighborsIndex[id]) {
        nodes.push(this.nodesIndex[target]);
      }
      return nodes;
    });

  /**
   * This methods returns an array of edges that are adjacent to a node.
   *
   * @param  {string} id The node id.
   * @return {array}     The array of adjacent edges.
   */
  if (!sigma.classes.graph.hasMethod('adjacentEdges'))
    sigma.classes.graph.addMethod('adjacentEdges', function(id) {
      if (typeof id !== 'string')
        throw 'adjacentEdges: the node id must be a string.';

      var a = this.allNeighborsIndex[id],
          eid,
          target,
          edges = [];
      for(target in a) {
        for(eid in a[target]) {
          edges.push(a[target][eid]);
        }
      }
      return edges;
    });


  // fast deep copy function
  function deepCopy(o) {
    var copy = Object.create(null);
    for (var i in o) {
      if (typeof o[i] === "object" && o[i] !== null) {
        copy[i] = deepCopy(o[i]);
      }
      else if (typeof o[i] === "function" && o[i] !== null) {
        // clone function:
        eval(" copy[i] = " +  o[i].toString());
        //copy[i] = o[i].bind(_g);
      }

      else
        copy[i] = o[i];
    }
    return copy;
  };

  function cloneChain(chain) {
    // Clone the array of filters:
    var copy = chain.slice(0);
    for (var i = 0, len = copy.length; i < len; i++) {
      copy[i] = deepCopy(copy[i]);
    };
    return copy;
  };

  /**
   * Convert Javascript string in dot notation into an object reference.
   *
   * @param  {object} obj The object.
   * @param  {string} str The string to convert, e.g. 'a.b.etc'.
   * @return {?}          The object reference.
   */
  function strToObjectRef(obj, str) {
    // http://stackoverflow.com/a/6393943
    return str.split('.').reduce(function(obj, i) { return obj[i] }, obj);
  };


  /**
   * Sigma Filter
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1.1
   */


  /**
   * Library of processors
   * ------------------
   */

  var Processors = {};   // available predicate processors

   /**
    *
    * @param  {sigma.classes.graph} g The graph instance.
    * @param  {function} fn           The predicate.
    * @param  {?object}  params       The options.
    */
  Processors.nodes = function(g, fn, params) {
    if (!g) return;

    var n = g.nodes(),
        ln = n.length,
        e = g.edges(),
        le = e.length;

    // hide node, or keep former value
    while(ln--)
      n[ln].hidden = !fn.call({
        graph: g,
        get: strToObjectRef
      }, n[ln], params) || n[ln].hidden;

    while(le--)
      if (g.nodes(e[le].source).hidden || g.nodes(e[le].target).hidden)
        e[le].hidden = true;
  };

   /**
    *
    * @param  {sigma.classes.graph} g The graph instance.
    * @param  {function} fn           The predicate.
    * @param  {?object}  params       The options.
    */
  Processors.edges = function(g, fn, params) {
    if (!g) return;

    var e = g.edges(),
        le = e.length;

    // hide edge, or keep former value
    while(le--)
      e[le].hidden = !fn.call({
        graph: g,
        get: strToObjectRef
      }, e[le], params) || e[le].hidden;
  };

   /**
    *
    * @param  {sigma.classes.graph} g The graph instance.
    * @param  {string} id             The center node.
    */
  Processors.neighbors = function(g, id) {
    if (!g) return;

    var n = g.nodes(),
        ln = n.length,
        e = g.edges(),
        le = e.length,
        neighbors = g.adjacentNodes(id),
        nn = neighbors.length,
        no = {};

    while(nn--)
      no[neighbors[nn].id] = true;

    while(ln--)
      if (n[ln].id !== id && !(n[ln].id in no))
        n[ln].hidden = true;

    while(le--)
      if (g.nodes(e[le].source).hidden || g.nodes(e[le].target).hidden)
        e[le].hidden = true;
  };

   /**
    *
    * @param  {sigma.classes.graph} g The graph instance.
    */
  Processors.undo = function(g) {
    if (!g) return;

    var n = g.nodes(),
        ln = n.length,
        e = g.edges(),
        le = e.length;

    while(ln--)
      n[ln].hidden = false;

    while(le--)
      e[le].hidden = false;
  };



  /**
   * Filter Object
   * ------------------
   * @param  {sigma} s The related sigma instance.
   */
  function Filter(s) {
    var _self = this,
      _s = s,
      _g = s.graph,
      _chain = [], // chain of wrapped filters
      _keysIndex = Object.create(null);

    /**
     * This function adds a filter to the chain of filters.
     *
     * @param  {string}   processor The processor name.
     * @param  {function} p         The predicate.
     * @param  {?object}  params    The predicate options.
     * @param  {?string}  key       The key to identify the filter.
     */
    function register(processor, p, params, key) {
      if (arguments[3] === undefined) {
        if (typeof arguments[2] !== 'object') {
          key = params;
          params = null;
        }
      }

      if (key !== undefined && typeof key !== 'number' && typeof key !== 'string')
        throw 'The filter key "'+ key.toString() +'" must be a number or a string.';

      if (key !== undefined && typeof key === 'string' && !key.length)
        throw 'The filter key must be a non-empty string.';

      if (typeof processor !== 'string')
        throw 'The predicate of key "'+ key +'" must be a string.';

      if ('undo' === key)
        throw '"undo" is a reserved key.';

      if (_keysIndex[key])
        throw 'The filter "' + key + '" already exists.';

      if (key)
        _keysIndex[key] = true;

      _chain.push({
        'key': key,
        'processor': processor,
        'predicate': p,
        'options': params || {}
      });
    };

    /**
     * This function removes a set of filters from the chain.
     *
     * @param {object} o The filter keys.
     */
    function unregister(o) {
      _chain = _chain.filter(function(a) {
        return !(a.key in o);
      });

      for(var key in o)
        delete _keysIndex[key];
    };

    /**
     * This method will return true if the filter key exists, false otherwise.
     *
     * @param  {string}  key The filter key.
     * @return {boolean}
     */
    this.has = function(key) {
      return _keysIndex[key];
    }

    /**
     * This method is used to filter the nodes. The method must be called with
     * the predicate, which is a function that takes a node as argument and
     * returns a boolean. It may take an identifier as argument to undo the
     * filter later. The method wraps the predicate into an anonymous function
     * that looks through each node in the graph. When executed, the anonymous
     * function hides the nodes that fail a truth test (predicate). The method
     * adds the anonymous function to the chain of filters. The filter is not
     * executed until the apply() method is called.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter.nodesBy(function(n) {
     * >   return this.degree(n.id) > 0;
     * > }, 'degreeNotNull');
     *
     * @param  {function}             fn      The filter predicate.
     * @param  {?object}              params  The filter options.
     * @param  {?string}              key     The key to identify the filter.
     * @return {sigma.plugins.filter}         Returns the instance.
     */
    this.nodesBy = function(fn, params, key) {
      // Wrap the predicate to be applied on the graph and add it to the chain.
      register('nodes', fn, params, key);

      return this;
    };

    /**
     * This method is used to filter the edges. The method must be called with
     * the predicate, which is a function that takes a node as argument and
     * returns a boolean. It may take an identifier as argument to undo the
     * filter later. The method wraps the predicate into an anonymous function
     * that looks through each edge in the graph. When executed, the anonymous
     * function hides the edges that fail a truth test (predicate). The method
     * adds the anonymous function to the chain of filters. The filter is not
     * executed until the apply() method is called.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter.edgesBy(
     * >   function(e, options) {
     * >     return e.size > options.val;
     * >   },
     * >   { val:1 },
     * >   'edgeSize'
     * > );
     *
     * @param  {function}             fn  The filter predicate.
     * @param  {?object}              params  The filter options.
     * @param  {?string}              key The key to identify the filter.
     * @return {sigma.plugins.filter}     Returns the instance.
     */
    this.edgesBy = function(fn, params, key) {
      // Wrap the predicate to be applied on the graph and add it to the chain.
      register('edges', fn, params, key);

      return this;
    };

    /**
     * This method is used to filter the nodes which are not direct connections
     * of a given node. The method must be called with the node identifier. It
     * may take an identifier as argument to undo the filter later. The filter
     * is not executed until the apply() method is called.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter.neighborsOf('n0');
     *
     * @param  {string}               id  The node id.
     * @param  {?object}              params  The filter options.
     * @param  {?string}              key The key to identify the filter.
     * @return {sigma.plugins.filter}     Returns the instance.
     */
    this.neighborsOf = function(id, params, key) {
      if (typeof id !== 'string')
        throw 'The node id "'+ id.toString() +'" must be a string.';
      if (!id.length)
        throw 'The node id must be a non-empty string.';

      // Wrap the predicate to be applied on the graph and add it to the chain.
      register('neighbors', id, params, key);

      return this;
    };

    /**
     * This method is used to execute the chain of filters and to refresh the
     * display.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter
     * >   .nodesBy(
     * >     function(n, options) {
     * >       return this.degree(n.id) > options.val;
     * >     },
     * >     { val:0 },
     * >    'degreeGreaterThan'
     * >   )
     * >   .apply();
     *
     * @return {sigma.plugins.filter}      Returns the instance.
     */
    this.apply = function() {
      for (var i = 0, len = _chain.length; i < len; ++i) {
        switch(_chain[i].processor) {
          case 'nodes':
            Processors.nodes(_g, _chain[i].predicate, _chain[i].options);
            break;
          case 'edges':
            Processors.edges(_g, _chain[i].predicate, _chain[i].options);
            break;
          case 'neighbors':
            Processors.neighbors(_g, _chain[i].predicate);
            break;
          case 'undo':
            Processors.undo(_g, _chain[i].predicate);
            break;
          default:
            throw 'Unknown processor ' + _chain[i].processor;
        }
      };

      if (_chain[0] && 'undo' === _chain[0].key) {
        _chain.shift();
      }

      if (_s) _s.refresh();

      return this;
    };

    /**
     * This method undoes one or several filters, depending on how it is called.
     *
     * To undo all filters, call "undo" without argument. To undo a specific
     * filter, call it with the key of the filter. To undo multiple filters, call
     * it with an array of keys or multiple arguments, and it will undo each
     * filter, in the same order. The undo is not executed until the apply()
     * method is called. For instance:
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter
     * >   .nodesBy(function(n) {
     * >     return this.degree(n.id) > 0;
     * >   }, 'degreeNotNull');
     * >   .edgesBy(function(e) {
     * >     return e.size > 1;
     * >   }, 'edgeSize')
     * >   .undo();
     *
     * Other examples:
     * > filter.undo();
     * > filter.undo('myfilter');
     * > filter.undo(['myfilter1', 'myfilter2']);
     * > filter.undo('myfilter1', 'myfilter2');
     *
     * @param  {?(string|array|*string))} v Eventually one key, an array of keys.
     * @return {sigma.plugins.filter}       Returns the instance.
     */
    this.undo = function(v) {
      var q = Object.create(null),
          la = arguments.length;

      // find removable filters
      if (la === 1) {
        if (Object.prototype.toString.call(v) === '[object Array]')
          for (var i = 0, len = v.length; i < len; i++)
            q[v[i]] = true;

        else // 1 filter key
          q[v] = true;

      } else if (la > 1) {
        for (var i = 0; i < la; i++)
          q[arguments[i]] = true;
      }
      else
        this.clear();

      unregister(q);

      _chain.unshift({
        'key': 'undo',
        'processor': 'undo'
      });

      return this;
    };

    /**
     * This method is used to empty the chain of filters.
     * Prefer the undo() method to reset filters.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > filter.clear();
     *
     * @return {sigma.plugins.filter} Returns the instance.
     */
    this.clear = function() {
      _chain.length = 0; // clear the array
      _keysIndex = Object.create(null);
      return this;
    };

    this.kill = function() {
      this.clear();
      delete _instance[_s.id];
      _g = null;
      _s = null;
      return this;
    }

    /**
     * This method will serialize the chain of filters.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > var chain = filter.serialize();
     *
     * @return {object}   The serialized filters.
     */
    this.serialize = function() {
      var copy = cloneChain(_chain);
      for (var i = 0, len = copy.length; i < len; i++) {
        copy[i].predicate = copy[i].predicate.toString().replace(/\s+/g, ' ');
      };
      return copy;
    };

    /**
     * This method sets the chain of filters with the specified serialized chain.
     * Warning: predicate strings are executed using `eval()`.
     *
     * > var filter = new sigma.plugins.filter(s);
     * > var chain = [
     * >   {
     * >     key: 'my-filter',
     * >     predicate: function(n) {...},
     * >     processor: 'nodes'
     * >   }, ...
     * > ];
     * > filter.load(chain);
     *
     * @param {array} chain The chain of filters.
     * @return {sigma.plugins.filter} Returns the instance.
     */
    this.load = function(chain) {
      if (chain === undefined)
        throw 'Wrong arguments.';

      if (Object.prototype.toString.call(chain) !== '[object Array]')
        throw 'The chain" must be an array.';

      this.clear();
      var copy = cloneChain(chain);

      for (var i = 0, len = copy.length; i < len; i++) {
        if (copy[i].predicate === undefined)
          throw 'Missing predicate.';
        if (copy[i].processor === undefined)
          throw 'Missing processor.';

        if (copy[i].key != undefined && typeof copy[i].key !== 'string')
          throw 'The filter key "'+ copy[i].key.toString() +'" must be a string.';

        if (typeof copy[i].predicate === 'string')
          eval(" copy[i].predicate = " +  copy[i].predicate);

        if (typeof copy[i].predicate !== 'function')
          throw 'The predicate of key "'+ copy[i].key +'" must be a function.';

        if (typeof copy[i].processor !== 'string')
          throw 'The processor of key "'+ copy[i].key +'" must be a string.';

        if (copy[i].key)
          _keysIndex[copy[i].key] = true;
      };

      _chain = copy;

      return this;
    };

  };



  /**
   * Interface
   * ------------------
   *
   * > var filter = sigma.plugins.filter(s);
   */

  /**
   * @param  {sigma} s The related sigma instance.
   */
  sigma.plugins.filter = function(s) {
    // Create filter if undefined
    if (!_instance[s.id]) {
      _instance[s.id] = new Filter(s);

      // Binding on kill to clear the references
      s.bind('kill', function() {
        sigma.plugins.killFilter(s);
      });
    }
    return _instance[s.id];
  };

  /**
   *  This function kills the filter instance.
   *
   * @param  {sigma} s The related sigma instance.
   */
  sigma.plugins.killFilter = function(s) {
    if (_instance[s.id] instanceof Filter) {
      _instance[s.id].kill();
    }
    delete _instance[s.id];
  };

}).call(this);
