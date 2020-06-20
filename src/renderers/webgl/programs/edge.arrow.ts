/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 */
import { createCompoundProgram } from "./program";
import ArrowProgram from "./arrow";
import EdgeClampedProgram from "./edge.clamped";

const program = createCompoundProgram([EdgeClampedProgram, ArrowProgram]);

export default program;
