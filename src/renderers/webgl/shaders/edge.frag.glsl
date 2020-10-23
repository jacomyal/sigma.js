precision mediump float;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float feather = 0.001;
const vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_normal) * v_thickness;

  float t = smoothstep(
    v_thickness - feather,
    v_thickness,
    dist
  );

  gl_FragColor = mix(v_color, color0, t);
}
