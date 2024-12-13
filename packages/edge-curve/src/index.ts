import { DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS, EdgeProgramType } from "sigma/rendering";

import createEdgeCurveProgram from "./factory";

export { default as createEdgeCurveProgram } from "./factory";
export { type CreateEdgeCurveProgramOptions } from "./utils";
export {
  indexParallelEdgesIndex,
  DEFAULT_EDGE_CURVATURE,
  DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS,
  DEFAULT_INDEX_PARALLEL_EDGES_OPTIONS,
} from "./utils";
export { createDrawCurvedEdgeLabel } from "./edge-labels";

const EdgeCurveProgram: EdgeProgramType = createEdgeCurveProgram();
export default EdgeCurveProgram;

export const EdgeCurvedArrowProgram: EdgeProgramType = createEdgeCurveProgram({
  arrowHead: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS,
});

export const EdgeCurvedDoubleArrowProgram: EdgeProgramType = createEdgeCurveProgram({
  arrowHead: {
    ...DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS,
    extremity: "both",
  },
});
