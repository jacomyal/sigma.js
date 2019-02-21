import Dispatcher from "./Dispatcher";
import doubleClick from "../utils/events/doubleClick";
import unbindDoubleClick from "../utils/events/unbindDoubleClick";
import mouseCoords from "../utils/events/mouseCoords";
import getX from "../utils/events/getX";
import getY from "../utils/events/getY";
import getCenter from "../utils/events/getCenter";
import getDelta from "../utils/events/getDelta";
import zoomTo from "../utils/misc/zoomTo";

export default function mouseCaptor(sigma) {
  /**
   * The user inputs default captor. It deals with mouse events, keyboards
   * events and touch events.
   *
   * @param  {DOMElement}   target   The DOM element where the listeners will be
   *                                 bound.
   * @param  {camera}       camera   The camera related to the target.
   * @param  {configurable} settings The settings function.
   * @return {captor}          The fresh new captor instance.
   */
  return function MouseCaptor(target, camera, settings) {
    const _self = this;
    Dispatcher.extend(this);

    const _target = target;
    const _camera = camera;
    const _settings = settings;

    // CAMERA MANAGEMENT:
    // ******************
    // The camera position when the user starts dragging:
    let _startCameraX;
    let _startCameraY;

    // The latest stage position:
    let _lastCameraX;
    let _lastCameraY;

    // MOUSE MANAGEMENT:
    // *****************
    // The mouse position when the user starts dragging:
    let _startMouseX;
    let _startMouseY;
    let _isMouseDown;
    let _isMoving;
    let _hasDragged;
    let _downStartTime;
    let _movingTimeoutId;

    // MOUSE EVENTS:
    // *************

    /**
     * The handler listening to the 'move' mouse event. It will effectively
     * drag the graph.
     *
     * @param {event} e A mouse event.
     */
    function moveHandler(e) {
      let x;
      let y;
      let pos;

      // Dispatch event:
      if (_settings("mouseEnabled")) {
        _self.dispatchEvent("mousemove", mouseCoords(e));

        if (_isMouseDown) {
          _isMoving = true;
          _hasDragged = true;

          if (_movingTimeoutId) clearTimeout(_movingTimeoutId);

          _movingTimeoutId = setTimeout(function stopMoving() {
            _isMoving = false;
          }, _settings("dragTimeout"));

          sigma.misc.animation.killAll(_camera);

          _camera.isMoving = true;
          pos = _camera.cameraPosition(
            getX(e) - _startMouseX,
            getY(e) - _startMouseY,
            true
          );

          x = _startCameraX - pos.x;
          y = _startCameraY - pos.y;

          if (x !== _camera.x || y !== _camera.y) {
            _lastCameraX = _camera.x;
            _lastCameraY = _camera.y;

            _camera.goTo({
              x,
              y
            });
          }

          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;

          e.stopPropagation();
          return false;
        }
      }
      return undefined;
    }

    /**
     * The handler listening to the 'up' mouse event. It will stop dragging the
     * graph.
     *
     * @param {event} e A mouse event.
     */
    function upHandler(e) {
      if (_settings("mouseEnabled") && _isMouseDown) {
        _isMouseDown = false;
        if (_movingTimeoutId) clearTimeout(_movingTimeoutId);

        _camera.isMoving = false;

        const x = getX(e);
        const y = getY(e);

        if (_isMoving) {
          sigma.misc.animation.killAll(_camera);
          sigma.misc.animation.camera(
            _camera,
            {
              x:
                _camera.x +
                _settings("mouseInertiaRatio") * (_camera.x - _lastCameraX),
              y:
                _camera.y +
                _settings("mouseInertiaRatio") * (_camera.y - _lastCameraY)
            },
            {
              easing: "quadraticOut",
              duration: _settings("mouseInertiaDuration")
            }
          );
        } else if (_startMouseX !== x || _startMouseY !== y)
          _camera.goTo({
            x: _camera.x,
            y: _camera.y
          });

        _self.dispatchEvent("mouseup", mouseCoords(e));

        // Update _isMoving flag:
        _isMoving = false;
      }
    }

    /**
     * The handler listening to the 'down' mouse event. It will start observing
     * the mouse position for dragging the graph.
     *
     * @param {event} e A mouse event.
     */
    function downHandler(e) {
      if (_settings("mouseEnabled")) {
        _startCameraX = _camera.x;
        _startCameraY = _camera.y;

        _lastCameraX = _camera.x;
        _lastCameraY = _camera.y;

        _startMouseX = getX(e);
        _startMouseY = getY(e);

        _hasDragged = false;
        _downStartTime = new Date().getTime();

        switch (e.which) {
          case 2:
            // Middle mouse button pressed
            // Do nothing.
            break;
          case 3:
            // Right mouse button pressed
            _self.dispatchEvent(
              "rightclick",
              mouseCoords(e, _startMouseX, _startMouseY)
            );
            break;
          // case 1:
          default:
            // Left mouse button pressed
            _isMouseDown = true;

            _self.dispatchEvent(
              "mousedown",
              mouseCoords(e, _startMouseX, _startMouseY)
            );
        }
      }
    }

    /**
     * The handler listening to the 'out' mouse event. It will just redispatch
     * the event.
     *
     * @param {event} e A mouse event.
     */
    function outHandler() {
      if (_settings("mouseEnabled")) _self.dispatchEvent("mouseout");
    }

    /**
     * The handler listening to the 'click' mouse event. It will redispatch the
     * click event, but with normalized X and Y coordinates.
     *
     * @param {event} e A mouse event.
     */
    function clickHandler(e) {
      if (_settings("mouseEnabled")) {
        const event = mouseCoords(e);
        event.isDragging =
          new Date().getTime() - _downStartTime > 100 && _hasDragged;
        _self.dispatchEvent("click", event);
      }

      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;

      e.stopPropagation();
      return false;
    }

    /**
     * The handler listening to the double click custom event. It will
     * basically zoom into the graph.
     *
     * @param {event} e A mouse event.
     */
    function doubleClickHandler(e) {
      let pos;
      let ratio;
      let animation;

      if (_settings("mouseEnabled")) {
        ratio = 1 / _settings("doubleClickZoomingRatio");

        _self.dispatchEvent(
          "doubleclick",
          mouseCoords(e, _startMouseX, _startMouseY)
        );

        if (_settings("doubleClickEnabled")) {
          pos = _camera.cameraPosition(
            getX(e) - getCenter(e).x,
            getY(e) - getCenter(e).y,
            true
          );

          animation = {
            duration: _settings("doubleClickZoomDuration")
          };

          zoomTo(_camera, pos.x, pos.y, ratio, animation);
        }

        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        e.stopPropagation();
        return false;
      }
      return undefined;
    }

    /**
     * The handler listening to the 'wheel' mouse event. It will basically zoom
     * in or not into the graph.
     *
     * @param {event} e A mouse event.
     */
    function wheelHandler(e) {
      let pos;
      let ratio;
      let animation;
      const wheelDelta = getDelta(e);

      if (
        _settings("mouseEnabled") &&
        _settings("mouseWheelEnabled") &&
        wheelDelta !== 0
      ) {
        ratio =
          wheelDelta > 0
            ? 1 / _settings("zoomingRatio")
            : _settings("zoomingRatio");

        pos = _camera.cameraPosition(
          getX(e) - getCenter(e).x,
          getY(e) - getCenter(e).y,
          true
        );

        animation = {
          duration: _settings("mouseZoomDuration")
        };

        zoomTo(_camera, pos.x, pos.y, ratio, animation);

        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }

        e.stopPropagation();
        return false;
      }
      return undefined;
    }

    doubleClick(_target, "click", doubleClickHandler);
    _target.addEventListener("DOMMouseScroll", wheelHandler, false);
    _target.addEventListener("mousewheel", wheelHandler, false);
    _target.addEventListener("mousemove", moveHandler, false);
    _target.addEventListener("mousedown", downHandler, false);
    _target.addEventListener("click", clickHandler, false);
    _target.addEventListener("mouseout", outHandler, false);
    document.addEventListener("mouseup", upHandler, false);

    /**
     * This method unbinds every handlers that makes the captor work.
     */
    this.kill = function kill() {
      unbindDoubleClick(_target, "click");
      _target.removeEventListener("DOMMouseScroll", wheelHandler);
      _target.removeEventListener("mousewheel", wheelHandler);
      _target.removeEventListener("mousemove", moveHandler);
      _target.removeEventListener("mousedown", downHandler);
      _target.removeEventListener("click", clickHandler);
      _target.removeEventListener("mouseout", outHandler);
      document.removeEventListener("mouseup", upHandler);
    };
  };
}
