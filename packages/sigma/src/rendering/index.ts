/**
 * Sigma.js Rendering - Main Exports
 * ==================================
 *
 * Exports for all rendering-related functionality.
 * @module sigma/rendering
 */

// GLSL utilities
export * from "./glsl";

// Node and edge program factories + their composable building blocks
// (shapes, layers, paths, extremities). Sub-indices also re-export the
// XProgram / XProgramType aliases used internally by sigma; those aren't
// part of the advertised public API. The base label / label-background
// classes (LabelProgram, createLabelBackgroundProgram, etc.) are
// intentionally not re-exported — they're internals reachable only via
// "sigma/rendering/nodes/labels" for advanced users.
export * from "./nodes";
export * from "./edges";

// Public base classes / utilities
export { Program } from "./program";
export type { ProgramType } from "./program";
export { DepthBucketCollection } from "./bucket";

// Other various program helpers
export * from "./utils";

// Shape registry
export * from "./shapes";

// Data textures
export { DataTexture } from "./data-texture";
export { NodeDataTexture } from "./node-data-texture";
export { EdgeDataTexture } from "./edge-data-texture";
