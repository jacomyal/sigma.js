/**
 * Sigma.js
 * ========
 * @module
 */
import Graph from "graphology-types";
import extend from "@yomguithereal/helpers/extend";

import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import QuadTree from "./core/quadtree";
import {
  CameraState,
  Coordinates,
  Dimensions,
  EdgeDisplayData,
  Extent,
  Listener,
  MouseCoords,
  NodeDisplayData,
  PlainObject,
  CoordinateConversionOverride,
  TypedEventEmitter,
  MouseInteraction,
} from "./types";
import {
  createElement,
  getPixelRatio,
  createNormalizationFunction,
  NormalizationFunction,
  cancelFrame,
  matrixFromCamera,
  requestFrame,
  validateGraph,
  zIndexOrdering,
  getMatrixImpact,
  graphExtent,
} from "./utils";
import { edgeLabelsToDisplayFromNodes, LabelGrid } from "./core/labels";
import { Settings, validateSettings, resolveSettings } from "./settings";
import { INodeProgram } from "./rendering/webgl/programs/common/node";
import { IEdgeProgram } from "./rendering/webgl/programs/common/edge";
import TouchCaptor, { FakeSigmaMouseEvent } from "./core/captors/touch";
import { identity, multiplyVec2 } from "./utils/matrices";
import { doEdgeCollideWithPoint, isPixelColored } from "./utils/edge-collisions";

/**
 * Constants.
 */
const X_LABEL_MARGIN = 150;
const Y_LABEL_MARGIN = 50;

/**
 * Important functions.
 */
function applyNodeDefaults(settings: Settings, key: string, data: Partial<NodeDisplayData>): NodeDisplayData {
  if (!data.hasOwnProperty("x") || !data.hasOwnProperty("y"))
    throw new Error(
      `Sigma: could not find a valid position (x, y) for node "${key}". All your nodes must have a number "x" and "y". Maybe your forgot to apply a layout or your "nodeReducer" is not returning the correct data?`,
    );

  if (!data.color) data.color = settings.defaultNodeColor;

  if (!data.label && data.label !== "") data.label = null;

  if (data.label !== undefined && data.label !== null) data.label = "" + data.label;
  else data.label = null;

  if (!data.size) data.size = 2;

  if (!data.hasOwnProperty("hidden")) data.hidden = false;

  if (!data.hasOwnProperty("highlighted")) data.highlighted = false;

  if (!data.hasOwnProperty("forceLabel")) data.forceLabel = false;

  if (!data.type || data.type === "") data.type = settings.defaultNodeType;

  if (!data.zIndex) data.zIndex = 0;

  return data as NodeDisplayData;
}

function applyEdgeDefaults(settings: Settings, key: string, data: Partial<EdgeDisplayData>): EdgeDisplayData {
  if (!data.color) data.color = settings.defaultEdgeColor;

  if (!data.label) data.label = "";

  if (!data.size) data.size = 0.5;

  if (!data.hasOwnProperty("hidden")) data.hidden = false;

  if (!data.hasOwnProperty("forceLabel")) data.forceLabel = false;

  if (!data.type || data.type === "") data.type = settings.defaultEdgeType;

  if (!data.zIndex) data.zIndex = 0;

  return data as EdgeDisplayData;
}

/**
 * Event types.
 */
export interface SigmaEventPayload {
  event: MouseCoords;
  preventSigmaDefault(): void;
}

export interface SigmaStageEventPayload extends SigmaEventPayload {}
export interface SigmaNodeEventPayload extends SigmaEventPayload {
  node: string;
}
export interface SigmaEdgeEventPayload extends SigmaEventPayload {
  edge: string;
}

export type SigmaStageEvents = {
  [E in MouseInteraction as `${E}Stage`]: (payload: SigmaStageEventPayload) => void;
};

export type SigmaNodeEvents = {
  [E in MouseInteraction as `${E}Node`]: (payload: SigmaNodeEventPayload) => void;
};

export type SigmaEdgeEvents = {
  [E in MouseInteraction as `${E}Edge`]: (payload: SigmaEdgeEventPayload) => void;
};

export type SigmaAdditionalEvents = {
  // Lifecycle events
  beforeRender(): void;
  afterRender(): void;
  resize(): void;
  kill(): void;

  // Additional node events
  enterNode(payload: SigmaNodeEventPayload): void;
  leaveNode(payload: SigmaNodeEventPayload): void;

  // Additional edge events
  enterEdge(payload: SigmaEdgeEventPayload): void;
  leaveEdge(payload: SigmaEdgeEventPayload): void;
};

export type SigmaEvents = SigmaStageEvents & SigmaNodeEvents & SigmaEdgeEvents & SigmaAdditionalEvents;

/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
export default class Sigma<GraphType extends Graph = Graph> extends TypedEventEmitter<SigmaEvents> {
  private settings: Settings;
  private graph: GraphType;
  private mouseCaptor: MouseCaptor;
  private touchCaptor: TouchCaptor;
  private container: HTMLElement;
  private elements: PlainObject<HTMLCanvasElement> = {};
  private canvasContexts: PlainObject<CanvasRenderingContext2D> = {};
  private webGLContexts: PlainObject<WebGLRenderingContext> = {};
  private activeListeners: PlainObject<Listener> = {};
  private quadtree: QuadTree = new QuadTree();
  private labelGrid: LabelGrid = new LabelGrid();
  private nodeDataCache: Record<string, NodeDisplayData> = {};
  private edgeDataCache: Record<string, EdgeDisplayData> = {};
  private nodesWithForcedLabels: string[] = [];
  private edgesWithForcedLabels: string[] = [];
  private nodeExtent: { x: Extent; y: Extent } = { x: [0, 1], y: [0, 1] };

  private matrix: Float32Array = identity();
  private invMatrix: Float32Array = identity();
  private correctionRatio = 1;
  private customBBox: { x: Extent; y: Extent } | null = null;
  private normalizationFunction: NormalizationFunction = createNormalizationFunction({
    x: [0, 1],
    y: [0, 1],
  });

  // Cache:
  private cameraSizeRatio = 1;

  // Starting dimensions and pixel ratio
  private width = 0;
  private height = 0;
  private pixelRatio = getPixelRatio();

  // State
  private displayedLabels: Set<string> = new Set();
  private highlightedNodes: Set<string> = new Set();
  private hoveredNode: string | null = null;
  private hoveredEdge: string | null = null;
  private renderFrame: number | null = null;
  private renderHighlightedNodesFrame: number | null = null;
  private needToProcess = false;
  private needToSoftProcess = false;
  private checkEdgesEventsFrame: number | null = null;

