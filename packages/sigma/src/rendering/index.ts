/**
 * Just some shortcuts to ease importing various rendering related things from
 * the codebase:
 */
export { NodeProgram, AbstractNodeProgram, createNodeCompoundProgram } from "./node";
export type { NodeProgramType } from "./node";
export { EdgeProgram, AbstractEdgeProgram, createEdgeCompoundProgram } from "./edge";
export type { EdgeProgramType } from "./edge";
export { Program, AbstractProgram } from "./program";

// Canvas helpers
export type { EdgeLabelDrawingFunction } from "./edge-labels";
export { drawStraightEdgeLabel } from "./edge-labels";
export type { NodeLabelDrawingFunction } from "./node-labels";
export { drawDiscNodeLabel } from "./node-labels";
export type { NodeHoverDrawingFunction } from "./node-hover";
export { drawDiscNodeHover } from "./node-hover";

// Other various program helpers
export * from "./utils";

// Built-in node programs
export { default as NodeCircleProgram } from "./programs/node-circle";
export { default as NodePointProgram } from "./programs/node-point";

// Built-in edge programs
export * from "./programs/edge-arrow-head";
export * from "./programs/edge-clamped";
export { createEdgeArrowProgram, default as EdgeArrowProgram } from "./programs/edge-arrow";
export { default as EdgeLineProgram } from "./programs/edge-line";
export { default as EdgeRectangleProgram } from "./programs/edge-rectangle";
export { default as EdgeTriangleProgram } from "./programs/edge-triangle";
