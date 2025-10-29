// language=GLSL
export const OIT_GLSL = /*glsl*/ `
// ============================================================================
// Weighted Blended Order-Independent Transparency (OIT)
// ============================================================================
// This code implements the weight function and output format for OIT.
//
// Required outputs in fragment shader:
//   layout(location = 0) out vec4 fragColor;
//   layout(location = 1) out float revealage;
//
// Required inputs:
//   - color: vec4 with premultiplied alpha
//   - zIndex: float in range [0, 1] where 0 is furthest, 1 is closest
// ============================================================================

/**
 * Compute the weight for a fragment in the OIT accumulation buffer.
 *
 * Weight function is based on:
 * - Fragment opacity (alpha): more opaque = higher weight
 * - Fragment depth (zIndex): closer to camera = higher weight
 *
 * The formula uses a depth-based attenuation to prevent far fragments
 * from dominating the blend, while the clamp prevents extreme values.
 *
 * @param alpha Fragment opacity [0, 1]
 * @param zIndex Fragment depth [0, 1] where 0 is far, 1 is near
 * @return Weight value for OIT blending
 */
float oitWeight(float alpha, float zIndex) {
  // Weight formula: alpha * clamp(0.03 / (epsilon + (zIndex/200)^4), 0.01, 3000)
  // The division by 200 and power of 4 create strong depth-based ordering
  return alpha * clamp(0.03 / (1e-5 + pow(zIndex / 200.0, 4.0)), 1e-2, 3e3);
}

/**
 * Compute the fragment color for OIT accumulation buffer (MRT location 0).
 *
 * Returns the weighted premultiplied color for the OIT accumulation pass.
 * Assign this to fragColor in the fragment shader main().
 *
 * @param color Fragment color with alpha (vec4)
 * @param zIndex Fragment depth [0, 1]
 * @return Weighted color for OIT accumulation
 */
vec4 oitFragColor(vec4 color, float zIndex) {
  float weight = oitWeight(color.a, zIndex);
  return vec4(color.rgb * color.a, color.a) * weight;
}

/**
 * Compute the revealage value for OIT (MRT location 1).
 *
 * Returns the reveal factor for the OIT composite pass.
 * Assign this to revealage in the fragment shader main().
 *
 * @param color Fragment color with alpha (vec4)
 * @return Revealage factor for OIT composite
 */
float oitRevealage(vec4 color) {
  return color.a;
}
`;
