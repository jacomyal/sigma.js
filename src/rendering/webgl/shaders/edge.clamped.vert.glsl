attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute vec4 a_color;
attribute float a_radius;

uniform mat3 u_matrix;
uniform float u_scale;
uniform float u_cameraRatio;
uniform float u_viewportRatio;
uniform float u_thicknessRatio;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float arrowHeadLengthThicknessRatio = 2.5;
const float minThickness = 0.8;
const float bias = 255.0 / 254.0;

void main() {

  // Computing thickness in screen space:
  float thickness = a_thickness * u_thicknessRatio * u_scale * u_viewportRatio / 2.0;
  thickness = max(thickness, minThickness * u_viewportRatio);

  float direction = sign(a_radius);
  float nodeRadius = direction * a_radius * u_thicknessRatio * u_viewportRatio;
  float arrowHeadLength = thickness * 2.0 * arrowHeadLengthThicknessRatio;

  vec2 arrowHeadVector = vec2(-direction * a_normal.y, direction * a_normal.x);

  // Add normal vector to the position in screen space, but correct thickness first:
  vec2 position = a_position + a_normal * thickness * u_cameraRatio;
  // Add vector that corrects the arrow head length:
  position = position + arrowHeadVector * (arrowHeadLength + nodeRadius) * u_cameraRatio;
  // Apply camera
  position = (u_matrix * vec3(position, 1)).xy;

  gl_Position = vec4(position, 0, 1);

  v_normal = a_normal;
  v_thickness = thickness;

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
