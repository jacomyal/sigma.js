/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
import { ANIMATE_DEFAULTS, AnimateOptions } from "../utils/animate";
import easings from "../utils/easings";
import { cancelFrame, requestFrame } from "../utils";
import { CameraState, TypedEventEmitter } from "../types";

/**
 * Defaults.
 */
const DEFAULT_ZOOMING_RATIO = 1.5;

/**
 * Event types.
 */
export type CameraEvents = {
  updated(state: CameraState): void;
};

/**
 * Camera class
 *
 * @constructor
 */
export default class Camera extends TypedEventEmitter<CameraEvents> implements CameraState {
  x = 0.5;
  y = 0.5;
  angle = 0;
  ratio = 1;

  minRatio: number | null = null;
  maxRatio: number | null = null;

  private nextFrame: number | null = null;
  private previousState: CameraState | null = null;
  private enabled = true;

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
  enable(): this {
    this.enabled = true;
    return this;
  }

  /**
   * Method used to disable the camera.
   *
   * @return {Camera}
   */
  disable(): this {
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
   * Method used to check whether the camera has the given state.
   *
   * @return {object}
   */
  hasState(state: CameraState): boolean {
    return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
  }

  /**
   * Method used to retrieve the camera's previous state.
   *
   * @return {object}
   */
  getPreviousState(): CameraState | null {
    const state = this.previousState;

    if (!state) return null;

    return {
      x: state.x,
      y: state.y,
      angle: state.angle,
      ratio: state.ratio,
    };
  }

  /**
   * Method used to check minRatio and maxRatio values.
   *
   * @param ratio
   * @return {number}
   */
  getBoundedRatio(ratio: number): number {
    let r = ratio;
    if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
    if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
    return r;
  }

  /**
   * Method used to check various things to return a legit state candidate.
   *
   * @param state
   * @return {object}
   */
  validateState(state: Partial<CameraState>): Partial<CameraState> {
    const validatedState: Partial<CameraState> = {};
    if (typeof state.x === "number") validatedState.x = state.x;
    if (typeof state.y === "number") validatedState.y = state.y;
    if (typeof state.angle === "number") validatedState.angle = state.angle;
    if (typeof state.ratio === "number") validatedState.ratio = this.getBoundedRatio(state.ratio);
    return validatedState;
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
   * Method used to set the camera's state.
   *
   * @param  {object} state - New state.
   * @return {Camera}
   */
  setState(state: Partial<CameraState>): this {
    if (!this.enabled) return this;

    // TODO: update by function

    // Keeping track of last state
    this.previousState = this.getState();

    const validState = this.validateState(state);
    if (typeof validState.x === "number") this.x = validState.x;
    if (typeof validState.y === "number") this.y = validState.y;
    if (typeof validState.angle === "number") this.angle = validState.angle;
    if (typeof validState.ratio === "number") this.ratio = validState.ratio;

    // Emitting
    if (!this.hasState(this.previousState)) this.emit("updated", this.getState());

    return this;
  }

  /**
   * Method used to update the camera's state using a function.
   *
   * @param  {function} updater - Updated function taking current state and
   *                              returning next state.
   * @return {Camera}
   */
  updateState(updater: (state: CameraState) => Partial<CameraState>): this {
    this.setState(updater(this.getState()));
    return this;
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

    const options: AnimateOptions = Object.assign({}, ANIMATE_DEFAULTS, opts);
    const validState = this.validateState(state);

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
        this.setState(validState);

        if (this.animationCallback) {
          this.animationCallback.call(null);
          this.animationCallback = undefined;
        }

        return;
      }

      const coefficient = easing(t);

      const newState: Partial<CameraState> = {};

      if (typeof validState.x === "number") newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
      if (typeof validState.y === "number") newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
      if (typeof validState.angle === "number")
        newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
      if (typeof validState.ratio === "number")
        newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;

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
  animatedZoom(factorOrOptions?: number | (Partial<AnimateOptions> & { factor?: number })): void {
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
  animatedUnzoom(factorOrOptions?: number | (Partial<AnimateOptions> & { factor?: number })): void {
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
  animatedReset(options?: Partial<AnimateOptions>): void {
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
