/**
 * Sigma.js Edge Programs - Type Definitions
 * ==========================================
 *
 * Types and interfaces for the composable edge program architecture.
 * This system separates path geometry, extremities (head/tail), and layer
 * to enable flexible edge rendering with single-pass WebGL drawing.
 *
 * @module
 */
import { EdgeLabelFontSizeMode } from "../../types";
import { AttributeSpecification, UniformSpecification, ValueSource } from "../nodes";

export type { AttributeSpecification, UniformSpecification, ValueSource } from "../nodes/types";

/**
 * EdgePath - defines the geometry of an edge via GLSL functions.
 *
 * **Minimal Interface**: Only the `position` function is required. All other
 * functions (length, distance, t_at_distance, closest_t, tangent, normal)
 * are auto-generated from position if not provided.
 *
 * This makes creating new path types trivial - just define how the edge
 * curves from source to target, and the system handles the rest.
 *
 * For better performance, paths can optionally override the auto-generated
 * functions with analytical or optimized implementations.
 */
export interface EdgePath {
  /**
   * Unique identifier for this path type (e.g., "straight", "quadratic").
   * Used to generate GLSL function names: path_{name}_position, etc.
   */
  name: string;

  /**
   * Number of segments for vertex tessellation.
   * - 1 for straight edges (simple quad with 4 vertices)
   * - 8-16 for curved edges (triangle strip along curve)
   */
  segments: number;

  /**
   * GLSL code defining the path computation functions.
   *
   * **REQUIRED function** (replace {name} with the path name):
   * - vec2 path_{name}_position(float t, vec2 source, vec2 target)
   *     Position at parameter t ∈ [0, 1]
   *
   * **OPTIONAL functions** (auto-generated if not provided):
   * - float path_{name}_length(vec2 source, vec2 target)
   *     Total arc length. Default: samples position 16 times.
   * - float path_{name}_distance(vec2 p, vec2 source, vec2 target)
   *     Signed distance from point p. Default: uses closest_t + normal.
   * - float path_{name}_t_at_distance(float d, vec2 source, vec2 target)
   *     Parameter t for arc distance d. Default: binary search.
   * - float path_{name}_closest_t(vec2 p, vec2 source, vec2 target)
   *     Closest t for point p. Default: coarse sample + ternary search.
   *
   * **AUTO-GENERATED functions** (from position via numerical differentiation):
   * - vec2 path_{name}_tangent(float t, vec2 source, vec2 target)
   *     Unit tangent vector at t (computed via finite differences)
   * - vec2 path_{name}_normal(float t, vec2 source, vec2 target)
   *     Unit normal vector at t (perpendicular to tangent)
   *
   * Path functions can access per-edge attributes directly (e.g., a_curvature).
   *
   * @example Minimal path (only position required):
   * ```glsl
   * vec2 path_myPath_position(float t, vec2 source, vec2 target) {
   *   return mix(source, target, t * t); // Ease-in curve
   * }
   * ```
   */
  glsl: string;

  /**
   * Additional uniforms required by this path (e.g., curvature for Bezier).
   */
  uniforms: UniformSpecification[];

  /**
   * Additional per-edge attributes required by this path.
   */
  attributes: AttributeSpecification[];

  /**
   * Optional variable declarations for path attributes that need to flow
   * through the display data pipeline (graph attributes → GPU).
   *
   * When a path has per-edge attributes (e.g., loopRadius, loopAngle),
   * declaring them here lets them be read from graph edge data automatically.
   */
  variables?: Record<string, { type: "number" | "color"; default: number | string }>;

  /**
   * Optional spread definition for parallel edge separation.
   * Defines which variable to set and how to compute its value from the
   * edge's position in a parallel group.
   */
  spread?: {
    /** The variable to set (e.g., "curvature") */
    variable: string;
    /** Computes the variable value from parallel edge position */
    compute: (index: number, count: number, factor: number) => number;
  };

