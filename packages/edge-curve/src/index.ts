import { DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS } from "sigma/rendering";

import createEdgeCurveProgram from "./factory";

export { default as createEdgeCurveProgram } from "./factory";
export { indexParallelEdgesIndex, DEFAULT_EDGE_CURVATURE } from "./utils";

const EdgeCurveProgram = createEdgeCurveProgram();
export default EdgeCurveProgram;

export const EdgeCurvedArrowProgram = createEdgeCurveProgram({
  arrowHead: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS,
});
