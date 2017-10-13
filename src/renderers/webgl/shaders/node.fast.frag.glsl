precision mediump float;

varying vec4 color;
varying float border;

const float radius = 0.5;

void main(void) {
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = radius - length(m);

  float t = 0.0;
  if (dist > border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / border;

  gl_FragColor = mix(color0, color, t);
}
