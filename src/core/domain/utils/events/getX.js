/**
 * Extract the local X position from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {number}   The local X value of the mouse.
 */
export default function getX(e) {
  return (
    (e.offsetX !== undefined && e.offsetX) ||
    (e.layerX !== undefined && e.layerX) ||
    (e.clientX !== undefined && e.clientX)
  );
}
