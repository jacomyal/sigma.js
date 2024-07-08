// language=GLSL
const SHADER_SOURCE = /*glsl*/ `
precision highp float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;

uniform float u_correctionRatio;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = length(v_diffVector) - v_radius + border;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > border)
    gl_FragColor = transparent;
  else
    gl_FragColor = v_color;

  #else
  if (dist > border) {
    #ifdef HAS_DEPTH
    discard;
    #endif
  } else if (dist > 0.0) {
    gl_FragColor = mix(v_color, transparent, dist / border);
  } else {
    gl_FragColor = v_color;
  }
  #endif
}
`;

export default SHADER_SOURCE;
