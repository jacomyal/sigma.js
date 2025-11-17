import { fragmentShaderHeader, twoPassRendering } from "sigma/utils";

const rendering = twoPassRendering({ colorVar: "v_color" });

// language=GLSL
const SHADER_SOURCE = /*glsl*/ `${fragmentShaderHeader({
  name: "node-square fragment",
})}

in vec4 v_color;
in float v_zIndex;

uniform float u_opaqueThreshold;

${rendering.declarations}

void main(void) {
  ${rendering.main}

  ${rendering.depth}
}
`;

export default SHADER_SOURCE;
