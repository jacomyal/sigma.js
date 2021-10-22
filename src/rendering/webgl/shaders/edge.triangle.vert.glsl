attribute vec4 a_color;
attribute vec2 a_normal;
attribute vec2 a_position;

uniform mat3 u_matrix;
uniform float u_sqrtZoomRatio;
uniform float u_correctionRatio;

varying vec4 v_color;

const float minThickness = 1.7;
const float bias = 255.0 / 254.0;

void main() {
  // The only different here with edge.vert.glsl is that we need to handle null
  // input normal vector. Apart from that, you can read edge.vert.glsl more info
  // on how it works:
  float normalLength = length(a_normal);
  vec2 unitNormal = a_normal / normalLength;
  if (normalLength <= 0.0) unitNormal = a_normal;
  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio;
  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;

  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness, 1)).xy, 0, 1);

  v_color = a_color;
  v_color.a *= bias;
}
