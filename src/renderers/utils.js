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
const DEFAULT_RESCALE_OPTIONS = {
  mode: 'inside',
  margin: 0
};

// TODO: should we put the rescaling in the camera itself?

/**
 * Factory returning a function rescaling the given node's position.
 *
 * @param  {object}   options - Options.
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
export function createRescalingFunction(options, extent) {
  options = options || {};

  const mode = options.mode || DEFAULT_RESCALE_OPTIONS.mode,
        height = options.height || 1,
        width = options.width || 1;

  const {
    x: [minX, maxX],
    y: [minY, maxY]
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

  const fn = data => {
    return {
      x: (data.x - hx) * scale,
      y: (data.y - hy) * scale
    };
  };

  fn.inverse = data => {
    return {
       x: data.x / scale + hx,
       y: data.y / scale + hy
    };
  };

  return fn;
}
