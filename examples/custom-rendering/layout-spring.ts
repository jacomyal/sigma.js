import Graph from "graphology";
import { NodeKey } from "graphology-types";

interface Settings {
  xKey: string;
  yKey: string;

  // Force settings:
  attraction: number;
  repulsion: number;
  gravity: number;
  inertia: number;
  maxMove: number;

  // Custom behaviors settings:
  shouldSkipEdge?: (n: NodeKey) => boolean;
  shouldSkipNode?: (n: NodeKey) => boolean;
  isNodeFixed?: (n: NodeKey) => boolean;
}

const DEFAULT_SETTINGS: Settings = {
  xKey: "x",
  yKey: "y",

  attraction: 0.0005,
  repulsion: 0.1,
  gravity: 0.0001,
  inertia: 0.6,
  maxMove: 200,
};

export default class SpringSupervisor {
  private graph: Graph;
  private settings: Settings;
  private nodeStates: Record<NodeKey, { dx: number; dy: number; x: number; y: number }> = {};
  private frameID?: number;
  private running = false;

  constructor(graph: Graph, settings: Partial<Settings> = {}) {
    this.graph = graph;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...settings,
    };

    this.init();
  }

  private iterate(): void {
    const { graph, settings, nodeStates } = this;
    const {
      attraction,
      repulsion,
      gravity,
      inertia,
      maxMove,
      shouldSkipNode,
      shouldSkipEdge,
      isNodeFixed,
      xKey,
      yKey,
    } = settings;

    let nodes = graph.nodes();
    if (shouldSkipNode) nodes = nodes.filter((n) => !shouldSkipNode(n));
    const order = nodes.length;

    let edges = graph.edges();
    if (shouldSkipNode)
      edges = edges.filter((e) => !shouldSkipNode(graph.source(e)) && !shouldSkipNode(graph.target(e)));
    if (shouldSkipEdge) edges = edges.filter((e) => !shouldSkipEdge(e));
    const size = edges.length;

    const distancesCache: Record<string, Record<string, number>> = {};

    // Check states and inertia
    for (let i = 0; i < order; i++) {
      const n = nodes[i];
      if (!nodeStates[n])
        nodeStates[n] = {
          dx: 0,
          dy: 0,
          x: graph.getNodeAttribute(n, xKey) || 0,
          y: graph.getNodeAttribute(n, yKey) || 0,
        };
      else
        nodeStates[n] = {
          dx: nodeStates[n].dx * inertia,
          dy: nodeStates[n].dy * inertia,
          x: graph.getNodeAttribute(n, xKey) || 0,
          y: graph.getNodeAttribute(n, yKey) || 0,
        };
    }

    // Repulsion
    if (repulsion)
      for (let i = 0; i < order; i++) {
        const n1 = nodes[i];
        const n1State = nodeStates[n1];

        for (let j = i + 1; j < order; j++) {
          const n2 = nodes[j];
          const n2State = nodeStates[n2];

          // Compute distance:
          const dx = n2State.x - n1State.x;
          const dy = n2State.y - n1State.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          if (n2 > n1) {
            distancesCache[n1] = distancesCache[n1] || {};
            distancesCache[n1][n2] = distance;
          } else {
            distancesCache[n2] = distancesCache[n2] || {};
            distancesCache[n2][n1] = distance;
          }

          // Repulse nodes relatively to 1 / distance:
          const repulsionX = (repulsion / distance) * dx;
          const repulsionY = (repulsion / distance) * dy;
          n1State.dx -= repulsionX;
          n1State.dy -= repulsionY;
          n2State.dx += repulsionX;
          n2State.dy += repulsionY;
        }
      }

    // Attraction
    if (attraction)
      for (let i = 0; i < size; i++) {
        const e = edges[i];
        const n1 = graph.source(e);
        const n2 = graph.target(e);
        const n1State = nodeStates[n1];
        const n2State = nodeStates[n2];

        if (n1 === n2) continue;

        // Compute distance:
        const dx = n2State.x - n1State.x;
        const dy = n2State.y - n1State.y;
        const distance: number = n2 > n1 ? distancesCache[n1][n2] : distancesCache[n2][n1];

        // Attract nodes relatively to their distance:
        const attractionX = attraction * distance * dx;
        const attractionY = attraction * distance * dy;
        n1State.dx += attractionX;
        n1State.dy += attractionY;
        n2State.dx -= attractionX;
        n2State.dy -= attractionY;
      }

    // Gravity
    if (gravity)
      for (let i = 0; i < order; i++) {
        const n = nodes[i];
        const nodeState = nodeStates[n];

        // Attract nodes to [0, 0] relatively to the distance:
        const { x, y } = nodeState;
        const distance = Math.sqrt(x * x + y * y) || 1;
        nodeStates[n].dx -= x * gravity * distance;
        nodeStates[n].dy -= y * gravity * distance;
      }

    // Apply forces
    for (let i = 0; i < order; i++) {
      const n = nodes[i];
      const nodeState = nodeStates[n];

      const distance = Math.sqrt(nodeState.dx * nodeState.dx + nodeState.dy * nodeState.dy);
      if (distance > maxMove) {
        nodeState.dx *= maxMove / distance;
        nodeState.dy *= maxMove / distance;
      }

      if (!isNodeFixed || !isNodeFixed(n)) {
        graph.setNodeAttribute(n, xKey, nodeState.x + nodeState.dx);
        graph.setNodeAttribute(n, yKey, nodeState.y + nodeState.dy);
      }
    }
  }
  private runFrame(): void {
    this.iterate();

    this.frameID = window.requestAnimationFrame(() => this.runFrame());
  }

  /**
   * Public API:
   * ***********
   */
  init(): void {
    this.nodeStates = {};
  }
  kill(): void {
    this.stop();
  }
  start(): void {
    if (this.running) return;

    this.runFrame();
    this.running = true;
  }
  stop(): void {
    if (!this.running) return;

    if (typeof this.frameID === "number") {
      window.cancelAnimationFrame(this.frameID);
      this.frameID = undefined;
    }

    this.running = false;
  }
  isRunning(): boolean {
    return this.running;
  }
}
