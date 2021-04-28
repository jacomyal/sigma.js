/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 * @module
 */
import Graph from "graphology";
import { EdgeKey, NodeKey } from "graphology-types";
import { Dimensions, EdgeAttributes, NodeAttributes } from "../types";
import Camera from "./camera";

/**
 * Constants.
 */

// Dimensions of a normal cell
const DEFAULT_CELL = {
  width: 250,
  height: 175,
};

// Dimensions of an unzoomed cell. This one is usually larger than the normal
// one to account for the fact that labels will more likely collide.
const DEFAULT_UNZOOMED_CELL = {
  width: 400,
  height: 300,
};

/**
 * Helpers.
 */
function collision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number,
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// TODO: cache camera position of selected nodes to avoid costly computations
// in anti-collision step
// TOOD: document a little bit more so future people can understand this mess

/**
 * Label grid heuristic selecting labels to display.
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @param  {Graph}    graph                - The rendered graph.
 * @return {Array}                         - The selected labels.
 */
export function labelsToDisplayFromGrid(params: {
  cache: { [key: string]: NodeAttributes };
  camera: Camera;
  cell: { width: number; height: number } | null;
  dimensions: Dimensions;
  displayedLabels: Set<NodeKey>;
  fontSize: number;
  graph: Graph;
  renderedSizeThreshold: number;
  visibleNodes: NodeKey[];
}): NodeKey[] {
  const {
    cache,
    camera,
    cell: userCell,
    dimensions,
    displayedLabels,
    fontSize = 14,
    graph,
    renderedSizeThreshold = -Infinity,
    visibleNodes,
  } = params;

  const cameraState = camera.getState(),
    previousCameraState = camera.getPreviousState();

  const previousCamera = new Camera();
  previousCamera.setState(previousCameraState);

  // TODO: should factorize. This same code is used quite a lot throughout the codebase
  // TODO: POW RATIO is currently default 0.5 and harcoded
  const sizeRatio = Math.pow(cameraState.ratio, 0.5);

  // State
  const zooming = cameraState.ratio < previousCameraState.ratio,
    panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.y,
    unzooming = cameraState.ratio > previousCameraState.ratio,
    unzoomedPanning = panning && !zooming && !unzooming && cameraState.ratio >= 1,
    zoomedPanning = panning && displayedLabels.size && !zooming && !unzooming;

  // Trick to discretize unzooming
  if (unzooming && Math.trunc(cameraState.ratio * 100) % 5 !== 0) return Array.from(displayedLabels);

  // If panning while unzoomed, we shouldn't change label selection
  if (unzoomedPanning && displayedLabels.size !== 0) return Array.from(displayedLabels);

  // When unzoomed & zooming
  if (zooming && cameraState.ratio >= 1) return Array.from(displayedLabels);

  // Adapting cell dimensions
  let cell = userCell ? userCell : DEFAULT_CELL;

  if (cameraState.ratio >= 1.3) cell = DEFAULT_UNZOOMED_CELL;

  const cwr = dimensions.width % cell.width;
  const cellWidth = cell.width + cwr / Math.floor(dimensions.width / cell.width);

  const chr = dimensions.height % cell.height;
  const cellHeight = cell.height + chr / Math.floor(dimensions.height / cell.height);

  const adjustedWidth = dimensions.width + cellWidth,
    adjustedHeight = dimensions.height + cellHeight,
    adjustedX = -cellWidth,
    adjustedY = -cellHeight;

  const panningWidth = dimensions.width + cellWidth / 2,
    panningHeight = dimensions.height + cellHeight / 2,
    panningX = -(cellWidth / 2),
    panningY = -(cellHeight / 2);

  const worthyLabels: Array<NodeKey> = [];
  const grid: Record<string, NodeKey> = {};

  let maxSize = -Infinity,
    biggestNode: NodeKey | null = null;

  for (let i = 0, l = visibleNodes.length; i < l; i++) {
    const node = visibleNodes[i],
      nodeData = cache[node];

    // We filter hidden nodes
    if (nodeData.hidden) continue;

    // We filter nodes having a rendered size less than a certain thresold
    if (nodeData.size / sizeRatio < renderedSizeThreshold) continue;

    // Finding our node's cell in the grid
    const pos = camera.framedGraphToViewport(dimensions, nodeData);

    // Node is not actually visible on screen
    // NOTE: can optimize margin on the right side (only if we know where the labels go)
    if (pos.x < adjustedX || pos.x > adjustedWidth || pos.y < adjustedY || pos.y > adjustedHeight) continue;

    // Keeping track of the maximum node size for certain cases
    if (nodeData.size > maxSize) {
      maxSize = nodeData.size;
      biggestNode = node;
    }

    // If panning when zoomed, we consider only displayed labels and newly
    // visible nodes
    if (zoomedPanning) {
      const ppos = previousCamera.framedGraphToViewport(dimensions, nodeData);

      // Was node visible earlier?
      if (ppos.x >= panningX && ppos.x <= panningWidth && ppos.y >= panningY && ppos.y <= panningHeight) {
        // Was the label displayed?
        if (!displayedLabels.has(node)) continue;
      }
    }

    const xKey = Math.floor(pos.x / cellWidth),
      yKey = Math.floor(pos.y / cellHeight);

    const key = `${xKey}§${yKey}`;

    if (typeof grid[key] === "undefined") {
      // This cell is not yet occupied
      grid[key] = node;
    } else {
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
      } else if (nodeData.size === currentNodeData.size) {
        const nodeDegree = graph.degree(node),
          currentNodeDegree = graph.degree(currentNode);

        if (nodeDegree > currentNodeDegree) {
          won = true;
        } else if (nodeDegree === currentNodeDegree) {
          if (node > currentNode) won = true;
        }
      }

      if (won) grid[key] = node;
    }
  }

  // Compiling the labels
  let biggestNodeShown: boolean = worthyLabels.some((node) => node === biggestNode);

  for (const key in grid) {
    const node = grid[key];

    if (node === biggestNode) biggestNodeShown = true;

    worthyLabels.push(node);
  }

  // Always keeping biggest node shown on screen
  if (!biggestNodeShown && biggestNode) worthyLabels.push(biggestNode);

  // Basic anti-collision
  const collisions = new Set();

  for (let i = 0, l = worthyLabels.length; i < l; i++) {
    const n1 = worthyLabels[i],
      d1 = cache[n1],
      p1 = camera.framedGraphToViewport(dimensions, d1);

    if (collisions.has(n1)) continue;

    for (let j = i + 1; j < l; j++) {
      const n2 = worthyLabels[j],
        d2 = cache[n2],
        p2 = camera.framedGraphToViewport(dimensions, d2);

      const c = collision(
        // First abstract bbox
        p1.x,
        p1.y,
        d1.label.length * 8,
        fontSize,

        // Second abstract bbox
        p2.x,
        p2.y,
        d2.label.length * 8,
        fontSize,
      );

      if (c) {
        // NOTE: add degree as tie-breaker here if required in the future
        // NOTE: add final stable tie-breaker using node key if required
        if (d1.size < d2.size) collisions.add(n1);
        else collisions.add(n2);
      }
    }
  }

  // console.log(collisions)

  return worthyLabels.filter((l) => !collisions.has(l));
}

