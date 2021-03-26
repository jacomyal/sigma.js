precision mediump float;

varying vec4 v_color;
varying vec2 v_coord;
varying float v_dist;

void main(void) {
  float d = (v_coord.s * v_coord.s) - v_coord.t;

  if (d > 0.0 && d < 10.0 * v_dist)
    gl_FragColor = v_color;
  else
    discard;
}
