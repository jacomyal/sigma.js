/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 */

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
