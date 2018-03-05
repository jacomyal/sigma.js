/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 */
import {createCompoundProgram} from './program';
import ArrowProgram from './arrow';
import EdgeProgram from './edge';

const program = createCompoundProgram([
  EdgeProgram,
  ArrowProgram
]);

export default program;
