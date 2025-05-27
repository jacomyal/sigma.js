/**
 * This is a minimal example to show how to load a RDF graph file into graphology and display it.
 * The way the graph is created from JSON-LD can be adapted to your needs.
 */
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import jsonld, { type NodeObject } from "jsonld";
import Sigma from "sigma";

export default () => {
  let renderer: Sigma | null = null;

  // Track the global ID to avoid merging nodes of the same type
  let GLOBAL_ID = 0;

  /**
   * Recursive function that parse the extended JSON-LD structure
   * and builds the graph.
   */
  function parseJsonLdExtended(item: NodeObject, graph: Graph): string {
    GLOBAL_ID++;
    // If we just have the type, we add a unique ID to avoid merge node of same type in one node
    const subjectId =
      typeof item === "object" ? item["@id"] || item["@value"] || `${item["@type"]}#${GLOBAL_ID}` : `${item}`;
    graph.mergeNode(subjectId, { x: Math.random(), y: Math.random(), size: 10, label: subjectId });

    if (typeof item === "object" && "@type" in item) {
      // for each predicate, object , we build the edge (and the subgraph if needed by recursivity).
      for (const [predicate, objects] of Object.entries(item)) {
        if (Array.isArray(objects)) {
          for (const obj of objects) {
            if (obj !== null) {
              const objectId = parseJsonLdExtended(obj as NodeObject, graph);
              graph.addDirectedEdge(subjectId, objectId, {
                type: "arrow",
                label: predicate,
              });
            }
          }
        }
      }
    }
    return `${subjectId}`;
  }

  fetch("./pina-colada.jsonld").then(async (res) => {
    const rdf = await res.json();
    const graph = new Graph({ type: "directed", multi: true });

    // Expand the JSON-LD to a full RDF graph
    const expanded = await jsonld.expand(rdf);
    for (const item of expanded) {
      parseJsonLdExtended(item, graph);
    }

    // Retrieve some useful DOM elements:
    const container = document.getElementById("sigma-container") as HTMLElement;
    const FA2Button = document.getElementById("forceatlas2") as HTMLElement;
    const FA2StopLabel = document.getElementById("forceatlas2-stop-label") as HTMLElement;
    const FA2StartLabel = document.getElementById("forceatlas2-start-label") as HTMLElement;

    /** FA2 LAYOUT **/
    /* This example shows how to use the force atlas 2 layout in a web worker */

    // Graphology provides a easy to use implementation of Force Atlas 2 in a web worker
    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2Layout(graph, {
      settings: sensibleSettings,
    });

    // This variable is used to toggle state between start and stop
    const cancelCurrentAnimation: (() => void) | null = null;

    // correlate start/stop actions with state management
    function stopFA2() {
      fa2Layout.stop();
      FA2StartLabel.style.display = "flex";
      FA2StopLabel.style.display = "none";
    }
    function startFA2() {
      if (cancelCurrentAnimation) cancelCurrentAnimation();
      fa2Layout.start();
      FA2StartLabel.style.display = "none";
      FA2StopLabel.style.display = "flex";
    }

    // the main toggle function
    function toggleFA2Layout() {
      if (fa2Layout.isRunning()) {
        stopFA2();
      } else {
        startFA2();
      }
    }
    // bind method to the forceatlas2 button
    FA2Button.addEventListener("click", toggleFA2Layout);

    // Instantiate sigma:
    renderer = new Sigma(graph, container, {
      minCameraRatio: 0.08,
      maxCameraRatio: 3,
      renderEdgeLabels: true,
    });

    // Strt FA2
    startFA2();
  });

  return () => {
    renderer?.kill();
  };
};
