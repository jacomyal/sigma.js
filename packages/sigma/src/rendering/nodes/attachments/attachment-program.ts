/**
 * Sigma.js Attachment WebGL Program
 * ==================================
 *
 * Simple instanced textured-quad program for rendering label attachment
 * images from an atlas texture. Each instance draws one attachment, positioned
 * relative to the SDF label for the corresponding node.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import type { RenderParams } from "../../../types";
import { GLSL_GET_LABEL_DIRECTION, GLSL_ROTATE_2D } from "../../glsl";
import { Program } from "../../program";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";

// Gap (in CSS pixels) between the label and the attachment.
// Shared between the GLSL shader and JS backdrop sizing logic.
export const ATTACHMENT_GAP = 2;

// WebGL texture unit reserved for the attachment atlas.
export const ATTACHMENT_TEXTURE_UNIT = 7;

const ATTACHMENT_UNIFORMS = [
  "u_matrix",
  "u_resolution",
  "u_labelPixelSnapping",
  "u_sizeRatio",
  "u_correctionRatio",
  "u_cameraAngle",
  "u_nodeDataTexture",
  "u_nodeDataTextureWidth",
  "u_atlasTexture",
] as const;

type AttachmentUniform = (typeof ATTACHMENT_UNIFORMS)[number];

// Attachment placement: 0=below, 1=above, 2=left, 3=right (relative to label)
// language=GLSL
const VERTEX_SHADER = /*glsl*/ `#version 300 es
precision highp float;

// Camera / viewport
uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;

// Data textures
uniform sampler2D u_nodeDataTexture;
uniform float u_nodeDataTextureWidth;

// Atlas (size is fixed at 2048×2048 — matches AttachmentManager.ATLAS_SIZE)
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // pixel dimensions of attachment image
in float a_positionMode;        // label position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_attachmentPlacement; // 0=below, 1=above, 2=left, 3=right (relative to label)
in float a_labelWidth;          // label width in pixels
in float a_labelHeight;         // label height in pixels
in float a_labelAngle;          // label rotation angle

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

${GLSL_GET_LABEL_DIRECTION}
${GLSL_ROTATE_2D}

void main() {
  // Read node data from texture
  float texIdx = a_nodeIndex - 1.0;
  float texWidth = u_nodeDataTextureWidth;
  float col = mod(texIdx, texWidth);
  float row = floor(texIdx / texWidth);
  vec4 nodeData = texelFetch(u_nodeDataTexture, ivec2(int(col), int(row)), 0);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Node position in NDC
  vec3 projected = u_matrix * vec3(nodePos, 1.0);
  vec2 posNDC = projected.xy;

  // Node radius in pixels (matches label program logic)
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

  // Approximate edge distance (circle assumption):
  float edgeDist = nodeRadiusPixels;
  float margin = 4.0;

  // Label direction in screen space (Y-down)
  vec2 labelDir = getLabelDirection(a_positionMode);

  // -----------------------------------------------------------------------
  // Step 1: Compute the label bounding box top-left corner (in screen pixels
  // from node center), matching the label program's alignment logic.
  // -----------------------------------------------------------------------
  float offsetDist = edgeDist + margin;
  vec2 posOffset = labelDir * offsetDist; // offset from node center to label anchor

  // Label top-left corner relative to node center (screen pixels, Y-down)
  vec2 labelTopLeft;
  if (a_positionMode < 0.5) {
    // Right: label left edge at posOffset.x, vertically centered
    labelTopLeft = vec2(posOffset.x, -a_labelHeight / 2.0);
  } else if (a_positionMode < 1.5) {
    // Left: label right edge at posOffset.x (label extends left)
    labelTopLeft = vec2(posOffset.x - a_labelWidth, -a_labelHeight / 2.0);
  } else if (a_positionMode < 2.5) {
    // Above: horizontally centered, bottom edge at posOffset.y
    labelTopLeft = vec2(-a_labelWidth / 2.0, posOffset.y - a_labelHeight);
  } else if (a_positionMode < 3.5) {
    // Below: horizontally centered, top edge at posOffset.y
    labelTopLeft = vec2(-a_labelWidth / 2.0, posOffset.y);
  } else {
    // Over: centered on node
    labelTopLeft = vec2(-a_labelWidth / 2.0, -a_labelHeight / 2.0);
  }

  // Label center
  vec2 labelCenter = labelTopLeft + vec2(a_labelWidth, a_labelHeight) / 2.0;

  // -----------------------------------------------------------------------
  // Step 2: Compute the attachment center relative to the label center,
  // based on the attachment placement direction.
  // -----------------------------------------------------------------------
  float gap = ${ATTACHMENT_GAP.toFixed(1)};
  vec2 attachCenter;

  if (a_attachmentPlacement < 0.5) {
    // Below: left-align with label
    attachCenter = vec2(
      labelTopLeft.x + a_attachmentSize.x / 2.0,
      labelCenter.y + a_labelHeight / 2.0 + gap + a_attachmentSize.y / 2.0
    );
  } else if (a_attachmentPlacement < 1.5) {
    // Above: left-align with label
    attachCenter = vec2(
      labelTopLeft.x + a_attachmentSize.x / 2.0,
      labelCenter.y - (a_labelHeight / 2.0 + gap + a_attachmentSize.y / 2.0)
    );
  } else if (a_attachmentPlacement < 2.5) {
    // Left: top-align with label
    attachCenter = vec2(
      labelCenter.x - (a_labelWidth / 2.0 + gap + a_attachmentSize.x / 2.0),
      labelTopLeft.y + a_attachmentSize.y / 2.0
    );
  } else {
    // Right: top-align with label
    attachCenter = vec2(
      labelCenter.x + (a_labelWidth / 2.0 + gap + a_attachmentSize.x / 2.0),
      labelTopLeft.y + a_attachmentSize.y / 2.0
    );
  }

  // -----------------------------------------------------------------------
  // Step 3: Apply label angle rotation and compute final position.
  // -----------------------------------------------------------------------
  mat2 rotMat = rotate2D(a_labelAngle);

  vec2 rotatedCenter = rotMat * attachCenter;
  vec2 halfSize = a_attachmentSize / 2.0;
  vec2 cornerOffset = rotMat * (a_quadCorner * halfSize);

  // Work in screen pixels (Y-down) so we can snap to the pixel grid.
  // NDC → screen: screenX = (ndc+1)*res/2, screenY = (1-ndc)*res/2
  vec2 nodeScreen = vec2(
    (posNDC.x + 1.0) * u_resolution.x * 0.5,
    (1.0 - posNDC.y) * u_resolution.y * 0.5
  );

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left corner to integer pixel boundaries so atlas
  // texels map 1:1 to device pixels (prevents LINEAR filtering blur).
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - halfSize;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + halfSize;

  vec2 vertexScreen = centerScreen + cornerOffset;

  // Screen → NDC
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  // Texture coordinates: map from atlas rect
  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`;

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

