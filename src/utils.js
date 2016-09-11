/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
export function assign(target, ...objects) {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    if (!objects[i])
      continue;

    for (const k in objects[i])
      target[k] = objects[i][k];
  }

  return target;
}

/**
 * Function returning whether the given value is a graphology Graph instance.
 *
 * @param  {any} value - Target value.
 * @return {boolean}
 */
export function isGraph(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNodes === 'function'
  );
}
