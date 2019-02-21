/**
 * Returns the offset of a DOM element.
 *
 * @param  {DOMElement} dom The element to retrieve the position.
 * @return {object}         The offset of the DOM element (top, left).
 */
export default function getOffset(dom) {
  let left = 0;
  let top = 0;

  while (dom) {
    top += parseInt(dom.offsetTop, 10);
    left += parseInt(dom.offsetLeft, 10);
    dom = dom.offsetParent;
  }

  return {
    top,
    left
  };
}
