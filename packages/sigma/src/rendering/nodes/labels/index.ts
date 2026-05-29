/**
 * Sigma.js Node Label Programs - Exports
 * =======================================
 *
 * Exports for label program creation and shader generation.
 *
 * @module
 */

export { LabelProgram } from "./base";

export { createLabelBackgroundProgram } from "./background";
export type { LabelBackgroundData, LabelBackgroundProgram } from "./background";

export { createLabelProgram } from "./factory";
export type { CreateLabelProgramOptions } from "./factory";

export {
  generateLabelShaders,
  generateLabelVertexShader,
  generateLabelFragmentShader,
  collectLabelUniforms,
} from "./generator";
export type { GeneratedLabelShaders, LabelShaderOptions } from "./generator";
