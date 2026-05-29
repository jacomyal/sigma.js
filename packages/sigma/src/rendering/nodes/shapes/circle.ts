/**
 * Sigma.js SDF Shape - Circle
 * ============================
 *
 * Signed Distance Field for a circle shape.
 *
 * @module
 */
import { SDFShape } from "../types";

/**
 * Creates a circle SDF shape.
 * A circle has no configurable options - it's always a perfect circle.
 *
 * @returns Circle SDF shape definition
 */
export function sdfCircle(): SDFShape {
  // language=GLSL
  const glsl = /*glsl*/ `
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`;

  return {
    name: "circle",
    glsl,
    uniforms: [],
  };
}
