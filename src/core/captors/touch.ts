/**
 * Sigma.js Touch Captor
 * ======================
 *
 * Sigma's captor dealing with touch.
 * @module
 */
import { CameraState, Coordinates, Dimensions, TouchCoords } from "../../types";
import Captor, { getPosition, getTouchCoords, getTouchesArray } from "./captor";
import Sigma from "../../sigma";

const DRAG_TIMEOUT = 200;
const TOUCH_INERTIA_RATIO = 3;
const TOUCH_INERTIA_DURATION = 200;

export type FakeSigmaMouseEvent = MouseEvent & { isFakeSigmaMouseEvent?: true };

/**
 * Event types.
 */
export type TouchCaptorEvents = {
  touchdown(coordinates: TouchCoords): void;
  touchup(coordinates: TouchCoords): void;
  touchmove(coordinates: TouchCoords): void;
};

/**
 * Touch captor class.
 *
 * @constructor
 */
export default class TouchCaptor extends Captor<TouchCaptorEvents> {
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
  lastTouches?: Touch[];

  constructor(container: HTMLElement, renderer: Sigma) {
    super(container, renderer);

    // Binding methods:
    this.handleStart = this.handleStart.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMove = this.handleMove.bind(this);

    // Binding events
    container.addEventListener("touchstart", this.handleStart, false);
    container.addEventListener("touchend", this.handleLeave, false);
    container.addEventListener("touchcancel", this.handleLeave, false);
    container.addEventListener("touchmove", this.handleMove, false);
  }

  kill(): void {
    const container = this.container;

    container.removeEventListener("touchstart", this.handleStart);
    container.removeEventListener("touchend", this.handleLeave);
    container.removeEventListener("touchcancel", this.handleLeave);
    container.removeEventListener("touchmove", this.handleMove);
  }

  getDimensions(): Dimensions {
    return {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    };
  }

  dispatchRelatedMouseEvent(type: string, e: TouchEvent, touch?: Touch, emitter?: EventTarget): void {
    const mousePosition = touch || e.touches[0];
    const mouseEvent = new MouseEvent(type, {
      clientX: mousePosition.clientX,
      clientY: mousePosition.clientY,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
    });

    (mouseEvent as FakeSigmaMouseEvent).isFakeSigmaMouseEvent = true;

    (emitter || this.container).dispatchEvent(mouseEvent);
  }

  handleStart(e: TouchEvent): void {
    if (!this.enabled) return;

    // Prevent default to avoid default browser behaviors...
    e.preventDefault();
    // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
    if (e.touches.length === 1) this.dispatchRelatedMouseEvent("mousedown", e);

    const touches = getTouchesArray(e.touches);
    this.touchMode = touches.length;

    this.startCameraState = this.renderer.getCamera().getState();
    this.startTouchesPositions = touches.map((touch) => getPosition(touch, this.container));
    this.lastTouches = touches;
    this.lastTouchesPositions = this.startTouchesPositions;

    // When there are two touches down, let's record distance and angle as well:
    if (this.touchMode === 2) {
      const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = this.startTouchesPositions;
      this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
      this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }

    this.emit("touchdown", getTouchCoords(e, this.container));
  }

  handleLeave(e: TouchEvent): void {
    if (!this.enabled) return;

    // Prevent default to avoid default browser behaviors...
    e.preventDefault();
    // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
    if (e.touches.length === 0 && this.lastTouches && this.lastTouches.length) {
      this.dispatchRelatedMouseEvent("mouseup", e, this.lastTouches[0], document);
      // ... and only click if no move was made
      if (!this.hasMoved) {
        this.dispatchRelatedMouseEvent("click", e, this.lastTouches[0]);
      }
    }

    if (this.movingTimeout) {
      this.isMoving = false;
      clearTimeout(this.movingTimeout);
    }

    switch (this.touchMode) {
      case 2:
        if (e.touches.length === 1) {
          this.handleStart(e);

          e.preventDefault();
          break;
        }
      /* falls through */
      case 1:
        // TODO
        // Dispatch event

        if (this.isMoving) {
          const camera = this.renderer.getCamera();
          const cameraState = camera.getState(),
            previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };

          camera.animate(
            {
              x: cameraState.x + TOUCH_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
              y: cameraState.y + TOUCH_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
            },
            {
              duration: TOUCH_INERTIA_DURATION,
              easing: "quadraticOut",
            },
          );
        }

        this.hasMoved = false;
        this.isMoving = false;
        this.touchMode = 0;
        break;
    }

    this.emit("touchup", getTouchCoords(e, this.container));
  }

  handleMove(e: TouchEvent): void {
    if (!this.enabled) return;

    // Prevent default to avoid default browser behaviors...
    e.preventDefault();
    // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
    if (e.touches.length === 1) this.dispatchRelatedMouseEvent("mousemove", e);

    const touches = getTouchesArray(e.touches);
    const touchesPositions = touches.map((touch) => getPosition(touch, this.container));
    this.lastTouches = touches;
    this.lastTouchesPositions = touchesPositions;

    // If a move was initiated at some point and we get back to startpoint,
    // we should still consider that we did move (which also happens after a
    // multiple touch when only one touch remains in which case handleStart
    // is recalled within handleLeave).
    // Now, some mobile browsers report zero-distance moves so we also check that
    // one of the touches did actually move from the origin position.
    this.hasMoved ||= touchesPositions.some((position, idx) => {
      const startPosition = this.startTouchesPositions[idx];

      return position.x !== startPosition.x || position.y !== startPosition.y;
    });

    // If there was no move, do not trigger touch moves behavior
    if (!this.hasMoved) {
      return;
    }

    this.isMoving = true;

    if (this.movingTimeout) clearTimeout(this.movingTimeout);

    this.movingTimeout = window.setTimeout(() => {
      this.isMoving = false;
    }, DRAG_TIMEOUT);

    const camera = this.renderer.getCamera();
    const startCameraState = this.startCameraState as CameraState;

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
        const newCameraState: Partial<CameraState> = {};

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
        const smallestDimension = Math.min(dimensions.width, dimensions.height);

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

    this.emit("touchmove", getTouchCoords(e, this.container));
  }
}
