/**
 * Sigma.js v4 Styling API - Type Definitions
 * ==========================================
 *
 * This file defines the types for the "styles" part of the new API.
 * The "programs declaration" part (shapes, layers, paths, etc.) is not yet covered.
 *
 * @module
 */
import { AbstractGraph } from "graphology-types";

import type { DefaultEdgeDepthLayer, DefaultNodeDepthLayer } from "../primitives/types";
import { Easing } from "../utils/easings";

/**
 * Generic attributes type (user-defined).
 */
export type Attributes = Record<string, unknown>;

/**
 * Empty record type for default program variables (no additional variables).
 */
export type EmptyVariables = {};

/**
 * Built-in state flags for nodes.
 * Can be extended by users via generics.
 */
export interface BaseNodeState {
  isHovered: boolean;
  isLabelHovered: boolean;
  isHidden: boolean;
  isHighlighted: boolean;
  isDragged: boolean;
}

/**
 * Built-in state flags for edges.
 * Can be extended by users via generics.
 */
export interface BaseEdgeState {
  isHovered: boolean;
  isLabelHovered: boolean;
  isHidden: boolean;
  isHighlighted: boolean;
  /** 0-based position in the parallel edge group (direction-aware ordering) */
  parallelIndex: number;
  /** Total edges between the same endpoints (1 when alone) */
  parallelCount: number;
}

/**
 * Built-in state for the graph instance.
 * Can be extended by users via generics.
 */
export interface BaseGraphState {
  isIdle: boolean;
  isPanning: boolean;
  isZooming: boolean;
  isDragging: boolean;
  hasHovered: boolean;
  hasHighlighted: boolean;
}

/**
 * Full state types: base state merged with user-provided additional fields.
 * NS/ES/GS generics throughout the codebase represent only the *additional*
 * custom fields. These utility types produce the complete state.
 */
export type FullNodeState<NS = {}> = NS & BaseNodeState;
export type FullEdgeState<ES = {}> = ES & BaseEdgeState;
export type FullGraphState<GS = {}> = GS & BaseGraphState;

/**
 * Prevents custom state from shadowing built-in base state keys.
 * Properties that collide with base keys resolve to `never`, causing a type error.
 */
export type ForbidBaseKeys<Base, T> = { [K in keyof T]: K extends keyof Base ? never : T[K] };

/**
 * State predicate for conditional styling (whenState / matchState).
 * Shorthand forms only — use `when` for function predicates.
 *
 * - string: Single state flag name (e.g., "isHovered") - true if flag is true
 * - string[]: Array of state flags - true if ALL flags are true (AND logic)
 * - object: Map of state flags to expected values (AND logic)
 */
export type StatePredicate<S = BaseNodeState | BaseEdgeState> = keyof S | readonly (keyof S)[] | Partial<S>;

/**
 * Data predicate for conditional styling based on graph attributes (whenData).
 * Shorthand forms only — use `when` for function predicates.
 *
 * - string: Single attribute name - true if the attribute is truthy
 * - string[]: Array of attribute names - true if ALL are truthy (AND logic)
 * - object: Map of attribute names to expected values (AND logic)
 */
export type DataPredicate<A extends Attributes = Attributes> = keyof A | readonly (keyof A)[] | Partial<A>;

/**
 * Direct attribute binding - reads value directly from an attribute.
 */
export interface DirectAttributeBinding<T> {
  attribute: string;
  defaultValue?: T;
}

/**
 * Numerical attribute binding with range mapping.
 * Maps attribute values to a min/max range with optional easing.
 */
export interface NumericalAttributeBinding extends DirectAttributeBinding<number> {
  min?: number;
  max?: number;
  /** Attribute value corresponding to min (defaults to data min) */
  minValue?: number;
  /** Attribute value corresponding to max (defaults to data max) */
  maxValue?: number;
  /** Easing function for interpolation */
  easing?: Easing;
}

/**
 * Categorical attribute binding with dictionary mapping.
 * Maps attribute values to specific output values via a dictionary.
 */
export interface CategoricalAttributeBinding<T> extends DirectAttributeBinding<T> {
  dict: Record<string, T>;
}

/**
 * Any attribute binding type.
 * Note: [T] wrapping prevents distributive conditional type behavior.
 */
export type AttributeBinding<T> =
  | DirectAttributeBinding<T>
  | ([T] extends [number] ? NumericalAttributeBinding : never)
  | CategoricalAttributeBinding<T>;

