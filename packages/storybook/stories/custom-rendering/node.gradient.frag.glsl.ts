// language=GLSL
const SHADER_SOURCE = /*glsl*/ `
precision mediump float;

varying vec4 v_color;
varying float v_border;

const float radius = 0.5;
const float halfRadius = 0.35;

void main(void) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  float distToCenter = length(gl_PointCoord - vec2(0.5, 0.5));

  #ifdef PICKING_MODE
  if (distToCenter < radius)
    gl_FragColor = v_color;
  else
    gl_FragColor = transparent;
  #else
  // For normal mode, we use the color:
  if (distToCenter > radius)
    gl_FragColor = transparent;
  else if (distToCenter > radius - v_border)
    gl_FragColor = mix(transparent, v_color, (radius - distToCenter) / v_border);
  else
    gl_FragColor = mix(v_color, white, (radius - distToCenter) / radius);
  #endif
}
`;

export default SHADER_SOURCE;
