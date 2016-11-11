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
    x: graph.getNodeAttribute(node, 'x') || 1,
    y: graph.getNodeAttribute(node, 'y') || 1,
    size: graph.getNodeAttribute(node, 'size') || 1,
    color: graph.getNodeAttribute(node, 'color') || 'black'
  };
}
