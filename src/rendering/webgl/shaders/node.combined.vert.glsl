attribute vec2 a_position;
attribute float a_size;
attribute vec4 a_color;
attribute vec4 a_texture;
attribute float a_angle;

uniform float u_ratio;
uniform float u_scale;
uniform mat3 u_matrix;
uniform float u_sqrtZoomRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying float v_border;
varying vec4 v_texture;
varying vec2 v_diffVector;
varying float v_radius;

const float bias = 255.0 / 254.0;
const float marginRatio = 1.2; // 1.05

void main() {
  //float size = a_size * u_correctionRatio * u_sqrtZoomRatio * 4.0;
  float size = a_size * u_correctionRatio * u_ratio * 4.0;
  // workaround to keep u_scale
  v_radius = u_scale;

  //size = a_size * u_correctionRatio * u_scale * 2.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector * marginRatio;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_border = u_sqrtZoomRatio * u_sqrtZoomRatio / a_size / 50.0;
  v_diffVector = diffVector;
  v_radius = size / 2.0 / marginRatio;

  v_color = a_color;
  v_color.a *= bias;
  v_texture = a_texture;
}