/**
 * Function-based value resolution.
 * Receives attributes, state, graph state, and the graph instance.
 */
export type ValueFunction<A extends Attributes, S, GS, T> = (
  attributes: A,
  state: S,
  graphState: GS,
  graph: AbstractGraph,
) => T;

/**
 * Inline function conditional value.
 * Chooses between `then` and `else` based on a function predicate.
 * The function receives attributes, state, graph state, and the graph instance.
 * Use this when neither `whenState` nor `whenData` shorthand forms are expressive enough.
 */
export interface InlineFunctionConditional<A extends Attributes, S, GS, T> {
  when: (attributes: A, state: S, graphState: GS, graph: AbstractGraph) => boolean;
  then: GraphicValue<A, S, GS, T>;
  else?: GraphicValue<A, S, GS, T>;
}

/**
 * Inline state conditional value.
 * Chooses between `then` and `else` based on a state shorthand predicate.
 * - `then` and `else` can be direct values, attribute bindings, or functions
 * - `else` is optional; if omitted, falls back to the graphic variable's default
 */
export interface InlineStateConditional<A extends Attributes, S, GS, T> {
  whenState: StatePredicate<S>;
  then: GraphicValue<A, S, GS, T>;
  else?: GraphicValue<A, S, GS, T>;
}

/**
 * Inline data conditional value.
 * Chooses between `then` and `else` based on a graph attribute shorthand predicate.
 * - `then` and `else` can be direct values, attribute bindings, or functions
 * - `else` is optional; if omitted, falls back to the graphic variable's default
 */
export interface InlineDataConditional<A extends Attributes, S, GS, T> {
  whenData: DataPredicate<A>;
  then: GraphicValue<A, S, GS, T>;
  else?: GraphicValue<A, S, GS, T>;
}

/**
 * Complete value specification for a graphic variable.
 * Can be any of: direct value, attribute binding, function, or inline conditional.
 */
export type GraphicValue<A extends Attributes, S, GS, T> =
  | T
  | AttributeBinding<T>
  | ValueFunction<A, S, GS, T>
  | InlineFunctionConditional<A, S, GS, T>
  | InlineStateConditional<A, S, GS, T>
  | InlineDataConditional<A, S, GS, T>;

/**
 * Type guard: checks if a value is an attribute binding.
 */
export function isAttributeBinding<T>(value: unknown): value is AttributeBinding<T> {
  return typeof value === "object" && value !== null && "attribute" in value;
}

/**
 * Type guard: checks if a value is a value function.
 */
export function isValueFunction<A extends Attributes, S, GS, T>(value: unknown): value is ValueFunction<A, S, GS, T> {
  return typeof value === "function";
}

/**
 * Type guard: checks if a value is an inline function conditional.
 */
export function isInlineFunctionConditional<A extends Attributes, S, GS, T>(
  value: unknown,
): value is InlineFunctionConditional<A, S, GS, T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "when" in value &&
    typeof (value as Record<string, unknown>).when === "function" &&
    "then" in value
  );
}

/**
 * Type guard: checks if a value is an inline state conditional.
 */
export function isInlineStateConditional<A extends Attributes, S, GS, T>(
  value: unknown,
): value is InlineStateConditional<A, S, GS, T> {
  return typeof value === "object" && value !== null && "whenState" in value && "then" in value;
}

/**
 * Type guard: checks if a value is an inline data conditional.
 */
export function isInlineDataConditional<A extends Attributes, S, GS, T>(
  value: unknown,
): value is InlineDataConditional<A, S, GS, T> {
  return typeof value === "object" && value !== null && "whenData" in value && "then" in value;
}

/**
 * Built-in graphic variables for nodes.
 * These are always available regardless of program declaration.
 */
export interface NodeBuiltInVariables<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  Shape extends string = string,
  Layer extends string = string,
