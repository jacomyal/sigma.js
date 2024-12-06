import { Attributes } from "graphology-types";

import { EdgeProgramType, createEdgeCompoundProgram } from "../../edge";
import { CreateEdgeArrowHeadProgramOptions, createEdgeArrowHeadProgram } from "../edge-arrow-head";
import { createEdgeDoubleClampedProgram } from "../edge-double-clamped";

export function createEdgeDoubleArrowProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<Omit<CreateEdgeArrowHeadProgramOptions, "extremity">>): EdgeProgramType<N, E, G> {
  return createEdgeCompoundProgram([
    createEdgeDoubleClampedProgram(inputOptions),
    createEdgeArrowHeadProgram(inputOptions),
    createEdgeArrowHeadProgram({ ...inputOptions, extremity: "source" }),
  ]);
}

const EdgeDoubleArrowProgram = createEdgeDoubleArrowProgram();

export default EdgeDoubleArrowProgram;
