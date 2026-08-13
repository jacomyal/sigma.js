/**
 * Sigma.js Composable Edge Programs
 * ==================================
 *
 * Composable edge program architecture for Sigma.js v4.
 * Edges are composed of path, extremities (head/tail), and layer components.
 *
 * @module
 */

// Program type aliases and edge-id resolution result
export type { EdgeProgram, EdgeProgramBundle, ResolvedEdgeIds } from "./factory";

// Types
export type {
  EdgePath,
  EdgeExtremity,
  EdgeLayer,
  EdgeProgramOptions,
  EdgeLabelOptions,
  EdgeLabelColorSpecification,
  EdgeContextFields,
  EdgeLifecycleContext,
  EdgeLifecycleHooks,
  GeneratedEdgeShaders,
  AttributeSpecification,
  UniformSpecification,
} from "./types";

// Factory
export { createEdgeProgram } from "./factory";

// Edge frame-pass (per-edge clamp precompute)
export { EdgeFramePass, type EdgeFramePassOptions } from "./frame-pass";

// Paths
export {
  pathLine,
  pathCurved,
  type CurvedPathOptions,
  pathCurvedS,
  type CurvedSPathOptions,
  pathStep,
  type StepPathOptions,
  pathStepCurved,
  type StepCurvedPathOptions,
  pathLoop,
  type LoopPathOptions,
} from "./paths";

// Extremities
export {
  extremityArrow,
  type ArrowExtremityOptions,
  extremityBar,
  type BarExtremityOptions,
  extremityCircle,
  type CircleExtremityOptions,
  extremityDiamond,
  type DiamondExtremityOptions,
  extremitySquare,
  type SquareExtremityOptions,
} from "./extremities";

// Layers (edge body appearance)
export {
  layerDashed,
  layerPlain,
  resolveEdgeColorValue,
  type DashSize,
  type DashSizeMode,
  type EdgeColorValue,
  type LayerDashedOptions,
  type LayerPlainOptions,
  type GapFilling,
  type ResolvedEdgeColor,
  type SolidExtremities,
  type SolidMargin,
} from "./layers";

// Shader generator (for advanced users)
export { generateEdgeShaders, type EdgeShaderGenerationOptions } from "./generator";

// Edge labels
export { createEdgeLabelProgram, type CreateEdgeLabelProgramOptions, type EdgeLabelProgram } from "./labels/factory";
export {
  generateEdgeLabelShaders,
  type EdgeLabelShaderOptions,
  type GeneratedEdgeLabelShaders,
} from "./labels/generator";
export {
  createEdgeLabelBackgroundProgram,
  type EdgeLabelBackgroundProgram,
  type EdgeLabelBackgroundData,
  type CreateEdgeLabelBackgroundProgramOptions,
} from "./labels/background";
