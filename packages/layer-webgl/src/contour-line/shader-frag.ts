export default function getFragmentShader({ nodesCount }: { nodesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `
#extension GL_OES_standard_derivatives : enable
#define NODES_COUNT ${nodesCount}
#define PI 3.141592653589793238

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

// Strips:
uniform float u_threshold;
uniform float u_lineWidth;
uniform float u_feather;
uniform vec4 u_backgroundColor;
uniform vec4 u_contourColor;

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

float contour(float score, float threshold, float width, float feather) {
  float scoreCenteredOnThreshold = atan(score - threshold) * 2.0 / PI;
  float screenSpaceGradient = hypot(vec2(dFdx(scoreCenteredOnThreshold), dFdy(scoreCenteredOnThreshold)));
  return linearstep(
    0.5 * (width + feather),
    0.5 * (width - feather),
    (0.5 - abs(fract(scoreCenteredOnThreshold) - 0.5)) / screenSpaceGradient
  );
}

// Actual shader code:
void main() {
  // Compute fragment score:
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
  }

  // Determine fragment color from the score (and its derivative):
  float t = contour(score, u_threshold, u_lineWidth, u_feather);
  gl_FragColor = mix(u_backgroundColor, u_contourColor, t);
}
`;

  return SHADER;
}
