precision mediump float;

varying vec4 color;
varying vec2 center;
varying float radius;

const vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
const float border_size = 0.8;

void main(void) {
  float dist = length(gl_FragCoord.xy - center);

  float t = smoothstep(
    radius + border_size,
    radius - border_size,
    dist
  );

  // Here is how we draw a disc instead of a square:
  gl_FragColor = mix(color0, color, t);
}
