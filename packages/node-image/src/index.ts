import { NodeProgramType } from "sigma/rendering";

import createNodeImageProgram from "./factory";

export { default as createNodeImageProgram } from "./factory";
export const NodeImageProgram: NodeProgramType = createNodeImageProgram();
export const NodePictogramProgram: NodeProgramType = createNodeImageProgram({
  keepWithinCircle: false,
  size: { mode: "force", value: 256 },
  drawingMode: "color",
  correctCentering: true,
});