  /**
   * Optional custom constant data generator for advanced tessellation.
   * If provided, overrides the default triangle strip generation.
   *
   * This is useful for paths with sharp corners (like taxi with cornerRadius=0)
   * where the default smooth parametric approach doesn't work well.
   *
   * The returned data should contain vertex attributes that the shader will use
   * to compute final positions. Standard attributes are [t, side] but custom
   * attributes can be added for special geometry (e.g., miter joins).
   */
  generateConstantData?: () => {
    /** Vertex data as array of attribute values per vertex */
    data: number[][];
    /** Attribute specifications for the vertex data */
    attributes: Array<{ name: string; size: number; type: number }>;
    /** Number of vertices per edge instance */
    verticesPerEdge: number;
  };

  /**
   * Minimum body length as a ratio of edge thickness.
   * Ensures the body zone has at least this length even when extremities are large.
   * Useful for paths with corners (taxi) to ensure corners stay in body zone.
   * Default: 0 (no minimum)
   */
  minBodyLengthRatio?: number;

  /**
   * Optional GLSL code for analytical tangent computation.
   * When provided, this is used instead of auto-generated numerical tangent
   * (which uses finite differences on the position function).
   *
   * Should define: vec2 path_{name}_tangent(float t, vec2 source, vec2 target)
   *
   * Useful for paths with discontinuities (corners) where numerical
   * differentiation produces incorrect results due to averaging across
   * perpendicular directions.
   */
  analyticalTangentGlsl?: string;

  /**
   * Whether the path parameter t maps linearly to arc distance.
   *
   * - true: For straight and piecewise-linear paths where arcDistance = t * totalLength.
   *   The generator will use direct linear formula: distance = t * visibleLength
   *
   * - false: For curved paths where speed varies along the curve.
   *   The generator will use numerical integration for accurate arc distances.
   *
   * Default: false (numerical integration is safer for unknown paths)
   *
   * Note: When `generateConstantData` is provided, the generator automatically uses
   * position-based t computation via `path_*_closest_t(fragmentPosition)` to ensure
   * accurate distances at custom geometry (e.g., miter corners in taxi paths).
   */
  linearParameterization?: boolean;

  /**
   * Whether this path has sharp corners that need special handling for
   * above/below label positioning.
   *
   * When true, the label shader will use `cornerSkipGlsl` to skip inner
   * corners, preventing character overlap at concave bends.
   */
  hasSharpCorners?: boolean;

  /**
   * GLSL code for handling corner skipping in above/below label positioning.
   *
   * Required when `hasSharpCorners` is true. Should define functions for:
   * - Detecting which corners are concave relative to the label position
   * - Computing skip distances to create gaps at inner corners
   *
   * The skip distance prevents characters from bunching up at concave corners
   * where the inner arc length approaches zero.
   */
  cornerSkipGlsl?: string;

  /**
   * Skip factor for inner corners when labels are positioned above/below.
   * The gap at inner corners = innerCornerSkipFactor * fontSize (in screen pixels).
   *
   * Only used when `hasSharpCorners` is true.
   * Default: 1.0
   */
  innerCornerSkipFactor?: number;
}

/**
 * EdgeExtremity - defines head or tail decorations for edges.
 *
 * Extremities are rendered using SDF (Signed Distance Field) functions
 * in the fragment shader, allowing smooth anti-aliased rendering.
 */
export interface EdgeExtremity {
  /**
   * Unique identifier for this extremity type (e.g., "none", "arrow", "diamond").
   * Used to generate GLSL function names: extremity_{name}
   */
  name: string;

  /**
   * GLSL code defining the extremity SDF function.
   *
   * Function signature:
   *   float extremity_{name}(vec2 uv, ...)
   *
   * where uv is the local coordinate relative to the extremity center,
   * normalized so the edge thickness corresponds to [-0.5, 0.5] in the
   * perpendicular direction.
   *
   * Returns: signed distance (negative inside, positive outside)
   */
  glsl: string;

  /**
   * Length of the extremity beyond the edge body, relative to edge thickness.
   * Can be a constant or read from a per-edge attribute.
   *
   * For example, an arrow with lengthRatio=2.5 extends 2.5 * thickness
   * beyond where the edge body ends.
   */
  length: ValueSource<number>;

