// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es

in vec2 a_position;
in vec2 a_normal;
in float a_radius;
in vec3 a_barycentric;

#ifdef PICKING_MODE
in vec4 a_id;
#else
in vec4 a_color;
#endif

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_minEdgeThickness;
uniform float u_lengthToThicknessRatio;
uniform float u_widenessToThicknessRatio;

out vec4 v_color;

const float bias = 255.0 / 254.0;

void main() {
  float minThickness = u_minEdgeThickness;

  float normalLength = length(a_normal);
  vec2 unitNormal = a_normal / normalLength;

  // These first computations are taken from edge.vert.glsl and
  // edge.clamped.vert.glsl. Please read it to get better comments on what's
  // happening:
  float pixelsThickness = max(normalLength / u_sizeRatio, minThickness);
  float webGLThickness = pixelsThickness * u_correctionRatio;
  float webGLNodeRadius = a_radius * 2.0 * u_correctionRatio / u_sizeRatio;
  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;
  float webGLArrowHeadThickness = webGLThickness * u_widenessToThicknessRatio;

  float da = a_barycentric.x;
  float db = a_barycentric.y;
  float dc = a_barycentric.z;

  vec2 delta = vec2(
      da * (webGLNodeRadius * unitNormal.y)
    + db * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y + webGLArrowHeadThickness * unitNormal.x)
    + dc * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y - webGLArrowHeadThickness * unitNormal.x),

      da * (-webGLNodeRadius * unitNormal.x)
    + db * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x + webGLArrowHeadThickness * unitNormal.y)
    + dc * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x - webGLArrowHeadThickness * unitNormal.y)
  );

  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;

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

export default SHADER_SOURCE;
