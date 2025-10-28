import { CreateNodePiechartProgramOptions } from "./utils";

export default function getVertexShader({ slices, offset }: CreateNodePiechartProgramOptions) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es

in vec4 a_id;
in vec2 a_position;
in float a_size;
in float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

out vec2 v_diffVector;
out float v_radius;

${"attribute" in offset ? "in float a_offset;\n" : ""}
${"attribute" in offset ? "out float v_offset;\n" : ""}

#ifdef PICKING_MODE
out vec4 v_color;
#else
${slices
  .flatMap(({ value }, i) =>
    "attribute" in value ? [`in float a_sliceValue_${i + 1};`, `out float v_sliceValue_${i + 1};`] : [],
  )
  .join("\n")}
${slices
  .flatMap(({ color }, i) =>
    "attribute" in color ? [`in vec4 a_sliceColor_${i + 1};`, `out vec4 v_sliceColor_${i + 1};`] : [],
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
