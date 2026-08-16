/**
 * Sigma.js Node Piechart Layer
 * ============================
 *
 * Fragment layer for rendering piechart nodes.
 * Works with any SDF shape from the composable node program system.
 *
 * @module
 */
import { AttributeSpecification, FragmentLayer, UniformSpecification, numberToGLSLFloat } from "sigma/rendering";
import { colorToVec4 } from "sigma/utils";

import { DEFAULT_COLOR, LayerPiechartOptions } from "./types";

const TWO_PI = 2 * Math.PI;

/**
 * Types extracted from LayerPiechartOptions.
 */
type SliceItem = NonNullable<NonNullable<LayerPiechartOptions["slices"]>[number]>;
type SliceColor = SliceItem["color"];
type SliceValue = SliceItem["value"];
type OffsetValue = LayerPiechartOptions["offset"];

/**
 * Type guards for slice color variants
 */
function isFixedColor(color: SliceColor): color is string {
  return typeof color === "string";
}

function isAttributeColor(color: SliceColor): color is { attribute: string; default?: string } {
  return typeof color === "object" && color !== null && "attribute" in color;
}

/**
 * Type guard for slice value attribute variant
 */
function isAttributeValue(value: SliceValue): value is { attribute: string; default?: number } {
  return typeof value === "object" && value !== null && "attribute" in value;
}

/**
 * Type guards for offset variants
 */
function isFixedOffset(offset: OffsetValue): offset is number {
  return typeof offset === "number";
}

function isAttributeOffset(offset: OffsetValue): offset is { attribute: string; default?: number } {
  return typeof offset === "object" && offset !== null && "attribute" in offset;
}

/**
 * Generates the GLSL code for the piechart layer function.
 * Uses the global `context` struct for context (sdf, uv, etc.).
 */
function generatePiechartGLSL(slices: NonNullable<LayerPiechartOptions["slices"]>, offset: OffsetValue): string {
  // Build function parameters: attributes first (as varyings), then uniforms
  // This order must match what the generator produces in generator.ts
  const attributeParams = [
    ...(isAttributeOffset(offset) ? ["float v_offset"] : []),
    ...slices.flatMap(({ color }, i) => (isAttributeColor(color) ? [`vec4 v_sliceColor_${i + 1}`] : [])),
    ...slices.flatMap(({ value }, i) => (isAttributeValue(value) ? [`float v_sliceValue_${i + 1}`] : [])),
  ];

  const uniformParams = [
    ...(isFixedOffset(offset) ? ["float u_offset"] : []),
    "vec4 u_defaultColor",
    ...slices.flatMap(({ color }, i) => (isFixedColor(color) ? [`vec4 u_sliceColor_${i + 1}`] : [])),
  ];

  // Combine all params with proper formatting
  const allParams = [...attributeParams, ...uniformParams].join(", ");

  // Generate color assignments
  const colorAssignments = slices
    .map(({ color }, i) => {
      if (isAttributeColor(color)) {
        return `  vec4 sliceColor_${i + 1} = v_sliceColor_${i + 1};`;
      } else {
        return `  vec4 sliceColor_${i + 1} = u_sliceColor_${i + 1};`;
      }
    })
    .join("\n");

  // Generate color bias adjustments
  const colorBiasAdjustments = slices.map((_, i) => `  sliceColor_${i + 1}.a *= bias;`).join("\n");

  // Generate value assignments
  const valueAssignments = slices
    .map(({ value }, i) => {
      const valueGLSL = isAttributeValue(value)
        ? `v_sliceValue_${i + 1}`
        : numberToGLSLFloat(typeof value === "number" ? value : 1);
      return `  float sliceValue_${i + 1} = ${valueGLSL};`;
    })
    .join("\n");

  // Generate total calculation
  const totalCalc = slices.map((_, i) => `sliceValue_${i + 1}`).join(" + ");

  // Generate boundary angle calculations and antialiased color blending
  const angleCalculations = slices
    .map(
      (_, i) => `    float angle_${i + 1} = angle_${i} + sliceValue_${i + 1} * ${numberToGLSLFloat(TWO_PI)} / total;`,
    )
    .join("\n");

  const colorBlends = slices
    .slice(1)
    .map(
      (_, i) =>
        `  color = mix(color, sliceColor_${i + 2}, smoothstep(angle_${i + 1} - aa, angle_${i + 1} + aa, angle));`,
    )
    .join("\n");

  // Build the complete GLSL function
  // language=GLSL
  const glsl = /*glsl*/ `
vec4 layer_piechart(${allParams}) {
  const float bias = 255.0 / 254.0;
  float offsetValue = ${isAttributeOffset(offset) ? "v_offset" : "u_offset"};

  // Calculate angle from UV coordinates
  // atan2(y, x) gives angle in [-PI, PI], we convert to [0, 2*PI]
  // Note: Camera rotation is handled at the program level (vertex shader)
  float angle = atan(context.uv.y, context.uv.x);
  if (angle < 0.0) angle += ${numberToGLSLFloat(TWO_PI)};

  // Apply offset
  angle = angle + offsetValue;
  angle = mod(angle, ${numberToGLSLFloat(TWO_PI)});

  // Set up colors
${colorAssignments}
${colorBiasAdjustments}

  // Set up values
${valueAssignments}

  // Normalize slice values into boundary angles
  float total = ${totalCalc};

  // Fall back to default color if all slices are zero
  if (total <= 0.0) {
    vec4 fallback = u_defaultColor;
    fallback.a *= bias;
    return fallback;
  }

  float angle_0 = 0.0;
${angleCalculations}

  // ~1px expressed in angle units at this radius (arc length = radius * angle)
  float r = length(context.uv);
  float aa = context.aaWidth / max(r, context.aaWidth);

  vec4 color = sliceColor_1;
${colorBlends}

  // Blend the last/first boundary across the mod() seam at 0 / 2*PI
  color = mix(sliceColor_${slices.length}, color, smoothstep(-aa, aa, angle));
  color = mix(color, sliceColor_1, smoothstep(${numberToGLSLFloat(TWO_PI)} - aa, ${numberToGLSLFloat(TWO_PI)} + aa, angle));

  return color;
}
`;

  return glsl;
}

