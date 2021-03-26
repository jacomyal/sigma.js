attribute vec2 a_position;
attribute float a_color;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

varying vec4 color;

void main() {
  // Scale from [[-1 1] [-1 1]] to the container:
  gl_Position = vec4(
    ((u_matrix * vec3(a_position, 1)).xy /
      u_resolution * 2.0 - 1.0) * vec2(1, -1),
    0,
    1
  );

  // Extract the color:
  float c = a_color;
  color.b = mod(c, 256.0); c = floor(c / 256.0);
  color.g = mod(c, 256.0); c = floor(c / 256.0);
  color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;
  color.a = 1.0;
}
