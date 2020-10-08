/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 */
import { createEdgeCompoundProgram } from "./common/edge";
import ArrowProgram from "./arrow";
import EdgeClampedProgram from "./edge.clamped";

const program = createEdgeCompoundProgram([EdgeClampedProgram, ArrowProgram]);

export default program;
