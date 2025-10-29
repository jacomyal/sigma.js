// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-gradient fragment
precision mediump float;

in vec4 v_color;
in float v_border;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const float radius = 0.5;
const float halfRadius = 0.35;

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  float distToCenter = length(gl_PointCoord - vec2(0.5, 0.5));

  #ifdef PICKING_MODE
  if (distToCenter >= radius)
    discard;
  fragColor = v_color;
  #else
  // For normal mode, we use the color:
  // Discard fragments completely outside the circle
  if (distToCenter > radius)
    discard;
  else if (distToCenter > radius - v_border)
    fragColor = mix(transparent, v_color, (radius - distToCenter) / v_border);
  else
    fragColor = mix(v_color, white, (radius - distToCenter) / radius);

  // Weighted Blended OIT
  float weight = fragColor.a * clamp(0.03 / (1e-5 + pow(v_zIndex / 200.0, 4.0)), 1e-2, 3e3);

  vec4 color = fragColor;
  fragColor = vec4(color.rgb * color.a, color.a) * weight;
  revealage = color.a;
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
