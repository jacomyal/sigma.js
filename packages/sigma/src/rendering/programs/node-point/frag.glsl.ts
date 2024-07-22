// language=GLSL
const SHADER_SOURCE = /*glsl*/ `
precision mediump float;

varying vec4 v_color;
varying float v_border;

const float radius = 0.5;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = radius - length(m);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_border)
    gl_FragColor = v_color;
  else
    gl_FragColor = transparent;

  #else
  if (dist > v_border) {
    gl_FragColor = v_color;
  } else if (dist > 0.0) {
    gl_FragColor = mix(transparent, v_color, dist / v_border);
  } else {
    #ifdef HAS_DEPTH
    discard;
    #endif
  }
  #endif
}
`;

export default SHADER_SOURCE;
