import getPixelRatio from "./getPixelRatio";
import getWidth from "./getWidth";
import getHeight from "./getHeight";

/**
 * Extract the center from a mouse or touch event.
 *
 * @param  {event}  e A mouse or touch event.
 * @return {object}   The center of the event's target.
 */
export default function getCenter(e) {
  const ratio =
    e.target.namespaceURI.indexOf("svg") !== -1 ? 1 : getPixelRatio();
  return {
    x: getWidth(e) / (2 * ratio),
    y: getHeight(e) / (2 * ratio)
  };
}
