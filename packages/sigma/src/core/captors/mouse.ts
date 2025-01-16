/**
 * Sigma.js Mouse Captor
 * ======================
 *
 * Sigma's captor dealing with the user's mouse.
 * @module
 */
import { Attributes } from "graphology-types";

import { DEFAULT_SETTINGS, Settings } from "../../settings";
import Sigma from "../../sigma";
import { CameraState, MouseCoords, WheelCoords } from "../../types";
import Captor, { getMouseCoords, getPosition, getWheelCoords, getWheelDelta } from "./captor";

export const MOUSE_SETTINGS_KEYS = [
  "doubleClickTimeout",
  "doubleClickZoomingDuration",
  "doubleClickZoomingRatio",
  "dragTimeout",
  "draggedEventsTolerance",
  "inertiaDuration",
  "inertiaRatio",
  "zoomDuration",
  "zoomingRatio",
] as const;

export type MouseSettingKey = (typeof MOUSE_SETTINGS_KEYS)[number];
export type MouseSettings = Pick<Settings, MouseSettingKey>;
export const DEFAULT_MOUSE_SETTINGS = MOUSE_SETTINGS_KEYS.reduce(
  (iter, key) => ({ ...iter, [key]: DEFAULT_SETTINGS[key] }),
  {},
) as MouseSettings;

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
  mouseleave(coordinates: MouseCoords): void;
  mouseenter(coordinates: MouseCoords): void;
  wheel(coordinates: WheelCoords): void;
};

/**
 * Mouse captor class.
 *
 * @constructor
 */
export default class MouseCaptor<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Captor<MouseCaptorEvents, N, E, G> {
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

  settings: MouseSettings = DEFAULT_MOUSE_SETTINGS;

  constructor(container: HTMLElement, renderer: Sigma<N, E, G>) {
    super(container, renderer);

    // Binding methods
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleEnter = this.handleEnter.bind(this);

    // Binding events
    container.addEventListener("click", this.handleClick, { capture: false });
    container.addEventListener("contextmenu", this.handleRightClick, { capture: false });
    container.addEventListener("mousedown", this.handleDown, { capture: false });
    container.addEventListener("wheel", this.handleWheel, { capture: false });
    container.addEventListener("mouseleave", this.handleLeave, { capture: false });
    container.addEventListener("mouseenter", this.handleEnter, { capture: false });

    document.addEventListener("mousemove", this.handleMove, { capture: false });
    document.addEventListener("mouseup", this.handleUp, { capture: false });
  }

  kill(): void {
    const container = this.container;

    container.removeEventListener("click", this.handleClick);
    container.removeEventListener("contextmenu", this.handleRightClick);
    container.removeEventListener("mousedown", this.handleDown);
    container.removeEventListener("wheel", this.handleWheel);
    container.removeEventListener("mouseleave", this.handleLeave);
    container.removeEventListener("mouseenter", this.handleEnter);

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
    }, this.settings.doubleClickTimeout);

    // NOTE: this is here to prevent click events on drag
    if (this.draggedEvents < this.settings.draggedEventsTolerance)
      this.emit("click", getMouseCoords(e, this.container));
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
    const newRatio = camera.getBoundedRatio(camera.getState().ratio / this.settings.doubleClickZoomingRatio);

    camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
      easing: "quadraticInOut",
      duration: this.settings.doubleClickZoomingDuration,
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
          x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
          y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y),
        },
        {
          duration: this.settings.inertiaDuration,
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
      const shouldRefresh = this.draggedEvents > 0;
      this.draggedEvents = 0;

      // NOTE: this refresh is here to make sure `hideEdgesOnMove` can work
      // when someone releases camera pan drag after having stopped moving.
      // See commit: https://github.com/jacomyal/sigma.js/commit/cfd9197f70319109db6b675dd7c82be493ca95a2
      // See also issue: https://github.com/jacomyal/sigma.js/issues/1290
      // It could be possible to render instead of scheduling a refresh but for
      // now it seems good enough.
      if (shouldRefresh && this.renderer.getSetting("hideEdgesOnMove")) this.renderer.refresh();
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
    if (e.target === this.container || e.composedPath()[0] === this.container) {
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
      }, this.settings.dragTimeout);

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

  handleLeave(e: MouseEvent): void {
    this.emit("mouseleave", getMouseCoords(e, this.container));
  }

  handleEnter(e: MouseEvent): void {
    this.emit("mouseenter", getMouseCoords(e, this.container));
  }

  handleWheel(e: WheelEvent): void {
    const camera = this.renderer.getCamera();
    if (!this.enabled || !camera.enabledZooming) return;

    const delta = getWheelDelta(e);

    if (!delta) return;

    const wheelCoords = getWheelCoords(e, this.container);
    this.emit("wheel", wheelCoords);

    if (wheelCoords.sigmaDefaultPrevented) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Default behavior
    const currentRatio = camera.getState().ratio;
    const ratioDiff = delta > 0 ? 1 / this.settings.zoomingRatio : this.settings.zoomingRatio;
    const newRatio = camera.getBoundedRatio(currentRatio * ratioDiff);
    const wheelDirection = delta > 0 ? 1 : -1;
    const now = Date.now();

    // Exit early without preventing default behavior when ratio doesn't change:
    if (currentRatio === newRatio) return;

    e.preventDefault();
    e.stopPropagation();

    // Cancel events that are too close each other and in the same direction:
    if (
      this.currentWheelDirection === wheelDirection &&
      this.lastWheelTriggerTime &&
      now - this.lastWheelTriggerTime < this.settings.zoomDuration / 5
    ) {
      return;
    }

    camera.animate(
      this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio),
      {
        easing: "quadraticOut",
        duration: this.settings.zoomDuration,
      },
      () => {
        this.currentWheelDirection = 0;
      },
    );

    this.currentWheelDirection = wheelDirection;
    this.lastWheelTriggerTime = now;
  }

  setSettings(settings: MouseSettings): void {
    this.settings = settings;
  }
}
