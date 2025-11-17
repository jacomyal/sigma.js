import { fragmentShaderHeader, twoPassRendering } from "../../../utils";

const rendering = twoPassRendering();

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `${fragmentShaderHeader({
  name: "edge-rectangle fragment",
  includeAntialiasing: true,
})}

in vec4 v_color;
in vec2 v_normal;
in float v_thickness;
in float v_feather;
in float v_zIndex;

uniform float u_opaqueThreshold;

${rendering.declarations}

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

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = applySmoothAA(v_color, dist, v_thickness - v_feather, v_thickness);

  ${rendering.main}
  #endif

  ${rendering.depth}
}
`;

export default SHADER_SOURCE;
