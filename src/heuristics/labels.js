/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 */
import Camera from '../camera';

/**
 * Constants.
 */

// Dimensions of a normal cell
const DEFAULT_CELL = {
  width: 250,
  height: 175
};

// Dimensions of an unzoomed cell. This one is usually larger than the normal
// one to account for the fact that labels will more likely collide.
const DEFAULT_UNZOOMED_CELL = {
  width: 400,
  height: 300
};

// TODO: basic sweeping anti-collision at the end
// TODO: minSize to be displayed

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
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @param  {Graph}    graph                - The rendered graph.
 * @return {Array}                         - The selected labels.
 */
exports.labelsToDisplayFromGrid = function(params) {
  const {
    cache,
    camera,
    displayedLabels,
    visibleNodes,
    dimensions,
    graph
  } = params;

  const cameraState = camera.getState(),
        previousCameraState = camera.getPreviousState();

  const previousCamera = new Camera();
  previousCamera.setState(previousCameraState);

  // Camera hasn't moved?
  const still = (
    (cameraState.x === previousCameraState.x) &&
    (cameraState.y === previousCameraState.y) &&
    (cameraState.ratio === previousCameraState.ratio)
  );

  // State
  const zooming = cameraState.ratio < previousCameraState.ratio,
        panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.y,
        unzooming = cameraState.ratio > previousCameraState.ratio,
        unzoomedPanning = !zooming && !unzooming && cameraState.ratio >= 1,
        zoomedPanning = panning && displayedLabels.size && !zooming && !unzooming;

  // Trick to discretize unzooming
  if (unzooming && Math.trunc(cameraState.ratio * 100) % 5 !== 0)
    return Array.from(displayedLabels);

  // If panning while unzoomed, we shouldn't change label selection
  if ((unzoomedPanning || still) && displayedLabels.size !== 0)
    return Array.from(displayedLabels);

  // When unzoomed & zooming
  if (zooming && cameraState.ratio >= 1)
    return Array.from(displayedLabels);

  // Adapting cell dimensions
  const cell = cameraState.ratio >= 1.3 ? DEFAULT_UNZOOMED_CELL : DEFAULT_CELL;

  const cwr = dimensions.width % cell.width;
  const cellWidth = cell.width + cwr / Math.floor(dimensions.width / cell.width);

  const chr = dimensions.height % cell.height;
  const cellHeight = cell.height + chr / Math.floor(dimensions.height / cell.height);

  const adjustedWidth = dimensions.width + cellWidth,
        adjustedHeight = dimensions.height + cellHeight,
        adjustedX = -cellWidth,
        adjustedY = -cellHeight;

  // console.log(cellWidth, cellHeight, dimensions.width / cellWidth, dimensions.height / cellHeight);

  const worthyLabels = [];
  const grid = {};

  let maxSize = -Infinity,
      biggestNode = null;

  for (let i = 0, l = visibleNodes.length; i < l; i++) {
    const node = visibleNodes[i],
          nodeData = cache[node];

    // Finding our node's cell in the grid
    const pos = camera.graphToViewport(dimensions, nodeData.x, nodeData.y);

    // Node is not actually visible on screen
    // NOTE: can optimize margin on the right side (only if we know where the labels go)
    if (
      (pos.x < adjustedX || pos.x > adjustedWidth) ||
      (pos.y < adjustedY || pos.y > adjustedHeight)
    )
      continue;

    // Keeping track of the maximum node size for certain cases
    if (nodeData.size > maxSize) {
      maxSize = nodeData.size;
      biggestNode = node;
    }

    // If panning when zoomed, we consider only displayed labels and newly
    // visible nodes
    if (zoomedPanning) {
      const ppos = previousCamera.graphToViewport(dimensions, nodeData.x, nodeData.y);

      // Was node visible earlier?
      if (
        (ppos.x >= adjustedX && ppos.x <= adjustedWidth) &&
        (ppos.y >= adjustedY && ppos.y <= adjustedHeight)
      ) {

        // Was the label displayed?
        if (!displayedLabels.has(node))
          continue;
      }
    }

    const xKey = Math.floor(pos.x / cellWidth),
          yKey = Math.floor(pos.y / cellHeight);

    const key = `${xKey}§${yKey}`;

    if (typeof grid[key] === 'undefined') {

      // This cell is not yet occupied
      grid[key] = node;
    }
    else {

      // We must solve a conflict in this cell
      const currentNode = grid[key],
            currentNodeData = cache[currentNode];

      // We prefer already displayed labels
      if (displayedLabels.size > 0) {
        const n1 = displayedLabels.has(node),
              n2 = displayedLabels.has(currentNode);

        if (!n1 && n2) {
          continue;
        }

        if (n1 && !n2) {
          grid[key] = node;
          continue;
        }

        if ((zoomedPanning || zooming) && n1 && n2) {
          worthyLabels.push(node);
          continue;
        }
      }

      // In case of size & degree equality, we use the node's key so that the
      // process remains deterministic
      let won = false;

      if (nodeData.size > currentNodeData.size) {
        won = true;
      }
      else if (nodeData.size === currentNodeData.size) {

        const nodeDegree = graph.degree(node),
              currentNodeDegree = graph.degree(currentNode);

        if (nodeDegree > currentNodeDegree) {
          won = true;
        }
        else if (nodeDegree === currentNodeDegree) {


          if (node > currentNode)
            won = true;
        }
      }

      if (won)
        grid[key] = node;
    }
  }

  // Compiling the labels
  let biggestNodeShown = false;

  for (const key in grid) {

    if (key === biggestNode)
      biggestNodeShown = true;

    worthyLabels.push(grid[key]);
  }

  // Always keeping biggest node shown on screen
  if (!biggestNodeShown && biggestNode)
    worthyLabels.push(biggestNode);

  return worthyLabels;
};
