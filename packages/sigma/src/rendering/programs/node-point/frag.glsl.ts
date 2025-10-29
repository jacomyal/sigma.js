// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-point fragment
precision mediump float;

in vec4 v_color;
in float v_border;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const float radius = 0.5;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = radius - length(m);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist <= v_border)
    discard;
  fragColor = v_color;

  #else
  // Discard fragments completely outside the circle
  if (dist <= 0.0)
    discard;

  float t = 0.0;
  if (dist > v_border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / v_border;

  vec4 color = mix(transparent, v_color, t);

  // Weighted Blended OIT
  float weight = color.a * clamp(0.03 / (1e-5 + pow(gl_FragDepth / 200.0, 4.0)), 1e-2, 3e3);

  fragColor = vec4(color.rgb * color.a, color.a) * weight;
  revealage = color.a;
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
