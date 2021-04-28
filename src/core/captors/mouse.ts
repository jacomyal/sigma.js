/**
 * Sigma.js Mouse Captor
 * ======================
 *
 * Sigma's captor dealing with the user's mouse.
 * @module
 */
import { CameraState } from "../../types";
import Camera from "../camera";
import Captor, { getX, getY, getWheelDelta, getMouseCoords } from "./captor";

/**
 * Constants.
 */
const DRAG_TIMEOUT = 200;
const DRAGGED_EVENTS_TOLERANCE = 3;
const MOUSE_INERTIA_DURATION = 200;
const MOUSE_INERTIA_RATIO = 3;
const MOUSE_ZOOM_DURATION = 250;
const ZOOMING_RATIO = 1.7;
const DOUBLE_CLICK_TIMEOUT = 300;
const DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
const DOUBLE_CLICK_ZOOMING_DURATION = 200;

/**
 * Mouse captor class.
 *
 * @constructor
 */
export default class MouseCaptor extends Captor {
  // State
  enabled = true;
  draggedEvents = 0;
  downStartTime: number | null = null;
  lastMouseX: number | null = null;
  lastMouseY: number | null = null;
  isMouseDown = false;
  isMoving = false;
  movingTimeout: number | null = null;
  startCameraState: CameraState | null = null;
  clicks = 0;
  doubleClickTimeout: number | null = null;

  currentWheelDirection: -1 | 0 | 1 = 0;
  lastWheelTriggerTime?: number;

  constructor(container: HTMLElement, camera: Camera) {
    super(container, camera);

    // Binding methods
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleOut = this.handleOut.bind(this);

    // Binding events
    container.addEventListener("click", this.handleClick, false);
    container.addEventListener("contextmenu", this.handleRightClick, false);
    container.addEventListener("mousedown", this.handleDown, false);
    container.addEventListener("mousemove", this.handleMove, false);
    container.addEventListener("wheel", this.handleWheel, false);
    container.addEventListener("mouseout", this.handleOut, false);

    document.addEventListener("mouseup", this.handleUp, false);
  }

  kill(): void {
    const container = this.container;

    container.removeEventListener("click", this.handleClick);
    container.removeEventListener("contextmenu", this.handleRightClick);
    container.removeEventListener("mousedown", this.handleDown);
    container.removeEventListener("mousemove", this.handleMove);
    container.removeEventListener("wheel", this.handleWheel);
    container.removeEventListener("mouseout", this.handleOut);

    document.removeEventListener("mouseup", this.handleUp);
  }

  handleClick(e: MouseEvent): void | boolean {
    if (!this.enabled) return;

    this.clicks++;

    if (this.clicks === 2) {
      this.clicks = 0;
      if (typeof this.doubleClickTimeout === "number") {
        clearTimeout(this.doubleClickTimeout);
        this.doubleClickTimeout = null;
      }
      return this.handleDoubleClick(e);
    }

    setTimeout(() => {
      this.clicks = 0;
      this.doubleClickTimeout = null;
    }, DOUBLE_CLICK_TIMEOUT);

    // NOTE: this is here to prevent click events on drag
    if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE) this.emit("click", getMouseCoords(e));
  }

  handleRightClick(e: MouseEvent): void {
    if (!this.enabled) return;

    this.emit("rightClick", getMouseCoords(e));
  }

  handleDoubleClick(e: MouseEvent): void | boolean {
    if (!this.enabled) return;

    const newRatio = this.camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO;

    this.camera.animate(
      this.camera.getViewportZoomedState(
        { x: getX(e), y: getY(e) },
        {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight,
        },
        newRatio,
      ),
      {
        easing: "quadraticInOut",
        duration: DOUBLE_CLICK_ZOOMING_DURATION,
      },
    );

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    e.stopPropagation();

    return false;
  }

  handleDown(e: MouseEvent): void {
    if (!this.enabled) return;

    this.startCameraState = this.camera.getState();

    this.lastMouseX = getX(e);
    this.lastMouseY = getY(e);

    this.draggedEvents = 0;

    this.downStartTime = Date.now();

    // TODO: dispatch events
    switch (e.which) {
      default:
        // Left button pressed
        this.isMouseDown = true;
        this.emit("mousedown", getMouseCoords(e));
    }
  }

  handleUp(e: MouseEvent): void {
    if (!this.enabled || !this.isMouseDown) return;

    this.isMouseDown = false;

    if (typeof this.movingTimeout === "number") {
      clearTimeout(this.movingTimeout);
      this.movingTimeout = null;
    }

    const x = getX(e),
      y = getY(e);

    const cameraState = this.camera.getState(),
      previousCameraState = this.camera.getPreviousState();

    if (this.isMoving) {
      this.camera.animate(
        {
          x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
          y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
        },
        {
          duration: MOUSE_INERTIA_DURATION,
          easing: "quadraticOut",
        },
      );
    } else if (this.lastMouseX !== x || this.lastMouseY !== y) {
      this.camera.setState({
        x: cameraState.x,
        y: cameraState.y,
      });
    }

    this.isMoving = false;
    setTimeout(() => (this.draggedEvents = 0), 0);
    this.emit("mouseup", getMouseCoords(e));
  }

  handleMove(e: MouseEvent): void | boolean {
    if (!this.enabled) return;
    this.emit("mousemove", getMouseCoords(e));

    if (this.isMouseDown) {
      // TODO: dispatch events
      this.isMoving = true;
      this.draggedEvents++;

      if (typeof this.movingTimeout === "number") {
        clearTimeout(this.movingTimeout);
      }

      this.movingTimeout = window.setTimeout(() => {
        this.movingTimeout = null;
        this.isMoving = false;
      }, DRAG_TIMEOUT);

      const dimensions = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      };

      const eX = getX(e),
        eY = getY(e);

      const lastMouse = this.camera.viewportToFramedGraph(dimensions, {
        x: this.lastMouseX as number,
        y: this.lastMouseY as number,
      });

      const mouse = this.camera.viewportToFramedGraph(dimensions, { x: eX, y: eY });

      const offsetX = lastMouse.x - mouse.x,
        offsetY = lastMouse.y - mouse.y;

      const cameraState = this.camera.getState();

      const x = cameraState.x + offsetX,
        y = cameraState.y + offsetY;

      this.camera.setState({ x, y });

      this.lastMouseX = eX;
      this.lastMouseY = eY;
    }

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    e.stopPropagation();

    return false;
  }

  handleWheel(e: WheelEvent): boolean {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    e.stopPropagation();

    if (!this.enabled) return false;

    const delta = getWheelDelta(e);

    if (!delta) return false;

    const ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
    const newRatio = this.camera.getState().ratio * ratioDiff;
    const wheelDirection = delta > 0 ? 1 : -1;
    const now = Date.now();

    // Cancel events that are too close too each other and in the same direction:
    if (
      this.currentWheelDirection === wheelDirection &&
      this.lastWheelTriggerTime &&
      now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5
    ) {
      return false;
    }

    this.camera.animate(
      this.camera.getViewportZoomedState(
        { x: getX(e), y: getY(e) },
        {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight,
        },
        newRatio,
      ),
      {
        easing: "quadraticOut",
        duration: MOUSE_ZOOM_DURATION,
      },
      () => {
        this.currentWheelDirection = 0;
      },
    );

    this.currentWheelDirection = wheelDirection;
    this.lastWheelTriggerTime = now;

    return false;
  }

  handleOut(): void {
    // TODO: dispatch event
  }
}
