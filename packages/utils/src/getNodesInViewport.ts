import Sigma from "sigma";
import { NodeDisplayData } from "sigma/types";

/**
 * This function takes a Sigma instance and returns the list of all nodes visible in the viewport.
 *
 * @param sigma A Sigma instance
 */
export function getNodesInViewport(sigma: Sigma): string[] {
  const { width, height } = sigma.getDimensions();
  const graph = sigma.getGraph();
  return graph.filterNodes((_, attributes) => {
    const data = attributes as NodeDisplayData;
    const { x, y } = sigma.graphToViewport(data);
    const size = sigma.scaleSize(data.size);
    return x + size >= 0 && x - size <= width && y + size >= 0 && y - size <= height;
  });
}
