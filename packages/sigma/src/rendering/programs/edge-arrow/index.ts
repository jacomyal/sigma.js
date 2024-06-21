import { Attributes } from "graphology-types";

import { EdgeProgramType, createEdgeCompoundProgram } from "../../edge";
import { CreateEdgeArrowHeadProgramOptions, createEdgeArrowHeadProgram } from "../edge-arrow-head";
import { createEdgeClampedProgram } from "../edge-clamped";

export function createEdgeArrowProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<CreateEdgeArrowHeadProgramOptions>): EdgeProgramType<N, E, G> {
  return createEdgeCompoundProgram([createEdgeClampedProgram(inputOptions), createEdgeArrowHeadProgram(inputOptions)]);
}

const EdgeArrowProgram = createEdgeArrowProgram();

export default EdgeArrowProgram;
