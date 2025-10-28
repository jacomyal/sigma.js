// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision highp float;

in vec4 v_color;
in vec2 v_diffVector;
in float v_radius;

uniform float u_correctionRatio;

out vec4 fragColor;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = length(v_diffVector) - v_radius + border;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > border)
    fragColor = transparent;
  else
    fragColor = v_color;

  #else
  float t = 0.0;
  if (dist > border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / border;

  fragColor = mix(v_color, transparent, t);
  #endif
}
`;

export default SHADER_SOURCE;
