// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision mediump float;

in vec4 v_color;
in float v_zIndex;

out vec4 fragColor;

void main(void) {
  fragColor = v_color;

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
