/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 */

/**
 * Constants.
 */

// Dimensions of a normal cell
const DEFAULT_CELL = {
  width: 200,
  height: 150
};

// Dimensions of an unzoomed cell. This one is usually smaller than the normal
// one to account for the fact that labels will more likely collide.
const DEFAULT_UNZOOMED_CELL = {
  width: 400,
  height: 300
};

/**
 * Label grid heuristic selecting labels to display according to the following
 * parameters:
 *   1) Only one label per grid cell.
 *   2) Greater labels win.
 *   3) Already displayed label should stay displayed.
 *
 * Note: It is possible to apply a size threshold to the labels (but should
 * really be done at quad level for performance).
 *
 * Note: It might be possible to not use last displayed labels by measurements
 * and a margin.
 *
 * Note: should clear invisible labels on pan to avoid potential memory leaks.
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Set}      previousVisibleNodes - Nodes visible last render.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @return {Array}                         - The selected labels.
 */
exports.labelsToDisplayFromGrid = function(params) {
  const {
    cache,
    camera,
    displayedLabels,
    previousVisibleNodes,
    visibleNodes
  } = params;

  const cameraState = camera.getState(),
        previousCameraState = camera.getPreviousState(),
        dimensions = camera.getDimensions();

  // State
  // TODO: the panning is false because of not working y condition, though
  // if I fix it, the whole heuristic fails. I am saddness... :(
  const zooming = cameraState.ratio < previousCameraState.ratio,
        panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.x,
        unzooming = cameraState.ratio > previousCameraState.ratio,
        unzoomedPanning = !zooming && !unzooming && cameraState.ratio >= 1;

  // Trick to discretize unzooming
  if (unzooming && Math.trunc(cameraState.ratio * 10) % 3 !== 0)
    return Array.from(displayedLabels);

  // If panning while unzoomed, we shouldn't change label selection
  if (unzoomedPanning && displayedLabels.size !== 0)
    return Array.from(displayedLabels);

  // Selecting cell
  const baseCell = cameraState.ratio >= 1.3 ? DEFAULT_UNZOOMED_CELL : DEFAULT_CELL;

  // Adapting cell dimensions
  let cellWidthRemainder = dimensions.width % baseCell.width;
  let cellWidth = (
    baseCell.width +
    (cellWidthRemainder / Math.floor(dimensions.width / baseCell.width))
  );

  let cellHeightRemainder = dimensions.height % baseCell.height;
  let cellHeight = (
    baseCell.height +
    (cellHeightRemainder / Math.floor(dimensions.height / baseCell.height))
  );

  // Building the grid
  const grid = {};

  const worthyBuckets = new Set();
  const worthyLabels = (zooming || (panning && !unzooming)) ?
    Array.from(displayedLabels) :
    [];

  // Selecting worthy labels
  for (let i = 0, l = visibleNodes.length; i < l; i++) {
    const node = visibleNodes[i],
          nodeData = cache[node];

    // When panning, we should not consider nodes that were previously shown
    if (panning && !zooming && !unzooming) {
      if (!displayedLabels.has(node) && previousVisibleNodes.has(node))
        continue;
    }

    // Finding our node's cell in the grid
    const pos = camera.graphToDisplay(nodeData.x, nodeData.y);

    const xKey = Math.floor(pos.x / cellWidth),
          yKey = Math.floor(pos.y / cellHeight);

    // TODO: check keys validity
    const key = `${xKey};${yKey}`;

    if (worthyBuckets.has(key))
      continue;

    // When zooming or panning, we aim at keeping the already displayed labels
    if ((zooming || (panning && !unzooming)) && displayedLabels.has(node)) {
      worthyBuckets.add(key);
      continue;
    }

    // Label resolution
    if (typeof grid[key] === 'undefined') {

      // The cell is empty
      grid[key] = node;
    }
    else {

      // We must solve a conflict in this cell
      const currentNode = grid[key],
            currentNodeData = cache[currentNode];

      // In case of size equality, we use the node's key so that the
      // process remains deterministic
      if (
        nodeData.size > currentNodeData.size ||
        (
          nodeData.size === currentNodeData.size &&
          node > currentNode
        )
      ) {
        grid[key] = node;
      }
    }
  }

  // Compiling the labels
  for (const key in grid)
    worthyLabels.push(grid[key]);

  return worthyLabels;
};
