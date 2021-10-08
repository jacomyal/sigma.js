/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to label display.
 * @module
 */
import Graph from "graphology";
import { EdgeKey, NodeKey } from "graphology-types";

import { Dimensions, Coordinates } from "../types";

// TODO: full jsdocs

/**
 * Helpers.
 */
export function axisAlignedRectangularCollision(
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

/**
 * Classes.
 */

/**
 * Class representing a single candidate for the label grid selection.
 *
 * It also describes a deterministic way to compare two candidates to assess
 * which one is better.
 */
class LabelCandidate {
  key: NodeKey;
  size: number;

  constructor(key: NodeKey, size: number) {
    this.key = key;
    this.size = size;
  }

  static compare(first: LabelCandidate, second: LabelCandidate): number {
    // First we compare by size
    if (first.size > second.size) return -1;
    if (first.size < second.size) return 1;

    // Then since no two nodes can have the same key, we use it to
    // deterministically tie-break by key
    if (first.key > second.key) return 1;

    // NOTE: this comparator cannot return 0
    return -1;
  }
}

/**
 * Class representing a 2D spatial grid divided into constant-size cells.
 */
export class LabelGrid {
  width = 0;
  height = 0;
  cellSize = 0;
  columns = 0;
  rows = 0;
  cells: Record<number, Array<LabelCandidate>> = {};

  resizeAndClear(dimensions: Dimensions, cellSize: number): void {
    this.width = dimensions.width;
    this.height = dimensions.height;

    this.cellSize = cellSize;

    this.columns = Math.ceil(dimensions.width / cellSize);
    this.rows = Math.ceil(dimensions.height / cellSize);

    this.cells = {};
  }

  private getIndex(pos: Coordinates): number {
    const xIndex = Math.floor(pos.x / this.cellSize);
    const yIndex = Math.floor(pos.y / this.cellSize);

    return xIndex * this.columns + yIndex;
  }

  add(key: NodeKey, size: number, pos: Coordinates): void {
    const candidate = new LabelCandidate(key, size);

    const index = this.getIndex(pos);
    let cell = this.cells[index];

    if (!cell) {
      cell = [];
      this.cells[index] = cell;
    }

    cell.push(candidate);
  }

  organize(): void {
    for (const k in this.cells) {
      const cell = this.cells[k];
      cell.sort(LabelCandidate.compare);
    }
  }

  getLabelsToDisplay(ratio: number, density: number): Array<NodeKey> {
    // TODO: work on visible nodes to optimize? ^ -> threshold outside so that memoization works?
    // TODO: adjust threshold lower, but increase cells a bit?
    // TODO: hunt for geom issue in disguise
    // TODO: memoize while ratio does not move. method to force recompute
    const cellArea = this.cellSize * this.cellSize;
    const scaledCellArea = cellArea / ratio / ratio;
    const scaledDensity = (scaledCellArea * density) / cellArea;

    const labelsToDisplayPerCell = Math.ceil(scaledDensity);

    const labels = [];

    for (const k in this.cells) {
      const cell = this.cells[k];

      for (let i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
        labels.push(cell[i].key);
      }
    }

    return labels;
  }
}

/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
export function edgeLabelsToDisplayFromNodes(params: {
  displayedNodeLabels: Set<NodeKey>;
  highlightedNodes: Set<NodeKey>;
  graph: Graph;
  hoveredNode: NodeKey | null;
}): Array<EdgeKey> {
  const { graph, hoveredNode, highlightedNodes, displayedNodeLabels } = params;

  const worthyEdges: Array<EdgeKey> = [];

  // TODO: the code below can be optimized using #.forEach and batching the code per adj

  // We should display an edge's label if:
  //   - Any of its extremities is highlighted or hovered
  //   - Both of its extremities has its label shown
  graph.forEachEdge((edge, _, source, target) => {
    if (
      source === hoveredNode ||
      target === hoveredNode ||
      highlightedNodes.has(source) ||
      highlightedNodes.has(target) ||
      (displayedNodeLabels.has(source) && displayedNodeLabels.has(target))
    ) {
      worthyEdges.push(edge);
    }
  });

  return worthyEdges;
}
