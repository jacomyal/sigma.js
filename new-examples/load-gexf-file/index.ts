import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";

function init(graph: Graph) {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const controls = document.getElementById("controls") as HTMLElement;

  const renderer = new Sigma(graph, container);
  const camera = renderer.getCamera();

  // Bind interactions:
  const zoomInBtn = controls.querySelector("#zoom-in") as HTMLButtonElement;
  const zoomOutBtn = controls.querySelector("#zoom-out") as HTMLButtonElement;
  const zoomResetBtn = controls.querySelector("#zoom-reset") as HTMLButtonElement;
  const labelsThresholdRange = controls.querySelector("#labels-density") as HTMLInputElement;

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
}

// Load external GEXF file:
fetch("./public/arctic.gexf")
  .then((res) => res.text())
  .then((xml) => init(parse(Graph, xml)));
