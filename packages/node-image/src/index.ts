import createNodeImageProgram from "./factory";

export { default as createNodeImageProgram } from "./factory";
export const NodeImageProgram = createNodeImageProgram();
export const NodePictogramProgram = createNodeImageProgram({
  size: { mode: "force", value: 256 },
  drawingMode: "color",
  correctCentering: true,
});
