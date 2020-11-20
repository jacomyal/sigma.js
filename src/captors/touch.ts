import Captor from "../captor";
import Camera, { CameraState } from "../camera";
import { Coordinates, Dimensions } from "../types";
import { getPosition } from "./utils";

const DRAG_TIMEOUT = 200;
const TOUCH_INERTIA_RATIO = 3;
const TOUCH_INERTIA_DURATION = 200;

function getTouchesArray(touches: TouchList, maxTouches = Infinity): Touch[] {
  const arr = [];
  for (let i = 0, l = Math.min(touches.length, maxTouches); i < l; i++) arr.push(touches[i]);
  return arr;
}

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
  doubleTap = false;

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

    const touches = getTouchesArray(e.touches, 2);
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
          this.doubleTap = false;

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
  }

  handleMove(e: TouchEvent): void {
    if (this.doubleTap || !this.enabled) return;

    e.preventDefault();

    const startCameraState = this.startCameraState as CameraState;
    const touches = getTouchesArray(e.touches, 2);
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
        const newCameraPosition: Partial<CameraState> = {};

        const { x: x0, y: y0 } = touchesPositions[0];
        const { x: x1, y: y1 } = touchesPositions[1];
        const { x: xStart0, y: yStart0 } = (this.startTouchesPositions || [])[0] as Coordinates;
        const { x: xStart1, y: yStart1 } = (this.startTouchesPositions || [])[1] as Coordinates;

        const startCamera = Camera.from(startCameraState);

        const startCenterPosition = startCamera.viewportToGraph(this.getDimensions(), {
          x: (xStart0 + xStart1) / 2,
          y: (yStart0 + yStart1) / 2,
        });
        const endCenterPosition = startCamera.viewportToGraph(this.getDimensions(), {
          x: (x0 + x1) / 2,
          y: (y0 + y1) / 2,
        });

        const angleDiff = Math.atan2(y1 - y0, x1 - x0) - (this.startTouchesAngle as number);
        const ratioDiff =
          Math.sqrt((y1 - y0) * (y1 - y0) + (x1 - x0) * (x1 - x0)) / (this.startTouchesDistance as number);

        // Translation:
        const xDiff = startCenterPosition.x - endCenterPosition.x;
        const yDiff = startCenterPosition.y - endCenterPosition.y;

        // Homothetic transformation:
        newCameraPosition.ratio = startCameraState.ratio / ratioDiff;
        // TODO: Rescale the diff vector

        // Rotation:
        newCameraPosition.angle = startCameraState.angle + angleDiff;
        // TODO: Rotate the diff vector

        // Finalize:
        newCameraPosition.x = startCameraState.x + xDiff;
        newCameraPosition.y = startCameraState.y + yDiff;

        this.camera.setState(newCameraPosition);

        break;
      }
    }
  }
}
