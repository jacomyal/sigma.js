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

    // State
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

  /**
   * Method used to set the camera's state.
   *
   * @param  {object} state - New state.
   * @return {Camera}
   */
  setState(state) {

    // TODO: validations

    if ('x' in state)
      this.x = state.x;

    if ('y' in state)
      this.y = state.y;

    if ('angle' in state)
      this.angle = state.angle;

    if ('ratio' in state)
      this.ratio = state.ratio;

    return this;
  }
}
