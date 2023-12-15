/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
import { createEdgeCompoundProgram } from "../../edge";
import EdgeArrowHeadProgram from "../edge-arrow-head";
import EdgeClampedProgram from "../edge-clamped";

const EdgeArrowProgram = createEdgeCompoundProgram([EdgeClampedProgram, EdgeArrowHeadProgram]);

export default EdgeArrowProgram;
