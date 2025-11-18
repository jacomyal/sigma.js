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
  // Convert zIndex to depth: zIndex 1 = near (depth 0), zIndex 0 = far (depth 1)
  float depth = 1.0 - zIndex;

  // Standard weighted blended OIT formula
  // Near fragments (zIndex ≈ 1, depth ≈ 0) get weight ≈ 3000
  // Far fragments (zIndex ≈ 0, depth ≈ 1) get weight ≈ 10
  // Note: Opaque items (alpha >= 0.99) are now rendered in a separate pass with depth testing,
  // so no weight boost is needed here
  // Performance optimization: use multiplication instead of pow() for cube calculation
  float d = depth + 0.00001;
  float d3 = d * d * d;  // Much faster than pow(d, 3.0) on most GPUs
  float baseWeight = clamp(10.0 / (0.00001 + d3), 0.01, 3000.0);

  return alpha * baseWeight;
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

// language=GLSL
export const ANTIALIASING_GLSL = /*glsl*/ `
// ============================================================================
// Anti-aliasing Utilities
// ============================================================================
// Helper functions for smooth edge rendering with alpha fading.
// ============================================================================

/**
 * Apply linear anti-aliasing to a color's alpha channel.
 *
 * Reduces the alpha based on a distance metric, creating smooth edges.
 * Use this when you have a distance from an edge boundary.
 *
 * @param color Original color with alpha
 * @param dist Distance from the edge (0 = on edge, positive = outside)
 * @param border Width of the anti-aliasing border
 * @return Color with adjusted alpha for smooth edges
 */
vec4 applyLinearAA(vec4 color, float dist, float border) {
  vec4 result = color;
  if (dist > 0.0) {
    float t = clamp(dist / border, 0.0, 1.0);
    result.a *= (1.0 - t);
  }
  return result;
}

/**
 * Apply smoothstep anti-aliasing to a color's alpha channel.
 *
 * Uses smoothstep interpolation for even smoother edges than linear.
 * Recommended for edges where you want higher quality anti-aliasing.
 *
 * @param color Original color with alpha
 * @param dist Distance from the center or edge
 * @param innerEdge Distance where alpha starts fading
 * @param outerEdge Distance where alpha reaches zero
 * @return Color with adjusted alpha for smooth edges
 */
vec4 applySmoothAA(vec4 color, float dist, float innerEdge, float outerEdge) {
  vec4 result = color;
  float t = smoothstep(innerEdge, outerEdge, dist);
  result.a *= (1.0 - t);
  return result;
}
`;

// language=GLSL
export const COLOR_UTILS_GLSL = /*glsl*/ `
// ============================================================================
// Color Utilities
// ============================================================================
// Helper functions for color manipulation and conversion.
// ============================================================================

/**
 * Convert color to premultiplied alpha format.
 *
 * Premultiplied alpha multiplies RGB channels by the alpha channel.
 * This is required for proper blending in the OIT system.
 *
 * @param color Color with straight alpha
 * @return Color with premultiplied alpha
 */
vec4 premultiplyAlpha(vec4 color) {
  return vec4(color.rgb * color.a, color.a);
}
`;

/**
 * TypeScript utilities for generating common GLSL shader patterns.
 * These functions help reduce boilerplate and ensure consistency across shaders.
 *
 * ## Quick Start
 *
 * For simple shaders without custom logic:
 *
 * ```typescript
 * import { fragmentShaderHeader, twoPassRendering } from "sigma/utils";
 *
 * const rendering = twoPassRendering({ colorVar: "v_color" });
 * const SHADER_SOURCE = `${fragmentShaderHeader({
 *   name: "my-shader fragment"
 * })}
 *
 * in vec4 v_color;
 * in float v_zIndex;
 * uniform float u_opaqueThreshold;
 *
 * ${rendering.declarations}
 *
 * void main(void) {
 *   ${rendering.main}
 *
 *   ${rendering.depth}
 * }
 * `;
 * ```
 *
 * ## Using Anti-aliasing Utilities
 *
 * For shaders with anti-aliasing:
 *
 * ```typescript
 * import { fragmentShaderHeader, twoPassRendering } from "sigma/utils";
 *
 * const rendering = twoPassRendering();
 * const SHADER_SOURCE = `${fragmentShaderHeader({
 *   name: "my-antialiased-shader fragment",
 *   includeAntialiasing: true
 * })}
 *
 * in vec4 v_color;
 * in float v_zIndex;
 * uniform float u_opaqueThreshold;
 *
 * ${rendering.declarations}
 *
 * void main(void) {
 *   #ifdef PICKING_MODE
 *   fragColor = v_color;
 *   #else
 *   // Compute distance and apply anti-aliasing
 *   float dist = ...; // your distance calculation
 *   vec4 color = applyLinearAA(v_color, dist, border);
 *
 *   ${rendering.main}
 *   #endif
 *
 *   ${rendering.depth}
 * }
 * `;
 * ```
 *
 * ## Template Functions Reference
 *
 * - `fragmentShaderHeader()`: Generates #version, precision, and utility imports
 * - `twoPassRendering()`: Returns { declarations, main, depth } for standard rendering
 *
 * ## GLSL Utility Functions
 *
 * When you include utilities via `fragmentShaderHeader()`, these functions become available:
 *
 * **From OIT_GLSL (always included):**
 * - `oitFragColor(color, zIndex)`: Compute OIT fragment color
 * - `oitRevealage(color)`: Compute OIT revealage value
 *
 * **From ANTIALIASING_GLSL (when includeAntialiasing: true):**
 * - `applyLinearAA(color, dist, border)`: Linear alpha fade for edges
 * - `applySmoothAA(color, dist, innerEdge, outerEdge)`: Smoothstep alpha fade
 *
 * **From COLOR_UTILS_GLSL (when includeColorUtils: true):**
 * - `premultiplyAlpha(color)`: Convert to premultiplied alpha format
 */

