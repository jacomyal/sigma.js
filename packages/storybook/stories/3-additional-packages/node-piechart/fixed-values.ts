import { CreateNodePiechartProgramOptions, createNodePiechartProgram } from "@sigma/node-piechart";
import Graph from "graphology";
import Sigma from "sigma";
import { DEFAULT_NODE_PROGRAM_CLASSES } from "sigma/settings";
import { NodeDisplayData } from "sigma/types";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph<Partial<NodeDisplayData> & { colors: string[] }>();

  const COLOR_1 = "#956b5e";
  const COLOR_2 = "#ff44de";
  const COLOR_3 = "#71db97";
  const COLOR_4 = "#ff813b";

  // This example shows how to render nodes that have multiple colors:
  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    colors: [COLOR_1],
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    colors: [COLOR_1, COLOR_2, COLOR_3],
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    colors: [COLOR_2],
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    colors: [COLOR_2, COLOR_3],
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    colors: [COLOR_2, COLOR_3, COLOR_4],
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    colors: [COLOR_4],
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const maxCount = Math.max(...graph.mapNodes((_, { colors }) => colors.length));
  const nodeProgramClasses = { ...DEFAULT_NODE_PROGRAM_CLASSES };

  for (let i = 2; i <= maxCount; i++) {
    const slices: CreateNodePiechartProgramOptions["slices"] = [{ color: { attribute: "color" }, value: { value: 1 } }];
    for (let j = 1; j < i; j++) slices.push({ color: { attribute: `color-${j}` }, value: { value: 1 } });
    nodeProgramClasses[`pie-${i}`] = createNodePiechartProgram({
      slices,
    });
  }
  const renderer = new Sigma(graph, container, {
    nodeProgramClasses,
    nodeReducer: (_, data) => {
      const colors = data.colors as string[];
      data.type = colors.length <= 1 ? "circle" : `pie-${colors.length}`;
      data.color = colors[0];
      for (let i = 1; i < colors.length; i++) data[`color-${i}` as "color"] = colors[i];
      return data;
    },
  });

  return () => {
    renderer.kill();
  };
};