> {
  /** Node shape (must match a shape declared in programs) */
  shape?: GraphicValue<NA, NS, GS, Shape>;
  /** X coordinate in graph space */
  x?: GraphicValue<NA, NS, GS, number>;
  /** Y coordinate in graph space */
  y?: GraphicValue<NA, NS, GS, number>;
  /** Node size (diameter in pixels) */
  size?: GraphicValue<NA, NS, GS, number>;
  /** Node color */
  color?: GraphicValue<NA, NS, GS, string>;
  /** Overall opacity (0-1) */
  opacity?: GraphicValue<NA, NS, GS, number>;
  /** Visibility */
  visibility?: GraphicValue<NA, NS, GS, "visible" | "hidden">;
  /** Depth layer for render ordering */
  depth?: GraphicValue<NA, NS, GS, Layer>;
  /** Z-index within the depth layer */
  zIndex?: GraphicValue<NA, NS, GS, number>;
  /** CSS cursor to show when hovering this node */
  cursor?: GraphicValue<NA, NS, GS, string>;
}

/**
 * Built-in graphic variables for node backdrops.
 * Controls the background shape rendered behind nodes (and optionally their labels).
 */
export interface NodeBackdropBuiltInVariables<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
> {
  /** Backdrop visibility */
  backdropVisibility?: GraphicValue<NA, NS, GS, "visible" | "hidden">;
  /** Backdrop fill color (transparent = no backdrop) */
  backdropColor?: GraphicValue<NA, NS, GS, string>;
  /** Backdrop shadow color */
  backdropShadowColor?: GraphicValue<NA, NS, GS, string>;
  /** Backdrop shadow blur radius in pixels */
  backdropShadowBlur?: GraphicValue<NA, NS, GS, number>;
  /** Backdrop padding around node+label in pixels */
  backdropPadding?: GraphicValue<NA, NS, GS, number>;
  /** Backdrop border color (transparent = no border) */
  backdropBorderColor?: GraphicValue<NA, NS, GS, string>;
  /** Backdrop border width in pixels */
  backdropBorderWidth?: GraphicValue<NA, NS, GS, number>;
  /** Backdrop corner radius in pixels */
  backdropCornerRadius?: GraphicValue<NA, NS, GS, number>;
  /** Backdrop label padding in pixels (-1 = fall back to backdropPadding) */
  backdropLabelPadding?: GraphicValue<NA, NS, GS, number>;
  /** Which area the backdrop covers */
  backdropArea?: GraphicValue<NA, NS, GS, "both" | "node" | "label">;
}

/**
 * Built-in graphic variables for node labels.
 * These are always available regardless of program declaration.
 */
export interface NodeLabelBuiltInVariables<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  Layer extends string = string,
> {
  /** Label text content */
  label?: GraphicValue<NA, NS, GS, string>;
  /** Label text color */
  labelColor?: GraphicValue<NA, NS, GS, string>;
  /** Label font size in pixels */
  labelSize?: GraphicValue<NA, NS, GS, number>;
  /** Label font family */
  labelFont?: GraphicValue<NA, NS, GS, string>;
  /** Label visibility */
  labelVisibility?: GraphicValue<NA, NS, GS, "auto" | "visible" | "hidden">;
  /** Label position relative to node */
  labelPosition?: GraphicValue<NA, NS, GS, "right" | "left" | "above" | "below" | "over">;
  /** Label angle */
  labelAngle?: GraphicValue<NA, NS, GS, number>;
  /** Depth layer for label render ordering */
  labelDepth?: GraphicValue<NA, NS, GS, Layer>;
  /** Label attachment name (references a key in primitives.nodes.labelAttachments) */
  labelAttachment?: GraphicValue<NA, NS, GS, string | null>;
  /** Where to place the attachment relative to the label */
  labelAttachmentPlacement?: GraphicValue<NA, NS, GS, "below" | "above" | "left" | "right">;
  /** Label background fill color (transparent = no background) */
  labelBackgroundColor?: GraphicValue<NA, NS, GS, string>;
  /** Label background padding in pixels */
  labelBackgroundPadding?: GraphicValue<NA, NS, GS, number>;
  /** CSS cursor to show when hovering this node's label */
  labelCursor?: GraphicValue<NA, NS, GS, string>;
}

/**
 * All node graphic variables (built-in + program-declared).
 * Program-declared variables are added via intersection with additional types.
 */
export type NodeStyleProperties<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = NodeBuiltInVariables<NA, NS, GS, string, Layer> &
  NodeBackdropBuiltInVariables<NA, NS, GS> &
  NodeLabelBuiltInVariables<NA, NS, GS, Layer> & {
    [K in keyof ProgramVariables]?: GraphicValue<NA, NS, GS, ProgramVariables[K]>;
  };

