// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: edge-rectangle fragment
precision mediump float;

in vec4 v_color;
in vec2 v_normal;
in float v_thickness;
in float v_feather;
in float v_zIndex;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  // We only handle antialiasing for normal mode:
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  float dist = length(v_normal) * v_thickness;

  // Discard fragments completely outside the edge
  if (dist >= v_thickness) {
    discard;
  }

  float t = smoothstep(
    v_thickness - v_feather,
    v_thickness,
    dist
  );

  vec4 color = mix(v_color, transparent, t);

  // Weighted Blended OIT
  float weight = color.a * clamp(0.03 / (1e-5 + pow(gl_FragDepth / 200.0, 4.0)), 1e-2, 3e3);

  fragColor = vec4(color.rgb * color.a, color.a) * weight;
  revealage = color.a;
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
