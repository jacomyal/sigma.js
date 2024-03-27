import { CreateNodeBorderProgramOptions } from "./utils";

export default function getFragmentShader({ borders }: CreateNodeBorderProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `
precision highp float;

varying vec2 v_diffVector;
varying float v_aaBorder;
varying float v_radius;
${borders.map((_, i) => `varying float v_borderSize_${i + 1};`).join("\n")}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${borders.map((_, i) => `varying vec4 v_borderColor_${i + 1};`).join("\n")}
#endif

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_diffVector);
  float v_borderSize_0 = v_radius;
  vec4 v_borderColor_0 = transparent;

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else
    gl_FragColor = v_color;

  #else
  if (dist > v_borderSize_0) {
    gl_FragColor = v_borderColor_0;
  } else ${borders
    .map(
      (_, i) => `if (dist > v_borderSize_${i} - v_aaBorder) {
    gl_FragColor = mix(v_borderColor_${i + 1}, v_borderColor_${i}, (dist - v_borderSize_${i} + v_aaBorder) / v_aaBorder);
  } else if (dist > v_borderSize_${i + 1}) {
    gl_FragColor = v_borderColor_${i + 1};
  } else `,
    )
    .join("")} { /* Nothing to add here */ }
  #endif
}
`;

  return SHADER;
}
