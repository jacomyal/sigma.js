/**
 * Sigma.js Edge Label Background Program
 * =======================================
 *
 * A WebGL program that renders a "ribbon" behind each visible edge label.
 * Unlike node label backgrounds (a single rotated rectangle), edge labels
 * can curve or step along their path, so the background is tessellated as
 * a triangle strip that samples the same offset path as the label's
 * characters. The ribbon height matches the text height + padding, and
 * the ribbon spans the label's body arc-distance range.
 *
 * It serves two independent purposes:
 *   - Visual: an optional background fill behind the label (always
 *     rendered when `labelBackgroundColor` is set, regardless of events).
 *   - Picking: writing edge/label IDs to the picking framebuffer so that
 *     hovering or clicking a label area fires the appropriate events.
 *
 * Body bounds, visibility ramp, and perpendicular offset come from the
 * shared helpers in `shared-shader-glsl.ts`. Resolved shader config is
 * read from the edge label program class so the two programs cannot drift.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import { DEFAULT_SDF_ATLAS_OPTIONS } from "../../../core/sdf-atlas";
import type Sigma from "../../../sigma";
import type { RenderParams } from "../../../types";
import { ItemAttributeTexture, buildAttrDescriptors, computeAttributeLayout, packAttributes } from "../../data-texture";
import { Program } from "../../program";
import { InstancedProgramDefinition, ProgramInfo, numberToGLSLFloat } from "../../utils";
import { layerPlain } from "../layers";
import { EDGE_ATTRIBUTE_TEXTURE_UNIT, generateEdgeAttributeTextureFetch } from "../path-attribute-texture";
import type { EdgeLabelShaderConfig } from "./base";
import { generateEdgeLabelShaderPreamble } from "./shared-shader-glsl";

const ATLAS_FONT_SIZE = DEFAULT_SDF_ATLAS_OPTIONS.fontSize;

// Path attributes carry no layer lifecycle hooks; packAttributes still needs a map.
const NO_LIFECYCLES = new Map();

// Ribbon tessellation: SEGMENTS + 1 sample pairs = 2*(SEGMENTS + 1) vertices
// drawn as a triangle strip. 24 segments give smooth curves without much cost.
const RIBBON_SEGMENTS = 24;
const RIBBON_VERTICES = (RIBBON_SEGMENTS + 1) * 2;

// ============================================================================
// Data type
// ============================================================================

export interface EdgeLabelBackgroundData {
  /** Row index in the edge data texture */
  edgeIndex: number;
  /** Base font size in pixels */
  baseFontSize: number;
  /** Label text width in atlas (glyph) units */
  totalTextWidth: number;
  /** 0=over, 1=above, 2=below, 3=auto */
  positionMode: number;
  /** Label margin in pixels (gap between edge surface and label) */
  margin: number;
  /** Background padding in pixels */
  padding: number;
  /** Packed RGBA color from floatColor() */
  color: number;
  /** Packed picking id from indexToColor() */
  id: number;
  /** Resolved edge display data — source for the path attributes packed into the attribute texture. */
  edgeAttributes: Record<string, unknown>;
}

// ============================================================================
// GLSL generation
// ============================================================================

function generateVertexShader(config: EdgeLabelShaderConfig): string {
  const { paths, fontSizeMode, headLengthRatio, tailLengthRatio, minVisibilityThreshold, fullVisibilityThreshold } =
    config;
  const isScaledMode = fontSizeMode === "scaled";
  const layer = layerPlain();
  const attributeLayout = computeAttributeLayout([...paths, layer]);
  const textureFetch = generateEdgeAttributeTextureFetch(attributeLayout);

  // language=GLSL
  const shader = /*glsl*/ `#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
${isScaledMode ? "uniform float u_zoomSizeRatio;" : ""}

${textureFetch.uniformDeclarations}

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = ${numberToGLSLFloat(ATLAS_FONT_SIZE)};
const float HEAD_RATIO = ${numberToGLSLFloat(headLengthRatio)};
const float TAIL_RATIO = ${numberToGLSLFloat(tailLengthRatio)};
const int RIBBON_SEGMENTS = ${RIBBON_SEGMENTS};

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
${textureFetch.vertexVaryingDeclarations.replace(/out /g, "")}

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
${generateEdgeLabelShaderPreamble({ paths, minVisibilityThreshold, fullVisibilityThreshold })}

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
${textureFetch.fetchCode}
${textureFetch.varyingAssignments}
  }

  // --- Fetch node data (x, y, size, shapeId) ---
  ivec2 srcTC = ivec2(srcIdx % u_nodeDataTextureWidth, srcIdx / u_nodeDataTextureWidth);
  ivec2 tgtTC = ivec2(tgtIdx % u_nodeDataTextureWidth, tgtIdx / u_nodeDataTextureWidth);
  vec4 srcN = texelFetch(u_nodeDataTexture, srcTC, 0);
  vec4 tgtN = texelFetch(u_nodeDataTexture, tgtTC, 0);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  int sourceShapeId = int(srcN.w);
  int targetShapeId = int(tgtN.w);

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    pathId, source, sourceSize, sourceShapeId,
    target, targetSize, targetShapeId,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  ${
    isScaledMode
      ? `float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`
      : `float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`
  }
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, source, target, u_matrix
  );

  // --- Ribbon span (clipped to body) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`;
  return shader;
}

