import { numberToGLSLFloat } from "sigma/rendering";

import { MetaballsOptions } from "./types.ts";

export default function getFragmentShader({
  nodesCount,
  halos,
}: {
  nodesCount: number;
  halos: MetaballsOptions["halos"];
}) {
  // language=GLSL
  const SHADER = /*glsl*/ `
#define NODES_COUNT ${nodesCount}

precision highp float;

// Data:
uniform vec2 u_nodesPosition[NODES_COUNT];
uniform float u_radius;

// Camera:
uniform mat3 u_invMatrix;
uniform float u_width;
uniform float u_height;
uniform float u_correctionRatio;
uniform float u_zoomModifier;

// Halos uniforms:
${halos.map((_, i) => `uniform vec4 u_borderColor_${i + 1};`).join("\n")}

const vec4 u_borderColor_${halos.length + 1} = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  vec2 position = (u_invMatrix * vec3(gl_FragCoord.xy * 2.0 / vec2(u_width, u_height) - vec2(1.0, 1.0), 1)).xy;
  float score = 0.0;

  float factor = 0.5 / u_correctionRatio;
  float radius = u_radius * u_zoomModifier;
  float correctedRadius = radius / factor;

  for (int i = 0; i < NODES_COUNT; i++) {
    vec2 nodePos = u_nodesPosition[i].xy;
    if (distance(position.x, nodePos.x) >= correctedRadius || distance(position.y, nodePos.y) >= correctedRadius) continue;
    float d = distance(position, nodePos) * factor;
    score += smoothstep(radius, 0.0, d);
    if (score >= 1.0) break;
  }
    
  ${halos
    .map(
      ({ threshold, feather }, i) => `if (score > ${numberToGLSLFloat(threshold)}) {
    gl_FragColor = u_borderColor_${i + 1};
  } else if (score > ${numberToGLSLFloat(threshold - feather)}) {
    float t = smoothstep(
      ${numberToGLSLFloat(threshold)},
      ${numberToGLSLFloat(threshold - feather)},
      score
    );
    gl_FragColor = mix(u_borderColor_${i + 1}, u_borderColor_${i + 2}, t);
  }`,
    )
    .join(" else ")} else {
    discard;
  }
}
`;

  return SHADER;
}
