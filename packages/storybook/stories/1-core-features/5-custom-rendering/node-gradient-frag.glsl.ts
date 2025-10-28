// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision mediump float;

in vec4 v_color;
in float v_border;

out vec4 fragColor;

const float radius = 0.5;
const float halfRadius = 0.35;

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  float distToCenter = length(gl_PointCoord - vec2(0.5, 0.5));

  #ifdef PICKING_MODE
  if (distToCenter < radius)
    fragColor = v_color;
  else
    fragColor = transparent;
  #else
  // For normal mode, we use the color:
  if (distToCenter > radius)
    fragColor = transparent;
  else if (distToCenter > radius - v_border)
    fragColor = mix(transparent, v_color, (radius - distToCenter) / v_border);
  else
    fragColor = mix(v_color, white, (radius - distToCenter) / radius);
  #endif
}
`;

export default SHADER_SOURCE;
