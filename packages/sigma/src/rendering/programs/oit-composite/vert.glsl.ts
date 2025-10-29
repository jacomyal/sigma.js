// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: oit-composite vertex
precision highp float;

// Full-screen quad vertices
in vec2 a_position;

out vec2 v_texCoord;

void main(void) {
  // Position is already in clip space (-1 to 1)
  gl_Position = vec4(a_position, 0.0, 1.0);

  // Convert from clip space to texture coordinates (0 to 1)
  v_texCoord = a_position * 0.5 + 0.5;
}
`;

export default SHADER_SOURCE;
