/**
 * Sigma.js Shared GLSL Utilities
 * ===============================
 *
 * Common GLSL code snippets shared across shader generators (nodes, labels, backdrops).
 * @module
 */
import { LabelPosition } from "../types";
import type { SDFShape } from "./nodes";
import { numberToGLSLFloat } from "./utils";

/**
 * Maps label position names to numeric values for shaders.
 */
export const POSITION_MODE_MAP: Record<LabelPosition, number> = {
  right: 0,
  left: 1,
  above: 2,
  below: 3,
  over: 4,
};

/** Default gap, in CSS pixels, between a node's edge and its label. */
export const DEFAULT_LABEL_MARGIN = 5;

/** Default symmetric padding, in CSS pixels, of a label background box. */
export const DEFAULT_LABEL_BACKGROUND_PADDING = 3;

/**
 * Converts node size from graph coordinates to screen pixels.
 * Requires uniforms: u_matrix, u_correctionRatio, u_sizeRatio, u_resolution
 * Requires a `float nodeSize` in scope (e.g. fetched from the node-data texture).
 */
export const GLSL_NODE_SIZE_TO_PIXELS = /*glsl*/ `
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`;

export const GLSL_ROTATE_2D = /*glsl*/ `
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`;

/**
 * Get screen-space direction for label position mode.
 * Maps position mode (0-4) to direction vectors.
 * Directions use screen coordinates (Y-down).
 *
 * Position modes:
 *   0: right  → (1, 0)
 *   1: left   → (-1, 0)
 *   2: above  → (0, -1)
 *   3: below  → (0, 1)
 *   4: over   → (0, 0)
 */
export const GLSL_GET_LABEL_DIRECTION = /*glsl*/ `
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`;

/**
 * SDF for an axis-aligned box.
 * Returns signed distance from point p to the box boundary.
 */
export const GLSL_SDF_BOX = /*glsl*/ `
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`;

/**
 * SDF for a rotated box.
 * Rotates the point by -angle to align with the box, then computes box SDF.
 * Requires sdfBox to be defined before this.
 */
export const GLSL_SDF_ROTATED_BOX = /*glsl*/ `
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`;

/**
 * SDF for an axis-aligned rounded box.
 * Shrinks box by radius, computes box SDF, subtracts radius.
 * When radius=0, equivalent to sdfBox.
 */
export const GLSL_SDF_ROUNDED_BOX = /*glsl*/ `
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`;

/**
 * SDF for a rotated rounded box.
 * Rotates the point by -angle to align with the box, then computes rounded box SDF.
 * Requires sdfRoundedBox to be defined before this.
 */
export const GLSL_SDF_ROUNDED_ROTATED_BOX = /*glsl*/ `
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`;

/**
 * Center of the label box relative to the node center, in screen pixels
 * (Y-down), BEFORE the label-angle rotation is applied.
 *
 * Shared by the label-background and attachment shaders to place the box around
 * the (frame-texture) edge distance, so they stay in lockstep with the label.
 *
 *   positionMode: 0=right 1=left 2=above 3=below 4=over
 *   labelStart:   distance from the node center to the box's inner edge along
 *                 the position direction (= shape edge distance + margin)
 *   halfSize:     half the label box extent (text half-width/height, px)
 *   textHalfY:    half the actual glyph height (maxAscent+maxDescent). For
 *                 above/below the box centers on the text, not the font line
 *                 box, so it stays aligned with the rendered glyphs.
 */
export const GLSL_LABEL_BOX_CENTER = /*glsl*/ `
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`;

/** Texels per node in the node-data texture (geometry + rotation flags). */
export const NODE_DATA_TEXELS_PER_NODE = 2;

/**
 * Reads a node's geometry texel `(x, y, size, shapeId)` from the node-data
 * texture by node index. Shared by every node-data consumer so the two-texel
 * stride lives in exactly one place.
 */
export const GLSL_READ_NODE_DATA = /*glsl*/ `
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * ${NODE_DATA_TEXELS_PER_NODE};
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`;

/**
 * Reads a node's rotation-flags texel from the node-data texture (texel 1):
 *   .r = nodeRotation  (0 = viewport/screen-upright, 1 = graph/turns with camera)
 *   .g = labelRotation (0 = viewport, 1 = label orbits with camera)
 * Same node index as readNodeData. Requires GLSL_READ_NODE_DATA's stride.
 */
export const GLSL_READ_NODE_FLAGS = /*glsl*/ `
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * ${NODE_DATA_TEXELS_PER_NODE} + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`;

/**
 * Reads an item's texel from a frame texture (a render target written once per
 * frame by a frame-pass, indexed in lockstep with the matching data texture, so
 * callers reuse `a_nodeIndex` / `a_edgeIndex`). Always returns the full `vec4`;
 * R32F callers (node placement) take `.r`. What the channels mean is documented
 * by the frame-pass that writes them.
 */
export const GLSL_READ_FRAME_TEXEL = /*glsl*/ `
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;

/**
 * Generates the `findEdgeDistance(vec2 direction, float size)` GLSL used to
 * place labels at a shape's boundary, handling both single- and multi-shape
 * programs. For multi-shape it also emits `queryShapeSDF` and the
 * `int g_shapeId;` global the caller must set (from the node's shape id).
 *
 * The caller must include the shapes' SDF functions (`getShapeGLSLForShapes`)
 * *before* the returned code. Shared by the label-background and attachment
 * shaders so they query the boundary exactly like the label program.
 */
export function generateFindEdgeDistanceForShapes(
  shapes: SDFShape[],
  shapeGlobalIds?: number[],
): { code: string; multiShape: boolean } {
  const floatParams = (shape: SDFShape): string[] =>
    shape.uniforms
      .filter((u): u is { name: string; type: "float"; value: number } => u.type === "float")
      .map((u) => numberToGLSLFloat(u.value ?? 0));

  const sdfCall = (shape: SDFShape): string => {
    const params = floatParams(shape);
    return params.length > 0 ? `sdf_${shape.name}(uv, size, ${params.join(", ")})` : `sdf_${shape.name}(uv, size)`;
  };

  if (shapes.length === 1) {
    return { code: findEdgeDistanceLoop(sdfCall(shapes[0])), multiShape: false };
  }

  // Multi-shape: switch over the node's (global) shape id. Case ids are the
  // global ids stored in the node data texture's .w channel.
  const cases = shapes
    .map((shape, index) => `    case ${shapeGlobalIds ? shapeGlobalIds[index] : index}: return ${sdfCall(shape)};`)
    .join("\n");

  const code = /*glsl*/ `
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${cases}
    default: return ${sdfCall(shapes[0])};
  }
}
int g_shapeId;
${findEdgeDistanceLoop("queryShapeSDF(g_shapeId, uv, size)")}
`;

  return { code, multiShape: true };
}

/**
 * The findEdgeDistance binary search, parameterized by the SDF expression to
 * test (`uv`/`size` in scope). Rotation is not handled here: the caller
 * pre-rotates `direction` per node (the camera counter-rotation depends on the
 * node's rotation-alignment flag). Single- and multi-shape programs share this.
 */
function findEdgeDistanceLoop(sdfExpr: string): string {
  return /*glsl*/ `
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (${sdfExpr} < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`;
}
