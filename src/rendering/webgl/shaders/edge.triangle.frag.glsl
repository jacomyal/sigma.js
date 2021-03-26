precision mediump float;

varying vec4 v_color;
varying vec3 v_barycentric;

void main(void) {
  // if (any(lessThan(v_barycentric, vec3(0.01))))
  //   discard;
  // else
    gl_FragColor = v_color;
}
