attribute vec4 a_color;
attribute float a_direction;
attribute float a_thickness;
attribute vec2 a_position;
attribute vec2 a_opposite;

uniform mat3 u_matrix;
uniform float u_zoomRatio;
uniform vec2 u_dimensions;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float bias = 255.0 / 254.0;
const float minThickness = 0.5;
const float feather = 0.7;

vec2 clipspaceToViewport(vec2 pos, vec2 dimensions) {
  return vec2(
    (pos.x + 1.0) * dimensions.x / 2.0,
    (pos.y + 1.0) * dimensions.y / 2.0
  );
}

vec2 viewportToClipspace(vec2 pos, vec2 dimensions) {
  return vec2(
    pos.x / dimensions.x * 2.0 - 1.0,
    pos.y / dimensions.y * 2.0 - 1.0
  );
}

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  vec2 opposite = (u_matrix * vec3(a_opposite, 1)).xy;

  vec2 viewportPosition = clipspaceToViewport(position, u_dimensions);
  vec2 viewportOpposite = clipspaceToViewport(opposite, u_dimensions);

  vec2 delta = viewportOpposite.xy - viewportPosition.xy;
  vec2 normal = vec2(-delta.y, delta.x) * a_direction;
  vec2 unitNormal = normalize(normal);

  float thickness = max(minThickness, a_thickness / u_zoomRatio) / 2.0;

  v_normal = unitNormal;
  v_thickness = thickness + feather;

  vec2 viewportOffsetPosition = viewportPosition + unitNormal * v_thickness;

  position = viewportToClipspace(viewportOffsetPosition, u_dimensions);
  gl_Position = vec4(position, 0, 1);

  v_color = a_color;
  v_color.a *= bias;
}
