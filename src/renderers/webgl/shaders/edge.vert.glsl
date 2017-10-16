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

  v_thickness = a_thickness * u_ratio / 2.0 + feather;

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 delta = vec2(a_normal * v_thickness);
  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;
  position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_normal = a_normal + vec2(sign(a_normal.x) * feather, sign(a_normal.y) * feather);
  // v_thickness = max(1.0, length(delta) / u_scale);
  v_thickness = max(0.5, v_thickness / u_scale);

  // Extract the color:
  float c = a_color;
  v_color.b = mod(c, 256.0); c = floor(c / 256.0);
  v_color.g = mod(c, 256.0); c = floor(c / 256.0);
  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;
  v_color.a = 1.0;
}
