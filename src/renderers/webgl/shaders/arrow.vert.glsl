attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute float a_radius;
attribute vec4 a_color;
attribute vec3 a_barycentric;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform mat3 u_matrix;
uniform float u_scale;

varying vec4 v_color;
// varying vec3 v_barycentric;

const float arrow_ratio = 0.66;
const float bias = 255.0 / 254.0;

void main() {

  float da = a_barycentric.x;
  float db = a_barycentric.y;
  float dc = a_barycentric.z;

  float pow_ratio = 1.0 / pow(u_ratio, 0.5) * 2.0;
  float radius = (a_radius - 1.0) * pow_ratio;
  float thickness = a_thickness * pow_ratio / u_scale;
  float width = arrow_ratio * thickness / 2.0;

  vec2 delta = vec2(
      da * ((radius) * a_normal.y)
    + db * ((radius + thickness) * a_normal.y + width * a_normal.x)
    + dc * ((radius + thickness) * a_normal.y - width * a_normal.x),

      da * (-(radius) * a_normal.x)
    + db * (-(radius + thickness) * a_normal.x + width * a_normal.y)
    + dc * (-(radius + thickness) * a_normal.x - width * a_normal.y)
  );

  delta /= u_resolution;

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  position += delta;

  // Applying
  gl_Position = vec4(position, 0, 1);

  // v_barycentric = a_barycentric;

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
