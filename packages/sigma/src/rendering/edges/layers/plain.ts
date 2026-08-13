/**
 * Sigma.js Edge Layer - Plain
 * ===========================
 *
 * Solid color layer for edges.
 *
 * @module
 */
import { EdgeLayer } from "../types";
import { EdgeColorValue, resolveEdgeColorValue } from "./color-value";

export interface LayerPlainOptions {
  /**
   * Fill color. Accepts a constant color, a per-edge attribute, or a node
   * color reference (e.g. `{ node: "source" }` for edges wearing their source
   * node's color).
   *
   * Default: the edge's own color (`color` style).
   */
  color?: EdgeColorValue;
}

/**
 * Creates a plain solid color layer.
 *
 * @param options - Optional configuration
 * @returns EdgeLayer definition for solid color
 */
export function layerPlain(options?: LayerPlainOptions): EdgeLayer {
  const color = options?.color;

  // Default: the edge's own color (edge opacity already folded in)
  if (color === undefined) {
    // language=GLSL
    const glsl = /*glsl*/ `
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`;

    return {
      name: "plain",
      glsl,
      uniforms: [],
      attributes: [],
    };
  }

  const resolved = resolveEdgeColorValue(color, "plainColor");

  // language=GLSL
  const glsl = /*glsl*/ `
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return ${resolved.glsl};
}
`;

  return {
    name: "plain",
    glsl,
    uniforms: [],
    attributes: resolved.attributes,
    needsNodeColors: resolved.needsNodeColors,
  };
}
