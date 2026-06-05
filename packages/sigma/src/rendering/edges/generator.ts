/**
 * Sigma.js Edge Shader Generator
 * ===============================
 *
 * Generates GLSL shaders for composable edge programs.
 * Composes path geometry, extremities (head/tail), and layers into
 * single-pass WebGL shaders.
 *
 * @module
 */
import { computeAttributeLayout } from "../data-texture";
import { GLSL_READ_FRAME_TEXEL, GLSL_READ_NODE_DATA, GLSL_READ_NODE_FLAGS } from "../glsl";
import { isAttributeSource } from "../nodes";
import { generateShapeSelectorGLSL, getAllShapeGLSL } from "../shapes";
import { numberToGLSLFloat } from "../utils";
import { generateEdgeAttributeTextureFetch } from "./path-attribute-texture";
import {
  generateFindSourceClampT,
  generateFindTargetClampT,
  generateNumericalTangentNormal,
  generatePathFallbacks,
} from "./shared-glsl";
import {
  EdgeExtremity,
  EdgeLayer,
  EdgePath,
  EdgeProgramOptions,
  GeneratedEdgeShaders,
  normalizeEdgeProgramOptions,
} from "./types";

const { FLOAT, UNSIGNED_BYTE } = WebGL2RenderingContext;

/**
 * Options for generating edge shaders.
 * Alias for EdgeProgramOptions for backward compatibility.
 */
export type EdgeShaderGenerationOptions = EdgeProgramOptions;

// ============================================================================
// Multi-Path GLSL Generation Helpers
// ============================================================================

/**
 * Collects all uniforms from multiple paths, extremities, and layers.
 */
function collectUniformsMulti(paths: EdgePath[], extremities: EdgeExtremity[], layers: EdgeLayer[]): string[] {
  const standardUniforms = new Set([
    "u_matrix",
    "u_sizeRatio",
    "u_correctionRatio",
    "u_zoomRatio",
    "u_pixelRatio",
    "u_cameraAngle",
    "u_minEdgeThickness",
    "u_pickingPadding",
    "u_nodeDataTexture",
    "u_nodeDataTextureWidth",
    "u_edgeDataTexture",
    "u_edgeDataTextureWidth",
    "u_edgeFrameTexture",
    "u_edgeFrameTextureWidth",
    // Edge path attribute texture uniforms
    "u_edgeAttributeTexture",
    "u_edgeAttributeTextureWidth",
    "u_edgeAttributeTexelsPerEdge",
  ]);

  const uniforms = new Set<string>(standardUniforms);

  paths.forEach((p) => p.uniforms.forEach((u) => uniforms.add(u.name)));
  extremities.forEach((e) => e.uniforms.forEach((u) => uniforms.add(u.name)));
  layers.forEach((layer) => layer.uniforms.forEach((u) => uniforms.add(u.name)));

  return Array.from(uniforms);
}

/**
 * Generates GLSL code for all paths (combined).
 */
function generateAllPathsGLSL(paths: EdgePath[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];

  for (const path of paths) {
    if (!seen.has(path.name)) {
      seen.add(path.name);
      parts.push(`// Path: ${path.name}`);
      parts.push(path.glsl);
      parts.push(generateNumericalTangentNormal(path.name));
      parts.push(generatePathFallbacks(path.name, path.glsl));
    }
  }

  return parts.join("\n\n");
}

/**
 * Generates GLSL code for all extremities (combined).
 */
function generateAllExtremitiesGLSL(extremities: EdgeExtremity[]): string {
  const parts: string[] = [];

  for (const ext of extremities) {
    parts.push(`// Extremity: ${ext.name}`);
    parts.push(ext.glsl);
  }

  return parts.join("\n\n");
}

/**
 * Configuration for generating a path selector function.
 */
