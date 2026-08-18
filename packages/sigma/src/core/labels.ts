/**
 * Sigma.js Labels Heuristics
 * ===========================
 *
 * Miscellaneous heuristics related to label display.
 * @module
 */
import Graph from "graphology-types";

import { Coordinates, Dimensions } from "../types";

/**
 * Class representing a single candidate for the label grid selection.
 *
 * It also describes a deterministic way to compare two candidates to assess
 * which one is better.
 */
class LabelCandidate {
  key: string;
  size: number;

  constructor(key: string, size: number) {
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

    return yIndex * this.columns + xIndex;
  }

  add(key: string, size: number, pos: Coordinates): void {
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

  /**
   * Get labels to display based on density and optional viewport culling.
   *
   * @param ratio - Camera zoom ratio
   * @param density - Label density setting
   * @param viewport - Optional viewport bounds in grid coordinates (null camera space).
   *                   If provided, only cells intersecting this viewport are queried.
   */
  getLabelsToDisplay(
    ratio: number,
    density: number,
    viewport?: { x1: number; y1: number; x2: number; y2: number },
  ): Array<string> {
    const cellArea = this.cellSize * this.cellSize;
    const scaledCellArea = cellArea / ratio / ratio;
    const scaledDensity = (scaledCellArea * density) / cellArea;

    const labelsToDisplayPerCell = Math.ceil(scaledDensity);

    const labels: string[] = [];

    if (viewport) {
      // Viewport-aware query: only iterate cells within the viewport
      const minCol = Math.max(0, Math.floor(viewport.x1 / this.cellSize));
      const maxCol = Math.min(this.columns - 1, Math.floor(viewport.x2 / this.cellSize));
      const minRow = Math.max(0, Math.floor(viewport.y1 / this.cellSize));
      const maxRow = Math.min(this.rows - 1, Math.floor(viewport.y2 / this.cellSize));

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const index = row * this.columns + col;
          const cell = this.cells[index];

          if (!cell) continue;

          for (let i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
            labels.push(cell[i].key);
          }
        }
      }
    } else {
      // Original behavior: iterate all cells
      for (const k in this.cells) {
        const cell = this.cells[k];

        for (let i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
          labels.push(cell[i].key);
        }
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
  displayedNodeLabels: Set<string>;
  highlightedNodes: Set<string>;
  graph: Graph;
  hoveredNode: string | null;
}): Array<string> {
  const { graph, hoveredNode, highlightedNodes, displayedNodeLabels } = params;

  // An edge label shows when an extremity is highlighted or hovered, or when
  // both extremities show theirs. Scanning adjacencies instead of all edges
  // keeps the cost tied to what is displayed, not to the graph size.
  const relevantEdges = new Set<string>();

  const fullyWorthyNodes = new Set(highlightedNodes);
  if (hoveredNode) fullyWorthyNodes.add(hoveredNode);

  for (const node of fullyWorthyNodes) {
    // States can outlive nodes (or target unknown keys), so check first
    if (!graph.hasNode(node)) continue;
    graph.forEachEdge(node, (edge) => {
      relevantEdges.add(edge);
    });
  }

  for (const node of displayedNodeLabels) {
    if (fullyWorthyNodes.has(node)) continue;
    graph.forEachEdge(node, (edge, _, source, target) => {
      const other = source === node ? target : source;
      if (displayedNodeLabels.has(other)) relevantEdges.add(edge);
    });
  }

  return Array.from(relevantEdges);
}
