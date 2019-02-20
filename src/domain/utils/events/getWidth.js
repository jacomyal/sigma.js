/**
 * Extract the width from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {number}   The width of the event's target.
 */
export default function getWidth(e) {
  const w = !e.target.ownerSVGElement
    ? e.target.width
    : e.target.ownerSVGElement.width;

  return (
    (typeof w === "number" && w) ||
    (w !== undefined && w.baseVal !== undefined && w.baseVal.value)
  );
}
