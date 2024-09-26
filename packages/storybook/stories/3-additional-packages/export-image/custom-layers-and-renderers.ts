/**
 * This story shows how @sigma/export-image interacts with other custom rendering features, such as
 * custom nodes renderer (with @sigma/node-image) and custom layers (with @sigma/layer-webgl).
 */
import { downloadAsPNG } from "@sigma/export-image";
import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import { NodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import { startCase } from "lodash";
import Sigma from "sigma";
import { DEFAULT_NODE_PROGRAM_CLASSES } from "sigma/settings";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate graph:
  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "Jim",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Jim_Morrison_1969.JPG",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "Johnny",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Johnny_Hallyday_%E2%80%94_Milan%2C_1973.jpg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "Jimi",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Jimi-Hendrix-1967-Helsinki-d.jpg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "Bob",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Bob-Dylan-arrived-at-Arlanda-surrounded-by-twenty-bodyguards-and-assistants-391770740297_%28cropped%29.jpg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "Eric",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Eric_Clapton_1.jpg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "Mick",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Mick-Jagger-1965b.jpg",
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

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "image",
    nodeProgramClasses: {
      image: NodeImageProgram,
    },
  });

  // Bind custom layer
  const contoursProgram = createContoursProgram(graph.nodes(), {
    radius: 400,
    border: {
      color: "#666666",
      thickness: 8,
    },
    levels: [
      {
        color: "#00000000",
        threshold: 0.8,
      },
    ],
  });
  bindWebGLLayer(`graphContour`, renderer, contoursProgram);

  const SKIPPED_LAYERS = new Set(["mouse", "edgeLabels", "hovers", "hoverNodes"]);
  const allLayers = [...document.querySelectorAll("#sigma-container canvas")]
    .map((layer) => (layer.className || "").replace("sigma-", ""))
    .filter((name) => name && !SKIPPED_LAYERS.has(name));

  // Create form:
  const form = document.createElement("form");
  form.style.position = "absolute";
  form.style.top = "0";
  form.style.left = "0";
  form.style.maxWidth = "100%";
  form.style.maxHeight = "100%";
  form.style.padding = "1em";
  form.style.background = "#ffffff99";
  form.innerHTML = `
    <h4 style="margin: 0">Layers to save</h4>
    ${allLayers
      .map(
        (name) => `
      <div>
        <input type="checkbox" id="layer-${name}" checked />
        <label for="layer-${name}">${startCase(name)}</label>
      </div>`,
      )
      .join("")}
    <br />
    <h4 style="margin: 0">Additional options</h4>
    <div>
      <input type="checkbox" id="include-images" checked />
      <label for="include-images">Include node images</label>
    </div>
    <br />
    <button type="button" id="save-as-png">Save PNG snapshot</button>
  `;
  document.body.appendChild(form);

  // Bind save button:
  const saveBtn = document.getElementById("save-as-png") as HTMLButtonElement;
  saveBtn.addEventListener("click", () => {
    const layers = allLayers.filter((id) => (document.getElementById(`layer-${id}`) as HTMLInputElement).checked);
    const includeNodeImages = (document.getElementById(`include-images`) as HTMLInputElement).checked;

    downloadAsPNG(renderer, {
      layers,
      backgroundColor: "#ffffff",
      withTempRenderer: (tempRenderer) => {
        bindWebGLLayer(`graphContour`, tempRenderer, contoursProgram);
      },
      sigmaSettings: !includeNodeImages
        ? { defaultNodeType: "circle", nodeProgramClasses: DEFAULT_NODE_PROGRAM_CLASSES }
        : {},
    });
  });

  return () => {
    renderer.kill();
  };
};
