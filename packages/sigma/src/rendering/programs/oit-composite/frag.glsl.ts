// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: oit-composite fragment
precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_accumTexture;
uniform sampler2D u_revealTexture;

out vec4 fragColor;

void main(void) {
  // Sample the accumulation and reveal textures
  vec4 accum = texture(u_accumTexture, v_texCoord);
  float reveal = texture(u_revealTexture, v_texCoord).r;

  // Weighted Blended OIT composite formula
  // Avoid division by zero
  vec3 averageColor = accum.rgb / max(accum.a, 1e-5);

  // Calculate final alpha (transparency = reveal, so alpha = 1 - reveal)
  float alpha = 1.0 - reveal;

  // Output premultiplied alpha for proper blending with background
  // With blend mode (ONE, ONE_MINUS_SRC_ALPHA):
  // result = averageColor * alpha + background * (1 - alpha)
  fragColor = vec4(averageColor * alpha, alpha);
}
`;

export default SHADER_SOURCE;
