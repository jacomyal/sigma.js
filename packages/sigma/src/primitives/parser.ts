/**
 * Sigma.js Primitives Parser
 * ==========================
 *
 * Functions to parse primitives declarations (pre-parsed or custom forms)
 * into factory outputs (SDFShape, FragmentLayer, EdgePath, etc.).
 *
 * @module
 */
import { Attributes } from "graphology-types";

import {
  EdgeExtremity,
  EdgeLayer,
  EdgePath,
  EdgeProgramBundle,
  FragmentLayer,
  NodeProgramBundle,
  SDFShape,
  createEdgeProgram,
  createNodeProgram,
} from "../rendering";
import type Sigma from "../sigma";
import {
  DEFAULT_EDGE_PRIMITIVES,
  DEFAULT_NODE_PRIMITIVES,
  EdgeExtremitySpec,
  EdgeLayerSpec,
  EdgePathSpec,
  EdgePrimitives,
  NodeLayerSpec,
  NodePrimitives,
  NodeShapeSpec,
  VariablesDefinition,
  isCustomEdgeLayer,
  isCustomNodeLayer,
} from "./types";

// =============================================================================
// TYPE GUARDS
// =============================================================================

// Type guard for already-parsed SDFShape
function isSDFShape(spec: NodeShapeSpec): spec is SDFShape {
  return typeof spec === "object" && "uniforms" in spec && Array.isArray(spec.uniforms);
}

// Type guard for already-parsed FragmentLayer
function isFragmentLayer(spec: NodeLayerSpec): spec is FragmentLayer {
  return typeof spec === "object" && "uniforms" in spec && "attributes" in spec && "glsl" in spec;
}

// Type guard for already-parsed EdgePath
function isEdgePath(spec: EdgePathSpec): spec is EdgePath {
  return typeof spec === "object" && "uniforms" in spec && "attributes" in spec && "segments" in spec;
}

// Type guard for already-parsed EdgeExtremity
function isEdgeExtremity(spec: EdgeExtremitySpec): spec is EdgeExtremity {
  return typeof spec === "object" && "uniforms" in spec && "attributes" in spec && "length" in spec;
}

// Type guard for already-parsed EdgeLayer
function isEdgeLayer(spec: EdgeLayerSpec): spec is EdgeLayer {
  return typeof spec === "object" && "uniforms" in spec && "attributes" in spec && "glsl" in spec;
}

// Type guard for custom node shape
function isCustomNodeShape(spec: NodeShapeSpec): spec is { name: string; glsl: string; inradiusFactor?: number } {
  return typeof spec === "object" && "glsl" in spec && "name" in spec && !("uniforms" in spec);
}

// Type guard for custom edge path
function isCustomEdgePath(spec: EdgePathSpec): spec is { name: string; glsl: string; segments: number } {
  return typeof spec === "object" && "glsl" in spec && "name" in spec && !("uniforms" in spec);
}

// Type guard for custom edge extremity
function isCustomEdgeExtremity(
  spec: EdgeExtremitySpec,
): spec is { name: string; glsl: string; length: number; widthFactor: number } {
  return typeof spec === "object" && "glsl" in spec && "name" in spec && !("uniforms" in spec);
}

// =============================================================================
// SPEC PARSERS
// =============================================================================

/**
 * Parses a node shape specification into an SDFShape.
 *
 * @param spec - Shape specification (pre-parsed SDFShape or custom GLSL)
 * @returns SDFShape instance
 */
export function parseNodeShape(spec: NodeShapeSpec): SDFShape {
  if (isSDFShape(spec)) {
    return spec;
  }

  if (isCustomNodeShape(spec)) {
    return {
      name: spec.name,
      glsl: spec.glsl,
      inradiusFactor: spec.inradiusFactor,
      uniforms: [],
    };
  }

  throw new Error(`Invalid node shape specification: ${JSON.stringify(spec)}`);
}

/**
 * Parses a node layer specification into a FragmentLayer.
 *
 * @param spec - Layer specification (pre-parsed FragmentLayer or custom GLSL)
 * @returns FragmentLayer instance
 */
export function parseNodeLayer(spec: NodeLayerSpec): FragmentLayer {
  if (isFragmentLayer(spec)) {
    return spec;
  }

  if (isCustomNodeLayer(spec)) {
    return {
      name: spec.name,
      glsl: spec.glsl,
      uniforms: [],
      attributes: [],
    };
  }

  throw new Error(`Invalid node layer specification: ${JSON.stringify(spec)}`);
}

/**
 * Parses an edge path specification into an EdgePath.
 *
 * @param spec - Path specification (pre-parsed EdgePath or custom GLSL)
 * @returns EdgePath instance
 */
export function parseEdgePath(spec: EdgePathSpec): EdgePath {
  if (isEdgePath(spec)) {
    return spec;
  }

  if (isCustomEdgePath(spec)) {
    return {
      name: spec.name,
      glsl: spec.glsl,
      segments: spec.segments,
      uniforms: [],
      attributes: [],
    };
  }

  throw new Error(`Invalid edge path specification: ${JSON.stringify(spec)}`);
}

/**
 * Parses an edge layer specification into an EdgeLayer.
 *
 * @param spec - Layer specification (pre-parsed EdgeLayer or custom GLSL)
 * @returns EdgeLayer instance
 */
export function parseEdgeLayer(spec: EdgeLayerSpec): EdgeLayer {
  if (isEdgeLayer(spec)) {
    return spec;
  }

  if (isCustomEdgeLayer(spec)) {
    return {
      name: spec.name,
      glsl: spec.glsl,
      uniforms: [],
      attributes: [],
    };
  }

  throw new Error(`Invalid edge layer specification: ${JSON.stringify(spec)}`);
}

