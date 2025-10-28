// language=GLSL
const VERTEX_SHADER_SOURCE = /*glsl*/ `#version 300 es

in vec4 a_id;
in vec4 a_color;
in vec2 a_position;
in float a_size;
in float a_angle;
in vec4 a_texture;
in float a_textureIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

out vec4 v_color;
out vec2 v_diffVector;
out float v_radius;
out vec4 v_texture;
out float v_textureIndex;

const float bias = 255.0 / 254.0;
const float marginRatio = 1.05;

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector * marginRatio;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_diffVector = diffVector;
  v_radius = size / 2.0 / marginRatio;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;

  // Pass the texture coordinates:
  v_textureIndex = a_textureIndex;
  v_texture = a_texture;
  #endif

  v_color.a *= bias;
}
`;

export default VERTEX_SHADER_SOURCE;
