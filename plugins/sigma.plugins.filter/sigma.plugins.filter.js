;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');
  
  /**
   * Sigma Filter
   * =============================
   *
   * Author: Sébastien Heymann (Linkurious)
   * Version: 0.1
   */

   var _g = undefined,
       _s = undefined,
       _chain = [], // chain of wrapped filters
       _keysIndex = Object.create(null);

  /**
   * Filter Object
   * ------------------
   * @param  {sigma} s The related sigma instance.
   */
  function Filter(s) {
    _s = s;
    _g = s.graph;
  };

  /**
   * Add a filter to the chain of filters.
   *
   * @param  {function} wrapper The wrapped predicate.
   * @param  {?string}   key    The key to identify the filter.
   */
  function register(wrapper, key) {
    if (key != undefined && typeof key !== 'string')
      throw 'The filter key "'+ key.toString() +'" must be a string.';

    if (key != undefined && !key.length)
      throw 'The filter key must be a non-empty string.';
    
    if (typeof wrapper !== 'function')
      throw 'The predicate of key "'+ key +'" must be a function.';
    
    if ('undo' === key)
      throw '"undo" is a reserved key.';

    if (_keysIndex[key])
      throw 'The filter "' + key + '" already exists.';

    if (key)
      _keysIndex[key] = true;

    _chain.push({
      'key': key,
      'fn': wrapper
    });
  };

  /**
   * Drop a set of filters from the chain.
   *
   * @param {object} o The filter keys.
   */
  function unregister (o) {
    _chain = _chain.filter(function(a) {
      return !(a.key in o);
    });

    for(var key in o)
      delete _keysIndex[key];
  };

  /**
   * Clone the filter chain and return the copy.
   *
   * > filter = new sigma.plugins.filter(s);
   * > var filters = filter.chain();
   *
   * @return {object}   The cloned chain of filters.
   */
  Filter.prototype.chain = function() {
    // Clone the array of filters:
    return _chain.slice(0);
  };

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
   * > filter = new sigma.plugins.filter(s);
   * > filter.nodesBy(function(n) {
   * >   return this.degree(n.id) > 0;
   * > }, 'degreeNotNull');
   *
   * @param  {function}             fn  The filter predicate.
   * @param  {?string}              key The key to identify the filter.
   * @return {sigma.plugins.filter}     Returns the instance.
   */
  Filter.prototype.nodesBy = function(fn, key) {
    // Wrap the predicate to be applied on the graph and add it to the chain.
    register(function() {
      var n = _g.nodes(),
          ln = n.length,
          e = _g.edges(),
          le = e.length;

      // hide node, or keep former value
      while(ln--)
        n[ln].hidden = !fn.call(_s.graph, n[ln]) || n[ln].hidden;
      
      while(le--)
        if (_g.nodes(e[le].source).hidden || _g.nodes(e[le].target).hidden)
          e[le].hidden = true;
    }, key);
    
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
   * > filter = new sigma.plugins.filter(s);
   * > filter.edgesBy(function(e) {
   * >   return e.size > 1;
   * > }, 'edgeSize');
   *
   * @param  {function}             fn  The filter predicate.
   * @param  {?string}              key The key to identify the filter.
   * @return {sigma.plugins.filter}     Returns the instance.
   */
  Filter.prototype.edgesBy = function(fn, key) {
    // Wrap the predicate to be applied on the graph and add it to the chain.
    register(function() {
      var e = _g.edges(),
          le = e.length;

      // hide edge, or keep former value
      while(le--)
        e[le].hidden = !fn(e[le]) || e[le].hidden;
    }, key);

    return this;
  };

  /**
   * This method is used to filter the nodes which are not direct connections
   * of a given node. The method must be called with the node identifier. It
   * may take an identifier as argument to undo the filter later. The filter
   * is not executed until the apply() method is called.
   *
   * > filter = new sigma.plugins.filter(s);
   * > filter.neighborsOf('n0');
   *
   * @param  {string}               id  The node id.
   * @param  {?string}              key The key to identify the filter.
   * @return {sigma.plugins.filter}     Returns the instance.
   */
  Filter.prototype.neighborsOf = function(id, key) {
    if (typeof id !== 'string')
      throw 'The node id "'+ id.toString() +'" must be a string.';
    if (!id.length)
      throw 'The node id must be a non-empty string.';

    // Wrap the predicate to be applied on the graph and add it to the chain.
    register(function() {
      var n = _g.nodes(),
          ln = n.length,
          e = _g.edges(),
          le = e.length,
          neighbors = _g.adjacentNodes(id),
          nn = neighbors.length,
          no = {};
      
      while(nn--)
        no[neighbors[nn].id] = true;

      while(ln--)
        if (n[ln].id !== id && !(n[ln].id in no))
          n[ln].hidden = true;
      
      while(le--)
        if (_g.nodes(e[le].source).hidden || _g.nodes(e[le].target).hidden)
          e[le].hidden = true;
    }, key);

    return this;
  };

  /**
   * This method is used to execute the chain of filters and to refresh the
   * display.
   *
   * > filter = new sigma.plugins.filter(s);
   * > filter
   * >   .nodesBy(function(n) {
   * >     return this.degree(n.id) > 0;
   * >   }, 'degreeNotNull')
   * >   .apply();
   *
   * @return {sigma.plugins.filter}      Returns the instance.
   */
  Filter.prototype.apply = function() {
    for (var i = 0, len = _chain.length; i < len; ++i) {
      _chain[i].fn();
    };

    if (_chain[0] && 'undo' === _chain[0].key) {
      _chain.shift();
    }

    _s.refresh();

    return this;
  };

  /**
   * This methods undoes one or several filters, depending on how it is called.
   *
   * To undo all filters, call "undo" without argument. To undo a specific
   * filter, call it with the key of the filter. To undo multiple filters, call
   * it with an array of keys or multiple arguments, and it will undo each
   * filter, in the same order. The undo is not executed until the apply()
   * method is called. For instance:
   *
   * > filter = new sigma.plugins.filter(s);
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
  Filter.prototype.undo = function(v) {
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

    function wrapper() {
      var n = _g.nodes(),
          ln = n.length,
          e = _g.edges(),
          le = e.length;

      while(ln--)
        n[ln].hidden = false;

      while(le--)
        e[le].hidden = false;
    };

    _chain.unshift({
      'key': 'undo',
      'fn': wrapper
    });

    return this;
  };

  /**
   * This method is used to empty the chain of filters.
   * Prefer the undo() method to reset filters.
   *
   * > filter = new sigma.plugins.filter(s);
   * > filter.clear();
   *
   * @return {sigma.plugins.filter} Returns the instance.
   */
  Filter.prototype.clear = function() {
    _chain.length = 0; // clear the array
    _keysIndex = Object.create(null);
    return this;
  };


  /**
   * Interface
   * ------------------
   *
   * > var filter = new sigma.plugins.filter(s);
   */
  var filter = null;

  /**
   * @param  {sigma} s The related sigma instance.
   */
  sigma.plugins.filter = function(s) {
    // Create filter if undefined
    if (!filter) {
      filter = new Filter(s);
    }
    return filter;
  };

}).call(this);