/**
 * Parses an edge extremity specification into an EdgeExtremity.
 *
 * @param spec - Extremity specification (pre-parsed EdgeExtremity or custom GLSL)
 * @returns EdgeExtremity instance or null
 */
export function parseEdgeExtremity(spec: EdgeExtremitySpec): EdgeExtremity | null {
  if (isEdgeExtremity(spec)) {
    return spec;
  }

  if (isCustomEdgeExtremity(spec)) {
    return {
      name: spec.name,
      glsl: spec.glsl,
      length: spec.length,
      widthFactor: spec.widthFactor,
      margin: 0,
      uniforms: [],
      attributes: [],
    };
  }

  throw new Error(`Invalid edge extremity specification: ${JSON.stringify(spec)}`);
}

// =============================================================================
// PRIMITIVES PARSERS
// =============================================================================

export interface ParsedNodePrimitives {
  shapes: SDFShape[];
  layers: FragmentLayer[];
}

export interface ParsedEdgePrimitives {
  paths: EdgePath[];
  extremities: EdgeExtremity[];
  layers: EdgeLayer[];
}

/**
 * Parses node primitives declaration into arrays of factory outputs.
 *
 * @param nodePrimitives - Node primitives declaration (may be undefined)
 * @returns Parsed shapes and layers ready for createNodeProgram
 */
export function parseNodePrimitives(nodePrimitives?: NodePrimitives): ParsedNodePrimitives {
  const shapesSpecs = nodePrimitives?.shapes ?? DEFAULT_NODE_PRIMITIVES.shapes;
  const layersSpecs = nodePrimitives?.layers ?? DEFAULT_NODE_PRIMITIVES.layers;

  const shapes = shapesSpecs.map(parseNodeShape);
  const layers = layersSpecs.map(parseNodeLayer);

  if (shapes.length === 0) {
    throw new Error("At least one node shape must be specified.");
  }
  if (layers.length === 0) {
    throw new Error("At least one node layer must be specified.");
  }

  return { shapes, layers };
}

/**
 * Parses edge primitives declaration into arrays of factory outputs.
 *
 * @param edgePrimitives - Edge primitives declaration (may be undefined)
 * @returns Parsed paths, extremities, and layers ready for createEdgeProgram
 */
export function parseEdgePrimitives(edgePrimitives?: EdgePrimitives): ParsedEdgePrimitives {
  const pathsSpecs = edgePrimitives?.paths ?? DEFAULT_EDGE_PRIMITIVES.paths;
  const extremitiesSpecs = edgePrimitives?.extremities ?? DEFAULT_EDGE_PRIMITIVES.extremities;
  const layersSpecs = edgePrimitives?.layers ?? DEFAULT_EDGE_PRIMITIVES.layers;

  const paths = pathsSpecs.map(parseEdgePath);
  const extremities = extremitiesSpecs.map(parseEdgeExtremity).filter((e): e is EdgeExtremity => e !== null);
  const layers = layersSpecs.map(parseEdgeLayer);

  if (paths.length === 0) {
    throw new Error("At least one edge path must be specified.");
  }
  if (layers.length === 0) {
    throw new Error("At least one edge layer must be specified.");
  }

  return { paths, extremities, layers };
}

// =============================================================================
// PROGRAM GENERATION
// =============================================================================

/**
 * Result of generating a node program suite from primitives: the node
 * program plus its label / backdrop / label-background companions and the
 * declared graphic variables.
 */
export type GeneratedNodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = NodeProgramBundle<N, E, G> & { variables: VariablesDefinition };

/**
 * Result of generating an edge program suite from primitives: the edge
 * program plus its label and label-background companions, the declared
 * graphic variables, and the resolved path list.
 */
export type GeneratedEdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = EdgeProgramBundle<N, E, G> & { variables: VariablesDefinition; paths: EdgePath[] };

/**
 * Generates the full node program suite from a primitives declaration.
 * Wraps `createNodeProgram` with primitive parsing and tacks on the
 * declared graphic variables.
 */
export function generateNodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  nodePrimitives?: NodePrimitives,
): GeneratedNodeProgram<N, E, G> {
  const { shapes, layers } = parseNodePrimitives(nodePrimitives);
  const variables = nodePrimitives?.variables || {};

  const bundle = createNodeProgram<N, E, G>(gl, pickingBuffer, renderer, {
    shapes,
    layers,
    label: nodePrimitives?.label,
    backdrop: nodePrimitives?.backdrop,
    labelAttachments: nodePrimitives?.labelAttachments,
  });

  return { ...bundle, variables };
}

/**
 * Generates the full edge program suite from a primitives declaration.
 * Wraps `createEdgeProgram` with primitive parsing and tacks on the
 * declared graphic variables and the resolved path list.
 */
export function generateEdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  edgePrimitives?: EdgePrimitives,
): GeneratedEdgeProgram<N, E, G> {
  const { paths, extremities, layers } = parseEdgePrimitives(edgePrimitives);

  // Collect variables declared by all paths
  const variables: VariablesDefinition = {};
  for (const path of paths) {
    if (path.variables) Object.assign(variables, path.variables);
  }
  Object.assign(variables, edgePrimitives?.variables || {});

  const bundle = createEdgeProgram<N, E, G>(gl, pickingBuffer, renderer, {
    paths,
    extremities,
    layers,
    defaultHead: edgePrimitives?.defaultHead,
    defaultTail: edgePrimitives?.defaultTail,
    label: edgePrimitives?.label,
  });

  return { ...bundle, variables, paths };
}