  /**
   * Width factor of the extremity relative to edge thickness.
   * Used to allocate vertex space for the extremity.
   *
   * For example, an arrow with widthFactor=2.0 needs 2x the edge thickness
   * in the perpendicular direction.
   */
  widthFactor: number;

  /**
   * Margin from node boundary in pixels.
   * The edge (including extremity) stops this many pixels away from the node.
   * Can be a constant or read from a per-edge attribute.
   */
  margin?: ValueSource<number>;

  /**
   * Ratio of the extremity length (from base toward tip) where the body SDF
   * union is applied for seamless anti-aliasing at the junction.
   *
   * - 0: No union (may cause gap at junction)
   * - 0.5: Union for first 50% of extremity (default)
   * - 1: Union for entire extremity (may affect tip shape)
   *
   * Default: 0.5
   */
  baseRatio?: number;

  /**
   * Additional uniforms required by this extremity.
   */
  uniforms: UniformSpecification[];

  /**
   * Additional per-edge attributes required by this extremity.
   */
  attributes: AttributeSpecification[];
}

/**
 * Context provided to edge lifecycle hooks.
 */
export interface EdgeLifecycleContext {
  /** WebGL2 rendering context */
  gl: WebGL2RenderingContext;

  /** Sigma renderer instance */
  renderer: {
    refresh: () => void;
  };

  /** Get uniform location from the current program */
  getUniformLocation: (name: string) => WebGLUniformLocation | null;

  /** Request shader regeneration */
  requestShaderRegeneration: () => void;

  /** Request a re-render */
  requestRefresh: () => void;
}

/**
 * Lifecycle hooks for edge layers that need async resources.
 */
export interface EdgeLifecycleHooks {
  /**
   * Called after the program is initialized.
   */
  init?: () => void;

  /**
   * Called before each render.
   */
  beforeRender?: () => void;

  /**
   * Called when the layer's shader needs regeneration.
   */
  regenerate?: () => EdgeLayer;

  /**
   * Called when the program is destroyed.
   */
  kill?: () => void;

  /**
   * Returns data for special attribute sources.
   */
  getAttributeData?: (data: Record<string, unknown>, attributeSource: string) => number | number[] | null;
}

/**
 * EdgeLayer - defines a visual layer for the edge body.
 *
 * Layers determine how the edge body is colored/textured.
 * The simplest layer is plain solid color; more complex layers
 * can implement dashes, gradients, or textures.
 *
 * Multiple layers can be composited using alpha blending (TO BE DONE).
 */
export interface EdgeLayer {
  /**
   * Unique identifier for this layer type (e.g., "plain", "dashed", "gradient").
   * Used to generate GLSL function names: layer_{name}
   */
  name: string;

  /**
   * GLSL code defining the layer color function.
   *
   * Function signature:
   *   vec4 layer_{name}(EdgeContext ctx)
   *
   * The EdgeContext provides information about the current fragment:
   * - t: position along path [0, 1]
   * - sdf: signed distance from path centerline
   * - thickness: edge thickness
   * - edgeLength: total path length
   * - etc.
   *
   * Returns: RGBA color for this fragment
   */
  glsl: string;

  /**
   * Additional uniforms required by this layer.
   */
  uniforms: UniformSpecification[];

  /**
   * Additional per-edge attributes required by this layer.
   */
  attributes: AttributeSpecification[];

  /**
   * Optional lifecycle factory for layers that need async resources.
   */
  lifecycle?: (context: EdgeLifecycleContext) => EdgeLifecycleHooks;
}

