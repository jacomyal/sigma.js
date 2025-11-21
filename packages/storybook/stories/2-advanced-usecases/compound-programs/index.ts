import { createNodeBorderProgram } from "@sigma/node-border";
import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram, createNodeCompoundProgram } from "sigma/rendering";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 60,
    label: "A",
    color: "pink",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/person.svg",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 120,
    label: "B",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 60,
    label: "C",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/chat.svg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 60,
    label: "D",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 120,
    label: "E",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 60,
    label: "F",
    color: "yellow",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const NodeBorderCustomProgram = createNodeBorderProgram({
    borders: [
      { size: { value: 0.1 }, color: { attribute: "pictoColor" } },
      { size: { fill: true }, color: { attribute: "color" } },
    ],
  });

  const NodePictogramCustomProgram = createNodeImageProgram({
    padding: 0.3,
    size: { mode: "force", value: 256 },
    drawingMode: "color",
    colorAttribute: "pictoColor",
  });

  const NodeProgram = createNodeCompoundProgram([NodeBorderCustomProgram, NodePictogramCustomProgram]);

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "pictogram",
    nodeProgramClasses: {
      pictogram: NodeProgram,
    },
    defaultEdgeType: "arrow",
    edgeProgramClasses: {
      arrow: EdgeArrowProgram,
    },
  });

  // Drag'n'drop
  let draggedNode: string | null = null;
  let isDragging = false;

  renderer.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, "highlighted", true);
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  });

  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return;

    const pos = renderer.viewportToGraph(event);
    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
  });

  const handleUp = () => {
    if (draggedNode) {
      graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
  };
  renderer.on("upNode", handleUp);
  renderer.on("upStage", handleUp);

  return () => {
    renderer.kill();
  };
};
