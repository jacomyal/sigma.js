/**
 * Sigma.js Reducers
 * ==================
 *
 * Internal reducers mostly used to map well-known attributes by default &
 * apply some settings before giving the resulting data to renderers.
 */

/**
 * Internal node reducer.
 *
 * @param {Sigma} controller - Sigma instance.
 * @param {Graph} graph      - The bound graph.
 * @param {any}   node       - The node to reduce.
 */
export function internalNodeReducer(controller, graph, node) {
  return {
    x: 50,
    y: 50,
    size: 15,
    color: 'red'
  };
}
