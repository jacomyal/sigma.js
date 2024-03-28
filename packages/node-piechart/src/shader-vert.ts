import { CreateNodePiechartProgramOptions } from "./utils";

export default function getVertexShader({ slices, offset }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `
attribute vec4 a_id;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec2 v_diffVector;
varying float v_radius;

${"attribute" in offset ? "attribute float a_offset;\n" : ""}
${"attribute" in offset ? "varying float v_offset;\n" : ""}

#ifdef PICKING_MODE
varying vec4 v_color;
#else
${slices
  .flatMap(({ value }, i) =>
    "attribute" in value ? [`attribute float a_sliceValue_${i + 1};`, `varying float v_sliceValue_${i + 1};`] : [],
  )
  .join("\n")}
${slices
  .flatMap(({ color }, i) =>
    "attribute" in color ? [`attribute vec4 a_sliceColor_${i + 1};`, `varying vec4 v_sliceColor_${i + 1};`] : [],
  )
  .join("\n")}
#endif

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
  v_diffVector = diffVector;
  ${"attribute" in offset ? "v_offset = a_offset;\n" : ""}

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
${slices
  .flatMap(({ value }, i) => ("attribute" in value ? [`  v_sliceValue_${i + 1} = a_sliceValue_${i + 1};`] : []))
  .join("\n")}
${slices
  .flatMap(({ color }, i) => ("attribute" in color ? [`  v_sliceColor_${i + 1} = a_sliceColor_${i + 1};`] : []))
  .join("\n")}
  #endif
}
`;

  return SHADER;
}
