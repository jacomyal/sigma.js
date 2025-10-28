// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_normal;
in float v_thickness;
in float v_feather;

out vec4 fragColor;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  // We only handle antialiasing for normal mode:
  #ifdef PICKING_MODE
  fragColor = v_color;
  #else
  float dist = length(v_normal) * v_thickness;

  float t = smoothstep(
    v_thickness - v_feather,
    v_thickness,
    dist
  );

  fragColor = mix(v_color, transparent, t);
  #endif
}
`;

export default SHADER_SOURCE;
