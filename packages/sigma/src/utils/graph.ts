import Graph, { Attributes } from "graphology-types";
import isGraph from "graphology-utils/is-graph";

import { Extent } from "../types";

/**
 * Function returning the graph's node extent in x & y.
 */
export function graphExtent(graph: Graph): { x: Extent; y: Extent } {
  if (!graph.order) return { x: [0, 1], y: [0, 1] };

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  graph.forEachNode((_, attr) => {
    const { x, y } = attr;

    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;

    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });

  return { x: [xMin, xMax], y: [yMin, yMax] };
}

/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
export function validateGraph(graph: Graph): void {
  // check if it's a valid graphology instance
  if (!isGraph(graph)) throw new Error("Sigma: invalid graph instance.");

  // check if nodes have x/y attributes
  graph.forEachNode((key: string, attributes: Attributes) => {
    if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
      throw new Error(
        `Sigma: Coordinates of node ${key} are invalid. A node must have a numeric 'x' and 'y' attribute.`,
      );
    }
  });
}
