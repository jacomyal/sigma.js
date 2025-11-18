/**
 * This example demonstrates alpha blending and depth (z-index) management in sigma.js.
 * It showcases how to:
 * - Handle transparent nodes with alpha blending
 * - Manage z-index for nodes and edges independently
 * - Dynamically adjust depth ordering on hover interactions
 */
import Graph from "graphology";
import clusters from "graphology-generators/random/clusters";
import circlePack from "graphology-layout/circlepack";
import Sigma from "sigma";
import { EdgeDisplayData, NodeDisplayData } from "sigma/types";

// Here are the different ranges for z indexes:
const Z_INDEX_RANGES = {
  minEdges: 0,
  maxEdges: 0.4,
  minNodes: 0.4,
  maxNodes: 0.8,
  highlightedEdges: 0.9,
  highlightedNodes: 1,
};

function random(min: number, max: number) {
  return min + (max - min) * Math.random();
}

function hexWithAlpha(color: string, alpha: number): string {
  // Convert alpha (0-1) to hex (00-FF)
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${alphaHex}`;
}

export default () => {
  // Get DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;
  const shuffleButton = document.getElementById("shuffle") as HTMLButtonElement;
  const debugPickingCheckbox = document.getElementById("debug-picking") as HTMLInputElement;
  const debugGPUPerfs = document.getElementById("debug-gpu") as HTMLInputElement;
  const alphaSlider = document.getElementById("alpha-slider") as HTMLInputElement;
  const alphaValue = document.getElementById("alpha-value") as HTMLSpanElement;
  const thresholdSlider = document.getElementById("threshold-slider") as HTMLInputElement;
  const thresholdValue = document.getElementById("threshold-value") as HTMLSpanElement;

  // Generate a 4-cluster random graph
  const graph = clusters(Graph, {
    order: 2000,
    size: 6000,
    clusters: 4,
  });

  // Define base cluster colors (without alpha)
  const baseClusterColors = ["#00ff00", "#ff0000", "#ffff00", "#cccccc"];

  // Store which node each edge gets its color from (to avoid re-randomizing)
  const edgeColorSources = new Map<string, string>();

  // Initialize node sizes and store edge color sources
  graph.forEachNode((node) => {
    graph.setNodeAttribute(node, "size", graph.degree(node));
  });
  graph.forEachEdge((edge, _, source, target) => {
    graph.setEdgeAttribute(edge, "size", graph.degree(source) + graph.degree(target));
    // Store which extremity provides the color for this edge
    edgeColorSources.set(edge, Math.random() > 0.5 ? source : target);
  });

  // Function to update cluster colors based on alpha value
  const updateClusterColors = (alpha: number) => {
    graph.forEachNode((node, attributes) => {
      const cluster = attributes.cluster as number;
      // Apply alpha to first 3 clusters only, last cluster stays opaque
      const color = cluster < 3 ? hexWithAlpha(baseClusterColors[cluster], alpha) : baseClusterColors[cluster];
      graph.setNodeAttribute(node, "color", color);
    });
    graph.forEachEdge((edge) => {
      // Use the stored color source node for this edge
      const colorExtremity = edgeColorSources.get(edge)!;
      graph.setEdgeAttribute(edge, "color", graph.getNodeAttribute(colorExtremity, "color"));
    });
  };

  // Initialize colors with current alpha value
  updateClusterColors(parseFloat(alphaSlider.value));

  // Apply circlePack layout based on clusters
  circlePack.assign(graph, {
    hierarchyAttributes: ["cluster"],
  });

  // Helper function to assign random z-index values
  const assignRandomZIndex = () => {
    graph.forEachNode((node) => {
      graph.setNodeAttribute(node, "zIndex", random(Z_INDEX_RANGES.minNodes, Z_INDEX_RANGES.maxNodes));
    });

    graph.forEachEdge((edge) => {
      graph.setEdgeAttribute(edge, "zIndex", random(Z_INDEX_RANGES.minEdges, Z_INDEX_RANGES.maxEdges));
    });
  };

  // Initialize colors and z-index
  assignRandomZIndex();

  // Define state type
  type State = {
    hoveredNode: null | {
      node: string;
      neighbors: Set<string>;
      edges: Set<string>;
    };
    hoveredEdge: null | {
      edge: string;
      nodes: Set<string>;
    };
  };

  // Initialize state
  const state: State = {
    hoveredNode: null,
    hoveredEdge: null,
  };

  // Create Sigma instance
  const renderer = new Sigma(graph, container, {
    enableEdgeEvents: true,
    nodeReducer: (node, data) => {
      const res: Partial<NodeDisplayData> = { ...data };

      // Edge hover: extremities appear on top
      if (state.hoveredEdge && state.hoveredEdge.nodes.has(node)) {
        res.zIndex = Z_INDEX_RANGES.highlightedNodes;
        res.highlighted = true;
      }
      // Node hover: hovered node and neighbors appear on top
      else if (state.hoveredNode) {
        if (node === state.hoveredNode.node || state.hoveredNode.neighbors.has(node)) {
          res.zIndex = Z_INDEX_RANGES.highlightedNodes;
          res.highlighted = true;
        }
      }

      return res;
    },
    edgeReducer: (edge, data) => {
      const res: Partial<EdgeDisplayData> = { ...data };

      // Edge hover: hovered edge appears above everything (including nodes)
      if (state.hoveredEdge && state.hoveredEdge.edge === edge) {
        res.zIndex = Z_INDEX_RANGES.highlightedEdges;
      }
      // Node hover: connected edges appear on top (within edge range)
      else if (state.hoveredNode && state.hoveredNode.edges.has(edge)) {
        res.zIndex = Z_INDEX_RANGES.highlightedEdges;
      }

      return res;
    },
  });

  // Node hover handlers
  renderer.on("enterNode", ({ node }) => {
    state.hoveredEdge = null;
    state.hoveredNode = {
      node,
      neighbors: new Set(graph.neighbors(node)),
      edges: new Set(graph.edges(node)),
    };
    renderer.refresh({ skipIndexation: true });
  });

  renderer.on("leaveNode", () => {
    state.hoveredNode = null;
    renderer.refresh({ skipIndexation: true });
  });

  // Edge hover handlers
  renderer.on("enterEdge", ({ edge }) => {
    state.hoveredNode = null;
    state.hoveredEdge = {
      edge,
      nodes: new Set([graph.source(edge), graph.target(edge)]),
    };
    renderer.refresh({ skipIndexation: true });
  });

  renderer.on("leaveEdge", () => {
    state.hoveredEdge = null;
    renderer.refresh({ skipIndexation: true });
  });

  // Shuffle button
  shuffleButton.addEventListener("click", () => {
    assignRandomZIndex();
    renderer.refresh();
  });

  // Debug picking layer checkbox
  debugPickingCheckbox.addEventListener("change", () => {
    renderer.setSetting("DEBUG_displayPickingLayer", debugPickingCheckbox.checked);
  });

  // Debug picking layer checkbox
  debugGPUPerfs.addEventListener("change", () => {
    renderer.setSetting("DEBUG_gpuTiming", debugGPUPerfs.checked);
    renderer.setSetting("DEBUG_gpuTimingVisualOverlay", debugGPUPerfs.checked);
  });

  // Alpha slider
  alphaSlider.addEventListener("input", () => {
    const alpha = parseFloat(alphaSlider.value);
    alphaValue.textContent = alpha.toFixed(2);
    updateClusterColors(alpha);
    renderer.refresh();
  });

  // Opaque threshold slider
  thresholdSlider.addEventListener("input", () => {
    const threshold = parseFloat(thresholdSlider.value);
    thresholdValue.textContent = threshold.toFixed(2);
    renderer.setSetting("opaqueThreshold", threshold);
  });

  // Cleanup
  return () => {
    renderer.kill();
  };
};
