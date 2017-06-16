attribute vec2 a_position;
attribute float a_size;
attribute float a_color;
attribute float a_angle;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform float u_scale;
uniform mat3 u_matrix;

varying vec4 color;
varying vec2 center;
varying float radius;

void main() {
  // Multiply the point size twice:
  radius = a_size * u_ratio;

  // Scale from [[-1 1] [-1 1]] to the container:
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  // center = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);
  center = position * u_scale;
  center = vec2(center.x, u_scale * u_resolution.y - center.y);

  position = position +
    2.0 * radius * vec2(cos(a_angle), sin(a_angle));
  position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);

  radius = radius * u_scale;

  gl_Position = vec4(position, 0, 1);

  // Extract the color:
  float c = a_color;
  color.b = mod(c, 256.0); c = floor(c / 256.0);
  color.g = mod(c, 256.0); c = floor(c / 256.0);
  color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;
  color.a = 1.0;
}
