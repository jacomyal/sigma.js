// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision mediump float;

in vec4 v_color;

out vec4 fragColor;

void main(void) {
  fragColor = v_color;
}
`;

export default SHADER_SOURCE;
