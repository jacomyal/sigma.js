import Sigma from "sigma";

import { DEFAULT_TO_IMAGE_OPTIONS, ToImageOptions } from "./options";

/**
 * This function takes a Sigma instance and some options, and returns a HTMLCanvasElement, with all the sigma layers
 * drawn on it. This new canvas can then be used to generate PNG or JPEG images, for instance.
 */
export async function drawOnCanvas(
  sigma: Sigma,
  opts: Partial<Omit<ToImageOptions, "fileName" | "format">> = {},
): Promise<HTMLCanvasElement> {
  const { layers, backgroundColor, width, height, cameraState, sigmaSettings, withTempRenderer } = {
    ...DEFAULT_TO_IMAGE_OPTIONS,
    ...opts,
  };
  const dimensions = sigma.getDimensions();
  const pixelRatio = window.devicePixelRatio || 1;
  const outputWidth = typeof width !== "number" ? dimensions.width : width;
  const outputHeight = typeof height !== "number" ? dimensions.height : height;

  const tmpRoot = document.createElement("DIV");
  tmpRoot.style.width = `${outputWidth}px`;
  tmpRoot.style.height = `${outputHeight}px`;
  tmpRoot.style.position = "absolute";
  tmpRoot.style.right = "101%";
  tmpRoot.style.bottom = "101%";
  document.body.appendChild(tmpRoot);

  // Instantiate sigma:
  const tempRenderer = new Sigma(sigma.getGraph(), tmpRoot, { ...sigma.getSettings(), ...sigmaSettings });

  // Copy camera and force to render now, to avoid having to wait the schedule /
  // debounce frame:
  tempRenderer.getCamera().setState(cameraState || sigma.getCamera().getState());
  tempRenderer.setCustomBBox(sigma.getCustomBBox());
  tempRenderer.refresh();

  // Create a new canvas, on which the different layers will be drawn:
  const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
  canvas.setAttribute("width", outputWidth * pixelRatio + "");
  canvas.setAttribute("height", outputHeight * pixelRatio + "");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Draw the background first:
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, outputWidth * pixelRatio, outputHeight * pixelRatio);

  if (withTempRenderer) {
    await withTempRenderer(tempRenderer);
  }

  // For each layer, draw it on our canvas:
  const canvases = tempRenderer.getCanvases();
  const canvasLayers = layers ? layers.filter((id) => !!canvases[id]) : Object.keys(canvases);
  canvasLayers.forEach((id) => {
    ctx.drawImage(
      canvases[id],
      0,
      0,
      outputWidth * pixelRatio,
      outputHeight * pixelRatio,
      0,
      0,
      outputWidth * pixelRatio,
      outputHeight * pixelRatio,
    );
  });

  // Cleanup:
  tempRenderer.kill();
  tmpRoot.remove();

  return canvas;
}
