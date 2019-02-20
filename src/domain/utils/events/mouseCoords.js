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
  x = x || sigma.utils.getX(e);
  y = y || sigma.utils.getY(e);
  return {
    x: x - sigma.utils.getCenter(e).x,
    y: y - sigma.utils.getCenter(e).y,
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey
  };
}
