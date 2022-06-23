attribute vec2 a_position;
attribute float a_size;
attribute vec4 a_color;

uniform float u_ratio;
uniform float u_scale;
uniform mat3 u_matrix;

varying vec4 v_color;
varying float v_border;

const float bias = 255.0 / 254.0;

void main() {
  gl_Position = vec4(
    (u_matrix * vec3(a_position, 1)).xy,
    0,
    1
  );

  // Multiply the point size twice:
  //  - x SCALING_RATIO to correct the canvas scaling
  //  - x 2 to correct the formulae
  gl_PointSize = a_size * u_ratio * u_scale * 2.0;

  v_border = (1.0 / u_ratio) * (0.5 / a_size);

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