/**
 * Built-in graphic variables for edges.
 * These are always available regardless of program declaration.
 */
export interface EdgeBuiltInVariables<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  Path extends string = string,
  Layer extends string = string,
> {
  /** Edge path type for regular edges (must match a path declared in paths) */
  path?: GraphicValue<EA, ES, GS, Path>;
  /** Edge path type for self-loop edges (must match a path declared in paths) */
  selfLoopPath?: GraphicValue<EA, ES, GS, string>;
  /** Edge path type for parallel edges (auto-selected when parallelCount > 1) */
  parallelPath?: GraphicValue<EA, ES, GS, string>;
  /** Spread factor for parallel edge separation (used with path's spread definition) */
  parallelSpread?: GraphicValue<EA, ES, GS, number>;
  /** Edge thickness in pixels */
  size?: GraphicValue<EA, ES, GS, number>;
  /** Edge color */
  color?: GraphicValue<EA, ES, GS, string>;
  /** Overall opacity (0-1) */
  opacity?: GraphicValue<EA, ES, GS, number>;
  /** Source extremity (tail) */
  tail?: GraphicValue<EA, ES, GS, string>;
  /** Target extremity (head) */
  head?: GraphicValue<EA, ES, GS, string>;
  /** Visibility */
  visibility?: GraphicValue<EA, ES, GS, "visible" | "hidden">;
  /** Depth layer for render ordering */
  depth?: GraphicValue<EA, ES, GS, Layer>;
  /** Z-index within the depth layer */
  zIndex?: GraphicValue<EA, ES, GS, number>;
  /** CSS cursor to show when hovering this edge */
  cursor?: GraphicValue<EA, ES, GS, string>;
}

/**
 * Built-in graphic variables for edge labels.
 * These are always available regardless of program declaration.
 */
export interface EdgeLabelBuiltInVariables<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  Layer extends string = string,
> {
  /** Label text content */
  label?: GraphicValue<EA, ES, GS, string>;
  /** Label text color */
  labelColor?: GraphicValue<EA, ES, GS, string>;
  /** Label font size in pixels */
  labelSize?: GraphicValue<EA, ES, GS, number>;
  /** Label font family */
  labelFont?: GraphicValue<EA, ES, GS, string>;
  /** Label visibility */
  labelVisibility?: GraphicValue<EA, ES, GS, "auto" | "visible" | "hidden">;
  /** Label position along edge (0 = source, 0.5 = middle, 1 = target) or mode */
  labelPosition?: GraphicValue<EA, ES, GS, number | "over" | "above" | "below" | "auto">;
  /** Depth layer for label render ordering */
  labelDepth?: GraphicValue<EA, ES, GS, Layer>;
  /** Label background fill color (transparent = no background) */
  labelBackgroundColor?: GraphicValue<EA, ES, GS, string>;
  /** Label background padding in pixels */
  labelBackgroundPadding?: GraphicValue<EA, ES, GS, number>;
  /** CSS cursor to show when hovering this edge's label */
  labelCursor?: GraphicValue<EA, ES, GS, string>;
}

/**
 * All edge graphic variables (built-in + program-declared).
 * Program-declared variables are added via intersection with additional types.
 */
export type EdgeStyleProperties<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = EdgeBuiltInVariables<EA, ES, GS, string, Layer> &
  EdgeLabelBuiltInVariables<EA, ES, GS, Layer> & {
    [K in keyof ProgramVariables]?: GraphicValue<EA, ES, GS, ProgramVariables[K]>;
  };

/**
 * Leaf value - a value without conditionals.
 * Used inside rule-level conditionals where nesting is not allowed.
 */
export type LeafValue<A extends Attributes, S, GS, T> = T | AttributeBinding<T> | ValueFunction<A, S, GS, T>;

/**
 * Helper type to extract the base value type from a GraphicValue.
 * Note: [GV] wrapping prevents distributive conditional type behavior.
 */
type ExtractBaseType<GV> = [GV] extends [GraphicValue<infer _A, infer _S, infer _GS, infer T>] ? T : never;

/**
 * Node style properties with LEAF values only (no conditionals).
 * Used as the then/else type for rule-level conditionals.
 */
export type NodeStylePropertiesLeaf<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = {
  [K in keyof NodeStyleProperties<NA, NS, GS, ProgramVariables, Layer>]?: LeafValue<
    NA,
    NS,
    GS,
    ExtractBaseType<NodeStyleProperties<NA, NS, GS, ProgramVariables, Layer>[K]>
  >;
};

