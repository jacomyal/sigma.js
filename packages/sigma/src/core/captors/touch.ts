/**
 * Sigma.js Touch Captor
 * ======================
 *
 * Sigma's captor dealing with touch.
 * @module
 */
import { Attributes } from "graphology-types";

import { DEFAULT_SETTINGS, Settings } from "../../settings";
import Sigma from "../../sigma";
import { CameraState, Coordinates, Dimensions, TouchCoords } from "../../types";
import Captor, { getPosition, getTouchCoords, getTouchesArray } from "./captor";

export const TOUCH_SETTINGS_KEYS = [
  "dragTimeout",
  "inertiaDuration",
  "inertiaRatio",
  "doubleClickTimeout",
  "doubleClickZoomingRatio",
  "doubleClickZoomingDuration",
  "tapMoveTolerance",
] as const;

export type TouchSettingKey = (typeof TOUCH_SETTINGS_KEYS)[number];
export type TouchSettings = Pick<Settings, TouchSettingKey>;
export const DEFAULT_TOUCH_SETTINGS = TOUCH_SETTINGS_KEYS.reduce(
  (iter, key) => ({ ...iter, [key]: DEFAULT_SETTINGS[key] }),
  {},
) as TouchSettings;

/**
 * Event types.
 */
export type TouchCaptorEventType = "touchdown" | "touchup" | "touchmove" | "touchmovebody" | "tap" | "doubletap";
export type TouchCaptorEvents = Record<TouchCaptorEventType, (coordinates: TouchCoords) => void>;

/**
 * Touch captor class.
 *
 * @constructor
 */
export default class TouchCaptor<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Captor<TouchCaptorEvents, N, E, G> {
  enabled = true;
  isMoving = false;
  hasMoved = false;
  startCameraState?: CameraState;
  touchMode = 0; // number of touches down
  movingTimeout?: number;

  startTouchesAngle?: number;
  startTouchesDistance?: number;
  startTouchesPositions: Coordinates[] = [];
  lastTouchesPositions?: Coordinates[];
  lastTouches: Touch[] = [];
  lastTap: null | { position: Coordinates; time: number } = null;

  settings: TouchSettings = DEFAULT_TOUCH_SETTINGS;

  constructor(container: HTMLElement, renderer: Sigma<N, E, G>) {
    super(container, renderer);

    // Binding methods:
    this.handleStart = this.handleStart.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMove = this.handleMove.bind(this);

    // Binding events
    container.addEventListener("touchstart", this.handleStart, { capture: false });
    container.addEventListener("touchcancel", this.handleLeave, { capture: false });
    document.addEventListener("touchend", this.handleLeave, { capture: false, passive: false });
    document.addEventListener("touchmove", this.handleMove, { capture: false, passive: false });
  }

  kill(): void {
    const container = this.container;

    container.removeEventListener("touchstart", this.handleStart);
    container.removeEventListener("touchcancel", this.handleLeave);
    document.removeEventListener("touchend", this.handleLeave);
    document.removeEventListener("touchmove", this.handleMove);
  }

  getDimensions(): Dimensions {
    return {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    };
  }

  handleStart(e: TouchEvent): void {
    if (!this.enabled) return;

    e.preventDefault();

    const touches = getTouchesArray(e.touches);
    this.touchMode = touches.length;

    this.startCameraState = this.renderer.getCamera().getState();
    this.startTouchesPositions = touches.map((touch) => getPosition(touch, this.container));

    // When there are two touches down, let's record distance and angle as well:
    if (this.touchMode === 2) {
      const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = this.startTouchesPositions;
      this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
      this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }

    this.emit("touchdown", getTouchCoords(e, this.lastTouches, this.container));
    this.lastTouches = touches;
    this.lastTouchesPositions = this.startTouchesPositions;
  }

  handleLeave(e: TouchEvent): void {
    if (!this.enabled || !this.startTouchesPositions.length) return;

    if (e.cancelable) e.preventDefault();

    if (this.movingTimeout) {
      this.isMoving = false;
      clearTimeout(this.movingTimeout);
    }

    switch (this.touchMode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      case 2:
        if (e.touches.length === 1) {
          this.handleStart(e);

          e.preventDefault();
          break;
        }
      /* falls through */
      case 1:
        if (this.isMoving) {
          const camera = this.renderer.getCamera();
          const cameraState = camera.getState(),
            previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };

          camera.animate(
            {
              x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
              y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y),
            },
            {
              duration: this.settings.inertiaDuration,
              easing: "quadraticOut",
            },
          );
        }

