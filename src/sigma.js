/**
 * Sigma.js Core Class
 * ====================
 *
 * Core class holding state for the bound graph and using a combination of
 * a renderer & camera to display the bound graph on screen.
 */
import isGraph from 'graphology-utils/is-graph';
import Renderer from './renderer';

// TODO: sigma should only hold the graph and compose state to give to renderer,
// does it need to orchestrate?

// TODO: should be able to take n renderers
// TODO: what to do with refresh methods? We should probably drop them

// TODO: create a thumbnail renderer

/**
 * Sigma class
 *
 * @constructor
 * @param {Graph}    graph    - A graphology Graph instance.
 * @param {Renderer} renderer - A Renderer instance.
 */
export default class Sigma {
  constructor(graph, renderer) {

    // Checking the arguments
    if (!isGraph(graph))
      throw new Error('Sigma.constructor: given graph is not an instance of a graphology implementation.');

    if (!(renderer instanceof Renderer))
      throw new Error('Sigma.constructor: given renderer is not an instance of a sigma Renderer.');

    // Properties
    this.graph = graph;
    this.renderer = renderer;
    this.renderer.bind(this);

    // Userland state
    this.state = {};
    this.nodeStates = null;
    this.edgeStates = null;

    // First time render
    this.renderer.render();
  }

  /**---------------------------------------------------------------------------
   * Internals
   **---------------------------------------------------------------------------
   */

  /**---------------------------------------------------------------------------
   * Getters
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the graph bound to the instance.
   *
   * @return {Graph} - The bound graph.
   */
  getGraph() {
    return this.graph;
  }

  /**
   * Method returning the composed data of the target node.
   *
   * @return {string} key - The node's key.
   * @return {object}     - The node's attributes.
   */
  getNodeData(key) {

    // TODO: this will change to compose state later
    return this.graph.getNodeAttributes(key);
  }

  /**
   * Method returning the composed data of the target edge.
   *
   * @return {string} key - The edge's key.
   * @return {object}     - The edge's attributes.
   */
  getEdgeData(key) {

    // TODO: this will change to compose state later
    return this.graph.getEdgeAttributes(key);
  }

  /**
   * Method returning the extent of the bound graph.
   *
   * @return {object} - The graph's extent.
   */
  getGraphExtent() {
    const graph = this.graph;

    const nodes = graph.nodes(),
          edges = graph.edges();

    let maxX = -Infinity,
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity,
        maxNodeSize = -Infinity,
        maxEdgeSize = -Infinity;

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      const data = this.getNodeData(node);

      const size = data.size || 1;

      if (data.x > maxX)
        maxX = data.x;
      if (data.y > maxY)
        maxY = data.y;

      if (data.x < minX)
        minX = data.x;
      if (data.y < minY)
        minY = data.y;

      if (size > maxNodeSize)
        maxNodeSize = size;
    }

    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];

      const data = this.getEdgeData(edge);

      const size = data.size || 1;

      if (size > maxEdgeSize)
        maxEdgeSize = size;
    }

    return {
      maxX,
      maxY,
      minX,
      minY,
      maxNodeSize,
      maxEdgeSize
    };
  }
}
