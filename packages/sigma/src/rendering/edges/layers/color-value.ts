/**
 * Sigma.js Edge Layers - Color Values
 * ===================================
 *
 * Shared color value-source vocabulary for edge layer options.
 *
 * @module
 */
import { colorToVec4 } from "../../../utils";
import { AttributeSpecification } from "../types";

/**
 * A color source for edge layer options:
 * - string: constant CSS color
 * - { attribute, default? }: per-edge color read from edge display data
 *   (style-bound variables included)
 * - { node: "source" | "target" }: the source or target node color, read live
 *   from the node data texture (stays in sync with node styles)
 */
export type EdgeColorValue = string | { attribute: string; default?: string } | { node: "source" | "target" };

/**
 * An EdgeColorValue resolved to GLSL, plus the requirements that come with it.
 */
export interface ResolvedEdgeColor {
  /**
   * GLSL vec4 expression (straight alpha), carrying only the color's own
   * alpha. Edge opacity is applied once to the final composited fragment by
   * the generator, never per layer color.
   */
  glsl: string;

  /** Attributes the layer must declare for this value. */
  attributes: AttributeSpecification[];

  /** Whether the layer must set `needsNodeColors`. */
  needsNodeColors: boolean;
}

/**
 * Resolves an EdgeColorValue to a fragment-shader expression.
 *
 * @param value - The color value to resolve
 * @param attributeName - Base name used when value is attribute-based
 *   (e.g. "dashColor" -> attribute a_dashColor, varying v_dashColor)
 */
export function resolveEdgeColorValue(value: EdgeColorValue, attributeName: string): ResolvedEdgeColor {
  if (typeof value === "string") {
    const [r, g, b, a] = colorToVec4(value).map((n) => n.toFixed(6));
    return {
      glsl: `vec4(${r}, ${g}, ${b}, ${a})`,
      attributes: [],
      needsNodeColors: false,
    };
  }

  if ("node" in value && value.node) {
    return {
      glsl: value.node === "source" ? "v_sourceColor" : "v_targetColor",
      attributes: [],
      needsNodeColors: true,
    };
  }

  const attr = value as { attribute: string; default?: string };
  return {
    glsl: `v_${attributeName}`,
    attributes: [
      {
        name: `a_${attributeName}`,
        size: 4,
        type: WebGL2RenderingContext.UNSIGNED_BYTE,
        normalized: true,
        source: attr.attribute,
        defaultValue: attr.default,
      },
    ],
    needsNodeColors: false,
  };
}
