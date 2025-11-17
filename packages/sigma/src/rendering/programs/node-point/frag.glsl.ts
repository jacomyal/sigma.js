import { fragmentShaderHeader, twoPassRendering } from "../../../utils";

const rendering = twoPassRendering();

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `${fragmentShaderHeader({
  name: "node-point fragment",
})}

in vec4 v_color;
in float v_border;
in float v_zIndex;

uniform float u_opaqueThreshold;

${rendering.declarations}

const float radius = 0.5;

void main(void) {
  vec2 m = gl_PointCoord - vec2(0.5, 0.5);
  float dist = radius - length(m);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist <= v_border)
    discard;
  fragColor = v_color;

  #else
  // Discard fragments completely outside the circle
  if (dist <= 0.0)
    discard;

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = v_color;
  if (dist <= v_border) {
    float t = dist / v_border;
    color.a *= t;
  }

  ${rendering.main}
  #endif

  ${rendering.depth}
}
`;

export default SHADER_SOURCE;
