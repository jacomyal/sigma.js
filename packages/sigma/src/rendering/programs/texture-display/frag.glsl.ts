/**
 * Sigma.js Texture Display Fragment Shader
 * ==========================================
 *
 * Simple fragment shader for displaying a texture on screen.
 * @module
 */

const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_downSizingRatio;

in vec2 v_texCoord;

out vec4 fragColor;

void main(void) {
  // Scale texture coordinates to account for downsampling
  // If downSizingRatio is 2, only the first half of the texture has data
  vec2 scaledTexCoord = v_texCoord / u_downSizingRatio;

  fragColor = texture(u_texture, scaledTexCoord);
}
`;

export default SHADER_SOURCE;