/**
 * Edge style properties with LEAF values only (no conditionals).
 * Used as the then/else type for rule-level conditionals.
 */
export type EdgeStylePropertiesLeaf<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = {
  [K in keyof EdgeStyleProperties<EA, ES, GS, ProgramVariables, Layer>]?: LeafValue<
    EA,
    ES,
    GS,
    ExtractBaseType<EdgeStyleProperties<EA, ES, GS, ProgramVariables, Layer>[K]>
  >;
};

/**
 * Node style properties object where each property CAN have conditionals.
 */
export type NodeStylePropertiesWithConditionals<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = {
  [K in keyof NodeStyleProperties<NA, NS, GS, ProgramVariables, Layer>]?: GraphicValue<
    NA,
    NS,
    GS,
    ExtractBaseType<NodeStyleProperties<NA, NS, GS, ProgramVariables, Layer>[K]>
  >;
};

/**
 * Edge style properties object where each property CAN have conditionals.
 */
export type EdgeStylePropertiesWithConditionals<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = {
  [K in keyof EdgeStyleProperties<EA, ES, GS, ProgramVariables, Layer>]?: GraphicValue<
    EA,
    ES,
    GS,
    ExtractBaseType<EdgeStyleProperties<EA, ES, GS, ProgramVariables, Layer>[K]>
  >;
};

/**
 * A style rule for nodes. One of:
 * - when: function conditional (graph-state dependency)
 * - whenState: shorthand state conditional (item-state dependency)
 * - whenData: shorthand attribute conditional (static dependency)
 * - matchData: categorical branch on a graph attribute (static)
 * - matchState: categorical branch on a state value (item-state)
 * - properties object: each property can have its own inline conditional
 */
export type NodeStyleRule<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> =
  | {
      when: (attributes: NA, state: NS, graphState: GS, graph: AbstractGraph) => boolean;
      then: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
      else?: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
    }
  | {
      whenState: StatePredicate<NS>;
      then: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
      else?: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
    }
  | {
      whenData: DataPredicate<NA>;
      then: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
      else?: NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>;
    }
  | { matchData: string; cases: Record<string, NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>> }
  | { matchState: keyof NS; cases: Record<string, NodeStylePropertiesLeaf<NA, NS, GS, ProgramVariables, Layer>> }
  | NodeStylePropertiesWithConditionals<NA, NS, GS, ProgramVariables, Layer>;

/**
 * A style rule for edges. One of:
 * - when: function conditional (graph-state dependency)
 * - whenState: shorthand state conditional (item-state dependency)
 * - whenData: shorthand attribute conditional (static dependency)
 * - matchData: categorical branch on a graph attribute (static)
 * - matchState: categorical branch on a state value (item-state)
 * - properties object: each property can have its own inline conditional
 */
export type EdgeStyleRule<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> =
  | {
      when: (attributes: EA, state: ES, graphState: GS, graph: AbstractGraph) => boolean;
      then: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
      else?: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
    }
  | {
      whenState: StatePredicate<ES>;
      then: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
      else?: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
    }
  | {
      whenData: DataPredicate<EA>;
      then: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
      else?: EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>;
    }
  | { matchData: string; cases: Record<string, EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>> }
  | { matchState: keyof ES; cases: Record<string, EdgeStylePropertiesLeaf<EA, ES, GS, ProgramVariables, Layer>> }
  | EdgeStylePropertiesWithConditionals<EA, ES, GS, ProgramVariables, Layer>;

/**
 * Node styles declaration.
 * Can be either:
 * - Object form: simple case with inline conditionals
 * - Array form: ordered rules for complex cases
 */
export type NodeStyles<
  NA extends Attributes = Attributes,
  NS extends BaseNodeState = BaseNodeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = NodeStyleRule<NA, NS, GS, ProgramVariables, Layer> | NodeStyleRule<NA, NS, GS, ProgramVariables, Layer>[];

/**
 * Edge styles declaration.
 * Can be either:
 * - Object form: simple case with inline conditionals
 * - Array form: ordered rules for complex cases
 */
export type EdgeStyles<
  EA extends Attributes = Attributes,
  ES extends BaseEdgeState = BaseEdgeState,
  GS extends BaseGraphState = BaseGraphState,
  ProgramVariables = EmptyVariables,
  Layer extends string = string,
