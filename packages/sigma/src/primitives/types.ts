/**
 * Sigma.js v4 Primitives API - Type Definitions
 * ==============================================
 *
 * Types for the primitives declaration system.
 *
 * @module
 */
import { layerFill, layerPlain, pathLine, pathLoop, sdfCircle } from "../rendering";
import type {
  EdgeExtremity,
  EdgeLabelOptions,
  EdgeLayer,
  EdgePath,
  FragmentLayer,
  LabelOptions,
  SDFShape,
} from "../rendering";

// =============================================================================
// GRAPHIC VARIABLES
// =============================================================================

export type GraphicVariableType = "number" | "string" | "color" | "boolean";

export interface GraphicVariableDefinition<T = unknown> {
  type: GraphicVariableType;
  default: T;
}

export type VariablesDefinition = Record<string, GraphicVariableDefinition>;

// =============================================================================
// NODE SHAPES
// =============================================================================

export interface CustomNodeShape {
  name: string;
  glsl: string;
  inradiusFactor?: number;
}

export type NodeShapeSpec = CustomNodeShape | SDFShape;

// =============================================================================
// NODE LAYERS
// =============================================================================

export interface CustomNodeLayer {
  name: string;
  glsl: string;
  graphicVariables: readonly GraphicVariableDefinition[];
}

export type NodeLayerSpec = CustomNodeLayer | FragmentLayer;

// =============================================================================
// EDGE PATHS
// =============================================================================

export interface CustomEdgePath {
  name: string;
  segments: number;
  glsl: string;
  graphicVariables?: readonly GraphicVariableDefinition[];
}

export type EdgePathSpec = CustomEdgePath | EdgePath;

// =============================================================================
// EDGE EXTREMITIES
// =============================================================================

export interface CustomEdgeExtremity {
  name: string;
  glsl: string;
  length: number;
  widthFactor: number;
}

export type EdgeExtremitySpec = CustomEdgeExtremity | EdgeExtremity;

// =============================================================================
// EDGE LAYERS
// =============================================================================

export interface CustomEdgeLayer {
  name: string;
  glsl: string;
  graphicVariables: readonly GraphicVariableDefinition[];
}

export type EdgeLayerSpec = CustomEdgeLayer | EdgeLayer;

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isCustomNodeLayer(spec: NodeLayerSpec): spec is CustomNodeLayer {
  return typeof spec === "object" && "glsl" in spec && !("attributes" in spec);
}

export function isCustomEdgeLayer(spec: EdgeLayerSpec): spec is CustomEdgeLayer {
  return typeof spec === "object" && "glsl" in spec && !("attributes" in spec);
}

// =============================================================================
// PRIMITIVES DECLARATIONS
// =============================================================================

/**
 * Backdrop style configuration for hover effects.
 * Values can be constants (baked into shader) or attribute references (per-node storage).
 */
export interface BackdropOptions {
  color?: string | { attribute: string; default?: string };
  shadowColor?: string | { attribute: string; default?: string };
  shadowBlur?: number | { attribute: string; default?: number };
  padding?: number | { attribute: string; default?: number };
}

/**
 * A label attachment renderer receives context about the node and returns
 * a drawable image source (canvas, image, etc.) or null to skip.
 */
export interface LabelAttachmentContext {
  node: string;
  attributes: Record<string, unknown>;
  pixelRatio: number;
  labelWidth: number;
  labelHeight: number;
}

/**
 * The content returned by a label attachment renderer.
 * - "canvas": an already-rendered HTMLCanvasElement (dimensions from canvas.width/height)
 * - "svg": an SVG string or element (dimensions parsed from width/height attributes or viewBox)
 * - "html": an HTML string or element with explicit dimensions (rendered via SVG foreignObject)
 */
export type LabelAttachmentContent =
  | { type: "canvas"; canvas: HTMLCanvasElement }
  | { type: "svg"; svg: string | SVGElement }
  | { type: "html"; html: string | HTMLElement; css?: string; width?: number; height?: number };

export type LabelAttachmentRenderer = (
  ctx: LabelAttachmentContext,
) => LabelAttachmentContent | null | Promise<LabelAttachmentContent | null>;

