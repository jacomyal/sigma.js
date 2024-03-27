import { CreateNodePiechartProgramOptions } from "./utils";

export default function getFragmentShader({ slices, offset }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `
precision highp float;

varying vec2 v_diffVector;
varying float v_radius;
${slices.map((_, i) => `varying float v_sliceValue_${i + 1};`).join("\n")}
${"attribute" in offset ? "varying float v_offset;\n" : ""}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${slices.map((_, i) => `varying vec4 v_sliceColor_${i + 1};`).join("\n")}
#endif

uniform vec4 u_defaultColor;
uniform float u_cameraAngle;
uniform float u_correctionRatio;
${"value" in offset ? "uniform float u_offset;\n" : ""}

const float bias = 255.0 / 254.0;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float aaBorder = u_correctionRatio * 2.0;;
  float dist = length(v_diffVector);
  float offset = ${"attribute" in offset ? "v_offset" : "u_offset"};
  float angle = atan(v_diffVector.y / v_diffVector.x);
  if (v_diffVector.x < 0.0 && v_diffVector.y < 0.0) angle += ${Math.PI};
  else if (v_diffVector.x < 0.0) angle += ${Math.PI};
  else if (v_diffVector.y < 0.0) angle += ${2 * Math.PI};
  angle = angle - u_cameraAngle + offset;
  angle = mod(angle, ${2 * Math.PI});

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else
    gl_FragColor = v_color;

  #else
  float total = ${slices.map((_, i) => `v_sliceValue_${i + 1}`).join(" + ")};
  vec4 color = u_defaultColor * bias;
  float angle_0 = 0.0;
  if (total > 0.0) {
${slices.map((_, i) => `    float angle_${i + 1} = angle_${i} + v_sliceValue_${i + 1} * ${2 * Math.PI} / total;`).join("\n")}
    ${slices.map((_, i) => `if (angle < angle_${i + 1}) color = v_sliceColor_${i + 1};`).join("\n    else ")}
  }

  if (dist < v_radius - aaBorder) {
    gl_FragColor = color;
  } else if (dist < v_radius) {
    gl_FragColor = mix(transparent, color, (v_radius - dist) / aaBorder);
  }
  #endif
}
`;

  return SHADER;
}
