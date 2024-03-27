import { CreateNodePiechartProgramOptions } from "./utils";

export default function getFragmentShader({ slices }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `
#define PI_2 ${Math.PI * 2}
precision highp float;

varying vec2 v_diffVector;
varying float v_aaBorder;
varying float v_radius;
varying vec4 v_defaultColor;
${slices.map((_, i) => `varying float v_sliceValue_${i + 1};`).join("\n")}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${slices.map((_, i) => `varying vec4 v_sliceColor_${i + 1};`).join("\n")}
#endif

uniform float u_cameraAngle;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_diffVector);
  float angle = atan(v_diffVector.y / v_diffVector.x);
  if (v_diffVector.x < 0.0 && v_diffVector.y < 0.0) angle += ${Math.PI};
  else if (v_diffVector.x < 0.0) angle += ${Math.PI};
  else if (v_diffVector.y < 0.0) angle += ${2 * Math.PI};
  angle -= u_cameraAngle;
  angle = mod(angle, PI_2);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  if (dist > v_radius)
    gl_FragColor = transparent;
  else
    gl_FragColor = v_color;

  #else
  float total = ${slices.map((_, i) => `v_sliceValue_${i + 1}`).join(" + ")};
  vec4 color = v_defaultColor;
  float angle_0 = 0.0;
  if (total > 0.0) {
${slices.map((_, i) => `    float angle_${i + 1} = angle_${i} + v_sliceValue_${i + 1} * PI_2 / total;`).join("\n")}
    ${slices.map((_, i) => `if (angle < angle_${i + 1}) color = v_sliceColor_${i + 1};`).join("\n    else ")}
  }

  if (dist < v_radius - v_aaBorder) {
    gl_FragColor = color;
  } else if (dist < v_radius) {
    gl_FragColor = mix(transparent, color, (v_radius - dist) / v_aaBorder);
  }
  #endif
}
`;

  return SHADER;
}
