/**
 * Sigma.js Rendering - Main Exports
 * ==================================
 *
 * Exports for all rendering-related functionality.
 * @module sigma/rendering
 */

// GLSL utilities
export * from "./glsl";

// Node programs
export * from "./nodes";

// Base classes
export type { EdgeProgram, EdgeProgramType } from "./edges";
export { Program } from "./program";
export type { ProgramType } from "./program";
export { LabelProgram, createLabelBackgroundProgram } from "./nodes/labels";
export type {
  LabelProgramType,
  LabelBackgroundProgram,
  LabelBackgroundProgramType,
  LabelBackgroundData,
} from "./nodes/labels";
export type { BackdropProgram, BackdropProgramType, BackdropDisplayData } from "./nodes/backdrops";
export { DepthBucketCollection } from "./bucket";

// Other various program helpers
export * from "./utils";

// Composable edge programs (v4 architecture)
export * from "./edges";

// Shape registry
export * from "./shapes";

// Data textures
export { DataTexture } from "./data-texture";
export { NodeDataTexture } from "./node-data-texture";
export { EdgeDataTexture } from "./edge-data-texture";
