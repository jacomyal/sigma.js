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

/**
 * Default rescale options.
 */
const DEFAULT_NODE_RESCALE_OPTIONS = {
  mode: 'inside',
  margin: 0,
  minSize: 1,
  maxSize: 8
};

const DEFAULT_EDGE_RESCALE_OPTIONS = {
  minSize: 0.5,
  maxSize: 1
};

// TODO: should we let the user handle size through, for instance, d3 scales?

/**
 * Factory returning a function rescaling the given node's position and/or size.
 *
 * @param  {object}   options - Options.
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
export function createNodeRescalingFunction(options, extent) {
  options = options || {};

  const mode = options.mode || DEFAULT_NODE_RESCALE_OPTIONS.mode,
        height = options.height || 1,
        width = options.width || 1;

  const {
    maxX,
    maxY,
    minX,
    minY
  } = extent;

  const hx = (maxX + minX) / 2,
        hy = (maxY + minY) / 2;

  const scale = mode === 'outside' ?
    Math.max(
      width / Math.max(maxX - minX, 1),
      height / Math.max(maxY - minY, 1)
    ) :
    Math.min(
      width / Math.max(maxX - minX, 1),
      height / Math.max(maxY - minY, 1)
    );

  return data => {
    return {
      x: (data.x - hx) * scale,
      y: (data.y - hy) * scale
    };
  };
}
