/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 */
import { EventEmitter } from "events";

import { ANIMATE_DEFAULTS, AnimateOptions } from "./animate";
import easings from "./easings";
import { assign, cancelFrame, requestFrame } from "./utils";
import { Coordinates, Dimensions } from "./types";

/**
 * Defaults.
 */
const DEFAULT_ZOOMING_RATIO = 1.5;

// TODO: animate options = number polymorphism?
// TODO: pan, zoom, unzoom, reset, rotate, zoomTo
// TODO: add width / height to camera and add #.resize
// TODO: bind camera to renderer rather than sigma
// TODO: add #.graphToDisplay, #.displayToGraph, batch methods later

export interface CameraState extends Coordinates {
  angle: number;
  ratio: number;
}
/**
 * Camera class
 *
 * @constructor
 */
export default class Camera extends EventEmitter implements CameraState {
  x = 0.5;
  y = 0.5;
  angle = 0;
  ratio = 1;
  nextFrame: number | null = null;
  previousState: CameraState;
  enabled = true;

  animationCallback?: () => void;

  constructor() {
    super();

    // State
    this.previousState = this.getState();
  }

  /**
   * Static method used to create a Camera object with a given state.
   *
   * @param state
   * @return {Camera}
   */
  static from(state: CameraState): Camera {
    const camera = new Camera();
    return camera.setState(state);
  }

  /**
   * Method used to enable the camera.
   *
   * @return {Camera}
   */
  enable(): Camera {
    this.enabled = true;
    return this;
  }

  /**
   * Method used to disable the camera.
   *
   * @return {Camera}
   */
  disable(): Camera {
    this.enabled = false;
    return this;
  }

