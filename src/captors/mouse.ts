/**
 * Sigma.js Mouse Captor
 * ======================
 *
 * Sigma's captor dealing with the user's mouse.
 */
import Camera, { CameraState } from "../camera";
import Captor from "../captor";

import { getX, getY, getCenter, getWheelDelta, getMouseCoords } from "./utils";

/**
 * Constants.
 */
const DRAG_TIMEOUT = 200;
const MOUSE_INERTIA_DURATION = 200;
const MOUSE_INERTIA_RATIO = 3;
const MOUSE_ZOOM_DURATION = 200;
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
  container: HTMLElement;
  camera: Camera;
  // State
  enabled: boolean = true;
  hasDragged: boolean = false;
  downStartTime: number = null;
  lastMouseX: number = null;
  lastMouseY: number = null;
  isMouseDown: boolean = false;
  isMoving: boolean = null;
  movingTimeout: number = null;
  startCameraState: CameraState = null;
  lastCameraState: CameraState = null;
  clicks: number = 0;
  doubleClickTimeout: number = null;
  wheelLock: boolean = false;

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
    container.addEventListener("DOMMouseScroll", this.handleWheel, false);
    container.addEventListener("mousewheel", this.handleWheel, false);
    container.addEventListener("mouseout", this.handleOut, false);

    document.addEventListener("mouseup", this.handleUp, false);
  }

  kill() {
    const container = this.container;

    container.removeEventListener("click", this.handleClick);
    container.removeEventListener("contextmenu", this.handleRightClick);
    container.removeEventListener("mousedown", this.handleDown);
    container.removeEventListener("mousemove", this.handleMove);
    container.removeEventListener("DOMMouseScroll", this.handleWheel);
    container.removeEventListener("mousewheel", this.handleWheel);
    container.removeEventListener("mouseout", this.handleOut);

    document.removeEventListener("mouseup", this.handleUp);
  }

  handleClick(e: MouseEvent) {
    if (!this.enabled) return;

    this.clicks++;

    if (this.clicks === 2) {
      this.clicks = 0;

      clearTimeout(this.doubleClickTimeout);
      this.doubleClickTimeout = null;

      return this.handleDoubleClick(e);
    }

    setTimeout(() => {
      this.clicks = 0;
      this.doubleClickTimeout = null;
    }, DOUBLE_CLICK_TIMEOUT);

    // NOTE: this is here to prevent click events on drag
    if (!this.hasDragged) this.emit("click", getMouseCoords(e));
  }

  handleRightClick(e: MouseEvent) {
    if (!this.enabled) return;

    this.emit("rightClick", getMouseCoords(e));
  }

  handleDoubleClick(e: MouseEvent) {
    if (!this.enabled) return;

    const center = getCenter(e);

    const cameraState = this.camera.getState();

    const newRatio = cameraState.ratio / DOUBLE_CLICK_ZOOMING_RATIO;

    // TODO: factorize
    const dimensions = {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    };

    const clickX = getX(e),
      clickY = getY(e);

    // TODO: baaaad we mustn't mutate the camera, create a Camera.from or #.copy
    // TODO: factorize pan & zoomTo
    const cameraWithNewRatio = new Camera();
    cameraWithNewRatio.ratio = newRatio;
    cameraWithNewRatio.x = cameraState.x;
    cameraWithNewRatio.y = cameraState.y;

    const clickGraph = this.camera.viewportToGraph(dimensions, clickX, clickY),
      centerGraph = this.camera.viewportToGraph(dimensions, center.x, center.y);

    const clickGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, clickX, clickY),
      centerGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, center.x, center.y);

    const deltaX = clickGraphNew.x - centerGraphNew.x - clickGraph.x + centerGraph.x,
      deltaY = clickGraphNew.y - centerGraphNew.y - clickGraph.y + centerGraph.y;

    this.camera.animate(
      {
        x: cameraState.x - deltaX,
        y: cameraState.y - deltaY,
        ratio: newRatio,
      },
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

  handleDown(e: MouseEvent) {
    if (!this.enabled) return;

    this.startCameraState = this.camera.getState();
    this.lastCameraState = this.startCameraState;

    this.lastMouseX = getX(e);
    this.lastMouseY = getY(e);

    this.hasDragged = false;

    this.downStartTime = Date.now();

    // TODO: dispatch events
    switch (e.which) {
      default:
        // Left button pressed
        this.isMouseDown = true;
        this.emit("mousedown", getMouseCoords(e));
    }
  }

  handleUp(e: MouseEvent) {
    if (!this.enabled || !this.isMouseDown) return;

    this.isMouseDown = false;

    if (this.movingTimeout) {
      this.movingTimeout = null;
      clearTimeout(this.movingTimeout);
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
    setImmediate(() => (this.hasDragged = false));
    this.emit("mouseup", getMouseCoords(e));
  }

  handleMove(e: MouseEvent) {
    if (!this.enabled) return;

    this.emit("mousemove", getMouseCoords(e));

    if (this.isMouseDown) {
      // TODO: dispatch events
      this.isMoving = true;
      this.hasDragged = true;

      if (this.movingTimeout) clearTimeout(this.movingTimeout);

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

      const lastMouse = this.camera.viewportToGraph(dimensions, this.lastMouseX, this.lastMouseY);

      const mouse = this.camera.viewportToGraph(dimensions, eX, eY);

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

  handleWheel(e: WheelEvent) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    e.stopPropagation();

    if (!this.enabled) return false;

    const delta = getWheelDelta(e);

    if (!delta) return false;

    if (this.wheelLock) return false;

    this.wheelLock = true;

    // TODO: handle max zoom
    const ratio = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;

    const cameraState = this.camera.getState();

    const newRatio = ratio * cameraState.ratio;

    const center = getCenter(e);

    const dimensions = {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    };

    const clickX = getX(e),
      clickY = getY(e);

    // TODO: baaaad we mustn't mutate the camera, create a Camera.from or #.copy
    // TODO: factorize pan & zoomTo
    const cameraWithNewRatio = new Camera();
    cameraWithNewRatio.ratio = newRatio;
    cameraWithNewRatio.x = cameraState.x;
    cameraWithNewRatio.y = cameraState.y;

    const clickGraph = this.camera.viewportToGraph(dimensions, clickX, clickY),
      centerGraph = this.camera.viewportToGraph(dimensions, center.x, center.y);

    const clickGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, clickX, clickY),
      centerGraphNew = cameraWithNewRatio.viewportToGraph(dimensions, center.x, center.y);

    const deltaX = clickGraphNew.x - centerGraphNew.x - clickGraph.x + centerGraph.x,
      deltaY = clickGraphNew.y - centerGraphNew.y - clickGraph.y + centerGraph.y;

    this.camera.animate(
      {
        x: cameraState.x - deltaX,
        y: cameraState.y - deltaY,
        ratio: newRatio,
      },
      {
        easing: "linear",
        duration: MOUSE_ZOOM_DURATION,
      },
      () => (this.wheelLock = false),
    );

    return false;
  }

  handleOut() {
    // TODO: dispatch event
  }
}
