/**
 * Sigma.js Core Class
 * ====================
 *
 * Core class holding state for the bound graph and using a combination of
 * a renderer & camera to display the bound graph on screen.
 */
import Camera from './camera';
import {isGraph} from './utils';

// TODO: possibility to pass a camera

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
    this.camera = new Camera();
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
}