> = EdgeStyleRule<EA, ES, GS, ProgramVariables, Layer> | EdgeStyleRule<EA, ES, GS, ProgramVariables, Layer>[];

/**
 * Complete styles declaration.
 *
 * Generic parameters:
 * - NA: Node attributes type
 * - EA: Edge attributes type
 * - NS: Node state type (extends BaseNodeState)
 * - ES: Edge state type (extends BaseEdgeState)
 * - GS: Graph state type (extends BaseGraphState)
 * - NodeProgramVariables: Additional variables exposed by node program layers
 * - EdgeProgramVariables: Additional variables exposed by edge program layers
 */
/**
 * Stage style predicate: matches against graph state flags.
 * Shorthand forms only — use `when` for function predicates.
 */
export type StagePredicate<GS extends BaseGraphState = BaseGraphState> = keyof GS | readonly (keyof GS)[] | Partial<GS>;

/**
 * Stage style inline conditional with a shorthand state predicate.
 */
export interface StageInlineConditional<GS extends BaseGraphState, T> {
  whenState: StagePredicate<GS>;
  then: T | ((graphState: GS) => T);
  else?: T | ((graphState: GS) => T);
}

/**
 * Stage style inline conditional with a function predicate.
 */
export interface StageInlineFunctionConditional<GS extends BaseGraphState, T> {
  when: (graphState: GS) => boolean;
  then: T | ((graphState: GS) => T);
  else?: T | ((graphState: GS) => T);
}

/**
 * Value type for stage style properties.
 * Supports direct values, graph-state functions, and inline conditionals.
 */
export type StageStyleValue<GS extends BaseGraphState, T> =
  | T
  | ((graphState: GS) => T)
  | StageInlineFunctionConditional<GS, T>
  | StageInlineConditional<GS, T>;

/**
 * Built-in stage style properties.
 */
export interface StageStyleProperties<GS extends BaseGraphState = BaseGraphState> {
  /** CSS cursor on the stage (used as fallback when no item is hovered) */
  cursor?: StageStyleValue<GS, string>;
  /** Stage background color */
  background?: StageStyleValue<GS, string>;
}

/**
 * A stage style rule: either a conditional block or a direct properties object.
 */
export type StageStyleRule<GS extends BaseGraphState = BaseGraphState> =
  | { when: (graphState: GS) => boolean; then: StageStyleProperties<GS>; else?: StageStyleProperties<GS> }
  | { whenState: StagePredicate<GS>; then: StageStyleProperties<GS>; else?: StageStyleProperties<GS> }
  | StageStyleProperties<GS>;

/**
 * Stage styles declaration: a single rule or an array of rules.
 */
export type StageStyles<GS extends BaseGraphState = BaseGraphState> = StageStyleRule<GS> | StageStyleRule<GS>[];

export interface StylesDeclaration<
  NA extends Attributes = Attributes,
  EA extends Attributes = Attributes,
  NS = {}, // additional custom node state fields
  ES = {}, // additional custom edge state fields
  GS = {}, // additional custom graph state fields
  NodeProgramVariables = EmptyVariables,
  EdgeProgramVariables = EmptyVariables,
  Layer extends string = string,
> {
  nodes?: NodeStyles<NA, FullNodeState<NS>, FullGraphState<GS>, NodeProgramVariables, Layer>;
  edges?: EdgeStyles<EA, FullEdgeState<ES>, FullGraphState<GS>, EdgeProgramVariables, Layer>;
  stage?: StageStyles<FullGraphState<GS>>;
}

/**
 * Default node state values.
 */
export const DEFAULT_NODE_STATE: BaseNodeState = {
  isHovered: false,
  isLabelHovered: false,
  isHidden: false,
  isHighlighted: false,
  isDragged: false,
};

/**
 * Default edge state values.
 */
export const DEFAULT_EDGE_STATE: BaseEdgeState = {
  isHovered: false,
  isLabelHovered: false,
  isHidden: false,
  isHighlighted: false,
  parallelIndex: 0,
  parallelCount: 1,
};

/**
 * Default graph state values.
 */
export const DEFAULT_GRAPH_STATE: BaseGraphState = {
  isIdle: true,
  isPanning: false,
  isZooming: false,
  isDragging: false,
  hasHovered: false,
  hasHighlighted: false,
};

