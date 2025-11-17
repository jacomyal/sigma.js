import { OIT_GLSL } from "../../../utils/glsl";

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: edge-rectangle fragment
precision mediump float;

${OIT_GLSL}

in vec4 v_color;
in vec2 v_normal;
in float v_thickness;
in float v_feather;
in float v_zIndex;

uniform float u_opaqueThreshold;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

void main(void) {
  // We only handle antialiasing for normal mode:
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  float dist = length(v_normal) * v_thickness;

  // Discard fragments completely outside the edge
  if (dist >= v_thickness) {
    discard;
  }

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = v_color;
  float t = smoothstep(
    v_thickness - v_feather,
    v_thickness,
    dist
  );
  color.a *= (1.0 - t);

  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= threshold)
  if (color.a < u_opaqueThreshold) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  fragColor = vec4(color.rgb * color.a, color.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < threshold)
  if (color.a >= u_opaqueThreshold) {
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
