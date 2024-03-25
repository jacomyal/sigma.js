import {
  CreateNodeBorderProgramOptions,
  DEFAULT_BORDER_SIZE_MODE,
  NodeBorderSize,
  numberToGLSLFloat,
} from "./utils.ts";

export default function getVertexShader({ borders }: CreateNodeBorderProgramOptions) {
  const fillCounts = numberToGLSLFloat(borders.filter(({ size }) => "fill" in size).length);
  // language=GLSL
  const SHADER = /*glsl*/ `
attribute vec4 a_id;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;
${borders.flatMap(({ size }, i) => ("attribute" in size ? [`attribute float a_borderSize_${i + 1};`] : [])).join("\n")}
${borders.flatMap(({ color }, i) => ("attribute" in color ? [`attribute vec4 a_borderColor_${i + 1};`] : [])).join("\n")}

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
${borders.flatMap(({ color }, i) => ("value" in color ? [`uniform vec4 u_borderColor_${i + 1};`] : [])).join("\n")}

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

  // Let's first compute the size of "non-fill" borders:
${borders
  .flatMap(({ size }, i) => {
    if ("fill" in size) return [];

    size = size as Exclude<NodeBorderSize, { fill: true }>;
    const value = "attribute" in size ? `a_borderSize_${i + 1}` : numberToGLSLFloat(size.value);
    const factor = (size.mode || DEFAULT_BORDER_SIZE_MODE) === "pixels" ? "u_correctionRatio" : "v_radius";
    return [`  float borderSize_${i + 1} = ${factor} * ${value};`];
  })
  .join("\n")}
  // Now, let's split the remaining space between "fill" borders:
  float fillBorderSize = (v_radius - (${borders
    .flatMap(({ size }, i) => (!("fill" in size) ? [`borderSize_${i + 1}`] : []))
    .join(" + ")}) ) / ${fillCounts};
${borders.flatMap(({ size }, i) => ("fill" in size ? [`  float borderSize_${i + 1} = fillBorderSize;`] : [])).join("\n")}
  
  // Finally, normalize all border sizes, to start from the full size and to end with the smallest:
  float v_borderSize_0 = v_radius;
${borders.map((_, i) => `  v_borderSize_${i + 1} = v_borderSize_${i} - borderSize_${i + 1};`).join("\n")}

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  v_color.a *= bias;
  #else
  vec4 v_borderColor_0 = transparent;
${borders
  .map(({ color }, i) => {
    const res: string[] = [];
    if ("attribute" in color) {
      res.push(`  v_borderColor_${i + 1} = a_borderColor_${i + 1};`);
    } else if ("transparent" in color) {
      res.push(`  v_borderColor_${i + 1} = vec4(0.0, 0.0, 0.0, 0.0);`);
    } else {
      res.push(`  v_borderColor_${i + 1} = u_borderColor_${i + 1};`);
    }

    res.push(`  v_borderColor_${i + 1}.a *= bias;`);
    res.push(`  if (borderSize_${i + 1} <= 1.0 * u_correctionRatio) { v_borderColor_${i + 1} = v_borderColor_${i}; }`);

    return res.join("\n");
  })
  .join("\n")}
  #endif
}
`;

  return SHADER;
}
