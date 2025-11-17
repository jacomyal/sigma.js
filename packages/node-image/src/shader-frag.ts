import { OIT_GLSL } from "sigma/utils";

export default function getFragmentShader({ texturesCount }: { texturesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
// Shader: node-image fragment
precision highp float;

${OIT_GLSL}

in vec4 v_color;
in vec2 v_diffVector;
in float v_radius;
in vec4 v_texture;
in float v_textureIndex;
in float v_zIndex;

uniform sampler2D u_atlas[${texturesCount}];
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_percentagePadding;
uniform bool u_colorizeImages;
uniform bool u_keepWithinCircle;
uniform float u_opaqueThreshold;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;

const float radius = 0.5;

void main(void) {
  float border = 2.0 * u_correctionRatio;
  float dist = length(v_diffVector);

  float c = cos(-u_cameraAngle);
  float s = sin(-u_cameraAngle);
  vec2 diffVector = mat2(c, s, -s, c) * (v_diffVector);

  // No antialiasing for picking mode:
  #ifdef PICKING_MODE
  border = 0.0;
  fragColor = v_color;

  #else
  vec4 color = fragColor;

  // First case: No image to display
  if (v_texture.w <= 0.0) {
    if (!u_colorizeImages) {
      color = v_color;
    }
  }

  // Second case: Image loaded into the texture
  else {
    float paddingRatio = 1.0 + 2.0 * u_percentagePadding;
    float coef = u_keepWithinCircle ? 1.0 : ${Math.SQRT2};
    vec2 coordinateInTexture = diffVector * vec2(paddingRatio, -paddingRatio) / v_radius / 2.0 * coef + vec2(0.5, 0.5);
    int index = int(v_textureIndex + 0.5); // +0.5 avoid rounding errors

    bool noTextureFound = false;
    vec4 texel;

    ${
      [...new Array(texturesCount)].map(
        (_, i) =>
          `if (index == ${i}) texel = texture(u_atlas[${i}], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);`,
      ).join(`
    else `) +
      `else {
      texel = texture(u_atlas[0], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);
      noTextureFound = true;
    }`
    }

    if (noTextureFound) {
      color = v_color;
    } else {
      // Colorize all visible image pixels:
      if (u_colorizeImages) {
        color = mix(fragColor, v_color, texel.a);
      }

      // Colorize background pixels, keep image pixel colors:
      else {
        color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));
      }

      // Erase pixels "in the padding":
      if (abs(diffVector.x) > v_radius / paddingRatio || abs(diffVector.y) > v_radius / paddingRatio) {
        color = u_colorizeImages ? fragColor : v_color;
      }
    }
  }

  // Crop in a circle when u_keepWithinCircle is truthy:
  if (u_keepWithinCircle) {
    if (dist >= v_radius) {
      discard;
    } else {
      fragColor = color;
      // Anti-aliasing: reduce alpha at edges while keeping RGB color
      if (dist >= v_radius - border) {
        fragColor.a *= (v_radius - dist) / border;
      }
    }
  }

  // Crop in a square else:
  else {
    float squareHalfSize = v_radius * ${Math.SQRT1_2 * Math.cos(Math.PI / 12)};
    if (abs(diffVector.x) > squareHalfSize || abs(diffVector.y) > squareHalfSize) {
      discard;
    } else {
      fragColor = color;
    }
  }

  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= threshold)
  if (fragColor.a < u_opaqueThreshold) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  vec4 opaqueColor = fragColor;
  fragColor = vec4(opaqueColor.rgb * opaqueColor.a, opaqueColor.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < threshold)
  if (fragColor.a >= u_opaqueThreshold) {
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
