/**
 * Sigma.js Rendering Utils
 * ===========================
 *
 * Helpers used by most renderers.
 */

/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
export function createElement(tag, attributes) {
  const element = document.createElement(tag);

  if (!attributes)
    return element;

  for (const k in attributes) {
    if (k === 'style') {
      for (const s in attributes[k])
        element.style[s] = attributes[k][s];
    }
    else {
      element.setAttribute(k, attributes[k]);
    }
  }

  return element;
}

/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
export function getPixelRatio() {
  const screen = window.screen;

  if (typeof screen.deviceXDPI !== 'undefined' &&
      typeof screen.logicalXDPI !== 'undefined' &&
      screen.deviceXDPI > screen.logicalXDPI)
    return screen.systemXDPI / screen.logicalXDPI;

  else if (typeof window.devicePixelRatio !== 'undefined')
    return window.devicePixelRatio;

  return 1;
}
