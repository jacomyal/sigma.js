import { CreateNodePiechartProgramOptions, numberToGLSLFloat } from "./utils";

export default function getVertexShader({ slices, offset }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `
attribute vec4 a_id;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;
${"attribute" in offset ? "attribute float a_offset;\n" : ""}
${slices.flatMap(({ size }, i) => ("attribute" in size ? [`attribute float a_sliceValue_${i + 1};`] : [])).join("\n")}
${slices.flatMap(({ color }, i) => ("attribute" in color ? [`attribute vec4 a_sliceColor_${i + 1};`] : [])).join("\n")}

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform vec4 u_defaultColor;
${slices.flatMap(({ color }, i) => ("value" in color ? [`uniform vec4 u_sliceColor_${i + 1};`] : [])).join("\n")}

varying vec2 v_diffVector;
varying float v_aaBorder;
varying float v_radius;
${slices.map((_, i) => `varying float v_sliceValue_${i + 1};`).join("\n")}
${"attribute" in offset ? "varying float v_offset;\n" : ""}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
varying vec4 v_defaultColor;
// For normal mode, we use the border colors defined in the program:
${slices.map((_, i) => `varying vec4 v_sliceColor_${i + 1};`).join("\n")}
#endif

const float bias = 255.0 / 254.0;
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_radius = size / 2.0;
  v_aaBorder = u_correctionRatio * 2.0;
  v_diffVector = diffVector;
  ${"attribute" in offset ? "v_offset = a_offset;\n" : ""}

${slices
  .map(
    ({ size }, i) =>
      `  v_sliceValue_${i + 1} = ${"attribute" in size ? `a_sliceValue_${i + 1}` : numberToGLSLFloat(size.value)};`,
  )
  .join("\n")}

  #ifdef PICKING_MODE
  v_color = a_id;
  v_color.a *= bias;
  #else
  v_defaultColor = u_defaultColor;
  v_defaultColor.a *= bias;
${slices
  .map(({ color }, i) => {
    const res: string[] = [];
    if ("attribute" in color) {
      res.push(`  v_sliceColor_${i + 1} = a_sliceColor_${i + 1};`);
    } else if ("transparent" in color) {
      res.push(`  v_sliceColor_${i + 1} = vec4(0.0, 0.0, 0.0, 0.0);`);
    } else {
      res.push(`  v_sliceColor_${i + 1} = u_sliceColor_${i + 1};`);
    }

    res.push(`  v_sliceColor_${i + 1}.a *= bias;`);

    return res.join("\n");
  })
  .join("\n")}
  #endif
}
`;

  return SHADER;
}
