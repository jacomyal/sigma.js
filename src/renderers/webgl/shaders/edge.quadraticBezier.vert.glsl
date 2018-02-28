attribute vec2 a_position;
// attribute float a_thickness;
attribute float a_color;
attribute vec2 a_coord;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
varying vec2 v_coord;

void main() {

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_coord = a_coord;

  // Extract the color:
  float c = a_color;
  v_color.b = mod(c, 256.0); c = floor(c / 256.0);
  v_color.g = mod(c, 256.0); c = floor(c / 256.0);
  v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;
  v_color.a = 1.0;
}
