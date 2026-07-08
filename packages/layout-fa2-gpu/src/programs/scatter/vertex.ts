import { numberToGLSLFloat } from "sigma/rendering";

import { getTextureSize } from "../../utils";

/**
 * This vertex shader is executed once per node (as a POINTS draw call). It
 * reads the node's position from the layout's positions texture (indexed by
 * gl_VertexID), converts it to sigma's framed-graph space, and lands the
 * point exactly on the node's geometry texel in sigma's node data texture.
 */
export function getScatterVertexShader({ nodesCount }: { nodesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(getTextureSize(nodesCount))}
#define TEXELS_PER_NODE ${numberToGLSLFloat(2)}

uniform sampler2D u_nodesPositionTexture;
// (dX, dY, ratio) of sigma's normalization function:
uniform vec3 u_normalization;
// Sigma's node data texture dimensions, in texels:
uniform vec2 u_targetSize;

// The node's item index in sigma's node data texture:
in float a_sigmaIndex;

out vec2 v_position;

void main() {
  int fa2Index = gl_VertexID;
  ivec2 texCoord = ivec2(fa2Index % NODES_TEXTURE_SIZE, fa2Index / NODES_TEXTURE_SIZE);
  vec2 graphPosition = texelFetch(u_nodesPositionTexture, texCoord, 0).xy;
  v_position = 0.5 + (graphPosition - u_normalization.xy) / u_normalization.z;

  if (a_sigmaIndex < 0.0) {
    // Node unknown to sigma: discard the point.
    gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  // Target the node's geometry texel (the first of its two texels):
  float texel = a_sigmaIndex * TEXELS_PER_NODE;
  float row = floor(texel / u_targetSize.x);
  float col = texel - row * u_targetSize.x;
  vec2 clipPosition = (vec2(col, row) + 0.5) / u_targetSize * 2.0 - 1.0;

  gl_Position = vec4(clipPosition, 0.0, 1.0);
  gl_PointSize = 1.0;
}`;

  return SHADER;
}
