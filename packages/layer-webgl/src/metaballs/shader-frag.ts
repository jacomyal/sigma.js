export default function getFragmentShader({ nodesCount }: { nodesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `
#define NODES_COUNT ${nodesCount}

precision highp float;

// Data:
uniform vec2 u_nodesPosition[NODES_COUNT];
uniform float u_radius;
uniform float u_feather;
uniform float u_threshold;
uniform vec4 u_color;

// Camera:
uniform mat3 u_matrix;
uniform float u_width;
uniform float u_height;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  vec2 position = gl_FragCoord.xy;
  float sum = 0.0;

  for (int i = 0; i < NODES_COUNT; i++) {
    vec2 nodePos = ((u_matrix * vec3(u_nodesPosition[i].xy, 1)).xy + vec2(1.0, 1.0)) * vec2(u_width, u_height) / 2.0;
    float d = distance(position, nodePos);
    sum += smoothstep(u_radius, 0.0, d);
  }

  if (sum > u_threshold) {
    gl_FragColor = u_color;
  } else if (sum > u_threshold - u_feather) {
    float t = smoothstep(
      u_threshold,
      u_threshold - u_feather,
      sum
    );
    gl_FragColor = mix(u_color, transparent, t);
  } else {
    discard;
  }
}

`;

  return SHADER;
}
