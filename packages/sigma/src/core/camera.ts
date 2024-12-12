/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
import { CameraState, TypedEventEmitter } from "../types";
import { ANIMATE_DEFAULTS, AnimateOptions, easings } from "../utils";

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
 */
export default class Camera extends TypedEventEmitter<CameraEvents> implements CameraState {
  x = 0.5;
  y = 0.5;
  angle = 0;
  ratio = 1;

  minRatio: number | null = null;
  maxRatio: number | null = null;
  enabledZooming = true;
  enabledPanning = true;
  enabledRotation = true;
  clean: ((state: CameraState) => CameraState) | null = null;

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
   */
  static from(state: CameraState): Camera {
    const camera = new Camera();
    return camera.setState(state);
  }

  /**
   * Method used to enable the camera.
   */
  enable(): this {
    this.enabled = true;
    return this;
  }

  /**
   * Method used to disable the camera.
   */
  disable(): this {
    this.enabled = false;
    return this;
  }

  /**
   * Method used to retrieve the camera's current state.
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
   */
  hasState(state: CameraState): boolean {
    return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
  }

  /**
   * Method used to retrieve the camera's previous state.
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
   */
  getBoundedRatio(ratio: number): number {
    let r = ratio;
    if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
    if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
    return r;
  }

  /**
   * Method used to check various things to return a legit state candidate.
   */
  validateState(state: Partial<CameraState>): Partial<CameraState> {
    const validatedState: Partial<CameraState> = {};
    if (this.enabledPanning && typeof state.x === "number") validatedState.x = state.x;
    if (this.enabledPanning && typeof state.y === "number") validatedState.y = state.y;
    if (this.enabledZooming && typeof state.ratio === "number")
      validatedState.ratio = this.getBoundedRatio(state.ratio);
    if (this.enabledRotation && typeof state.angle === "number") validatedState.angle = state.angle;
    return this.clean ? this.clean({ ...this.getState(), ...validatedState }) : validatedState;
  }

  /**
   * Method used to check whether the camera is currently being animated.
   */
  isAnimated(): boolean {
    return !!this.nextFrame;
  }

  /**
   * Method used to set the camera's state.
   */
  setState(state: Partial<CameraState>): this {
    if (!this.enabled) return this;

    // Keeping track of last state
    this.previousState = this.getState();

    const validState = this.validateState(state);
    if (typeof validState.x === "number") this.x = validState.x;
    if (typeof validState.y === "number") this.y = validState.y;
    if (typeof validState.ratio === "number") this.ratio = validState.ratio;
    if (typeof validState.angle === "number") this.angle = validState.angle;

    // Emitting
    if (!this.hasState(this.previousState)) this.emit("updated", this.getState());

    return this;
  }

  /**
   * Method used to update the camera's state using a function.
   */
  updateState(updater: (state: CameraState) => Partial<CameraState>): this {
    this.setState(updater(this.getState()));
    return this;
  }

  /**
   * Method used to animate the camera.
   */
  animate(state: Partial<CameraState>, opts: Partial<AnimateOptions>, callback: () => void): void;
  animate(state: Partial<CameraState>, opts?: Partial<AnimateOptions>): Promise<void>;
  animate(
    state: Partial<CameraState>,
    opts: Partial<AnimateOptions> = {},
    callback?: () => void,
  ): void | Promise<void> {
    if (!callback) return new Promise((resolve) => this.animate(state, opts, resolve));

    if (!this.enabled) return;

    const options: AnimateOptions = {
      ...ANIMATE_DEFAULTS,
      ...opts,
    };
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
      if (this.enabledRotation && typeof validState.angle === "number")
        newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
      if (typeof validState.ratio === "number")
        newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;

      this.setState(newState);

      this.nextFrame = requestAnimationFrame(fn);
    };

    if (this.nextFrame) {
      cancelAnimationFrame(this.nextFrame);
      if (this.animationCallback) this.animationCallback.call(null);
      this.nextFrame = requestAnimationFrame(fn);
    } else {
      fn();
    }

    this.animationCallback = callback;
  }

  /**
   * Method used to zoom the camera.
   */
  animatedZoom(factorOrOptions?: number | (Partial<AnimateOptions> & { factor?: number })): Promise<void> {
    if (!factorOrOptions) return this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });

    if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio / factorOrOptions });

    return this.animate(
      {
        ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
      },
      factorOrOptions,
    );
  }

  /**
   * Method used to unzoom the camera.
   */
  animatedUnzoom(factorOrOptions?: number | (Partial<AnimateOptions> & { factor?: number })): Promise<void> {
    if (!factorOrOptions) return this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });

    if (typeof factorOrOptions === "number") return this.animate({ ratio: this.ratio * factorOrOptions });

    return this.animate(
      {
        ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
      },
      factorOrOptions,
    );
  }

  /**
   * Method used to reset the camera.
   */
  animatedReset(options?: Partial<AnimateOptions>): Promise<void> {
    return this.animate(
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
   */
  copy(): Camera {
    return Camera.from(this.getState());
  }
}
