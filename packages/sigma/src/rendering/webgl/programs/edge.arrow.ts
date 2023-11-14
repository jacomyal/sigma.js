/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
import { createEdgeCompoundProgram } from "./common/edge";
import EdgeArrowHeadProgram from "./edge.arrowHead";
import EdgeClampedProgram from "./edge.clamped";

const EdgeArrowProgram = createEdgeCompoundProgram([EdgeClampedProgram, EdgeArrowHeadProgram]);

export default EdgeArrowProgram;
