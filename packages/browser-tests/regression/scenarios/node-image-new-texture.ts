// Nodes vanish when the image atlas grows a new texture.
//
// A new texture regenerates the node program's shaders mid-render, and that
// frame draws with the deleted program: nodes stay blank until the next
// refresh. Here each texture fits a single image, so every image load adds a
// texture.
import { layerImage } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { layerFill } from "sigma/rendering";

const COLORS = ["#E8684A", "#5B8FF9", "#9270CA", "#61DDAA", "#F6BD16", "#FF99C3"];

// Local images, so the scenario needs no network:
function squareImage(color: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(64, 64, 128, 128);
  return canvas.toDataURL("image/png");
}

export default (container: HTMLElement) => {
  const graph = new Graph();

  COLORS.forEach((color, i) => {
    graph.addNode(`n${i}`, { x: i, y: i % 2, size: 0.4, color, image: squareImage(color) });
  });

  return new Sigma(graph, container, {
    primitives: {
      nodes: {
        variables: { image: { type: "string", default: "" } },
        layers: [
          layerFill(),
          layerImage({
            textureManagerOptions: { maxTextureSize: 512, size: { mode: "max", value: 256 }, debounceTimeout: null },
          }),
        ],
      },
    },
  });
};
