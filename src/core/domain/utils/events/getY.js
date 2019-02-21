/**
 * Extract the local Y position from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {number}   The local Y value of the mouse.
 */
export default function getY(e) {
  return (
    (e.offsetY !== undefined && e.offsetY) ||
    (e.layerY !== undefined && e.layerY) ||
    (e.clientY !== undefined && e.clientY)
  );
}
