attribute vec2 a_position;
attribute vec2 a_normal;
attribute float a_thickness;
attribute float a_radius;
attribute vec4 a_color;
attribute vec3 a_barycentric;

uniform mat3 u_matrix;
uniform float u_scale;
uniform float u_cameraRatio;
uniform float u_viewportRatio;
uniform float u_thicknessRatio;

varying vec4 v_color;

const float arrowHeadLengthThicknessRatio = 2.5;
const float arrowHeadWidthLengthRatio = 0.66;
const float minThickness = 0.8;
const float bias = 255.0 / 254.0;

void main() {

  // Computing thickness in screen space:
  float thickness = a_thickness * u_thicknessRatio * u_scale * u_viewportRatio / 2.0;
  thickness = max(thickness, minThickness * u_viewportRatio);

  float nodeRadius = a_radius * u_thicknessRatio * u_viewportRatio * u_cameraRatio;
  float arrowHeadLength = thickness * 2.0 * arrowHeadLengthThicknessRatio * u_cameraRatio;
  float arrowHeadHalfWidth = arrowHeadWidthLengthRatio * arrowHeadLength / 2.0;

  float da = a_barycentric.x;
  float db = a_barycentric.y;
  float dc = a_barycentric.z;

  vec2 delta = vec2(
      da * ((nodeRadius) * a_normal.y)
    + db * ((nodeRadius + arrowHeadLength) * a_normal.y + arrowHeadHalfWidth * a_normal.x)
    + dc * ((nodeRadius + arrowHeadLength) * a_normal.y - arrowHeadHalfWidth * a_normal.x),

      da * (-(nodeRadius) * a_normal.x)
    + db * (-(nodeRadius + arrowHeadLength) * a_normal.x + arrowHeadHalfWidth * a_normal.y)
    + dc * (-(nodeRadius + arrowHeadLength) * a_normal.x - arrowHeadHalfWidth * a_normal.y)
  );

  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;

  gl_Position = vec4(position, 0, 1);

  // Extract the color:
  v_color = a_color;
  v_color.a *= bias;
}