interface PathSelectorConfig {
  /** Query function name (e.g., "queryPathPosition") */
  queryName: string;
  /** Path function suffix (e.g., "position") */
  pathFunc: string;
  /** Return type (e.g., "vec2", "float") */
  returnType: string;
  /** Additional parameters after pathId (e.g., "float t, vec2 source, vec2 target") */
  params: string;
  /** Arguments to pass to path function (e.g., "t, source, target") */
  args: string;
}

/**
 * Path selector configurations for all path functions.
 */
const PATH_SELECTOR_CONFIGS: PathSelectorConfig[] = [
  {
    queryName: "queryPathPosition",
    pathFunc: "position",
    returnType: "vec2",
    params: "float t, vec2 source, vec2 target",
    args: "t, source, target",
  },
  {
    queryName: "queryPathTangent",
    pathFunc: "tangent",
    returnType: "vec2",
    params: "float t, vec2 source, vec2 target",
    args: "t, source, target",
  },
  {
    queryName: "queryPathNormal",
    pathFunc: "normal",
    returnType: "vec2",
    params: "float t, vec2 source, vec2 target",
    args: "t, source, target",
  },
  {
    queryName: "queryPathLength",
    pathFunc: "length",
    returnType: "float",
    params: "vec2 source, vec2 target",
    args: "source, target",
  },
  {
    queryName: "queryPathClosestT",
    pathFunc: "closest_t",
    returnType: "float",
    params: "vec2 p, vec2 source, vec2 target",
    args: "p, source, target",
  },
];

/**
 * Generates a GLSL switch statement for a path function lookup.
 */
