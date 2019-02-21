/**
 * SVG Element show.
 *
 * @param  {DOMElement}               element   The DOM element to show.
 */
export function show(element) {
  element.style.display = "";
  return this;
}

/**
 * SVG Element hide.
 *
 * @param  {DOMElement}               element   The DOM element to hide.
 */
export function hide(element) {
  element.style.display = "none";
  return this;
}
