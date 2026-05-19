/**
 * Sigma.js
 * ========
 * @module
 */
import Graph, { Attributes } from "graphology-types";

import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import TouchCaptor from "./core/captors/touch";
import { DragManager } from "./core/drag-manager";
import { EdgeGroupIndex } from "./core/edge-groups";
import { bindGraphHandlers, bindInteractionHandlers, unbindGraphHandlers } from "./core/event-handlers";
import { hasAnyEnabled as hasAnyLabelEventEnabled } from "./core/label-events";
import { LabelRenderer } from "./core/label-renderer";
import { SDFAtlasManager } from "./core/sdf-atlas";
import { LabelHit, SigmaInternals } from "./core/sigma-internals";
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
  ExtractEdgeVarsFromPrimitives,
  ExtractNodeVarsFromPrimitives,
  PrimitivesDeclaration,
  generateEdgeProgram,
  generateNodeProgram,
} from "./primitives";
import {
  AttachmentManager,
  AttachmentProgram,
  BackdropProgram,
  BackdropProgramType,
  BucketCollection,
  EdgeDataTexture,
  EdgeLabelBackgroundProgram,
  EdgeLabelBackgroundProgramType,
  EdgeLabelProgram,
  EdgePath,
  EdgeProgram,
  LABEL_ID_OFFSET,
  LabelBackgroundProgram,
  LabelBackgroundProgramType,
  LabelProgram,
  LabelProgramType,
  NodeDataTexture,
  NodeProgram,
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
  identity,
  matrixFromCamera,
  multiplyVec2,
  removePositionFromDepthRanges,
  validateGraph,
} from "./utils";

/**
 * Constants.
 */
// Texture unit for the shared node data texture (position, size, shapeId)
const NODE_DATA_TEXTURE_UNIT = 3;
// Texture unit for the shared edge data texture (source/target indices, thickness, curvature, etc.)
const EDGE_DATA_TEXTURE_UNIT = 4;

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
  P extends PrimitivesDeclaration = PrimitivesDeclaration,
