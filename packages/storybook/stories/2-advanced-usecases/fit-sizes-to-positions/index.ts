/**
 * Sigma has been designed to display any graph in a "readable way" by default:
 * https://www.sigmajs.org/docs/advanced/coordinate-systems
 *
 * This design principle is enforced by three main features:
 * 1. Graph is rescaled and centered to fit by default in the viewport
 * 2. Node sizes are interpolated by default to fit in a pixels range,
 *    independent of the viewport (and not correlated to the nodes positions)
 * 3. When users scroll into the graph, the node sizes do not scale with the
 *    zoom ratio, but with its square root instead
 *
 * In some cases, it is better to disable these features, to have better
 * control over the way nodes are displayed on screen.
 *
 * This example shows how to disable these three features.
 */
import { NodeSquareProgram } from "@sigma/node-square";
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_SETTINGS } from "sigma/settings";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Let's first build a graph that will look like a perfect grid:
  const graph = new Graph();
  const colorScale = chroma.scale(["yellow", "navy"]).mode("lch");
  const GRID_SIZE = 20;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const color = colorScale((col + row) / (GRID_SIZE * 2)).hex();
      graph.addNode(`${row}/${col}`, {
        x: 20 * col,
        y: 20 * row,
        size: 5,
        color,
      });

      if (row >= 1) graph.addEdge(`${row - 1}/${col}`, `${row}/${col}`, { size: 10 });
      if (col >= 1) graph.addEdge(`${row}/${col - 1}`, `${row}/${col}`, { size: 10 });
    }
  }

  const renderer = new Sigma(graph, container, {
    // This flag tells sigma to disable the nodes and edges sizes interpolation
    // and instead scales them in the same way it handles positions:
    itemSizesReference: "positions",
    // This function tells sigma to grow sizes linearly with the zoom, instead
    // of relatively to the zoom ratio's square root:
    zoomToSizeRatioFunction: (x) => x,
    // This disables the default sigma rescaling, so that by default, positions
    // and sizes are preserved on screen (in pixels):
    autoRescale: false,
    // Finally, let's indicate that we want square nodes, to get a perfect
    // grid:
    defaultNodeType: "square",
    nodeProgramClasses: {
      square: NodeSquareProgram,
    },
  });

  // Handle controls:
  const linearZoomToSizeRatioFunction = document.getElementById("linearZoomToSizeRatioFunction") as HTMLInputElement;
  const itemSizesReferencePositions = document.getElementById("itemSizesReferencePositions") as HTMLInputElement;
  const disabledAutoRescale = document.getElementById("disabledAutoRescale") as HTMLInputElement;
  const resetCamera = document.getElementById("resetCamera") as HTMLButtonElement;

  // Set initial form values:
  linearZoomToSizeRatioFunction.checked =
    renderer.getSetting("zoomToSizeRatioFunction") !== DEFAULT_SETTINGS.zoomToSizeRatioFunction;
  itemSizesReferencePositions.checked = renderer.getSetting("itemSizesReference") === "positions";
  disabledAutoRescale.checked = !renderer.getSetting("autoRescale");

  // Handle controls updates:
  function refreshSettings() {
    renderer.setSetting(
      "zoomToSizeRatioFunction",
      linearZoomToSizeRatioFunction.checked ? (x) => x : DEFAULT_SETTINGS.zoomToSizeRatioFunction,
    );
    renderer.setSetting(
      "itemSizesReference",
      itemSizesReferencePositions.checked ? "positions" : DEFAULT_SETTINGS.itemSizesReference,
    );
    renderer.setSetting("autoRescale", !disabledAutoRescale.checked);
  }
  [linearZoomToSizeRatioFunction, itemSizesReferencePositions, disabledAutoRescale].forEach((input) =>
    input.addEventListener("change", refreshSettings),
  );

  // Handle reset camera button:
  resetCamera.addEventListener("click", () => {
    renderer.getCamera().animatedReset();
  });

  return () => {
    renderer.kill();
  };
};
