/**
 * This example aims at showcasing sigma's performances.
 */

import {Table} from 'apache-arrow';
import Graph, {InvalidArgumentsGraphError} from 'graphology';
import assignPolyfill from 'graphology';

let _nodes   = null;
let _edges   = null;
let _options = null;

export default class RapidsGraphologyGraph extends Graph {
  _gpu_nodes: Table;
  _gpu_edges: Table;
  _gpu_options: Table;
  _the_node: Map<string, any>;
  _nodeExtent: Map<string, number>;

  constructor(nodes: Table, edges: Table, options: Table) {
    super(new Graph({type: 'undirected'}));
    this._nodeExtent  = new Map();
    this._gpu_nodes   = nodes;
    this._gpu_edges   = edges;
    this._gpu_options = options;
    this._the_node = new Map<string, any>();
    this._the_node['node'] = null;
    this._the_node['hidden'] = false;
    Object.defineProperty(this, 'order', {value: this._gpu_nodes.numRows});
    Object.defineProperty(this, 'nodeExtent', {value: {x: [0, 5], y: [5, 10]}});
    Object.defineProperty(this, 'nodes', {value: () => {
      this._the_node['node'] = this._gpu_nodes;
      return [this._the_node];
    }});
    Object.defineProperty(this, 'edges', {value: () => { return [{'edge': this._gpu_edges}] }});
    Object.defineProperty(this, 'getNodeAttributes', {
      value: () => {
        return { 'buffer': this._gpu_nodes, 'x': -1, 'y': -1 }
      }
    });
    Object.defineProperty(this, 'getEdgeAttributes', {
      value: () => {
        return { 'buffer': this._gpu_edges, 'source': -1, 'target': -1, color: '#999', hidden: false }
      }
    });
    Object.defineProperty(this, 'extremities', {
      value: () => {
        return [this._the_node, this._the_node]
      }
    });
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
  setExtent(bounds) { this._nodeExtent = bounds; }
}
