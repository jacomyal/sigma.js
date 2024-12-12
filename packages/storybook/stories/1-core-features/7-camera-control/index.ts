/**
 * This example demonstrates how to adjust Sigma's settings for better control
 * over the camera's capabilities.
 */
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";
import { Settings } from "sigma/src/settings";

async function initGraph() {
  // Load external GEXF file:
  const res = await fetch("./arctic.gexf");
  const gexf = await res.text();
  const graph = parse(Graph, gexf);

  // Retrieve some useful DOM elements:

  // Instantiate sigma:
  const renderer = new Sigma(graph, document.getElementById("sigma-container") as HTMLElement);

  // Handle form submits:
  const form = document.getElementById("controls") as HTMLFormElement;
  const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
  function readForm(): Partial<Settings> {
    const data = new FormData(form);
    const res: Partial<Settings> = {};

    // Interactions:
    res.enableCameraZooming = !!data.get("enable-zooming");
    res.enableCameraPanning = !!data.get("enable-panning");
    res.enableCameraRotation = !!data.get("enable-rotation");

    // Zoom boundaries:
    const minRatio = data.get("min-ratio");
    res.minCameraRatio = minRatio ? +minRatio : null;
    const maxRatio = data.get("max-ratio");
    res.maxCameraRatio = maxRatio ? +maxRatio : null;

    // Pan boundaries:
    const isBound = data.get("is-camera-bound");
    const tolerance = data.get("tolerance");
    res.cameraPanBoundaries = isBound ? { tolerance: +(tolerance || 0) } : null;

    return res;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderer.setSettings(readForm());
    submitButton.disabled = true;
  });
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      submitButton.disabled = false;
    });
  });

  // Initialize settings:
  renderer.setSettings(readForm());

  // Handle disabling some inputs contextually:
  const enableZoomingInput = document.getElementById("enable-zooming") as HTMLInputElement;
  const minRatioInput = document.getElementById("min-ratio") as HTMLInputElement;
  const maxRatioInput = document.getElementById("max-ratio") as HTMLInputElement;
  enableZoomingInput.addEventListener("change", () => {
    const disabled = !enableZoomingInput.checked;
    minRatioInput.disabled = disabled;
    maxRatioInput.disabled = disabled;
  });

  const enablePanningInput = document.getElementById("enable-panning") as HTMLInputElement;
  const isCameraBoundInput = document.getElementById("is-camera-bound") as HTMLInputElement;
  const toleranceInput = document.getElementById("tolerance") as HTMLInputElement;
  isCameraBoundInput.addEventListener("change", () => {
    toleranceInput.disabled = !isCameraBoundInput.checked;
  });
  enablePanningInput.addEventListener("change", () => {
    const disabled = !enablePanningInput.checked;
    isCameraBoundInput.disabled = disabled;
    toleranceInput.disabled = disabled;
  });

  // Handle reset camera position
  const resetButton = document.querySelector('button[type="button"]') as HTMLButtonElement;
  resetButton.addEventListener("click", () => {
    renderer.getCamera().animatedReset({ duration: 600 });
  });

  return renderer;
}

export default () => {
  let renderer: Sigma;
  initGraph().then((r) => {
    renderer = r;
  });

  return () => {
    renderer?.kill();
  };
};
