import { DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS, EdgeProgramType } from "sigma/rendering";

import createEdgeCurveProgram from "./factory";

export { default as createEdgeCurveProgram } from "./factory";
export { indexParallelEdgesIndex, DEFAULT_EDGE_CURVATURE } from "./utils";

const EdgeCurveProgram: EdgeProgramType = createEdgeCurveProgram();
export default EdgeCurveProgram;

export const EdgeCurvedArrowProgram: EdgeProgramType = createEdgeCurveProgram({
  arrowHead: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS,
});