// Attachment placement map: "below"=0, "above"=1, "left"=2, "right"=3
export const ATTACHMENT_PLACEMENT_MAP: Record<string, number> = {
  below: 0,
  above: 1,
  left: 2,
  right: 3,
};

export class AttachmentProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<AttachmentUniform, N, E, G> {
  private totalCount = 0;
  private bufferCapacity = 0;

  getDefinition(): InstancedProgramDefinition<AttachmentUniform> {
    return {
      VERTICES: 4,
      VERTEX_SHADER_SOURCE: VERTEX_SHADER,
      FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER,
      UNIFORMS: ATTACHMENT_UNIFORMS,
      METHOD: WebGL2RenderingContext.TRIANGLE_STRIP,
      ATTRIBUTES: [
        { name: "a_nodeIndex", size: 1, type: WebGL2RenderingContext.FLOAT },
        { name: "a_atlasRect", size: 4, type: WebGL2RenderingContext.FLOAT },
        { name: "a_attachmentSize", size: 2, type: WebGL2RenderingContext.FLOAT },
        { name: "a_positionMode", size: 1, type: WebGL2RenderingContext.FLOAT },
        { name: "a_attachmentPlacement", size: 1, type: WebGL2RenderingContext.FLOAT },
        { name: "a_labelWidth", size: 1, type: WebGL2RenderingContext.FLOAT },
        { name: "a_labelHeight", size: 1, type: WebGL2RenderingContext.FLOAT },
        { name: "a_labelAngle", size: 1, type: WebGL2RenderingContext.FLOAT },
      ],
      CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: WebGL2RenderingContext.FLOAT }],
      CONSTANT_DATA: [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ],
    };
  }

  setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
    gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);
    gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);
    gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
    gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
    gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
    gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
    gl.uniform1f(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
    gl.uniform1i(uniformLocations.u_atlasTexture, ATTACHMENT_TEXTURE_UNIT);
  }

  /**
   * Writes attachment data for one instance.
   */
  processAttachment(
    offset: number,
    data: {
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
      labelAngle: number;
    },
  ): void {
    const { floats } = this;
    const stride = this.ATTRIBUTES_ITEMS_COUNT;
    const i = offset * stride;
    floats[i + 0] = data.nodeIndex;
    floats[i + 1] = data.atlasX;
    floats[i + 2] = data.atlasY;
    floats[i + 3] = data.atlasW;
    floats[i + 4] = data.atlasH;
    floats[i + 5] = data.attachWidth;
    floats[i + 6] = data.attachHeight;
    floats[i + 7] = data.positionMode;
    floats[i + 8] = data.attachmentPlacement;
    floats[i + 9] = data.labelWidth;
    floats[i + 10] = data.labelHeight;
    floats[i + 11] = data.labelAngle;
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
