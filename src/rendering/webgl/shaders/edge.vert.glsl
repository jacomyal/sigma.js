attribute vec2 a_position;
attribute vec2 a_normal;
attribute vec4 a_color;

uniform float u_zoom;
uniform float u_ratio;
uniform mat3 u_matrix;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float minThickness = 1.0;
const float antialiasingMargin = 1.1;
const float bias = 255.0 / 254.0;

void main() {
  vec2 normal = a_normal;
  float normalLength = length(normal);
  float thickness = max(normalLength, minThickness * u_zoom);
  normal = normal / normalLength * thickness * antialiasingMargin;

  vec2 position = (u_matrix * vec3(a_position + normal * u_ratio, 1)).xy;

  gl_Position = vec4(position, 0, 1);

  v_normal = normal;
  v_thickness = thickness;

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
