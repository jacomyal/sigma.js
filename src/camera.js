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
  constructor(dimensions) {
    dimensions = dimensions || {};

    super();

    // Properties
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.ratio = 1;
    this.width = dimensions.width || 0;
    this.height = dimensions.height || 0;

    // State
    this.nextFrame = null;
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
   * Method used to retrieve the camera's dimensions.
   *
   * @return {object}
   */
  getDimensions() {
    return {
      width: this.width,
      height: this.height
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
   * Method returning the coordinates of a point from the display frame to the
   * graph one but ignores the offset and dimensions of the container.
   *
   * @param  {number} x - The X coordinate.
   * @param  {number} y - The Y coordinate.
   * @return {object}     The point coordinates in the frame of the graph.
   */
  abstractDisplayToGraph(x, y) {
    const cos = Math.cos(this.angle),
          sin = Math.sin(this.angle);

    return {
      x: (x * cos - y * sin) * this.ratio,
      y: (y * cos + x * sin) * this.ratio
    };
  }

  /**
   * Method returning the coordinates of a point from the display frame to the
   * graph one.
   *
   * @param  {number} x - The X coordinate.
   * @param  {number} y - The Y coordinate.
   * @return {object}   - The point coordinates in the frame of the graph.
   */
  displayToGraph(x, y) {
    const cos = Math.cos(this.angle),
          sin = Math.sin(this.angle);

    const xOffset = this.width / 2 - (this.x * cos + this.y * sin) / this.ratio,
          yOffset = this.height / 2 - (this.y * cos - this.x * sin) / this.ratio;

    const X = x - xOffset,
          Y = y - yOffset;

    return {
      x: (X * cos - Y * sin) * this.ratio,
      y: (Y * cos + X * sin) * this.ratio
    };
  }

  /**
   * Method returning the coordinates of a point from the graph frame to the
   * display one.
   *
   * @param  {number} x - The X coordinate.
   * @param  {number} y - The Y coordinate.
   * @return {object}   - The point coordinates in the frame of the display.
   */
  graphToDisplay(x, y) {
    const relCos = Math.cos(this.angle) / this.ratio,
          relSin = Math.sin(this.angle) / this.ratio,
          xOffset = (this.width / 2) - this.x * relCos - this.y * relSin,
          yOffset = (this.height / 2) - this.y * relCos + this.x * relSin;

    return {
      x: x * relCos + y * relSin + xOffset,
      y: y * relCos - x * relSin + yOffset
    };
  }

  /**
   * Method returning the abstract rectangle containing the graph according
   * to the camera's state.
   *
   * @return {object} - The view's rectangle.
   */
  viewRectangle() {
    const widthVect = this.abstractDisplayToGraph(this.width, 0),
          heightVect = this.abstractDisplayToGraph(0, this.height),
          centerVect = this.abstractDisplayToGraph(this.width / 2, this.height / 2),
          marginX = this.abstractDisplayToGraph(this.width / 4, 0).x,
          marginY = this.abstractDisplayToGraph(0, this.height / 4, 0).y;

    return {
      x1: this.x - centerVect.x - marginX,
      y1: this.y - centerVect.y - marginY,
      x2: this.x - centerVect.x + marginX + widthVect.x,
      y2: this.y - centerVect.y - marginY + widthVect.y,
      height: Math.sqrt(
        Math.pow(heightVect.x, 2) +
        Math.pow(heightVect.y + 2 * marginY, 2)
      )
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
   * Method used to resize the camera's dimensions.
   *
   * @param  {object} dimensions - New dimensions.
   * @return {Camera}
   */
  resize(dimensions) {

    if (!this.enabled)
      return this;

    if ('width' in dimensions)
      this.width = dimensions.width;

    if ('height' in dimensions)
      this.height = dimensions.height;

    this.emit('resized', this.getDimensions());

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
  animate(state, options /*, callback */) {

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
      x: 0,
      y: 0,
      ratio: 1,
      angle: 0
    }, options);
  }
}
