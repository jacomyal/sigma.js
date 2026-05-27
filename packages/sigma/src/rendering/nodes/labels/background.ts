/**
 * Sigma.js Label Background Program
 * ===================================
 *
 * A WebGL program that renders a rectangle behind each visible node label.
 * It serves two independent purposes:
 *   - Visual: an optional semi-transparent background behind label text.
 *   - Picking: writing node/label IDs to the picking framebuffer so that
 *     hovering or clicking a label area fires the appropriate events.
 *
 * The label rect position is computed with the same SDF binary search as
 * the label and backdrop programs, so the picking area matches the visual.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import type Sigma from "../../../sigma";
import type { RenderParams } from "../../../types";
import { GLSL_GET_LABEL_DIRECTION, GLSL_NODE_SIZE_TO_PIXELS, generateFindEdgeDistance } from "../../glsl";
import { Program } from "../../program";
import { getShapeGLSLForShapes } from "../../shapes";
import { numberToGLSLFloat } from "../../utils";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { LabelOptions, SDFShape } from "../types";

// Label picking IDs are allocated by core/interactive-kinds.ts when at least
// one interaction on a label is configured as `"separate"`. The label
// programs read their allocated range from `internals.pickingState.offsets`
// and compute the IDs they write at render time. In pure-extend mode the
// label rect writes the parent's id, so a hit resolves to the parent kind.

// ============================================================================
// Data type
// ============================================================================

export interface LabelBackgroundData {
  x: number;
  y: number;
  size: number;
  shapeId: number;
  id: number; // from indexToColor()
  color: number; // from floatColor(), RGBA packed as float (premul applied in shader)
  labelWidth: number; // CSS px
  labelHeight: number; // CSS px
  positionMode: number; // 0=right 1=left 2=above 3=below 4=over
  labelAngle: number; // radians
  padding: number; // CSS px
}

// ============================================================================
// GLSL generation
// ============================================================================

function generateVertexShader(shapes: SDFShape[], rotateWithCamera: boolean, shapeGlobalIds?: number[]): string {
  const shapeGLSL = getShapeGLSLForShapes(shapes);

  const seenUniforms = new Set<string>();
  const shapeUniformDeclarations = shapes
    .flatMap((s) => s.uniforms)
    .filter((u) => {
      if (seenUniforms.has(u.name)) return false;
      seenUniforms.add(u.name);
      return true;
    })
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");

  // findEdgeDistance: single-shape or multi-shape
  let findEdgeDistanceCode: string;
  let shapeIdPreamble = "";

  if (shapes.length === 1) {
    const shape = shapes[0];
    const paramValues = shape.uniforms
      .filter((u): u is { name: string; type: "float"; value: number } => u.type === "float")
      .map((u) => numberToGLSLFloat(u.value ?? 0));
    const sdfCall =
      paramValues.length > 0 ? `sdf_${shape.name}(uv, size, ${paramValues.join(", ")})` : `sdf_${shape.name}(uv, size)`;
    findEdgeDistanceCode = generateFindEdgeDistance(sdfCall, rotateWithCamera);
  } else {
    const cases = shapes
      .map((shape, index) => {
        const paramValues = shape.uniforms
          .filter((u): u is { name: string; type: "float"; value: number } => u.type === "float")
          .map((u) => numberToGLSLFloat(u.value ?? 0));
        const sdfCall =
          paramValues.length > 0
            ? `sdf_${shape.name}(uv, size, ${paramValues.join(", ")})`
            : `sdf_${shape.name}(uv, size)`;
        const caseId = shapeGlobalIds ? shapeGlobalIds[index] : index;
        return `    case ${caseId}: return ${sdfCall};`;
      })
      .join("\n");
    const defaultShape = shapes[0];
    const defaultParams = defaultShape.uniforms
      .filter((u): u is { name: string; type: "float"; value: number } => u.type === "float")
      .map((u) => numberToGLSLFloat(u.value ?? 0));
    const defaultCall =
      defaultParams.length > 0
        ? `sdf_${defaultShape.name}(uv, size, ${defaultParams.join(", ")})`
        : `sdf_${defaultShape.name}(uv, size)`;

    shapeIdPreamble = `int g_shapeId;`;
    findEdgeDistanceCode = `
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${cases}
    default: return ${defaultCall};
  }
}
${
  rotateWithCamera
    ? `
float findEdgeDistance(vec2 direction, float size) {
  float c = cos(-u_cameraAngle); float s = sin(-u_cameraAngle);
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = mat2(c, -s, s, c) * (direction * mid);
    if (queryShapeSDF(g_shapeId, uv, size) < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}`
    : `
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (queryShapeSDF(g_shapeId, uv, size) < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}`
}
`;
  }

  // language=GLSL
  const shader = /*glsl*/ `#version 300 es

in vec2 a_nodePosition;
in float a_nodeSize;
in float a_shapeId;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
${shapeUniformDeclarations}

out vec4 v_id;
out vec4 v_color;

${shapeGLSL}
${shapeIdPreamble}
${findEdgeDistanceCode}
${GLSL_GET_LABEL_DIRECTION}

void main() {
  ${shapes.length > 1 ? "g_shapeId = int(a_shapeId);" : ""}
  ${GLSL_NODE_SIZE_TO_PIXELS}

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  float la_c = cos(a_labelAngle);
  float la_s = sin(a_labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(a_nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    vec2 rotatedScreenDir = labelRotMat * screenDir;
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);

    float edgeDistNormalized = findEdgeDistance(sdfDir, 1.0);
    float edgeDistPixels = nodeRadiusPixels * edgeDistNormalized;
    float labelStart = edgeDistPixels + labelMargin;

    if (a_positionMode < 0.5) {
      labelOffset = vec2(labelStart + labelW * 0.5, 0.0);
    } else if (a_positionMode < 1.5) {
      labelOffset = vec2(-(labelStart + labelW * 0.5), 0.0);
    } else if (a_positionMode < 2.5) {
      labelOffset = vec2(0.0, -(labelStart + labelH * 0.5));
    } else {
      labelOffset = vec2(0.0, labelStart + labelH * 0.5);
    }

    labelOffset = labelRotMat * labelOffset;
  }

  vec2 localPos = labelOffset + a_quadCorner * labelHalfSize;
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`;
  return shader;
}