export interface NodePrimitives {
  shapes?: readonly NodeShapeSpec[] | NodeShapeSpec[];
  variables?: VariablesDefinition;
  layers?: readonly NodeLayerSpec[] | NodeLayerSpec[];
  rotateWithCamera?: boolean;
  label?: LabelOptions;
  backdrop?: BackdropOptions;
  labelAttachments?: Record<string, LabelAttachmentRenderer>;
}

export interface EdgePrimitives {
  paths?: readonly EdgePathSpec[] | EdgePathSpec[];
  extremities?: readonly EdgeExtremitySpec[] | EdgeExtremitySpec[];
  variables?: VariablesDefinition;
  layers?: readonly EdgeLayerSpec[] | EdgeLayerSpec[];
  defaultHead?: string;
  defaultTail?: string;
  label?: EdgeLabelOptions;
}

export interface PrimitivesDeclaration {
  nodes?: NodePrimitives;
  edges?: EdgePrimitives;
  depthLayers?: readonly string[];
}

// =============================================================================
// VARIABLE EXTRACTION
// =============================================================================

type VariablesDefinitionToType<V extends VariablesDefinition> = {
  [K in keyof V]: V[K]["type"] extends "number"
    ? number
    : V[K]["type"] extends "color" | "string"
      ? string
      : V[K]["type"] extends "boolean"
        ? boolean
        : unknown;
};

export type ExtractAllNodeVariables<N extends NodePrimitives> = N["variables"] extends VariablesDefinition
  ? VariablesDefinitionToType<N["variables"]>
  : object;

export type ExtractAllEdgeVariables<E extends EdgePrimitives> = E["variables"] extends VariablesDefinition
  ? VariablesDefinitionToType<E["variables"]>
  : object;

export type ExtractNodeVarsFromPrimitives<P extends PrimitivesDeclaration> = P extends {
  nodes: infer NP extends NodePrimitives;
}
  ? ExtractAllNodeVariables<NP>
  : {};

export type ExtractEdgeVarsFromPrimitives<P extends PrimitivesDeclaration> = P extends {
  edges: infer EP extends EdgePrimitives;
}
  ? ExtractAllEdgeVariables<EP>
  : {};

// =============================================================================

// =============================================================================

export const DEFAULT_NODE_PRIMITIVES: Required<NodePrimitives> = {
  shapes: [sdfCircle()],
  variables: {},
  layers: [layerFill()],
  rotateWithCamera: false,
  label: {},
  backdrop: {},
  labelAttachments: {},
};

export const DEFAULT_EDGE_PRIMITIVES: Required<EdgePrimitives> = {
  paths: [pathLine(), pathLoop()],
  extremities: [],
  variables: {},
  layers: [layerPlain()],
  defaultHead: "none",
  defaultTail: "none",
  label: {},
};

export const DEFAULT_NODE_DEPTH_LAYERS = ["nodes", "topNodes"] as const;
export const DEFAULT_EDGE_DEPTH_LAYERS = ["edges", "topEdges"] as const;
export const DEFAULT_DEPTH_LAYERS = [...DEFAULT_EDGE_DEPTH_LAYERS, ...DEFAULT_NODE_DEPTH_LAYERS] as const;

export type DefaultDepthLayer = (typeof DEFAULT_DEPTH_LAYERS)[number];
export type DefaultNodeDepthLayer = (typeof DEFAULT_NODE_DEPTH_LAYERS)[number];
export type DefaultEdgeDepthLayer = (typeof DEFAULT_EDGE_DEPTH_LAYERS)[number];

/**
 * Extracts the depth-layer union from a primitives declaration: the literal
 * `depthLayers` tuple when one is declared, otherwise the default layers. A
 * widened `string[]` (no literal info) also falls back to the defaults.
 */
export type ExtractDepthLayersFromPrimitives<P extends PrimitivesDeclaration> = P extends {
  depthLayers: infer D extends readonly string[];
}
  ? string[] extends D
    ? DefaultDepthLayer
    : D[number]
  : DefaultDepthLayer;

export const DEFAULT_PRIMITIVES: Required<PrimitivesDeclaration> = {
  nodes: DEFAULT_NODE_PRIMITIVES,
  edges: DEFAULT_EDGE_PRIMITIVES,
  depthLayers: [...DEFAULT_DEPTH_LAYERS],
};
