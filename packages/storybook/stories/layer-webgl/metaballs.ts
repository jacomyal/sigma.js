import { bindWebGLLayer, createMetaballsProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

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

      // Instantiate sigma:
      renderer = new Sigma(graph, container);

      bindWebGLLayer(
        "orange-metaball",
        renderer,
        createMetaballsProgram(
          graph.filterNodes((_node, attributes) => attributes.color === "rgb(255,204,102)"),
          {
            color: "#eee",
            radius: 100,
            // threshold: 1,
            feather: 0.1,
          },
        ),
      );
    });

  onStoryDown(() => {
    renderer?.kill();
  });
};
