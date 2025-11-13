import { OIT_GLSL } from "../../../utils/glsl";

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-circle fragment
precision highp float;

${OIT_GLSL}

in vec4 v_color;
in vec2 v_diffVector;
in float v_radius;
in float v_zIndex;

uniform float u_correctionRatio;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = length(v_diffVector) - v_radius + border;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > border)
    discard;
  fragColor = v_color;

  #else
  // Discard fragments completely outside the circle
  if (dist > border)
    discard;

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = v_color;
  if (dist > 0.0) {
    float t = dist / border;
    color.a *= (1.0 - t);
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
