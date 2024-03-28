// language=GLSL
const VERTEX_SHADER_SOURCE = /*glsl*/ `
attribute vec4 a_id;
attribute vec4 a_color;
attribute float a_direction;
attribute float a_thickness;
attribute vec2 a_source;
attribute vec2 a_target;
attribute float a_current;
attribute float a_curvature;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_pixelRatio;
uniform vec2 u_dimensions;

varying vec4 v_color;
varying float v_thickness;
varying vec2 v_cpA;
varying vec2 v_cpB;
varying vec2 v_cpC;

const float bias = 255.0 / 254.0;
const float epsilon = 0.7;
const float minThickness = 0.3;

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
  // Selecting the correct position
  // Branchless "position = a_source if a_current == 1.0 else a_target"
  vec2 position = a_source * max(0.0, a_current) + a_target * max(0.0, 1.0 - a_current);
  position = (u_matrix * vec3(position, 1)).xy;

  vec2 source = (u_matrix * vec3(a_source, 1)).xy;
  vec2 target = (u_matrix * vec3(a_target, 1)).xy;

  vec2 viewportPosition = clipspaceToViewport(position, u_dimensions);
  vec2 viewportSource = clipspaceToViewport(source, u_dimensions);
  vec2 viewportTarget = clipspaceToViewport(target, u_dimensions);

  vec2 delta = viewportTarget.xy - viewportSource.xy;
  float len = length(delta);
  vec2 normal = vec2(-delta.y, delta.x) * a_direction;
  vec2 unitNormal = normal / len;
  float boundingBoxThickness = len * a_curvature;
  float curveThickness = max(minThickness, a_thickness / 2.0 / u_sizeRatio * u_pixelRatio);

  v_thickness = curveThickness;

  v_cpA = viewportSource;
  v_cpB = 0.5 * (viewportSource + viewportTarget) + unitNormal * a_direction * boundingBoxThickness;
  v_cpC = viewportTarget;

  vec2 viewportOffsetPosition = (
    viewportPosition +
    unitNormal * (boundingBoxThickness / 2.0 + curveThickness + epsilon) *
    max(0.0, a_direction) // NOTE: cutting the bounding box in half to avoid overdraw
  );

  position = viewportToClipspace(viewportOffsetPosition, u_dimensions);
  gl_Position = vec4(position, 0, 1);

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`;

export default VERTEX_SHADER_SOURCE;
