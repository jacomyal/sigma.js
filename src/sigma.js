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
import {assign} from './utils';

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
    this.renderer.bind(this);

    this.state = {};
    this.nodeStates = null;
    this.edgeStates = null;

    // First time refresh
    this.refresh();

    // TODO: should store normalized display information as a flat array with
    // standard indices to save up some RAM & computation
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
    this.renderer.render();
  }
}