  // Programs
  private nodePrograms: { [key: string]: INodeProgram } = {};
  private nodeHoverPrograms: { [key: string]: INodeProgram } = {};
  private edgePrograms: { [key: string]: IEdgeProgram } = {};

  private camera: Camera;

  constructor(graph: GraphType, container: HTMLElement, settings: Partial<Settings> = {}) {
    super();

    // Resolving settings
    this.settings = resolveSettings(settings);

    // Validating
    validateSettings(this.settings);
    validateGraph(graph);
    if (!(container instanceof HTMLElement)) throw new Error("Sigma: container should be an html element.");

    // Properties
    this.graph = graph;
    this.container = container;

    // Initializing contexts
    this.createWebGLContext("edges", { preserveDrawingBuffer: true });
    this.createCanvasContext("edgeLabels");
    this.createWebGLContext("nodes");
    this.createCanvasContext("labels");
    this.createCanvasContext("hovers");
    this.createWebGLContext("hoverNodes");
    this.createCanvasContext("mouse");

    // Blending
    for (const key in this.webGLContexts) {
      const gl = this.webGLContexts[key];

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
    }

    // Loading programs
    for (const type in this.settings.nodeProgramClasses) {
      const NodeProgramClass = this.settings.nodeProgramClasses[type];
      this.nodePrograms[type] = new NodeProgramClass(this.webGLContexts.nodes, this);

      let NodeHoverProgram = NodeProgramClass;
      if (type in this.settings.nodeHoverProgramClasses) {
        NodeHoverProgram = this.settings.nodeHoverProgramClasses[type];
      }

      this.nodeHoverPrograms[type] = new NodeHoverProgram(this.webGLContexts.hoverNodes, this);
    }
    for (const type in this.settings.edgeProgramClasses) {
      const EdgeProgramClass = this.settings.edgeProgramClasses[type];
      this.edgePrograms[type] = new EdgeProgramClass(this.webGLContexts.edges, this);
    }

    // Initial resize
    this.resize();

    // Initializing the camera
    this.camera = new Camera();

    // Binding camera events
    this.bindCameraHandlers();

    // Initializing captors
    this.mouseCaptor = new MouseCaptor(this.elements.mouse, this);
    this.touchCaptor = new TouchCaptor(this.elements.mouse, this);

    // Binding event handlers
    this.bindEventHandlers();

    // Binding graph handlers
    this.bindGraphHandlers();

    // Trigger eventual settings-related things
    this.handleSettingsUpdate();

    // Processing data for the first time & render
    this.process();
    this.render();
  }

  /**---------------------------------------------------------------------------
   * Internal methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Internal function used to create a canvas element.
   * @param  {string} id - Context's id.
   * @return {Sigma}
   */
  private createCanvas(id: string): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = createElement<HTMLCanvasElement>(
      "canvas",
      {
        position: "absolute",
      },
      {
        class: `sigma-${id}`,
      },
    );

    this.elements[id] = canvas;
    this.container.appendChild(canvas);

