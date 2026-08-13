/**
 * Sigma.js Edge Layer - Dashed
 * ============================
 *
 * Dashed pattern layer for edges with antialiased boundaries.
 *
 * @module
 */
import { Vec3 } from "../../nodes";
import { numberToGLSLFloat } from "../../utils";
import { EdgeLayer } from "../types";
import { EdgeColorValue, resolveEdgeColorValue } from "./color-value";

/**
 * Mode for border size specification.
 * - "relative": Size is a fraction of the edge thickness (0.0 to 1.0)
 * - "pixels": Size is in screen pixels
 */
export type DashSizeMode = "relative" | "pixels";
export const DEFAULT_DASH_SIZE_MODE: DashSizeMode = "pixels";

/**
 * Represents a dash-related value.
 * - { value, mode? }: Fixed value
 * - { attribute, default?, mode? }: Read from node attribute
 */
export type DashSize =
  | { value: number; mode?: DashSizeMode }
  | { attribute: string; default?: number; mode?: DashSizeMode };

/**
 * Specifies how gaps between dashes should be rendered.
 * - number (0-1): Same color as dash but with this opacity (0 = transparent)
 * - EdgeColorValue: constant color, per-edge attribute, or node color
 */
export type GapFilling = number | EdgeColorValue;

/**
 * Specifies which extremities should be rendered solid (not dashed).
 */
export type SolidExtremities = boolean | "head" | "tail";

/**
 * Specifies solid margin at each end of the edge.
 */
export type SolidMargin = number | { head?: number; tail?: number };

/**
 * Options for the dashed layer.
 */
export interface LayerDashedOptions {
  /**
   * Size of each dash.
   * Default: { value: 10, mode: 'pixels' }
   */
  dashSize?: DashSize;

  /**
   * Dash color: constant color, per-edge attribute, or node color reference
   * (e.g. `{ node: "source" }`).
   *
   * @default { attribute: "color" }
   */
  dashColor?: EdgeColorValue;

  /**
   * Offset to shift the dash pattern along the edge.
   * Default: { value: 0, mode: 'pixels' }
   */
  dashOffset?: DashSize;

  /**
   * Size of gaps between dashes.
   * Default: { value: 10, mode: 'pixels' }
   */
  gapSize?: DashSize;

  /**
   * How gaps should be filled:
   * - number (0-1): Same color as dash but with this opacity (0 = fully
   *   transparent, the default)
   * - EdgeColorValue: constant color, per-edge attribute, or node color
   *
   * Default: 0
   */
  gapColor?: GapFilling;

  /**
   * Controls where the dash pattern is anchored along the edge:
   * - 0: Pattern starts at the beginning of the edge
   * - 0.5: Pattern is centered on the edge (default)
   * - 1: Pattern ends at the end of the edge
   *
   * Default: 0.5
   */
  align?: number;

  /**
   * Render extremity zones with solid color instead of dashes.
   * - true: Both head and tail extremities are solid
   * - "head": Only head (target) extremity is solid
   * - "tail": Only tail (source) extremity is solid
   * - false: Dashes continue through extremities (default)
   *
   * Default: false
   */
  solidExtremities?: SolidExtremities;

  /**
   * Extra solid margin (in pixels) before the dash pattern starts.
   * This is in addition to the extremity zone when solidExtremities is enabled.
   * - number: Same margin on both ends
   * - { head?: number, tail?: number }: Different margins for each end
   *
   * Default: 0
   */
  solidMargin?: SolidMargin;
}

/**
 * Parses the solidExtremities option.
 */
function parseSolidExtremities(value: SolidExtremities | undefined): { tail: boolean; head: boolean } {
  if (value === undefined || value === false) {
    return { tail: false, head: false };
  }
  if (value === true) {
    return { tail: true, head: true };
  }
  if (value === "head") {
    return { tail: false, head: true };
  }
  // value === "tail"
  return { tail: true, head: false };
}

/**
 * Parses the solidMargin option.
 */
function parseSolidMargin(value: SolidMargin | undefined): { tail: number; head: number } {
  if (value === undefined) {
    return { tail: 0, head: 0 };
  }
  if (typeof value === "number") {
    return { tail: value, head: value };
  }
  return { tail: value.tail ?? 0, head: value.head ?? 0 };
}

/**
 * Creates a dashed pattern edge layer.
 *
 * The layer renders edges with customizable dash patterns, supporting variable
 * dash and gap sizes, custom colors, alignment options, and solid extremity zones.
 *
 * @param options - Dash pattern configuration
 * @returns EdgeLayer definition for dashed edges
 */
