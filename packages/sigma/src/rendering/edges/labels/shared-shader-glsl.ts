/**
 * Sigma.js Edge Label Shared GLSL Helpers
 * ========================================
 *
 * GLSL generators and function bodies used by both the edge label program
 * (character SDF rendering) and the edge label background program (ribbon
 * rendering). Keeping them in one place ensures the two programs agree on
 * body bounds, visibility ramp, and perpendicular offset by position mode
 * — any drift there would misalign the background with its label.
 *
 * Consumers splice the GLSL strings into their vertex shader *after* the
 * path dispatch block (which declares `queryFindSourceClampT`,
 * `queryFindTargetClampT`, `queryPathLength`, etc.).
 *
 * @module
 */
import { GLSL_READ_NODE_DATA, GLSL_READ_NODE_FLAGS } from "../../glsl";
import { generateShapeSelectorGLSL, getAllShapeGLSL } from "../../shapes";
import { numberToGLSLFloat } from "../../utils";
import {
  generateFindSourceClampT,
  generateFindTargetClampT,
  generateNumericalTangentNormal,
  generatePathFallbacks,
} from "../shared-glsl";
import type { EdgePath } from "../types";

/**
 * Generates a path selector function for multi-path support. Creates a
 * switch statement that dispatches to the correct path function by pathId.
 */
export function generatePathSelector(
  paths: EdgePath[],
  queryName: string,
  pathFunc: string,
  returnType: string,
  params: string,
  args: string,
): string {
  if (paths.length === 1) {
    return `${returnType} ${queryName}(int pathId, ${params}) {
  return path_${paths[0].name}_${pathFunc}(${args});
}`;
  }

  const cases = paths.map((p, i) => `    case ${i}: return path_${p.name}_${pathFunc}(${args});`).join("\n");

  return `${returnType} ${queryName}(int pathId, ${params}) {
  switch (pathId) {
${cases}
    default: return path_${paths[0].name}_${pathFunc}(${args});
  }
}`;
}

/**
 * Generates all clamp T functions and their selectors for multi-path support.
 * Declares `findSourceClampT_<name>` / `findTargetClampT_<name>` for each path,
 * then wraps them in `queryFindSourceClampT` / `queryFindTargetClampT`.
 */
export function generateAllClampFunctions(paths: EdgePath[]): string {
  const clampFunctions = paths
    .map((p) => `${generateFindSourceClampT(p.name)}\n${generateFindTargetClampT(p.name)}`)
    .join("\n\n");

  if (paths.length === 1) {
    return `${clampFunctions}

float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_${paths[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_${paths[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`;
  }

  const srcCases = paths
    .map(
      (p, i) =>
        `    case ${i}: return findSourceClampT_${p.name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);`,
    )
    .join("\n");
  const tgtCases = paths
    .map(
      (p, i) =>
        `    case ${i}: return findTargetClampT_${p.name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);`,
    )
    .join("\n");

  return `${clampFunctions}

float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
${srcCases}
    default: return findSourceClampT_${paths[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
${tgtCases}
    default: return findTargetClampT_${paths[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`;
}

/**
 * Body-bounds helper in WebGL units: finds where the path exits the source
 * node, enters the target node, then shrinks by head/tail extremities.
 * Depends on `queryFindSourceClampT`, `queryFindTargetClampT`, `queryPathLength`.
 *
 * Returns (bodyStartDist, bodyEndDist, bodyLength).
 */
