attribute vec2 a_position;
// attribute float a_thickness;
attribute vec4 a_color;
attribute vec2 a_coord;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
varying vec2 v_coord;
varying float v_dist;

const float bias = 255.0 / 254.0;

void main() {

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // Applying
  gl_Position = vec4(position, 0, 1);

  v_coord = a_coord;

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;

  v_dist = length(position) / u_resolution.x;
}
