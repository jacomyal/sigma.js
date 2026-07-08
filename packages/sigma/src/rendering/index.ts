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
// program type aliases (NodeProgram, LabelProgram, etc.) that sigma's core
// consumes internally; they're available to advanced users but aren't a
// stable public API.
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

// GL state snapshot/restore for external code sharing sigma's context
export { GLStateGuard } from "./gl-state-guard";

// Data textures
export { DataTexture } from "./data-texture";
export { NodeDataTexture } from "./node-data-texture";
export { FrameTexture, type FrameTextureOptions } from "./frame-texture";
export { EdgeDataTexture } from "./edge-data-texture";
