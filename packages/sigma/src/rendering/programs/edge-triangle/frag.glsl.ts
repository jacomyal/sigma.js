import { OIT_GLSL } from "../../../utils/glsl";

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: edge-triangle fragment
precision mediump float;

${OIT_GLSL}

in vec4 v_color;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

void main(void) {
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= 0.99)
  if (v_color.a < 0.99) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < 0.99)
  if (v_color.a >= 0.99) {
    discard;
  }
  // Weighted Blended OIT
  fragColor = oitFragColor(v_color, v_zIndex);
  revealage = oitRevealage(v_color);
  #endif
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