/**
 * EdgeContext - available to all edge GLSL functions.
 *
 * This struct is populated in the fragment shader and provides
 * information about the current fragment's position on the edge.
 *
 * GLSL definition:
 * ```glsl
 * struct EdgeContext {
 *   float t;                  // Position along path [0, 1]
 *   float sdf;                // Signed distance from centerline
 *   vec2 position;            // World position of fragment
 *   vec2 tangent;             // Path tangent at current point
 *   vec2 normal;              // Path normal at current point
 *   float thickness;          // Edge thickness in world units
 *   float aaWidth;            // Anti-aliasing width
 *   float edgeLength;         // Total path length
 *   float tStart;             // Where edge starts (after source node)
 *   float tEnd;               // Where edge ends (before target node)
 *   float distanceFromSource; // Arc distance from source
 *   float distanceToTarget;   // Arc distance to target
 * };
 * ```
 */
export interface EdgeContextFields {
  /** Position along path [0, 1] where 0 = source, 1 = target */
  t: "float";
  /** Signed distance from path centerline (negative = left, positive = right) */
  sdf: "float";
  /** World position of the current fragment */
  position: "vec2";
  /** Unit tangent vector at current position (direction of travel) */
  tangent: "vec2";
  /** Unit normal vector at current position (perpendicular to tangent) */
  normal: "vec2";
  /** Edge thickness in world units */
  thickness: "float";
  /** Anti-aliasing width in world units */
  aaWidth: "float";
  /** Total arc length of the edge path */
  edgeLength: "float";
  /** Parameter t where edge actually starts (after source node boundary) */
  tStart: "float";
  /** Parameter t where edge actually ends (before target node boundary) */
  tEnd: "float";
  /** Arc distance from source node boundary to current position */
  distanceFromSource: "float";
  /** Arc distance from current position to target node boundary */
  distanceToTarget: "float";
}

/**
 * Color specification for edge labels - either a fixed color string or attribute-based.
 *
 * This type follows the same pattern as `settings.edgeLabelColor`:
 * - Fixed color: `"#ff0000"` or `{ color: "#ff0000" }`
 * - Attribute-based: `{ attribute: "labelColor" }` with optional fallback `color`
 *
 * Examples:
 * - `"#ff0000"` - Fixed red color
 * - `{ attribute: "labelColor" }` - Read from edge attribute
 * - `{ attribute: "labelColor", color: "#000" }` - Attribute with fallback
 */
export type EdgeLabelColorSpecification =
  | string
  | { attribute: string; color?: string }
  | { color: string; attribute?: undefined };

/**
 * Options for edge label styling.
 * Used both in EdgeProgramOptions.label and CreateEdgeLabelProgramOptions.
 *
 * Note: Property names here (color, position, margin, fontSizeMode) are shorter than
 * the corresponding settings (edgeLabelColor, edgeLabelPosition, etc.) since these
 * are already in an edge label context.
 */
export interface EdgeLabelOptions {
  /**
   * Label color configuration. Can specify either a fixed color or an attribute name.
   * Default: uses settings.edgeLabelColor
   */
  color?: EdgeLabelColorSpecification;

  /**
   * Margin between the edge surface and the label (in pixels) for "above"/"below"/"auto" modes.
   * Default: uses settings.edgeLabelMargin
   *
   * Note: per-edge position is set via the style system (`labelPosition`
   * style), not here — styles are the single source of truth so the text
   * and its background/picking hitbox can't disagree.
   */
  margin?: number;

  /**
   * Text border (outline/stroke) configuration for improved readability.
   * When specified, renders a border around each character using SDF techniques.
   */
  textBorder?: {
    /** Border width in pixels */
    width: number;
    /**
     * Border color - fixed color string or attribute-based.
     * Examples:
     * - `"#ffffff"` - Fixed white color
     * - `{ attribute: "borderColor" }` - Read from edge attribute
     * - `{ attribute: "borderColor", defaultColor: "#fff" }` - Attribute with fallback
     */
    color: EdgeLabelColorSpecification;
  };

  /**
   * Font size mode for edge labels.
   * - "fixed": Constant pixel size regardless of zoom (default)
   * - "scaled": Scales with zoom level using zoomToSizeRatioFunction from settings
   * Default: uses settings.edgeLabelFontSizeMode
   */
  fontSizeMode?: EdgeLabelFontSizeMode;

  /**
   * Minimum label visibility ratio to render (0-1).
   * Labels with less visible content are hidden entirely.
   * Default: 0.5
   */
  minVisibilityThreshold?: number;

