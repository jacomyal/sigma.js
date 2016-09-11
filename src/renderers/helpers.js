/**
 * Sigma.js Rendering Helpers
 * ===========================
 *
 * Helpers used by every renderer.
 */

/**
 * Function creating to create DOM elements easily.
 */
export function createDOMElement(tag, attributes) {
  attributes = attributes || {};

  const element = document.createElement(tag);

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
