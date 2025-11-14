import { numberToGLSLFloat } from "sigma/rendering";
import { OIT_GLSL } from "sigma/utils";

import { CreateNodePiechartProgramOptions } from "./utils";

export default function getFragmentShader({ slices, offset }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
// Shader: node-piechart fragment
precision highp float;

${OIT_GLSL}

in vec2 v_diffVector;
in float v_radius;
in float v_zIndex;

#ifdef PICKING_MODE
in vec4 v_color;
#else
// For normal mode, we use the border colors defined in the program:
${slices.flatMap(({ value }, i) => ("attribute" in value ? [`in float v_sliceValue_${i + 1};`] : [])).join("\n")}
${slices.map(({ color }, i) => ("attribute" in color ? `in vec4 v_sliceColor_${i + 1};` : `uniform vec4 u_sliceColor_${i + 1};`)).join("\n")}
#endif

uniform vec4 u_defaultColor;
uniform float u_cameraAngle;
uniform float u_correctionRatio;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

${"attribute" in offset ? "in float v_offset;\n" : ""}
${"value" in offset ? "uniform float u_offset;\n" : ""}

const float bias = 255.0 / 254.0;

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
    discard;
  fragColor = v_color;
  fragColor.a *= bias;
  #else
  // Colors:
${slices
  .map(({ color }, i) => {
    const res: string[] = [];
    if ("attribute" in color) {
      res.push(`  vec4 sliceColor_${i + 1} = v_sliceColor_${i + 1};`);
    } else if ("transparent" in color) {
      res.push(`  vec4 sliceColor_${i + 1} = vec4(0.0, 0.0, 0.0, 0.0);`);
    } else {
      res.push(`  vec4 sliceColor_${i + 1} = u_sliceColor_${i + 1};`);
    }

    res.push(`  sliceColor_${i + 1}.a *= bias;`);

    return res.join("\n");
  })
  .join("\n")}
  vec4 color = u_defaultColor;
  color.a *= bias;

  // Sizes:
${slices
  .map(
    ({ value }, i) =>
      `  float sliceValue_${i + 1} = ${"attribute" in value ? `v_sliceValue_${i + 1}` : numberToGLSLFloat(value.value)};`,
  )
  .join("\n")}

  // Angles and final color:
  float total = ${slices.map((_, i) => `sliceValue_${i + 1}`).join(" + ")};
  float angle_0 = 0.0;
  if (total > 0.0) {
${slices.map((_, i) => `    float angle_${i + 1} = angle_${i} + sliceValue_${i + 1} * ${2 * Math.PI} / total;`).join("\n")}
    ${slices.map((_, i) => `if (angle < angle_${i + 1}) color = sliceColor_${i + 1};`).join("\n    else ")}
  }

  // Discard fragments completely outside the circle
  if (dist >= v_radius) {
    discard;
  } else {
    fragColor = color;
    // Anti-aliasing: reduce alpha at edges while keeping RGB color
    if (dist >= v_radius - aaBorder) {
      fragColor.a *= (v_radius - dist) / aaBorder;
    }
  }

  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= 0.99)
  if (fragColor.a < 0.99) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  vec4 opaqueColor = fragColor;
  fragColor = vec4(opaqueColor.rgb * opaqueColor.a, opaqueColor.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < 0.99)
  if (fragColor.a >= 0.99) {
    discard;
  }
  // Weighted Blended OIT
  vec4 transparentColor = fragColor;
  fragColor = oitFragColor(transparentColor, v_zIndex);
  revealage = oitRevealage(transparentColor);
  #endif
  #endif

  gl_FragDepth = v_zIndex;
}
`;

  return SHADER;
}
