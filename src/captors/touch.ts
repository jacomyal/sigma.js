import Captor from "../captor";
import Camera, { CameraState } from "../camera";
import { Coordinates, Dimensions } from "../types";
import { getPosition, getTouchCoords, getTouchesArray } from "./utils";

const DRAG_TIMEOUT = 200;
const TOUCH_INERTIA_RATIO = 3;
const TOUCH_INERTIA_DURATION = 200;

/**
 * Touch captor class.
 *
 * @constructor
 */
export default class TouchCaptor extends Captor {
  enabled = true;
  isMoving = false;
  startCameraState?: CameraState;
  touchMode = 0; // number of touches down
  movingTimeout?: number;

  startTouchesPositions?: Coordinates[];
  startTouchesAngle?: number;
  startTouchesDistance?: number;

  constructor(container: HTMLElement, camera: Camera) {
    super(container, camera);

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

  handleStart(e: TouchEvent): void | boolean {
    if (!this.enabled) return;

    e.preventDefault();

    const touches = getTouchesArray(e.touches);
    this.isMoving = true;
    this.touchMode = touches.length;

    this.startCameraState = this.camera.getState();
    this.startTouchesPositions = touches.map(getPosition);

    // When there are two touches down, let's record distance and angle as well:
    if (this.touchMode === 2) {
      const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = this.startTouchesPositions;
      this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
      this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }

    this.emit("touchdown", getTouchCoords(e));
  }

  handleLeave(e: TouchEvent): void {
    if (!this.enabled) return;

    e.preventDefault();

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
          const cameraState = this.camera.getState(),
            previousCameraState = this.camera.getPreviousState();

          this.camera.animate(
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

        this.isMoving = false;
        this.touchMode = 0;
        break;
    }

    this.emit("touchup", getTouchCoords(e));
  }

  handleMove(e: TouchEvent): void {
    if (!this.enabled) return;

    e.preventDefault();

    const startCameraState = this.startCameraState as CameraState;
    const touches = getTouchesArray(e.touches);
    const touchesPositions = touches.map(getPosition);
    this.isMoving = true;

    if (this.movingTimeout) clearTimeout(this.movingTimeout);

    this.movingTimeout = window.setTimeout(() => {
      this.isMoving = false;
    }, DRAG_TIMEOUT);

    switch (this.touchMode) {
      case 1: {
        const { x: xStart, y: yStart } = this.camera.viewportToGraph(
          this.getDimensions(),
          (this.startTouchesPositions || [])[0] as Coordinates,
        );
        const { x, y } = this.camera.viewportToGraph(this.getDimensions(), touchesPositions[0]);

        this.camera.setState({
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
        newCameraState.ratio = startCameraState.ratio / ratioDiff;
        newCameraState.angle = startCameraState.angle + angleDiff;

        // 2.
        const dimensions = this.getDimensions();
        const touchGraphPosition = Camera.from(startCameraState).viewportToGraph(
          dimensions,
          (this.startTouchesPositions || [])[0] as Coordinates,
        );
        const smallestDimension = Math.min(dimensions.width, dimensions.height);

        const dx = smallestDimension / dimensions.width;
        const dy = smallestDimension / dimensions.height;
        const ratio = newCameraState.ratio / smallestDimension;

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

        this.camera.setState(newCameraState);

        break;
      }
    }

    this.emit("touchmove", getTouchCoords(e));
  }
}
