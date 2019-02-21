/**
 * Extract the height from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {number}   The height of the event's target.
 */
export default function getHeight(e) {
  const h = !e.target.ownerSVGElement
    ? e.target.height
    : e.target.ownerSVGElement.height;

  return (
    (typeof h === "number" && h) ||
    (h !== undefined && h.baseVal !== undefined && h.baseVal.value)
  );
}