/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   nodeDataCache        - Cache storing nodes data.
 * @param  {object}   edgeDataCache        - Cache storing edges data.
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
export function edgeLabelsToDisplayFromNodes(params: {
  nodeDataCache: { [key: string]: NodeAttributes };
  edgeDataCache: { [key: string]: EdgeAttributes };
  displayedNodeLabels: Set<NodeKey>;
  highlightedNodes: Set<NodeKey>;
  graph: Graph;
  hoveredNode: NodeKey | null;
}): Array<EdgeKey> {
  const { nodeDataCache, edgeDataCache, graph, hoveredNode, highlightedNodes, displayedNodeLabels } = params;

  const worthyEdges = new Set<EdgeKey>();
  const displayedNodeLabelsArray = Array.from(displayedNodeLabels);

  // Each edge connecting a highlighted node has its label displayed if the other extremity is not hidden:
  const highlightedNodesArray = Array.from(highlightedNodes);
  if (hoveredNode && !highlightedNodes.has(hoveredNode)) highlightedNodesArray.push(hoveredNode);
  for (let i = 0; i < highlightedNodesArray.length; i++) {
    const key = highlightedNodesArray[i];
    const edges = graph.edges(key);

    for (let j = 0; j < edges.length; j++) {
      const edgeKey = edges[j];
      const extremities = graph.extremities(edgeKey),
        sourceData = nodeDataCache[extremities[0]],
        targetData = nodeDataCache[extremities[1]],
        edgeData = edgeDataCache[edgeKey];
      if (edgeData.hidden && sourceData.hidden && targetData.hidden) {
        worthyEdges.add(edgeKey);
      }
    }
  }

  // Each edge connecting two nodes with visible labels has its label displayed:
  for (let i = 0; i < displayedNodeLabelsArray.length; i++) {
    const key = displayedNodeLabelsArray[i];
    const edges = graph.outboundEdges(key);

    for (let j = 0; j < edges.length; j++)
      if (!edgeDataCache[edges[j]].hidden && displayedNodeLabels.has(graph.opposite(key, edges[j])))
        worthyEdges.add(edges[j]);
  }

  return Array.from(worthyEdges);
}
