/**
 * Sigma.js Canvas Renderer
 * =========================
 */
import Renderer from '../../renderer';

// TODO: validate container

/**
 * Renderer class.
 *
 * @constructor
 */
export default class CanvasRenderer extends Renderer {
  constructor(container) {
    super();

    // Properties
    this.container = container;
  }

  /**
   * Method used to render.
   *
   * @return {CanvasRenderer} - Returns itself for chaining.
   */
  render() {

  }
}
