export default function getVertexShader() {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
  `;

  return SHADER;
}
