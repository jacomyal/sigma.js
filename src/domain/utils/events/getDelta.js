/**
 * Extract the wheel delta from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {number}   The wheel delta of the mouse.
 */
export default function getDelta(e) {
  return (
    (e.wheelDelta !== undefined && e.wheelDelta) ||
    (e.detail !== undefined && -e.detail)
  );
}
