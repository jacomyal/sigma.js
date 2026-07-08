import { getTextureSize } from "../../utils";

/**
 * First pass of the boundaries reduction: each fragment reads a 4x4 block of
 * the nodes position texture, and outputs the (xMin, xMax, yMin, yMax) of the
 * nodes it contains. Texels that don't map to an actual node are ignored,
 * using sentinel values that can never win a min/max.
 */
export function getBoundariesInitFragmentShader({ nodesCount }: { nodesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

#define NODES_COUNT ${Math.floor(nodesCount)}
#define SOURCE_SIZE ${Math.floor(getTextureSize(nodesCount))}
#define FLOAT_MAX 3.402823466e38

uniform sampler2D u_nodesPositionTexture;

layout(location = 0) out vec4 boundaries;

vec4 readNode(ivec2 coord) {
  if (coord.x >= SOURCE_SIZE || coord.y >= SOURCE_SIZE) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  int nodeIndex = coord.y * SOURCE_SIZE + coord.x;
  if (nodeIndex >= NODES_COUNT) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  vec4 nodePosition = texelFetch(u_nodesPositionTexture, coord, 0);
  return vec4(nodePosition.x, nodePosition.x, nodePosition.y, nodePosition.y);
}

void main() {
  ivec2 base = ivec2(gl_FragCoord.xy) * 4;

  vec4 result = vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);
  for (int dy = 0; dy < 4; dy++) {
    for (int dx = 0; dx < 4; dx++) {
      vec4 value = readNode(base + ivec2(dx, dy));
      result = vec4(
        min(result.x, value.x),
        max(result.y, value.y),
        min(result.z, value.z),
        max(result.w, value.w)
      );
    }
  }

  boundaries = result;
}`;

  return SHADER;
}
