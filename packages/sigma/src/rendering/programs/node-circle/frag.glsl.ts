// language=GLSL
const SHADER_SOURCE = /*glsl*/ `#version 300 es
// Shader: node-circle fragment
precision highp float;

in vec4 v_color;
in vec2 v_diffVector;
in float v_radius;
in float v_zIndex;

uniform float u_correctionRatio;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = length(v_diffVector) - v_radius + border;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > border)
    discard;
  fragColor = v_color;

  #else
  // Discard fragments completely outside the circle
  if (dist > border)
    discard;

  float t = 0.0;
  if (dist > 0.0)
    t = dist / border;

  vec4 color = mix(v_color, transparent, t);

  // Weighted Blended OIT
  // Weight function:
  // - Higher weight for opaque fragments (alpha close to 1)
  // - Higher weight for fragments close to camera (lower depth)
  float weight = color.a * clamp(0.03 / (1e-5 + pow(gl_FragDepth / 200.0, 4.0)), 1e-2, 3e3);

  // Output weighted premultiplied color and alpha
  fragColor = vec4(color.rgb * color.a, color.a) * weight;
  revealage = color.a;
  #endif

  gl_FragDepth = v_zIndex;
}
`;

export default SHADER_SOURCE;
