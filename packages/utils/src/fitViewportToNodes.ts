import Sigma from "sigma";
import type { CameraState } from "sigma/types";
import { getCorrectionRatio } from "sigma/utils";

export type FitViewportToNodesOptions = {
  animate: boolean;
};
export const DEFAULT_FIT_VIEWPORT_TO_NODES_OPTIONS: FitViewportToNodesOptions = {
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
  if (!nodes.length) throw new Error("getCameraStateToFitViewportToNodes: There should be at least one node.");

  let groupMinX = Infinity;
  let groupMaxX = -Infinity;
  let groupMinY = Infinity;
  let groupMaxY = -Infinity;
  let groupFramedMinX = Infinity;
  let groupFramedMaxX = -Infinity;
  let groupFramedMinY = Infinity;
  let groupFramedMaxY = -Infinity;

  const graph = sigma.getGraph();
  nodes.forEach((node) => {
    const data = sigma.getNodeDisplayData(node);
    if (!data) throw new Error(`getCameraStateToFitViewportToNodes: Node ${node} not found in sigma's graph.`);

    const { x, y } = graph.getNodeAttributes(node);
    const { x: framedX, y: framedY } = data;

    groupMinX = Math.min(groupMinX, x);
    groupMaxX = Math.max(groupMaxX, x);
    groupMinY = Math.min(groupMinY, y);
    groupMaxY = Math.max(groupMaxY, y);
    groupFramedMinX = Math.min(groupFramedMinX, framedX);
    groupFramedMaxX = Math.max(groupFramedMaxX, framedX);
    groupFramedMinY = Math.min(groupFramedMinY, framedY);
    groupFramedMaxY = Math.max(groupFramedMaxY, framedY);
  });

  const { x, y } = sigma.getCustomBBox() || sigma.getBBox();
  const graphWidth = x[1] - x[0] || 1;
  const graphHeight = y[1] - y[0] || 1;

  const groupCenterX = (groupFramedMinX + groupFramedMaxX) / 2;
  const groupCenterY = (groupFramedMinY + groupFramedMaxY) / 2;
  const groupWidth = groupMaxX - groupMinX || graphWidth;
  const groupHeight = groupMaxY - groupMinY || graphHeight;

  const { width, height } = sigma.getDimensions();
  const correction = getCorrectionRatio({ width, height }, { width: graphWidth, height: graphHeight });
  const ratio =
    ((groupHeight / groupWidth < height / width ? groupWidth : groupHeight) / Math.max(graphWidth, graphHeight)) *
    correction;

  const camera = sigma.getCamera();
  return {
    ...camera.getState(),
    angle: 0,
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
export async function fitViewportToNodes(
  sigma: Sigma,
  nodes: string[],
  opts: Partial<FitViewportToNodesOptions> = {},
): Promise<void> {
  const { animate } = {
    ...DEFAULT_FIT_VIEWPORT_TO_NODES_OPTIONS,
    ...opts,
  };

  const camera = sigma.getCamera();
  const newCameraState = getCameraStateToFitViewportToNodes(sigma, nodes, opts);
  if (animate) {
    await camera.animate(newCameraState);
  } else {
    camera.setState(newCameraState);
  }
}
