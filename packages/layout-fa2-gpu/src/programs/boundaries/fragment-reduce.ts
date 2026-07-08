/**
 * Subsequent passes of the boundaries reduction: each fragment merges a 4x4
 * block of (xMin, xMax, yMin, yMax) values from the previous pass. Texels
 * outside the previous pass's output are ignored, using sentinel values that
 * can never win a min/max.
 */
export function getBoundariesReduceFragmentShader() {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

#define FLOAT_MAX 3.402823466e38

uniform sampler2D u_inputTexture;
uniform int u_inputSize;

layout(location = 0) out vec4 boundaries;

vec4 readCell(ivec2 coord) {
  if (coord.x >= u_inputSize || coord.y >= u_inputSize) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  return texelFetch(u_inputTexture, coord, 0);
}

void main() {
  ivec2 base = ivec2(gl_FragCoord.xy) * 4;

  vec4 result = vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);
  for (int dy = 0; dy < 4; dy++) {
    for (int dx = 0; dx < 4; dx++) {
      vec4 value = readCell(base + ivec2(dx, dy));
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
