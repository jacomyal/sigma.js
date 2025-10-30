/**
 * Sigma.js Texture Display Vertex Shader
 * ========================================
 *
 * Simple vertex shader for displaying a texture on a full-screen quad.
 * @module
 */

const SHADER_SOURCE = /*glsl*/ `#version 300 es

in vec2 a_position;

out vec2 v_texCoord;

void main(void) {
  // Pass through position for full-screen quad
  gl_Position = vec4(a_position, 0.0, 1.0);

  // Convert from clip space [-1, 1] to texture coordinates [0, 1]
  v_texCoord = a_position * 0.5 + 0.5;
}
`;

export default SHADER_SOURCE;
