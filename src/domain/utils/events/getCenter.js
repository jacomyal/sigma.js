/**
 * Extract the center from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {object}   The center of the event's target.
 */
export default function getCenter(e) {
  const ratio =
    e.target.namespaceURI.indexOf("svg") !== -1
      ? 1
      : sigma.utils.getPixelRatio();
  return {
    x: sigma.utils.getWidth(e) / (2 * ratio),
    y: sigma.utils.getHeight(e) / (2 * ratio)
  };
}