export function layerDashed(options?: LayerDashedOptions): EdgeLayer {
  const opts = options ?? {};
  const dashColor = opts.dashColor ?? { attribute: "color" };
  const gapColor = opts.gapColor ?? 0;
  const sizes = {
    dashSize: opts.dashSize ?? { value: 10, mode: "pixels" },
    gapSize: opts.gapSize ?? { value: 10, mode: "pixels" },
    dashOffset: opts.dashOffset ?? { value: 0, mode: "pixels" },
  };
  const align = opts.align ?? 0.5;
  const solidExtremities = parseSolidExtremities(opts.solidExtremities);
  const solidMargin = parseSolidMargin(opts.solidMargin);

  const dashResolved = resolveEdgeColorValue(dashColor, "dashColor");

  // Encode mode as vec3: 0.0 = pixels, 1.0 = ratio (relative to thickness)
  const sizeMode = [sizes.dashSize, sizes.gapSize, sizes.dashOffset].map((dashSize) =>
    (dashSize.mode ?? DEFAULT_DASH_SIZE_MODE) === "relative" ? 1 : 0,
  ) as Vec3;

  // Build uniforms list
  const uniforms: EdgeLayer["uniforms"] = [
    { name: "u_sizeMode", type: "vec3", value: sizeMode },
    { name: "u_align", type: "float", value: align },
    // Solid extremities: vec2(tail, head) as 0.0 or 1.0
    {
      name: "u_solidExtremities",
      type: "vec2",
      value: [solidExtremities.tail ? 1.0 : 0.0, solidExtremities.head ? 1.0 : 0.0],
    },
    // Solid margin: vec2(tail margin in pixels, head margin in pixels)
    { name: "u_solidMargin", type: "vec2", value: [solidMargin.tail, solidMargin.head] },
  ];

  const attributes: EdgeLayer["attributes"] = [...dashResolved.attributes];
  let needsNodeColors = dashResolved.needsNodeColors;

  // Gap color: either an opacity applied to the dash color, or its own source
  let gapColorGLSL: string;
  if (typeof gapColor === "number") {
    gapColorGLSL = `vec4(dashColor.rgb, dashColor.a * ${numberToGLSLFloat(gapColor)})`;
  } else {
    const gapResolved = resolveEdgeColorValue(gapColor, "gapColor");
    gapColorGLSL = gapResolved.glsl;
    attributes.push(...gapResolved.attributes);
    needsNodeColors = needsNodeColors || gapResolved.needsNodeColors;
  }

  // Track which parameters use attributes for conditional GLSL generation
  const hasDashSizeAttr = !("value" in sizes.dashSize);
  const hasGapSizeAttr = !("value" in sizes.gapSize);
  const hasDashOffsetAttr = !("value" in sizes.dashOffset);

  (["dashSize", "gapSize", "dashOffset"] as const).forEach((key) => {
    if ("value" in sizes[key]) {
      uniforms.push({
        name: `u_${key}`,
        type: "float",
        value: sizes[key].value,
      });
    } else {
      attributes.push({
        name: `a_${key}`,
        size: 1,
        type: WebGL2RenderingContext.FLOAT,
        source: sizes[key].attribute,
      });
      uniforms.push({
        name: `u_${key}`,
        type: "float",
        value: sizes[key].default ?? 0,
      });
    }
  });

  // Helper to generate GLSL for reading dash size values
  // When attribute is used: read from varying, fall back to uniform if 0
  // When constant: just use the uniform
  const getDashSizeGLSL = (name: string, hasAttr: boolean) =>
    hasAttr ? `(v_${name} > 0.0 ? v_${name} : u_${name})` : `u_${name}`;

  // language=GLSL
  const glsl = /*glsl*/ `
// Dashed pattern layer with antialiased boundaries
// Uniforms:
//   u_dashSize: size of each dash (or default when using attribute)
//   u_gapSize: size of gaps between dashes (or default when using attribute)
//   u_dashOffset: offset to shift the pattern (or default when using attribute)
//   u_sizeMode: vec3 indicating if values are thickness-relative (x=dash, y=gap, z=offset)
//   u_align: pattern alignment (0=start, 0.5=center, 1=end)
//   u_solidExtremities: vec2(tail, head) - 1.0 means solid, 0.0 means dashed
//   u_solidMargin: vec2(tail, head) - extra solid margin in pixels
${hasDashSizeAttr ? "// Varying: v_dashSize for per-edge dash size" : ""}
${hasGapSizeAttr ? "// Varying: v_gapSize for per-edge gap size" : ""}
${hasDashOffsetAttr ? "// Varying: v_dashOffset for per-edge dash offset" : ""}

vec4 layer_dashed(EdgeContext ctx) {
  // Dash color (straight alpha, matching v_color and blendOver)
  vec4 dashColor = ${dashResolved.glsl};

  // Check for solid zones first (extremities and margins)
  // v_zone: 0=tail extremity, 1=body, 2=head extremity
  // v_tailLengthRatio and v_headLengthRatio give extremity lengths as ratio of thickness

  // Tail solid zone check
  if (u_solidExtremities.x > 0.5 && v_zone < 0.5) {
    // In tail extremity zone and solidExtremities.tail is enabled
    return dashColor;
  }
  // Head solid zone check
  if (u_solidExtremities.y > 0.5 && v_zone > 1.5) {
    // In head extremity zone and solidExtremities.head is enabled
    return dashColor;
  }

  // Compute extremity lengths in world units for margin calculation
  float tailExtremityLength = v_tailLengthRatio * ctx.thickness;
  float headExtremityLength = v_headLengthRatio * ctx.thickness;

  // Convert pixel margins to world units (same formula as thickness conversion)
  float tailMarginWorld = u_solidMargin.x * u_correctionRatio / u_sizeRatio;
  float headMarginWorld = u_solidMargin.y * u_correctionRatio / u_sizeRatio;

  // Tail margin check (margin starts after extremity zone)
  float tailSolidZone = (u_solidExtremities.x > 0.5 ? tailExtremityLength : 0.0) + tailMarginWorld;
  if (ctx.distanceFromSource < tailSolidZone) {
    return dashColor;
  }

  // Head margin check (margin starts before extremity zone)
  float headSolidZone = (u_solidExtremities.y > 0.5 ? headExtremityLength : 0.0) + headMarginWorld;
  if (ctx.distanceToTarget < headSolidZone) {
    return dashColor;
  }

  // Get dash size values (from attribute if available, otherwise uniform)
  float dashSizeValue = ${getDashSizeGLSL("dashSize", hasDashSizeAttr)};
  float gapSizeValue = ${getDashSizeGLSL("gapSize", hasGapSizeAttr)};
  float dashOffsetValue = ${getDashSizeGLSL("dashOffset", hasDashOffsetAttr)};

  // Compute actual sizes (either in pixels converted to world units, or relative to thickness)
  float pixelToWorld = u_correctionRatio / u_sizeRatio;
  float dashSize = dashSizeValue * (u_sizeMode.x > 0.5 ? ctx.thickness : pixelToWorld);
  float gapSize = gapSizeValue * (u_sizeMode.y > 0.5 ? ctx.thickness : pixelToWorld);
  float dashOffset = dashOffsetValue * (u_sizeMode.z > 0.5 ? ctx.thickness : pixelToWorld);

  // Early return when no visible dash pattern:
  // - dashSize ≈ 0: no dashes to show, return transparent (let plain layer show through)
  // - gapSize ≈ 0: all dash/no gap, effectively solid, return transparent (let plain layer handle it)
  // Threshold scales with pixelToWorld so it stays ~0.1px regardless of zoom
  float dashThreshold = 0.1 * pixelToWorld;
  if (dashSize < dashThreshold || gapSize < dashThreshold) {
    return vec4(0.0);
  }

  // Pattern length is dash + gap
  float patternLength = dashSize + gapSize;

  // Adjust distances for solid zones (pattern starts after solid zones)
  float adjustedDistFromSource = ctx.distanceFromSource - tailSolidZone;
  float adjustedDistToTarget = ctx.distanceToTarget - headSolidZone;

  // Compute alignment anchor point
  // - align: 0 → anchor at start, pattern begins with a dash
  // - align: 1 → anchor at end, pattern ends with a dash
  // - align: 0.5 → anchor at center, pattern is symmetric
  float dashedLength = adjustedDistFromSource + adjustedDistToTarget;
  float anchorDist = u_align * dashedLength;

  // Position within the repeating pattern
  // By subtracting anchorDist, we ensure the anchor point maps to position 0 in the pattern
  // This avoids the unstable mod(dashedLength, patternLength) operation
  float posInPattern = mod(adjustedDistFromSource - anchorDist + dashOffset, patternLength);

  // Compute signed distance field for the dash
  // Positive inside dash, negative inside gap
  float sdf;
  if (posInPattern < dashSize) {
    // Inside dash region [0, dashSize)
    float distToDashStart = posInPattern;
    float distToDashEnd = dashSize - posInPattern;
    sdf = min(distToDashStart, distToDashEnd);
  } else {
    // Inside gap region [dashSize, patternLength)
    float distFromDashEnd = posInPattern - dashSize;
    float distToNextDashStart = patternLength - posInPattern;
    sdf = -min(distFromDashEnd, distToNextDashStart);
  }

  // Apply antialiasing using smoothstep
  // aaWidth is in world units, same as our distance
  float dashAlpha = smoothstep(-ctx.aaWidth, ctx.aaWidth, sdf);

  // Gap color (straight alpha, like the dash color)
  vec4 gapColor = ${gapColorGLSL};

  // Blend between gap and dash colors
  return mix(gapColor, dashColor, dashAlpha);
}
`;

  return {
    name: "dashed",
    glsl,
    uniforms,
    attributes,
    needsNodeColors,
  };
}
