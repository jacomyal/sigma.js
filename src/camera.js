/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 */
import {EventEmitter} from 'events';

import * as easings from './easings';
import {assign} from './utils';

/**
 * Defaults.
 */
const ANIMATE_DEFAULTS = {
  easing: 'quadraticInOut',
  duration: 150
};

const DEFAULT_ZOOMING_RATIO = 1.5;

// TODO: animate options = number polymorphism?
// TODO: pan, zoom, unzoom, reset, rotate, zoomTo
// TODO: add width / height to camera and add #.resize
// TODO: bind camera to renderer rather than sigma
// TODO: add #.graphToDisplay, #.displayToGraph, batch methods later

/**
 * Camera class
 *
 * @constructor
 */
export default class Camera extends EventEmitter {
  constructor() {
    super();

    // Properties
    this.x = 0.5;
    this.y = 0.5;
    this.angle = 0;
    this.ratio = 1;

    // State
    this.nextFrame = null;
    this.previousState = this.getState();
    this.enabled = true;
  }

  /**
   * Method used to enable the camera.
   *
   * @return {Camera}
   */
  enable() {
    this.enabled = true;
    return this;
  }

  /**
   * Method used to disable the camera.
   *
   * @return {Camera}
   */
  disable() {
    this.enabled = false;
    return this;
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
   * Method used to retrieve the camera's previous state.
   *
   * @return {object}
   */
  getPreviousState() {
    const state = this.previousState;

    return {
      x: state.x,
      y: state.y,
      angle: state.angle,
      ratio: state.ratio
    };
  }

  /**
   * Method used to check whether the camera is currently being animated.
   *
   * @return {boolean}
   */
  isAnimated() {
    return !!this.nextFrame;
  }

  /**
   * Method returning the coordinates of a point from the graph frame to the
   * viewport.
   *
   * @param  {object} dimensions - Dimensions of the viewport.
   * @param  {number} x          - The X coordinate.
   * @param  {number} y          - The Y coordinate.
   * @return {object}            - The point coordinates in the viewport.
   */

  // TODO: assign to gain one object
  // TODO: angles
  graphToViewport(dimensions, x, y) {
    const smallestDimension = Math.min(dimensions.width, dimensions.height);

    const dx = smallestDimension / dimensions.width,
          dy = smallestDimension / dimensions.height;

    // TODO: we keep on the upper left corner!
    // TODO: how to normalize sizes?
    return {
      x: (x - this.x + this.ratio / 2 / dx) * (smallestDimension / this.ratio),
      y: (this.y - y + this.ratio / 2 / dy) * (smallestDimension / this.ratio)
    };
  }

  /**
   * Method returning the coordinates of a point from the viewport frame to the
   * graph frame.
   *
   * @param  {object} dimensions - Dimensions of the viewport.
   * @param  {number} x          - The X coordinate.
   * @param  {number} y          - The Y coordinate.
   * @return {object}            - The point coordinates in the graph frame.
   */

  // TODO: angles
  viewportToGraph(dimensions, x, y) {
    const smallestDimension = Math.min(dimensions.width, dimensions.height);

    const dx = smallestDimension / dimensions.width,
          dy = smallestDimension / dimensions.height;

    return {
      x: (this.ratio / smallestDimension) * x + this.x - this.ratio / 2 / dx,
      y: -((this.ratio / smallestDimension) * y - this.y - this.ratio / 2 / dy)
    };
  }

  /**
   * Method returning the abstract rectangle containing the graph according
   * to the camera's state.
   *
   * @return {object} - The view's rectangle.
   */

  // TODO: angle
  viewRectangle(dimensions) {

    // TODO: reduce relative margin?
    const marginX = 0 * dimensions.width / 8,
          marginY = 0 * dimensions.height / 8;

    const p1 = this.viewportToGraph(dimensions, 0 - marginX, 0 - marginY),
          p2 = this.viewportToGraph(dimensions, dimensions.width + marginX, 0 - marginY),
          h = this.viewportToGraph(dimensions, 0, dimensions.height + marginY);

    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      height: p2.y - h.y
    };
  }

