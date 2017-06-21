precision mediump float;

varying vec4 color;
varying vec2 center;
varying float radius;

void main(void) {
  float border_size = 0.8;
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

  vec2 m = gl_FragCoord.xy - center;
  float dist = sqrt(m.x * m.x + m.y * m.y);
  float t = smoothstep(
    radius + border_size,
    radius - border_size,
    dist
  );

  // Here is how we draw a disc instead of a square:
  gl_FragColor = mix(color0, color, t);
}
