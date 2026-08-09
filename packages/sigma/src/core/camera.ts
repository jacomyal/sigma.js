/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
import { CameraState, TypedEventEmitter } from "../types";
import { ANIMATE_DEFAULTS, AnimateOptions, resolveEasing, shallowEqual } from "../utils";

/**
 * Defaults.
 */
const DEFAULT_ZOOMING_RATIO = 1.5;
export const DEFAULT_CAMERA_STATE: CameraState = { x: 0.5, y: 0.5, angle: 0, ratio: 1 };

/**
 * Options of the zoom shortcuts: the animation options, plus the zoom factor.
 */
export type ZoomOptions = Partial<AnimateOptions> & { factor?: number };

/**
 * Event payloads.
 */
export type CameraAnimationPayload = { from: CameraState; to: CameraState };
export type CameraAnimationEndPayload = CameraAnimationPayload & { completed: boolean };

/**
 * Event types.
 */
export type CameraEvents = {
  updated(state: CameraState): void;
  animationStart(payload: CameraAnimationPayload): void;
  animationEnd(payload: CameraAnimationEndPayload): void;
};

/**
 * Camera class
 */
export default class Camera extends TypedEventEmitter<CameraEvents> implements CameraState {
  minRatio: number | null = null;
  maxRatio: number | null = null;

  enabled = true;
  enabledZooming = true;
  enabledPanning = true;
  enabledRotation = true;

  /**
   * Hook to constrain each new state, applied at the end of
   * {@link Camera#validateState}. Owned by Sigma, which derives it from the
   * `cameraPanBoundaries` setting.
   * @internal
   */
  constrainState: ((state: CameraState) => CameraState) | null = null;

  private state: CameraState = { ...DEFAULT_CAMERA_STATE };
  private previousState: CameraState = { ...DEFAULT_CAMERA_STATE };
  private nextFrame: number | null = null;
  private currentAnimationFrom: CameraState | null = null;
  private currentAnimationTo: CameraState | null = null;
  private animationCallback: (() => void) | null = null;

  // The state is read-only: it can only be updated through #setState, so that
  // no update escapes validation and the "updated" event.
  get x(): number {
    return this.state.x;
  }
  get y(): number {
    return this.state.y;
  }
  get angle(): number {
    return this.state.angle;
  }
  get ratio(): number {
    return this.state.ratio;
  }

  /**
   * Static method used to create a Camera object with a given state.
   */
  static from(state: CameraState): Camera {
    const camera = new Camera();
    return camera.setState(state);
  }

  /**
   * Method used to retrieve the camera's current state.
   */
  getState(): CameraState {
    return { ...this.state };
  }

  /**
   * Method used to retrieve the state the camera had before its last update.
   */
  getPreviousState(): CameraState {
    return { ...this.previousState };
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
   * Method used to merge a state candidate into the current state, dropping
   * whatever the interaction flags forbid, and constraining the rest.
   */
  validateState(state: Partial<CameraState>): CameraState {
    const validatedState = this.getState();
    if (this.enabledPanning && typeof state.x === "number") validatedState.x = state.x;
    if (this.enabledPanning && typeof state.y === "number") validatedState.y = state.y;
    if (this.enabledZooming && typeof state.ratio === "number")
      validatedState.ratio = this.getBoundedRatio(state.ratio);
    if (this.enabledRotation && typeof state.angle === "number") validatedState.angle = state.angle;
    return this.constrainState ? this.constrainState(validatedState) : validatedState;
  }

  /**
   * Method used to check whether an animation is currently running.
   */
  isAnimating(): boolean {
    return this.nextFrame !== null;
  }

  /**
   * Method used to set the camera's state.
   */
  setState(state: Partial<CameraState>): this {
    if (!this.enabled) return this;

    const validState = this.validateState(state);
    if (shallowEqual(this.state, validState)) return this;

    this.previousState = this.state;
    this.state = validState;
    this.emit("updated", this.getState());

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
   * Animates the camera to the given state.
   *
   * The returned promise resolves when the animation stops, whether it ran to
   * completion or was interrupted by a new animation or by
   * {@link Camera#cancelAnimation}. Read `completed` on the `animationEnd`
   * event to tell those apart. On a disabled camera it resolves right away.
   */
  animate(state: Partial<CameraState>, options?: Partial<AnimateOptions>): Promise<void> {
    if (!this.enabled) return Promise.resolve();

    return new Promise((resolve) => this.runAnimation(state, { ...ANIMATE_DEFAULTS, ...options }, resolve));
  }

  /**
   * Stops the running animation where it is, leaving the camera at its current
   * state. No-op when nothing is running.
   */
  cancelAnimation(): this {
    if (this.nextFrame !== null) {
      cancelAnimationFrame(this.nextFrame);
      this.nextFrame = null;
    }

    this.resolveAnimation();
    this.emitAnimationEnd(false);

    return this;
  }

  /**
   * Method used to zoom the camera in, by dividing its ratio by `factor`.
   */
  zoomIn({ factor = DEFAULT_ZOOMING_RATIO, ...options }: ZoomOptions = {}): Promise<void> {
    return this.animate({ ratio: this.ratio / factor }, options);
  }

  /**
   * Method used to zoom the camera out, by multiplying its ratio by `factor`.
   */
  zoomOut({ factor = DEFAULT_ZOOMING_RATIO, ...options }: ZoomOptions = {}): Promise<void> {
    return this.animate({ ratio: this.ratio * factor }, options);
  }

  /**
   * Method used to animate the camera back to its default state.
   */
  reset(options?: Partial<AnimateOptions>): Promise<void> {
    return this.animate(DEFAULT_CAMERA_STATE, options);
  }

  /**
   * Drives the animation frame loop. Interrupts whatever was running first, so
   * a camera never has two animations competing for its state.
   */
  private runAnimation(state: Partial<CameraState>, options: AnimateOptions, callback: () => void): void {
    const easing = resolveEasing(options.easing);

    // State
    const start = Date.now(),
      initialState = this.getState(),
      targetState = this.validateState(state);

    // Function performing the animation
    const fn = () => {
      // The camera can get disabled mid-animation:
      if (!this.enabled) {
        this.cancelAnimation();
        return;
      }

      const t = options.duration > 0 ? (Date.now() - start) / options.duration : 1;

      // The animation is over:
      if (t >= 1) {
        this.nextFrame = null;
        this.setState(targetState);
        this.resolveAnimation();
        this.emitAnimationEnd(true);

        return;
      }

      const coefficient = easing(t);

      this.setState({
        x: initialState.x + (targetState.x - initialState.x) * coefficient,
        y: initialState.y + (targetState.y - initialState.y) * coefficient,
        angle: initialState.angle + (targetState.angle - initialState.angle) * coefficient,
        ratio: initialState.ratio + (targetState.ratio - initialState.ratio) * coefficient,
      });

      this.nextFrame = requestAnimationFrame(fn);
    };

    this.cancelAnimation();

    this.currentAnimationFrom = initialState;
    this.currentAnimationTo = targetState;
    this.animationCallback = callback;
    this.emit("animationStart", { from: initialState, to: targetState });

    fn();
  }

  /** Settles the pending `animate` promise, exactly once per animation. */
  private resolveAnimation(): void {
    const callback = this.animationCallback;
    this.animationCallback = null;
    if (callback) callback();
  }

  private emitAnimationEnd(completed: boolean): void {
    const from = this.currentAnimationFrom;
    const to = this.currentAnimationTo;
    if (!from || !to) return;
    this.currentAnimationFrom = null;
    this.currentAnimationTo = null;
    this.emit("animationEnd", { from, to, completed });
  }
}
