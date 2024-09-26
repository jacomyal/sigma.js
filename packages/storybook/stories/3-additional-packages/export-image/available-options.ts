/**
 * This is an example of sigma showing how to download an image snapshot of a rendered graph.
 * More specifically, this story showcases the various options of @sigma/export-image downloadAsImage
 * function.
 */
import { downloadAsImage } from "@sigma/export-image";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate graph:
  const graph = new Graph();

  const RED = "#FA4F40";
  const BLUE = "#727EE0";
  const GREEN = "#5DB346";

  graph.addNode("John", { size: 15, label: "John", color: RED });
  graph.addNode("Mary", { size: 15, label: "Mary", color: RED });
  graph.addNode("Suzan", { size: 15, label: "Suzan", color: RED });
  graph.addNode("Nantes", { size: 15, label: "Nantes", color: BLUE });
  graph.addNode("New-York", { size: 15, label: "New-York", color: BLUE });
  graph.addNode("Sushis", { size: 7, label: "Sushis", color: GREEN });
  graph.addNode("Falafels", { size: 7, label: "Falafels", color: GREEN });
  graph.addNode("Kouign Amann", { size: 7, label: "Kouign Amann", color: GREEN });

  graph.addEdge("John", "Mary", { type: "line", label: "works with", size: 5 });
  graph.addEdge("Mary", "Suzan", { type: "line", label: "works with", size: 5 });
  graph.addEdge("Mary", "Nantes", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("John", "New-York", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("Suzan", "New-York", { type: "arrow", label: "lives in", size: 5 });
  graph.addEdge("John", "Falafels", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Mary", "Sushis", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Suzan", "Kouign Amann", { type: "arrow", label: "eats", size: 5 });

  graph.nodes().forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / graph.order;
    graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
    graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
  });

  const renderer = new Sigma(graph, container, {
    renderEdgeLabels: true,
  });

  // Create the spring layout and start it:
  const layout = new ForceSupervisor(graph);
  layout.start();

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
    <div>
      <input type="checkbox" id="layer-edges" checked />
      <label for="layer-edges">Edges</label>
    </div>
    <div>
      <input type="checkbox" id="layer-nodes" checked />
      <label for="layer-nodes">Nodes</label>
    </div>
    <div>
      <input type="checkbox" id="layer-edgeLabels" checked />
      <label for="layer-edgeLabels">Edge labels</label>
    </div>
    <div>
      <input type="checkbox" id="layer-labels" checked />
      <label for="layer-labels">Node labels</label>
    </div>
    <br />
    <h4 style="margin: 0">Dimensions</h4>
    <div style="margin-bottom: 5px">
      <label for="height" style="display: block;">Height</label>
      <input type="number" id="height" placeholder="empty: viewport height" />
    </div>
    <div>
      <label for="width" style="display: block;">Width</label>
      <input type="number" id="width" placeholder="empty: viewport width" />
    </div>
    <br />
    <h4 style="margin: 0">Additional options</h4>
    <div style="margin-bottom: 5px">
      <label for="filename" style="display: block;">File name</label>
      <input type="text" id="filename" value="graph" />
    </div>
    <div style="margin-bottom: 5px">
      <label for="format" style="display: block;">Format</label>
      <select id="format">
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
      </select>
    </div>
    <div style="margin-bottom: 5px">
      <label for="backgroundColor" style="display: block;">Background color</label>
      <input type="color" id="backgroundColor" value="#ffffff" />
    </div>
    <div>
      <input type="checkbox" id="reset-camera-state" />
      <label for="reset-camera-state">Reset camera state</label>
    </div>
    <br />
    <button type="button" id="save-as-png">Save image snapshot</button>
  `;
  document.body.appendChild(form);

  // Bind save button:
  const saveBtn = document.getElementById("save-as-png") as HTMLButtonElement;
  saveBtn.addEventListener("click", () => {
    const layers = ["edges", "nodes", "edgeLabels", "labels"].filter(
      (id) => !!(document.getElementById(`layer-${id}`) as HTMLInputElement).checked,
    );
    const width = +(document.getElementById(`width`) as HTMLInputElement).value;
    const height = +(document.getElementById(`height`) as HTMLInputElement).value;
    const fileName = (document.getElementById(`filename`) as HTMLInputElement).value;
    const format = (document.getElementById(`format`) as HTMLInputElement).value as "png" | "jpeg";
    const resetCameraState = !!(document.getElementById(`reset-camera-state`) as HTMLInputElement).checked;
    const backgroundColor = (document.getElementById(`backgroundColor`) as HTMLInputElement).value;

    downloadAsImage(renderer, {
      layers,
      format,
      fileName,
      backgroundColor,
      width: !width || isNaN(width) ? undefined : width,
      height: !height || isNaN(height) ? undefined : height,
      cameraState: resetCameraState ? { x: 0.5, y: 0.5, angle: 0, ratio: 1 } : undefined,
    });
  });

  return () => {
    layout.kill();
    renderer.kill();
  };
};
