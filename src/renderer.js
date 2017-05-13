/**
 * Sigma.js Renderer Class
 * ========================
 *
 * Abstract classes extended by all of sigma's renderers.
 */

/**
 * Renderer class.
 *
 * @constructor
 */
export default class Renderer {

  /**
   * Conventional method used to bind the renderer to a sigma's instance.
   *
   * @param {Sigma} sigma - Target sigma instance.
   */
  bind(sigma) {
    this.sigma = sigma;
  }
}
