/**
 * Sigma.js
 * ========
 * @module
 */
import Graph from "graphology-types";

import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
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
  RenderParams,
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
  colorToIndex,
} from "./utils";
import { edgeLabelsToDisplayFromNodes, LabelGrid } from "./core/labels";
import { Settings, validateSettings, resolveSettings } from "./settings";
import { AbstractNodeProgram } from "./rendering/node";
import { AbstractEdgeProgram } from "./rendering/edge";
import TouchCaptor, { FakeSigmaMouseEvent } from "./core/captors/touch";
import { identity, multiplyVec2 } from "./utils/matrices";
import { extend } from "./utils/array";
import { getPixelColor } from "./utils/picking";

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

function applyEdgeDefaults(settings: Settings, _key: string, data: Partial<EdgeDisplayData>): EdgeDisplayData {
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
  private pickingLayers: Set<string> = new Set();
  private textures: PlainObject<WebGLTexture> = {};
  private frameBuffers: PlainObject<WebGLFramebuffer> = {};
  private activeListeners: PlainObject<Listener> = {};
  private labelGrid: LabelGrid = new LabelGrid();
  private nodeDataCache: Record<string, NodeDisplayData> = {};
  private edgeDataCache: Record<string, EdgeDisplayData> = {};

  // Indices to keep track of the index of the item inside programs
  private nodeProgramIndex: Record<string, number> = {};
  private edgeProgramIndex: Record<string, number> = {};
  private nodesWithForcedLabels: Set<string> = new Set<string>();
  private edgesWithForcedLabels: Set<string> = new Set<string>();
  private nodeExtent: { x: Extent; y: Extent } = { x: [0, 1], y: [0, 1] };
  private nodeZExtent: [number, number] = [Infinity, -Infinity];
  private edgeZExtent: [number, number] = [Infinity, -Infinity];

  private matrix: Float32Array = identity();
  private invMatrix: Float32Array = identity();
  private correctionRatio = 1;
  private customBBox: { x: Extent; y: Extent } | null = null;
  private normalizationFunction: NormalizationFunction = createNormalizationFunction({
    x: [0, 1],
    y: [0, 1],
  });

  // Cache:
  private graphToViewportRatio = 1;
  private itemIDsIndex: Record<number, { type: "node" | "edge"; id: string }> = {};
  private nodeIndices: Record<string, number> = {};
  private edgeIndices: Record<string, number> = {};

  // Starting dimensions and pixel ratio
  private width = 0;
  private height = 0;
  private pixelRatio = getPixelRatio();
  private pickingDownSizingRatio = 2 * this.pixelRatio;

  // Graph State
  private displayedNodeLabels: Set<string> = new Set();
  private displayedEdgeLabels: Set<string> = new Set();
  private highlightedNodes: Set<string> = new Set();
  private hoveredNode: string | null = null;
  private hoveredEdge: string | null = null;

  // Internal states
  private renderFrame: number | null = null;
  private renderHighlightedNodesFrame: number | null = null;
  private needToProcess = false;
  private checkEdgesEventsFrame: number | null = null;

  // Programs
  private nodePrograms: { [key: string]: AbstractNodeProgram } = {};
  private nodeHoverPrograms: { [key: string]: AbstractNodeProgram } = {};
  private edgePrograms: { [key: string]: AbstractEdgeProgram } = {};

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
    this.createWebGLContext("edges", { picking: settings.enableEdgeEvents });
    this.createCanvasContext("edgeLabels");
    this.createWebGLContext("nodes", { picking: true });
    this.createCanvasContext("labels");
    this.createCanvasContext("hovers");
    this.createWebGLContext("hoverNodes");
    this.createCanvasContext("mouse");

    // Initial resize
    this.resize();

    // Loading programs
    for (const type in this.settings.nodeProgramClasses) {
      const NodeProgramClass = this.settings.nodeProgramClasses[type];
      this.nodePrograms[type] = new NodeProgramClass(this.webGLContexts.nodes, this.frameBuffers.nodes, this);

      let NodeHoverProgram = NodeProgramClass;
      if (type in this.settings.nodeHoverProgramClasses) {
        NodeHoverProgram = this.settings.nodeHoverProgramClasses[type];
      }

      this.nodeHoverPrograms[type] = new NodeHoverProgram(this.webGLContexts.hoverNodes, null, this);
    }

    for (const type in this.settings.edgeProgramClasses) {
      const EdgeProgramClass = this.settings.edgeProgramClasses[type];
      this.edgePrograms[type] = new EdgeProgramClass(this.webGLContexts.edges, this.frameBuffers.edges, this);
    }

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
    this.refresh();
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
   * Internal function used to create a WebGL context and add the relevant DOM
   * elements.
   *
   * @param  {string}  id      - Context's id.
   * @param  {object?} options - #getContext params to override (optional)
   * @return {Sigma}
   */
  private createWebGLContext(
    id: string,
    options?: { preserveDrawingBuffer?: boolean; antialias?: boolean; hidden?: boolean; picking?: boolean },
  ): this {
    const canvas = this.createCanvas(id);
    if (options?.hidden) canvas.remove();

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

    const gl = context as WebGLRenderingContext;
    this.webGLContexts[id] = gl;

    // Blending:
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Prepare frame buffer for picking layers:
    if (options?.picking) {
      this.pickingLayers.add(id);
      const newFrameBuffer = gl.createFramebuffer();
      if (!newFrameBuffer) throw new Error(`Sigma: cannot create a new frame buffer for layer ${id}`);
      this.frameBuffers[id] = newFrameBuffer;
    }

    return this;
  }

  /**
   * Method (re)binding WebGL texture (for picking).
   *
   * @return {Sigma}
   */
  private resetWebGLTexture(id: string): this {
    const gl = this.webGLContexts[id] as WebGLRenderingContext;

    const frameBuffer = this.frameBuffers[id];
    const currentTexture = this.textures[id];
    if (currentTexture) gl.deleteTexture(currentTexture);

    const pickingTexture = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);

    this.textures[id] = pickingTexture as WebGLTexture;

    return this;
  }

  /**
   * Method binding camera handlers.
   *
   * @return {Sigma}
   */
  private bindCameraHandlers(): this {
    this.activeListeners.camera = () => {
      this.scheduleRender();
    };

    this.camera.on("updated", this.activeListeners.camera);

    return this;
  }

  /**
   * Method unbinding camera handlers.
   *
   * @return {Sigma}
   */
  private unbindCameraHandlers(): this {
    this.camera.removeListener("updated", this.activeListeners.camera);
    return this;
  }

  /**
   * Method that returns the closest node to a given position.
   */
  private getNodeAtPosition(position: Coordinates): string | null {
    const { x, y } = position;
    const color = getPixelColor(
      this.webGLContexts.nodes,
      this.frameBuffers.nodes,
      x,
      y,
      this.pixelRatio,
      this.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    const itemAt = this.itemIDsIndex[index];

    return itemAt && itemAt.type === "node" ? itemAt.id : null;
  }

  /**
   * Method binding event handlers.
   *
   * @return {Sigma}
   */
  private bindEventHandlers(): this {
    // Handling window resize
    this.activeListeners.handleResize = () => {
      // need to call a refresh to rebuild the labelgrid
      this.scheduleRefresh();
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
        if (this.getNodeAtPosition(e) !== this.hoveredNode) {
          const node = this.hoveredNode;
          this.hoveredNode = null;

          this.emit("leaveNode", { ...baseEvent, node });
          this.scheduleHighlightedNodesRender();
          return;
        }
      }

      if (this.settings.enableEdgeEvents) {
        this.checkEdgeHoverEvents(baseEvent);
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

        if (this.settings.enableEdgeEvents) {
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

    const LAYOUT_IMPACTING_FIELDS = new Set(["x", "y", "zIndex", "type"]);
    this.activeListeners.eachNodeAttributesUpdatedGraphUpdate = (e: { hints?: { attributes?: string[] } }) => {
      const updatedFields = e.hints?.attributes;
      // we process all nodes
      this.graph.forEachNode((node) => this.updateNode(node));

      // if coord, type or zIndex have changed, we need to schedule a render
      // (zIndex for the programIndex)
      const layoutChanged = !updatedFields || updatedFields.some((f) => LAYOUT_IMPACTING_FIELDS.has(f));
      this.refresh({ partialGraph: { nodes: graph.nodes() }, skipIndexation: !layoutChanged, schedule: true });
    };

    this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate = (e: { hints?: { attributes?: string[] } }) => {
      const updatedFields = e.hints?.attributes;
      // we process all edges
      this.graph.forEachEdge((edge) => this.updateEdge(edge));
      const layoutChanged = updatedFields && ["zIndex", "type"].some((f) => updatedFields?.includes(f));
      this.refresh({ partialGraph: { edges: graph.edges() }, skipIndexation: !layoutChanged, schedule: true });
    };

    // On add node, we add the node in indices and then call for a render
    this.activeListeners.addNodeGraphUpdate = (payload: { key: string }): void => {
      const node = payload.key;
      // we process the node
      this.addNode(node);
      // schedule a render for the node
      this.refresh({ partialGraph: { nodes: [node] }, skipIndexation: false, schedule: true });
    };

    // On update node, we update indices and then call for a render
    this.activeListeners.updateNodeGraphUpdate = (payload: { key: string }): void => {
      const node = payload.key;
      // schedule a render for the node
      this.refresh({ partialGraph: { nodes: [node] }, skipIndexation: false, schedule: true });
    };

    // On drop node, we remove the node from indices and then call for a refresh
    this.activeListeners.dropNodeGraphUpdate = (payload: { key: string }): void => {
      const node = payload.key;
      // we process the node
      this.removeNode(node);
      // schedule a render for everything
      this.refresh({ schedule: true });
    };

    // On add edge, we remove the edge from indices and then call for a refresh
    this.activeListeners.addEdgeGraphUpdate = (payload: { key: string }): void => {
      const edge = payload.key;
      // we process the edge
      this.addEdge(edge);
      // schedule a render for the edge
      this.refresh({ partialGraph: { edges: [edge] }, schedule: true });
    };

    // On update edge, we update indices and then call for a refresh
    this.activeListeners.updateEdgeGraphUpdate = (payload: { key: string }): void => {
      const edge = payload.key;
      // schedule a repaint for the edge
      this.refresh({ partialGraph: { edges: [edge] }, skipIndexation: false, schedule: true });
    };

    // On drop edge, we remove the edge from indices and then call for a refresh
    this.activeListeners.dropEdgeGraphUpdate = (payload: { key: string }): void => {
      const edge = payload.key;
      // we process the edge
      this.removeEdge(edge);
      // schedule a render for all edges
      this.refresh({ schedule: true });
    };

    // On clear edges, we clear the edge indices and then call for a refresh
    this.activeListeners.clearEdgesGraphUpdate = (): void => {
      // we clear the edge data structures
      this.clearEdgeState();
      this.clearEdgeIndices();
      // schedule a render for all edges
      this.refresh({ schedule: true });
    };

    // On graph clear, we clear indices and then call for a refresh
    this.activeListeners.clearGraphUpdate = (): void => {
      // clear graph state
      this.clearEdgeState();
      this.clearNodeState();

      // clear graph indices
      this.clearEdgeIndices();
      this.clearNodeIndices();

      // schedule a render for all
      this.refresh({ schedule: true });
    };

    graph.on("nodeAdded", this.activeListeners.addNodeGraphUpdate);
    graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
    graph.on("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
    graph.on("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
    graph.on("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
    graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
    graph.on("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
    graph.on("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
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

    graph.removeListener("nodeAdded", this.activeListeners.addNodeGraphUpdate);
    graph.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
    graph.removeListener("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
    graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
    graph.removeListener("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
    graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
    graph.removeListener("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
    graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
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
    const color = getPixelColor(
      this.webGLContexts.edges,
      this.frameBuffers.edges,
      x,
      y,
      this.pixelRatio,
      this.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    const itemAt = this.itemIDsIndex[index];

    return itemAt && itemAt.type === "edge" ? itemAt.id : null;
  }

  /**
   * Method used to process the whole graph's data.
   *  - extent
   *  - normalizationFunction
   *  - compute node's coordinate
   *  - labelgrid
   *  - program data allocation
   * @return {Sigma}
   */
  private process(): this {
    const graph = this.graph;
    const settings = this.settings;
    const dimensions = this.getDimensions();

    //
    // NODES
    //
    this.nodeExtent = graphExtent(this.graph);
    this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);

    // NOTE: it is important to compute this matrix after computing the node's extent
    // because #.getGraphDimensions relies on it
    const nullCamera = new Camera();
    const nullCameraMatrix = matrixFromCamera(
      nullCamera.getState(),
      dimensions,
      this.getGraphDimensions(),
      this.getSetting("stagePadding") || 0,
    );
    // Resetting the label grid
    // TODO: it's probably better to do this explicitly or on resizes for layout and anims
    this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);

    const nodesPerPrograms: Record<string, number> = {};
    const nodeIndices: typeof this.nodeIndices = {};
    const edgeIndices: typeof this.edgeIndices = {};
    const itemIDsIndex: typeof this.itemIDsIndex = {};
    let incrID = 1;

    let nodes = graph.nodes();

    // Do some indexation on the whole graph
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];
      const data = this.nodeDataCache[node];

      // Get initial coordinates
      const attrs = graph.getNodeAttributes(node);
      data.x = attrs.x;
      data.y = attrs.y;
      this.normalizationFunction.applyTo(data);

      // labelgrid
      if (typeof data.label === "string" && !data.hidden)
        this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));

      // update count per program
      nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
    }
    this.labelGrid.organize();

    // Allocate memory to programs
    for (const type in this.nodePrograms) {
      if (!this.nodePrograms.hasOwnProperty(type)) {
        throw new Error(`Sigma: could not find a suitable program for node type "${type}"!`);
      }
      this.nodePrograms[type].reallocate(nodesPerPrograms[type] || 0);
      // We reset that count here, so that we can reuse it while calling the Program#process methods:
      nodesPerPrograms[type] = 0;
    }

    // Order nodes by zIndex before to add them to program
    if (this.settings.zIndex && this.nodeZExtent[0] !== this.nodeZExtent[1])
      nodes = zIndexOrdering<string>(
        this.nodeZExtent,
        (node: string): number => this.nodeDataCache[node].zIndex,
        nodes,
      );

    // Add data to programs
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      nodeIndices[node] = incrID;
      itemIDsIndex[nodeIndices[node]] = { type: "node", id: node };
      incrID++;

      const data = this.nodeDataCache[node];
      this.addNodeToProgram(node, nodeIndices[node], nodesPerPrograms[data.type]++);
    }

    //
    // EDGES
    //

    const edgesPerPrograms: Record<string, number> = {};
    let edges = graph.edges();

    // Allocate memory to programs
    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];
      const data = this.edgeDataCache[edge];
      edgesPerPrograms[data.type] = (edgesPerPrograms[data.type] || 0) + 1;
    }

    // Order edges by zIndex before to add them to program
    if (this.settings.zIndex && this.edgeZExtent[0] !== this.edgeZExtent[1])
      edges = zIndexOrdering<string>(
        this.edgeZExtent,
        (edge: string): number => this.edgeDataCache[edge].zIndex,
        edges,
      );

    for (const type in this.edgePrograms) {
      if (!this.edgePrograms.hasOwnProperty(type)) {
        throw new Error(`Sigma: could not find a suitable program for edge type "${type}"!`);
      }
      this.edgePrograms[type].reallocate(edgesPerPrograms[type] || 0);
      // We reset that count here, so that we can reuse it while calling the Program#process methods:
      edgesPerPrograms[type] = 0;
    }

    // Add data to programs
    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];

      edgeIndices[edge] = incrID;
      itemIDsIndex[edgeIndices[edge]] = { type: "edge", id: edge };
      incrID++;

      const data = this.edgeDataCache[edge];
      this.addEdgeToProgram(edge, edgeIndices[edge], edgesPerPrograms[data.type]++);
    }

    this.itemIDsIndex = itemIDsIndex;
    this.nodeIndices = nodeIndices;
    this.edgeIndices = edgeIndices;

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

    this.displayedNodeLabels = new Set();

    // Drawing labels
    const context = this.canvasContexts.labels;

    for (let i = 0, l = labelsToDisplay.length; i < l; i++) {
      const node = labelsToDisplay[i];
      const data = this.nodeDataCache[node];

      // If the node was already drawn (like if it is eligible AND has
      // `forceLabel`), we don't want to draw it again
      // NOTE: we can do better probably
      if (this.displayedNodeLabels.has(node)) continue;

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
      // labels, we need to only add to this.displayedNodeLabels nodes whose label
      // is rendered.
      // This makes this.displayedNodeLabels depend on viewport, which might become
      // an issue once we start memoizing getLabelsToDisplay.
      this.displayedNodeLabels.add(node);

      const { nodeProgramClasses, defaultDrawNodeLabel } = this.settings;
      const drawLabel = nodeProgramClasses[data.type].drawLabel || defaultDrawNodeLabel;
      drawLabel(
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
      displayedNodeLabels: this.displayedNodeLabels,
      highlightedNodes: this.highlightedNodes,
    });
    extend(edgeLabelsToDisplay, this.edgesWithForcedLabels);

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

      const { edgeProgramClasses, defaultDrawEdgeLabel } = this.settings;
      const drawLabel = edgeProgramClasses[edgeData.type].drawLabel || defaultDrawEdgeLabel;
      drawLabel(
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

    this.displayedEdgeLabels = displayedLabels;

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

      const { nodeProgramClasses, defaultDrawNodeHover } = this.settings;
      const drawHover = nodeProgramClasses[data.type].drawHover || defaultDrawNodeHover;
      drawHover(
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
      this.nodeHoverPrograms[type].reallocate(nodesPerPrograms[type] || 0);
      // Also reset count, to use when rendering:
      nodesPerPrograms[type] = 0;
    }
    // 3. Process all nodes to render:
    nodesToRender.forEach((node) => {
      const data = this.nodeDataCache[node];
      this.nodeHoverPrograms[data.type].process(0, nodesPerPrograms[data.type]++, data);
    });
    // 4. Clear hovered nodes layer:
    this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
    // 5. Render:
    for (const type in this.nodeHoverPrograms) {
      const program = this.nodeHoverPrograms[type];

      program.render({
        matrix: this.matrix,
        width: this.width,
        height: this.height,
        pixelRatio: this.pixelRatio,
        cameraAngle: this.camera.angle,
        zoomRatio: this.camera.ratio,
        sizeRatio: 1 / this.scaleSize(),
        correctionRatio: this.correctionRatio,
        downSizingRatio: this.pickingDownSizingRatio,
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
    }

    // First we need to resize
    this.resize();

    // Do we need to reprocess data?
    if (this.needToProcess) this.process();
    this.needToProcess = false;

    // Clearing the canvases
    this.clear();

    // Prepare the textures
    this.pickingLayers.forEach((layer) => this.resetWebGLTexture(layer));

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
    this.graphToViewportRatio = this.getGraphToViewportRatio();

    // [jacomyal]
    // This comment is related to the one above the `getMatrixImpact` definition:
    // - `this.correctionRatio` is somehow not completely explained
    // - `this.graphToViewportRatio` is the ratio of a distance in the viewport divided by the same distance in the
    //   graph
    // - `this.normalizationFunction.ratio` is basically `Math.max(graphDX, graphDY)`
    // And now, I observe that if I multiply these three ratios, I have something constant, which value remains 2, even
    // when I change the graph, the viewport or the camera. It might be useful later so I prefer to let this comment:
    // console.log(this.graphToViewportRatio * this.correctionRatio * this.normalizationFunction.ratio * 2);

    const params: RenderParams = {
      matrix: this.matrix,
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
      zoomRatio: this.camera.ratio,
      cameraAngle: this.camera.angle,
      sizeRatio: 1 / this.scaleSize(),
      correctionRatio: this.correctionRatio,
      downSizingRatio: this.pickingDownSizingRatio,
    };

    // Drawing nodes
    for (const type in this.nodePrograms) {
      const program = this.nodePrograms[type];
      program.render(params);
    }

    // Drawing edges
    if (!this.settings.hideEdgesOnMove || !moving) {
      for (const type in this.edgePrograms) {
        const program = this.edgePrograms[type];
        program.render(params);
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
   * Add a node in the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private addNode(key: string): void {
    // Node display data resolution:
    //  1. First we get the node's attributes
    //  2. We optionally reduce them using the function provided by the user
    //     Note that this function must return a total object and won't be merged
    //  3. We apply our defaults, while running some vital checks
    //  4. We apply the normalization function
    // We shallow copy node data to avoid dangerous behaviors from reducers
    let attr = Object.assign({}, this.graph.getNodeAttributes(key));
    if (this.settings.nodeReducer) attr = this.settings.nodeReducer(key, attr);
    const data = applyNodeDefaults(this.settings, key, attr);
    this.nodeDataCache[key] = data;

    // Label:
    // We delete and add if needed because this function is also used from
    // update
    this.nodesWithForcedLabels.delete(key);
    if (data.forceLabel && !data.hidden) this.nodesWithForcedLabels.add(key);

    // Highlighted:
    // We remove and re add if needed because this function is also used from
    // update
    this.highlightedNodes.delete(key);
    if (data.highlighted && !data.hidden) this.highlightedNodes.add(key);

    // zIndex
    if (this.settings.zIndex) {
      if (data.zIndex < this.nodeZExtent[0]) this.nodeZExtent[0] = data.zIndex;
      if (data.zIndex > this.nodeZExtent[1]) this.nodeZExtent[1] = data.zIndex;
    }
  }

  /**
   * Update a node the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private updateNode(key: string): void {
    this.addNode(key);

    // Re-apply normalization on the node
    const data = this.nodeDataCache[key];
    this.normalizationFunction.applyTo(data);
  }

  /**
   * Remove a node from the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private removeNode(key: string): void {
    // Remove from node cache
    delete this.nodeDataCache[key];
    // Remove from node program index
    delete this.nodeProgramIndex[key];
    // Remove from higlighted nodes
    this.highlightedNodes.delete(key);
    // Remove from hovered
    if (this.hoveredNode === key) this.hoveredNode = null;
    // Remove from forced label
    this.nodesWithForcedLabels.delete(key);
  }

  /**
   * Add an edge into the internal data structures.
   * @private
   * @param key The edge's graphology ID
   */
  private addEdge(key: string): void {
    // Edge display data resolution:
    //  1. First we get the edge's attributes
    //  2. We optionally reduce them using the function provided by the user
    //  3. Note that this function must return a total object and won't be merged
    //  4. We apply our defaults, while running some vital checks
    // We shallow copy edge data to avoid dangerous behaviors from reducers
    let attr = Object.assign({}, this.graph.getEdgeAttributes(key));
    if (this.settings.edgeReducer) attr = this.settings.edgeReducer(key, attr);
    const data = applyEdgeDefaults(this.settings, key, attr);
    this.edgeDataCache[key] = data;

    // Forced label
    // we filter and re push if needed because this function is also used from
    // update
    this.edgesWithForcedLabels.delete(key);
    if (data.forceLabel && !data.hidden) this.edgesWithForcedLabels.add(key);

    // Check zIndex
    if (this.settings.zIndex) {
      if (data.zIndex < this.edgeZExtent[0]) this.edgeZExtent[0] = data.zIndex;
      if (data.zIndex > this.edgeZExtent[1]) this.edgeZExtent[1] = data.zIndex;
    }
  }

  /**
   * Update an edge in the internal data structures.
   * @private
   * @param key The edge's graphology ID
   */
  private updateEdge(key: string): void {
    this.addEdge(key);
  }

  /**
   * Remove an edge from the internal data structures.
   * @private
   * @param key The edge's graphology ID
   */
  private removeEdge(key: string): void {
    // Remove from edge cache
    delete this.edgeDataCache[key];
    // Remove from programId index
    delete this.edgeProgramIndex[key];
    // Remove from hovered
    if (this.hoveredEdge === key) this.hoveredEdge = null;
    // Remove from forced label
    this.edgesWithForcedLabels.delete(key);
  }

  /**
   * Clear all indices related to nodes.
   * @private
   */
  private clearNodeIndices(): void {
    // LabelGrid & nodeExtent are only manage/populated in the process function
    this.labelGrid = new LabelGrid();
    this.nodeExtent = { x: [0, 1], y: [0, 1] };
    this.nodeDataCache = {};
    this.edgeProgramIndex = {};
    this.nodesWithForcedLabels = new Set<string>();
    this.nodeZExtent = [Infinity, -Infinity];
  }

  /**
   * Clear all indices related to edges.
   * @private
   */
  private clearEdgeIndices(): void {
    this.edgeDataCache = {};
    this.edgeProgramIndex = {};
    this.edgesWithForcedLabels = new Set<string>();
    this.edgeZExtent = [Infinity, -Infinity];
  }

  /**
   * Clear all indices.
   * @private
   */
  private clearIndices(): void {
    this.clearEdgeIndices();
    this.clearNodeIndices();
  }

  /**
   * Clear all graph state related to nodes.
   * @private
   */
  private clearNodeState(): void {
    this.displayedNodeLabels = new Set();
    this.highlightedNodes = new Set();
    this.hoveredNode = null;
  }

  /**
   * Clear all graph state related to edges.
   * @private
   */
  private clearEdgeState(): void {
    this.displayedEdgeLabels = new Set();
    this.highlightedNodes = new Set();
    this.hoveredEdge = null;
  }

  /**
   * Clear all graph state.
   * @private
   */
  private clearState(): void {
    this.clearEdgeState();
    this.clearNodeState();
  }

  /**
   * Add the node data to its program.
   * @private
   * @param node The node's graphology ID
   * @param fingerprint A fingerprint used to identity the node with picking
   * @param position The index where to place the node in the program
   */
  private addNodeToProgram(node: string, fingerprint: number, position: number): void {
    const data = this.nodeDataCache[node];
    const nodeProgram = this.nodePrograms[data.type];
    if (!nodeProgram) throw new Error(`Sigma: could not find a suitable program for node type "${data.type}"!`);
    nodeProgram.process(fingerprint, position, data);
    // Saving program index
    this.nodeProgramIndex[node] = position;
  }

  /**
   * Add the edge data to its program.
   * @private
   * @param edge The edge's graphology ID
   * @param fingerprint A fingerprint used to identity the edge with picking
   * @param position The index where to place the edge in the program
   */
  private addEdgeToProgram(edge: string, fingerprint: number, position: number): void {
    const data = this.edgeDataCache[edge];
    const edgeProgram = this.edgePrograms[data.type];
    if (!edgeProgram) throw new Error(`Sigma: could not find a suitable program for edge type "${data.type}"!`);
    const extremities = this.graph.extremities(edge),
      sourceData = this.nodeDataCache[extremities[0]],
      targetData = this.nodeDataCache[extremities[1]];
    edgeProgram.process(fingerprint, position, sourceData, targetData, data);
    // Saving program index
    this.edgeProgramIndex[edge] = position;
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
   * Method setting the renderer's camera.
   *
   * @param  {Camera} camera - New camera.
   * @return {Sigma}
   */
  setCamera(camera: Camera): void {
    this.unbindCameraHandlers();
    this.camera = camera;
    this.bindCameraHandlers();
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

    if (this.checkEdgesEventsFrame !== null) {
      cancelFrame(this.checkEdgesEventsFrame);
      this.checkEdgesEventsFrame = null;
    }

    // Installing new graph
    this.graph = graph;

    // Binding new handlers
    this.bindGraphHandlers();

    // Re-rendering now to avoid discrepancies from now to next frame
    this.refresh();
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
   * It's useful for example to get values that are set by the edgeReducer.
   *
   * @param  {string} key - The edge's key.
   * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
   */
  getEdgeDisplayData(key: unknown): EdgeDisplayData | undefined {
    const edge = this.edgeDataCache[key as string];
    return edge ? Object.assign({}, edge) : undefined;
  }

  /**
   * Method used to get the set of currently displayed node labels.
   *
   * @return {Set<string>} A set of node keys whose label is displayed.
   */
  getNodeDisplayedLabels(): Set<string> {
    return new Set(this.displayedNodeLabels);
  }

  /**
   * Method used to get the set of currently displayed edge labels.
   *
   * @return {Set<string>} A set of edge keys whose label is displayed.
   */
  getEdgeDisplayedLabels(): Set<string> {
    return new Set(this.displayedEdgeLabels);
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
    this.refresh();
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
    this.scheduleRefresh();
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

      const gl = this.webGLContexts[id];
      gl.viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);

      // Clear picking texture if needed
      if (this.pickingLayers.has(id)) {
        const currentTexture = this.textures[id];
        if (currentTexture) gl.deleteTexture(currentTexture);
      }
    }

    return this;
  }

  /**
   * Method used to clear all the canvases.
   *
   * @return {Sigma}
   */
  clear(): this {
    this.webGLContexts.nodes.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    this.webGLContexts.nodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    this.webGLContexts.edges.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    this.webGLContexts.edges.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    this.webGLContexts.hoverNodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
    this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
    this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);

    return this;
  }

  /**
   * Method used to refresh, i.e. force the renderer to reprocess graph
   * data and render, but keep the state.
   * - if a partialGraph is provided, we only reprocess those nodes & edges.
   * - if schedule is TRUE, we schedule a render instead of sync render
   * - if skipIndexation is TRUE, then labelGrid & program indexation are skipped (can be used if you haven't modify x, y, zIndex & size)
   *
   * @return {Sigma}
   */
  refresh(opts?: {
    partialGraph?: { nodes?: string[]; edges?: string[] };
    schedule?: boolean;
    skipIndexation?: boolean;
  }): this {
    const skipIndexation = opts?.skipIndexation !== undefined ? opts?.skipIndexation : false;
    const schedule = opts?.schedule !== undefined ? opts.schedule : false;
    const fullRefresh = !opts || !opts.partialGraph;

    if (fullRefresh) {
      // Re-index graph data
      this.clearEdgeIndices();
      this.clearNodeIndices();
      this.graph.forEachNode((node) => this.addNode(node));
      this.graph.forEachEdge((edge) => this.addEdge(edge));
    } else {
      const nodes = opts.partialGraph?.nodes || [];
      for (let i = 0, l = nodes?.length || 0; i < l; i++) {
        const node = nodes[i];
        // Recompute node's data (ie. apply reducer)
        this.updateNode(node);
        // Add node to the program if layout is unchanged.
        // otherwise it will be done in the process function
        if (skipIndexation) {
          const programIndex = this.nodeProgramIndex[node];
          if (programIndex === undefined) throw new Error(`Sigma: node "${node}" can't be repaint`);
          this.addNodeToProgram(node, this.nodeIndices[node], programIndex);
        }
      }

      const edges = opts?.partialGraph?.edges || [];
      for (let i = 0, l = edges.length; i < l; i++) {
        const edge = edges[i];
        // Recompute edge's data (ie. apply reducer)
        this.updateEdge(edge);
        // Add edge to the program
        // otherwise it will be done in the process function
        if (skipIndexation) {
          const programIndex = this.edgeProgramIndex[edge];
          if (programIndex === undefined) throw new Error(`Sigma: edge "${edge}" can't be repaint`);
          this.addEdgeToProgram(edge, this.edgeIndices[edge], programIndex);
        }
      }
    }

    // Do we need to call the process function ?
    if (fullRefresh || !skipIndexation) this.needToProcess = true;

    if (schedule) this.scheduleRender();
    else this.render();

    return this;
  }

  /**
   * Method used to schedule a render at the next available frame.
   * This method can be safely called on a same frame because it basically
   * debounces refresh to the next frame.
   *
   * @return {Sigma}
   */
  scheduleRender(): this {
    if (!this.renderFrame) {
      this.renderFrame = requestFrame(() => {
        this.render();
      });
    }

    return this;
  }

  /**
   * Method used to schedule a refresh (i.e. fully reprocess graph data and render)
   * at the next available frame.
   * This method can be safely called on a same frame because it basically
   * debounces refresh to the next frame.
   *
   * @return {Sigma}
   */
  scheduleRefresh(opts?: { partialGraph?: { nodes?: string[]; edges?: string[] }; layoutUnchange?: boolean }): this {
    return this.refresh({ ...opts, schedule: true });
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
   * Method returning the distance multiplier between the graph system and the
   * viewport system.
   */
  getGraphToViewportRatio(): number {
    const graphP1 = { x: 0, y: 0 };
    const graphP2 = { x: 1, y: 1 };
    const graphD = Math.sqrt(Math.pow(graphP1.x - graphP2.x, 2) + Math.pow(graphP1.y - graphP2.y, 2));

    const viewportP1 = this.graphToViewport(graphP1);
    const viewportP2 = this.graphToViewport(graphP2);
    const viewportD = Math.sqrt(Math.pow(viewportP1.x - viewportP2.x, 2) + Math.pow(viewportP1.y - viewportP2.y, 2));

    return viewportD / graphD;
  }

  /**
   * Method returning the graph's bounding box.
   *
   * @return {{ x: Extent, y: Extent }}
   */
  getBBox(): { x: Extent; y: Extent } {
    return this.nodeExtent;
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
    this.scheduleRender();
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
    this.unbindCameraHandlers();

    // Releasing DOM events & captors
    window.removeEventListener("resize", this.activeListeners.handleResize);
    this.mouseCaptor.kill();
    this.touchCaptor.kill();

    // Releasing graph handlers
    this.unbindGraphHandlers();

    // Releasing cache & state
    this.clearIndices();
    this.clearState();

    this.nodeDataCache = {};
    this.edgeDataCache = {};

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

    // Destroying WebGL contexts
    for (const id in this.webGLContexts) {
      const context = this.webGLContexts[id];
      context.getExtension("WEBGL_lose_context")?.loseContext();
    }

    // Destroying canvases
    const container = this.container;

    while (container.firstChild) container.removeChild(container.firstChild);

    // Destroying remaining collections
    this.canvasContexts = {};
    this.webGLContexts = {};
    this.elements = {};

    // Kill programs:
    for (const type in this.nodePrograms) {
      this.nodePrograms[type].kill();
    }
    for (const type in this.nodeHoverPrograms) {
      this.nodeHoverPrograms[type].kill();
    }
    for (const type in this.edgePrograms) {
      this.edgePrograms[type].kill();
    }
    this.nodePrograms = {};
    this.nodeHoverPrograms = {};
    this.edgePrograms = {};
  }

  /**
   * Method used to scale the given size according to the camera's ratio, i.e.
   * zooming state.
   *
   * @param  {number?} size -        The size to scale (node size, edge thickness etc.).
   * @param  {number?} cameraRatio - A camera ratio (defaults to the actual camera ratio).
   * @return {number}              - The scaled size.
   */
  scaleSize(size = 1, cameraRatio = this.camera.ratio): number {
    return (
      (size / this.settings.zoomToSizeRatioFunction(cameraRatio)) *
      (this.getSetting("itemSizesReference") === "positions" ? cameraRatio * this.graphToViewportRatio : 1)
    );
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
