precision mediump float;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

void main(void) {
  float feather = 1.3;
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

  float radius = v_thickness;

  float dist = length(v_normal) * radius;

  float t = smoothstep(
    radius - feather,
    radius,
    dist
  );

  gl_FragColor = mix(v_color, color0, t);
}