/**
 * Creates a piechart layer that renders slices around a shape.
 * The piechart follows the contour of whatever SDF shape is used.
 *
 * @param options - Piechart configuration options
 * @returns FragmentLayer definition
 *
 * @example
 * ```typescript
 * // Simple piechart with fixed colors
 * const piechartLayer = layerPiechart({
 *   slices: [
 *     { color: "#ff0000", value: { attribute: "value1" } },
 *     { color: "#00ff00", value: { attribute: "value2" } },
 *     { color: "#0000ff", value: { attribute: "value3" } },
 *   ],
 * });
 *
 * // Use with createNodeProgram
 * const program = createNodeProgram({
 *   shapes: [sdfCircle()],
 *   layers: [piechartLayer],
 * });
 * ```
 */
export function layerPiechart(options?: LayerPiechartOptions): FragmentLayer {
  const slices = options?.slices ?? [];
  const offset = options?.offset ?? 0;
  const defaultColor = options?.defaultColor ?? DEFAULT_COLOR;

  if (slices.length === 0) {
    // Return a no-op layer if no slices defined
    return {
      name: "piechart",
      uniforms: [],
      attributes: [],
      glsl: "vec4 layer_piechart() { return vec4(0.0); }",
    };
  }

  const { UNSIGNED_BYTE, FLOAT } = WebGL2RenderingContext;

  // Generate uniforms
  const uniforms: UniformSpecification[] = [
    // Offset uniform (if value-based)
    ...(isFixedOffset(offset) ? [{ name: "u_offset", type: "float" as const, value: offset }] : []),
    // Default color uniform
    { name: "u_defaultColor", type: "vec4" as const, value: colorToVec4(defaultColor) },
    // Slice color uniforms (if value-based)
    ...slices.flatMap(({ color }, i) =>
      isFixedColor(color) ? [{ name: `u_sliceColor_${i + 1}`, type: "vec4" as const, value: colorToVec4(color) }] : [],
    ),
  ];

  // Generate attributes
  const attributes: AttributeSpecification[] = [
    // Offset attribute (if attribute-based)
    ...(isAttributeOffset(offset)
      ? [
          {
            name: "offset",
            size: 1 as const,
            type: FLOAT,
            source: offset.attribute,
            defaultValue: offset.default,
          },
        ]
      : []),
    // Slice color attributes (if attribute-based)
    ...slices.flatMap(({ color }, i) =>
      isAttributeColor(color)
        ? [
            {
              name: `sliceColor_${i + 1}`,
              size: 4 as const,
              type: UNSIGNED_BYTE,
              normalized: true,
              source: color.attribute,
              defaultValue: color.default || DEFAULT_COLOR,
            },
          ]
        : [],
    ),
    // Slice value attributes (if attribute-based)
    ...slices.flatMap(({ value }, i) =>
      isAttributeValue(value)
        ? [
            {
              name: `sliceValue_${i + 1}`,
              size: 1 as const,
              type: FLOAT,
              source: value.attribute,
              defaultValue: value.default,
            },
          ]
        : [],
    ),
  ];

  return {
    name: "piechart",
    uniforms,
    attributes,
    glsl: generatePiechartGLSL(slices, offset),
  };
}
