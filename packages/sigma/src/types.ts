/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
import { EventEmitter } from "events";
import Graph from "graphology-types";

import { Attributes, FullEdgeState, FullGraphState, FullNodeState } from "./types/styles";

/**
 * Util type to represent maps of typed elements, but implemented with
 * JavaScript objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainObject<T = any> = { [k: string]: T };

/**
 * Returns a type similar to T, but with the K set of properties of the type
 * T *required*, and the rest optional.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialButFor<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>> & { [others: string]: any };

/**
 * Returns a type similar to Partial<T>, but with at least one key set.
 */
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export interface Coordinates {
  x: number;
  y: number;
}

export interface CameraState extends Coordinates {
  angle: number;
  ratio: number;
}

export type MouseInteraction = "click" | "doubleClick" | "rightClick" | "wheel" | "down" | "up" | "leave" | "enter";

/**
 * How label hits are routed for a given interaction:
 * - `false`: label hits are ignored (fall through to edge/stage).
 * - `"extend"`: a label hit is treated as a hit on its parent node/edge.
 * - `"separate"`: a label hit fires a dedicated `*NodeLabel` / `*EdgeLabel`
 *   event.
 */
export type LabelEventMode = false | "extend" | "separate";

/**
 * Per-interaction label event configuration.
 *
 * Either a single mode applied to every interaction, or a `Record` keyed by
 * `MouseInteraction` with a `default` fallback. Interactions not listed and
 * with no `default` resolve to `false`.
 */
export type LabelEventsSetting =
  | LabelEventMode
  | (Partial<Record<MouseInteraction, LabelEventMode>> & { default?: LabelEventMode });

export interface MouseCoords extends Coordinates {
  sigmaDefaultPrevented: boolean;
  preventSigmaDefault(): void;
  original: MouseEvent | TouchEvent;
}

export interface WheelCoords extends MouseCoords {
  delta: number; // This will store the delta actually used by sigma
}