function generatePathSelector(paths: EdgePath[], config: PathSelectorConfig): string {
  const { queryName, pathFunc, returnType, params, args } = config;

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
 * Generates all path selector functions.
 */
function generateAllPathSelectors(paths: EdgePath[]): string {
  return PATH_SELECTOR_CONFIGS.map((config) => generatePathSelector(paths, config)).join("\n\n");
}

/**
 * Generates a GLSL switch statement for extremity SDF lookup.
 * Shared pool: both head and tail use the same selector.
 */
function generateExtremitySdfSelector(extremities: EdgeExtremity[]): string {
  if (extremities.length === 1) {
    return `float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_${extremities[0].name}(uv, lengthRatio, widthRatio);
}`;
  }

  const cases = extremities
    .map((e, i) => `    case ${i}: return extremity_${e.name}(uv, lengthRatio, widthRatio);`)
    .join("\n");

  return `float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
${cases}
    default: return extremity_${extremities[0].name}(uv, lengthRatio, widthRatio);
  }
}`;
}

/**
 * Generates find source/target clamp functions for all paths.
 * Always generates selector functions for use in multi-mode shaders.
 */
function generateAllClampFunctions(paths: EdgePath[]): string {
  const parts: string[] = [];

  // Generate individual clamp functions for each path
  for (const path of paths) {
    parts.push(generateFindSourceClampT(path.name));
    parts.push(generateFindTargetClampT(path.name));
  }

  // Always generate selector functions (needed for multi-mode which can be triggered
  // by multiple extremities even with a single path)
  if (paths.length === 1) {
    // Single path: selectors just call the single path's functions directly
    parts.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_${paths[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_${paths[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`);
  } else {
    // Multiple paths: generate switch statements
    const sourceCases = paths
      .map(
        (p, i) =>
          `    case ${i}: return findSourceClampT_${p.name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);`,
      )
      .join("\n");

    const targetCases = paths
      .map(
        (p, i) =>
          `    case ${i}: return findTargetClampT_${p.name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);`,
      )
      .join("\n");

    parts.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
${sourceCases}
    default: return findSourceClampT_${paths[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
${targetCases}
    default: return findTargetClampT_${paths[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`);
  }

  return parts.join("\n\n");
}

/**
 * Generates the edge frame-pass vertex shader. Runs once per edge as a point
 * draw (`gl.drawArrays(POINTS, 0, edgeCount)`, `a_edgeIndex = gl_VertexID`),
 * computes `vec4(tStart, tEnd, straightenFactor, pathLength)` and scatters it
 * to the edge's texel in the edge-frame texture (the fragment writes the
 * varying through). The body, label and background programs then read that
 * texel by `a_edgeIndex`, so the clamp search lives in exactly one place.
 *
 * `tStart`/`tEnd` are the *ungated* boundary clamps (always searched); the body
 * re-applies its extremity gating in-shader, labels use them directly.
 */
export function generateEdgeFramePassVertexShader(
  paths: EdgePath[],
  extremities: EdgeExtremity[],
  layers: EdgeLayer[],
): string {
  const attributeLayout = computeAttributeLayout([...paths, ...layers]);
  const textureFetch = generateEdgeAttributeTextureFetch(attributeLayout);

  const seenUniforms = new Set<string>();
  const customUniforms: string[] = [];
  const addUniform = (u: { name: string; type: string }) => {
    if (!seenUniforms.has(u.name)) {
      seenUniforms.add(u.name);
      customUniforms.push(`uniform ${u.type} ${u.name};`);
    }
  };
  paths.forEach((p) => p.uniforms.forEach(addUniform));
  extremities.forEach((e) => e.uniforms.forEach(addUniform));

  const extremityWidthFactors = extremities.map((e) => numberToGLSLFloat(e.widthFactor)).join(", ");
  const maxMinBodyLengthRatio = Math.max(...paths.map((p) => p.minBodyLengthRatio || 0));

  // language=GLSL
  const shader = /*glsl*/ `#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
${textureFetch.uniformDeclarations}

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
${customUniforms.join("\n")}

// Path attribute varyings — assigned so path functions can read them as globals
${textureFetch.vertexVaryingDeclarations}

// Node size varyings — read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[${extremities.length}] = float[](${extremityWidthFactors});

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FLAGS}

// Shape SDFs for node boundary clamping
${getAllShapeGLSL()}
${generateShapeSelectorGLSL()}

// Path functions
${generateAllPathsGLSL(paths)}
${generateAllPathSelectors(paths)}
${generateAllClampFunctions(paths)}

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
${textureFetch.fetchCode}
${textureFetch.varyingAssignments}

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${numberToGLSLFloat(maxMinBodyLengthRatio)};

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps — not the ungated boundary ones above — so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`;

  return shader;
}

// Zone constants: tail extremity, body, head extremity
const ZONE_TAIL = 0;
const ZONE_BODY = 1;
const ZONE_HEAD = 2;

/**
 * Generates constant vertex data for zone-based edge geometry.
 * Each edge is a triangle strip with 3 zones: tail quad, body segments, head quad.
 */
function generateZonedConstantData(
  bodySegments: number,
  hasHead: boolean,
  hasTail: boolean,
): {
  data: number[][];
  attributes: Array<{ name: string; size: number; type: number }>;
  verticesPerEdge: number;
} {
  // Vertex format: [zone, zoneT, side]
  const data: number[][] = [];

  if (hasTail) {
    // Tail: zoneT=0 at tip, zoneT=1 at body junction
    data.push([ZONE_TAIL, 0, -1], [ZONE_TAIL, 0, +1]);
    data.push([ZONE_TAIL, 1, -1], [ZONE_TAIL, 1, +1]);
  }

  // Body: includes junction vertices at zoneT=0 and zoneT=1
  for (let i = 0; i <= bodySegments; i++) {
    const t = i / bodySegments;
    data.push([ZONE_BODY, t, -1], [ZONE_BODY, t, +1]);
  }

  if (hasHead) {
    // Head: zoneT=0 at body junction, zoneT=1 at tip
    data.push([ZONE_HEAD, 0, -1], [ZONE_HEAD, 0, +1]);
    data.push([ZONE_HEAD, 1, -1], [ZONE_HEAD, 1, +1]);
  }

  return {
    data,
    attributes: [
      { name: "a_zone", size: 1, type: FLOAT },
      { name: "a_zoneT", size: 1, type: FLOAT },
      { name: "a_side", size: 1, type: FLOAT },
    ],
    verticesPerEdge: data.length,
  };
}

/**
 * Generates the vertex shader for multi-path edge rendering.
 * Uses query functions (selectors) instead of direct path function calls.
 */
function generateVertexShaderMulti(
  paths: EdgePath[],
  extremities: EdgeExtremity[],
  layers: EdgeLayer[],
  constantAttributes: Array<{ name: string; size: number; type: number }>,
): string {
  // Compute attribute layout for path/layer attributes from texture
  const attributeLayout = computeAttributeLayout([...paths, ...layers]);
  const textureFetch = generateEdgeAttributeTextureFetch(attributeLayout);

  // Collect all unique uniforms
  const standardUniforms = new Set([
    "u_matrix",
    "u_sizeRatio",
    "u_correctionRatio",
    "u_zoomRatio",
    "u_pixelRatio",
    "u_cameraAngle",
    "u_minEdgeThickness",
    "u_pickingPadding",
    "u_nodeDataTexture",
  ]);

  const seenUniforms = new Set<string>();
  const customUniforms: string[] = [];
  const addUniform = (u: { name: string; type: string }) => {
    if (!standardUniforms.has(u.name) && !seenUniforms.has(u.name)) {
      seenUniforms.add(u.name);
      customUniforms.push(`uniform ${u.type} ${u.name};`);
    }
  };
  paths.forEach((p) => p.uniforms.forEach(addUniform));
  extremities.forEach((e) => e.uniforms.forEach(addUniform));
  layers.forEach((layer) => layer.uniforms.forEach(addUniform));

  // Generate constant attribute declarations
  const constantAttrDeclarations = constantAttributes
    .map((attr) => {
      const glslType = attr.size === 1 ? "float" : `vec${attr.size}`;
      return `in ${glslType} ${attr.name};`;
    })
    .join("\n");

  // Generate extremity width factor array (shared pool for head/tail)
  const extremityWidthFactors = extremities.map((e) => numberToGLSLFloat(e.widthFactor)).join(", ");

  // Generate min body length ratio (use max across all paths)
  const maxMinBodyLengthRatio = Math.max(...paths.map((p) => p.minBodyLengthRatio || 0));

  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es

// Constant attributes (per vertex)
${constantAttrDeclarations}

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
${textureFetch.uniformDeclarations}

// Custom uniforms
${customUniforms.join("\n")}

// Standard varyings
out vec4 v_color;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_maxWidthFactor;  // Max width factor for geometry expansion
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
out vec2 v_position;         // World position of the vertex (for position-based distance)
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)

// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
${textureFetch.vertexVaryingDeclarations}

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[${extremities.length}] = float[](${extremityWidthFactors});

// All path functions
${generateAllPathsGLSL(paths)}

// Path selector functions
${generateAllPathSelectors(paths)}

// Node-data fetch helper (geometry texel of the two-texel node stride)
${GLSL_READ_NODE_DATA}

// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
${GLSL_READ_FRAME_TEXEL}

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
${textureFetch.fetchCode}

  // Assign path/layer attribute varyings
${textureFetch.varyingAssignments}

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;

  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${numberToGLSLFloat(maxMinBodyLengthRatio)};

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity → body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Width factor for geometry expansion (use max of both extremities)
  float widthFactor = max(max(headWidthFactor, tailWidthFactor), 1.0);

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_maxWidthFactor = widthFactor;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;
  v_position = position;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`;

  return glsl;
}

/**
 * Generates the fragment shader for multi-path edge rendering.
 * Uses query functions (selectors) for path and extremity operations.
 * Supports multiple layers with "over" alpha compositing.
 */
function generateFragmentShaderMulti(paths: EdgePath[], extremities: EdgeExtremity[], layers: EdgeLayer[]): string {
  // Compute attribute layout for path/layer attributes from texture
  const attributeLayout = computeAttributeLayout([...paths, ...layers]);
  const textureFetch = generateEdgeAttributeTextureFetch(attributeLayout);

  // Collect all unique uniforms
  const standardUniforms = new Set([
    "u_matrix",
    "u_sizeRatio",
    "u_correctionRatio",
    "u_zoomRatio",
    "u_pixelRatio",
    "u_cameraAngle",
    "u_minEdgeThickness",
    "u_pickingPadding",
  ]);

  const seenUniforms = new Set<string>();
  const customUniforms: string[] = [];
  const addUniform = (u: { name: string; type: string }) => {
    if (!standardUniforms.has(u.name) && !seenUniforms.has(u.name)) {
      seenUniforms.add(u.name);
      customUniforms.push(`uniform ${u.type} ${u.name};`);
    }
  };
  paths.forEach((p) => p.uniforms.forEach(addUniform));
  extremities.forEach((e) => e.uniforms.forEach(addUniform));
  layers.forEach((layer) => layer.uniforms.forEach(addUniform));

  // Generate base ratio array for extremities (shared pool for head/tail)
  const extremityBaseRatios = extremities.map((e) => numberToGLSLFloat(e.baseRatio ?? 0.5)).join(", ");

  // Generate layer function calls with "over" compositing (like node layers)
  const layerCalls = layers
    .map((layer, index) => {
      return `  // Layer ${index + 1}: ${layer.name}
  color = blendOver(color, layer_${layer.name}(context));`;
    })
    .join("\n\n");

  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_maxWidthFactor;  // Max width factor for geometry expansion
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
in vec2 v_position;          // World position of the fragment
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)

// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
${textureFetch.fragmentVaryingDeclarations}

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
${customUniforms.join("\n")}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[${extremities.length}] = float[](${extremityBaseRatios});

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
${generateAllPathsGLSL(paths)}

// Path selector functions
${generateAllPathSelectors(paths)}

// All extremity functions
${generateAllExtremitiesGLSL(extremities)}

// Extremity SDF selector (shared pool for head/tail)
${generateExtremitySdfSelector(extremities)}

// Layer functions
${layers.map((layer) => layer.glsl).join("\n\n")}

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = queryPathNormal(v_pathId, v_t, v_source, v_target);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
${
  paths.every((p) => p.linearParameterization)
    ? `  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`
    : paths.every((p) => !p.linearParameterization)
      ? `  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`
      : `  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (${paths
    .filter((p) => p.linearParameterization)
    .map((p) => `v_pathId == ${paths.indexOf(p)}`)
    .join(" || ")}) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`
}

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

  // Get base ratios from shared array
  float headBaseRatio = EXTREMITY_BASE_RATIOS[v_headId];
  float tailBaseRatio = EXTREMITY_BASE_RATIOS[v_tailId];

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
    // Visual pass: anti-aliased edge with layers
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF);
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

${layerCalls}

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`;

  return glsl;
}

/**
 * Generates constant data for a specific path/head/tail combination.
 */
function getConstantDataForCombination(
  path: EdgePath,
  head: EdgeExtremity,
  tail: EdgeExtremity,
): {
  data: number[][];
  attributes: Array<{ name: string; size: number; type: number }>;
  verticesPerEdge: number;
} {
  const hasHead = !isAttributeSource(head.length) ? head.length > 0 : true;
  const hasTail = !isAttributeSource(tail.length) ? tail.length > 0 : true;

  if (path.generateConstantData) {
    const custom = path.generateConstantData();
    return {
      data: custom.data,
      attributes: custom.attributes,
      verticesPerEdge: custom.verticesPerEdge,
    };
  }

  return generateZonedConstantData(path.segments, hasHead, hasTail);
}

/**
 * Main generator function that produces complete shader code and metadata.
 * Always generates unified shaders that support per-edge path/extremity selection.
 */
export function generateEdgeShaders(options: EdgeShaderGenerationOptions): GeneratedEdgeShaders {
  const { paths, extremities, layers } = normalizeEdgeProgramOptions(options);

  // Generate constant data for all combinations (any extremity can be head or tail)
  const vertexCountsPerCombination = new Map<string, number>();
  const constantDataPerCombination = new Map<string, number[][]>();
  const constantAttributesMap = new Map<string, { name: string; size: number; type: number }>();

  for (const p of paths) {
    for (const headExt of extremities) {
      for (const tailExt of extremities) {
        const key = `${p.name}:${headExt.name}:${tailExt.name}`;
        const constantData = getConstantDataForCombination(p, headExt, tailExt);
        vertexCountsPerCombination.set(key, constantData.verticesPerEdge);
        constantDataPerCombination.set(key, constantData.data);
        // Collect unique constant attributes from all paths
        for (const attr of constantData.attributes) {
          if (!constantAttributesMap.has(attr.name)) {
            constantAttributesMap.set(attr.name, attr);
          }
        }
      }
    }
  }

  // Constant attributes collected from all paths
  const constantAttributes = Array.from(constantAttributesMap.values());

  // Build attribute name to index mapping for padding
  const attrNameToIndex: Record<string, number> = {};
  constantAttributes.forEach((attr, idx) => {
    attrNameToIndex[attr.name] = idx;
  });

  // Find the maximum vertex count across all combinations
  // This is used for instanced rendering where all edges need the same vertex count
  let maxVerticesPerEdge = 0;
  let maxConstantDataKey = "";
  for (const [key, vertexCount] of vertexCountsPerCombination) {
    if (vertexCount > maxVerticesPerEdge) {
      maxVerticesPerEdge = vertexCount;
      maxConstantDataKey = key;
    }
  }

  // Get the constant data for the max-vertex combination and pad to unified format
  const rawConstantData = constantDataPerCombination.get(maxConstantDataKey) || [];

  // Find which attributes were in the original data by checking the path that generated it
  // We need to map from the original attribute order to the unified order
  const [pathName] = maxConstantDataKey.split(":");
  const path = paths.find((p) => p.name === pathName);
  let originalAttrs: Array<{ name: string }> = [];
  if (path?.generateConstantData) {
    originalAttrs = path.generateConstantData().attributes;
  } else {
    // Standard zoned data has these attributes in this order
    originalAttrs = [{ name: "a_zone" }, { name: "a_zoneT" }, { name: "a_side" }];
  }

  // Pad each vertex's data to match the unified attribute layout
  const maxConstantData: number[][] = rawConstantData.map((vertex) => {
    const padded = new Array(constantAttributes.length).fill(0);
    // Map original values to their positions in the unified layout
    originalAttrs.forEach((attr, i) => {
      const targetIdx = attrNameToIndex[attr.name];
      if (targetIdx !== undefined && i < vertex.length) {
        padded[targetIdx] = vertex[i];
      }
    });
    return padded;
  });

  return {
    vertexShader: generateVertexShaderMulti(paths, extremities, layers, constantAttributes),
    fragmentShader: generateFragmentShaderMulti(paths, extremities, layers),
    uniforms: collectUniformsMulti(paths, extremities, layers),
    attributes: collectAttributesMulti(paths, extremities, layers),
    verticesPerEdge: maxVerticesPerEdge,
    constantData: maxConstantData,
    constantAttributes,
    vertexCountsPerCombination,
    constantDataPerCombination,
  };
}

/**
 * Collects all attributes needed for multi-path edge rendering.
 * Path/layer attributes are now stored in the edge path attribute texture,
 * so only core per-edge attributes are included in the vertex buffer.
 */
function collectAttributesMulti(
  _paths: EdgePath[],
  _extremities: EdgeExtremity[],
  _layers: EdgeLayer[],
): Array<{ name: string; size: number; type: number; normalized?: boolean }> {
  // Core per-edge attributes (path/layer attributes are in the attribute texture)
  return [
    // Edge index for texture lookup (used for both edge data and path attribute textures)
    { name: "a_edgeIndex", size: 1, type: FLOAT },
    { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
    { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
  ];
}
