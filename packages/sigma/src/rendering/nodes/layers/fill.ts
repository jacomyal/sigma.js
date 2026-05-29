/**
 * Sigma.js Fragment Layer - Fill
 * ===============================
 *
 * Simple color fill layer using the node's color attribute.
 *
 * @module
 */
import { colorToGLSLString } from "../../../utils";
import { ValueSource } from "../types";
import { FragmentLayer, isAttributeSource } from "../types";

export interface LayerFillOptions {
  color?: ValueSource<string>;
}

/**
 * Creates a fill layer that fills the shape with a color.
 * This is typically the base layer for most node programs.
 *
 * @param options - Optional configuration
 * @returns Fill layer definition
 */
export function layerFill(options?: LayerFillOptions): FragmentLayer {
  const { UNSIGNED_BYTE } = WebGL2RenderingContext;

  // Default to reading from "color" attribute
  const colorSource = options?.color ?? { attribute: "color" };

  // If a fixed value is provided, no attributes needed
  if (!isAttributeSource(colorSource)) {
    // At this point, colorSource is a string (fixed color value)
    const colorString = colorSource as string;
    // language=GLSL
    const glsl = `
vec4 layer_fill() {
  return ${colorToGLSLString(colorString)};
}
`;
    return {
      name: "fill",
      uniforms: [],
      attributes: [],
      glsl,
    };
  }

  // Use attribute-based color
  const source = colorSource.attribute;

  // language=GLSL
  const glsl = `
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`;

  return {
    name: "fill",
    uniforms: [],
    attributes: [
      {
        name: "fillColor",
        size: 4 as const,
        type: UNSIGNED_BYTE,
        normalized: true,
        source,
      },
    ],
    glsl,
  };
}
