import Sigma from "sigma";
import type { CameraState } from "sigma/types";
import { getCorrectionRatio } from "sigma/utils";

export type FitViewportToNodesOptions = {
  animate: boolean;
};
export const DEFAULT_FIT_VIEWPORT_To_NODES_OPTIONS: FitViewportToNodesOptions = {
  animate: true,
};

/**
 * This function takes a Sigma instance and a list of nodes as input, and returns a CameraState so that the camera fits
 * the best to the given groups of nodes (i.e. the camera is as zoomed as possible while keeping all nodes on screen).
 *
 * @param sigma A Sigma instance
 * @param nodes A list of nodes IDs
 * @param opts  An optional and partial FitViewportToNodesOptions object
 */
export function getCameraStateToFitViewportToNodes(
  sigma: Sigma,
  nodes: string[],
  _opts: Partial<Omit<FitViewportToNodesOptions, "animate">> = {},
): CameraState {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let groupMinX = Infinity;
  let groupMaxX = -Infinity;
  let groupMinY = Infinity;
  let groupMaxY = -Infinity;
  let groupFramedMinX = Infinity;
  let groupFramedMaxX = -Infinity;
  let groupFramedMinY = Infinity;
  let groupFramedMaxY = -Infinity;

  const group = new Set(nodes);
  const graph = sigma.getGraph();
  graph.forEachNode((node, { x, y }) => {
    const data = sigma.getNodeDisplayData(node);
    if (!data) throw new Error(`getCameraStateToFitViewportToNodes: Node ${node} not found in sigma's graph.`);
    const { x: framedX, y: framedY } = data;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if (group.has(node)) {
      groupMinX = Math.min(groupMinX, x);
      groupMaxX = Math.max(groupMaxX, x);
      groupMinY = Math.min(groupMinY, y);
      groupMaxY = Math.max(groupMaxY, y);
      groupFramedMinX = Math.min(groupFramedMinX, framedX);
      groupFramedMaxX = Math.max(groupFramedMaxX, framedX);
      groupFramedMinY = Math.min(groupFramedMinY, framedY);
      groupFramedMaxY = Math.max(groupFramedMaxY, framedY);
    }
  });

  const groupCenterX = (groupFramedMinX + groupFramedMaxX) / 2;
  const groupCenterY = (groupFramedMinY + groupFramedMaxY) / 2;
  const groupWidth = groupMaxX - groupMinX || 1;
  const groupHeight = groupMaxY - groupMinY || 1;
  const graphWidth = maxX - minX || 1;
  const graphHeight = maxY - minY || 1;

  const { width, height } = sigma.getDimensions();
  const correction = getCorrectionRatio({ width, height }, { width: graphWidth, height: graphHeight });
  const ratio =
    ((groupHeight / groupWidth < height / width ? groupWidth : groupHeight) / Math.max(graphWidth, graphHeight)) *
    correction;

  const camera = sigma.getCamera();
  return {
    ...camera.getState(),
    x: groupCenterX,
    y: groupCenterY,
    ratio,
  };
}

/**
 * This function takes a Sigma instance and a list of nodes as input, and updates the camera so that the camera fits the
 * best to the given groups of nodes (i.e. the camera is as zoomed as possible while keeping all nodes on screen).
 *
 * @param sigma A Sigma instance
 * @param nodes A list of nodes IDs
 * @param opts  An optional and partial FitViewportToNodesOptions object
 */
export function fitViewportToNodes(sigma: Sigma, nodes: string[], opts: Partial<FitViewportToNodesOptions> = {}): void {
  const { animate } = {
    ...DEFAULT_FIT_VIEWPORT_To_NODES_OPTIONS,
    ...opts,
  };

  const camera = sigma.getCamera();
  const newCameraState = getCameraStateToFitViewportToNodes(sigma, nodes, opts);
  if (animate) {
    camera.animate(newCameraState);
  } else {
    camera.setState(newCameraState);
  }
}
