precision mediump float;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

void main(void) {
  float feather = 0.8;
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

  float radius = (v_thickness / 2.0);

  float dist = length(v_normal) * radius;

  float t = smoothstep(
    radius + feather,
    radius - feather,
    dist
  );

  gl_FragColor = mix(color0, v_color, t);
}