// language=GLSL
const FRAGMENT_SHADER = /*glsl*/ `#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;

// ============================================================================
// Factory
// ============================================================================

export interface CreateEdgeLabelBackgroundProgramOptions {
  /**
   * Resolved shader config shared with the paired edge label program. The
   * outer edge factory builds it once via `resolveEdgeLabelShaderConfig`
   * and hands the same object to both sub-factories — they cannot drift.
   */
  shaderConfig: EdgeLabelShaderConfig;
}

export function createEdgeLabelBackgroundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options: CreateEdgeLabelBackgroundProgramOptions) {
  const { shaderConfig } = options;
  const { paths, fontSizeMode } = shaderConfig;

  if (paths.length === 0) {
    throw new Error("createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path");
  }

  // Factory-level, closure-captured state. `getDefinition()` runs inside the
  // base Program constructor (before subclass fields exist), so anything it
  // reads must live here, not on the instance.
  const labelLayer = layerPlain();
  const attributeLayout = computeAttributeLayout([...paths, labelLayer]);
  const attrDescriptors = buildAttrDescriptors([...paths, labelLayer], attributeLayout);
  let vertexShader: string | null = null;

  type U = string;

  return class GeneratedEdgeLabelBackgroundProgram extends Program<U, N, E, G> {
    protected totalCount = 0;
    protected bufferCapacity = 0;

    private edgeAttributeTexture: ItemAttributeTexture | null = null;
    private packedAttributeData: Float32Array;

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      if (!vertexShader) vertexShader = generateVertexShader(shaderConfig);

      super(gl, pickingBuffer, renderer);

      this.edgeAttributeTexture = new ItemAttributeTexture(gl, attributeLayout);
      this.packedAttributeData = new Float32Array(attributeLayout.floatsPerItem);
    }

    getDefinition(): InstancedProgramDefinition<U> {
      const { FLOAT, UNSIGNED_BYTE, TRIANGLE_STRIP } = WebGL2RenderingContext;
      const constantData: number[][] = [];
      for (let i = 0; i < RIBBON_VERTICES; i++) constantData.push([i]);

      const uniforms: string[] = [
        "u_matrix",
        "u_sizeRatio",
        "u_correctionRatio",
        "u_pixelRatio",
        "u_cameraAngle",
        "u_resolution",
        "u_nodeDataTexture",
        "u_nodeDataTextureWidth",
        "u_edgeDataTexture",
        "u_edgeDataTextureWidth",
      ];
      if (fontSizeMode === "scaled") uniforms.push("u_zoomSizeRatio");
      if (attributeLayout.floatsPerItem > 0) {
        uniforms.push("u_edgeAttributeTexture", "u_edgeAttributeTextureWidth", "u_edgeAttributeTexelsPerEdge");
      }

      return {
        VERTICES: RIBBON_VERTICES,
        VERTEX_SHADER_SOURCE: vertexShader!,
        FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: uniforms as U[],
        ATTRIBUTES: [
          { name: "a_edgeIndex", size: 1, type: FLOAT },
          { name: "a_edgeAttrIndex", size: 1, type: FLOAT },
          { name: "a_baseFontSize", size: 1, type: FLOAT },
          { name: "a_totalTextWidth", size: 1, type: FLOAT },
          { name: "a_positionMode", size: 1, type: FLOAT },
          { name: "a_margin", size: 1, type: FLOAT },
          { name: "a_padding", size: 1, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_vertexIndex", size: 1, type: FLOAT }],
        CONSTANT_DATA: constantData,
      };
    }

    processEdgeLabelBackground(offset: number, labelKey: string, data: EdgeLabelBackgroundData): void {
      // Allocate the attribute-texture row first so a_edgeAttrIndex points at
      // it. Rows are keyed by edge, globally — not reset per depth pass — so the
      // index must come from the texture, not from the caller's loop counter.
      let attrIndex = 0;
      if (this.edgeAttributeTexture && attributeLayout.floatsPerItem > 0) {
        attrIndex = this.edgeAttributeTexture.allocate(labelKey);
        const packed = this.packedAttributeData;
        packAttributes(attrDescriptors, data.edgeAttributes, packed, "", 1, NO_LIFECYCLES, 0);
        this.edgeAttributeTexture.updateAllAttributes(labelKey, packed);
      }

      const { floats, ints } = this;
      let i = offset * this.STRIDE;
      floats[i++] = data.edgeIndex;
      floats[i++] = attrIndex;
      floats[i++] = data.baseFontSize;
      floats[i++] = data.totalTextWidth;
      floats[i++] = data.positionMode;
      floats[i++] = data.margin;
      floats[i++] = data.padding;
      floats[i++] = data.color;
      // a_id is a packed picking ID, it should be stored as an int
      ints[i++] = data.id;
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      gl.uniform2f(uniformLocations.u_resolution, params.width, params.height);

      if (uniformLocations.u_nodeDataTexture !== undefined)
        gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      if (uniformLocations.u_nodeDataTextureWidth !== undefined)
        gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      if (uniformLocations.u_edgeDataTexture !== undefined)
        gl.uniform1i(uniformLocations.u_edgeDataTexture, params.edgeDataTextureUnit);
      if (uniformLocations.u_edgeDataTextureWidth !== undefined)
        gl.uniform1i(uniformLocations.u_edgeDataTextureWidth, params.edgeDataTextureWidth);

      if (fontSizeMode === "scaled" && uniformLocations.u_zoomSizeRatio !== undefined) {
        const zoomToSizeRatioFunction = this.renderer.getSetting("zoomToSizeRatioFunction");
        gl.uniform1f(uniformLocations.u_zoomSizeRatio, 1 / zoomToSizeRatioFunction(params.zoomRatio));
      }

      if (
        this.edgeAttributeTexture &&
        attributeLayout.floatsPerItem > 0 &&
        uniformLocations.u_edgeAttributeTexture !== undefined
      ) {
        this.edgeAttributeTexture.bind(EDGE_ATTRIBUTE_TEXTURE_UNIT);
        gl.uniform1i(uniformLocations.u_edgeAttributeTexture, EDGE_ATTRIBUTE_TEXTURE_UNIT);
        gl.uniform1i(uniformLocations.u_edgeAttributeTextureWidth, this.edgeAttributeTexture.getTextureWidth());
        gl.uniform1i(uniformLocations.u_edgeAttributeTexelsPerEdge, this.edgeAttributeTexture.getTexelsPerItem());
      }
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
      if (this.edgeAttributeTexture && attributeLayout.floatsPerItem > 0) {
        this.edgeAttributeTexture.upload();
      }
      super.renderProgram(params, programInfo);
    }

    kill(): void {
      if (this.edgeAttributeTexture) {
        this.edgeAttributeTexture.kill();
        this.edgeAttributeTexture = null;
      }
      super.kill();
    }

    drawWebGL(_method: number, { gl }: ProgramInfo): void {
      if (this.totalCount === 0) return;
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.VERTICES, this.totalCount);
    }

    reallocate(count: number): void {
      this.totalCount = count;
      if (count > this.bufferCapacity) {
        this.bufferCapacity = Math.max(count, Math.ceil(this.bufferCapacity * 1.5) || 10);
        super.reallocate(this.bufferCapacity);
      }
    }
  };
}

export type EdgeLabelBackgroundProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = ReturnType<typeof createEdgeLabelBackgroundProgram<N, E, G>>;

export type EdgeLabelBackgroundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = InstanceType<EdgeLabelBackgroundProgramType<N, E, G>>;
