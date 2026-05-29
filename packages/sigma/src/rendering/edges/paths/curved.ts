/**
 * Sigma.js Edge Path - Curved (Simple Arc)
 * ========================================
 *
 * Simple curved path using a quadratic Bezier curve.
 * Creates a single arc that bends in one direction.
 *
 * @module
 */
import { ValueSource } from "../../nodes";
import { EdgePath } from "../types";

/**
 * Options for curved path creation.
 */
export interface CurvedPathOptions {
  segments?: number;
  curvature?: ValueSource<number>;
}

/**
 * Creates a simple curved edge path (single arc).
 *
 * The curve is controlled by a single control point positioned perpendicular
 * to the midpoint of the straight line between source and target. The curvature
 * parameter controls how far this control point is from the midpoint.
 *
 * @param options - Path configuration
 * @returns EdgePath definition for curved edges
 */
export function pathCurved(options?: CurvedPathOptions): EdgePath {
  const { segments = 16 } = options ?? {};

  // language=GLSL
  const glsl = /*glsl*/ `
// Compute control point from curvature
// Control point is placed perpendicular to the midpoint of source-target line
vec2 computeControlPoint(vec2 source, vec2 target, float curvature) {
  vec2 midpoint = 0.5 * (source + target);
  vec2 delta = target - source;
  // Perpendicular direction (rotated 90 degrees)
  vec2 perp = vec2(-delta.y, delta.x);
  float len = length(perp);
  if (len < 0.0001) return midpoint;
  perp = perp / len;
  // Offset by curvature * edge length
  return midpoint + perp * curvature * len;
}

// Position at parameter t ∈ [0, 1]
vec2 path_curved_position(float t, vec2 source, vec2 target) {
  float curvature = v_curvature;
  vec2 control = computeControlPoint(source, target, curvature);
  float u = 1.0 - t;
  return u * u * source + 2.0 * u * t * control + t * t * target;
}

// Derivative of quadratic Bezier (for efficient arc length computation)
vec2 path_curved_derivative(float t, vec2 source, vec2 target) {
  float curvature = v_curvature;
  vec2 control = computeControlPoint(source, target, curvature);
  // B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
  return 2.0 * (1.0 - t) * (control - source) + 2.0 * t * (target - control);
}

// Approximate arc length using 5-point Gauss-Legendre quadrature
float path_curved_length(vec2 source, vec2 target) {
  // Gauss-Legendre 5-point weights and abscissae
  const float x1 = 0.9061798459, x2 = 0.5384693101;
  const float w1 = 0.2369268850, w2 = 0.4786286705, w3 = 0.5688888889;

  // Transform from [-1,1] to [0,1]: t = 0.5 * (x + 1)
  float t1a = 0.5 * (-x1 + 1.0), t1b = 0.5 * (x1 + 1.0);
  float t2a = 0.5 * (-x2 + 1.0), t2b = 0.5 * (x2 + 1.0);

  // Evaluate derivative magnitudes at sample points
  float d1a = length(path_curved_derivative(t1a, source, target));
  float d1b = length(path_curved_derivative(t1b, source, target));
  float d2a = length(path_curved_derivative(t2a, source, target));
  float d2b = length(path_curved_derivative(t2b, source, target));
  float d3 = length(path_curved_derivative(0.5, source, target));

  // Sum weighted samples (factor of 0.5 for interval transformation)
  return 0.5 * (w1 * (d1a + d1b) + w2 * (d2a + d2b) + w3 * d3);
}
`;

  return {
    name: "curved",
    segments,
    glsl,
    uniforms: [],
    attributes: [{ name: "curvature", size: 1, type: WebGL2RenderingContext.FLOAT }],
    variables: {
      curvature: { type: "number", default: 0 },
    },
    spread: {
      variable: "curvature",
      compute: (index, count, factor) => (index - (count - 1) / 2) * factor,
    },
  };
}
