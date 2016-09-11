/**
 * Sigma.js Core Class
 * ====================
 *
 * Core class holding state for the bound graph and using a combination of
 * a renderer & camera to display the bound graph on screen.
 */
import Camera from './camera';
import {internalNodeReducer} from './reducers';
import {assign, isGraph} from './utils';

// TODO: possibility to pass a camera
// TODO: distinguish with events, full refresh vs. draw

/**
 * Helper functions not registered as methods not to overload the prototype
 * and preventing sneaky users to abuse them.
 */
function initializeIndex(map, elements) {
  const index = map ? new Map() : {};

  for (let i = 0, l = elements.length; i < l; i++) {
    const element = elements[i],
          object = {computed: {}, state: {}};

    if (map)
      index.set(element, object);
    else
      index[element] = object;
  }

  return index;
}

/**
 * Sigma class
 *
 * @constructor
 * @param {Graph} graph - A graphology Graph instance.
 */
export default class Sigma {
  constructor(graph) {

    // Checking the arguments
    if (!isGraph(graph))
      throw new Error('Sigma.constructor: given graph is not an instance of a graphology implementation.');

    // Properties
    this.graph = graph;
    this.map = this.graph.map;
    this.camera = new Camera();

    this.state = {};
    this.nodesIndex = initializeIndex(this.map, graph.nodes());
    this.edgesIndex = initializeIndex(this.map, graph.edges());

    this.nodeReducers = [internalNodeReducer];
    this.edgeReducers = [];
  }

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
   * Method returning the instance's camera.
   *
   * @return {Camera} - The instance's graph.
   */
  getCamera() {
    return this.camera;
  }

  /**---------------------------------------------------------------------------
   * Drawing
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to refresh display of the graph.
   *
   * @return {Sigma} - Returns itself for chaining.
   */
  refresh() {
    const nodes = this.graph.nodes(),
          egdes = this.graph.edges();

    // 1-- We need to compute reducers
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];
      let data = {};

      // Applying every reducers
      for (let j = 0, m = this.nodeReducers.length; j < m; j++) {
        const reducer = this.nodeReducers[j];

        assign(data, reducer(this, this.graph, node));
      }

      // Storing computed data
      if (this.map)
        this.nodesIndex.get(node).computed = data;
      else
        this.nodesIndex[node].computed = data;
    }
  }
}
