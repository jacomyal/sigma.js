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

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

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

  float t = 0.0;
  if (dist > 0.0)
    t = dist / border;

  vec4 color = mix(v_color, transparent, t);

  // Weighted Blended OIT
  fragColor = oitFragColor(color, v_zIndex);
  revealage = oitRevealage(color);
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
