/**
 * This fragment shader writes the node's framed-graph position into its
 * geometry texel. It runs with colorMask(R, G only), so the other channels
 * of the texel (size, shapeId) are preserved.
 */
export function getScatterFragmentShader() {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

in vec2 v_position;

layout(location = 0) out vec4 fragColor;

void main() {
  fragColor = vec4(v_position, 0.0, 0.0);
}`;

  return SHADER;
}
