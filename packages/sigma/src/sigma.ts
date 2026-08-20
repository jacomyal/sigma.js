/**
 * Sigma.js
 * ========
 * @module
 */
import Graph, { Attributes } from "graphology-types";

import Camera, { CameraAnimationPayload } from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import TouchCaptor from "./core/captors/touch";
import { DragManager } from "./core/drag-manager";
import { EdgeGroupIndex } from "./core/edge-groups";
import { bindGraphHandlers, bindInteractionHandlers, unbindGraphHandlers, updateHover } from "./core/event-handlers";
import { computeFittedExtent } from "./core/fit-extent";
import GestureHint from "./core/gesture-hint";
import { HoverResolver } from "./core/hover-resolver";
import {
  Hit,
  KIND_REGISTRY,
  PickingState,
  allocateLabelIds,
  createPickingState,
  getCursor,
  pickingIdOf,
  registerItem,
  resetKind,
  samePickingAllocation,
} from "./core/interactive-kinds";
import { LabelRenderer } from "./core/label-renderer";
import { SDFAtlasManager } from "./core/sdf-atlas";
import { SigmaInternals } from "./core/sigma-internals";
import { StateManager } from "./core/state-manager";
import {
  ResolvedStageStyle,
  StyleAnalysis,
  analyzeStyleDeclaration,
  evaluateEdgeStyle,
  evaluateNodeStyle,
  evaluateStageStyle,
} from "./core/styles";
import {
  DEFAULT_DEPTH_LAYERS,
  DEFAULT_EDGE_DEPTH_LAYERS,
  DEFAULT_NODE_DEPTH_LAYERS,
  ExtractDepthLayersFromPrimitives,
  ExtractEdgeVarsFromPrimitives,
  ExtractNodeVarsFromPrimitives,
  PrimitivesDeclaration,
  generateEdgeProgram,
  generateNodeProgram,
} from "./primitives";
import {
  AttachmentManager,
  DepthBucketCollection,
  EdgeDataTexture,
  EdgeFramePass,
  EdgePath,
  EdgeProgram,
  FrameTexture,
  NodeDataTexture,
  NodeLabelFramePass,
  NodeProgram,
  Program,
  getShapeId,
} from "./rendering";
import { Settings, resolveSettings, validateSettings } from "./settings";
import {
  CameraState,
  CoordinateConversionOverride,
  Coordinates,
  DEFAULT_PRIMITIVES,
  Dimensions,
  EdgeDisplayData,
  EdgeReducer,
  Extent,
  Listener,
  NodeDisplayData,
  NodeReducer,
  PlainObject,
  RenderParams,
  SigmaEvents,
  TypedEventEmitter,
} from "./types";
import { DEFAULT_STYLES } from "./types/styles";
import {
  BaseEdgeState,
  BaseGraphState,
  BaseNodeState,
  ForbidBaseKeys,
  FullEdgeState,
  FullGraphState,
  FullNodeState,
  StylesDeclaration,
} from "./types/styles";
import {
  DepthRanges,
  NormalizationFunction,
  addPositionToDepthRanges,
  colorToIndex,
  createElement,
  createNormalizationFunction,
  getMatrixImpact,
  getPixelColor,
  getPixelRatio,
  hasBackdrop,
  hasForcedLabel,
  identity,
  matrixFromCamera,
  multiplyVec2,
  nodeRotationFlags,
  removePositionFromDepthRanges,
  setMembership,
  validateGraph,
} from "./utils";

/**
 * Constants.
 */
// Texture unit for the per-frame edge-frame texture (per-edge clamp vec4)
const EDGE_FRAME_TEXTURE_UNIT = 1;
// Texture unit for the per-frame node-frame texture (normalized edge distances)
const NODE_FRAME_TEXTURE_UNIT = 2;
// Texture unit for the shared node data texture (position, size, shapeId)
const NODE_DATA_TEXTURE_UNIT = 3;
// Texture unit for the shared edge data texture (source/target indices, thickness, curvature, etc.)
const EDGE_DATA_TEXTURE_UNIT = 4;

/** A custom WebGL layer program; see {@link Sigma#addCustomLayerProgram}. */
type CustomLayerProgram = {
  render(params: RenderParams): void;
  kill(): void;
  preRender?(params: RenderParams): void;
  cacheData?(): void;
};

/** Builds a custom layer program; re-invoked after a WebGL context restore. */
type CustomLayerProgramFactory = (gl: WebGL2RenderingContext) => CustomLayerProgram;

/** Minimal typing for the EXT_disjoint_timer_query_webgl2 extension, used by DEBUG_gpuTimerQueries. */
interface EXTDisjointTimerQueryWebGL2 {
  TIME_ELAPSED_EXT: number;
  GPU_DISJOINT_EXT: number;
}

/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
export default class Sigma<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
  NS = {}, // additional custom node state fields
  ES = {}, // additional custom edge state fields
  GS = {}, // additional custom graph state fields
  const P extends PrimitivesDeclaration = PrimitivesDeclaration,
