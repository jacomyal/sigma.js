/**
 * Sigma.js Attachment WebGL Program
 * ==================================
 *
 * Draws label attachments that sit below a node's label. One instanced quad
 * per attachment, sampled from the atlas.
 *
 * The one rule to check: an attachment is placed against the **label box**,
 * not the node. It hangs off one edge of the box, a fixed `ATTACHMENT_GAP`
 * away, and rotates with it, so it follows the label across shapes and
 * positions while its own offset stays shape-independent. The exact edge it
 * hangs from is in the code.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import type Sigma from "../../../sigma";
import type { RenderParams } from "../../../types";
import {
  DEFAULT_LABEL_MARGIN,
  GLSL_LABEL_BOX_CENTER,
  GLSL_READ_NODE_DATA,
  GLSL_READ_NODE_FRAME,
  GLSL_ROTATE_2D,
} from "../../glsl";
import { Program } from "../../program";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { LabelOptions } from "../types";

// Gap (in CSS pixels) between the label box and the attachment.
// Shared between the GLSL shader and JS backdrop sizing logic.
export const ATTACHMENT_GAP = 2;

// WebGL texture unit reserved for the attachment atlas.
export const ATTACHMENT_TEXTURE_UNIT = 7;

export const ATTACHMENT_PLACEMENT_MAP: Record<string, number> = {
  below: 0,
  above: 1,
  left: 2,
  right: 3,
};

// ============================================================================
// GLSL generation
// ============================================================================

function generateVertexShader(): string {
  // language=GLSL
  const shader = /*glsl*/ `#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048×2048 — matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FRAME}
${GLSL_LABEL_BOX_CENTER}
${GLSL_ROTATE_2D}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readNodeFrame(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx);

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = ${ATTACHMENT_GAP.toFixed(1)} * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  mat2 labelRotMat = rotate2D(a_labelAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size — never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`;
  return shader;
}

// language=GLSL
const FRAGMENT_SHADER = /*glsl*/ `#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;

// ============================================================================
// Data type
// ============================================================================

export interface AttachmentData {
  nodeIndex: number;
  atlasX: number;
  atlasY: number;
  atlasW: number;
  atlasH: number;
  attachWidth: number;
  attachHeight: number;
  positionMode: number;
  attachmentPlacement: number;
  labelWidth: number;
  labelHeight: number;
  textHeight: number;
  labelAngle: number;
}

// ============================================================================
// Factory
// ============================================================================

export interface CreateAttachmentProgramOptions {
  label?: LabelOptions;
}

export function createAttachmentProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  options: CreateAttachmentProgramOptions,
): AttachmentProgram<N, E, G> {
  const { label: labelOptions = {} } = options;

  const labelMargin = labelOptions.margin ?? DEFAULT_LABEL_MARGIN;
  const zoomToLabelSizeRatioFunction = labelOptions.zoomToLabelSizeRatioFunction ?? (() => 1);
  const vertexShader = generateVertexShader();
  const fragmentShader = FRAGMENT_SHADER;

  type U = string;

  class NodeAttachmentProgram extends Program<U, N, E, G> {
    static readonly labelMargin = labelMargin;

    private totalCount = 0;
    private bufferCapacity = 0;

    getDefinition(): InstancedProgramDefinition<U> {
      const { FLOAT, TRIANGLE_STRIP } = WebGL2RenderingContext;
      return {
        VERTICES: 4,
        VERTEX_SHADER_SOURCE: vertexShader,
        FRAGMENT_SHADER_SOURCE: fragmentShader,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: [
          "u_matrix",
          "u_resolution",
          "u_labelPixelSnapping",
          "u_sizeRatio",
          "u_correctionRatio",
          "u_pixelRatio",
          "u_labelMargin",
          "u_zoomLabelSizeRatio",
          "u_nodeDataTexture",
          "u_nodeDataTextureWidth",
          "u_nodeFrameTexture",
          "u_nodeFrameTextureWidth",
          "u_atlasTexture",
        ] as U[],
        ATTRIBUTES: [
          { name: "a_nodeIndex", size: 1, type: FLOAT },
          { name: "a_atlasRect", size: 4, type: FLOAT },
          { name: "a_attachmentSize", size: 2, type: FLOAT },
          { name: "a_positionMode", size: 1, type: FLOAT },
          { name: "a_attachmentPlacement", size: 1, type: FLOAT },
          { name: "a_labelWidth", size: 1, type: FLOAT },
          { name: "a_labelHeight", size: 1, type: FLOAT },
          { name: "a_textHeight", size: 1, type: FLOAT },
          { name: "a_labelAngle", size: 1, type: FLOAT },
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

    processAttachment(offset: number, data: AttachmentData): void {
      const { floats } = this;
      let i = offset * this.STRIDE;
      floats[i++] = data.nodeIndex;
      floats[i++] = data.atlasX;
      floats[i++] = data.atlasY;
      floats[i++] = data.atlasW;
      floats[i++] = data.atlasH;
      floats[i++] = data.attachWidth;
      floats[i++] = data.attachHeight;
      floats[i++] = data.positionMode;
      floats[i++] = data.attachmentPlacement;
      floats[i++] = data.labelWidth;
      floats[i++] = data.labelHeight;
      floats[i++] = data.textHeight;
      floats[i++] = data.labelAngle;
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);
      gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_labelMargin, NodeAttachmentProgram.labelMargin);
      gl.uniform1f(uniformLocations.u_zoomLabelSizeRatio, 1 / zoomToLabelSizeRatioFunction(params.zoomRatio));
      gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      gl.uniform1i(uniformLocations.u_nodeFrameTexture, params.nodeFrameTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeFrameTextureWidth, params.nodeFrameTextureWidth);
      gl.uniform1i(uniformLocations.u_atlasTexture, ATTACHMENT_TEXTURE_UNIT);
    }

    reallocateAttachments(count: number): void {
      this.totalCount = count;
      if (count > this.bufferCapacity) {
        this.bufferCapacity = Math.max(count, Math.ceil(this.bufferCapacity * 1.5) || 10);
        super.reallocate(this.bufferCapacity);
      }
    }

    hasNothingToRender(): boolean {
      return this.totalCount === 0;
    }

    drawWebGL(method: number, { gl }: ProgramInfo): void {
      if (this.totalCount === 0) return;
      gl.drawArraysInstanced(method, 0, this.VERTICES, this.totalCount);
    }
  }

  return new NodeAttachmentProgram(gl, pickingBuffer, renderer);
}

export interface AttachmentProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<string, N, E, G> {
  processAttachment(offset: number, data: AttachmentData): void;
  reallocateAttachments(count: number): void;
}
