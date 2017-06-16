precision mediump float;

varying vec4 color;
varying vec2 center;
varying float radius;

void main(void) {
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

  vec2 m = gl_FragCoord.xy - center;
  float diff = radius - sqrt(m.x * m.x + m.y * m.y);

  // Here is how we draw a disc instead of a square:
  if (diff > 0.0)
    gl_FragColor = color;
  else
    gl_FragColor = color0;
}