> extends TypedEventEmitter<SigmaEvents> {
  // Reducers (optional escape hatches for complex styling logic)
  private nodeReducer: NodeReducer<N, E, G, NS, GS> | null = null;
  private edgeReducer: EdgeReducer<N, E, G, ES, GS> | null = null;
  private mouseCaptor: MouseCaptor<N, E, G>;
  private touchCaptor: TouchCaptor<N, E, G>;
  private container: HTMLElement;
  private stageCanvas: HTMLCanvasElement = null!;
  private mouseLayer: HTMLElement = null!;
  private gestureHint: GestureHint | null = null;
  private extraElements: PlainObject<HTMLElement> = {};
  private webGLContext: WebGL2RenderingContext | null = null;
  private pickingFrameBuffer: WebGLFramebuffer | null = null;
  private pickingTexture: WebGLTexture | null = null;
  private pickingDepthBuffer: WebGLRenderbuffer | null = null;
  private activeListeners: PlainObject<Listener> = {};
  private internals: SigmaInternals<N, E, G>;
  private labelRenderer: LabelRenderer<N, E, G>;

  // Variables declared in primitives (for custom layer attributes), pre-cached as entries
  private nodeVariableEntries: [string, { type: string; default: unknown }][] = [];
  private edgeVariableEntries: [string, { type: string; default: unknown }][] = [];
  private edgePathsByName: Map<string, EdgePath> = new Map();

  private edgeGroups: EdgeGroupIndex;

  // Indices to keep track of the index of the item inside programs
  private nodeProgramIndex: Record<string, number> = {};
  private edgeProgramIndex: Record<string, number> = {};
  private edgeTextureIndexCache: Record<string, number> = {};
  private nodeGraphCoords: Record<string, Coordinates> = {};
  private nodeExtent: { x: Extent; y: Extent } = { x: [0, 1], y: [0, 1] };

  private matrix: Float32Array = identity();
  private invMatrix: Float32Array = identity();
  private correctionRatio = 1;
  private frameId = 0;
  private customBBox: { x: Extent; y: Extent } | null = null;

  // DEBUG_gpuTimerQueries: EXT_disjoint_timer_query_webgl2 handle (undefined = not
  // yet resolved, null = unsupported) and the queries currently in flight.
  private gpuTimerExt: EXTDisjointTimerQueryWebGL2 | null | undefined = undefined;
  private activeGpuTimerQuery: WebGLQuery | null = null;
  private pendingGpuTimerQueries: Array<{ query: WebGLQuery; frameId: number }> = [];
  private normalizationFunction: NormalizationFunction = createNormalizationFunction({
    x: [0, 1],
    y: [0, 1],
  });

  // Cache:
  private graphToViewportRatio = 1;
  // Sole source of truth for picking-ID encoding. The label and partial-refresh
  // paths query this via `pickingIdOf`; nothing else in sigma touches IDs.
  private pickingState: PickingState = createPickingState();
  private prevNodeVisibilities: Record<string, string | undefined> = {};

  // Starting dimensions
  private width = 0;
  private height = 0;

  private stateManager: StateManager<NS, ES, GS>;
  // Frozen when autoRescale:"once" has already captured the initial extent.
  private autoRescaleFrozen = false;

  // New v4 API: primitives and styles declarations
  private stylesDeclaration: StylesDeclaration<N, E, NS, ES, GS> | null = null;
  private resolvedStageStyle: ResolvedStageStyle = {};

  // Internal states
  private renderFrame: number | null = null;
  // True between "webglcontextlost" and the rebuild on "webglcontextrestored"
  private contextLost = false;
  private pendingProcess: "none" | "nodes" | "full" = "full";
  private needToRefreshState = false;
  private checkEdgesEventsFrame: number | null = null;

  // Pre-computed style metadata (dependency level, position attribute names)
  private edgeStyleAnalysis: StyleAnalysis = { dependency: "static", xAttribute: null, yAttribute: null };

  // Programs (single program per item kind)
  private nodeProgram!: NodeProgram<N, E, G>;
  private nodeFramePass!: NodeLabelFramePass;
  private edgeProgram!: EdgeProgram<N, E, G>;
  private edgeFramePass!: EdgeFramePass;

  // Resolved depth layers (fixed at construction, cached to avoid repeated spreading)
  private depthLayers: readonly string[] = [...DEFAULT_DEPTH_LAYERS];

  // Custom layer programs (fullscreen quad effects), keyed by unique id.
  // The factory rebuilds the program after a context restore.
  private customLayerPrograms = new Map<
    string,
    { depth: string; factory: CustomLayerProgramFactory; program: CustomLayerProgram }
  >();

  // Shape slug for edge clamping (encodes shape name and params)
  private nodeShapeSlug: string | null = null;

  // WebGL Labels (SDF-based rendering)
  private sdfAtlas: SDFAtlasManager | null = null;

  // Per-depth buckets; each collection owns its items' depth placement
  private itemBuckets: Record<"nodes" | "edges", DepthBucketCollection>;
  // Track {offset, count} fragment ranges per depth for range-rendering
  private depthRanges: { nodes: DepthRanges; edges: DepthRanges } = { nodes: {}, edges: {} };
  // Depth assigned to each item during the last process() call
  private nodeBaseDepth: Record<string, string> = {};
  private edgeBaseDepth: Record<string, string> = {};

  private camera: Camera;

  constructor(
    graph: Graph<N, E, G>,
    container: HTMLElement,
    options: {
      primitives?: P;
      styles?: StylesDeclaration<
        N,
        E,
        NoInfer<NS>,
        NoInfer<ES>,
        NoInfer<GS>,
        ExtractNodeVarsFromPrimitives<P>,
        ExtractEdgeVarsFromPrimitives<P>,
        ExtractDepthLayersFromPrimitives<P>
      >;
      settings?: Partial<Settings>;
      nodeReducer?: NodeReducer<N, E, G, NS, GS>;
      edgeReducer?: EdgeReducer<N, E, G, ES, GS>;
      customNodeState?: ForbidBaseKeys<BaseNodeState, NS>;
      customEdgeState?: ForbidBaseKeys<BaseEdgeState, ES>;
      customGraphState?: ForbidBaseKeys<BaseGraphState, GS>;
    } = {},
  ) {
    super();

    // Extract options
    const {
      primitives,
      styles,
      settings = {},
      nodeReducer,
      edgeReducer,
      customNodeState,
      customEdgeState,
      customGraphState,
    } = options;

    // Initialize state manager (owns all per-item and graph-level state)
    this.stateManager = new StateManager<NS, ES, GS>(
      () => this.scheduleStateRefresh(),
      customNodeState,
      customEdgeState,
      customGraphState,
    );

    // Store primitives and styles declarations for v4 API
    // Use DEFAULT_STYLES when styles not provided, merging at nodes/edges level
    const resolvedPrimitives = primitives ?? DEFAULT_PRIMITIVES;
    this.stylesDeclaration = styles
      ? ({
          nodes: styles.nodes ?? DEFAULT_STYLES.nodes,
          edges: styles.edges ?? DEFAULT_STYLES.edges,
          stage: styles.stage,
        } as StylesDeclaration<N, E, NS, ES, GS>)
      : (DEFAULT_STYLES as unknown as StylesDeclaration<N, E, NS, ES, GS>);

    // Store reducers
    this.nodeReducer = nodeReducer ?? null;
    this.edgeReducer = edgeReducer ?? null;

    // Analyze style declarations for dependency level and position attribute names.
    // Reducers are opaque functions that receive state, so force "graph-state".
    const nodeStyleAnalysis = analyzeStyleDeclaration(this.stylesDeclaration!.nodes as Record<string, unknown>);
    if (this.nodeReducer) nodeStyleAnalysis.dependency = "graph-state";
    this.edgeStyleAnalysis = analyzeStyleDeclaration(this.stylesDeclaration!.edges as Record<string, unknown>);
    if (this.edgeReducer) this.edgeStyleAnalysis.dependency = "graph-state";

    // Initial stage style evaluation
    if (this.stylesDeclaration!.stage) {
      this.resolvedStageStyle = evaluateStageStyle(
        this.stylesDeclaration!.stage as Record<string, unknown> | Record<string, unknown>[],
        this.stateManager.graphState,
      );
    }

    // Resolving settings
    const resolvedSettings = resolveSettings(settings);

    // Validating
    validateSettings(resolvedSettings);
    if (resolvedSettings.enableNodeDrag) {
      const { xAttribute, yAttribute } = nodeStyleAnalysis;
      if ((!xAttribute || !yAttribute) && !resolvedSettings.dragPositionToAttributes) {
        throw new Error(
          "Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. " +
            'Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), ' +
            "or provide a `dragPositionToAttributes` setting.",
        );
      }
    }
    validateGraph(graph);
    if (!(container instanceof HTMLElement)) throw new Error("Sigma: container should be an html element.");

    // Properties
    this.container = container;

    // Initialize edge group index (tracks parallel edges for spread rendering)
    this.edgeGroups = new EdgeGroupIndex(graph, (edges, count) => {
      for (let i = 0; i < edges.length; i++) {
        const state = this.stateManager.getEdgeState(edges[i]);
        state.parallelIndex = i;
        state.parallelCount = count;
      }
    });

    const dragManager = new DragManager(
      graph,
      this.viewportToGraph.bind(this),
      this.setNodesState.bind(this),
      (event, payload) => (this.emit as (event: string, payload: unknown) => void)(event, payload),
    );

    // Cache resolved depth layers (never changes after construction)
    this.depthLayers = resolvedPrimitives.depthLayers ?? [...DEFAULT_DEPTH_LAYERS];

    if (!styles?.nodes && !DEFAULT_NODE_DEPTH_LAYERS.every((layer) => this.depthLayers.includes(layer)))
      throw new Error(
        `Sigma: depthLayers must include ${DEFAULT_NODE_DEPTH_LAYERS.join(", ")} for the built-in node styles.`,
      );
    if (!styles?.edges && !DEFAULT_EDGE_DEPTH_LAYERS.every((layer) => this.depthLayers.includes(layer)))
      throw new Error(
        `Sigma: depthLayers must include ${DEFAULT_EDGE_DEPTH_LAYERS.join(", ")} for the built-in edge styles.`,
      );

    this.itemBuckets = {
      nodes: new DepthBucketCollection(this.depthLayers),
      edges: new DepthBucketCollection(this.depthLayers),
    };

    // Initializing stage canvas and WebGL context
    this.initWebGLContext();

    // Initializing mouse interaction layer
    this.mouseLayer = createElement<HTMLElement>(
      "div",
      { position: "absolute", touchAction: "none", userSelect: "none" },
      { class: "sigma-mouse" },
    );
    this.container.appendChild(this.mouseLayer);

    // Apply initial stage styles
    if (this.resolvedStageStyle.background) {
      this.container.style.backgroundColor = this.resolvedStageStyle.background;
    }
    if (this.resolvedStageStyle.cursor) {
      this.container.style.cursor = this.resolvedStageStyle.cursor;
    }

    // Initialize node data texture for sharing position/size/shape data between node and edge programs
    const nodeDataTexture = new NodeDataTexture(this.webGLContext!);

    // Shared label-placement texture: the normalized edge distances written by
    // the label frame-pass (GPU), node-indexed in lockstep with
    // nodeDataTexture
    const nodeFrameTexture = new FrameTexture(this.webGLContext!, { channels: 1 });

    // Initialize edge data texture for sharing edge data between edge and edge label programs
    const edgeDataTexture = new EdgeDataTexture(this.webGLContext!);

    // Shared edge-placement texture: the per-edge clamp vec4 (tStart, tEnd,
    // straightenFactor, pathLength) written by the edge frame-pass (GPU),
    // edge-indexed in lockstep with edgeDataTexture
    const edgeFrameTexture = new FrameTexture(this.webGLContext!, { channels: 4 });

    const gl = this.webGLContext!;

    // Resolves hover from the picking framebuffer, asynchronously
    const hoverResolver = new HoverResolver({
      gl,
      getFrameBuffer: () => this.pickingFrameBuffer,
      getPixelRatio: () => this.internals.pixelRatio,
      getDownSizingRatio: () => this.internals.settings.pickingDownSizingRatio,
      onIndex: (index, event) => updateHover(this.internals, this.pickingState.lookup[index] ?? null, event),
    });

    // Generate programs from primitives (uses defaults when not provided)
    const programs = this.initPrograms(resolvedPrimitives);

    // Create the attachment atlas manager only when attachments are declared.
    // The shape-aware attachment program comes from the node bundle and renders
    // only when this manager exists (see LabelRenderer.renderAttachments).
    const labelAttachments = resolvedPrimitives?.nodes?.labelAttachments;
    let attachmentManager: AttachmentManager | null = null;
    if (labelAttachments && Object.keys(labelAttachments).length > 0) {
      attachmentManager = new AttachmentManager(gl, labelAttachments, () => this.scheduleRender());
    }

    // Create the shared internals object. All reassignable fields are plain properties;
    // satellites hold a reference to this object and see updates via direct assignment.
    this.internals = {
      nodeDataCache: {},
      edgeDataCache: {},
      nodesWithForcedLabels: new Set<string>(),
      nodesWithBackdrop: new Set<string>(),
      edgesWithForcedLabels: new Set<string>(),
      settings: resolvedSettings,
      primitives: resolvedPrimitives,
      pixelRatio: getPixelRatio(),
      graph,
      stateManager: this.stateManager,
      dragManager,
      hoverResolver,
      nodeStyleAnalysis,
      pickingState: this.pickingState,
      ...programs,
      attachmentManager,
      nodeDataTexture,
      nodeFrameTexture,
      edgeDataTexture,
      edgeFrameTexture,
      getDimensions: () => this.getDimensions(),
      getGraphDimensions: () => this.getGraphDimensions(),
      getStagePadding: () => this.getStagePadding(),
      getCameraState: () => this.camera.getState(),
      getHitAtPosition: (pos) => this.getHitAtPosition(pos),
      setNodeState: (key, state) => this.setNodeState(key, state),
      setEdgeState: (key, state) => this.setEdgeState(key, state),
      updateContainerCursor: () => this.updateContainerCursor(),
      scheduleRefresh: () => this.scheduleRefresh(),
      viewportToFramedGraph: (coords) => this.viewportToFramedGraph(coords),
      viewportToGraph: (coords) => this.viewportToGraph(coords),
      framedGraphToViewport: (coords) => this.framedGraphToViewport(coords),
      scaleSize: (size) => this.scaleSize(size),
      emit: (event, payload) => (this.emit as (event: string, payload: unknown) => void)(event, payload),
    };
    this.labelRenderer = new LabelRenderer(this.internals);

    // Initial resize
    this.resize();

    // Initialize WebGL labels
    this.initializeWebGLLabels();

    // Initializing the camera
    this.camera = new Camera();

    // Binding camera events
    this.bindCameraHandlers();

    // Initializing captors
    // Cast to Sigma<N, E, G> since captors don't use state generics
    this.mouseCaptor = new MouseCaptor(this.mouseLayer, this as unknown as Sigma<N, E, G>);
    this.mouseCaptor.setSettings(this.internals.settings);
    this.touchCaptor = new TouchCaptor(this.mouseLayer, this as unknown as Sigma<N, E, G>);
    this.touchCaptor.setSettings(this.internals.settings);

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
   * Internal function used to initialize WebGL labels.
   * Sets up the SDF atlas.
   */
  private initializeWebGLLabels(): void {
    // Create SDF Atlas Manager
    this.sdfAtlas = new SDFAtlasManager();

    // Register default font
    this.sdfAtlas.registerFont({
      family: "sans-serif",
      weight: "normal",
      style: "normal",
    });
  }

  /**
   * Method (re)binding WebGL textures and buffers for the picking framebuffer.
   * The picking framebuffer can be at reduced resolution for performance.
   *
   * @return {Sigma}
   */
  private resetWebGLTexture(): this {
    const gl = this.webGLContext!;

    if (!this.pickingFrameBuffer) return this;

    // Calculate picking texture size (can be reduced for performance)
    const pickingWidth = Math.ceil(
      (this.width * this.internals.pixelRatio) / this.internals.settings.pickingDownSizingRatio,
    );
    const pickingHeight = Math.ceil(
      (this.height * this.internals.pixelRatio) / this.internals.settings.pickingDownSizingRatio,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFrameBuffer);

    // Update picking texture
    if (this.pickingTexture) gl.deleteTexture(this.pickingTexture);
    const pickingTexture = gl.createTexture();
    if (pickingTexture) {
      gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, pickingWidth, pickingHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);
      this.pickingTexture = pickingTexture;
    }

    // Update depth buffer
    if (this.pickingDepthBuffer) gl.deleteRenderbuffer(this.pickingDepthBuffer);
    const depthBuffer = gl.createRenderbuffer();
    if (depthBuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, pickingWidth, pickingHeight);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
      this.pickingDepthBuffer = depthBuffer;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return this;
  }

  /**
   * Method binding camera handlers.
   *
   * @return {Sigma}
   */
  private bindCameraHandlers(): this {
    this.activeListeners.camera = () => {
      this.refreshMatrices();
      this.scheduleRender();
    };
    this.activeListeners.cameraAnimationStart = ({ from, to }: CameraAnimationPayload) => {
      if (from.ratio !== to.ratio) this.stateManager.setGraphState({ isZooming: true });
    };
    this.activeListeners.cameraAnimationEnd = () => {
      this.stateManager.setGraphState({ isZooming: false });
    };

    this.camera.on("updated", this.activeListeners.camera);
    this.camera.on("animationStart", this.activeListeners.cameraAnimationStart);
    this.camera.on("animationEnd", this.activeListeners.cameraAnimationEnd);

    return this;
  }

  /**
   * Method unbinding camera handlers.
   *
   * @return {Sigma}
   */
  private unbindCameraHandlers(): this {
    this.camera.removeListener("updated", this.activeListeners.camera);
    this.camera.removeListener("animationStart", this.activeListeners.cameraAnimationStart);
    this.camera.removeListener("animationEnd", this.activeListeners.cameraAnimationEnd);
    return this;
  }

  /**
   * Returns the topmost pickable hit at a given viewport position, by reading
   * one pixel of the picking framebuffer and looking it up in the unified
   * picking table. Returns null if the pixel is empty.
   */
  private getHitAtPosition(position: Coordinates): Hit | null {
    if (this.contextLost) return null;

    const gl = this.webGLContext!;

    // Read from picking framebuffer (scaled by downSizingRatio)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFrameBuffer);

    const color = getPixelColor(
      gl,
      this.pickingFrameBuffer,
      position.x,
      position.y,
      this.internals.pixelRatio,
      this.internals.settings.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    return this.pickingState.lookup[index] ?? null;
  }

  private bindEventHandlers(): this {
    bindInteractionHandlers(this.internals, this.mouseCaptor, this.touchCaptor, this.activeListeners);

    return this;
  }

  /**
   * Method binding graph handlers
   *
   * @return {Sigma}
   */
  private bindGraphHandlers(): this {
    bindGraphHandlers(
      {
        graph: this.internals.graph,
        edgeGroups: this.edgeGroups,
        addNode: this.addNode.bind(this),
        updateNode: this.updateNode.bind(this),
        removeNode: this.removeNode.bind(this),
        addEdge: this.addEdge.bind(this),
        updateEdge: this.updateEdge.bind(this),
        removeEdge: this.removeEdge.bind(this),
        clearEdgeState: this.clearEdgeState.bind(this),
        clearNodeState: this.clearNodeState.bind(this),
        clearEdgeIndices: this.clearEdgeIndices.bind(this),
        clearNodeIndices: this.clearNodeIndices.bind(this),
        refresh: this.refresh.bind(this),
      },
      this.activeListeners,
    );
    return this;
  }

  /**
   * Method used to unbind handlers from the graph.
   *
   * @return {undefined}
   */
  private unbindGraphHandlers() {
    unbindGraphHandlers(this.internals.graph, this.activeListeners);
  }

  private getNodeShapeId(data: NodeDisplayData): number {
    if (
      this.internals.nodeShapeMap &&
      this.internals.nodeGlobalShapeIds &&
      data.shape &&
      data.shape in this.internals.nodeShapeMap
    ) {
      return this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[data.shape]];
    }
    return getShapeId(data.shape || "circle");
  }

  /**
   * Processes all node data: normalizes coordinates, rebuilds the label grid,
   * updates the node data texture and vertex buffer. Returns true if any
   * node's visibility changed since the last process cycle (which means edges
   * must also be reprocessed).
   */
  private processNodes(): boolean {
    const graph = this.internals.graph;
    const settings = this.internals.settings;
    const dimensions = this.getDimensions();

    const { autoRescale, autoRescaleContent } = settings;

    // Recompute the node extent, unless "once" has already frozen it:
    let nodeExtent = this.nodeExtent;
    if (autoRescale === false) {
      // Without rescaling, 1 graph unit = 1 pixel and the origin sits at the
      // viewport center: the mapping never depends on the graph's contents.
      const { width, height } = dimensions;
      nodeExtent = {
        x: [-width / 2, width / 2],
        y: [-height / 2, height / 2],
      };
    } else if (autoRescale !== "once" || !this.autoRescaleFrozen) {
      nodeExtent = this.computeNodeExtent();
      // A custom bounding box overrides the node extent, so fitting it is
      // useless:
      if (autoRescaleContent !== "positions" && !this.customBBox)
        nodeExtent = computeFittedExtent({
          extent: nodeExtent,
          coords: this.nodeGraphCoords,
          nodeData: this.internals.nodeDataCache,
          dimensions,
          stagePadding: this.getStagePadding(),
          zoomToSizeRatioFunction: settings.zoomToSizeRatioFunction,
          itemSizesReference: settings.itemSizesReference,
          fitLabels: autoRescaleContent === "labels",
          nodeLabelBox: (data, radius) => this.labelRenderer.nodeLabelBox(data, radius),
        });
      if (autoRescale === "once") this.autoRescaleFrozen = true;
    }

    this.nodeExtent = nodeExtent;
    this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);

    // NOTE: it is important to compute this matrix after computing the node's extent
    // because #.getGraphDimensions relies on it
    const nullCamera = new Camera();
    const nullCameraMatrix = matrixFromCamera(
      nullCamera.getState(),
      dimensions,
      this.getGraphDimensions(),
      this.getStagePadding(),
    );
    // Resetting the label grid
    // TODO: it's probably better to do this explicitly or on resizes for layout and anims
    this.labelRenderer.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
    this.labelRenderer.edgeAnchorGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
    const fillEdgeAnchorGrid = settings.renderEdgeLabels && settings.edgeLabelAnchors === "allNodes";

    let visibilityChanged = false;
    resetKind(this.pickingState, "node");

    const nodes = graph.nodes();

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];
      const data = this.internals.nodeDataCache[node];

      // Restore un-normalized graph coords before normalizing
      // (nodeDataCache may hold stale normalized values from a previous process cycle)
      const graphCoords = this.nodeGraphCoords[node];
      data.x = graphCoords.x;
      data.y = graphCoords.y;
      this.normalizationFunction.applyTo(data);

      if (data.visibility !== this.prevNodeVisibilities[node]) visibilityChanged = true;

      if (typeof data.label === "string" && data.visibility !== "hidden" && data.labelVisibility !== "hidden")
        this.labelRenderer.labelGrid.add(
          node,
          data.size,
          this.framedGraphToViewport(data, { matrix: nullCameraMatrix }),
        );

      if (fillEdgeAnchorGrid && data.visibility !== "hidden")
        this.labelRenderer.edgeAnchorGrid.add(
          node,
          data.size,
          this.framedGraphToViewport(data, { matrix: nullCameraMatrix }),
        );
    }
    this.labelRenderer.labelGrid.organize();
    this.labelRenderer.edgeAnchorGrid.organize();

    this.nodeProgram.reallocate(nodes.length);
    let nodeProcessCount = 0;

    this.depthRanges.nodes = {};
    this.nodeBaseDepth = {};
    const nodeDataCache = this.internals.nodeDataCache;
    for (const depth of this.depthLayers) {
      const items = this.itemBuckets.nodes.getSorted(depth, (k) => nodeDataCache[k].zIndex);
      if (items.length === 0) continue;
      this.depthRanges.nodes[depth] = [{ offset: nodeProcessCount, count: items.length }];
      for (const node of items) {
        this.nodeBaseDepth[node] = depth;
        this.nodeProgram.allocateNode(node);
        registerItem(this.pickingState, "node", node);
        this.addNodeToProgram(node, nodeProcessCount++);
      }
    }
    this.nodeProgram.invalidateBuffers();

    // Track visibility so the next processNodes call can detect changes
    for (let i = 0, l = nodes.length; i < l; i++) {
      this.prevNodeVisibilities[nodes[i]] = this.internals.nodeDataCache[nodes[i]].visibility;
    }

    this.labelRenderer.processWebGLLabels(nodes);

    for (const { program } of this.customLayerPrograms.values()) {
      if (program.cacheData) program.cacheData();
    }

    return visibilityChanged;
  }

  /**
   * Processes all edge data: updates the edge data texture and vertex buffer.
   * Picking IDs are assigned by the picking allocator, which reserves edges
   * a contiguous range right after the node range.
   * Must be called after processNodes() so node texture indices are available.
   */
  private processEdges(): void {
    const graph = this.internals.graph;
    const edges = graph.edges();

    this.edgeProgram.reallocate(edges.length);

    let edgeProcessCount = 0;
    resetKind(this.pickingState, "edge");

    this.depthRanges.edges = {};
    this.edgeBaseDepth = {};
    const edgeDataCache = this.internals.edgeDataCache;
    for (const depth of this.depthLayers) {
      const items = this.itemBuckets.edges.getSorted(depth, (k) => edgeDataCache[k].zIndex);
      if (items.length === 0) continue;
      this.depthRanges.edges[depth] = [{ offset: edgeProcessCount, count: items.length }];
      for (const edge of items) {
        this.edgeBaseDepth[edge] = depth;
        registerItem(this.pickingState, "edge", edge);
        this.addEdgeToProgram(edge, edgeProcessCount++);
      }
    }
    this.edgeProgram.invalidateBuffers();
  }

  /**
   * Update depth ranges when a node moves between depth layers without
   * reprocessing the program array.
   */
  private updateNodeDepthRanges(key: string, oldDepth: string, newDepth: string): void {
    const position = this.nodeProgramIndex[key];
    if (position === undefined) return;
    removePositionFromDepthRanges(this.depthRanges.nodes, oldDepth, position);
    addPositionToDepthRanges(this.depthRanges.nodes, newDepth, position);
  }

  /**
   * Update depth ranges when an edge moves between depth layers without
   * reprocessing the program array.
   */
  private updateEdgeDepthRanges(key: string, oldDepth: string, newDepth: string): void {
    const position = this.edgeProgramIndex[key];
    if (position === undefined) return;
    removePositionFromDepthRanges(this.depthRanges.edges, oldDepth, position);
    addPositionToDepthRanges(this.depthRanges.edges, newDepth, position);
  }

  /**
   * Method that backports potential settings updates where it's needed.
   * @private
   */
  private handleSettingsUpdate(): this {
    const settings = this.internals.settings;

    this.camera.minRatio = settings.minCameraRatio;
    this.camera.maxRatio = settings.maxCameraRatio;
    this.camera.enabledZooming = settings.enableCameraZooming;
    this.camera.enabledPanning = settings.enableCameraPanning;
    this.camera.enabledRotation = settings.enableCameraRotation;
    if (settings.cameraPanBoundaries) {
      this.camera.constrainState = (state) =>
        this.cleanCameraState(
          state,
          settings.cameraPanBoundaries && typeof settings.cameraPanBoundaries === "object"
            ? settings.cameraPanBoundaries
            : {},
        );
    } else {
      this.camera.constrainState = null;
    }
    // Re-validate the current state, since the new settings may forbid it:
    this.camera.setState(this.camera.getState());

    // Native touch scrolling must stay possible when gestures are routed to
    // the page ("pan-x pan-y" still lets sigma capture two-finger pinches):
    this.mouseLayer.style.touchAction =
      settings.gestureTarget === "graph" ? "none" : settings.gestureTarget === "shared" ? "pan-x pan-y" : "auto";
    if (settings.gestureTarget !== "shared" && this.gestureHint) {
      this.gestureHint.kill();
      this.gestureHint = null;
    }

    // Update captors settings:
    this.mouseCaptor.setSettings(this.internals.settings);
    this.touchCaptor.setSettings(this.internals.settings);

    return this;
  }

  private cleanCameraState(
    state: CameraState,
    { tolerance = 0, boundaries }: { tolerance?: number; boundaries?: Record<"x" | "y", [number, number]> } = {},
  ): CameraState {
    const newState = { ...state };

    // Extract necessary properties
    const {
      x: [xMinGraph, xMaxGraph],
      y: [yMinGraph, yMaxGraph],
    } = boundaries || this.nodeExtent;

    // Transform the four corners of the graph rectangle using the provided camera state
    const corners = [
      this.graphToViewport({ x: xMinGraph, y: yMinGraph }, { cameraState: state }),
      this.graphToViewport({ x: xMaxGraph, y: yMinGraph }, { cameraState: state }),
      this.graphToViewport({ x: xMinGraph, y: yMaxGraph }, { cameraState: state }),
      this.graphToViewport({ x: xMaxGraph, y: yMaxGraph }, { cameraState: state }),
    ];

    // Look for new extents, based on these four corners
    let xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;
    corners.forEach(({ x, y }) => {
      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y);
      yMax = Math.max(yMax, y);
    });

    // For each dimension, constraint the smaller element (camera or graph) to fit in the larger one:
    const graphWidth = xMax - xMin;
    const graphHeight = yMax - yMin;
    const { width, height } = this.getDimensions();
    let dx = 0;
    let dy = 0;

    if (graphWidth >= width) {
      if (xMax < width - tolerance) dx = xMax - (width - tolerance);
      else if (xMin > tolerance) dx = xMin - tolerance;
    } else {
      if (xMax > width + tolerance) dx = xMax - (width + tolerance);
      else if (xMin < -tolerance) dx = xMin + tolerance;
    }
    if (graphHeight >= height) {
      if (yMax < height - tolerance) dy = yMax - (height - tolerance);
      else if (yMin > tolerance) dy = yMin - tolerance;
    } else {
      if (yMax > height + tolerance) dy = yMax - (height + tolerance);
      else if (yMin < -tolerance) dy = yMin + tolerance;
    }

    if (dx || dy) {
      // Transform [dx, dy] from viewport to graph (using two different point to transform that vector):
      const origin = this.viewportToFramedGraph({ x: 0, y: 0 }, { cameraState: state });
      const delta = this.viewportToFramedGraph({ x: dx, y: dy }, { cameraState: state });
      dx = delta.x - origin.x;
      dy = delta.y - origin.y;
      newState.x += dx;
      newState.y += dy;
    }

    return newState;
  }

  /**
   * Refreshes the cached matrices and their derived ratios from the current camera state, viewport, graph dimensions
   * and stage padding.
   */
  private refreshMatrices(): void {
    const cameraState = this.camera.getState();
    const viewportDimensions = this.getDimensions();
    const graphDimensions = this.getGraphDimensions();
    const padding = this.getStagePadding();
    this.matrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding);
    this.invMatrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding, true);
    this.correctionRatio = getMatrixImpact(this.matrix, cameraState, viewportDimensions);
    this.graphToViewportRatio = this.getGraphToViewportRatio();
  }

  /**
   * Rebuilds the node/edge program buffers from the data caches. Runs whenever
   * `pendingProcess` is set: on a structural change, or when refreshState()
   * escalates an in-place refresh that changed an item's render order.
   */
  private processData(): void {
    this.emit("beforeProcess");
    this.internals.attachmentManager?.clear();
    const previousIds = { ...this.pickingState.idsByKind };
    const visibilityChanged = this.processNodes();
    if (this.pendingProcess === "full" || visibilityChanged) this.processEdges();
    // Allocate label IDs after node/edge IDs. On a nodes-only refresh the
    // cached edge IDs in the picking state are preserved.
    allocateLabelIds(this.pickingState, this.internals);
    if (!samePickingAllocation(previousIds, this.pickingState.idsByKind)) this.internals.hoverResolver.invalidate();
    this.pendingProcess = "none";
    this.emit("afterProcess");
  }

  /**
   * Method used to render.
   *
   * @return {Sigma}
   */
  private render(): this {
    // No use rendering while the context is lost, the restore handler refreshes
    if (this.contextLost) return this;

    this.emit("beforeRender");

    const exitRender = () => {
      // Re-resolve hover: the scene may have moved under a still pointer
      this.internals.hoverResolver.frameRendered();
      this.emit("afterRender");
      return this;
    };

    // If a render was scheduled, we cancel it
    if (this.renderFrame) {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
    }

    // First we need to resize
    this.resize();

    // Do we need to reprocess data?
    if (this.pendingProcess !== "none") this.processData();

    // Do we need to refresh state (styles in-place, no reprocess)?
    if (this.needToRefreshState) this.refreshState();
    this.needToRefreshState = false;
    this.stateManager.clearDirtyTracking();

    // refreshState() can escalate to a reprocess (a zIndex change is a
    // reordering, which an in-place refresh cannot apply).
    if (this.pendingProcess !== "none") this.processData();

    // Clearing the canvases
    this.clear();

    // Prepare the picking texture
    this.resetWebGLTexture();

    // If we have no nodes we can stop right there
    if (!this.internals.graph.order) return exitRender();

    // TODO: improve this heuristic or move to the captor itself?
    // TODO: deal with the touch captor here as well
    const mouseCaptor = this.mouseCaptor;
    const moving =
      this.camera.isAnimating() ||
      mouseCaptor.isMoving ||
      mouseCaptor.draggedEvents ||
      mouseCaptor.currentWheelDirection;

    // The camera-driven update happens via the "updated" listener, but processNodes and resize may have changed
    // graph/viewport dimensions, so we refresh here too.
    this.refreshMatrices();

    // [jacomyal]
    // This comment is related to the one above the `getMatrixImpact` definition:
    // - `this.correctionRatio` is somehow not completely explained
    // - `this.graphToViewportRatio` is the ratio of a distance in the viewport divided by the same distance in the
    //   graph
    // - `this.normalizationFunction.ratio` is basically `Math.max(graphDX, graphDY)`
    // And now, I observe that if I multiply these three ratios, I have something constant, which value remains 2, even
    // when I change the graph, the viewport or the camera. It might be useful later, so I prefer to let this comment:
    // console.log(this.graphToViewportRatio * this.correctionRatio * this.normalizationFunction.ratio * 2);

    this.frameId++;

    const debugPrograms = this.internals.settings.DEBUG_logRenderStats ? this.getDebugPrograms() : null;
    if (debugPrograms) debugPrograms.forEach((program) => program.resetDebugStats());

    if (this.internals.settings.DEBUG_gpuTimerQueries) this.beginGpuTimerQuery();

    // Keep the node-frame texture sized to the node-data texture before capturing
    // render params, so the texture width baked into params (and read by consumers
    // as texel coordinates) reflects any resize this frame.
    this.internals.nodeFrameTexture!.ensureCapacity(this.internals.nodeDataTexture!.getCapacity());
    this.internals.edgeFrameTexture!.ensureCapacity(this.internals.edgeDataTexture!.getCapacity());
    const params: RenderParams = this.getRenderParams();
    // Skip the edge picking pass when the edge kind isn't pickable this frame.
    const edgeParams: RenderParams = KIND_REGISTRY.edge.writesPickingThisFrame(this.internals)
      ? params
      : { ...params, pickingFrameBuffer: null };
    this.labelRenderer.resetFrame();

    const gl = this.webGLContext!;

    // Clear the picking framebuffer (two-pass rendering: programs render to picking first, then to screen)
    const pickingWidth = Math.ceil(
      (this.width * this.internals.pixelRatio) / this.internals.settings.pickingDownSizingRatio,
    );
    const pickingHeight = Math.ceil(
      (this.height * this.internals.pixelRatio) / this.internals.settings.pickingDownSizingRatio,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFrameBuffer);
    gl.viewport(0, 0, pickingWidth, pickingHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear the main canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width * this.internals.pixelRatio, this.height * this.internals.pixelRatio);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Upload data textures (must upload both before binding to avoid texture unit conflicts)
    this.internals.nodeDataTexture!.upload();
    this.internals.edgeDataTexture!.upload();

    // Upload layer attribute textures
    this.nodeProgram.uploadLayerTexture();
    this.edgeProgram.uploadAttributeTexture();

    // All CPU-side texture uploads are done: GPU-side writers can now write
    // into the data textures, before anything reads them this frame
    this.emit("afterTexturesUpload");

    // Bind data textures to their respective texture units
    this.internals.nodeDataTexture!.bind(NODE_DATA_TEXTURE_UNIT);
    this.internals.edgeDataTexture!.bind(EDGE_DATA_TEXTURE_UNIT);

    // Run the edge frame-pass once per frame: it computes each edge's
    // source/target clamp into the edge-frame texture (unit 1), which the edge
    // body, labels and label backgrounds all read by edge index.
    this.edgeFramePass.run(
      params,
      this.internals.edgeFrameTexture!,
      this.internals.edgeDataTexture!.getHighWaterMark(),
      this.edgeProgram.getAttributeTexture(),
    );
    this.internals.edgeFrameTexture!.bind(EDGE_FRAME_TEXTURE_UNIT);

    // Pre-compute which node labels will be displayed (needed by both backdrops and labels)
    if (this.internals.settings.renderLabels) {
      this.labelRenderer.computeDisplayedNodeLabels();
      // Run the frame-pass over the displayed labels to write each one's normalized
      // edge distance into the node-frame texture (unit 2); consumers read it there.
      const { data, count } = this.labelRenderer.buildFramePassPoints();
      this.nodeFramePass.run(data, count, this.internals.nodeFrameTexture!, params);
      this.internals.nodeFrameTexture!.bind(NODE_FRAME_TEXTURE_UNIT);
    }

    // Pre-compute edge label candidates (consumed by both the background pass
    // and the label pass inside the depth loop).
    if (this.internals.settings.renderEdgeLabels) {
      this.labelRenderer.computeDisplayedEdgeLabels();
    }

    // Pre-render pass for custom layers (offscreen work like density splatting)
    // before the depth loop to avoid framebuffer switching mid-loop.
    for (const { program } of this.customLayerPrograms.values()) {
      if (program.preRender) program.preRender(params);
    }

    // Restore main framebuffer state after any offscreen passes
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width * this.internals.pixelRatio, this.height * this.internals.pixelRatio);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    for (const depth of this.depthLayers) {
      // Custom layer programs registered at this depth, in registration order
      for (const customLayer of this.customLayerPrograms.values()) {
        if (customLayer.depth === depth) customLayer.program.render(params);
      }

      // Edges in this depth
      const edgeRanges = this.depthRanges.edges[depth];
      if (edgeRanges && (!this.internals.settings.hideEdgesOnMove || !moving)) {
        for (const { offset, count } of edgeRanges) {
          if (count > 0) this.edgeProgram.render(edgeParams, offset, count);
        }
      }

      // Edge labels for this depth (backgrounds first so they paint under the
      // text). The background ribbon is the picking hitbox when
      // edgeLabelEvents is on; picking buffer is skipped otherwise to save
      // GPU work.
      if (this.internals.settings.renderEdgeLabels && (!this.internals.settings.hideLabelsOnMove || !moving)) {
        this.labelRenderer.renderEdgeLabelBackgrounds(
          KIND_REGISTRY.edgeLabel.writesPickingThisFrame(this.internals)
            ? params
            : { ...params, pickingFrameBuffer: null },
          depth,
        );
        this.labelRenderer.renderEdgeLabels(params, depth);
      }

      // Cache attachment textures before backdrops so backdrop sizing includes them
      this.labelRenderer.cacheAttachments(depth);

      // Backdrops for nodes in this depth (before node programs so they appear behind).
      // Backdrops are not pickable, so pass null picking buffer to prevent their visual color
      // from leaking into the picking framebuffer via layout(location=0) out vec4 fragColor.
      this.labelRenderer.renderBackdrops({ ...params, pickingFrameBuffer: null }, depth);

      // Nodes in this depth
      const nodeRanges = this.depthRanges.nodes[depth];
      if (nodeRanges) {
        for (const { offset, count } of nodeRanges) {
          if (count > 0) this.nodeProgram.render(params, offset, count);
        }
      }

      // Label attachments for this depth (after nodes, before labels).
      // Attachments are not pickable, so pass null picking buffer to prevent the atlas texture
      // from leaking into the picking framebuffer via layout(location=0) out vec4 fragColor.
      this.labelRenderer.renderAttachments({ ...params, pickingFrameBuffer: null }, depth);

      // Label backgrounds for this depth (after nodes so picking overwrites nodes in "over" mode).
      // Picking is skipped when node label events are disabled; transparent nodes discard in the visual pass.
      this.labelRenderer.renderLabelBackgrounds(
        KIND_REGISTRY.nodeLabel.writesPickingThisFrame(this.internals)
          ? params
          : { ...params, pickingFrameBuffer: null },
        depth,
      );

      // Node labels for this depth
      if (this.internals.settings.renderLabels) {
        this.labelRenderer.renderWebGLLabels(params, depth);
      }
    }

    // If DEBUG_displayPickingLayer is enabled, blit picking framebuffer to screen
    if (this.internals.settings.DEBUG_displayPickingLayer) {
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.pickingFrameBuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
      gl.blitFramebuffer(
        0,
        0,
        pickingWidth,
        pickingHeight,
        0,
        0,
        this.width * this.internals.pixelRatio,
        this.height * this.internals.pixelRatio,
        gl.COLOR_BUFFER_BIT,
        gl.NEAREST,
      );
    }

    if (this.internals.settings.DEBUG_gpuTimerQueries) this.endGpuTimerQuery();
    this.pollGpuTimerQueries();

    if (debugPrograms) this.logRenderStats(debugPrograms);

    // Do not display labels on move per setting
    if (this.internals.settings.hideLabelsOnMove && moving) return exitRender();

    return exitRender();
  }

  /** DEBUG_logShaders / DEBUG_logRenderStats: every built-in Program instance sigma owns this frame. */
  private getDebugPrograms(): Program<string, N, E, G>[] {
    return [
      this.nodeProgram,
      this.edgeProgram,
      this.internals.labelProgram,
      this.internals.edgeLabelProgram,
      this.internals.edgeLabelBackgroundProgram,
      this.internals.backdropProgram,
      this.internals.labelBackgroundProgram,
      this.internals.attachmentProgram,
    ].filter((program): program is NonNullable<typeof program> => program !== null);
  }

  /** DEBUG_logRenderStats: logs this frame's counters as a table, keyed by program class name. */
  private logRenderStats(programs: Program<string, N, E, G>[]): void {
    const rows: Record<string, { drawCalls: number; verticesDrawn: number; bufferUploadBytes: number }> = {};
    for (const program of programs) rows[program.constructor.name] = { ...program.debugStats };
    // eslint-disable-next-line no-console
    console.log(`[sigma] DEBUG_logRenderStats: frame #${this.frameId}`);
    // eslint-disable-next-line no-console
    console.table(rows);
  }

  /**
   * DEBUG_gpuTimerQueries: lazily resolves EXT_disjoint_timer_query_webgl2. Returns
   * null (and warns once) if the browser/driver doesn't support it.
   */
  private getGpuTimerExtension(): EXTDisjointTimerQueryWebGL2 | null {
    if (this.gpuTimerExt === undefined) {
      this.gpuTimerExt = this.webGLContext!.getExtension(
        "EXT_disjoint_timer_query_webgl2",
      ) as EXTDisjointTimerQueryWebGL2 | null;
      if (!this.gpuTimerExt) {
        // eslint-disable-next-line no-console
        console.warn(
          "Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.",
        );
      }
    }
    return this.gpuTimerExt;
  }

  /** DEBUG_gpuTimerQueries: starts a query wrapping every GL call until `endGpuTimerQuery`. */
  private beginGpuTimerQuery(): void {
    const ext = this.getGpuTimerExtension();
    if (!ext) return;

    const gl = this.webGLContext!;
    const query = gl.createQuery();
    if (!query) return;

    gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
    this.activeGpuTimerQuery = query;
  }

  /** DEBUG_gpuTimerQueries: closes the query started by `beginGpuTimerQuery` and queues it for polling. */
  private endGpuTimerQuery(): void {
    if (!this.gpuTimerExt || !this.activeGpuTimerQuery) return;

    this.webGLContext!.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT);
    this.pendingGpuTimerQueries.push({ query: this.activeGpuTimerQuery, frameId: this.frameId });
    this.activeGpuTimerQuery = null;
  }

  /**
   * DEBUG_gpuTimerQueries: results typically aren't ready the same frame they're
   * queried, so this drains whichever queued queries have resolved by now.
   */
  private pollGpuTimerQueries(): void {
    if (this.pendingGpuTimerQueries.length === 0) return;

    const gl = this.webGLContext!;
    const ext = this.gpuTimerExt;

    // Extension/context is gone (e.g. context loss): the queued queries are dead, drop them.
    if (!ext) {
      this.pendingGpuTimerQueries.forEach(({ query }) => gl.deleteQuery(query));
      this.pendingGpuTimerQueries = [];
      return;
    }

    // A disjoint event invalidates every outstanding query's timing, not just the current one.
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    const stillPending: Array<{ query: WebGLQuery; frameId: number }> = [];
    for (const pending of this.pendingGpuTimerQueries) {
      if (!gl.getQueryParameter(pending.query, gl.QUERY_RESULT_AVAILABLE)) {
        stillPending.push(pending);
        continue;
      }
      if (!disjoint) {
        const elapsedNs = gl.getQueryParameter(pending.query, gl.QUERY_RESULT) as number;
        // eslint-disable-next-line no-console
        console.log(
          `[sigma] DEBUG_gpuTimerQueries: frame #${pending.frameId} GPU time = ${(elapsedNs / 1e6).toFixed(2)}ms`,
        );
      }
      gl.deleteQuery(pending.query);
    }
    this.pendingGpuTimerQueries = stillPending;
  }

  /**
   * Applies position fallback and state fields after evaluateNodeStyle.
   * evaluateNodeStyle writes style properties directly into `data`; this patches
   * the remaining fields that come from attributes or state, not from style rules.
   */
  private postEvaluateNode(data: NodeDisplayData, attrs: Attributes, nodeState: BaseNodeState): void {
    // x/y fallback: style rules should provide these (DEFAULT_STYLES binds them to attributes),
    // but fall back to raw attributes in case no style rule covered position.
    const d = data as unknown as Record<string, unknown>;
    if (d.x === undefined) d.x = attrs.x;
    if (d.y === undefined) d.y = attrs.y;

    // highlighted comes from node state, not from style rules
    data.highlighted = nodeState.isHighlighted;

    // Inject declared variables: style > graph attributes > declared default
    for (let i = 0, l = this.nodeVariableEntries.length; i < l; i++) {
      const [varName, varDef] = this.nodeVariableEntries[i];
      d[varName] = d[varName] ?? attrs[varName] ?? varDef.default;
    }
  }

  /**
   * Add a node in the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private addNode(key: string): void {
    const attrs = this.internals.graph.getNodeAttributes(key);
    const nodeState = this.stateManager.getNodeState(key);

    // Reuse the existing cached object if available to avoid allocation pressure.
    // evaluateNodeStyle resets all fields before writing, so stale values don't survive.
    let data: NodeDisplayData = (this.internals.nodeDataCache[key] || {}) as NodeDisplayData;
    evaluateNodeStyle(
      this.stylesDeclaration!.nodes as Record<string, unknown>,
      attrs,
      nodeState,
      this.stateManager.graphState,
      this.internals.graph,
      data,
    );
    this.postEvaluateNode(data, attrs, nodeState);

    // Apply reducer if provided
    if (this.nodeReducer) {
      const reduced = this.nodeReducer(key, data, attrs, nodeState, this.stateManager.graphState, this.internals.graph);
      data = { ...data, ...reduced };
    }

    // Validate position (after styles + reducer, so all sources have had a chance to provide x/y)
    if (typeof data.x !== "number" || typeof data.y !== "number") {
      throw new Error(
        `Sigma: could not find a valid position (x, y) for node "${key}". ` +
          "Provide coordinates via node attributes, styles, or a nodeReducer.",
      );
    }

    // Set shape for edge clamping and multi-shape program selection
    if (this.internals.nodeShapeMap) {
      // Multi-shape program: use user-specified shape if valid, otherwise use first shape
      if (!data.shape || !(data.shape in this.internals.nodeShapeMap)) {
        data.shape = Object.keys(this.internals.nodeShapeMap)[0];
      }
    } else if (this.nodeShapeSlug) {
      // Single-shape program: use the program's shape slug
      data.shape = this.nodeShapeSlug;
    }

    this.internals.nodeDataCache[key] = data;
    this.nodeGraphCoords[key] = { x: data.x, y: data.y };

    setMembership(this.internals.nodesWithForcedLabels, key, hasForcedLabel(data));
    setMembership(this.internals.nodesWithBackdrop, key, hasBackdrop(data));

    // Place the node in its depth bucket; processNodes() re-sorts each bucket
    // by zIndex on the next render.
    this.itemBuckets.nodes.set(key, data.depth);
  }

  /**
   * Update a node the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private updateNode(key: string): void {
    this.addNode(key);

    // Re-apply normalization on the node
    const data = this.internals.nodeDataCache[key];
    this.normalizationFunction.applyTo(data);
  }

  /**
   * Remove a node from the internal data structures.
   * @private
   * @param key The node's graphology ID
   */
  private removeNode(key: string): void {
    // Remove from bucket
    this.itemBuckets.nodes.remove(key);
    // Remove from node cache
    delete this.internals.nodeDataCache[key];
    delete this.nodeGraphCoords[key];
    // Remove from node program index
    delete this.nodeProgramIndex[key];
    this.internals.dragManager.removeNode(key);
    // Remove from state
    this.stateManager.removeNode(key);
    // Remove from forced label
    this.internals.nodesWithForcedLabels.delete(key);
    // Remove from backdrop tracking
    this.internals.nodesWithBackdrop.delete(key);
  }

  /**
   * Applies variable fallbacks after evaluateEdgeStyle.
   * evaluateEdgeStyle writes style properties directly into `data`; this patches
   * declared primitive variables with attribute or default fallbacks.
   */
  private postEvaluateEdge(data: EdgeDisplayData, attrs: Attributes): void {
    const d = data as unknown as Record<string, unknown>;
    for (let i = 0, l = this.edgeVariableEntries.length; i < l; i++) {
      const [varName, varDef] = this.edgeVariableEntries[i];
      d[varName] = d[varName] ?? attrs[varName] ?? varDef.default;
    }
  }

  /**
   * Computes and injects the spread variable for parallel edges.
   * Must be called after evaluateEdgeStyle since spread is geometry-derived, not styled.
   */
  private applyEdgeSpread(edge: string, data: EdgeDisplayData, edgeState: FullEdgeState<ES>): void {
    if (edgeState.parallelCount <= 1) return;

    const source = this.internals.graph.source(edge);
    const target = this.internals.graph.target(edge);
    const isSelfLoop = source === target;

    const pathName = isSelfLoop ? data.selfLoopPath || data.path : data.parallelPath || data.path;
    const path = pathName ? this.edgePathsByName.get(pathName) : undefined;
    if (!path?.spread) return;

    const spreadFactor = data.parallelSpread ?? 0.25;
    let spreadValue = path.spread.compute(edgeState.parallelIndex, edgeState.parallelCount, spreadFactor);

    // Correct for reverse-direction non-self-loop edges: swapping source/target
    // flips the perpendicular direction, so we negate to keep visual consistency.
    if (!isSelfLoop && this.internals.graph.isDirected(edge) && source > target) {
      spreadValue = -spreadValue;
    }

    (data as unknown as Record<string, unknown>)[path.spread.variable] = spreadValue;
  }

  /**
   * Add an edge into the internal data structures.
   * @private
   * @param key The edge's graphology ID
   */
  private addEdge(key: string): void {
    const attrs = this.internals.graph.getEdgeAttributes(key);
    const edgeState = this.stateManager.getEdgeState(key);

    // Evaluate styles directly into a fresh display data object
    let data: EdgeDisplayData = {} as EdgeDisplayData;
    evaluateEdgeStyle(
      this.stylesDeclaration!.edges as Record<string, unknown>,
      attrs,
      edgeState,
      this.stateManager.graphState,
      this.internals.graph,
      data,
    );
    this.postEvaluateEdge(data, attrs);

    // Apply reducer if provided
    if (this.edgeReducer) {
      const reduced = this.edgeReducer(key, data, attrs, edgeState, this.stateManager.graphState, this.internals.graph);
      data = { ...data, ...reduced };
    }

    // Auto-compute spread variable for parallel edges
    this.applyEdgeSpread(key, data, edgeState);

    this.internals.edgeDataCache[key] = data;

    setMembership(this.internals.edgesWithForcedLabels, key, hasForcedLabel(data));

    // Place the edge in its depth bucket; processEdges() re-sorts each bucket
    // by zIndex on the next render.
    this.itemBuckets.edges.set(key, data.depth);
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
    // Remove from bucket
    this.itemBuckets.edges.remove(key);
    // Remove from edge cache
    delete this.internals.edgeDataCache[key];
    // Remove from programId index
    delete this.edgeProgramIndex[key];
    delete this.edgeTextureIndexCache[key];
    // Free edge from edge data texture
    this.internals.edgeDataTexture!.free(key);
    // Remove from state
    this.stateManager.removeEdge(key);
    // Remove from forced label
    this.internals.edgesWithForcedLabels.delete(key);
  }

  /**
   * Clear all indices related to nodes.
   * @private
   */
  private clearNodeIndices(): void {
    // labelGrid & nodeExtent are only managed/populated in the process function
    this.labelRenderer.resetLabelGrid();
    if (!this.autoRescaleFrozen) this.nodeExtent = { x: [0, 1], y: [0, 1] };
    this.internals.nodeDataCache = {};
    this.nodeGraphCoords = {};
    this.edgeProgramIndex = {};
    this.internals.nodesWithForcedLabels.clear();
    this.internals.nodesWithBackdrop.clear();
    this.prevNodeVisibilities = {};
    // Clear bucket data
    this.itemBuckets.nodes.clearAll();
    this.depthRanges.nodes = {};
    this.nodeBaseDepth = {};
  }

  /**
   * Clear all indices related to edges.
   * @private
   */
  private clearEdgeIndices(): void {
    this.internals.edgeDataCache = {};
    this.edgeProgramIndex = {};
    this.edgeTextureIndexCache = {};
    this.internals.edgesWithForcedLabels.clear();
    resetKind(this.pickingState, "edge");
    // Clear bucket data
    this.itemBuckets.edges.clearAll();
    this.depthRanges.edges = {};
    this.edgeBaseDepth = {};
    this.edgeGroups.clear();
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
    this.labelRenderer.resetFrame();
    this.internals.nodesWithBackdrop.clear();
    this.internals.dragManager.clear();
    this.autoRescaleFrozen = false;
    this.stateManager.clearNodes();
  }

  /**
   * Clear all graph state related to edges.
   * @private
   */
  private clearEdgeState(): void {
    this.labelRenderer.clearEdgeLabels();
    this.stateManager.clearEdges();
  }

  /**
   * Clear all graph state.
   * @private
   */
  private clearState(): void {
    this.clearEdgeState();
    this.clearNodeState();
    this.stateManager.resetGraphState();
  }

  /**
   * Add the node data to its program. The picking ID is looked up from the
   * picking state (callers shouldn't pass it).
   * @private
   * @param node The node's graphology ID
   * @param position The index where to place the node in the program
   */
  private addNodeToProgram(node: string, position: number): void {
    const data = this.internals.nodeDataCache[node];
    this.internals.nodeDataTexture!.allocate(node);
    this.internals.nodeDataTexture!.updateNode(
      node,
      data.x,
      data.y,
      data.size,
      this.getNodeShapeId(data),
      ...nodeRotationFlags(data),
      data.color,
    );
    const textureIndex = this.internals.nodeDataTexture!.getIndex(node);
    this.nodeProgram.process(pickingIdOf(this.pickingState, "node", node), position, data, textureIndex, node);
    this.nodeProgramIndex[node] = position;
  }

  /**
   * Add the edge data to its program. The picking ID is looked up from the
   * picking state (callers shouldn't pass it).
   * @private
   * @param edge The edge's graphology ID
   * @param position The index where to place the edge in the program
   */
  private addEdgeToProgram(edge: string, position: number): void {
    const data = this.internals.edgeDataCache[edge];
    const source = this.internals.graph.source(edge);
    const target = this.internals.graph.target(edge);

    const edgeTextureIndex = this.internals.edgeDataTexture!.allocate(edge);
    this.edgeTextureIndexCache[edge] = edgeTextureIndex;

    const isSelfLoop = source === target;
    const isParallel = !isSelfLoop && (this.stateManager.getEdgeState(edge)?.parallelCount ?? 1) > 1;
    const { pathId, headId, tailId, headLengthRatio, tailLengthRatio } = this.edgeProgram.resolveEdgeIds(
      data,
      isSelfLoop,
      isParallel,
    );

    this.internals.edgeDataTexture!.updateEdge(
      edge,
      this.internals.nodeDataTexture!.getIndex(source),
      this.internals.nodeDataTexture!.getIndex(target),
      data.size,
      headLengthRatio,
      tailLengthRatio,
      pathId,
      headId,
      tailId,
    );

    this.edgeProgram.process(
      pickingIdOf(this.pickingState, "edge", edge),
      position,
      this.internals.nodeDataCache[source],
      this.internals.nodeDataCache[target],
      data,
      edgeTextureIndex,
    );
    this.edgeProgramIndex[edge] = position;
  }

  /**---------------------------------------------------------------------------
   * Public API.
   **---------------------------------------------------------------------------
   */

  /**
   * Function used to get the render params.
   *
   * @return {RenderParams}
   */
  getRenderParams(): RenderParams {
    return {
      frameId: this.frameId,
      matrix: this.matrix,
      invMatrix: this.invMatrix,
      width: this.width,
      height: this.height,
      pixelRatio: this.internals.pixelRatio,
      zoomRatio: this.camera.ratio,
      cameraAngle: this.camera.angle,
      sizeRatio: 1 / this.scaleSize(),
      correctionRatio: this.correctionRatio,
      downSizingRatio: this.internals.settings.pickingDownSizingRatio,
      minEdgeThickness: this.internals.settings.minEdgeThickness,
      antiAliasingFeather: this.internals.settings.antiAliasingFeather,
      nodePickingPadding: this.internals.settings.nodePickingPadding,
      edgePickingPadding: this.internals.settings.edgePickingPadding,
      labelPickingPadding: this.internals.settings.labelPickingPadding,
      nodeDataTextureUnit: NODE_DATA_TEXTURE_UNIT,
      nodeDataTextureWidth: this.internals.nodeDataTexture!.getTextureWidth(),
      nodeFrameTextureUnit: NODE_FRAME_TEXTURE_UNIT,
      nodeFrameTextureWidth: this.internals.nodeFrameTexture!.getTextureWidth(),
      edgeDataTextureUnit: EDGE_DATA_TEXTURE_UNIT,
      edgeDataTextureWidth: this.internals.edgeDataTexture!.getTextureWidth(),
      edgeFrameTextureUnit: EDGE_FRAME_TEXTURE_UNIT,
      edgeFrameTextureWidth: this.internals.edgeFrameTexture!.getTextureWidth(),
      pickingFrameBuffer: this.pickingFrameBuffer,
      labelPixelSnapping: this.internals.settings.labelPixelSnapping ? 1.0 : 0.0,
    };
  }

  /**
   * Function used to retrieve the actual stage padding value.
   *
   * @return {number}
   */
  getStagePadding(): number {
    const { stagePadding, autoRescale } = this.internals.settings;
    return autoRescale ? stagePadding || 0 : 0;
  }

  /**
   * Resolves a layer element by id, checking both built-in layers (stage,
   * mouse) and extra layers added via createLayer.
   */
  private getLayerElement(id: string): HTMLElement {
    if (id === "mouse") return this.mouseLayer;
    const element = this.extraElements[id];
    if (!element) throw new Error(`Sigma: layer "${id}" does not exist`);
    return element;
  }

  /**
   * Initializes the main WebGL 2 context on the stage canvas, with picking
   * framebuffer.
   */
  private initWebGLContext(): void {
    const gl = this.createWebGLContext("stage");
    this.stageCanvas = this.extraElements.stage as HTMLCanvasElement;
    this.webGLContext = gl;

    // preventDefault asks the browser to restore the context later, unless sigma was killed
    this.stageCanvas.addEventListener("webglcontextlost", (event) => {
      if (!this.webGLContext) return;
      event.preventDefault();
      this.contextLost = true;
      if (this.renderFrame) {
        cancelAnimationFrame(this.renderFrame);
        this.renderFrame = null;
      }
      // DEBUG_gpuTimerQueries: the extension handle and any in-flight queries die with the context.
      this.gpuTimerExt = undefined;
      this.activeGpuTimerQuery = null;
      this.pendingGpuTimerQueries = [];
      this.emit("webglContextLost");
    });
    this.stageCanvas.addEventListener("webglcontextrestored", () => {
      // rAF is paused in hidden tabs, so only visible tabs re-acquire contexts
      requestAnimationFrame(() => {
        if (this.webGLContext && !this.webGLContext.isContextLost()) this.restoreWebGLContext();
      });
    });

    this.initPickingFramebuffer();
  }

  /**
   * (Re)creates the picking framebuffer, at construction and after a context
   * restore. It starts at 1x1, and resetWebGLTexture sizes it on each render.
   */
  private initPickingFramebuffer(): void {
    const gl = this.webGLContext!;

    const frameBuffer = gl.createFramebuffer();
    if (!frameBuffer) throw new Error(`Sigma: cannot create picking frame buffer`);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    // Create picking texture for IDs (single attachment, no blending needed)
    const pickingTexture = gl.createTexture();
    if (!pickingTexture) throw new Error(`Sigma: cannot create picking texture`);
    gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    // NEAREST filtering for exact pixel reads (no interpolation)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);

    // Create depth buffer for proper depth testing during picking
    const depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) throw new Error(`Sigma: cannot create picking depth buffer`);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1, 1);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // Verify framebuffer is complete
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Sigma: picking framebuffer is not complete`);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.pickingFrameBuffer = frameBuffer;
    this.pickingTexture = pickingTexture;
    this.pickingDepthBuffer = depthBuffer;
  }

  /**
   * (Re)generates node and edge programs from primitives, at construction and
   * after a context restore. Returns the internals-bound programs.
   */
  private initPrograms(primitives: PrimitivesDeclaration | null) {
    const sigma = this as unknown as Sigma<N, E, G>;
    const gl = this.webGLContext!;

    const {
      nodeProgram,
      labelProgram,
      backdropProgram,
      labelBackgroundProgram,
      attachmentProgram,
      framePass,
      shapeSlug: nodeShapeSlug,
      shapeNameToIndex: nodeShapeMap,
      shapeGlobalIds: nodeGlobalShapeIds,
      variables: nodeVariables,
    } = generateNodeProgram<N, E, G>(gl, this.pickingFrameBuffer, sigma, primitives?.nodes);
    this.nodeProgram = nodeProgram;
    this.nodeFramePass = framePass;
    this.nodeVariableEntries = Object.entries(nodeVariables) as [string, { type: string; default: unknown }][];
    if (nodeShapeSlug) this.nodeShapeSlug = nodeShapeSlug;

    const {
      edgeProgram,
      labelProgram: edgeLabelProgram,
      labelBackgroundProgram: edgeLabelBackgroundProgram,
      framePass: edgeFramePass,
      variables: edgeVariables,
      paths: edgePaths,
    } = generateEdgeProgram<N, E, G>(gl, this.pickingFrameBuffer, sigma, primitives?.edges);
    this.edgeProgram = edgeProgram;
    this.edgeFramePass = edgeFramePass;
    this.edgeVariableEntries = Object.entries(edgeVariables) as [string, { type: string; default: unknown }][];
    this.edgePathsByName = new Map(edgePaths.map((p) => [p.name, p]));

    return {
      labelProgram,
      edgeLabelProgram,
      edgeLabelBackgroundProgram,
      backdropProgram,
      labelBackgroundProgram,
      attachmentProgram,
      nodeShapeMap: nodeShapeMap ?? null,
      nodeGlobalShapeIds: nodeGlobalShapeIds ?? null,
    };
  }

  /**
   * Rebuilds all GPU resources after a context restore: the context object is
   * valid again, only its resources died.
   */
  private restoreWebGLContext(): void {
    const internals = this.internals;

    this.initPickingFramebuffer();

    internals.nodeDataTexture?.restore();
    internals.nodeFrameTexture?.restore();
    internals.edgeDataTexture?.restore();
    internals.edgeFrameTexture?.restore();
    internals.attachmentManager?.restore();
    internals.hoverResolver.reset();

    Object.assign(internals, this.initPrograms(internals.primitives));

    // Custom layer programs are user code: rebuild each from its factory
    for (const entry of this.customLayerPrograms.values()) {
      entry.program.kill();
      entry.program = entry.factory(this.webGLContext!);
    }

    this.contextLost = false;
    this.emit("webglContextRestored");
    this.refresh();
  }

  /**
   * Function used to create a layer element.
   *
   * @param {string} id - Context's id.
   * @param {string} tag - The HTML tag to use.
   * @param options
   * @return {Sigma}
   */
  createLayer<T extends HTMLElement>(
    id: string,
    tag: string,
    options: { style?: Partial<CSSStyleDeclaration> } & ({ beforeLayer?: string } | { afterLayer?: string }) = {},
  ): T {
    if (this.extraElements[id]) throw new Error(`Sigma: a layer named "${id}" already exists`);

    const element = createElement<T>(
      tag,
      {
        position: "absolute",
      },
      {
        class: `sigma-${id}`,
      },
    );

    if (options.style) Object.assign(element.style, options.style);

    this.extraElements[id] = element;

    if ("beforeLayer" in options && options.beforeLayer) {
      this.getLayerElement(options.beforeLayer).before(element);
    } else if ("afterLayer" in options && options.afterLayer) {
      this.getLayerElement(options.afterLayer).after(element);
    } else {
      this.container.appendChild(element);
    }

    return element;
  }

  /**
   * Function used to create a canvas element.
   *
   * @param {string} id - Context's id.
   * @param options
   * @return {Sigma}
   */
  createCanvas(
    id: string,
    options: { style?: Partial<CSSStyleDeclaration> } & ({ beforeLayer?: string } | { afterLayer?: string }) = {},
  ): HTMLCanvasElement {
    return this.createLayer(id, "canvas", options);
  }

  /**
   * Creates a new canvas layer registered under `id` (killable via
   * `killLayer`) and attaches a WebGL 2 context to it.
   */
  createWebGLContext(
    id: string,
    options: {
      preserveDrawingBuffer?: boolean;
      antialias?: boolean;
      hidden?: boolean;
      style?: Partial<CSSStyleDeclaration>;
    } & ({ beforeLayer?: string } | { afterLayer?: string }) = {},
  ): WebGL2RenderingContext {
    const canvas = this.createCanvas(id, options);
    if (options.hidden) canvas.remove();

    const gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: false,
      antialias: false,
      depth: true,
      ...options,
    });

    if (!gl) {
      throw new Error(
        "Sigma: WebGL 2 is not supported by your browser. " +
          "Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).",
      );
    }

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    return gl;
  }

  /**
   * Function used to properly kill a layer.
   *
   * @param  {string} id - Layer id.
   * @return {Sigma}
   */
  killLayer(id: string): this {
    if (id === "stage" || id === "mouse") throw new Error(`Sigma: cannot kill built-in layer "${id}"`);

    const element = this.extraElements[id];

    if (!element) throw new Error(`Sigma: cannot kill layer ${id}, which does not exist`);

    // Delete layer element
    element.remove();
    delete this.extraElements[id];

    return this;
  }

  /**
   * Method returning the main WebGL context used by the renderer.
   */
  getWebGLContext(): WebGL2RenderingContext {
    if (!this.webGLContext) throw new Error("Sigma: WebGL context is not available");
    return this.webGLContext;
  }

  /**
   * Returns the shared node data texture (position, size, shapeId per node).
   * GPU-side position writers can use it to target their writes (see the
   * "afterTexturesUpload" event). The texture object is recreated when its
   * capacity grows, so consumers holding a WebGLTexture handle must re-read it
   * every frame.
   */
  getNodeDataTexture(): NodeDataTexture {
    if (!this.internals.nodeDataTexture) throw new Error("Sigma: node data texture is not available");
    return this.internals.nodeDataTexture;
  }

  /**
   * Returns the current normalization function, mapping graph coordinates to
   * the ~[0, 1] framed-graph space stored in the node data texture (and back,
   * through its `inverse` method).
   */
  getNormalizationFunction(): NormalizationFunction {
    return this.normalizationFunction;
  }

  /**
   * Registers a custom layer program under a unique `id`, so it can later be
   * removed with {@link Sigma#removeCustomLayerProgram}. It renders at the given
   * `depth`, which must be declared in the primitives depthLayers array; several
   * programs may share a depth and render in registration order. Reusing an `id`
   * disposes the program previously registered under it. The `factory` is
   * re-invoked when a lost WebGL context is restored.
   */
  addCustomLayerProgram(
    id: string,
    depth: ExtractDepthLayersFromPrimitives<P>,
    factory: CustomLayerProgramFactory,
  ): this {
    if (!this.depthLayers.includes(depth))
      throw new Error(
        `Sigma: cannot add custom layer program at depth "${depth}", ` +
          `it must be declared in primitives.depthLayers. Current layers: ${this.depthLayers.join(", ")}`,
      );
    this.customLayerPrograms.get(id)?.program.kill();
    this.customLayerPrograms.set(id, { depth, factory, program: factory(this.webGLContext!) });
    this.refresh();
    return this;
  }

  /**
   * Removes (and disposes) the custom layer program registered under the given id.
   */
  removeCustomLayerProgram(id: string): this {
    const entry = this.customLayerPrograms.get(id);
    if (entry) {
      entry.program.kill();
      this.customLayerPrograms.delete(id);
      this.scheduleRender();
    }
    return this;
  }

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
  setCamera(camera: Camera): this {
    this.camera.cancelAnimation();
    this.unbindCameraHandlers();
    this.camera = camera;
    this.bindCameraHandlers();
    this.scheduleRender();
    return this;
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
  getGraph(): Graph<N, E, G> {
    return this.internals.graph;
  }

  /**
   * Method used to set the renderer's graph.
   *
   * @return {Sigma}
   */
  setGraph(graph: Graph<N, E, G>): this {
    if (graph === this.internals.graph) return this;

    // Keep states of items that exist in the new graph, drop the rest
    this.stateManager.pruneNodes((node) => graph.hasNode(node));
    this.stateManager.pruneEdges((edge) => graph.hasEdge(edge));

    // Unbinding handlers on the current graph
    this.unbindGraphHandlers();

    if (this.checkEdgesEventsFrame !== null) {
      cancelAnimationFrame(this.checkEdgesEventsFrame);
      this.checkEdgesEventsFrame = null;
    }

    // Installing new graph
    this.internals.graph = graph;

    // The extent frozen by autoRescale "once" belongs to the previous graph:
    this.autoRescaleFrozen = false;

    // Binding new handlers
    this.bindGraphHandlers();

    // Re-rendering now to avoid discrepancies from now to next frame
    this.refresh();

    return this;
  }

  /**
   * Method returning the mouse captor.
   *
   * @return {MouseCaptor}
   */
  getMouseCaptor(): MouseCaptor<N, E, G> {
    return this.mouseCaptor;
  }

  /**
   * Method returning the touch captor.
   *
   * @return {TouchCaptor}
   */
  getTouchCaptor(): TouchCaptor<N, E, G> {
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
   * It's useful for example to get the position of a node
   * and to get values that are set by the nodeReducer
   *
   * @param  {string} key - The node's key.
   * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
   */
  getNodeDisplayData(key: string): NodeDisplayData | undefined {
    const node = this.internals.nodeDataCache[key];
    return node ? Object.assign({}, node) : undefined;
  }

  /**
   * Method used to get all the sigma edge attributes.
   * It's useful for example to get values that are set by the edgeReducer.
   *
   * @param  {string} key - The edge's key.
   * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
   */
  getEdgeDisplayData(key: string): EdgeDisplayData | undefined {
    const edge = this.internals.edgeDataCache[key];
    return edge ? Object.assign({}, edge) : undefined;
  }

  /**
   * =========================================================================
   * STATE MANAGEMENT API
   * =========================================================================
   */

  /**
   * Method returning a node's state.
   *
   * @param  {string} key - The node's key.
   * @return {FullNodeState<NS>} The node's state.
   */
  getNodeState(key: string): FullNodeState<NS> {
    return this.stateManager.getNodeState(key);
  }

  /**
   * Method returning an edge's state.
   *
   * @param  {string} key - The edge's key.
   * @return {FullEdgeState<ES>} The edge's state.
   */
  getEdgeState(key: string): FullEdgeState<ES> {
    return this.stateManager.getEdgeState(key);
  }

  /**
   * Method returning the graph's state.
   *
   * @return {FullGraphState<GS>} The graph's state.
   */
  getGraphState(): FullGraphState<GS> {
    return this.stateManager.getGraphState();
  }

  /**
   * Method to update a node's state.
   *
   * @param  {string} key - The node's key.
   * @param  {Partial<FullNodeState<NS>>} state - Partial state to merge.
   * @return {this}
   */
  setNodeState(key: string, state: Partial<BaseNodeState> | Partial<FullNodeState<NS>>): this {
    this.stateManager.setNodeState(key, state);
    return this;
  }

  /**
   * Method to update an edge's state.
   *
   * @param  {string} key - The edge's key.
   * @param  {Partial<FullEdgeState<ES>>} state - Partial state to merge.
   * @return {this}
   */
  setEdgeState(key: string, state: Partial<BaseEdgeState> | Partial<FullEdgeState<ES>>): this {
    this.stateManager.setEdgeState(key, state);
    return this;
  }

  /**
   * Method to update the graph's state.
   *
   * @param  {Partial<FullGraphState<GS>>} state - Partial state to merge.
   * @return {this}
   */
  setGraphState(state: Partial<BaseGraphState> | Partial<FullGraphState<GS>>): this {
    this.stateManager.setGraphState(state);
    return this;
  }

  /**
   * Internal: toggle the graph-level `isPanning` flag. Called by captors when
   * the user starts/stops dragging the stage. Not meant for user code, use
   * `setGraphState` for custom flags instead.
   */
  _setPanning(isPanning: boolean): void {
    this.stateManager.setGraphState({ isPanning });
  }

  /**
   * Internal: toggle the graph-level `isZooming` flag. Called by captors for
   * non-animated zoom gestures (e.g. pinch), which bypass `camera.animate`.
   * Animated zooms are tracked automatically via camera events.
   */
  _setZooming(isZooming: boolean): void {
    this.stateManager.setGraphState({ isZooming });
  }

  /**
   * Internal: whether a node is being dragged.
   */
  _hasNodeDrag(): boolean {
    const { dragManager } = this.internals;
    return !!(dragManager.pendingNode || dragManager.session);
  }

  /**
   * Internal: display the shared-gestures hint. Called by captors when a plain
   * gesture reaches the stage while `gestureTarget` is "shared".
   */
  _showGestureHint(gesture: "wheel" | "touch"): void {
    const settings = this.internals.settings;
    if (settings.gestureTarget !== "shared") return;

    this.gestureHint = this.gestureHint || new GestureHint(this.container);
    this.gestureHint.show(gesture, settings);
  }

  /**
   * Method to update multiple nodes' states at once.
   *
   * @param  {string[]} keys - The nodes' keys.
   * @param  {Partial<FullNodeState<NS>>} state - Partial state to merge.
   * @return {this}
   */
  setNodesState(keys: string[], state: Partial<BaseNodeState> | Partial<FullNodeState<NS>>): this {
    this.stateManager.setNodesState(keys, state);
    return this;
  }

  /**
   * Method to update multiple edges' states at once.
   *
   * @param  {string[]} keys - The edges' keys.
   * @param  {Partial<FullEdgeState<ES>>} state - Partial state to merge.
   * @return {this}
   */
  setEdgesState(keys: string[], state: Partial<BaseEdgeState> | Partial<FullEdgeState<ES>>): this {
    this.stateManager.setEdgesState(keys, state);
    return this;
  }

  /**
   * Update the container's CSS cursor based on the currently hovered item,
   * falling back to the stage cursor style. The hovered item's kind owns the
   * cursor lookup (e.g. node labels read `labelCursor` rather than `cursor`).
   */
  private updateContainerCursor(): void {
    const hit = this.stateManager.hovered;
    const stage = this.resolvedStageStyle.cursor || "";
    this.container.style.cursor = hit ? getCursor(this.internals, hit) || stage : stage;
  }

  /**
   * Re-evaluate stage styles and apply them to the container.
   */
  private refreshStageStyle(): void {
    this.resolvedStageStyle = evaluateStageStyle(
      this.stylesDeclaration!.stage as Record<string, unknown> | Record<string, unknown>[],
      this.stateManager.graphState,
    );

    // Apply background
    if (this.resolvedStageStyle.background !== undefined) {
      this.container.style.backgroundColor = this.resolvedStageStyle.background;
    }

    // Apply cursor (respecting hovered item override)
    this.updateContainerCursor();
  }

  /**
   * Method used to get the set of currently displayed node labels.
   *
   * @return {Set<string>} A set of node keys whose label is displayed.
   */
  getNodeDisplayedLabels(): Set<string> {
    return new Set(this.labelRenderer.displayedNodeLabels);
  }

  /**
   * Method used to get the set of currently displayed edge labels.
   *
   * @return {Set<string>} A set of edge keys whose label is displayed.
   */
  getEdgeDisplayedLabels(): Set<string> {
    return new Set(this.labelRenderer.displayedEdgeLabels);
  }

  /**
   * Method returning a copy of the settings collection.
   *
   * @return {Settings} A copy of the settings collection.
   */
  getSettings(): Settings {
    return { ...this.internals.settings };
  }

  /**
   * Method returning the current value for a given setting key.
   *
   * @param  {string} key - The setting key to get.
   * @return {any} The value attached to this setting key or undefined if not found
   */
  getSetting<K extends keyof Settings>(key: K): Settings[K] {
    return this.internals.settings[key];
  }

  /**
   * Method returning a copy of the styles declaration, as resolved at
   * construction (i.e. with the defaults applied when none was given).
   *
   * The copy is shallow: the rules it points to are the renderer's own, and
   * must be treated as read-only. Build new arrays and objects rather than
   * mutating them in place.
   *
   * @return {StylesDeclaration} A copy of the styles declaration.
   */
  getStyles(): StylesDeclaration<N, E, NS, ES, GS> {
    return { ...this.stylesDeclaration! };
  }

  /**
   * Method returning a copy of the primitives declaration, as resolved at
   * construction (i.e. with the defaults applied when none was given).
   *
   * The copy is shallow: the rules it points to are the renderer's own, and
   * must be treated as read-only. Build new arrays and objects rather than
   * mutating them in place.
   *
   * @return {PrimitivesDeclaration} A copy of the primitives declaration.
   */
  getPrimitives(): PrimitivesDeclaration {
    return { ...this.internals.primitives! };
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
    this.internals.settings[key] = value;
    validateSettings(this.internals.settings);
    this.handleSettingsUpdate();
    this.scheduleRefresh();
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
    this.setSetting(key, updater(this.internals.settings[key]));
    return this;
  }

  /**
   * Method setting multiple settings at once.
   *
   * @param  {Partial<Settings>} settings - The settings to set.
   * @return {Sigma}
   */
  setSettings(settings: Partial<Settings>): this {
    this.internals.settings = { ...this.internals.settings, ...settings };
    validateSettings(this.internals.settings);
    this.handleSettingsUpdate();
    this.scheduleRefresh();
    return this;
  }

  /**
   * Method used to resize the renderer.
   *
   * @param  {boolean} force - If true, then resize is processed even if size is unchanged (optional).
   * @return {Sigma}
   */
  resize(force?: boolean): this {
    const previousWidth = this.width,
      previousHeight = this.height;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.internals.pixelRatio = getPixelRatio();

    if (this.width === 0) {
      if (this.internals.settings.allowInvalidContainer) this.width = 1;
      else
        throw new Error(
          "Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.",
        );
    }

    if (this.height === 0) {
      if (this.internals.settings.allowInvalidContainer) this.height = 1;
      else
        throw new Error(
          "Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.",
        );
    }

    // If nothing has changed, we can stop right here
    if (!force && previousWidth === this.width && previousHeight === this.height) return this;

    // Sizing dom elements (stage is in extraElements)
    for (const element of [this.mouseLayer, ...Object.values(this.extraElements)]) {
      element.style.width = this.width + "px";
      element.style.height = this.height + "px";
    }

    // Sizing WebGL context
    if (this.webGLContext) {
      this.stageCanvas.setAttribute("width", this.width * this.internals.pixelRatio + "px");
      this.stageCanvas.setAttribute("height", this.height * this.internals.pixelRatio + "px");

      this.webGLContext.viewport(0, 0, this.width * this.internals.pixelRatio, this.height * this.internals.pixelRatio);
    }

    this.emit("resize");

    return this;
  }

  /**
   * Method used to clear all the canvases.
   *
   * @return {Sigma}
   */
  clear(): this {
    this.emit("beforeClear");

    this.webGLContext!.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    this.webGLContext!.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);

    this.emit("afterClear");
    return this;
  }

  /**
   * Schedule a state-only refresh: re-evaluate all styles in-place without
   * rebuilding program arrays. Depth changes are handled via fragmented ranges.
   */
  private scheduleStateRefresh(): void {
    this.needToRefreshState = true;
    this.scheduleRender();
  }

  /**
   * Re-evaluate item styles in-place. Uses dependency classification to skip
   * items whose styles can't have changed.
   */
  private refreshState(): void {
    // Recompute graph-level flags from node/edge states if needed (deferred from setState calls)
    this.stateManager.flushGraphStateFlags();

    const needFullNodeRefresh =
      this.stateManager.graphStateChanged && this.internals.nodeStyleAnalysis.dependency === "graph-state";
    const needFullEdgeRefresh =
      this.stateManager.graphStateChanged && this.edgeStyleAnalysis.dependency === "graph-state";

    // A zIndex change reorders items, which an in-place refresh cannot apply
    // (render order is buffer order). Track it and escalate to a reprocess below.
    let orderChanged = false;

    // Nodes
    if (needFullNodeRefresh) {
      this.internals.graph.forEachNode((node) => {
        if (this.refreshNodeState(node)) orderChanged = true;
      });
    } else if (this.internals.nodeStyleAnalysis.dependency !== "static") {
      for (const node of this.stateManager.dirtyNodes) {
        if (this.refreshNodeState(node)) orderChanged = true;
      }
    }

    // Edges
    if (needFullEdgeRefresh) {
      this.internals.graph.forEachEdge((edge) => {
        if (this.refreshEdgeState(edge)) orderChanged = true;
      });
    } else if (this.edgeStyleAnalysis.dependency !== "static") {
      for (const edge of this.stateManager.dirtyEdges) {
        if (this.refreshEdgeState(edge)) orderChanged = true;
      }
    }

    // Stage styles
    if (this.stateManager.graphStateChanged && this.stylesDeclaration?.stage) {
      this.refreshStageStyle();
    }

    this.stateManager.clearDirtyTracking();

    // render() runs the escalated reprocess right after refreshState().
    if (orderChanged) this.pendingProcess = "full";
  }

  /**
   * Re-evaluate a single node's style and rewrite its GPU data.
   * Lean path: patches cache in place, skips unchanged bookkeeping.
   */
  private refreshNodeState(node: string): boolean {
    const data = this.internals.nodeDataCache[node];

    // If node not yet cached or a reducer exists, fall back to full path
    if (!data || this.nodeReducer) {
      const oldDepth = this.internals.nodeDataCache[node]?.depth;
      const oldZIndex = this.internals.nodeDataCache[node]?.zIndex;
      const oldAttachment = this.internals.nodeDataCache[node]?.labelAttachment;
      this.updateNode(node);
      const newData = this.internals.nodeDataCache[node];
      if (this.internals.attachmentManager && newData.labelAttachment !== oldAttachment) {
        this.internals.attachmentManager.invalidateNode(node);
      }
      let shapeId: number;
      if (
        this.internals.nodeShapeMap &&
        this.internals.nodeGlobalShapeIds &&
        newData.shape &&
        newData.shape in this.internals.nodeShapeMap
      ) {
        shapeId = this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[newData.shape]];
      } else {
        shapeId = getShapeId(newData.shape || "circle");
      }
      this.internals.nodeDataTexture!.updateNode(
        node,
        newData.x,
        newData.y,
        newData.size,
        shapeId,
        ...nodeRotationFlags(newData),
        newData.color,
      );
      if (oldDepth && newData.depth !== oldDepth) {
        this.updateNodeDepthRanges(node, oldDepth, newData.depth);
      }
      const programIndex = this.nodeProgramIndex[node];
      if (programIndex !== undefined) {
        this.addNodeToProgram(node, programIndex);
        this.nodeProgram.invalidateBuffers();
      }
      return oldZIndex !== undefined && newData.zIndex !== oldZIndex;
    }

    // Re-evaluate style directly into the cached display data object
    const attrs = this.internals.graph.getNodeAttributes(node);
    const nodeState = this.stateManager.getNodeState(node);

    // Save old values before patching
    const oldSize = data.size;
    const oldShape = data.shape;
    const oldDepth = data.depth;
    const oldZIndex = data.zIndex;
    const oldAttachment = data.labelAttachment;
    const oldRotationAlignment = data.rotationAlignment;
    const oldLabelRotationAlignment = data.labelRotationAlignment;
    const oldColor = data.color;

    evaluateNodeStyle(
      this.stylesDeclaration!.nodes as Record<string, unknown>,
      attrs,
      nodeState,
      this.stateManager.graphState,
      this.internals.graph,
      data,
    );
    this.postEvaluateNode(data, attrs, nodeState);

    // Update raw graph coords and normalize
    const graphCoords = this.nodeGraphCoords[node];
    const rawPositionChanged = data.x !== graphCoords.x || data.y !== graphCoords.y;
    if (rawPositionChanged) {
      graphCoords.x = data.x;
      graphCoords.y = data.y;
    }
    // Always re-normalize (data.x/y are raw at this point)
    this.normalizationFunction.applyTo(data);

    // Set shape
    if (this.internals.nodeShapeMap) {
      if (!data.shape || !(data.shape in this.internals.nodeShapeMap)) {
        data.shape = Object.keys(this.internals.nodeShapeMap)[0];
      }
    } else if (this.nodeShapeSlug) {
      data.shape = this.nodeShapeSlug;
    }

    if (this.internals.attachmentManager && data.labelAttachment !== oldAttachment) {
      this.internals.attachmentManager.invalidateNode(node);
    }

    setMembership(this.internals.nodesWithForcedLabels, node, hasForcedLabel(data));
    setMembership(this.internals.nodesWithBackdrop, node, hasBackdrop(data));

    // Node data texture only if position/size/shape/rotation/color changed
    if (
      rawPositionChanged ||
      data.size !== oldSize ||
      data.shape !== oldShape ||
      data.rotationAlignment !== oldRotationAlignment ||
      data.labelRotationAlignment !== oldLabelRotationAlignment ||
      data.color !== oldColor
    ) {
      let shapeId: number;
      if (
        this.internals.nodeShapeMap &&
        this.internals.nodeGlobalShapeIds &&
        data.shape &&
        data.shape in this.internals.nodeShapeMap
      ) {
        shapeId = this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[data.shape]];
      } else {
        shapeId = getShapeId(data.shape || "circle");
      }
      this.internals.nodeDataTexture!.updateNode(
        node,
        data.x,
        data.y,
        data.size,
        shapeId,
        ...nodeRotationFlags(data),
        data.color,
      );
    }

    // Update the depth bucket. A depth change is reflected immediately via
    // depth ranges; a zIndex change is a reordering, escalated by the boolean
    // returned below.
    this.itemBuckets.nodes.set(node, data.depth);
    if (data.depth !== oldDepth) this.updateNodeDepthRanges(node, oldDepth, data.depth);

    // GPU program update
    const programIndex = this.nodeProgramIndex[node];
    if (programIndex !== undefined) {
      this.addNodeToProgram(node, programIndex);
      this.nodeProgram.invalidateBuffers();
    }

    return data.zIndex !== oldZIndex;
  }

  /**
   * Re-evaluate a single edge's style and rewrite its GPU data.
   * Lean path: re-evaluates style but patches cache in place, skips
   * unchanged bookkeeping, and avoids full addEdgeToProgram overhead.
   */
  private refreshEdgeState(edge: string): boolean {
    const data = this.internals.edgeDataCache[edge];

    // If edge not yet cached or a reducer exists, fall back to full path
    if (!data || this.edgeReducer) {
      const oldDepth = data?.depth;
      const oldZIndex = data?.zIndex;
      this.updateEdge(edge);
      const newData = this.internals.edgeDataCache[edge];
      if (oldDepth && newData.depth !== oldDepth) {
        this.updateEdgeDepthRanges(edge, oldDepth, newData.depth);
      }
      const programIndex = this.edgeProgramIndex[edge];
      if (programIndex !== undefined) {
        this.addEdgeToProgram(edge, programIndex);
        this.edgeProgram.invalidateBuffers();
      }
      return oldZIndex !== undefined && newData.zIndex !== oldZIndex;
    }

    // Re-evaluate style directly into the cached display data object
    const attrs = this.internals.graph.getEdgeAttributes(edge);
    const edgeState = this.stateManager.getEdgeState(edge);

    // Save old values before patching (for skip checks below)
    const oldDepth = data.depth;
    const oldZIndex = data.zIndex;
    const oldSize = data.size;
    const oldPath = data.path;
    const oldSelfLoopPath = data.selfLoopPath;
    const oldParallelPath = data.parallelPath;
    const oldHead = data.head;
    const oldTail = data.tail;

    evaluateEdgeStyle(
      this.stylesDeclaration!.edges as Record<string, unknown>,
      attrs,
      edgeState,
      this.stateManager.graphState,
      this.internals.graph,
      data,
    );
    this.postEvaluateEdge(data, attrs);

    // Recompute spread variable for parallel edges
    this.applyEdgeSpread(edge, data, edgeState);

    setMembership(this.internals.edgesWithForcedLabels, edge, hasForcedLabel(data));

    // Update the depth bucket. A depth change is reflected immediately via
    // depth ranges; a zIndex change is a reordering, escalated by the boolean
    // returned below.
    this.itemBuckets.edges.set(edge, data.depth);
    if (data.depth !== oldDepth) this.updateEdgeDepthRanges(edge, oldDepth, data.depth);

    // GPU update
    const programIndex = this.edgeProgramIndex[edge];
    if (programIndex !== undefined) {
      const structuralDataChanged =
        data.size !== oldSize ||
        data.path !== oldPath ||
        data.selfLoopPath !== oldSelfLoopPath ||
        data.parallelPath !== oldParallelPath ||
        data.head !== oldHead ||
        data.tail !== oldTail;

      if (structuralDataChanged) {
        this.addEdgeToProgram(edge, programIndex);
        this.edgeProgram.invalidateBuffers();
      } else {
        // Fast path: skip edge data texture, only update vertex buffer + attribute texture
        const source = this.internals.graph.source(edge);
        const target = this.internals.graph.target(edge);
        const sourceData = this.internals.nodeDataCache[source];
        const targetData = this.internals.nodeDataCache[target];
        const edgeTextureIndex = this.edgeTextureIndexCache[edge];

        this.edgeProgram.process(
          pickingIdOf(this.pickingState, "edge", edge),
          programIndex,
          sourceData,
          targetData,
          data,
          edgeTextureIndex,
        );
        this.edgeProgram.invalidateBuffers();
      }
    }

    return data.zIndex !== oldZIndex;
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
      this.internals.graph.forEachNode((node) => this.addNode(node));
      this.edgeGroups.rebuild();
      this.internals.graph.forEachEdge((edge) => this.addEdge(edge));
      this.pendingProcess = "full";
    } else {
      const nodes = opts.partialGraph?.nodes || [];
      for (let i = 0, l = nodes?.length || 0; i < l; i++) {
        const node = nodes[i];
        const oldAttachment = this.internals.nodeDataCache[node]?.labelAttachment;
        // Recompute node's data (ie. apply reducer)
        this.updateNode(node);
        // Invalidate attachment cache since graph attributes may have changed
        if (
          this.internals.attachmentManager &&
          (this.internals.nodeDataCache[node]?.labelAttachment || oldAttachment)
        ) {
          this.internals.attachmentManager.invalidateNode(node);
        }
        // Add node to the program if layout is unchanged.
        // otherwise it will be done in the process function
        if (skipIndexation) {
          const programIndex = this.nodeProgramIndex[node];
          if (programIndex === undefined) throw new Error(`Sigma: node "${node}" can't be repaint`);
          this.addNodeToProgram(node, programIndex);
        }
      }
      if (skipIndexation && nodes.length > 0) this.nodeProgram.invalidateBuffers();

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
          this.addEdgeToProgram(edge, programIndex);
        }
      }
      if (skipIndexation && edges.length > 0) this.edgeProgram.invalidateBuffers();

      // Determine how much reprocessing is needed on the next render
      if (!skipIndexation && this.pendingProcess !== "full") {
        this.pendingProcess = edges.length > 0 ? "full" : "nodes";
      }
    }

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
      this.renderFrame = requestAnimationFrame(() => {
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
  scheduleRefresh(opts?: { partialGraph?: { nodes?: string[]; edges?: string[] }; skipIndexation?: boolean }): this {
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

    const { minCameraRatio, maxCameraRatio } = this.internals.settings;
    if (typeof maxCameraRatio === "number") newRatio = Math.min(newRatio, maxCameraRatio);
    if (typeof minCameraRatio === "number") newRatio = Math.max(newRatio, minCameraRatio);
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
    const p1 = this.viewportToFramedGraph({ x: 0, y: 0 }),
      p2 = this.viewportToFramedGraph({ x: this.width, y: 0 }),
      h = this.viewportToFramedGraph({ x: 0, y: this.height });

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
    const recomputeMatrix =
      !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions || !!override.padding;
    const matrix =
      override.matrix ||
      (recomputeMatrix
        ? matrixFromCamera(
            override.cameraState || this.camera.getState(),
            override.viewportDimensions || this.getDimensions(),
            override.graphDimensions || this.getGraphDimensions(),
            override.padding || this.getStagePadding(),
          )
        : this.matrix);

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
    const recomputeMatrix =
      !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions || !!override.padding;
    const invMatrix =
      override.matrix ||
      (recomputeMatrix
        ? matrixFromCamera(
            override.cameraState || this.camera.getState(),
            override.viewportDimensions || this.getDimensions(),
            override.graphDimensions || this.getGraphDimensions(),
            override.padding || this.getStagePadding(),
            true,
          )
        : this.invMatrix);

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
   * @param {Coordinates}                  coordinates
   * @param {CoordinateConversionOverride} override
   */
  viewportToGraph(coordinates: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    return this.normalizationFunction.inverse(this.viewportToFramedGraph(coordinates, override));
  }

  /**
   * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
   * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
   *
   * This method accepts an optional camera which can be useful if you need to translate coordinates
   * based on a different view than the one being currently being displayed on screen.
   *
   * @param {Coordinates}                  coordinates
   * @param {CoordinateConversionOverride} override
   */
  graphToViewport(coordinates: Coordinates, override: CoordinateConversionOverride = {}): Coordinates {
    return this.framedGraphToViewport(this.normalizationFunction(coordinates), override);
  }

  /**
   * Method used to translate a point's coordinates from the graph system to the framed graph system (the normalized
   * ~[0, 1] space used by the camera state).
   */
  graphToFramedGraph(coordinates: Coordinates): Coordinates {
    return this.normalizationFunction(coordinates);
  }

  /**
   * Method used to translate a point's coordinates from the framed graph system (the normalized ~[0, 1] space used by
   * the camera state) to the graph system.
   */
  framedGraphToGraph(coordinates: Coordinates): Coordinates {
    return this.normalizationFunction.inverse(coordinates);
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
   * Compute node extent from un-normalized graph coordinates,
   * which accounts for coordinate remapping via styles.
   */
  private computeNodeExtent(): { x: Extent; y: Extent } {
    const coords = this.nodeGraphCoords;
    const keys = Object.keys(coords);
    if (!keys.length) return { x: [0, 1], y: [0, 1] };

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0, l = keys.length; i < l; i++) {
      const { x, y } = coords[keys[i]];
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }

    return { x: [xMin, xMax], y: [yMin, yMax] };
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
    this.camera.cancelAnimation();
    this.unbindCameraHandlers();

    // Releasing DOM events & captors
    window.removeEventListener("resize", this.activeListeners.handleResize);
    this.mouseCaptor.kill();
    this.touchCaptor.kill();
    this.internals.hoverResolver.kill();

    // Releasing graph handlers
    this.unbindGraphHandlers();

    // Releasing cache & state
    this.clearIndices();
    this.clearState();

    this.internals.nodeDataCache = {};
    this.internals.edgeDataCache = {};

    // Clearing frames
    if (this.renderFrame) {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
    }

    // Destroying canvases
    const container = this.container;

    while (container.firstChild) container.removeChild(container.firstChild);

    // Kill programs:
    this.nodeProgram.kill();
    this.nodeFramePass.kill();
    this.edgeProgram.kill();
    this.edgeFramePass.kill();
    this.internals.labelProgram.kill();
    this.internals.edgeLabelProgram.kill();
    this.internals.edgeLabelBackgroundProgram.kill();
    this.internals.backdropProgram.kill();
    this.internals.labelBackgroundProgram.kill();
    this.internals.attachmentProgram?.kill();
    this.internals.attachmentManager?.kill();
    this.internals.attachmentProgram = null;
    this.internals.attachmentManager = null;

    // Kill custom layer programs
    for (const { program } of this.customLayerPrograms.values()) program.kill();
    this.customLayerPrograms.clear();

    // Cleanup SDF atlas
    if (this.sdfAtlas) {
      this.sdfAtlas = null;
    }

    // Cleanup node data texture
    if (this.internals.nodeDataTexture) {
      this.internals.nodeDataTexture.kill();
      this.internals.nodeDataTexture = null;
    }

    // Cleanup shared node-frame texture
    if (this.internals.nodeFrameTexture) {
      this.internals.nodeFrameTexture.kill();
      this.internals.nodeFrameTexture = null;
    }

    // Cleanup edge data texture
    if (this.internals.edgeDataTexture) {
      this.internals.edgeDataTexture.kill();
      this.internals.edgeDataTexture = null;
    }

    // Cleanup shared edge-frame texture
    if (this.internals.edgeFrameTexture) {
      this.internals.edgeFrameTexture.kill();
      this.internals.edgeFrameTexture = null;
    }

    // Kill WebGL context
    if (this.webGLContext) {
      this.webGLContext.getExtension("WEBGL_lose_context")?.loseContext();
      this.webGLContext = null;
    }

    // Remove all DOM elements (stage is in extraElements)
    this.gestureHint?.kill();
    this.gestureHint = null;
    this.mouseLayer.remove();
    for (const id in this.extraElements) {
      this.extraElements[id].remove();
    }
    this.extraElements = {};
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
      (size / this.internals.settings.zoomToSizeRatioFunction(cameraRatio)) *
      (this.getSetting("itemSizesReference") === "positions" ? cameraRatio * this.graphToViewportRatio : 1)
    );
  }

  /**
   * Method that returns the stage canvas element.
   */
  getStageCanvas(): HTMLCanvasElement {
    return this.stageCanvas;
  }

  /**
   * Returns the mouse interaction layer element.
   */
  getMouseLayer(): HTMLElement {
    return this.mouseLayer;
  }
}
