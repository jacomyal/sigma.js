// language=GLSL
const SHADER_SOURCE = /*glsl*/ `
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;

#ifdef HAS_DEPTH
attribute float a_depth;
#endif

uniform mat3 u_matrix;

varying vec4 v_color;

const float bias = 255.0 / 254.0;

void main() {
  // Scale from [[-1 1] [-1 1]] to the container:
  gl_Position = vec4(
    (u_matrix * vec3(a_position, 1)).xy,
    0,
    1
  );

  #ifdef HAS_DEPTH
  gl_Position.z = a_depth;
  #endif

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
