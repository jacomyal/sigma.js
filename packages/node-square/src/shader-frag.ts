import { OIT_GLSL } from "sigma/utils";

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-square fragment
precision mediump float;

${OIT_GLSL}

in vec4 v_color;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

void main(void) {
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  fragColor = oitFragColor(v_color, v_zIndex);
  revealage = oitRevealage(v_color);
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
