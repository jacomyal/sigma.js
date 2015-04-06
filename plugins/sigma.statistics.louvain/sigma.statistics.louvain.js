;(function(undefined) {
  'use strict';

  /**
   * Sigma Louvain Community Detection
   * ===================
   *
   * This plugin detects communities based on the Louvain algorithm
   * (http://arxiv.org/abs/0803.0476).
   * Based on https://bitbucket.org/taynaud/python-louvain/overview
   *
   * Author: Corneliu Sugar (github.com/upphiminn),
             Sébastien Heymann <seb@linkurio.us> (github.com/Linkurious)
   * Version: 0.1
   */

  // Terminating if sigma were not to be found
  if (typeof sigma === 'undefined')
    throw new Error('sigma not in scope.');

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');


  var jLouvain = function (graph, partitions) {
    //Constants
    var __PASS_MAX = -1,
        __MIN = 0.0000001;

    //Local vars
    var status = {},
      dendogram = [],
      original_graph,
      partition_init;

    original_graph = {
      'nodes': graph.nodes().map(function(n) { return n.id; }),
      'edges': graph.edges(),
      '_assoc_mat': make_assoc_mat(graph.edges())
    };
    partition_init = partitions;

    //Helpers
    function make_set(array) {
      var set = {};
      array.forEach(function (d, i) {
        set[d] = true;
      });
      return Object.keys(set);
    };

    function obj_values(obj) {
      var vals = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          vals.push(obj[key]);
        }
      }
      return vals;
    };

    function get_degree_for_node(graph, node) {
      var neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : [];
      var weight = 0;
      neighbours.forEach(function (neighbour, i) {
        var value = graph._assoc_mat[node][neighbour] || 1;
        if (node == neighbour)
            value *= 2;
        weight += value;
      });
      return weight;
    };

    function get_neighbours_of_node(graph, node) {
      if (typeof graph._assoc_mat[node] == 'undefined')
        return [];

      var neighbours = Object.keys(graph._assoc_mat[node]);
      return neighbours;
    }


    function get_edge_weight(graph, node1, node2) {
      return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
    }

    function get_graph_size(graph) {
      var size = 0;
      graph.edges.forEach(function (edge) {
          size += edge.weight;
      });
      return size;
    }

    function add_edge_to_graph(graph, edge) {
      update_assoc_mat(graph, edge);

      var edge_index = graph.edges.map(function (d) {
        return d.source + '_' + d.target;
      }).indexOf(edge.source + '_' + edge.target);

      if (edge_index != -1)
        graph.edges[edge_index].weight = edge.weight;
      else
        graph.edges.push(edge);
    }

    function make_assoc_mat(edge_list) {
      var mat = {};
      edge_list.forEach(function (edge, i) {
        mat[edge.source] = mat[edge.source] || {};
        mat[edge.source][edge.target] = edge.weight;
        mat[edge.target] = mat[edge.target] || {};
        mat[edge.target][edge.source] = edge.weight;
      });

      return mat;
    }

    function update_assoc_mat(graph, edge) {
      graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {};
      graph._assoc_mat[edge.source][edge.target] = edge.weight;
      graph._assoc_mat[edge.target] = graph._assoc_mat[edge.target] || {};
      graph._assoc_mat[edge.target][edge.source] = edge.weight;
    }

    function clone(obj) {
      if (obj == null || typeof(obj) != 'object')
        return obj;

      var temp = obj.constructor();

      for (var key in obj)
        temp[key] = clone(obj[key]);

      return temp;
    }

    //Core-Algorithm Related
    function init_status(graph, status, part) {
        status['nodes_to_com'] = {};
        status['total_weight'] = 0;
        status['internals'] = {};
        status['degrees'] = {};
        status['gdegrees'] = {};
        status['loops'] = {};
        status['total_weight'] = get_graph_size(graph);

        if (typeof part == 'undefined') {
          graph.nodes.forEach(function (node, i) {
            status.nodes_to_com[node] = i;
            var deg = get_degree_for_node(graph, node);
            if (deg < 0)
                throw new Error('A node has a negative degree. Use positive weights.');

            status.degrees[i] = deg;
            status.gdegrees[node] = deg;
            status.loops[node] = get_edge_weight(graph, node, node) || 0;
            status.internals[i] = status.loops[node];
          });
        }
        else {
          graph.nodes.forEach(function (node, i) {
            var com = part[node];
            status.nodes_to_com[node] = com;
            var deg = get_degree_for_node(graph, node);
            status.degrees[com] = (status.degrees[com] || 0) + deg;
            status.gdegrees[node] = deg;
            var inc = 0.0;

            var neighbours = get_neighbours_of_node(graph, node);

            neighbours.forEach(function (neighbour, i) {
              var weight = graph._assoc_mat[node][neighbour];
              if (weight <= 0) {
                  throw new Error('A node has a negative degree. Use positive weights.');
              }

              if (part[neighbour] == com) {
                if (neighbour == node) {
                  inc += weight;
                } else {
                  inc += weight / 2.0;
                }
              }
            });

            status.internals[com] = (status.internals[com] || 0) + inc;
          });
        }
    }

    function __modularity(status) {
      var links = status.total_weight;
      var result = 0.0;
      var communities = make_set(obj_values(status.nodes_to_com));

      communities.forEach(function (com, i) {
        var in_degree = status.internals[com] || 0;
        var degree = status.degrees[com] || 0;
        if (links > 0) {
          result = result + in_degree / links - Math.pow((degree / (2.0 * links)), 2);
        }
      });

      return result;
    }

    function __neighcom(node, graph, status) {
      // compute the communities in the neighb. of the node, with the graph given by
      // node_to_com

      var weights = {};
      var neighboorhood = get_neighbours_of_node(graph, node);//make iterable;

      neighboorhood.forEach(function (neighbour, i) {
        if (neighbour != node) {
          var weight = graph._assoc_mat[node][neighbour] || 1;
          var neighbourcom = status.nodes_to_com[neighbour];
          weights[neighbourcom] = (weights[neighbourcom] || 0) + weight;
        }
      });

      return weights;
    }

    function __insert(node, com, weight, status) {
      //insert node into com and modify status
      status.nodes_to_com[node] = +com;
      status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node] || 0);
      status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node] || 0);
    }

    function __remove(node, com, weight, status) {
      //remove node from com and modify status
      status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
      status.internals[com] = ((status.internals[com] || 0) - weight - (status.loops[node] || 0));
      status.nodes_to_com[node] = -1;
    }

    function __renumber(dict) {
      var count = 0;
      var ret = clone(dict); //deep copy :)
      var new_values = {};
      var dict_keys = Object.keys(dict);
      dict_keys.forEach(function (key) {
        var value = dict[key];
        var new_value = typeof new_values[value] == 'undefined' ? -1 : new_values[value];
        if (new_value == -1) {
          new_values[value] = count;
          new_value = count;
          count = count + 1;
        }
        ret[key] = new_value;
      });

      return ret;
    }

    function __one_level(graph, status) {
        //Compute one level of the Communities Dendogram.
        var modif = true,
            nb_pass_done = 0,
            cur_mod = __modularity(status),
            new_mod = cur_mod;

        while (modif && nb_pass_done != __PASS_MAX) {
          cur_mod = new_mod;
          modif = false;
          nb_pass_done += 1

          graph.nodes.forEach(function (node, i) {
            var com_node = status.nodes_to_com[node];
            var degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0);
            var neigh_communities = __neighcom(node, graph, status);

            __remove(node, com_node, (neigh_communities[com_node] || 0.0), status);

            var best_com = com_node;
            var best_increase = 0;
            var neigh_communities_entries = Object.keys(neigh_communities);//make iterable;

            neigh_communities_entries.forEach(function (com, i) {
              var incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw;
              if (incr > best_increase) {
                best_increase = incr;
                best_com = com;
              }
            });

            __insert(node, best_com, neigh_communities[best_com] || 0, status);

            if (best_com != com_node)
              modif = true;
          });

          new_mod = __modularity(status);
          if (new_mod - cur_mod < __MIN) break;
        }
    }

    function induced_graph(partition, graph) {
      var ret = {nodes: [], edges: [], _assoc_mat: {}};
      var w_prec, weight;

      //add nodes from partition values
      var partition_values = obj_values(partition);
      ret.nodes = ret.nodes.concat(make_set(partition_values)); //make set

      graph.edges.forEach(function (edge, i) {
        weight = edge.weight || 1;
        var com1 = partition[edge.source];
        var com2 = partition[edge.target];

        w_prec = (get_edge_weight(ret, com1, com2) || 0);
        var new_weight = (w_prec + weight);

        add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight});
      });

      return ret;
    }

    function partition_at_level(dendogram, level) {
      var partition = clone(dendogram[0]);

      for (var i = 1; i < level + 1; i++) {
        Object.keys(partition).forEach(function (key, j) {
          var node = key;
          var com = partition[key];
          partition[node] = dendogram[i][com];
        });
      }

      return partition;
    }

    function generate_dendogram(graph, part_init) {

      if (graph.edges.length == 0) {
        var part = {};
        graph.nodes.forEach(function (node, i) {
            part[node] = node;
        });
        return part;
      }
      var status = {};

      init_status(original_graph, status, part_init);

      var mod = __modularity(status);
      var status_list = [];

      __one_level(original_graph, status);

      var new_mod = __modularity(status);
      var partition = __renumber(status.nodes_to_com);

      status_list.push(partition);
      mod = new_mod;

      var current_graph = induced_graph(partition, original_graph);
      init_status(current_graph, status);

      while (true) {
        __one_level(current_graph, status);
        new_mod = __modularity(status);
        if (new_mod - mod < __MIN) break;

        partition = __renumber(status.nodes_to_com);
        status_list.push(partition);

        mod = new_mod;
        current_graph = induced_graph(partition, current_graph);
        init_status(current_graph, status);
      }

      return status_list;
    }


    /**
     * Public object
     * ------------------
     *
     */

    var core = {};

    /**
     * Execute the algorithm by generating the dendogram of hierarchy.
     *
     * @param {object} partitions Object with ids of nodes as properties and
     *                            community number assigned as value.
     * @return {object}           The algorithm instance.
     */
    core.run = function(partitions) {
      partition_init = partitions || partition_init;
      status = {};
      dendogram = generate_dendogram(original_graph, partition_init);
      return this;
    };

    /**
     * Count levels of hierarchy.
     *
     * @return {number}  The number of levels.
     */
    core.countLevels = function() {
      return dendogram.length - 1;
    };

    /**
     * Get the partitions of the graph at a specified level of hierarchy.
     * The higher level in the hierarchy the fewer partitions.
     *
     * @param {?number} level The level of hierarchy.
     * @return {object}       Dictionary of node id => community id
     */
    core.getPartitions = function(level) {
      if (level !== undefined && (level < 1 || level > dendogram.length - 1))
        throw new RangeError('Invalid argument: "level" is not between 1 and ' + dendogram.length - 1 + ' included.');

      return partition_at_level(dendogram, level || dendogram.length - 1);
    };

    /**
     * Count the number of partitions using the max community id.
     *
     * @param {object} partitions Object with ids of nodes as properties and
     *                            community number assigned as value.
     * @return {number}           The number of partitions
     */
    core.countPartitions = function(partitions) {
      return 1 + Math.max.apply(null, Object.keys(partitions).map(function(key) {
        return partitions[key];
      }));
    };

    /**
     * Assign communities at a specified level of hierarchy
     * (default: last level) to the  nodes of the sigma graph using a setter
     * function (default: last setter used, otherwise values are set to
     * `node._louvain`). The higher level in the hierarchy the fewer partitions.
     *
     * Recognized parameters:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the options
     * object:
     *
     *   {?number}             level      The level of hierarchy
     *                                    (from 1 to .countLevels() - 1).
     *   {?function}           setter     The setter function where `this` is
     *                                    the current node and the argument is
     *                                    the community id.
     *
     * @param {?object} options Eventually an object with options.
     * @return {object}         The algorithm instance.
     */
    core.setResults = function(options) {
      var self = this,
          o = options || {},
          communities = this.getPartitions(o.level);

      graph.nodes().forEach(function(node) {
        if (typeof o.setter === 'function') {
          self.setter = o.setter;
          self.setter.call(node, communities[node.id]);
        }
        else if (typeof self.setter === 'function') {
          self.setter.call(node, communities[node.id]);
        }
        else {
          node._louvain = communities[node.id];
        }
      });

      return this;
    };

    return core;
  };



  /**
   * Interface
   * ------------------
   *
   */

  /**
   * This function will compute node communities based on the Louvain community
   * detection algorithm, and will assign the communities at the lowest level
   * of hierarchy.
   *
   * > sigma.plugins.louvain(sigmaInstance.graph, {
   * >   setter: function(communityId) { this.my_community = communityId; }
   * > });
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the options
   * object:
   *
   *   {?object}           partitions   Object with ids of nodes as properties
   *                                    and community number assigned as value.
   *   {?function}         setter       The setter function where `this` is
   *                                    the current node and the argument is
   *                                    the community id.
   *
   * @param {sigma.classes.graph} graph   The related sigma graph instance.
   * @param {?object}             options Eventually an object with options.
   * @return {object}                     The algorithm instance.
   */
  sigma.plugins.louvain = function (graph, params) {
    var p = params || {};

    var instance = jLouvain(graph, p.partitions).run();

    instance.setResults({
      level: instance.countLevels(),
      setter: p.setter
    });

    return instance;
  }

}).call(this);