export const EDGE_LABEL_BODY_BOUNDS_GLSL = /*glsl*/ `
vec3 computeEdgeLabelBodyBounds(
  int pathId,
  vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign,
  vec2 target, float targetSize, int targetShapeId, float targetRotateAlign,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float tStart = queryFindSourceClampT(pathId, source, sourceSize, sourceShapeId, sourceRotateAlign, target, 0.0);
  float tEnd = queryFindTargetClampT(pathId, source, target, targetSize, targetShapeId, targetRotateAlign, 0.0);
  float pathLength = queryPathLength(pathId, source, target);
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;

/**
 * Alpha ramp based on how much of the label fits inside the edge body.
 * Below `minVis`: hidden. Above `fullVis`: opaque. Between: linear fade.
 */
export function generateEdgeLabelAlphaGlsl(minVisibilityThreshold: number, fullVisibilityThreshold: number): string {
  const minVis = numberToGLSLFloat(minVisibilityThreshold);
  const fullVis = numberToGLSLFloat(fullVisibilityThreshold);
  return /*glsl*/ `
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < ${minVis}) return 0.0;
  if (ratio < ${fullVis}) return (ratio - ${minVis}) / (${fullVis} - ${minVis});
  return 1.0;
}
`;
}

/**
 * Perpendicular offset per position mode: 0=over, 1=above, 2=below, 3=auto.
 * "auto" picks above/below based on source/target screen-X ordering.
 */
export const EDGE_LABEL_PERP_OFFSET_GLSL = /*glsl*/ `
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  vec2 source, vec2 target, mat3 matrix
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude;
  if (positionMode == 2.0) return -magnitude;
  if (positionMode == 3.0) {
    vec3 sc = matrix * vec3(source, 1.0);
    vec3 tc = matrix * vec3(target, 1.0);
    return sc.x < tc.x ? magnitude : -magnitude;
  }
  return 0.0;
}
`;

/**
 * Emits the GLSL preamble shared by edge label shaders (both the SDF text
 * shader and the ribbon background shader). Covers everything between the
 * attribute/uniform declarations and `main()`: shape SDFs, per-path
 * functions, path-query selectors, clamp functions, and the three helpers
 * above. A single source of truth so the two shaders cannot drift on body
 * bounds, path sampling, or visibility ramp.
 *
 * Expects the caller to have declared `v_sourceNodeSize` / `v_targetNodeSize`
 * and any path-attribute varyings (e.g. `v_curvature`) before splicing this
 * in, since some path functions read them.
 */
export interface EdgeLabelShaderPreambleOptions {
  paths: EdgePath[];
  minVisibilityThreshold: number;
  fullVisibilityThreshold: number;
}

export function generateEdgeLabelShaderPreamble(options: EdgeLabelShaderPreambleOptions): string {
  const { paths, minVisibilityThreshold, fullVisibilityThreshold } = options;
  const hasAnySharpCorners = paths.some((p) => p.hasSharpCorners);

  const pathGlsl = paths
    .map(
      (p) => `// --- Path: ${p.name} ---
${p.glsl}

// Tangent/normal functions: analytical if provided, otherwise numerical
${p.analyticalTangentGlsl || generateNumericalTangentNormal(p.name)}

// Auto-generated fallbacks for any missing path functions
${generatePathFallbacks(p.name, p.glsl)}

// Corner skip helpers (for paths with sharp corners like step/taxi)
${p.cornerSkipGlsl || ""}
`,
    )
    .join("\n");

  const sharpCornersDispatch = hasAnySharpCorners
    ? `// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
${paths.map((p, i) => (p.hasSharpCorners ? `    case ${i}: return path_${p.name}_getCornerTs(source, target);` : `    case ${i}: return vec2(-1.0, -1.0); // No corners for ${p.name}`)).join("\n")}
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
${paths.map((p, i) => (p.hasSharpCorners ? `    case ${i}: return path_${p.name}_getCornerConcavity(source, target, perpOffset);` : `    case ${i}: return vec2(0.0, 0.0); // No corners for ${p.name}`)).join("\n")}
    default: return vec2(0.0, 0.0);
  }
}`
    : "";

  return /*glsl*/ `
// ============================================================================
// Node data fetch (geometry texel + rotation-flags texel) and Shape SDFs
// ============================================================================

${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FLAGS}

${getAllShapeGLSL()}

${generateShapeSelectorGLSL()}

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

${pathGlsl}

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

${generatePathSelector(paths, "queryPathPosition", "position", "vec2", "float t, vec2 source, vec2 target", "t, source, target")}

${generatePathSelector(paths, "queryPathTangent", "tangent", "vec2", "float t, vec2 source, vec2 target", "t, source, target")}

${generatePathSelector(paths, "queryPathNormal", "normal", "vec2", "float t, vec2 source, vec2 target", "t, source, target")}

${generatePathSelector(paths, "queryPathLength", "length", "float", "vec2 source, vec2 target", "source, target")}

${generatePathSelector(paths, "queryPathTAtDistance", "t_at_distance", "float", "float dist, vec2 source, vec2 target", "dist, source, target")}

${sharpCornersDispatch}

// ============================================================================
// Binary Search Clamp Functions (find where path exits source / enters target)
// ============================================================================

${generateAllClampFunctions(paths)}

// ============================================================================
// Shared helpers (body bounds, alpha ramp, perpendicular offset)
// ============================================================================

${EDGE_LABEL_BODY_BOUNDS_GLSL}
${generateEdgeLabelAlphaGlsl(minVisibilityThreshold, fullVisibilityThreshold)}
${EDGE_LABEL_PERP_OFFSET_GLSL}
`;
}