  /**
   * Method used to retrieve the camera's current state.
   *
   * @return {object}
   */
  getState(): CameraState {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      ratio: this.ratio,
    };
  }

  /**
   * Method used to retrieve the camera's previous state.
   *
   * @return {object}
   */
  getPreviousState(): CameraState {
    const state = this.previousState;

    return {
      x: state.x,
      y: state.y,
      angle: state.angle,
      ratio: state.ratio,
    };
  }

  /**
   * Method used to check whether the camera is currently being animated.
   *
   * @return {boolean}
   */
  isAnimated(): boolean {
    return !!this.nextFrame;
  }

  /**
   * Method returning the coordinates of a point from the graph frame to the
   * viewport.
   *
   * @param  {object} dimensions  - Dimensions of the viewport.
   * @param  {object} coordinates - Coordinates of the point.
   * @return {object}             - The point coordinates in the viewport.
   */
  graphToViewport(dimensions: Dimensions, coordinates: Coordinates): Coordinates {
    const smallestDimension = Math.min(dimensions.width, dimensions.height);

    const dx = smallestDimension / dimensions.width;
    const dy = smallestDimension / dimensions.height;
    const ratio = this.ratio / smallestDimension;

    // Align with center of the graph:
    const x1 = (coordinates.x - this.x) / ratio;
    const y1 = (this.y - coordinates.y) / ratio;

    // Rotate:
    const x2 = x1 * Math.cos(this.angle) - y1 * Math.sin(this.angle);
    const y2 = y1 * Math.cos(this.angle) + x1 * Math.sin(this.angle);

    return {
      // Translate to center of screen
      x: x2 + smallestDimension / 2 / dx,
      y: y2 + smallestDimension / 2 / dy,
    };
  }

  /**
   * Method returning the coordinates of a point from the viewport frame to the
   * graph frame.
   *
   * @param  {object} dimensions  - Dimensions of the viewport.
   * @param  {object} coordinates - Coordinates of the point.
   * @return {object}             - The point coordinates in the graph frame.
   */
  viewportToGraph(dimensions: Dimensions, coordinates: Coordinates): Coordinates {
    const smallestDimension = Math.min(dimensions.width, dimensions.height);

    const dx = smallestDimension / dimensions.width;
    const dy = smallestDimension / dimensions.height;
    const ratio = this.ratio / smallestDimension;

    // Align with center of the graph:
    const x1 = coordinates.x - smallestDimension / 2 / dx;
    const y1 = coordinates.y - smallestDimension / 2 / dy;

    // Rotate:
    const x2 = x1 * Math.cos(-this.angle) - y1 * Math.sin(-this.angle);
    const y2 = y1 * Math.cos(-this.angle) + x1 * Math.sin(-this.angle);

    return {
      x: x2 * ratio + this.x,
      y: -y2 * ratio + this.y,
    };
  }

  /**
   * Method returning the abstract rectangle containing the graph according
   * to the camera's state.
   *
   * @return {object} - The view's rectangle.
   */
  viewRectangle(dimensions: {
    width: number;
    height: number;
  }): { x1: number; y1: number; x2: number; y2: number; height: number } {
    // TODO: reduce relative margin?
    const marginX = (0 * dimensions.width) / 8,
      marginY = (0 * dimensions.height) / 8;

    const p1 = this.viewportToGraph(dimensions, { x: 0 - marginX, y: 0 - marginY }),
      p2 = this.viewportToGraph(dimensions, { x: dimensions.width + marginX, y: 0 - marginY }),
      h = this.viewportToGraph(dimensions, { x: 0, y: dimensions.height + marginY });

    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      height: p2.y - h.y,
    };
  }

  /**
   * Method used to set the camera's state.
   *
   * @param  {object} state - New state.
   * @return {Camera}
   */
  setState(state: Partial<CameraState>): Camera {
    if (!this.enabled) return this;

    // TODO: validations
    // TODO: update by function

    // Keeping track of last state
    this.previousState = this.getState();

    if (state.x) this.x = state.x;
    if (state.y) this.y = state.y;
    if (state.angle) this.angle = state.angle;
    if (state.ratio) this.ratio = state.ratio;

    // Emitting
    // TODO: don't emit if nothing changed?
    this.emit("updated", this.getState());

    return this;
  }

  /**
   * Method used to (un)zoom, while preserving the position of a viewport point.
   * Used for instance to
   *
   * @param viewportTarget
   * @param dimensions
   * @param ratio
   * @return {CameraState}
   */
  getViewportZoomedState(viewportTarget: Coordinates, dimensions: Dimensions, ratio: number): CameraState {
    // TODO: handle max zoom
    const ratioDiff = ratio / this.ratio;

    const center = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };

    const graphMousePosition = this.viewportToGraph(dimensions, viewportTarget);
    const graphCenterPosition = this.viewportToGraph(dimensions, center);

    return {
      ...this.getState(),
      x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + this.x,
      y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + this.y,
      ratio: ratio,
    };
  }

  /**
   * Method used to animate the camera.
   *
   * @param  {object}                    state      - State to reach eventually.
   * @param  {object}                    opts       - Options:
   * @param  {number}                      duration - Duration of the animation.
   * @param  {string | number => number}   easing   - Easing function or name of an existing one
   * @param  {function}                  callback   - Callback
   */
  animate(state: Partial<CameraState>, opts?: Partial<AnimateOptions>, callback?: () => void): void {
    if (!this.enabled) return;

    const options: AnimateOptions = assign<AnimateOptions>({}, ANIMATE_DEFAULTS, opts);

    const easing: (k: number) => number =
      typeof options.easing === "function" ? options.easing : easings[options.easing];

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

        if (this.animationCallback) {
          this.animationCallback.call(null);
          this.animationCallback = undefined;
        }

        return;
      }

      const coefficient = easing(t);

      const newState: Partial<CameraState> = {};

      if (state.x) newState.x = initialState.x + (state.x - initialState.x) * coefficient;
      if (state.y) newState.y = initialState.y + (state.y - initialState.y) * coefficient;
      if (state.angle) newState.angle = initialState.angle + (state.angle - initialState.angle) * coefficient;
      if (state.ratio) newState.ratio = initialState.ratio + (state.ratio - initialState.ratio) * coefficient;

      this.setState(newState);

      this.nextFrame = requestFrame(fn);
    };

    if (this.nextFrame) {
      cancelFrame(this.nextFrame);
      if (this.animationCallback) this.animationCallback.call(null);
      this.nextFrame = requestFrame(fn);
    } else {
      fn();
    }
    this.animationCallback = callback;
  }

  /**
   * Method used to zoom the camera.
   *
   * @param  {number|object} factorOrOptions - Factor or options.
   * @return {function}
   */
  animatedZoom(factorOrOptions: number | (Partial<AnimateOptions> & { factor: number })): void {
    if (!factorOrOptions) {
      this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
    } else {
      if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio / factorOrOptions });
      else
        this.animate(
          {
            ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
          },
          factorOrOptions,
        );
    }
  }

  /**
   * Method used to unzoom the camera.
   *
   * @param  {number|object} factorOrOptions - Factor or options.
   */
  animatedUnzoom(factorOrOptions: number | (Partial<AnimateOptions> & { factor: number })): void {
    if (!factorOrOptions) {
      this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
    } else {
      if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio * factorOrOptions });
      else
        this.animate(
          {
            ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
          },
          factorOrOptions,
        );
    }
  }

  /**
   * Method used to reset the camera.
   *
   * @param  {object} options - Options.
   */
  animatedReset(options: Partial<AnimateOptions>): void {
    this.animate(
      {
        x: 0.5,
        y: 0.5,
        ratio: 1,
        angle: 0,
      },
      options,
    );
  }

  /**
   * Returns a new Camera instance, with the same state as the current camera.
   *
   * @return {Camera}
   */
  copy(): Camera {
    return Camera.from(this.getState());
  }
}
