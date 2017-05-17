/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 */

/**
 * Camera class
 *
 * @constructor
 */
export default class Camera {
  constructor() {

    // Properties
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.ratio = 1;
  }

  /**
   * Method used to retrieve the camera's current state.
   *
   * @return {object}
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      ratio: this.ratio
    };
  }
}
