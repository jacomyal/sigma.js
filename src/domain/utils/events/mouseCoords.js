import getX from "./getX";
import getY from "./getY";
import getCenter from "./getCenter";

/**
 * Convert mouse coords to sigma coords
 *
 * @param  {event}   e A mouse or touch event.
 * @param  {number?} x The x coord to convert
 * @param  {number?} x The y coord to convert
 *
 * @return {object}    The standardized event
 */
export default function mouseCoords(e, x, y) {
  x = x || getX(e);
  y = y || getY(e);
  return {
    x: x - getCenter(e).x,
    y: y - getCenter(e).y,
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey
  };
}
