attribute vec4 a_color;
attribute vec2 a_normal;
attribute vec2 a_position;
attribute float a_radius;

uniform mat3 u_matrix;
uniform float u_sqrtZoomRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;

const float minThickness = 1.7;
const float bias = 255.0 / 254.0;
const float arrowHeadLengthThicknessRatio = 2.5;

void main() {
  float normalLength = length(a_normal);
  vec2 unitNormal = a_normal / normalLength;

  // These first computations are taken from edge.vert.glsl. Please read it to
  // get better comments on what's happening:
  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio;
  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;

  // Here, we move the point to leave space for the arrow head:
  float direction = sign(a_radius);
  float adaptedWebGLNodeRadius = direction * a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;
  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;

  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength);

  // Here is the proper position of the vertex
  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness + compensationVector, 1)).xy, 0, 1);

  v_thickness = webGLThickness / u_sqrtZoomRatio;

  v_normal = unitNormal;
  v_color = a_color;
  v_color.a *= bias;
}
