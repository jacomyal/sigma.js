/**
 * Sigma.js Core Class
 * ====================
 *
 * Core class holding state for the bound graph and using a combination of
 * a renderer & camera to display the bound graph on screen.
 */
import isGraph from 'graphology-utils/is-graph';

import Camera from './camera';
import Renderer from './renderer';
import {internalNodeReducer} from './reducers';
import {assign} from './utils';

// TODO: possibility to pass a camera
// TODO: distinguish with events, full refresh vs. draw
// TODO: do we need to store computed data? I'm not sure

/**
 * Helper functions not registered as methods not to overload the prototype
 * and preventing sneaky users to abuse them.
 */

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
    this.camera = new Camera();
    this.renderer = renderer;

    this.state = {};
    this.nodeStates = null;
    this.edgeStates = null;

    this.nodeReducers = [internalNodeReducer];
    this.edgeReducers = [];

    // TODO: this is temporary
    this.renderer.initialize(graph);
    this.refresh();
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

    // 1-- We need to compute node reducers
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i],
            data = {};

      // Applying every reducers
      for (let j = 0, m = this.nodeReducers.length; j < m; j++) {
        const reducer = this.nodeReducers[j];

        assign(data, reducer(this, this.graph, node));
      }

      // Updating node display information as stored by renderer
      this.renderer.updateNodeDisplayInformation(node, data);
    }

    // TEMP: rendering
    this.renderer.render();
  }
}
