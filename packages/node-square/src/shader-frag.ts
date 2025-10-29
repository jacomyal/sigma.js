// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-square fragment
precision mediump float;

in vec4 v_color;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

void main(void) {
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  // Weighted Blended OIT
  float weight = v_color.a * clamp(0.03 / (1e-5 + pow(v_zIndex / 200.0, 4.0)), 1e-2, 3e3);

  fragColor = vec4(v_color.rgb * v_color.a, v_color.a) * weight;
  revealage = v_color.a;
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
