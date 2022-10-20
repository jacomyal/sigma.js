/**
 * Sigma.js Mouse Captor
 * ======================
 *
 * Sigma's captor dealing with the user's mouse.
 * @module
 */
import { CameraState, MouseCoords, WheelCoords } from "../../types";
import Sigma from "../../sigma";
import Captor, { getWheelDelta, getMouseCoords, getPosition, getWheelCoords } from "./captor";

/**
 * Constants.
 */
const DRAG_TIMEOUT = 100;
const DRAGGED_EVENTS_TOLERANCE = 3;
const MOUSE_INERTIA_DURATION = 200;
const MOUSE_INERTIA_RATIO = 3;
const MOUSE_ZOOM_DURATION = 250;
const ZOOMING_RATIO = 1.7;
const DOUBLE_CLICK_TIMEOUT = 300;
const DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
const DOUBLE_CLICK_ZOOMING_DURATION = 200;

/**
 * Event types.
 */
export type MouseCaptorEvents = {
  click(coordinates: MouseCoords): void;
  rightClick(coordinates: MouseCoords): void;
  doubleClick(coordinates: MouseCoords): void;
  mouseup(coordinates: MouseCoords): void;
  mousedown(coordinates: MouseCoords): void;
  mousemove(coordinates: MouseCoords): void;
  mousemovebody(coordinates: MouseCoords): void;
  wheel(coordinates: WheelCoords): void;
};

/**
 * Mouse captor class.
 *
 * @constructor
 */
export default class MouseCaptor extends Captor<MouseCaptorEvents> {
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

  constructor(container: HTMLElement, renderer: Sigma) {
    super(container, renderer);

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
    container.addEventListener("wheel", this.handleWheel, false);
    container.addEventListener("mouseout", this.handleOut, false);

    document.addEventListener("mousemove", this.handleMove, false);
    document.addEventListener("mouseup", this.handleUp, false);
  }

  kill(): void {
    const container = this.container;

    container.removeEventListener("click", this.handleClick);
    container.removeEventListener("contextmenu", this.handleRightClick);
    container.removeEventListener("mousedown", this.handleDown);
    container.removeEventListener("wheel", this.handleWheel);
    container.removeEventListener("mouseout", this.handleOut);

    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleUp);
  }

  handleClick(e: MouseEvent): void {
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
    if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE) this.emit("click", getMouseCoords(e, this.container));
  }

  handleRightClick(e: MouseEvent): void {
    if (!this.enabled) return;

    this.emit("rightClick", getMouseCoords(e, this.container));
  }

  handleDoubleClick(e: MouseEvent): void {
    if (!this.enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const mouseCoords = getMouseCoords(e, this.container);
    this.emit("doubleClick", mouseCoords);

    if (mouseCoords.sigmaDefaultPrevented) return;

    // default behavior
    const camera = this.renderer.getCamera();
    const newRatio = camera.getBoundedRatio(camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO);

    camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
      easing: "quadraticInOut",
      duration: DOUBLE_CLICK_ZOOMING_DURATION,
    });
  }

  handleDown(e: MouseEvent): void {
    if (!this.enabled) return;

    // We only start dragging on left button
    if (e.button === 0) {
      this.startCameraState = this.renderer.getCamera().getState();

      const { x, y } = getPosition(e, this.container);
      this.lastMouseX = x;
      this.lastMouseY = y;

      this.draggedEvents = 0;

      this.downStartTime = Date.now();
      this.isMouseDown = true;
    }

    this.emit("mousedown", getMouseCoords(e, this.container));
  }

  handleUp(e: MouseEvent): void {
    if (!this.enabled || !this.isMouseDown) return;

    const camera = this.renderer.getCamera();
    this.isMouseDown = false;

    if (typeof this.movingTimeout === "number") {
      clearTimeout(this.movingTimeout);
      this.movingTimeout = null;
    }

    const { x, y } = getPosition(e, this.container);

    const cameraState = camera.getState(),
      previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };

    if (this.isMoving) {
      camera.animate(
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
      camera.setState({
        x: cameraState.x,
        y: cameraState.y,
      });
    }

    this.isMoving = false;
    setTimeout(() => {
      this.draggedEvents = 0;

      // NOTE: this refresh is here to make sure `hideEdgesOnMove` can work
      // when someone releases camera pan drag after having stopped moving.
      // See commit: https://github.com/jacomyal/sigma.js/commit/cfd9197f70319109db6b675dd7c82be493ca95a2
      // See also issue: https://github.com/jacomyal/sigma.js/issues/1290
      // It could be possible to render instead of scheduling a refresh but for
      // now it seems good enough.
      this.renderer.refresh();
    }, 0);
    this.emit("mouseup", getMouseCoords(e, this.container));
  }

  handleMove(e: MouseEvent): void {
    if (!this.enabled) return;

    const mouseCoords = getMouseCoords(e, this.container);

    // Always trigger a "mousemovebody" event, so that it is possible to develop
    // a drag-and-drop effect that works even when the mouse is out of the
    // container:
    this.emit("mousemovebody", mouseCoords);

    // Only trigger the "mousemove" event when the mouse is actually hovering
    // the container, to avoid weirdly hovering nodes and/or edges when the
    // mouse is not hover the container:
    if (e.target === this.container) {
      this.emit("mousemove", mouseCoords);
    }

    if (mouseCoords.sigmaDefaultPrevented) return;

    // Handle the case when "isMouseDown" all the time, to allow dragging the
    // stage while the mouse is not hover the container:
    if (this.isMouseDown) {
      this.isMoving = true;
      this.draggedEvents++;

      if (typeof this.movingTimeout === "number") {
        clearTimeout(this.movingTimeout);
      }

      this.movingTimeout = window.setTimeout(() => {
        this.movingTimeout = null;
        this.isMoving = false;
      }, DRAG_TIMEOUT);

      const camera = this.renderer.getCamera();

      const { x: eX, y: eY } = getPosition(e, this.container);

      const lastMouse = this.renderer.viewportToFramedGraph({
        x: this.lastMouseX as number,
        y: this.lastMouseY as number,
      });

      const mouse = this.renderer.viewportToFramedGraph({ x: eX, y: eY });

      const offsetX = lastMouse.x - mouse.x,
        offsetY = lastMouse.y - mouse.y;

      const cameraState = camera.getState();

      const x = cameraState.x + offsetX,
        y = cameraState.y + offsetY;

      camera.setState({ x, y });

      this.lastMouseX = eX;
      this.lastMouseY = eY;

      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleWheel(e: WheelEvent): void {
    if (!this.enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const delta = getWheelDelta(e);

    if (!delta) return;

    const wheelCoords = getWheelCoords(e, this.container);
    this.emit("wheel", wheelCoords);

    if (wheelCoords.sigmaDefaultPrevented) return;

    // Default behavior
    const ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
    const camera = this.renderer.getCamera();
    const newRatio = camera.getBoundedRatio(camera.getState().ratio * ratioDiff);
    const wheelDirection = delta > 0 ? 1 : -1;
    const now = Date.now();

    // Cancel events that are too close too each other and in the same direction:
    if (
      this.currentWheelDirection === wheelDirection &&
      this.lastWheelTriggerTime &&
      now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5
    ) {
      return;
    }

    camera.animate(
      this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio),
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
  }

  handleOut(): void {
    // TODO: dispatch event
  }
}