/**
 * Creates a new node state with default values.
 * NS represents additional custom fields only.
 */
export function createNodeState<NS = {}>(defaults?: NS): FullNodeState<NS> {
  return { ...DEFAULT_NODE_STATE, ...defaults } as FullNodeState<NS>;
}

/**
 * Creates a new edge state with default values.
 * ES represents additional custom fields only.
 */
export function createEdgeState<ES = {}>(defaults?: ES): FullEdgeState<ES> {
  return { ...DEFAULT_EDGE_STATE, ...defaults } as FullEdgeState<ES>;
}

/**
 * Creates a new graph state with default values.
 * GS represents additional custom fields only.
 */
export function createGraphState<GS = {}>(defaults?: GS): FullGraphState<GS> {
  return { ...DEFAULT_GRAPH_STATE, ...defaults } as FullGraphState<GS>;
}

// Default visual style values, shared by DEPTHLESS_STYLES and DEFAULT_STYLES.
const baseNodeStyle = {
  x: { attribute: "x" },
  y: { attribute: "y" },
  size: {
    whenState: "isHovered",
    then: { attribute: "size", defaultValue: 12 },
    else: { attribute: "size", defaultValue: 10 },
  },
  color: { attribute: "color", defaultValue: "#666" },
  label: { attribute: "label" },
  visibility: {
    whenState: "isHidden",
    then: "hidden",
    else: "visible",
  },
  labelVisibility: {
    whenState: "isHovered",
    then: "visible",
    else: "auto",
  },
  backdropVisibility: {
    whenState: "isHovered",
    then: "visible",
    else: "hidden",
  },
  backdropColor: "#ffffff",
  backdropShadowColor: "rgba(0, 0, 0, 0.5)",
  backdropShadowBlur: 12,
  backdropPadding: 6,
} as const satisfies NodeStylePropertiesWithConditionals<Attributes, BaseNodeState, BaseGraphState>;

const baseEdgeStyle = {
  size: { attribute: "size", defaultValue: 1 },
  color: { attribute: "color", defaultValue: "#ccc" },
  label: { attribute: "label" },
  visibility: {
    whenState: "isHidden",
    then: "hidden",
    else: "visible",
  },
} as const satisfies EdgeStylePropertiesWithConditionals<Attributes, BaseEdgeState, BaseGraphState>;

/**
 * Default *visual* styles, with no depth-layer assignment.
 *
 * `DEFAULT_STYLES` minus its `depth` rules. Because they declare no `depth`,
 * they splice into a styles array whatever the declared `depthLayers` (and
 * whatever the custom node/edge/graph state). Use as a base when bringing
 * custom depth layers and assigning `depth` yourself:
 *
 *     styles: { nodes: [DEPTHLESS_STYLES.nodes, { depth: "myLayer" }] }
 *
 * Kept as their precise literal type on purpose: widening to `NodeStyleRule` /
 * `EdgeStyleRule` would reintroduce a `depth` property and block the splice.
 */
export const DEPTHLESS_STYLES = {
  nodes: baseNodeStyle,
  edges: baseEdgeStyle,
};

/**
 * Default styles declaration.
 *
 * `DEPTHLESS_STYLES` plus the default `depth` rules: hover/highlight lift items to
 * the `topNodes` / `topEdges` layers.
 *
 * Users can:
 * - Use DEFAULT_STYLES as-is for sensible defaults
 * - Extend with spread: { nodes: { ...DEFAULT_STYLES.nodes, size: 20 } }
 * - Replace entirely by providing their own styles object
 * - Use DEPTHLESS_STYLES instead when declaring custom `depthLayers`
 */
export const DEFAULT_STYLES: {
  nodes: NodeStyleRule<Attributes, BaseNodeState, BaseGraphState, EmptyVariables, DefaultNodeDepthLayer>;
  edges: EdgeStyleRule<Attributes, BaseEdgeState, BaseGraphState, EmptyVariables, DefaultEdgeDepthLayer>;
} = {
  nodes: {
    ...baseNodeStyle,
    depth: {
      whenState: "isHovered",
      then: "topNodes",
      else: "nodes",
    },
  },
  edges: {
    ...baseEdgeStyle,
    depth: {
      whenState: ["isHighlighted", "isHovered"],
      then: "topEdges",
      else: "edges",
    },
  },
} as const;
