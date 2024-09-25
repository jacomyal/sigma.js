import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Detect communities
  louvain.assign(graph, { nodeCommunityAttribute: "community" });
  const communities = new Set<string>();
  graph.forEachNode((_, attrs) => communities.add(attrs.community));
  const communitiesArray = Array.from(communities);

  // Determine colors, and color each node accordingly
  const palette: Record<string, string> = iwanthue(communities.size).reduce(
    (iter, color, i) => ({
      ...iter,
      [communitiesArray[i]]: color,
    }),
    {},
  );
  graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add checkboxes
  const checkboxesContainer = document.createElement("div");
  checkboxesContainer.style.position = "absolute";
  checkboxesContainer.style.right = "10px";
  checkboxesContainer.style.bottom = "10px";
  document.body.append(checkboxesContainer);

  communitiesArray.forEach((community, i) => {
    const id = `cb-${community}`;
    const checkboxContainer = document.createElement("div");
    checkboxContainer.innerHTML += `
      <input type="checkbox" id="${id}" name="">
      <label for="${id}" style="color:${palette[community]}">Community n°${community + 1}</label>    
    `;
    checkboxesContainer.append(checkboxContainer);
    const checkbox = checkboxesContainer.querySelector(`#${id}`) as HTMLInputElement;

    let clean: null | (() => void) = null;
    const toggle = () => {
      if (clean) {
        clean();
        clean = null;
      } else {
        clean = bindWebGLLayer(
          `community-${community}`,
          renderer,
          createContoursProgram(
            graph.filterNodes((_, attr) => attr.community === community),
            {
              radius: 150,
              border: {
                color: palette[community],
                thickness: 8,
              },
              levels: [
                {
                  color: "#00000000",
                  threshold: 0.5,
                },
              ],
            },
          ),
        );
      }
    };

    checkbox.addEventListener("change", toggle);

    if (!i) {
      checkbox.checked = true;
      toggle();
    }
  });

  return () => {
    renderer?.kill();
  };
};
