/**
 * Sigma.js Edge Layer - Plain
 * ===========================
 *
 * Solid color layer for edges.
 *
 * @module
 */
import { EdgeLayer } from "../types";

/**
 * Creates a plain solid color layer.
 *
 * The edge is rendered with its assigned color (from EdgeDisplayData.color).
 *
 * @returns EdgeLayer definition for solid color
 */
export function layerPlain(): EdgeLayer {
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
