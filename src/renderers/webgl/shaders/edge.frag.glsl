precision mediump float;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

// Note: twice the one defined in the vertex shader
const float feather = 1.0;
const vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_normal) * v_thickness;

  float t = smoothstep(
    v_thickness - feather,
    v_thickness + feather / 1.5,
    dist
  );

  gl_FragColor = mix(v_color, color0, t);
}
