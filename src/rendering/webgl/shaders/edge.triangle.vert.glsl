attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute float a_color;
attribute vec3 a_barycentric;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
varying vec3 v_barycentric;

const float feather = 0.0;

void main() {

  // Scale from [[-1 1] [-1 1]] to the container:
  float size = a_thickness * u_ratio + feather;
  vec2 delta = vec2(a_normal * size);
  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;
  position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_barycentric = a_barycentric;

  // Extract the color:
  float c = a_color;
  v_color.b = mod(c, 256.0); c = floor(c / 256.0);
  v_color.g = mod(c, 256.0); c = floor(c / 256.0);
  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;
  v_color.a = 1.0;
}