const FRAGMENT_SHADER = /*glsl*/ `#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;

// ============================================================================
// Abstract base class
// ============================================================================

export abstract class LabelBackgroundProgram<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<Uniform, N, E, G> {
  protected totalCount = 0;
  protected bufferCapacity = 0;

  abstract processLabelBackground(offset: number, data: LabelBackgroundData): void;

  hasNothingToRender(): boolean {
    return this.totalCount === 0;
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
}

export type LabelBackgroundProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = new (
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
) => LabelBackgroundProgram<string, N, E, G>;

// ============================================================================
// Factory
// ============================================================================

export interface CreateLabelBackgroundProgramOptions {
  shapes: SDFShape[];
  rotateWithCamera?: boolean;
  label?: LabelOptions;
  shapeGlobalIds?: number[];
}

export function createLabelBackgroundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options: CreateLabelBackgroundProgramOptions): LabelBackgroundProgramType<N, E, G> {
  const { shapes, rotateWithCamera = false, label: labelOptions = {}, shapeGlobalIds } = options;

  if (shapes.length === 0) {
    throw new Error("createLabelBackgroundProgram: at least one shape must be provided");
  }

  const labelMargin = labelOptions.margin ?? 5;
  const zoomToLabelSizeRatioFunction = labelOptions.zoomToLabelSizeRatioFunction ?? (() => 1);
  const vertexShader = generateVertexShader(shapes, rotateWithCamera, shapeGlobalIds);

  type U = string;

  return class NodeLabelBackgroundProgram extends LabelBackgroundProgram<U, N, E, G> {
    static readonly labelMargin = labelMargin;

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      super(gl, pickingBuffer, renderer);
    }

    getDefinition(): InstancedProgramDefinition<U> {
      const { FLOAT, UNSIGNED_BYTE, TRIANGLE_STRIP } = WebGL2RenderingContext;
      return {
        VERTICES: 4,
        VERTEX_SHADER_SOURCE: vertexShader,
        FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: [
          "u_matrix",
          "u_sizeRatio",
          "u_correctionRatio",
          "u_cameraAngle",
          "u_resolution",
          "u_pixelRatio",
          "u_labelMargin",
          "u_zoomLabelSizeRatio",
          "u_labelPixelSnapping",
          "u_pickingPadding",
          ...new Set(shapes.flatMap((s) => s.uniforms.map((u) => u.name))),
        ] as U[],
        ATTRIBUTES: [
          { name: "a_nodePosition", size: 2, type: FLOAT },
          { name: "a_nodeSize", size: 1, type: FLOAT },
          { name: "a_shapeId", size: 1, type: FLOAT },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_labelWidth", size: 1, type: FLOAT },
          { name: "a_labelHeight", size: 1, type: FLOAT },
          { name: "a_positionMode", size: 1, type: FLOAT },
          { name: "a_labelAngle", size: 1, type: FLOAT },
          { name: "a_padding", size: 1, type: FLOAT },
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: FLOAT }],
        CONSTANT_DATA: [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ],
      };
    }

    processLabelBackground(offset: number, data: LabelBackgroundData): void {
      const { floats, ints } = this;
      let i = offset * this.STRIDE;
      floats[i++] = data.x;
      floats[i++] = data.y;
      floats[i++] = data.size;
      floats[i++] = data.shapeId;
      // a_id is a packed picking ID, it should be stored as an int
      ints[i++] = data.id;
      floats[i++] = data.color;
      floats[i++] = data.labelWidth;
      floats[i++] = data.labelHeight;
      floats[i++] = data.positionMode;
      floats[i++] = data.labelAngle;
      floats[i++] = data.padding;
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_labelMargin, NodeLabelBackgroundProgram.labelMargin);
      gl.uniform1f(uniformLocations.u_zoomLabelSizeRatio, 1 / zoomToLabelSizeRatioFunction(params.zoomRatio));
      gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);
      gl.uniform1f(uniformLocations.u_pickingPadding, params.labelPickingPadding);

      const seenUniforms = new Set<string>();
      for (const shape of shapes) {
        for (const uniform of shape.uniforms) {
          if (!seenUniforms.has(uniform.name)) {
            seenUniforms.add(uniform.name);
            this.setTypedUniform(uniform, { gl, uniformLocations } as ProgramInfo);
          }
        }
      }
    }
  };
}
