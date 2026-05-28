/**
 * Sigma.js Node Programs
 * =======================
 *
 * Main exports for the node program system.
 *
 * @module
 */

// Core factory function and program type aliases
export { createNodeProgram } from "./factory";
export type { NodeProgram, NodeProgramType } from "./factory";

// Type definitions
export type {
  SDFShape,
  FragmentLayer,
  NodeProgramOptions,
  LabelOptions,
  LabelFontOptions,
  UniformSpecification,
  AttributeSpecification,
  ValueSource,
  LayerContext,
  LayerLifecycleContext,
  LayerLifecycleHooks,
  Vec2,
  Vec3,
  Vec4,
  Mat3,
  Mat4,
} from "./types";

// Value source helper
export { isAttributeSource } from "./types";

// SDF Shapes
export { sdfCircle, sdfSquare, sdfTriangle, sdfDiamond } from "./shapes";
export type { SquareOptions, TriangleOptions, DiamondOptions } from "./shapes";

// Fragment Layers (core)
export { layerFill, type LayerFillOptions } from "./layers";

// Label program creation
export { createLabelProgram } from "./labels";
export type { CreateLabelProgramOptions } from "./labels";

// Backdrop program creation
export { createBackdropProgram } from "./backdrops";
export type { CreateBackdropProgramOptions } from "./backdrops";
export type { BackdropProgram, BackdropProgramType, BackdropDisplayData } from "./backdrops";

// Shader generators (advanced usage)
export {
  generateShaders,
  generateVertexShader,
  generateFragmentShader,
  collectUniforms,
  collectAttributes,
} from "./generator";
export type { GeneratedShaders, ShaderGenerationOptions } from "./generator";

export {
  generateLabelShaders,
  generateLabelVertexShader,
  generateLabelFragmentShader,
  collectLabelUniforms,
} from "./labels";
export type { GeneratedLabelShaders, LabelShaderOptions } from "./labels";

export {
  generateBackdropShaders,
  generateBackdropVertexShader,
  generateBackdropFragmentShader,
  collectBackdropUniforms,
} from "./backdrops";
export type { GeneratedBackdropShaders, BackdropShaderOptions } from "./backdrops";

// Label attachment programs
export { AttachmentManager, AttachmentProgram } from "./attachments";