/**
 * Generates the standard fragment shader header with version, precision,
 * and optional utility imports.
 *
 * @param options Configuration for the header
 * @returns GLSL code string for the shader header
 *
 * @example
 * ```typescript
 * const SHADER = `${fragmentShaderHeader({
 *   name: "node-circle fragment",
 *   includeAntialiasing: true
 * })}
 *
 * in vec4 v_color;
 * // ... rest of shader
 * `;
 * ```
 */
export function fragmentShaderHeader(
  options: {
    name?: string;
    precision?: "lowp" | "mediump" | "highp";
    includeOIT?: boolean;
    includeAntialiasing?: boolean;
    includeColorUtils?: boolean;
  } = {},
): string {
  const {
    name,
    precision = "highp",
    includeOIT = true,
    includeAntialiasing = false,
    includeColorUtils = false,
  } = options;

  const imports: string[] = [];
  if (includeOIT) imports.push(OIT_GLSL);
  if (includeAntialiasing) imports.push(ANTIALIASING_GLSL);
  if (includeColorUtils) imports.push(COLOR_UTILS_GLSL);

  const parts: string[] = ["#version 300 es"];

  if (name) {
    parts.push(`// Shader: ${name}`);
  }

  parts.push(`precision ${precision} float;`);

  if (imports.length > 0) {
    parts.push("", ...imports);
  }

  return parts.join("\n");
}

/**
 * Generates the standard two-pass rendering code used in most fragment shaders.
 *
 * This template handles three rendering modes:
 * 1. PICKING_MODE: Simple color output for mouse interaction
 * 2. OPAQUE_PASS: Renders fully opaque fragments with depth testing
 * 3. Transparent pass: Renders semi-transparent fragments using OIT
 *
 * @param options Configuration for variable names
 * @returns Object with { declarations, main, depth } containing the rendering code
 *
 * @example
 * ```typescript
 * const rendering = twoPassRendering({ colorVar: "v_color" });
 * const SHADER = `
 * ${rendering.declarations}
 * void main(void) {
 *   ${rendering.main}
 *
 *   ${rendering.depth}
 * }
 * `;
 * ```
 */
export function twoPassRendering(
  options: {
    colorVar?: string;
    pickingColorVar?: string;
    zIndexVar?: string;
    opaqueThresholdVar?: string;
  } = {},
): { declarations: string; main: string; depth: string } {
  const {
    colorVar = "color",
    pickingColorVar = "v_color",
    zIndexVar = "v_zIndex",
    opaqueThresholdVar = "u_opaqueThreshold",
  } = options;

  const declarations = `layout(location = 0) out vec4 fragColor;
layout(location = 1) out float revealage;`;

  const main = `#ifdef PICKING_MODE
  fragColor = ${pickingColorVar};
  #else
  // Two-pass rendering: opaque and transparent items render separately
  #ifdef OPAQUE_PASS
  // Opaque pass: only render opaque fragments (alpha >= threshold)
  if (${colorVar}.a < ${opaqueThresholdVar}) {
    discard;
  }
  // Output for opaque: premultiplied color + revealage = 0.0
  fragColor = vec4(${colorVar}.rgb * ${colorVar}.a, ${colorVar}.a);
  revealage = 0.0;
  #else
  // Transparent pass: only render transparent fragments (alpha < threshold)
  if (${colorVar}.a >= ${opaqueThresholdVar}) {
    discard;
  }
  // Weighted Blended OIT
  fragColor = oitFragColor(${colorVar}, ${zIndexVar});
  revealage = oitRevealage(${colorVar});
  #endif
  #endif`;

  const depth = `gl_FragDepth = ${zIndexVar};`;

  return { declarations, main, depth };
}