  /**
   * Visibility ratio at which labels reach full opacity (0-1).
   * Between minVisibilityThreshold and this value, labels fade in gradually.
   * Default: 0.6
   */
  fullVisibilityThreshold?: number;
}

/**
 * Options for creating an edge program via createEdgeProgram().
 */
export interface EdgeProgramOptions {
  /**
   * Array of path definitions (geometry).
   * Edges select their path via the `path` style (regular edges) or
   * `selfLoopPath` style (self-loop edges). The first path is the default.
   */
  paths: EdgePath[];

  /**
   * Optional pool of extremity definitions (head/tail decorations).
   * The "none" extremity is always available implicitly.
   * Edges select which extremity via `head` and `tail` attributes.
   */
  extremities?: EdgeExtremity[];

  /**
   * Array of layers that composite the edge body appearance.
   * Layers are rendered in order and alpha-blended together.
   * At least one layer is required.
   */
  layers: EdgeLayer[];

  /**
   * Default extremity name for the head (target end).
   * Defaults to "none" if not specified.
   */
  defaultHead?: string;

  /**
   * Default extremity name for the tail (source end).
   * Defaults to "none" if not specified.
   */
  defaultTail?: string;

  /**
   * Label configuration options.
   * If provided, a LabelProgram is automatically generated.
   */
  label?: EdgeLabelOptions;
}

/**
 * Generated shader metadata from the edge shader generator.
 */
export interface GeneratedEdgeShaders {
  /** Complete vertex shader source */
  vertexShader: string;
  /** Complete fragment shader source */
  fragmentShader: string;
  /** List of uniform names used */
  uniforms: string[];
  /** List of attribute specifications */
  attributes: Array<{ name: string; size: number; type: number }>;
  /**
   * Number of vertices per edge instance (single-path mode only).
   * In multi-path mode, use vertexCountsPerCombination instead.
   */
  verticesPerEdge: number;
  /** Constant attribute data (for tessellation) - single-path mode */
  constantData: number[][];
  /** Constant attribute specification */
  constantAttributes: Array<{ name: string; size: number; type: number }>;

  // Multi-path mode fields (optional, present when paths.length > 1)

  /**
   * Vertex counts per path/head/tail combination.
   * Key format: "pathName:headName:tailName"
   * Only present in multi-path mode.
   */
  vertexCountsPerCombination?: Map<string, number>;

  /**
   * Constant data per path/head/tail combination.
   * Key format: "pathName:headName:tailName"
   * Only present in multi-path mode.
   */
  constantDataPerCombination?: Map<string, number[][]>;
}

// ============================================================================
// Edge Program Options Normalization
// ============================================================================

/**
 * Result of normalizing EdgeProgramOptions.
 */
export interface NormalizedEdgeProgramOptions {
  paths: EdgePath[];
  extremities: EdgeExtremity[];
  layers: EdgeLayer[];
  /** First path (convenience accessor) */
  path: EdgePath;
  /** First layer (convenience accessor) */
  layer: EdgeLayer;
  /** Default head extremity name */
  defaultHead: string;
  /** Default tail extremity name */
  defaultTail: string;
}

/**
 * Normalizes EdgeProgramOptions and provides convenience accessors.
 * Note: The "none" extremity is prepended by the factory, not here (to avoid circular imports).
 */
export function normalizeEdgeProgramOptions(options: EdgeProgramOptions): NormalizedEdgeProgramOptions {
  const { paths, layers } = options;
  const extremities = options.extremities ?? [];

  if (paths.length === 0) throw new Error("At least one path is required in 'paths'");
  if (layers.length === 0) throw new Error("At least one layer is required in 'layers'");

  // Default head/tail to "none" (the implicit extremity)
  const defaultHead = options.defaultHead ?? "none";
  const defaultTail = options.defaultTail ?? "none";

  return {
    paths,
    extremities,
    layers,
    path: paths[0],
    layer: layers[0],
    defaultHead,
    defaultTail,
  };
}
