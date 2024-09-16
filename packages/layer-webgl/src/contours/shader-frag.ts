import { numberToGLSLFloat } from "sigma/rendering";

import { ContoursOptions } from "./types";

export default function getFragmentShader({
  nodesCount,
  feather,
  border,
  levels,
}: {
  nodesCount: number;
  feather: ContoursOptions["feather"];
  levels: ContoursOptions["levels"];
  border: ContoursOptions["border"];
}) {
  const levelsDesc = levels.map((o) => o.threshold).sort((a, b) => b - a);
  const levelsAsc = levelsDesc.slice(0).reverse();
  const limits = levelsAsc.map((threshold, i, a) => (i < a.length - 1 ? (threshold + a[i + 1]) / 2 : threshold + 1));
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
#define NODES_COUNT ${nodesCount}
#define LEVELS_COUNT ${levelsAsc.length}
#define PI 3.141592653589793238

precision highp float;

const vec4 u_levelColor_${levelsDesc.length + 1} = vec4(0.0, 0.0, 0.0, 0.0);
const float incLevels[LEVELS_COUNT] = float[](${levelsAsc.map((o) => numberToGLSLFloat(o)).join(",")});
const float incLimits[LEVELS_COUNT] = float[](${limits.map((o) => numberToGLSLFloat(o)).join(",")});

// Data:
uniform sampler2D u_nodesTexture;
uniform float u_radius;

// Camera:
uniform mat3 u_invMatrix;
uniform float u_width;
uniform float u_height;
uniform float u_correctionRatio;
uniform float u_zoomModifier;

// Levels uniforms:
${levelsDesc.map((_, i) => `uniform vec4 u_levelColor_${i + 1};`).join("\n")}

// Border color:
${border ? `uniform vec4 u_borderColor;` : ""}

// Output
out vec4 fragColor;

// Library:
float linearstep(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float hypot(vec2 v) {
  float x = abs(v.x);
  float y = abs(v.y);
  float t = min(x, y);
  x = max(x, y);
  t = t / x;
  return x * sqrt(1.0 + t * t);
}

// The explanations on how to get fixed width contour lines in a GLSL fragment shader come
// from @rreuser:
// https://observablehq.com/@rreusser/locally-scaled-domain-coloring-part-1-contour-plots
float contour(float score, float thickness, float feather) {
  float level = incLevels[0];
  for (int i = 0; i < LEVELS_COUNT - 1; i++) {
    if (score >= incLimits[i]) {
      level = incLevels[i + 1];
    } else {
      break;
    }
  }
  float gradient = (atan(score)) * 2.0 / PI;
  // This function is basically the same function as gradient, but drops to negative when it
  // reaches the middle of two consecutive levels, such that it is 0 for each level. This
  // allows having nice anti-aliased fixed width contour lines:
  float normalizedGradient = (atan(score) - atan(level)) * 2.0 / PI;
    
  float screenSpaceGradient = hypot(vec2(dFdx(gradient), dFdy(gradient)));
  return linearstep(
    0.5 * (thickness + feather),
    0.5 * (thickness - feather),
    (0.5 - abs(fract(normalizedGradient) - 0.5)) / screenSpaceGradient
  );
}

// Actual shader code:
void main() {
  vec2 position = (u_invMatrix * vec3(gl_FragCoord.xy * 2.0 / vec2(u_width, u_height) - vec2(1.0, 1.0), 1)).xy;
  float score = 0.0;

  float factor = 0.5 / u_correctionRatio;
  float radius = u_radius * u_zoomModifier;
  float correctedRadius = radius / factor;
  float correctedRadiusSquare = correctedRadius * correctedRadius; 

  for (int i = 0; i < NODES_COUNT; i++) {
    vec2 nodePos = texelFetch(u_nodesTexture, ivec2(i, 0), 0).xy;
    vec2 diff = position - nodePos;
    // Early exit check with Manhattan distance:
    if (diff.x >= correctedRadius || diff.y >= correctedRadius) continue;
    float dSquare = dot(diff, diff);
    // Early exit check with squared distance:
    if (dSquare >= correctedRadiusSquare) continue;
    float d = sqrt(dSquare) * factor;
    score += smoothstep(radius, 0.0, d);
  }

  vec4 levelColor = u_levelColor_${levelsDesc.length + 1};
  vec4 nextColor = u_levelColor_${levelsDesc.length + 1};
  ${levelsDesc
    .map(
      (threshold, i) => `if (score > ${numberToGLSLFloat(threshold)}) {
    levelColor = u_levelColor_${i + 1};
    ${!border ? `nextColor = score > ${numberToGLSLFloat(limits[i])} ? u_levelColor_${i + 1} : u_levelColor_${i + 2};` : ""}
  }`,
    )
    .join(" else ")}

  float t = contour(score, ${numberToGLSLFloat(border ? border.thickness : 0)}, ${numberToGLSLFloat(feather)});
  fragColor = mix(levelColor, ${border ? "u_borderColor" : "nextColor"}, t);
}
`;

  return SHADER;
}