> extends TypedEventEmitter<SigmaEvents> {
  // Reducers (optional escape hatches for complex styling logic)
  private nodeReducer: NodeReducer<N, E, G, NS, GS> | null = null;
  private edgeReducer: EdgeReducer<N, E, G, ES, GS> | null = null;
  private mouseCaptor: MouseCaptor<N, E, G>;
  private touchCaptor: TouchCaptor<N, E, G>;
  private container: HTMLElement;
  private stageCanvas: HTMLCanvasElement = null!;
  private mouseLayer: HTMLElement = null!;
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
  private normalizationFunction: NormalizationFunction = createNormalizationFunction({
    x: [0, 1],
    y: [0, 1],
  });

  // Cache:
  private graphToViewportRatio = 1;
  private nodeItemIDsIndex: Record<number, string> = {};
  private edgeItemIDsIndex: Record<number, string> = {};
  private labelItemIDsIndex: Record<number, LabelHit> = {};
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
  private pendingProcess: "none" | "nodes" | "full" = "full";
  private needToRefreshState = false;
  private checkEdgesEventsFrame: number | null = null;

  // Pre-computed style metadata (dependency level, position attribute names)
  private edgeStyleAnalysis: StyleAnalysis = { dependency: "static", xAttribute: null, yAttribute: null };

  // Programs (single program per item kind)
  private nodeProgram: NodeProgram<string, N, E, G>;
  private edgeProgram: EdgeProgram<string, N, E, G>;

  // Resolved depth layers (fixed at construction, cached to avoid repeated spreading)
  private depthLayers: string[] = [...DEFAULT_DEPTH_LAYERS];

  // Custom layer programs (fullscreen quad effects rendered at specific depth positions)
  private customLayerPrograms = new Map<
    string,
    {
      render(params: RenderParams): void;
      kill(): void;
      preRender?(params: RenderParams): void;
      cacheData?(): void;
    }
  >();

  // Shape slug for edge clamping (encodes shape name, params, rotateWithCamera)
  private nodeShapeSlug: string | null = null;

  // WebGL Labels (SDF-based rendering)
  private sdfAtlas: SDFAtlasManager | null = null;

  // Bucket collections for depth management (supports future item types like labels)
  private itemBuckets: Record<"nodes" | "edges", BucketCollection>;
  // Track previous zIndex to detect changes
  private zIndexCache: Record<"nodes" | "edges", Record<string, number>> = {
    nodes: {},
    edges: {},
  };
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
        ExtractEdgeVarsFromPrimitives<P>
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

    // Initialize bucket collections with numDepthLayers * maxDepthLevels
    const numDepthLayers = this.depthLayers.length;
    this.itemBuckets = {
      nodes: new BucketCollection(numDepthLayers * resolvedSettings.maxDepthLevels),
      edges: new BucketCollection(numDepthLayers * resolvedSettings.maxDepthLevels),
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

    // Initialize edge data texture for sharing edge data between edge and edge label programs
    const edgeDataTexture = new EdgeDataTexture(this.webGLContext!);

    // Generate programs from primitives (uses defaults when not provided)
    const sigma = this as unknown as Sigma<N, E, G>;
    const gl = this.webGLContext!;

    const { program: NodeProgramClass, variables: nodeVariables } = generateNodeProgram<N, E, G>(
      resolvedPrimitives?.nodes,
    );
    this.nodeVariableEntries = Object.entries(nodeVariables) as [string, { type: string; default: unknown }][];
    this.nodeProgram = new NodeProgramClass(gl, null, sigma);

    // Cache shape information
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeProgramOptions = (NodeProgramClass as any).programOptions;
    if (nodeProgramOptions?.shapeSlug) {
      this.nodeShapeSlug = nodeProgramOptions.shapeSlug;
    }
    const nodeShapeMap: Record<string, number> | null = nodeProgramOptions?.shapeNameToIndex ?? null;
    const nodeGlobalShapeIds: number[] | null = nodeProgramOptions?.shapeGlobalIds ?? null;

    // Create label program if the node program has one
    const LabelProgramClass = NodeProgramClass.LabelProgram as LabelProgramType<N, E, G> | undefined;
    const labelProgram: LabelProgram<string, N, E, G> | null = LabelProgramClass
      ? new LabelProgramClass(gl, null, sigma)
      : null;

    // Create backdrop program if the node program has one
    const BackdropProgramClass = NodeProgramClass.BackdropProgram as BackdropProgramType<N, E, G> | undefined;
    const backdropProgram: BackdropProgram<string, N, E, G> | null = BackdropProgramClass
      ? new BackdropProgramClass(gl, null, sigma)
      : null;

    // Create label background program if the node program has one
    const LabelBackgroundProgramClass = NodeProgramClass.LabelBackgroundProgram as
      | LabelBackgroundProgramType<N, E, G>
      | undefined;
    const labelBackgroundProgram: LabelBackgroundProgram<string, N, E, G> | null = LabelBackgroundProgramClass
      ? new LabelBackgroundProgramClass(gl, this.pickingFrameBuffer, sigma)
      : null;

    // Create label attachment system if attachments are declared
    const labelAttachments = resolvedPrimitives?.nodes?.labelAttachments;
    let attachmentManager: AttachmentManager | null = null;
    let attachmentProgram: AttachmentProgram<N, E, G> | null = null;
    if (labelAttachments && Object.keys(labelAttachments).length > 0) {
      attachmentManager = new AttachmentManager(gl, labelAttachments, () => this.scheduleRender());
      attachmentProgram = new AttachmentProgram(gl, null, sigma);
    }

    const {
      program: EdgeProgramClass,
      variables: edgeVariables,
      paths: edgePaths,
    } = generateEdgeProgram<N, E, G>(resolvedPrimitives?.edges);
    this.edgeVariableEntries = Object.entries(edgeVariables) as [string, { type: string; default: unknown }][];
    this.edgePathsByName = new Map(edgePaths.map((p) => [p.name, p]));
    this.edgeProgram = new EdgeProgramClass(gl, null, sigma);

    // Create edge label program if the edge program has one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EdgeLabelProgramClass = (EdgeProgramClass as any).LabelProgram;
    const edgeLabelProgram: EdgeLabelProgram<string, N, E, G> | null = EdgeLabelProgramClass
      ? new EdgeLabelProgramClass(gl, null, sigma)
      : null;

    // Create edge label background program (ribbon along the edge path).
    // Picking framebuffer is passed so label events can be wired onto the ribbon.
    const EdgeLabelBackgroundProgramClass = (
      EdgeProgramClass as unknown as {
        LabelBackgroundProgram?: EdgeLabelBackgroundProgramType<N, E, G>;
      }
    ).LabelBackgroundProgram;
    const edgeLabelBackgroundProgram: EdgeLabelBackgroundProgram<string, N, E, G> | null =
      EdgeLabelBackgroundProgramClass ? new EdgeLabelBackgroundProgramClass(gl, this.pickingFrameBuffer, sigma) : null;

    // Create the shared internals object. All reassignable fields are plain properties;
    // satellites hold a reference to this object and see updates via direct assignment.
    this.internals = {
      nodeDataCache: {},
      edgeDataCache: {},
      nodesWithForcedLabels: new Set<string>(),
      nodesWithBackdrop: new Set<string>(),
      edgesWithForcedLabels: new Set<string>(),
      nodeIndices: {},
      edgeIndices: {},
      settings: resolvedSettings,
      primitives: resolvedPrimitives,
      pixelRatio: getPixelRatio(),
      graph,
      stateManager: this.stateManager,
      dragManager,
      nodeStyleAnalysis,
      labelProgram,
      edgeLabelProgram,
      edgeLabelBackgroundProgram,
      backdropProgram,
      labelBackgroundProgram,
      attachmentManager,
      attachmentProgram,
      nodeDataTexture,
      edgeDataTexture,
      nodeShapeMap,
      nodeGlobalShapeIds,
      getDimensions: () => this.getDimensions(),
      getGraphDimensions: () => this.getGraphDimensions(),
      getStagePadding: () => this.getStagePadding(),
      getCameraState: () => this.camera.getState(),
      getNodeAtPosition: (pos) => this.getNodeAtPosition(pos),
      getEdgeAtPoint: (x, y) => this.getEdgeAtPoint(x, y),
      getLabelAtPosition: (x, y) => this.getLabelAtPosition(x, y),
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
    this.activeListeners.cameraAnimationStart = (from: CameraState, to: CameraState) => {
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
   * Method that returns the closest node to a given position.
   */
  private getNodeAtPosition(position: Coordinates): string | null {
    const { x, y } = position;
    const gl = this.webGLContext!;

    // Read from picking framebuffer (scaled by downSizingRatio)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFrameBuffer);

    const color = getPixelColor(
      gl,
      this.pickingFrameBuffer,
      x,
      y,
      this.internals.pixelRatio,
      this.internals.settings.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    return this.nodeItemIDsIndex[index] ?? null;
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

  /**
   * Method looking for an edge colliding with a given point at (x, y). Returns
   * the key of the edge if any, or null else.
   */
  private getEdgeAtPoint(x: number, y: number): string | null {
    const gl = this.webGLContext!;

    // Read from picking framebuffer (scaled by downSizingRatio)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFrameBuffer);

    const color = getPixelColor(
      gl,
      this.pickingFrameBuffer,
      x,
      y,
      this.internals.pixelRatio,
      this.internals.settings.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    return this.edgeItemIDsIndex[index] ?? null;
  }

  private getLabelAtPosition(x: number, y: number): LabelHit | null {
    if (this.labelRenderer.displayedNodeLabels.size === 0 && this.labelRenderer.displayedEdgeLabels.size === 0) {
      return null;
    }
    const color = getPixelColor(
      this.webGLContext!,
      this.pickingFrameBuffer,
      x,
      y,
      this.internals.pixelRatio,
      this.internals.settings.pickingDownSizingRatio,
    );
    const index = colorToIndex(...color);
    return this.labelItemIDsIndex[index] ?? null;
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

    if (settings.autoRescale !== "once" || !this.autoRescaleFrozen) {
      this.nodeExtent = this.computeNodeExtent();
      if (settings.autoRescale === "once") this.autoRescaleFrozen = true;
    }
    if (settings.autoRescale === false) {
      const { width, height } = dimensions;
      const { x, y } = this.nodeExtent;
      this.nodeExtent = {
        x: [(x[0] + x[1]) / 2 - width / 2, (x[0] + x[1]) / 2 + width / 2],
        y: [(y[0] + y[1]) / 2 - height / 2, (y[0] + y[1]) / 2 + height / 2],
      };
    }
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

    const nodeIndices: typeof this.internals.nodeIndices = {};
    const nodeItemIDsIndex: typeof this.nodeItemIDsIndex = {};
    let incrID = 1;
    let visibilityChanged = false;

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
    }
    this.labelRenderer.labelGrid.organize();

    this.nodeProgram.reallocate(nodes.length);
    let nodeProcessCount = 0;

    const maxDepthLevels = settings.maxDepthLevels;
    this.depthRanges.nodes = {};
    this.nodeBaseDepth = {};
    this.itemBuckets.nodes.forEachBucketByZIndex((zIndex, bucket) => {
      const items = bucket.getItems();
      const depthIndex = Math.floor(zIndex / maxDepthLevels);
      const depth = this.depthLayers[depthIndex] ?? this.depthLayers[0];
      if (!this.depthRanges.nodes[depth]) this.depthRanges.nodes[depth] = [{ offset: nodeProcessCount, count: 0 }];
      const fragments = this.depthRanges.nodes[depth];
      fragments[fragments.length - 1].count += items.size;
      for (const node of items) {
        this.nodeBaseDepth[node] = depth;
        nodeIndices[node] = incrID;
        nodeItemIDsIndex[incrID] = node;
        incrID++;
        this.nodeProgram.allocateNode?.(node);
        this.addNodeToProgram(node, nodeIndices[node], nodeProcessCount++);
      }
    });
    this.nodeProgram.invalidateBuffers();

    this.nodeItemIDsIndex = nodeItemIDsIndex;
    this.internals.nodeIndices = nodeIndices;

    // Track visibility so the next processNodes call can detect changes
    for (let i = 0, l = nodes.length; i < l; i++) {
      this.prevNodeVisibilities[nodes[i]] = this.internals.nodeDataCache[nodes[i]].visibility;
    }

    this.labelRenderer.processWebGLLabels(nodes);

    for (const program of this.customLayerPrograms.values()) {
      if (program.cacheData) program.cacheData();
    }

    return visibilityChanged;
  }

  /**
   * Processes all edge data: updates the edge data texture and vertex buffer.
   * Node picking IDs occupy 1..graph.order, so edge IDs start at graph.order+1.
   * Must be called after processNodes() so node texture indices are available.
   */
  private processEdges(): void {
    const graph = this.internals.graph;
    const settings = this.internals.settings;
    const edges = graph.edges();

    this.edgeProgram.reallocate(edges.length);

    let edgeProcessCount = 0;
    const edgeIndices: typeof this.internals.edgeIndices = {};
    const edgeItemIDsIndex: typeof this.edgeItemIDsIndex = {};
    // Node IDs occupy 1..graph.order, so edges start after
    let incrID = graph.order + 1;

    const maxDepthLevels = settings.maxDepthLevels;
    this.depthRanges.edges = {};
    this.edgeBaseDepth = {};
    this.itemBuckets.edges.forEachBucketByZIndex((zIndex, bucket) => {
      const items = bucket.getItems();
      const depthIndex = Math.floor(zIndex / maxDepthLevels);
      const depth = this.depthLayers[depthIndex] ?? this.depthLayers[0];
      if (!this.depthRanges.edges[depth]) this.depthRanges.edges[depth] = [{ offset: edgeProcessCount, count: 0 }];
      const fragments = this.depthRanges.edges[depth];
      fragments[fragments.length - 1].count += items.size;
      for (const edge of items) {
        this.edgeBaseDepth[edge] = depth;
        edgeIndices[edge] = incrID;
        edgeItemIDsIndex[incrID] = edge;
        incrID++;
        this.addEdgeToProgram(edge, edgeIndices[edge], edgeProcessCount++);
      }
    });
    this.edgeProgram.invalidateBuffers();

    this.edgeItemIDsIndex = edgeItemIDsIndex;
    this.internals.edgeIndices = edgeIndices;
  }

  // Rebuild the label picking index from current node + edge index maps.
  // Node and edge ranges are disjoint ([1, graph.order] and [graph.order + 1,
  // graph.order + M]), so sharing LABEL_ID_OFFSET never collides.
  private rebuildLabelItemIDsIndex(): void {
    const labelItemIDsIndex: typeof this.labelItemIDsIndex = {};
    for (const node in this.internals.nodeIndices) {
      labelItemIDsIndex[this.internals.nodeIndices[node] + LABEL_ID_OFFSET] = { key: node, parentType: "node" };
    }
    for (const edge in this.internals.edgeIndices) {
      labelItemIDsIndex[this.internals.edgeIndices[edge] + LABEL_ID_OFFSET] = { key: edge, parentType: "edge" };
    }
    this.labelItemIDsIndex = labelItemIDsIndex;
  }

  private getDepthOffset(depth: string): number {
    const idx = this.depthLayers.indexOf(depth);
    return (idx >= 0 ? idx : 0) * this.internals.settings.maxDepthLevels;
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
  private handleSettingsUpdate(oldSettings?: Settings): this {
    const settings = this.internals.settings;

    this.camera.minRatio = settings.minCameraRatio;
    this.camera.maxRatio = settings.maxCameraRatio;
    this.camera.enabledZooming = settings.enableCameraZooming;
    this.camera.enabledPanning = settings.enableCameraPanning;
    this.camera.enabledRotation = settings.enableCameraRotation;
    if (settings.cameraPanBoundaries) {
      this.camera.clean = (state) =>
        this.cleanCameraState(
          state,
          settings.cameraPanBoundaries && typeof settings.cameraPanBoundaries === "object"
            ? settings.cameraPanBoundaries
            : {},
        );
    } else {
      this.camera.clean = null;
    }
    this.camera.setState(this.camera.validateState(this.camera.getState()));

    if (oldSettings) {
      // Check maxDepthLevels:
      if (oldSettings.maxDepthLevels !== settings.maxDepthLevels) {
        const numDepthLayers = this.depthLayers.length;
        this.itemBuckets.nodes.setMaxDepthLevels(numDepthLayers * settings.maxDepthLevels);
        this.itemBuckets.edges.setMaxDepthLevels(numDepthLayers * settings.maxDepthLevels);
        this.pendingProcess = "full";
      }
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
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
    }

    // First we need to resize
    this.resize();

    // Do we need to reprocess data?
    if (this.pendingProcess !== "none") {
      this.emit("beforeProcess");
      this.internals.attachmentManager?.clear();
      const visibilityChanged = this.processNodes();
      if (this.pendingProcess === "full" || visibilityChanged) this.processEdges();
      // Rebuild unconditionally, against current node + edge indices. On a
      // nodes-only refresh processEdges is skipped but the cached edgeIndices
      // are still valid, so edge-label picking keeps working.
      this.rebuildLabelItemIDsIndex();
      this.pendingProcess = "none";
      this.emit("afterProcess");
    }

    // Do we need to refresh state (styles in-place, no reprocess)?
    if (this.needToRefreshState) this.refreshState();
    this.needToRefreshState = false;
    this.stateManager.clearDirtyTracking();

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
      this.camera.isAnimated() ||
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
    const params: RenderParams = this.getRenderParams();
    // When edge events are disabled, skip the edge picking pass to avoid GPU overhead
    const edgeParams: RenderParams = this.internals.settings.enableEdgeEvents
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
    this.nodeProgram.uploadLayerTexture?.();
    (this.edgeProgram as unknown as { uploadAttributeTexture?: () => void })?.uploadAttributeTexture?.();

    // Bind data textures to their respective texture units
    this.internals.nodeDataTexture!.bind(NODE_DATA_TEXTURE_UNIT);
    this.internals.edgeDataTexture!.bind(EDGE_DATA_TEXTURE_UNIT);

    // Pre-compute which node labels will be displayed (needed by both backdrops and labels)
    if (this.internals.settings.renderLabels) {
      this.labelRenderer.computeDisplayedNodeLabels();
    }

    // Pre-compute edge label candidates (consumed by both the background pass
    // and the label pass inside the depth loop).
    if (this.internals.settings.renderEdgeLabels) {
      this.labelRenderer.computeDisplayedEdgeLabels();
    }

    // Pre-render pass for custom layers (offscreen work like density splatting)
    // before the depth loop to avoid framebuffer switching mid-loop.
    for (const program of this.customLayerPrograms.values()) {
      if (program.preRender) program.preRender(params);
    }

    // Restore main framebuffer state after any offscreen passes
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width * this.internals.pixelRatio, this.height * this.internals.pixelRatio);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    for (const depth of this.depthLayers) {
      // Custom layer program at this depth
      const customLayer = this.customLayerPrograms.get(depth);
      if (customLayer) customLayer.render(params);

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
          hasAnyLabelEventEnabled(this.internals.settings.edgeLabelEvents)
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
        hasAnyLabelEventEnabled(this.internals.settings.nodeLabelEvents)
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

    // Do not display labels on move per setting
    if (this.internals.settings.hideLabelsOnMove && moving) return exitRender();

    return exitRender();
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

    // Label:
    // We delete and add if needed because this function is also used from
    // update
    this.internals.nodesWithForcedLabels.delete(key);
    if (data.labelVisibility === "visible" && data.visibility !== "hidden")
      this.internals.nodesWithForcedLabels.add(key);

    // Backdrop visibility tracking
    this.internals.nodesWithBackdrop.delete(key);
    if (data.visibility !== "hidden" && data.backdropVisibility === "visible") {
      this.internals.nodesWithBackdrop.add(key);
    }

    // Bucket management for depth ordering (depth encoded into zIndex range)
    const newZIndex =
      this.getDepthOffset(data.depth) +
      Math.max(0, Math.min(this.internals.settings.maxDepthLevels - 1, Math.floor(data.zIndex)));
    const oldZIndex = this.zIndexCache.nodes[key];

    if (oldZIndex !== undefined && oldZIndex !== newZIndex) {
      this.itemBuckets.nodes.moveItem(oldZIndex, newZIndex, key);
    } else if (oldZIndex === undefined) {
      this.itemBuckets.nodes.addItem(newZIndex, key);
    } else {
      this.itemBuckets.nodes.updateItem(newZIndex, key);
    }
    this.zIndexCache.nodes[key] = newZIndex;
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
    const data = this.internals.nodeDataCache[key];
    if (data) {
      const zIndex = this.zIndexCache.nodes[key];
      if (zIndex !== undefined) {
        this.itemBuckets.nodes.removeItem(zIndex, key);
        delete this.zIndexCache.nodes[key];
      }
    }
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

    // Forced label
    // we filter and re push if needed because this function is also used from
    // update
    this.internals.edgesWithForcedLabels.delete(key);
    if (data.labelVisibility === "visible" && data.visibility !== "hidden")
      this.internals.edgesWithForcedLabels.add(key);

    // Bucket management for depth ordering (depth encoded into zIndex range)
    const newZIndex =
      this.getDepthOffset(data.depth) +
      Math.max(0, Math.min(this.internals.settings.maxDepthLevels - 1, Math.floor(data.zIndex)));
    const oldZIndex = this.zIndexCache.edges[key];

    if (oldZIndex !== undefined && oldZIndex !== newZIndex) {
      this.itemBuckets.edges.moveItem(oldZIndex, newZIndex, key);
    } else if (oldZIndex === undefined) {
      this.itemBuckets.edges.addItem(newZIndex, key);
    } else {
      this.itemBuckets.edges.updateItem(newZIndex, key);
    }
    this.zIndexCache.edges[key] = newZIndex;
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
    const data = this.internals.edgeDataCache[key];
    if (data) {
      const zIndex = this.zIndexCache.edges[key];
      if (zIndex !== undefined) {
        this.itemBuckets.edges.removeItem(zIndex, key);
        delete this.zIndexCache.edges[key];
      }
    }
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
    this.nodeExtent = { x: [0, 1], y: [0, 1] };
    this.internals.nodeDataCache = {};
    this.nodeGraphCoords = {};
    this.edgeProgramIndex = {};
    this.internals.nodesWithForcedLabels = new Set<string>();
    this.internals.nodesWithBackdrop = new Set<string>();
    this.nodeItemIDsIndex = {};
    this.labelItemIDsIndex = {};
    this.prevNodeVisibilities = {};
    // Clear bucket data
    this.itemBuckets.nodes.clearAll();
    this.zIndexCache.nodes = {};
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
    this.internals.edgesWithForcedLabels = new Set<string>();
    this.edgeItemIDsIndex = {};
    this.internals.edgeIndices = {};
    // Clear bucket data
    this.itemBuckets.edges.clearAll();
    this.zIndexCache.edges = {};
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
   * Add the node data to its program.
   * @private
   * @param node The node's graphology ID
   * @param fingerprint A fingerprint used to identity the node with picking
   * @param position The index where to place the node in the program
   */
  private addNodeToProgram(node: string, fingerprint: number, position: number): void {
    const data = this.internals.nodeDataCache[node];
    this.internals.nodeDataTexture!.allocate(node);
    this.internals.nodeDataTexture!.updateNode(node, data.x, data.y, data.size, this.getNodeShapeId(data));
    const textureIndex = this.internals.nodeDataTexture!.getIndex(node);
    this.nodeProgram.process(fingerprint, position, data, textureIndex, node);
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
      fingerprint,
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
      edgeDataTextureUnit: EDGE_DATA_TEXTURE_UNIT,
      edgeDataTextureWidth: this.internals.edgeDataTexture!.getTextureWidth(),
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

    // Create picking framebuffer for two-pass rendering
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
   * Registers a custom layer program to be rendered at the given depth layer position.
   * The depth name must exist in the primitives depthLayers array.
   */
  addCustomLayerProgram(
    depth: string,
    program: {
      render(params: RenderParams): void;
      kill(): void;
      preRender?(params: RenderParams): void;
      cacheData?(): void;
    },
  ): this {
    if (!this.depthLayers.includes(depth))
      throw new Error(
        `Sigma: cannot add custom layer program at depth "${depth}" — ` +
          `it must be declared in primitives.depthLayers. Current layers: ${this.depthLayers.join(", ")}`,
      );
    this.customLayerPrograms.set(depth, program);
    this.refresh();
    return this;
  }

  /**
   * Removes a custom layer program previously registered at the given depth.
   */
  removeCustomLayerProgram(depth: string): this {
    const program = this.customLayerPrograms.get(depth);
    if (program) {
      program.kill();
      this.customLayerPrograms.delete(depth);
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

    // Check hoveredNode and hoveredEdge
    if (this.stateManager.hoveredNode && !graph.hasNode(this.stateManager.hoveredNode))
      this.stateManager.setHoveredNode(null);
    if (this.stateManager.hoveredEdge && !graph.hasEdge(this.stateManager.hoveredEdge))
      this.stateManager.setHoveredEdge(null);

    // Unbinding handlers on the current graph
    this.unbindGraphHandlers();

    if (this.checkEdgesEventsFrame !== null) {
      cancelAnimationFrame(this.checkEdgesEventsFrame);
      this.checkEdgesEventsFrame = null;
    }

    // Installing new graph
    this.internals.graph = graph;

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
   * the user starts/stops dragging the stage. Not meant for user code — use
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
   * falling back to the stage cursor style.
   */
  private updateContainerCursor(): void {
    if (this.stateManager.hoveredNode) {
      this.container.style.cursor =
        this.internals.nodeDataCache[this.stateManager.hoveredNode]?.cursor || this.resolvedStageStyle.cursor || "";
    } else if (this.stateManager.hoveredLabel) {
      const { key, parentType } = this.stateManager.hoveredLabel;
      const cache = parentType === "edge" ? this.internals.edgeDataCache : this.internals.nodeDataCache;
      this.container.style.cursor = cache[key]?.labelCursor || this.resolvedStageStyle.cursor || "";
    } else if (this.stateManager.hoveredEdge) {
      this.container.style.cursor =
        this.internals.edgeDataCache[this.stateManager.hoveredEdge]?.cursor || this.resolvedStageStyle.cursor || "";
    } else {
      this.container.style.cursor = this.resolvedStageStyle.cursor || "";
    }
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
   * Method setting the value of a given setting key. Note that this will schedule
   * a new render next frame.
   *
   * @param  {string} key - The setting key to set.
   * @param  {any}    value - The value to set.
   * @return {Sigma}
   */
  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): this {
    const oldValues = { ...this.internals.settings };
    this.internals.settings[key] = value;
    validateSettings(this.internals.settings);
    this.handleSettingsUpdate(oldValues);
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
    const oldValues = { ...this.internals.settings };
    this.internals.settings = { ...this.internals.settings, ...settings };
    validateSettings(this.internals.settings);
    this.handleSettingsUpdate(oldValues);
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

    // Nodes
    if (needFullNodeRefresh) {
      this.internals.graph.forEachNode((node) => this.refreshNodeState(node));
    } else if (this.internals.nodeStyleAnalysis.dependency !== "static") {
      for (const node of this.stateManager.dirtyNodes) {
        this.refreshNodeState(node);
      }
    }

    // Edges
    if (needFullEdgeRefresh) {
      this.internals.graph.forEachEdge((edge) => this.refreshEdgeState(edge));
    } else if (this.edgeStyleAnalysis.dependency !== "static") {
      for (const edge of this.stateManager.dirtyEdges) {
        this.refreshEdgeState(edge);
      }
    }

    // Stage styles
    if (this.stateManager.graphStateChanged && this.stylesDeclaration?.stage) {
      this.refreshStageStyle();
    }

    this.stateManager.clearDirtyTracking();
  }

  /**
   * Re-evaluate a single node's style and rewrite its GPU data.
   * Lean path: patches cache in place, skips unchanged bookkeeping.
   */
  private refreshNodeState(node: string): void {
    const data = this.internals.nodeDataCache[node];

    // If node not yet cached or a reducer exists, fall back to full path
    if (!data || this.nodeReducer) {
      const oldDepth = this.internals.nodeDataCache[node]?.depth;
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
      this.internals.nodeDataTexture!.updateNode(node, newData.x, newData.y, newData.size, shapeId);
      if (oldDepth && newData.depth !== oldDepth) {
        this.updateNodeDepthRanges(node, oldDepth, newData.depth);
      }
      const programIndex = this.nodeProgramIndex[node];
      if (programIndex !== undefined) {
        this.addNodeToProgram(node, this.internals.nodeIndices[node], programIndex);
        this.nodeProgram.invalidateBuffers();
      }
      return;
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
    const oldVisibility = data.visibility;
    const oldLabelVisibility = data.labelVisibility;
    const oldBackdropVisibility = data.backdropVisibility;

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

    // Update forced label tracking only if changed
    if (data.labelVisibility !== oldLabelVisibility || data.visibility !== oldVisibility) {
      this.internals.nodesWithForcedLabels.delete(node);
      if (data.labelVisibility === "visible" && data.visibility !== "hidden")
        this.internals.nodesWithForcedLabels.add(node);
    }

    // Backdrop tracking only if changed
    if (data.backdropVisibility !== oldBackdropVisibility || data.visibility !== oldVisibility) {
      this.internals.nodesWithBackdrop.delete(node);
      if (data.visibility !== "hidden" && data.backdropVisibility === "visible") {
        this.internals.nodesWithBackdrop.add(node);
      }
    }

    // Node data texture only if position/size/shape changed
    if (rawPositionChanged || data.size !== oldSize || data.shape !== oldShape) {
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
      this.internals.nodeDataTexture!.updateNode(node, data.x, data.y, data.size, shapeId);
    }

    // Bucket management if depth or zIndex changed
    const newZIndex =
      this.getDepthOffset(data.depth) +
      Math.max(0, Math.min(this.internals.settings.maxDepthLevels - 1, Math.floor(data.zIndex)));
    const cachedZIndex = this.zIndexCache.nodes[node];
    if (cachedZIndex !== undefined && cachedZIndex !== newZIndex) {
      this.itemBuckets.nodes.moveItem(cachedZIndex, newZIndex, node);
      this.zIndexCache.nodes[node] = newZIndex;
    } else if (cachedZIndex !== undefined && (data.depth !== oldDepth || data.zIndex !== oldZIndex)) {
      this.itemBuckets.nodes.updateItem(cachedZIndex, node);
    }
    if (data.depth !== oldDepth) {
      this.updateNodeDepthRanges(node, oldDepth, data.depth);
    }

    // GPU program update
    const programIndex = this.nodeProgramIndex[node];
    if (programIndex !== undefined) {
      this.addNodeToProgram(node, this.internals.nodeIndices[node], programIndex);
      this.nodeProgram.invalidateBuffers();
    }
  }

  /**
   * Re-evaluate a single edge's style and rewrite its GPU data.
   * Lean path: re-evaluates style but patches cache in place, skips
   * unchanged bookkeeping, and avoids full addEdgeToProgram overhead.
   */
  private refreshEdgeState(edge: string): void {
    const data = this.internals.edgeDataCache[edge];

    // If edge not yet cached or a reducer exists, fall back to full path
    if (!data || this.edgeReducer) {
      const oldDepth = data?.depth;
      this.updateEdge(edge);
      const newData = this.internals.edgeDataCache[edge];
      if (oldDepth && newData.depth !== oldDepth) {
        this.updateEdgeDepthRanges(edge, oldDepth, newData.depth);
      }
      const programIndex = this.edgeProgramIndex[edge];
      if (programIndex !== undefined) {
        this.addEdgeToProgram(edge, this.internals.edgeIndices[edge], programIndex);
        this.edgeProgram.invalidateBuffers();
      }
      return;
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
    const oldVisibility = data.visibility;
    const oldLabelVisibility = data.labelVisibility;

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

    // Update forced label tracking only if changed
    if (data.labelVisibility !== oldLabelVisibility || data.visibility !== oldVisibility) {
      this.internals.edgesWithForcedLabels.delete(edge);
      if (data.labelVisibility === "visible" && data.visibility !== "hidden")
        this.internals.edgesWithForcedLabels.add(edge);
    }

    // Bucket management if depth or zIndex changed
    const newZIndex =
      this.getDepthOffset(data.depth) +
      Math.max(0, Math.min(this.internals.settings.maxDepthLevels - 1, Math.floor(data.zIndex)));
    const cachedZIndex = this.zIndexCache.edges[edge];
    if (cachedZIndex !== undefined && cachedZIndex !== newZIndex) {
      this.itemBuckets.edges.moveItem(cachedZIndex, newZIndex, edge);
      this.zIndexCache.edges[edge] = newZIndex;
    } else if (cachedZIndex !== undefined && (data.depth !== oldDepth || data.zIndex !== oldZIndex)) {
      this.itemBuckets.edges.updateItem(cachedZIndex, edge);
    }
    if (data.depth !== oldDepth) {
      this.updateEdgeDepthRanges(edge, oldDepth, data.depth);
    }

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
        this.addEdgeToProgram(edge, this.internals.edgeIndices[edge], programIndex);
        this.edgeProgram.invalidateBuffers();
      } else {
        // Fast path: skip edge data texture, only update vertex buffer + attribute texture
        const source = this.internals.graph.source(edge);
        const target = this.internals.graph.target(edge);
        const sourceData = this.internals.nodeDataCache[source];
        const targetData = this.internals.nodeDataCache[target];
        const edgeTextureIndex = this.edgeTextureIndexCache[edge];

        this.edgeProgram.process(
          this.internals.edgeIndices[edge],
          programIndex,
          sourceData,
          targetData,
          data,
          edgeTextureIndex,
        );
        this.edgeProgram.invalidateBuffers();
      }
    }
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
          this.addNodeToProgram(node, this.internals.nodeIndices[node], programIndex);
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
          this.addEdgeToProgram(edge, this.internals.edgeIndices[edge], programIndex);
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
    this.edgeProgram.kill();
    this.internals.labelProgram?.kill();
    this.internals.edgeLabelProgram?.kill();
    this.internals.edgeLabelBackgroundProgram?.kill();
    this.internals.backdropProgram?.kill();
    this.internals.labelBackgroundProgram?.kill();
    this.internals.attachmentProgram?.kill();
    this.internals.attachmentManager?.kill();
    this.internals.labelProgram = null;
    this.internals.edgeLabelProgram = null;
    this.internals.edgeLabelBackgroundProgram = null;
    this.internals.backdropProgram = null;
    this.internals.labelBackgroundProgram = null;
    this.internals.attachmentProgram = null;
    this.internals.attachmentManager = null;

    // Kill custom layer programs
    for (const program of this.customLayerPrograms.values()) program.kill();
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

    // Cleanup edge data texture
    if (this.internals.edgeDataTexture) {
      this.internals.edgeDataTexture.kill();
      this.internals.edgeDataTexture = null;
    }

    // Kill WebGL context
    if (this.webGLContext) {
      this.webGLContext.getExtension("WEBGL_lose_context")?.loseContext();
      this.webGLContext = null;
    }

    // Remove all DOM elements (stage is in extraElements)
    this.mouseLayer.remove();
    for (const id in this.extraElements) {
      this.extraElements[id].remove();
    }
    this.extraElements = {};

    this.labelRenderer.kill();
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