export interface TouchCoords {
  touches: Coordinates[];
  previousTouches: Coordinates[];
  sigmaDefaultPrevented: boolean;
  preventSigmaDefault(): void;
  original: TouchEvent;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Extent = [number, number];

/**
 * Controls what the auto-rescale fit encloses (ignored when `autoRescale` is
 * `false`):
 * - `"positions"`: node positions only
 * - `"nodes"`: node positions and sizes
 * - `"labels"`: node positions, sizes, and labels
 *
 * Each level contains the previous one.
 */
export type AutoRescaleContent = "positions" | "nodes" | "labels";

export interface DisplayData {
  label: string | null;
  size: number;
  color: string;
  opacity: number;
  labelColor: string;
  visibility: "visible" | "hidden";
  labelVisibility: "auto" | "visible" | "hidden";
  zIndex: number;
  depth: string;
  labelDepth: string;
  cursor?: string;
}

/** Whether something stays screen-upright ("viewport") or turns with the camera ("graph"). */
export type RotationAlignment = "viewport" | "graph";

export interface NodeDisplayData extends Coordinates, DisplayData {
  highlighted: boolean;
  shape?: string; // Shape name for edge clamping (e.g., "circle", "square")
  rotationAlignment?: RotationAlignment; // Node shape orientation: screen-upright or graph-fixed
  labelRotationAlignment?: RotationAlignment; // Label orientation: screen-upright or orbits with camera
  labelPosition?: LabelPosition; // Label position relative to node
  labelSize?: number; // Label font size in pixels
  labelFont?: string; // Label font family (e.g., "Georgia, serif")
  labelAngle?: number; // Label rotation angle in radians
  backdropVisibility?: "visible" | "hidden"; // Backdrop visibility mode
  backdropColor?: string; // Backdrop fill color (transparent = no backdrop)
  backdropShadowColor?: string; // Backdrop shadow color
  backdropShadowBlur?: number; // Backdrop shadow blur radius in pixels
  backdropPadding?: number; // Backdrop padding around node+label in pixels
  backdropBorderColor?: string; // Backdrop border color (transparent = no border)
  backdropBorderWidth?: number; // Backdrop border width in pixels
  backdropCornerRadius?: number; // Backdrop corner radius in pixels
  backdropLabelPadding?: number; // Backdrop label padding in pixels (-1 = fall back to backdropPadding)
  backdropArea?: "both" | "node" | "label"; // Which area the backdrop covers
  labelAttachment?: string | null; // Label attachment name (references primitives.nodes.labelAttachments)
  labelAttachmentPlacement?: "below" | "above" | "left" | "right"; // Where to place attachment relative to label
  labelBackgroundColor?: string; // Label background fill color (transparent = no background)
  labelBackgroundPadding?: number; // Label background padding in pixels
  labelCursor?: string; // CSS cursor to show when hovering this node's label
}
export interface EdgeDisplayData extends DisplayData {
  path?: string; // Path type for regular edges (e.g., "straight", "curved")
  selfLoopPath?: string; // Path type for self-loop edges (e.g., "loop")
  parallelPath?: string; // Path type for parallel edges (e.g., "curved")
  parallelSpread?: number; // Perpendicular spread factor for parallel edges
  head?: string; // Head extremity type (e.g., "arrow")
  tail?: string; // Tail extremity type (e.g., "arrow")
  labelPosition?: EdgeLabelPosition; // Label position relative to edge path
  labelBackgroundColor?: string; // Label background fill color (transparent = no background)
  labelBackgroundPadding?: number; // Label background padding in pixels
  labelCursor?: string; // CSS cursor to show when hovering this edge's label
}

export type NodeReducer<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
  NS = {}, // additional custom node state fields
  GS = {}, // additional custom graph state fields
> = (
  key: string,
  data: NodeDisplayData,
  attrs: N,
  state: FullNodeState<NS>,
  graphState: FullGraphState<GS>,
  graph: Graph<N, E, G>,
) => Partial<NodeDisplayData>;

export type EdgeReducer<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
  ES = {}, // additional custom edge state fields
  GS = {}, // additional custom graph state fields
> = (
  key: string,
  data: EdgeDisplayData,
  attrs: E,
  state: FullEdgeState<ES>,
  graphState: FullGraphState<GS>,
  graph: Graph<N, E, G>,
) => Partial<EdgeDisplayData>;

export type CoordinateConversionOverride = {
  cameraState?: CameraState;
  matrix?: Float32Array;
  viewportDimensions?: Dimensions;
  graphDimensions?: Dimensions;
  padding?: number;
};

export interface RenderParams {
  frameId: number;
  width: number;
  height: number;
  sizeRatio: number;
  zoomRatio: number;
  pixelRatio: number;
  cameraAngle: number;
  correctionRatio: number;
  matrix: Float32Array;
  invMatrix: Float32Array;
  downSizingRatio: number;
  minEdgeThickness: number;
  antiAliasingFeather: number;
  nodePickingPadding: number;
  edgePickingPadding: number;
  labelPickingPadding: number;
  nodeDataTextureUnit: number;
  nodeDataTextureWidth: number;
  /** Shared per-frame node-frame texture (normalized edge distances). */
  nodeFrameTextureUnit: number;
  nodeFrameTextureWidth: number;
  edgeDataTextureUnit: number;
  edgeDataTextureWidth: number;
  /** Shared per-frame edge-frame texture (per-edge clamp vec4). */
  edgeFrameTextureUnit: number;
  edgeFrameTextureWidth: number;
  pickingFrameBuffer: WebGLFramebuffer | null;
  labelPixelSnapping: number;
}

/**
 * Custom event emitter types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (...args: any[]) => void;
export type EventsMapping = Record<string, Listener>;

interface ITypedEventEmitter<Events extends EventsMapping> {
  rawEmitter: EventEmitter;

  eventNames<Event extends keyof Events>(): Array<Event>;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  emit<Event extends keyof Events>(type: Event, ...args: Parameters<Events[Event]>): boolean;
  addListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  on<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  once<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  prependListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  prependOnceListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  removeListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  off<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  removeAllListeners<Event extends keyof Events>(type?: Event): this;
  listeners<Event extends keyof Events>(type: Event): Events[Event][];
  listenerCount<Event extends keyof Events>(type: Event): number;
  rawListeners<Event extends keyof Events>(type: Event): Events[Event][];
}

export class TypedEventEmitter<Events extends EventsMapping> extends (EventEmitter as unknown as {
  new <T extends EventsMapping>(): ITypedEventEmitter<T>;
})<Events> {
  constructor() {
    super();
    this.rawEmitter = this as EventEmitter;
  }
}

/**
 * Event types.
 */
export interface SigmaEventPayload {
  event: MouseCoords;
  preventSigmaDefault(): void;
}

export type SigmaStageEventPayload = SigmaEventPayload;
export interface SigmaNodeEventPayload extends SigmaEventPayload {
  node: string;
}
export interface SigmaNodeDragEventPayload extends SigmaEventPayload {
  node: string;
  allDraggedNodes: string[];
}
export interface SigmaNodeDragMovePayload {
  node: string;
  allDraggedNodes: string[];
  event: MouseCoords;
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
  beforeClear(): void;
  afterClear(): void;
  beforeProcess(): void;
  afterProcess(): void;
  beforeRender(): void;
  afterRender(): void;
  resize(): void;
  kill(): void;
  // Body events
  moveBody(payload: SigmaStageEventPayload): void;
  // Node drag events
  nodeDragStart(payload: SigmaNodeDragEventPayload): void;
  nodeDrag(payload: SigmaNodeDragMovePayload): void;
  nodeDragEnd(payload: SigmaNodeDragEventPayload): void;
  // WebGL lifecycle events:
  afterTexturesUpload(): void;
};

export type SigmaEvents = SigmaStageEvents &
  SigmaNodeEvents &
  SigmaEdgeEvents &
  SigmaNodeLabelEvents &
  SigmaEdgeLabelEvents &
  SigmaAdditionalEvents;
export type SigmaEventType = keyof SigmaEvents;

/**
 * Label types:
 */

/**
 * Position of a label relative to its parent node.
 */
export type LabelPosition = "right" | "left" | "above" | "below" | "over";

/**
 * Position of an edge label relative to the edge path.
 * - "over": Centered on the path centerline
 * - "above": Above the edge (perpendicular offset)
 * - "below": Below the edge (perpendicular offset)
 * - "auto": GPU determines above/below based on which node is leftmost on screen
 */
export type EdgeLabelPosition = "over" | "above" | "below" | "auto";

/**
 * Font size mode for edge labels.
 * - "fixed": Constant pixel size regardless of zoom (default)
 * - "scaled": Scales with zoom level using zoomToSizeRatioFunction from settings
 */
export type EdgeLabelFontSizeMode = "fixed" | "scaled";

/**
 * Display data for a label, computed during processing.
 */
export interface LabelDisplayData {
  /** The label text content */
  text: string;
  /** X position in graph coordinates (node center) */
  x: number;
  /** Y position in graph coordinates (node center) */
  y: number;
  /** Font size in pixels */
  size: number;
  /** Label color (CSS color string) */
  color: string;
  /** Whether the label is hidden */
  hidden: boolean;
  /** Force display even if culled by LabelGrid */
  forceLabel: boolean;
  /** Label type (for program selection) */
  type: string;
  /** Z-index for depth ordering */
  zIndex: number;
  /** Reference to parent node/edge key */
  parentKey: string;
  /** Parent type: 'node' or 'edge' */
  parentType: "node" | "edge";
  /** Where label appears relative to node */
  position: LabelPosition;
  /** Node size (for offset calculation) */
  nodeSize: number;
  /** Gap between node boundary and label (pixels) */
  margin: number;
  /** Font key for multi-font support (references registered font in atlas) */
  fontKey: string;
  /** Label rotation angle in radians */
  labelAngle: number;
  /** Node index in node data texture (for GPU-side lookup) */
  nodeIndex: number;
}

/**
 * Display data for an edge label, computed during processing.
 * Extends LabelDisplayData with edge-specific positioning info.
 */
export interface EdgeLabelDisplayData extends Omit<LabelDisplayData, "position"> {
  /** Position of edge label relative to path (overrides LabelDisplayData.position) */
  position: EdgeLabelPosition;
  /** Source node X position in graph coordinates */
  sourceX: number;
  /** Source node Y position in graph coordinates */
  sourceY: number;
  /** Target node X position in graph coordinates */
  targetX: number;
  /** Target node Y position in graph coordinates */
  targetY: number;
  /** Source node size in graph coordinates */
  sourceSize: number;
  /** Target node size in graph coordinates */
  targetSize: number;
  /** Source node shape slug (e.g., "circle", "square") */
  sourceShape: string;
  /** Target node shape slug (e.g., "circle", "square") */
  targetShape: string;
  /** Edge thickness/size in pixels */
  edgeSize: number;
  /** Perpendicular offset from path centerline (pixels) */
  offset: number;
  /** Resolved edge display data — source for the path attributes (curvature, loop geometry, …) packed into the label attribute texture. */
  edgeAttributes: Record<string, unknown>;
  /** Source node index in node data texture */
  sourceNodeIndex: number;
  /** Target node index in node data texture */
  targetNodeIndex: number;
  /** Edge index in edge data texture */
  edgeIndex: number;
}

/**
 * Label event types.
 *
 * Node and edge labels fire distinct events so handlers don't have to branch
 * on `parentType`. Payload shapes mirror the corresponding node/edge events.
 */
export interface SigmaNodeLabelEventPayload extends SigmaEventPayload {
  /** Key of the node the label belongs to */
  node: string;
}

export interface SigmaEdgeLabelEventPayload extends SigmaEventPayload {
  /** Key of the edge the label belongs to */
  edge: string;
}

export type SigmaNodeLabelEvents = {
  clickNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  rightClickNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  doubleClickNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  wheelNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  downNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  upNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  enterNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
  leaveNodeLabel: (payload: SigmaNodeLabelEventPayload) => void;
};

export type SigmaEdgeLabelEvents = {
  clickEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  rightClickEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  doubleClickEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  wheelEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  downEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  upEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  enterEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
  leaveEdgeLabel: (payload: SigmaEdgeLabelEventPayload) => void;
};

/**
 * Export various other types:
 */
export type { CameraEvents } from "./core/camera";
export type { MouseCaptorEvents } from "./core/captors/mouse";
export type { TouchCaptorEvents } from "./core/captors/touch";
export type { FontKey, FontDescriptor, GlyphMetrics, SDFAtlasOptions } from "./core/sdf-atlas";

/**
 * Options API:
 */
export { defineSigmaOptions } from "./types/options";

/**
 * Styles API:
 */
export type {
  BaseNodeState,
  BaseEdgeState,
  BaseGraphState,
  FullNodeState,
  FullEdgeState,
  FullGraphState,
  ForbidBaseKeys,
  NodeBackdropBuiltInVariables,
  StylesDeclaration,
  StatePredicate,
  DataPredicate,
  DirectAttributeBinding,
  NumericalAttributeBinding,
  GraphicValue,
  InlineFunctionConditional,
  InlineStateConditional,
  InlineDataConditional,
  StageStyleValue,
  StageStyles,
} from "./types/styles";
export { DEFAULT_STYLES, DEPTHLESS_STYLES } from "./types/styles";
export {
  resolveGraphicValue,
  evaluateStatePredicate,
  evaluateDataPredicate,
  evaluateNodeStyle,
  evaluateEdgeStyle,
  analyzeStyleDeclaration,
} from "./core/styles";
export { isInlineFunctionConditional, isInlineStateConditional, isInlineDataConditional } from "./types/styles";
export type { ResolvedStageStyle, StyleDependency, StyleAnalysis } from "./core/styles";

/**
 * Primitives API:
 */
export type {
  PrimitivesDeclaration,
  ExtractDepthLayersFromPrimitives,
  NodePrimitives,
  EdgePrimitives,
  LabelAttachmentContent,
  LabelAttachmentRenderer,
  LabelAttachmentContext,
} from "./primitives/types";
export { DEFAULT_PRIMITIVES, DEFAULT_NODE_PRIMITIVES, DEFAULT_EDGE_PRIMITIVES } from "./primitives/types";
