import createEdgeCurveProgram from "./factory";

export { default as createEdgeCurveProgram } from "./factory";
export { indexParallelEdgesIndex, DEFAULT_EDGE_CURVATURE } from "./utils";

const EdgeCurveProgram = createEdgeCurveProgram();
export default EdgeCurveProgram;

export const EdgeCurvedArrowProgram = createEdgeCurveProgram({
  arrowHead: {
    lengthToThicknessRatio: 2.5,
    widenessToThicknessRatio: 2,
  },
});
