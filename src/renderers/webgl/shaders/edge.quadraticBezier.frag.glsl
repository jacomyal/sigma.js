precision mediump float;

varying vec4 v_color;
varying vec2 v_coord;

void main(void) {
  float d = (v_coord.s * v_coord.s) - v_coord.t;

  if (d < 0.0 && d > -0.01)
    gl_FragColor = v_color;
  else
    discard;
}
