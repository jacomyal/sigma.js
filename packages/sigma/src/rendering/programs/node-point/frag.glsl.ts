// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision mediump float;

in vec4 v_color;
in float v_border;

out vec4 fragColor;

const float radius = 0.5;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = radius - length(m);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_border)
    fragColor = v_color;
  else
    fragColor = transparent;

  #else
  float t = 0.0;
  if (dist > v_border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / v_border;

  fragColor = mix(transparent, v_color, t);
  #endif
}
`;

export default SHADER_SOURCE;
