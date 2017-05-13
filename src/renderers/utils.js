/**
 * Sigma.js Rendering Utils
 * ===========================
 *
 * Helpers used by most renderers.
 */

/**
 * Function used to create DOM elements easily.
 */
export function createDOMElement(tag, attributes) {
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