  /**
   * Method used to set the camera's state.
   *
   * @param  {object} state - New state.
   * @return {Camera}
   */
  setState(state) {

    if (!this.enabled)
      return this;

    // TODO: validations
    // TODO: update by function

    // Keeping track of last state
    this.previousState = this.getState();

    if ('x' in state)
      this.x = state.x;

    if ('y' in state)
      this.y = state.y;

    if ('angle' in state)
      this.angle = state.angle;

    if ('ratio' in state)
      this.ratio = state.ratio;

    // Emitting
    // TODO: don't emit if nothing changed?
    this.emit('updated', this.getState());

    return this;
  }

  /**
   * Method used to animate the camera.
   *
   * @param  {object}   state      - State to reach eventually.
   * @param  {object}   options    - Options:
   * @param  {number}     duration - Duration of the animation.
   * @param  {function} callback   - Callback
   * @return {function}            - Return a function to cancel the animation.
   */
  animate(state, options, callback) {

    if (!this.enabled)
      return this;

    // TODO: validation

    options = assign({}, ANIMATE_DEFAULTS, options);

    const easing = typeof options.easing === 'function' ?
      options.easing :
      easings[options.easing];

    // Canceling previous animation if needed
    if (this.nextFrame)
      cancelAnimationFrame(this.nextFrame);

    // State
    const start = Date.now(),
          initialState = this.getState();

    // Function performing the animation
    const fn = () => {
      const t = (Date.now() - start) / options.duration;

      // The animation is over:
      if (t >= 1) {
        this.nextFrame = null;
        this.setState(state);

        if (typeof callback === 'function')
          callback();

        return;
      }

      const coefficient = easing(t);

      const newState = {};

      if ('x' in state)
        newState.x = initialState.x + (state.x - initialState.x) * coefficient;
      if ('y' in state)
        newState.y = initialState.y + (state.y - initialState.y) * coefficient;
      if ('angle' in state)
        newState.angle = initialState.angle + (state.angle - initialState.angle) * coefficient;
      if ('ratio' in state)
        newState.ratio = initialState.ratio + (state.ratio - initialState.ratio) * coefficient;

      this.setState(newState);

      this.nextFrame = requestAnimationFrame(fn);
    };

    if (this.nextFrame) {
      cancelAnimationFrame(this.nextFrame);
      this.nextFrame = requestAnimationFrame(fn);
    }
    else {
      fn();
    }
  }

  /**
   * Method used to zoom the camera.
   *
   * @param  {number|object} factorOrOptions - Factor or options.
   * @return {function}
   */
  animatedZoom(factorOrOptions) {

    if (!factorOrOptions) {
      return this.animate({ratio: this.ratio / DEFAULT_ZOOMING_RATIO});
    }
    else {
      if (typeof factorOrOptions === 'number')
        return this.animate({ratio: this.ratio / factorOrOptions});
      else
        return this.animate(
          {ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)},
          factorOrOptions
        );
    }
  }

  /**
   * Method used to unzoom the camera.
   *
   * @param  {number|object} factorOrOptions - Factor or options.
   * @return {function}
   */
  animatedUnzoom(factorOrOptions) {

    if (!factorOrOptions) {
      return this.animate({ratio: this.ratio * DEFAULT_ZOOMING_RATIO});
    }
    else {
      if (typeof factorOrOptions === 'number')
        return this.animate({ratio: this.ratio * factorOrOptions});
      else
        return this.animate(
          {ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)},
          factorOrOptions
        );
    }
  }

  /**
   * Method used to reset the camera.
   *
   * @param  {object} options - Options.
   * @return {function}
   */
  animatedReset(options) {
    return this.animate({
      x: 0.5,
      y: 0.5,
      ratio: 1,
      angle: 0
    }, options);
  }
}
