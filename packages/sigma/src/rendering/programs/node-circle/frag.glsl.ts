import { fragmentShaderHeader, twoPassRendering } from "../../../utils";

const rendering = twoPassRendering();

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `${fragmentShaderHeader({
  name: "node-circle fragment",
  includeAntialiasing: true,
})}

in vec4 v_color;
in vec2 v_diffVector;
in float v_radius;
in float v_zIndex;

uniform float u_correctionRatio;
uniform float u_opaqueThreshold;

${rendering.declarations}

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

  // Anti-aliasing: reduce alpha at edges while keeping RGB color
  vec4 color = applyLinearAA(v_color, dist, border);

  ${rendering.main}
  #endif

  ${rendering.depth}
}
`;

export default SHADER_SOURCE;
