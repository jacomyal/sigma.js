import { fitViewportToNodes } from "@sigma/utils";
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

  // Add buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.position = "absolute";
  buttonsContainer.style.right = "10px";
  buttonsContainer.style.bottom = "10px";
  document.body.append(buttonsContainer);

  communitiesArray.forEach((community) => {
    const id = `cb-${community}`;
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML += `
      <button id="${id}" style="color:${palette[community]};margin-top:3px">Community n°${community + 1}</button>    
    `;
    buttonsContainer.append(buttonContainer);
    const button = buttonsContainer.querySelector(`#${id}`) as HTMLButtonElement;

    button.addEventListener("click", () => {
      fitViewportToNodes(
        renderer,
        graph.filterNodes((_, attr) => attr.community === community),
        { animate: true },
      );
    });
  });

  return () => {
    renderer?.kill();
  };
};
