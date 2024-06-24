import { NodeProgramType } from "sigma/rendering";

import createNodeBorderProgram from "./factory";

export { default as createNodeBorderProgram } from "./factory";
export const NodeBorderProgram: NodeProgramType = createNodeBorderProgram();
