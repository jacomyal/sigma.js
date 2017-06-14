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

    // Internal state
    this.nextFrame = null;

    // First time refresh
    this.refresh();
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

  /**---------------------------------------------------------------------------
   * Drawing
   **---------------------------------------------------------------------------
   */

  /**
   * Function used to schedule an update.
   *
   * @return {Sigma}
   */
  scheduleRefresh() {
    if (this.nextFrame)
      return this;

    this.nextFrame = requestAnimationFrame(() => {

      // Resetting state
      this.nextFrame = null;

      // Refreshing
      this.refresh();
    });
  }

  /**
   * Method used to refresh display of the graph.
   *
   * @return {Sigma} - Returns itself for chaining.
   */
  refresh() {

    // If a frame is scheduled, we cancel it
    if (this.nextFrame) {
      cancelAnimationFrame(this.nextFrame);
      this.nextFrame = null;
    }

    // Calling renderer
    this.renderer.render();
  }
}
