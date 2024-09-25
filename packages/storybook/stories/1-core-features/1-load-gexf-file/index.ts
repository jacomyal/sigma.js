/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

export default () => {
  let renderer: Sigma | null = null;

  // Load external GEXF file:
  fetch("./arctic.gexf")
    .then((res) => res.text())
    .then((gexf) => {
      // Parse GEXF string:
      const graph = parse(Graph, gexf);

      // Retrieve some useful DOM elements:
      const container = document.getElementById("sigma-container") as HTMLElement;
      const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
      const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
      const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
      const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

      // Instantiate sigma:
      renderer = new Sigma(graph, container, {
        minCameraRatio: 0.08,
        maxCameraRatio: 3,
      });
      const camera = renderer.getCamera();

      // Bind zoom manipulation buttons
      zoomInBtn.addEventListener("click", () => {
        camera.animatedZoom({ duration: 600 });
      });
      zoomOutBtn.addEventListener("click", () => {
        camera.animatedUnzoom({ duration: 600 });
      });
      zoomResetBtn.addEventListener("click", () => {
        camera.animatedReset({ duration: 600 });
      });

      // Bind labels threshold to range input
      labelsThresholdRange.addEventListener("input", () => {
        renderer?.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
      });

      // Set proper range initial value:
      labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
    });

  return () => {
    renderer?.kill();
  };
};
