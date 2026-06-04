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
import {
  DEFAULT_LABEL_MARGIN,
  GLSL_LABEL_BOX_CENTER,
  GLSL_NODE_SIZE_TO_PIXELS,
  GLSL_READ_NODE_DATA,
  GLSL_READ_NODE_FRAME,
} from "../../glsl";
import { Program } from "../../program";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { LabelOptions } from "../types";

// Label picking IDs are allocated by core/interactive-kinds.ts when at least
// one interaction on a label is configured as `"separate"`. The label
// programs read their allocated range from `internals.pickingState.offsets`
// and compute the IDs they write at render time. In pure-extend mode the
// label rect writes the parent's id, so a hit resolves to the parent kind.

// ============================================================================
// Data type
// ============================================================================

export interface LabelBackgroundData {
  nodeIndex: number; // node-data texture index (keys node-data + frame textures)
  id: number; // from indexToColor()
  color: number; // from floatColor(), RGBA packed as float (premul applied in shader)
  labelWidth: number; // CSS px
  labelHeight: number; // CSS px (font line box)
  textHeight: number; // CSS px (actual glyph height)
  positionMode: number; // 0=right 1=left 2=above 3=below 4=over
  labelAngle: number; // radians
  padding: number; // CSS px
}

// ============================================================================
// GLSL generation
// ============================================================================

function generateVertexShader(): string {
  // language=GLSL
  const shader = /*glsl*/ `#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FRAME}
${GLSL_LABEL_BOX_CENTER}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readNodeFrame(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx);

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

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
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
// Factory
// ============================================================================

export interface CreateLabelBackgroundProgramOptions {
  label?: LabelOptions;
}

export function createLabelBackgroundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  options: CreateLabelBackgroundProgramOptions,
): LabelBackgroundProgram<N, E, G> {
  const { label: labelOptions = {} } = options;

  const labelMargin = labelOptions.margin ?? DEFAULT_LABEL_MARGIN;
  const zoomToLabelSizeRatioFunction = labelOptions.zoomToLabelSizeRatioFunction ?? (() => 1);
  const vertexShader = generateVertexShader();

  type U = string;

  class NodeLabelBackgroundProgram extends Program<U, N, E, G> {
    static readonly labelMargin = labelMargin;

    protected totalCount = 0;
    protected bufferCapacity = 0;

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
          "u_resolution",
          "u_pixelRatio",
          "u_labelMargin",
          "u_zoomLabelSizeRatio",
          "u_labelPixelSnapping",
          "u_pickingPadding",
          "u_nodeDataTexture",
          "u_nodeDataTextureWidth",
          "u_nodeFrameTexture",
          "u_nodeFrameTextureWidth",
        ] as U[],
        ATTRIBUTES: [
          { name: "a_nodeIndex", size: 1, type: FLOAT },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_labelWidth", size: 1, type: FLOAT },
          { name: "a_labelHeight", size: 1, type: FLOAT },
          { name: "a_textHeight", size: 1, type: FLOAT },
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
      floats[i++] = data.nodeIndex;
      // a_id is a packed picking ID, it should be stored as an int
      ints[i++] = data.id;
      floats[i++] = data.color;
      floats[i++] = data.labelWidth;
      floats[i++] = data.labelHeight;
      floats[i++] = data.textHeight;
      floats[i++] = data.positionMode;
      floats[i++] = data.labelAngle;
      floats[i++] = data.padding;
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_labelMargin, NodeLabelBackgroundProgram.labelMargin);
      gl.uniform1f(uniformLocations.u_zoomLabelSizeRatio, 1 / zoomToLabelSizeRatioFunction(params.zoomRatio));
      gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);
      gl.uniform1f(uniformLocations.u_pickingPadding, params.labelPickingPadding);
      gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      gl.uniform1i(uniformLocations.u_nodeFrameTexture, params.nodeFrameTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeFrameTextureWidth, params.nodeFrameTextureWidth);
    }

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

  return new NodeLabelBackgroundProgram(gl, pickingBuffer, renderer);
}

export interface LabelBackgroundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<string, N, E, G> {
  processLabelBackground(offset: number, data: LabelBackgroundData): void;
}
