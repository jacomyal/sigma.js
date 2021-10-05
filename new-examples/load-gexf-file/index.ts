import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";

// Load external GEXF file:
fetch("./public/arctic.gexf")
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

    // Instanciate sigma:
    const renderer = new Sigma(graph, container);
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
    labelsThresholdRange.addEventListener("change", () => {
      renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
    });

    // Set proper range initial value:
    labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
  });