        this.hasMoved = false;
        this.isMoving = false;
        this.touchMode = 0;
        break;
    }

    this.emit("touchup", getTouchCoords(e, this.lastTouches, this.container));

    // When the last touch ends and there hasn't been too much movement, trigger a "tap" or "doubletap" event:
    if (!e.touches.length) {
      const position = getPosition(this.lastTouches[0], this.container);
      const downPosition = this.startTouchesPositions[0];
      const dSquare = (position.x - downPosition.x) ** 2 + (position.y - downPosition.y) ** 2;

      if (!e.touches.length && dSquare < this.settings.tapMoveTolerance ** 2) {
        // Only trigger "doubletap" when the last tap is recent enough:
        if (this.lastTap && Date.now() - this.lastTap.time < this.settings.doubleClickTimeout) {
          const touchCoords = getTouchCoords(e, this.lastTouches, this.container);
          this.emit("doubletap", touchCoords);
          this.lastTap = null;

          if (!touchCoords.sigmaDefaultPrevented) {
            const camera = this.renderer.getCamera();
            const newRatio = camera.getBoundedRatio(camera.getState().ratio / this.settings.doubleClickZoomingRatio);

            camera.animate(this.renderer.getViewportZoomedState(position, newRatio), {
              easing: "quadraticInOut",
              duration: this.settings.doubleClickZoomingDuration,
            });
          }
        }
        // Else, trigger a normal "tap" event:
        else {
          const touchCoords = getTouchCoords(e, this.lastTouches, this.container);
          this.emit("tap", touchCoords);
          this.lastTap = { time: Date.now(), position: touchCoords.touches[0] || touchCoords.previousTouches[0] };
        }
      }
    }

    this.lastTouches = getTouchesArray(e.touches);
    this.startTouchesPositions = [];
  }

  handleMove(e: TouchEvent): void {
    if (!this.enabled || !this.startTouchesPositions.length) return;

    e.preventDefault();

    const touches = getTouchesArray(e.touches);
    const touchesPositions = touches.map((touch) => getPosition(touch, this.container));

    const lastTouches = this.lastTouches;
    this.lastTouches = touches;
    this.lastTouchesPositions = touchesPositions;

    const touchCoords = getTouchCoords(e, lastTouches, this.container);
    this.emit("touchmove", touchCoords);

    if (touchCoords.sigmaDefaultPrevented) return;

    // If a move was initiated at some point, and we get back to start point,
    // we should still consider that we did move (which also happens after a
    // multiple touch when only one touch remains in which case handleStart
    // is recalled within handleLeave).
    // Now, some mobile browsers report zero-distance moves so we also check that
    // one of the touches did actually move from the origin position.
    this.hasMoved ||= touchesPositions.some((position, idx) => {
      const startPosition = this.startTouchesPositions[idx];

      return startPosition && (position.x !== startPosition.x || position.y !== startPosition.y);
    });

    // If there was no move, do not trigger touch moves behavior
    if (!this.hasMoved) {
      return;
    }

    this.isMoving = true;

    if (this.movingTimeout) clearTimeout(this.movingTimeout);

    this.movingTimeout = window.setTimeout(() => {
      this.isMoving = false;
    }, this.settings.dragTimeout);

    const camera = this.renderer.getCamera();
    const startCameraState = this.startCameraState as CameraState;
    const padding = this.renderer.getSetting("stagePadding");

    switch (this.touchMode) {
      case 1: {
        const { x: xStart, y: yStart } = this.renderer.viewportToFramedGraph(
          (this.startTouchesPositions || [])[0] as Coordinates,
        );
        const { x, y } = this.renderer.viewportToFramedGraph(touchesPositions[0]);

        camera.setState({
          x: startCameraState.x + xStart - x,
          y: startCameraState.y + yStart - y,
        });
        break;
      }
      case 2: {
        /**
         * Here is the thinking here:
         *
         * 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
         *    of the d'n'd and now
         *
         * 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
         *    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
         *    position of this same touch now
         */
        const newCameraState: CameraState = {
          x: 0.5,
          y: 0.5,
          angle: 0,
          ratio: 1,
        };

        const { x: x0, y: y0 } = touchesPositions[0];
        const { x: x1, y: y1 } = touchesPositions[1];

        const angleDiff = Math.atan2(y1 - y0, x1 - x0) - (this.startTouchesAngle as number);
        const ratioDiff = Math.hypot(y1 - y0, x1 - x0) / (this.startTouchesDistance as number);

        // 1.
        const newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
        newCameraState.ratio = newRatio;
        newCameraState.angle = startCameraState.angle + angleDiff;

        // 2.
        const dimensions = this.getDimensions();
        const touchGraphPosition = this.renderer.viewportToFramedGraph(
          (this.startTouchesPositions || [])[0] as Coordinates,
          { cameraState: startCameraState },
        );
        const smallestDimension = Math.min(dimensions.width, dimensions.height) - 2 * padding;

        const dx = smallestDimension / dimensions.width;
        const dy = smallestDimension / dimensions.height;
        const ratio = newRatio / smallestDimension;

        // Align with center of the graph:
        let x = x0 - smallestDimension / 2 / dx;
        let y = y0 - smallestDimension / 2 / dy;

        // Rotate:
        [x, y] = [
          x * Math.cos(-newCameraState.angle) - y * Math.sin(-newCameraState.angle),
          y * Math.cos(-newCameraState.angle) + x * Math.sin(-newCameraState.angle),
        ];

        newCameraState.x = touchGraphPosition.x - x * ratio;
        newCameraState.y = touchGraphPosition.y + y * ratio;

        camera.setState(newCameraState);

        break;
      }
    }
  }

  setSettings(settings: TouchSettings): void {
    this.settings = settings;
  }
}
