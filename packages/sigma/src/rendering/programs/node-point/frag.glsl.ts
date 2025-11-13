import { OIT_GLSL } from "../../../utils/glsl";

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-point fragment
precision mediump float;

${OIT_GLSL}

in vec4 v_color;
in float v_border;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const float radius = 0.5;

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

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = v_color;
  if (dist <= v_border) {
    float t = dist / v_border;
    color.a *= t;
  }

  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= 0.99)
  if (color.a < 0.99) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  fragColor = vec4(color.rgb * color.a, color.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < 0.99)
  if (color.a >= 0.99) {
    discard;
  }
  // Weighted Blended OIT
  fragColor = oitFragColor(color, v_zIndex);
  revealage = oitRevealage(color);
  #endif
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
