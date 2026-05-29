/**
 * Sigma.js Edge Extremity - Arrow
 * ================================
 *
 * Arrow head/tail decoration for edges.
 *
 * @module
 */
import { EdgeExtremity } from "../types";

/**
 * Options for arrow extremity creation.
 */
export interface ArrowExtremityOptions {
  lengthRatio?: number;
  widthRatio?: number;
  margin?: number;
}

/**
 * Creates an arrow extremity (triangular arrow head).
 *
 * The arrow is rendered as a triangle pointing in the direction of travel.
 * Size is relative to edge thickness.
 *
 * @param options - Arrow configuration
 * @returns EdgeExtremity definition for arrow
 */
export function extremityArrow(options?: ArrowExtremityOptions): EdgeExtremity {
  const { lengthRatio = 5, widthRatio = 4.0, margin = 0 } = options ?? {};

  // language=GLSL
  const glsl = /*glsl*/ `
// Arrow SDF: triangle with base at x=0, tip at x=lengthRatio
// uv.x: 0 (base) to lengthRatio (tip), uv.y: [-halfW, +halfW]
// Returns signed distance (negative inside, positive outside)
float extremity_arrow(vec2 uv, float lengthRatio, float widthRatio) {
  float x = uv.x;
  float y = abs(uv.y);
  float halfW = widthRatio * 0.5;

  // Past the tip: euclidean distance to tip point
  if (x > lengthRatio) {
    return length(vec2(x - lengthRatio, y));
  }

  // Back edge: signed distance to x=0 line
  float backDist = -x;

  // Side edge: signed distance to sloped triangle edge
  float clampedX = max(0.0, x);
  float maxY = halfW * (1.0 - clampedX / lengthRatio);
  float sideDist = y - maxY;

  // Convex shape SDF = max of half-plane distances
  return max(backDist, sideDist);
}
`;

  return {
    name: "arrow",
    glsl,
    length: lengthRatio,
    widthFactor: widthRatio,
    margin,
    uniforms: [],
    attributes: [],
  };
}
