/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import Renderer from '../renderer';

/**
 * Main class.
 *
 * @constructor
 */
export default class WebGLRenderer extends Renderer {
  constructor() {

    // Properties
    this.nodesData = null;
    this.edgesData = null;
  }
}
