;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw new Error('sigma is not declared');

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');


  /**
   * Fast deep copy function.
   *
   * @param  {object} o The object.
   * @return {object}   The copy.
   */
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


  /**
   * This method finds an edge in the graph. If the edge is a sibling, it
   * returns the container of the sibling.
   *
   * @param  {string} id The edge identifier.
   * @return {object}    The edge or its container.
   */
  function find(id) {
    var sibling,
        edges,
        e;

    // Cases:
    //   single edge
    //   1 sibling and container has same id
    //   2+ siblings and container has same id
    //   has siblings and container has different id

    if (sibling = this.siblingEdgesIndex[id]) {
      edges = this.allNeighborsIndex[sibling.source][sibling.target];

      if (Object.keys(edges).length === 1) {
        e = this.edges(Object.keys(edges)[0]);
        if (e.type !== 'parallel')
          throw new Error('The sibling container must be of type "parallel", was ' + e.type);

        if (e.siblings === undefined)
          throw new Error('The sibling container has no "siblings" key.');

        if (Object.keys(e.siblings).length < 2)
          throw new Error('The sibling container must have more than one sibling, had ' + Object.keys(e.siblings).length);

        if (e.siblings[id] === undefined)
          throw new Error('Sibling container found but the edge sibling is missing.');

        return e;
      }
      else if (Object.keys(edges).length > 1) {
        // We have parallel edges in the graph structure, maybe because
        // graph.addEdge() has been called directly.
        var eid;
        for (eid in edges) {
          e = this.edges(eid);
          if (e.type === 'parallel' && e.siblings !== undefined) {
            // The edge contains siblings, but does it contain our sibling?
            if (Object.keys(e.siblings).length) {
              if (e.siblings[id] !== undefined) {
                return e;
              }
            }
            else
              throw new Error('Edge sibling found but its container is missing.');
          }
        };
        throw new Error('Edge sibling found but its container is missing.');
      }
      else // Object.keys(edges).length == 0
        throw new Error('Edge sibling found but its container is missing.');
    }
    else
      return this.edgesIndex[id];
  };


  /**
   * This methods returns one or several edges, depending on how it is called.
   *
   * To get the array of edges, call "edges" without argument. To get a
   * specific edge, call it with the id of the edge. The get multiple edge,
   * call it with an array of ids, and it will return the array of edges, in
   * the same order. If some edges are siblings, their containers are returned
   * instead.
   *
   * @param  {?(number|string|array)} v Eventually one id, an array of ids.
   * @return {object|array}             The related edge or array of edges.
   */
  function get(v) {
    // Clone the array of edges and return it:
    if (!arguments.length || v === undefined)
      return this.edgesArray.slice(0);

    if (arguments.length > 1)
      throw new Error('Too many arguments. Use an array instead.');

    // Return the related edge or edge container:
    if (typeof v === 'number' || typeof v === 'string') {
      return find.call(this, v);
    }

    // Return an array of the related edge or edge container:
    if (Array.isArray(v)) {
      var i,
          l,
          a = [];

      for (i = 0, l = v.length; i < l; i++)
        if (typeof v[i] === 'number' || typeof v[i] === 'string') {
          a.push(find.call(this, v[i]));
        }
        else
          throw new Error('Invalid argument: an edge id is not a string or a number, was ' + v[i]);

      return a;
    }

    throw new Error('Invalid argument: "v" is not a string or an array, was ' + v);
  };

  /**
   * This method adds an edge sibling to its edge container. Edge siblings are
   * stored in the "siblings" property of the container.
   *
   * If the container didn't have any sibling, it transforms it as a container:
   * it will copy the it as a sibling, set its type as "parallel", remove
   * its label and color, and reset its size.
   *
   * @param {object} c The sibling container.
   * @param {object} s The edge sibling.
   */
  function add(c, s) {
    if (!c.siblings) {
      var copy = deepCopy(c);
      c.siblings = {};
      c.siblings[c.id] = copy;

      delete c.color;
      delete c.label;
      c.size = 1;
      c.type = 'parallel';

      this.siblingEdgesIndex[copy.id] = copy;
    }

    c.siblings[s.id] = s;
    this.siblingEdgesIndex[s.id] = s;
  };

  /**
   * This method removes an edge sibling from its edge container.
   *
   * If a single sibling remains after the removal, it transforms the edge used
   * as a container into a normal edge.
   *
   * @param {object} c   The sibling container.
   * @param {string} sid The sibling id.
   */
  function drop(c, sid) {
    delete c.siblings[sid];
    delete this.siblingEdgesIndex[sid];

    if (Object.keys(c.siblings).length === 1) {
      // One sibling remains so we drop the container and add the sibling as a
      // new edge:
      var e = c.siblings[Object.keys(c.siblings)[0]];
      this.dropEdge(c.id);
      this.addEdge(e);
      delete this.siblingEdgesIndex[c.id];
      delete this.siblingEdgesIndex[e.id];
    }
  };


  // Add custom graph methods:


  /**
   * This methods returns one or several edges, depending on how it is called.
   *
   * To get the array of edges, call "edges" without argument. To get a
   * specific edge, call it with the id of the edge. The get multiple edge,
   * call it with an array of ids, and it will return the array of edges, in
   * the same order. If some edges are siblings, their containers are returned
   * instead.
   *
   * @param  {?(string|array)} v Eventually one id, an array of ids.
   * @return {object|array}      The related edge or array of edges.
   */
  if (!sigma.classes.graph.hasMethod('edgeSiblings'))
    sigma.classes.graph.addMethod('edgeSiblings', function(v) {
      return get.call(this, v);
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
   * If an edge already exists between the source and target nodes, it will add
   * the edge as a sibling of the existing edge. It will copy the existing edge
   * as a sibling, set its type as "parallel", remove its label and color, and
   * reset its size.
   *
   * If parallel edges already exist, it will add the edge as a sibling to one
   * of these edges (in this case the operation is not deterministic). It may
   * happen when graph.addEdge or graph.read is used.
   *
   * @param  {object} edge The edge to add.
   * @return {object}      The graph instance.
   */
  if (!sigma.classes.graph.hasMethod('addEdgeSibling'))
    sigma.classes.graph.addMethod('addEdgeSibling', function(edge) {
      // Check that the edge is an object and has an id:
      if (arguments.length == 0)
        throw new TypeError('Missing argument.');

      if (Object(edge) !== edge)
        throw new TypeError('Invalid argument: "edge" is not an object, was ' + edge);

      if (typeof edge.id !== 'number' && typeof edge.id !== 'string')
        throw new TypeError('Invalid argument key: "edge.id" is not a string or a number, was ' + edge.id);

      if ((typeof edge.source !== 'number' && typeof edge.source !== 'string') || !this.nodesIndex[edge.source])
        throw new Error('Invalid argument key: "edge.source" is not an existing node id, was ' + edge.source);

      if ((typeof edge.target !== 'number' && typeof edge.target !== 'string') || !this.nodesIndex[edge.target])
        throw new Error('Invalid argument key: "edge.target" is not an existing node id, was ' + edge.target);

      if (this.edgesIndex[edge.id])
        throw new Error('Invalid argument: an edge of id "' + edge.id + '" already exists.');

      if (this.siblingEdgesIndex[edge.id])
        throw new Error('Invalid argument: an edge sibling of id "' + edge.id + '" already exists.');

      var edges = this.allNeighborsIndex[edge.source][edge.target];
      if (edges !== undefined && Object.keys(edges).length) {
        // An edge already exists, we make it a container and add a sibling:
        var otherEdge = this.edges(edges[Object.keys(edges)[0]].id);
        add.call(
          this,
          otherEdge,
          edge
        );
      }
      else {
        // No edge exists between source and target, we add a normal edge:
        this.addEdge(edge);
      }

      return this;
    });

  /**
   * This method drops an edge from the graph. An error is thrown if the edge
   * does not exist.
   *
   * If the edge is a sibling, it will drop the sibling. If a single sibling
   * remains after the removal, it will transform the edge used as a container
   * into a regular edge.
   *
   * If parallel edges exist, i.e. multiple edges may contain the sibling, it
   * will drop the first sibling found in a parallel edge.
   *
   * @param  {number|string} id The edge id.
   * @return {object}           The graph instance.
   */
  if (!sigma.classes.graph.hasMethod('dropEdgeSibling'))
    sigma.classes.graph.addMethod('dropEdgeSibling', function(id) {
      // Check that the arguments are valid:
      if (arguments.length == 0)
        throw new TypeError('Missing argument.');

      if (typeof id !== 'number' && typeof id !== 'string')
        throw new TypeError('Invalid argument: "id" is not a string or a number, was ' + id);

      if (this.siblingEdgesIndex[id]) {
        var container = find.call(this, id);
        drop.call(this, container, id);
      }
      else
        this.dropEdge(id);

      return this;
    });

  /**
   * This method reads an object and adds the nodes and edges, through the
   * proper methods "addNode" and "addEdgeSibling".
   *
   * Here is an example:
   *
   *  > var myGraph = new graph();
   *  > myGraph.readWithSiblings({
   *  >   nodes: [
   *  >     { id: 'n0' },
   *  >     { id: 'n1' }
   *  >   ],
   *  >   edges: [
   *  >     {
   *  >       id: 'e0',
   *  >       source: 'n0',
   *  >       target: 'n1'
   *  >     },
   *  >     {
   *  >       id: 'e1',
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
   *  >
   *  > console.log(
   *  >   myGraph.edges('e0')
   *  > ); // outputs:
   *  > //  {
   *  > //    ...
   *  > //    type: 'parallel'
   *  > //    siblings: {
   *  > //      {
   *  > //        'e0': {
   *  > //          id: 'e0',
   *  > //          source: 'n0',
   *  > //          target: 'n1'
   *  > //        },
   *  > //        'e1': {
   *  > //          id: 'e1',
   *  > //          source: 'n0',
   *  > //          target: 'n1'
   *  > //        }
   *  > //      }
   *  > //  }
   *
   * @param  {object} g The graph object.
   * @return {object}   The graph instance.
   */
  if (!sigma.classes.graph.hasMethod('readWithSiblings'))
    sigma.classes.graph.addMethod('readWithSiblings', function(g) {
      var i,
          a,
          l;

      a = g.nodes || [];
      for (i = 0, l = a.length; i < l; i++)
        this.addNode(a[i]);

      a = g.edges || [];
      for (i = 0, l = a.length; i < l; i++)
        this.addEdgeSibling(a[i]);

      return this;
    });

    // Add custom graph indexes:
    sigma.classes.graph.addIndex('siblingEdgesIndex', {
      constructor: function() {
        this.siblingEdgesIndex = Object.create(null);
      }
    });

}).call(this);
