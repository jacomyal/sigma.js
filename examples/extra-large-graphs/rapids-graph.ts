// NVIDIA 2022

import {Table} from 'apache-arrow';
import Graph, {InvalidArgumentsGraphError} from 'graphology';
import assignPolyfill from 'graphology';

/**
 * RapidsGraphologyGraph subclasses the Graph class of graphology
 * for compatibility with the node and edge processing and
 * rendering functions of sigma.js.
 *
 * Elements in sigma.js depend upon iterating over the nodes
 * and edges of the graphology Graph object. RapidsGraphologyGraph
 * shortcuts these functions, providing mock data in order to trick
 * the iterator where necessary, and providing GPU computed bounds
 * values to sigma.js where appropriate
 */
export default class RapidsGraphologyGraph extends Graph {
  _gpu_nodes: Table;
  _gpu_edges: Table;
  _gpu_options: Table;
  _the_node: Map<string, any>;
  _nodeExtent: Map<string, number>;

  constructor(nodes: Table, edges: Table, options: Table) {
    super(new Graph({type: 'undirected'})); // filler, not supported types of graphs yet
    this._nodeExtent  = new Map();
    this._gpu_nodes   = nodes;
    this._gpu_edges   = edges;
    this._gpu_options = options;

    // this._the_node contains metadata essential to sigma.js, usually obtained
    // from each individual Graph container. A single node is provided to allow
    // sigma.js to continue processing with the necessary data.
    this._the_node = new Map<string, any>();
    this._the_node['node'] = null;
    this._the_node['hidden'] = false; // hidden is not supported yet in this example.

    // Graphology Graph objects must provide the following members in order to
    // configure sigma.js. Instead of trying to override or properly subclass the
    // parent methods, I just overwrite them here.
    Object.defineProperty(this, 'order', {value: this._gpu_nodes.numRows});
    Object.defineProperty(this, 'nodeExtent', {value: {x: [0, 5], y: [5, 10]}});
    Object.defineProperty(this, 'nodes', {value: () => {
      this._the_node['node'] = this._gpu_nodes;
      return [this._the_node];
    }});
    // sigma.js pulls all of the values of a node from a Graph as it iterates over them.
    // In the GPU-backed example, all of the node coordinates and attributes are pre-
    // computed.
    Object.defineProperty(this, 'getNodeAttributes', {
      value: () => {
        return { 'buffer': this._gpu_nodes, 'x': -1, 'y': -1 }
      }
    });

    // edges do not depend on as much metadata.
    Object.defineProperty(this, 'edges', {value: () => { return [{'edge': this._gpu_edges}] }});
    // As in the above nodes, all edges metadata is precomputed on the GPU. Included
    // attributes other than "buffer" are provided to trick the iterator and renderer.
    Object.defineProperty(this, 'getEdgeAttributes', {
      value: () => {
        return { 'buffer': this._gpu_edges, 'source': -1, 'target': -1, color: '#999', hidden: false }
      }
    });

    // Placeholder
    Object.defineProperty(this, 'extremities', {
      value: () => {
        return [this._the_node, this._the_node]
      }
    });

    // The forEachNode iterator simply returns a single pair.
    Object.defineProperty(this, 'forEachNode', {
      value: (callback) => {
        if (typeof callback != 'function')
          throw new InvalidArgumentsGraphError(
            'RapidsGraphologyGraph.forEachNode: expecting a callback');
        const p1 = {x: this._nodeExtent['xmin'], y: this._nodeExtent['ymin']};
        const p2 = {x: this._nodeExtent['xmax'], y: this._nodeExtent['ymax']};
        callback('gpu_nodes_p1', p1);
        callback('gpu_nodes_p2', p2);
      }
    });
  }

  // A real accessor!  Extent is received from an HTTP request and set normally.
  setExtent(bounds) { this._nodeExtent = bounds; }
}
