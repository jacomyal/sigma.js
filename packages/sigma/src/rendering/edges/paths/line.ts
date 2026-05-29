/**
 * Sigma.js Edge Path - Line
 * =========================
 *
 * Straight line path for edges.
 * This is the simplest path type, rendered as a quad.
 *
 * @module
 */
import { EdgePath } from "../types";

/**
 * Creates a straight line edge path.
 *
 * Line edges are the most efficient, rendered as a single quad (6 vertices).
 * All path functions have closed-form solutions.
 *
 * @returns EdgePath definition for straight lines
 */
export function pathLine(): EdgePath {
  // language=GLSL
  const glsl = /*glsl*/ `
// Position at parameter t ∈ [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`;

  return {
    name: "straight",
    segments: 1, // Simple quad
    minBodyLengthRatio: 0, // No minimum for straight edges
    linearParameterization: true, // t maps directly to arc distance
    glsl,
    uniforms: [],
    attributes: [],
  };
}
