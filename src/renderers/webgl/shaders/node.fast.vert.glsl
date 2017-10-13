attribute vec2 a_position;
attribute float a_size;
attribute float a_color;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform float u_scale;
uniform mat3 u_matrix;

varying vec4 color;
varying float border;

void main() {

  gl_Position = vec4(
    ((u_matrix * vec3(a_position, 1)).xy /
      u_resolution * 2.0 - 1.0) * vec2(1, -1),
    0,
    1
  );

  // Multiply the point size twice:
  //  - x SCALING_RATIO to correct the canvas scaling
  //  - x 2 to correct the formulae
  gl_PointSize = a_size * u_ratio * u_scale * 2.0;

  border = (1.0 / u_ratio) * (0.5 / a_size);

  // Extract the color:
  float c = a_color;
  color.b = mod(c, 256.0); c = floor(c / 256.0);
  color.g = mod(c, 256.0); c = floor(c / 256.0);
  color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;
  color.a = 1.0;
}
