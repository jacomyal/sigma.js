attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute float a_color;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float feather = 0.5;

void main() {

  float pow_ratio = 1.0 / pow(u_ratio, 0.5);
  float thickness = a_thickness / 2.0 * pow_ratio / u_scale;
  thickness += feather;

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 delta = (a_normal * thickness) / u_resolution;

  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  position += delta;

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_normal = a_normal;
  v_thickness = thickness;

  // Extract the color:
  float c = a_color;
  v_color.b = mod(c, 256.0); c = floor(c / 256.0);
  v_color.g = mod(c, 256.0); c = floor(c / 256.0);
  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;
  v_color.a = 1.0;
}