    return canvas;
  }

  /**
   * Internal function used to create a canvas context and add the relevant
   * DOM elements.
   *
   * @param  {string} id - Context's id.
   * @return {Sigma}
   */
  private createCanvasContext(id: string): this {
    const canvas = this.createCanvas(id);

    const contextOptions = {
      preserveDrawingBuffer: false,
      antialias: false,
    };

    this.canvasContexts[id] = canvas.getContext("2d", contextOptions) as CanvasRenderingContext2D;

    return this;
  }

  /**
   * Internal function used to create a canvas context and add the relevant
   * DOM elements.
   *
   * @param  {string}  id      - Context's id.
   * @param  {object?} options - #getContext params to override (optional)
   * @return {Sigma}
   */
  private createWebGLContext(id: string, options?: { preserveDrawingBuffer?: boolean; antialias?: boolean }): this {
    const canvas = this.createCanvas(id);

    const contextOptions = {
      preserveDrawingBuffer: false,
      antialias: false,
      ...(options || {}),
    };

    let context;

    // First we try webgl2 for an easy performance boost
    context = canvas.getContext("webgl2", contextOptions);

    // Else we fall back to webgl
    if (!context) context = canvas.getContext("webgl", contextOptions);

    // Edge, I am looking right at you...
    if (!context) context = canvas.getContext("experimental-webgl", contextOptions);

    this.webGLContexts[id] = context as WebGLRenderingContext;

    return this;
  }

  /**
   * Method binding camera handlers.
   *
   * @return {Sigma}
   */
  private bindCameraHandlers(): this {
    this.activeListeners.camera = () => {
      this._scheduleRefresh();
    };

    this.camera.on("updated", this.activeListeners.camera);

    return this;
  }

  /**
   * Method that checks whether or not a node collides with a given position.
   */
  private mouseIsOnNode({ x, y }: Coordinates, { x: nodeX, y: nodeY }: Coordinates, size: number): boolean {
    return (
      x > nodeX - size &&
      x < nodeX + size &&
      y > nodeY - size &&
      y < nodeY + size &&
      Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)) < size
    );
  }

  /**
   * Method that returns all nodes in quad at a given position.
   */
  private getQuadNodes(position: Coordinates): string[] {
    const mouseGraphPosition = this.viewportToFramedGraph(position);

    return this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
  }

  /**
   * Method that returns the closest node to a given position.
   */
  private getNodeAtPosition(position: Coordinates): string | null {
    const { x, y } = position;
    const quadNodes = this.getQuadNodes(position);

    // We will hover the node whose center is closest to mouse
    let minDistance = Infinity,
      nodeAtPosition = null;

    for (let i = 0, l = quadNodes.length; i < l; i++) {
      const node = quadNodes[i];

      const data = this.nodeDataCache[node];

      const nodePosition = this.framedGraphToViewport(data);

      const size = this.scaleSize(data.size);

      if (!data.hidden && this.mouseIsOnNode(position, nodePosition, size)) {
        const distance = Math.sqrt(Math.pow(x - nodePosition.x, 2) + Math.pow(y - nodePosition.y, 2));

        // TODO: sort by min size also for cases where center is the same
        if (distance < minDistance) {
          minDistance = distance;
          nodeAtPosition = node;
        }
      }
    }

    return nodeAtPosition;
  }

  /**
   * Method binding event handlers.
   *
   * @return {Sigma}
   */
  private bindEventHandlers(): this {
    // Handling window resize
    this.activeListeners.handleResize = () => {
      this.needToSoftProcess = true;
      this._scheduleRefresh();
    };

    window.addEventListener("resize", this.activeListeners.handleResize);

    // Handling mouse move
    this.activeListeners.handleMove = (e: MouseCoords): void => {
      const baseEvent = {
        event: e,
        preventSigmaDefault(): void {
          e.preventSigmaDefault();
        },
      };

      const nodeToHover = this.getNodeAtPosition(e);

      if (nodeToHover && this.hoveredNode !== nodeToHover && !this.nodeDataCache[nodeToHover].hidden) {
        // Handling passing from one node to the other directly
        if (this.hoveredNode) this.emit("leaveNode", { ...baseEvent, node: this.hoveredNode });

        this.hoveredNode = nodeToHover;
        this.emit("enterNode", { ...baseEvent, node: nodeToHover });
        this.scheduleHighlightedNodesRender();
        return;
      }

      // Checking if the hovered node is still hovered
      if (this.hoveredNode) {
        const data = this.nodeDataCache[this.hoveredNode];

        const pos = this.framedGraphToViewport(data);

        const size = this.scaleSize(data.size);

        if (!this.mouseIsOnNode(e, pos, size)) {
          const node = this.hoveredNode;
          this.hoveredNode = null;

          this.emit("leaveNode", { ...baseEvent, node });
          this.scheduleHighlightedNodesRender();
          return;
        }
      }

      if (this.settings.enableEdgeHoverEvents === true) {
        this.checkEdgeHoverEvents(baseEvent);
      } else if (this.settings.enableEdgeHoverEvents === "debounce") {
        if (!this.checkEdgesEventsFrame)
          this.checkEdgesEventsFrame = requestFrame(() => {
            this.checkEdgeHoverEvents(baseEvent);
            this.checkEdgesEventsFrame = null;
          });
      }
    };

    // Handling click
    const createMouseListener = (eventType: MouseInteraction): ((e: MouseCoords) => void) => {
      return (e) => {
        const baseEvent = {
          event: e,
          preventSigmaDefault(): void {
            e.preventSigmaDefault();
          },
        };

        const isFakeSigmaMouseEvent = (e.original as FakeSigmaMouseEvent).isFakeSigmaMouseEvent;
        const nodeAtPosition = isFakeSigmaMouseEvent ? this.getNodeAtPosition(e) : this.hoveredNode;

        if (nodeAtPosition)
          return this.emit(`${eventType}Node`, {
            ...baseEvent,
            node: nodeAtPosition,
          });

        if (eventType === "wheel" ? this.settings.enableEdgeWheelEvents : this.settings.enableEdgeClickEvents) {
          const edge = this.getEdgeAtPoint(e.x, e.y);
          if (edge) return this.emit(`${eventType}Edge`, { ...baseEvent, edge });
        }

        return this.emit(`${eventType}Stage`, baseEvent);
      };
    };

    this.activeListeners.handleClick = createMouseListener("click");
    this.activeListeners.handleRightClick = createMouseListener("rightClick");
    this.activeListeners.handleDoubleClick = createMouseListener("doubleClick");
    this.activeListeners.handleWheel = createMouseListener("wheel");
    this.activeListeners.handleDown = createMouseListener("down");

    this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
    this.mouseCaptor.on("click", this.activeListeners.handleClick);
    this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
    this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
    this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
    this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);

    // TODO
    // Deal with Touch captor events

    return this;
  }

  /**
   * Method binding graph handlers
   *
   * @return {Sigma}
   */
  private bindGraphHandlers(): this {
    const graph = this.graph;

    this.activeListeners.graphUpdate = () => {
      this.needToProcess = true;
      this._scheduleRefresh();
    };

    this.activeListeners.softGraphUpdate = () => {
      this.needToSoftProcess = true;
      this._scheduleRefresh();
    };

    this.activeListeners.dropNodeGraphUpdate = (e: { key: string }): void => {
      delete this.nodeDataCache[e.key];

      if (this.hoveredNode === e.key) this.hoveredNode = null;

      this.activeListeners.graphUpdate();
    };

    this.activeListeners.dropEdgeGraphUpdate = (e: { key: string }): void => {
      delete this.edgeDataCache[e.key];

      if (this.hoveredEdge === e.key) this.hoveredEdge = null;

      this.activeListeners.graphUpdate();
    };

    this.activeListeners.clearEdgesGraphUpdate = (): void => {
      this.edgeDataCache = {};
      this.hoveredEdge = null;

      this.activeListeners.graphUpdate();
    };

    this.activeListeners.clearGraphUpdate = (): void => {
      this.nodeDataCache = {};
      this.hoveredNode = null;

      this.activeListeners.clearEdgesGraphUpdate();
    };

    graph.on("nodeAdded", this.activeListeners.graphUpdate);
    graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
    graph.on("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
    graph.on("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
    graph.on("edgeAdded", this.activeListeners.graphUpdate);
    graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
    graph.on("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
    graph.on("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
    graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
    graph.on("cleared", this.activeListeners.clearGraphUpdate);

    return this;
  }

  /**
   * Method used to unbind handlers from the graph.
   *
   * @return {undefined}
   */
  private unbindGraphHandlers() {
    const graph = this.graph;

    graph.removeListener("nodeAdded", this.activeListeners.graphUpdate);
    graph.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
    graph.removeListener("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
    graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
    graph.removeListener("edgeAdded", this.activeListeners.graphUpdate);
    graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
    graph.removeListener("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
    graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
    graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
    graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
  }

  /**
   * Method dealing with "leaveEdge" and "enterEdge" events.
   *
   * @return {Sigma}
   */
  private checkEdgeHoverEvents(payload: SigmaEventPayload): this {
    const edgeToHover = this.hoveredNode ? null : this.getEdgeAtPoint(payload.event.x, payload.event.y);

    if (edgeToHover !== this.hoveredEdge) {
      if (this.hoveredEdge) this.emit("leaveEdge", { ...payload, edge: this.hoveredEdge });
      if (edgeToHover) this.emit("enterEdge", { ...payload, edge: edgeToHover });
      this.hoveredEdge = edgeToHover;
    }

    return this;
  }

  /**
   * Method looking for an edge colliding with a given point at (x, y). Returns
   * the key of the edge if any, or null else.
   */
  private getEdgeAtPoint(x: number, y: number): string | null {
    const { edgeDataCache, nodeDataCache } = this;

    // Check first that pixel is colored:
    // Note that mouse positions must be corrected by pixel ratio to correctly
    // index the drawing buffer.
    if (!isPixelColored(this.webGLContexts.edges, x * this.pixelRatio, y * this.pixelRatio)) return null;

    // Check for each edge if it collides with the point:
    const { x: graphX, y: graphY } = this.viewportToGraph({ x, y });

    // To translate edge thicknesses to the graph system, we observe by how much
    // the length of a non-null edge is transformed to between the graph system
    // and the viewport system:
    let transformationRatio = 0;
    this.graph.someEdge((key, _, sourceId, targetId, { x: xs, y: ys }, { x: xt, y: yt }) => {
      if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden) return false;

      if (xs !== xt || ys !== yt) {
        const graphLength = Math.sqrt(Math.pow(xt - xs, 2) + Math.pow(yt - ys, 2));

        const { x: vp_xs, y: vp_ys } = this.graphToViewport({ x: xs, y: ys });
        const { x: vp_xt, y: vp_yt } = this.graphToViewport({ x: xt, y: yt });
        const viewportLength = Math.sqrt(Math.pow(vp_xt - vp_xs, 2) + Math.pow(vp_yt - vp_ys, 2));

        transformationRatio = graphLength / viewportLength;
        return true;
      }
    });
    // If no non-null edge has been found, return null:
    if (!transformationRatio) return null;

    // Now we can look for matching edges:
    const edges = this.graph.filterEdges((key, edgeAttributes, sourceId, targetId, sourcePosition, targetPosition) => {
      if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden) return false;
      if (
        doEdgeCollideWithPoint(
          graphX,
          graphY,
          sourcePosition.x,
          sourcePosition.y,
          targetPosition.x,
          targetPosition.y,
          // Adapt the edge size to the zoom ratio:
          (edgeDataCache[key].size * transformationRatio) / this.cameraSizeRatio,
        )
      ) {
        return true;
      }
    });

    if (edges.length === 0) return null; // no edges found

    // if none of the edges have a zIndex, selected the most recently created one to match the rendering order
    let selectedEdge = edges[edges.length - 1];

    // otherwise select edge with highest zIndex
    let highestZIndex = -Infinity;
    for (const edge of edges) {
      const zIndex = this.graph.getEdgeAttribute(edge, "zIndex");
      if (zIndex >= highestZIndex) {
        selectedEdge = edge;
        highestZIndex = zIndex;
      }
    }

    return selectedEdge;
  }

  /**
   * Method used to process the whole graph's data.
   *
   * @return {Sigma}
   */
  private process(keepArrays = false): this {
    const graph = this.graph;
    const settings = this.settings;
    const dimensions = this.getDimensions();

    const nodeZExtent: [number, number] = [Infinity, -Infinity];
    const edgeZExtent: [number, number] = [Infinity, -Infinity];

    // Clearing the quad
    this.quadtree.clear();

    // Resetting the label grid
    // TODO: it's probably better to do this explicitly or on resizes for layout and anims
    this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);

    // Clear the highlightedNodes
    this.highlightedNodes = new Set();

    // Computing extents
    this.nodeExtent = graphExtent(graph);

    // Resetting `forceLabel` indices
    this.nodesWithForcedLabels = [];
    this.edgesWithForcedLabels = [];

    // NOTE: it is important to compute this matrix after computing the node's extent
    // because #.getGraphDimensions relies on it
    const nullCamera = new Camera();
    const nullCameraMatrix = matrixFromCamera(
      nullCamera.getState(),
      this.getDimensions(),
      this.getGraphDimensions(),
      this.getSetting("stagePadding") || 0,
    );

    // Rescaling function
    this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);

    const nodesPerPrograms: Record<string, number> = {};

    let nodes = graph.nodes();

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      // Node display data resolution:
      //   1. First we get the node's attributes
      //   2. We optionally reduce them using the function provided by the user
      //      Note that this function must return a total object and won't be merged
      //   3. We apply our defaults, while running some vital checks
      //   4. We apply the normalization function

      // We shallow copy node data to avoid dangerous behaviors from reducers
      let attr = Object.assign({}, graph.getNodeAttributes(node));

      if (settings.nodeReducer) attr = settings.nodeReducer(node, attr);

      const data = applyNodeDefaults(this.settings, node, attr);

      nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
      this.nodeDataCache[node] = data;

      this.normalizationFunction.applyTo(data);

      if (data.forceLabel) this.nodesWithForcedLabels.push(node);

      if (this.settings.zIndex) {
        if (data.zIndex < nodeZExtent[0]) nodeZExtent[0] = data.zIndex;
        if (data.zIndex > nodeZExtent[1]) nodeZExtent[1] = data.zIndex;
      }
    }

    for (const type in this.nodePrograms) {
      if (!this.nodePrograms.hasOwnProperty(type)) {
        throw new Error(`Sigma: could not find a suitable program for node type "${type}"!`);
      }

      if (!keepArrays) this.nodePrograms[type].allocate(nodesPerPrograms[type] || 0);
      // We reset that count here, so that we can reuse it while calling the Program#process methods:
      nodesPerPrograms[type] = 0;
    }

    // Handling node z-index
    // TODO: z-index needs us to compute display data before hand
    if (this.settings.zIndex && nodeZExtent[0] !== nodeZExtent[1])
      nodes = zIndexOrdering<string>(nodeZExtent, (node: string): number => this.nodeDataCache[node].zIndex, nodes);

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];
      const data = this.nodeDataCache[node];

      this.quadtree.add(node, data.x, 1 - data.y, data.size / this.width);

      if (typeof data.label === "string" && !data.hidden)
        this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));

      const nodeProgram = this.nodePrograms[data.type];
      if (!nodeProgram) throw new Error(`Sigma: could not find a suitable program for node type "${data.type}"!`);
      nodeProgram.process(data, data.hidden, nodesPerPrograms[data.type]++);

      // Save the node in the highlighted set if needed
      if (data.highlighted && !data.hidden) this.highlightedNodes.add(node);
    }

    this.labelGrid.organize();

    const edgesPerPrograms: Record<string, number> = {};

    let edges = graph.edges();

    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];

      // Edge display data resolution:
      //   1. First we get the edge's attributes
      //   2. We optionally reduce them using the function provided by the user
      //      Note that this function must return a total object and won't be merged
      //   3. We apply our defaults, while running some vital checks

      // We shallow copy edge data to avoid dangerous behaviors from reducers
      let attr = Object.assign({}, graph.getEdgeAttributes(edge));

      if (settings.edgeReducer) attr = settings.edgeReducer(edge, attr);

      const data = applyEdgeDefaults(this.settings, edge, attr);

      edgesPerPrograms[data.type] = (edgesPerPrograms[data.type] || 0) + 1;
      this.edgeDataCache[edge] = data;

      if (data.forceLabel && !data.hidden) this.edgesWithForcedLabels.push(edge);

      if (this.settings.zIndex) {
        if (data.zIndex < edgeZExtent[0]) edgeZExtent[0] = data.zIndex;
        if (data.zIndex > edgeZExtent[1]) edgeZExtent[1] = data.zIndex;
      }
    }

    for (const type in this.edgePrograms) {
      if (!this.edgePrograms.hasOwnProperty(type)) {
        throw new Error(`Sigma: could not find a suitable program for edge type "${type}"!`);
      }

      if (!keepArrays) this.edgePrograms[type].allocate(edgesPerPrograms[type] || 0);
      // We reset that count here, so that we can reuse it while calling the Program#process methods:
      edgesPerPrograms[type] = 0;
    }

    // Handling edge z-index
    if (this.settings.zIndex && edgeZExtent[0] !== edgeZExtent[1])
      edges = zIndexOrdering(edgeZExtent, (edge: string): number => this.edgeDataCache[edge].zIndex, edges);

    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];
      const data = this.edgeDataCache[edge];

      const extremities = graph.extremities(edge),
        sourceData = this.nodeDataCache[extremities[0]],
        targetData = this.nodeDataCache[extremities[1]];

      const hidden = data.hidden || sourceData.hidden || targetData.hidden;
      this.edgePrograms[data.type].process(sourceData, targetData, data, hidden, edgesPerPrograms[data.type]++);
    }

    for (const type in this.edgePrograms) {
      const program = this.edgePrograms[type];

      if (!keepArrays && typeof program.computeIndices === "function") program.computeIndices();
    }

    return this;
  }

  /**
   * Method that backports potential settings updates where it's needed.
   * @private
   */
  private handleSettingsUpdate(): this {
    this.camera.minRatio = this.settings.minCameraRatio;
    this.camera.maxRatio = this.settings.maxCameraRatio;
    this.camera.setState(this.camera.validateState(this.camera.getState()));

    return this;
  }

  /**
   * Method that decides whether to reprocess graph or not, and then render the
   * graph.
   *
   * @return {Sigma}
   */
  private _refresh(): this {
    // Do we need to process data?
    if (this.needToProcess) {
      this.process();
    } else if (this.needToSoftProcess) {
      this.process(true);
    }

    // Resetting state
    this.needToProcess = false;
    this.needToSoftProcess = false;

    // Rendering
    this.render();

    return this;
  }

  /**
   * Method that schedules a `_refresh` call if none has been scheduled yet. It
   * will then be processed next available frame.
   *
   * @return {Sigma}
   */
  private _scheduleRefresh(): this {
    if (!this.renderFrame) {
      this.renderFrame = requestFrame(() => {
        this._refresh();
        this.renderFrame = null;
      });
    }

    return this;
  }

  /**
   * Method used to render labels.
   *
   * @return {Sigma}
   */
  private renderLabels(): this {
    if (!this.settings.renderLabels) return this;

    const cameraState = this.camera.getState();

    // Selecting labels to draw
    const labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity);
    extend(labelsToDisplay, this.nodesWithForcedLabels);

    this.displayedLabels = new Set();

    // Drawing labels
    const context = this.canvasContexts.labels;

    for (let i = 0, l = labelsToDisplay.length; i < l; i++) {
      const node = labelsToDisplay[i];
      const data = this.nodeDataCache[node];

      // If the node was already drawn (like if it is eligible AND has
      // `forceLabel`), we don't want to draw it again
      // NOTE: we can do better probably
      if (this.displayedLabels.has(node)) continue;

      // If the node is hidden, we don't need to display its label obviously
      if (data.hidden) continue;

      const { x, y } = this.framedGraphToViewport(data);

      // NOTE: we can cache the labels we need to render until the camera's ratio changes
      const size = this.scaleSize(data.size);

      // Is node big enough?
      if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold) continue;

      // Is node actually on screen (with some margin)
      // NOTE: we used to rely on the quadtree for this, but the coordinates
      // conversion make it unreliable and at that point we already converted
      // to viewport coordinates and since the label grid already culls the
      // number of potential labels to display this looks like a good
      // performance compromise.
      // NOTE: labelGrid.getLabelsToDisplay could probably optimize by not
      // considering cells obviously outside of the range of the current
      // view rectangle.
      if (
        x < -X_LABEL_MARGIN ||
        x > this.width + X_LABEL_MARGIN ||
        y < -Y_LABEL_MARGIN ||
        y > this.height + Y_LABEL_MARGIN
      )
        continue;

      // Because displayed edge labels depend directly on actually rendered node
      // labels, we need to only add to this.displayedLabels nodes whose label
      // is rendered.
      // This makes this.displayedLabels depend on viewport, which might become
      // an issue once we start memoizing getLabelsToDisplay.
      this.displayedLabels.add(node);

      this.settings.labelRenderer(
        context,
        {
          key: node,
          ...data,
          size,
          x,
          y,
        },
        this.settings,
      );
    }

    return this;
  }

  /**
   * Method used to render edge labels, based on which node labels were
   * rendered.
   *
   * @return {Sigma}
   */
  private renderEdgeLabels(): this {
    if (!this.settings.renderEdgeLabels) return this;

    const context = this.canvasContexts.edgeLabels;

    // Clearing
    context.clearRect(0, 0, this.width, this.height);

    const edgeLabelsToDisplay = edgeLabelsToDisplayFromNodes({
      graph: this.graph,
      hoveredNode: this.hoveredNode,
      displayedNodeLabels: this.displayedLabels,
      highlightedNodes: this.highlightedNodes,
    }).concat(this.edgesWithForcedLabels);
    const displayedLabels = new Set<string>();

    for (let i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
      const edge = edgeLabelsToDisplay[i],
        extremities = this.graph.extremities(edge),
        sourceData = this.nodeDataCache[extremities[0]],
        targetData = this.nodeDataCache[extremities[1]],
        edgeData = this.edgeDataCache[edge];

      // If the edge was already drawn (like if it is eligible AND has
      // `forceLabel`), we don't want to draw it again
      if (displayedLabels.has(edge)) continue;

      // If the edge is hidden we don't need to display its label
      // NOTE: the test on sourceData & targetData is probably paranoid at this point?
      if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
        continue;
      }

      this.settings.edgeLabelRenderer(
        context,
        {
          key: edge,
          ...edgeData,
          size: this.scaleSize(edgeData.size),
        },
        {
          key: extremities[0],
          ...sourceData,
          ...this.framedGraphToViewport(sourceData),
          size: this.scaleSize(sourceData.size),
        },
        {
          key: extremities[1],
          ...targetData,
          ...this.framedGraphToViewport(targetData),
          size: this.scaleSize(targetData.size),
        },
        this.settings,
      );
      displayedLabels.add(edge);
    }

    return this;
  }

  /**
   * Method used to render the highlighted nodes.
   *
   * @return {Sigma}
   */
  private renderHighlightedNodes(): void {
    const context = this.canvasContexts.hovers;

    // Clearing
    context.clearRect(0, 0, this.width, this.height);

    // Rendering
    const render = (node: string): void => {
      const data = this.nodeDataCache[node];

      const { x, y } = this.framedGraphToViewport(data);

      const size = this.scaleSize(data.size);

      this.settings.hoverRenderer(
        context,
        {
          key: node,
          ...data,
          size,
          x,
          y,
        },
        this.settings,
      );
    };

    const nodesToRender: string[] = [];

    if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
      nodesToRender.push(this.hoveredNode);
    }

    this.highlightedNodes.forEach((node) => {
      // The hovered node has already been highlighted
      if (node !== this.hoveredNode) nodesToRender.push(node);
    });

    // Draw labels:
    nodesToRender.forEach((node) => render(node));

    // Draw WebGL nodes on top of the labels:
    const nodesPerPrograms: Record<string, number> = {};

    // 1. Count nodes per type:
    nodesToRender.forEach((node) => {
      const type = this.nodeDataCache[node].type;
      nodesPerPrograms[type] = (nodesPerPrograms[type] || 0) + 1;
    });
    // 2. Allocate for each type for the proper number of nodes
    for (const type in this.nodeHoverPrograms) {
      this.nodeHoverPrograms[type].allocate(nodesPerPrograms[type] || 0);
      // Also reset count, to use when rendering:
      nodesPerPrograms[type] = 0;
    }
    // 3. Process all nodes to render:
    nodesToRender.forEach((node) => {
      const data = this.nodeDataCache[node];
      this.nodeHoverPrograms[data.type].process(data, data.hidden, nodesPerPrograms[data.type]++);
    });
    // 4. Clear hovered nodes layer:
    this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
    // 5. Render:
    for (const type in this.nodeHoverPrograms) {
      const program = this.nodeHoverPrograms[type];

      program.bind();
      program.bufferData();
      program.render({
        matrix: this.matrix,
        width: this.width,
        height: this.height,
        ratio: this.camera.ratio,
        correctionRatio: this.correctionRatio / this.camera.ratio,
        scalingRatio: this.pixelRatio,
      });
    }
  }

  /**
   * Method used to schedule a hover render.
   *
   */
  private scheduleHighlightedNodesRender(): void {
    if (this.renderHighlightedNodesFrame || this.renderFrame) return;

    this.renderHighlightedNodesFrame = requestFrame(() => {
      // Resetting state
      this.renderHighlightedNodesFrame = null;

      // Rendering
      this.renderHighlightedNodes();
      this.renderEdgeLabels();
    });
  }

  /**
   * Method used to render.
   *
   * @return {Sigma}
   */
  private render(): this {
    this.emit("beforeRender");

    const exitRender = () => {
      this.emit("afterRender");
      return this;
    };

    // If a render was scheduled, we cancel it
    if (this.renderFrame) {
      cancelFrame(this.renderFrame);
      this.renderFrame = null;
      this.needToProcess = false;
      this.needToSoftProcess = false;
    }

    // First we need to resize
    this.resize();

    // Clearing the canvases
    this.clear();

    // Recomputing useful camera-related values:
    this.updateCachedValues();

    // If we have no nodes we can stop right there
    if (!this.graph.order) return exitRender();

    // TODO: improve this heuristic or move to the captor itself?
    // TODO: deal with the touch captor here as well
    const mouseCaptor = this.mouseCaptor;
    const moving =
      this.camera.isAnimated() ||
      mouseCaptor.isMoving ||
      mouseCaptor.draggedEvents ||
      mouseCaptor.currentWheelDirection;

    // Then we need to extract a matrix from the camera
    const cameraState = this.camera.getState();
    const viewportDimensions = this.getDimensions();
    const graphDimensions = this.getGraphDimensions();
    const padding = this.getSetting("stagePadding") || 0;
    this.matrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding);
    this.invMatrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding, true);
    this.correctionRatio = getMatrixImpact(this.matrix, cameraState, viewportDimensions);

    // Drawing nodes
    for (const type in this.nodePrograms) {
      const program = this.nodePrograms[type];

      program.bind();
      program.bufferData();
      program.render({
        matrix: this.matrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        correctionRatio: this.correctionRatio / cameraState.ratio,
        scalingRatio: this.pixelRatio,
      });
    }

    // Drawing edges
    if (!this.settings.hideEdgesOnMove || !moving) {
      for (const type in this.edgePrograms) {
        const program = this.edgePrograms[type];

        program.bind();
        program.bufferData();
        program.render({
          matrix: this.matrix,
          width: this.width,
          height: this.height,
          ratio: cameraState.ratio,
          correctionRatio: this.correctionRatio / cameraState.ratio,
          scalingRatio: this.pixelRatio,
        });
      }
    }

    // Do not display labels on move per setting
    if (this.settings.hideLabelsOnMove && moving) return exitRender();

    this.renderLabels();
    this.renderEdgeLabels();
    this.renderHighlightedNodes();

    return exitRender();
  }

  /**
   * Internal method used to update expensive and therefore cached values
   * each time the camera state is updated.
   */
  private updateCachedValues(): void {
    const { ratio } = this.camera.getState();
    this.cameraSizeRatio = Math.sqrt(ratio);
  }

  /**---------------------------------------------------------------------------
   * Public API.
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the renderer's camera.
   *
   * @return {Camera}
   */
  getCamera(): Camera {
    return this.camera;
  }

  /**
   * Method returning the container DOM element.
   *
   * @return {HTMLElement}
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * Method returning the renderer's graph.
   *
   * @return {Graph}
   */
  getGraph(): GraphType {
    return this.graph;
  }

  /**
   * Method used to set the renderer's graph.
   *
   * @return {Graph}
   */
  setGraph(graph: GraphType): void {
    if (graph === this.graph) return;

    // Unbinding handlers on the current graph
    this.unbindGraphHandlers();

    // Clearing the graph data caches
    this.nodeDataCache = {};
    this.edgeDataCache = {};

    // Cleaning renderer state tied to the current graph
    this.displayedLabels.clear();
    this.highlightedNodes.clear();
    this.hoveredNode = null;
    this.hoveredEdge = null;
    this.nodesWithForcedLabels.length = 0;
    this.edgesWithForcedLabels.length = 0;

    if (this.checkEdgesEventsFrame !== null) {
      cancelFrame(this.checkEdgesEventsFrame);
      this.checkEdgesEventsFrame = null;
    }

    // Installing new graph
    this.graph = graph;

    // Binding new handlers
    this.bindGraphHandlers();

    // Re-rendering now to avoid discrepancies from now to next frame
    this.process();
    this.render();
  }

  /**
   * Method returning the mouse captor.
   *
   * @return {MouseCaptor}
   */
  getMouseCaptor(): MouseCaptor {
    return this.mouseCaptor;
  }

  /**
   * Method returning the touch captor.
   *
   * @return {TouchCaptor}
   */
  getTouchCaptor(): TouchCaptor {
    return this.touchCaptor;
  }

  /**
   * Method returning the current renderer's dimensions.
   *
   * @return {Dimensions}
   */
  getDimensions(): Dimensions {
    return { width: this.width, height: this.height };
  }

  /**
   * Method returning the current graph's dimensions.
   *
   * @return {Dimensions}
   */
  getGraphDimensions(): Dimensions {
    const extent = this.customBBox || this.nodeExtent;

    return {
      width: extent.x[1] - extent.x[0] || 1,
      height: extent.y[1] - extent.y[0] || 1,
    };
  }

  /**
   * Method used to get all the sigma node attributes.
   * It's usefull for example to get the position of a node
   * and to get values that are set by the nodeReducer
   *
   * @param  {string} key - The node's key.
   * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
   */
  getNodeDisplayData(key: unknown): NodeDisplayData | undefined {
    const node = this.nodeDataCache[key as string];
    return node ? Object.assign({}, node) : undefined;
  }

  /**
   * Method used to get all the sigma edge attributes.
   * It's usefull for example to get values that are set by the edgeReducer.
   *
   * @param  {string} key - The edge's key.
   * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
   */
  getEdgeDisplayData(key: unknown): EdgeDisplayData | undefined {
    const edge = this.edgeDataCache[key as string];
    return edge ? Object.assign({}, edge) : undefined;
  }

  /**
   * Method returning a copy of the settings collection.
   *
   * @return {Settings} A copy of the settings collection.
   */
  getSettings(): Settings {
    return { ...this.settings };
  }

  /**
   * Method returning the current value for a given setting key.
   *
   * @param  {string} key - The setting key to get.
   * @return {any} The value attached to this setting key or undefined if not found
   */
  getSetting<K extends keyof Settings>(key: K): Settings[K] | undefined {
    return this.settings[key];
  }

  /**
   * Method setting the value of a given setting key. Note that this will schedule
   * a new render next frame.
   *
   * @param  {string} key - The setting key to set.
   * @param  {any}    value - The value to set.
   * @return {Sigma}
   */
  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): this {
    this.settings[key] = value;
    validateSettings(this.settings);
    this.handleSettingsUpdate();
    this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
    this._scheduleRefresh();
    return this;
  }

  /**
   * Method updating the value of a given setting key using the provided function.
   * Note that this will schedule a new render next frame.
   *
   * @param  {string}   key     - The setting key to set.
   * @param  {function} updater - The update function.
   * @return {Sigma}
   */
  updateSetting<K extends keyof Settings>(key: K, updater: (value: Settings[K]) => Settings[K]): this {
    this.settings[key] = updater(this.settings[key]);
    validateSettings(this.settings);
    this.handleSettingsUpdate();
    this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
    this._scheduleRefresh();
    return this;
  }

  /**
   * Method used to resize the renderer.
   *
   * @return {Sigma}
   */
  resize(): this {
    const previousWidth = this.width,
      previousHeight = this.height;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.pixelRatio = getPixelRatio();

    if (this.width === 0) {
      if (this.settings.allowInvalidContainer) this.width = 1;
      else
        throw new Error(
          "Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.",
        );
    }

    if (this.height === 0) {
      if (this.settings.allowInvalidContainer) this.height = 1;
      else
        throw new Error(
          "Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.",
        );
    }

    // If nothing has changed, we can stop right here
    if (previousWidth === this.width && previousHeight === this.height) return this;

    this.emit("resize");

    // Sizing dom elements
    for (const id in this.elements) {
      const element = this.elements[id];

      element.style.width = this.width + "px";
      element.style.height = this.height + "px";
    }

    // Sizing canvas contexts
    for (const id in this.canvasContexts) {
      this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
      this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");

      if (this.pixelRatio !== 1) this.canvasContexts[id].scale(this.pixelRatio, this.pixelRatio);
    }

    // Sizing WebGL contexts
    for (const id in this.webGLContexts) {
      this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
      this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");

      this.webGLContexts[id].viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
    }

    return this;
  }

  /**
   * Method used to clear all the canvases.
   *
   * @return {Sigma}
   */
  clear(): this {
    this.webGLContexts.nodes.clear(this.webGLContexts.nodes.COLOR_BUFFER_BIT);
    this.webGLContexts.edges.clear(this.webGLContexts.edges.COLOR_BUFFER_BIT);
    this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
    this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
    this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
    this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);

    return this;
  }

  /**
   * Method used to refresh all computed data.
   *
   * @return {Sigma}
   */
  refresh(): this {
    this.needToProcess = true;
    this._refresh();

    return this;
  }

  /**
   * Method used to refresh all computed data, at the next available frame.
   * If this method has already been called this frame, then it will only render once at the next available frame.
   *
   * @return {Sigma}
   */
  scheduleRefresh(): this {
    this.needToProcess = true;
    this._scheduleRefresh();

    return this;
  }

  /**
   * Method used to (un)zoom, while preserving the position of a viewport point.
   * Used for instance to zoom "on the mouse cursor".
   *
   * @param viewportTarget
   * @param newRatio
   * @return {CameraState}
   */
  getViewportZoomedState(viewportTarget: Coordinates, newRatio: number): CameraState {
    const { ratio, angle, x, y } = this.camera.getState();

    // TODO: handle max zoom
    const ratioDiff = newRatio / ratio;

    const center = {
      x: this.width / 2,
      y: this.height / 2,
    };

    const graphMousePosition = this.viewportToFramedGraph(viewportTarget);
    const graphCenterPosition = this.viewportToFramedGraph(center);

    return {
      angle,
      x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
      y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
      ratio: newRatio,
    };
  }

  /**
   * Method returning the abstract rectangle containing the graph according
   * to the camera's state.
   *
   * @return {object} - The view's rectangle.
   */
  viewRectangle(): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    height: number;
  } {
    // TODO: reduce relative margin?
    const marginX = (0 * this.width) / 8,
      marginY = (0 * this.height) / 8;

    const p1 = this.viewportToFramedGraph({ x: 0 - marginX, y: 0 - marginY }),
      p2 = this.viewportToFramedGraph({ x: this.width + marginX, y: 0 - marginY }),
      h = this.viewportToFramedGraph({ x: 0, y: this.height + marginY });

    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      height: p2.y - h.y,
    };
  }

  /**
   * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
   * overriding anything that is used to get the translation matrix, or even the matrix itself.
   *
   * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
   * of computations.
   */
  framedGraphToViewport(coordinates: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    const recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
    const matrix = override.matrix
      ? override.matrix
      : recomputeMatrix
      ? matrixFromCamera(
          override.cameraState || this.camera.getState(),
          override.viewportDimensions || this.getDimensions(),
          override.graphDimensions || this.getGraphDimensions(),
          override.padding || this.getSetting("stagePadding") || 0,
        )
      : this.matrix;

    const viewportPos = multiplyVec2(matrix, coordinates);

    return {
      x: ((1 + viewportPos.x) * this.width) / 2,
      y: ((1 - viewportPos.y) * this.height) / 2,
    };
  }

  /**
   * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
   * overriding anything that is used to get the translation matrix, or even the matrix itself.
   *
   * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
   * of computations.
   */
  viewportToFramedGraph(coordinates: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    const recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
    const invMatrix = override.matrix
      ? override.matrix
      : recomputeMatrix
      ? matrixFromCamera(
          override.cameraState || this.camera.getState(),
          override.viewportDimensions || this.getDimensions(),
          override.graphDimensions || this.getGraphDimensions(),
          override.padding || this.getSetting("stagePadding") || 0,
          true,
        )
      : this.invMatrix;

    const res = multiplyVec2(invMatrix, {
      x: (coordinates.x / this.width) * 2 - 1,
      y: 1 - (coordinates.y / this.height) * 2,
    });

    if (isNaN(res.x)) res.x = 0;
    if (isNaN(res.y)) res.y = 0;

    return res;
  }

  /**
   * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
   * stage) to the graph system (the reference system of data as they are in the given graph instance).
   *
   * This method accepts an optional camera which can be useful if you need to translate coordinates
   * based on a different view than the one being currently being displayed on screen.
   *
   * @param {Coordinates}                  viewportPoint
   * @param {CoordinateConversionOverride} override
   */
  viewportToGraph(viewportPoint: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
  }

  /**
   * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
   * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
   *
   * This method accepts an optional camera which can be useful if you need to translate coordinates
   * based on a different view than the one being currently being displayed on screen.
   *
   * @param {Coordinates}                  graphPoint
   * @param {CoordinateConversionOverride} override
   */
  graphToViewport(graphPoint: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
  }

  /**
   * Method returning the graph's bounding box.
   *
   * @return {{ x: Extent, y: Extent }}
   */
  getBBox(): { x: Extent; y: Extent } {
    return graphExtent(this.graph);
  }

  /**
   * Method returning the graph's custom bounding box, if any.
   *
   * @return {{ x: Extent, y: Extent } | null}
   */
  getCustomBBox(): { x: Extent; y: Extent } | null {
    return this.customBBox;
  }

  /**
   * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
   *
   * @return {Sigma}
   */
  setCustomBBox(customBBox: { x: Extent; y: Extent } | null): this {
    this.customBBox = customBBox;
    this._scheduleRefresh();
    return this;
  }

  /**
   * Method used to shut the container & release event listeners.
   *
   * @return {undefined}
   */
  kill(): void {
    // Emitting "kill" events so that plugins and such can cleanup
    this.emit("kill");

    // Releasing events
    this.removeAllListeners();

    // Releasing camera handlers
    this.camera.removeListener("updated", this.activeListeners.camera);

    // Releasing DOM events & captors
    window.removeEventListener("resize", this.activeListeners.handleResize);
    this.mouseCaptor.kill();
    this.touchCaptor.kill();

    // Releasing graph handlers
    this.unbindGraphHandlers();

    // Releasing cache & state
    this.quadtree = new QuadTree();
    this.nodeDataCache = {};
    this.edgeDataCache = {};
    this.nodesWithForcedLabels = [];
    this.edgesWithForcedLabels = [];

    this.highlightedNodes.clear();

    // Clearing frames
    if (this.renderFrame) {
      cancelFrame(this.renderFrame);
      this.renderFrame = null;
    }

    if (this.renderHighlightedNodesFrame) {
      cancelFrame(this.renderHighlightedNodesFrame);
      this.renderHighlightedNodesFrame = null;
    }

    // Destroying canvases
    const container = this.container;

    while (container.firstChild) container.removeChild(container.firstChild);
  }

  /**
   * Method used to scale the given size according to the camera's ratio, i.e.
   * zooming state.
   *
   * @param  {number} size - The size to scale (node size, edge thickness etc.).
   * @return {number}      - The scaled size.
   */
  scaleSize(size: number): number {
    return size / this.cameraSizeRatio;
  }

  /**
   * Method that returns the collection of all used canvases.
   * At the moment, the instantiated canvases are the following, and in the
   * following order in the DOM:
   * - `edges`
   * - `nodes`
   * - `edgeLabels`
   * - `labels`
   * - `hovers`
   * - `hoverNodes`
   * - `mouse`
   *
   * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
   */
  getCanvases(): PlainObject<HTMLCanvasElement> {
    return { ...this.elements };
  }
}
