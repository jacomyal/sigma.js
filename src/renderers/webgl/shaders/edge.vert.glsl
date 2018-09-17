attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute vec4 a_color;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float min_thickness = 1.8;
const float bias = 255.0 / 254.0;

void main() {

  // Computing thickness in pixels
  float pow_ratio = 1.0 / pow(u_ratio, 0.5);
  float thickness = a_thickness * pow_ratio / u_scale;

  // Min thickness for AA
  thickness = max(min_thickness, thickness);

  // Computing delta relative to viewport
  vec2 delta = (a_normal * thickness) / u_resolution;

  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  position += delta;

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_normal = a_normal;
  v_thickness = thickness;

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
