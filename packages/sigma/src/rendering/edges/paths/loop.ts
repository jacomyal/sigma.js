/**
 * Sigma.js Edge Path - Loop (Self-Loop)
 * ======================================
 *
 * Teardrop-shaped loop path for self-referencing edges, built from a cubic
 * Bézier curve. The edge exits the node at one angle and re-enters at a
 * nearby angle, forming a smooth rounded loop in between.
 *
 * @module
 */
import { EdgePath } from "../types";

/**
 * Options for loop path creation.
 */
export interface LoopPathOptions {
  /**
   * Number of segments for tessellation.
   * Higher values produce a smoother curve.
   * Default: 32
   */
  segments?: number;
}

/**
 * Creates a loop edge path for self-referencing edges.
 *
 * The shape is a cubic Bézier that exits the node at `loopAngle - spread/2`
 * and re-enters at `loopAngle + spread/2`, with both tangents orthogonal to
 * the node surface. The bulge extends outward by `loopRadius` node-radii.
 *
 * Per-edge attributes:
 * - `loopRadius`: how far the loop extends (multiplier of node visual radius, default 4)
 * - `loopAngle`: direction of the loop (radians, 0 = right, default π/4)
 * - `loopSpread`: angular separation between exit and entry (radians, default ~80°)
 * - `loopFixedOrientation`: when 1, compensates for camera rotation
 *
 * @param options - Path configuration
 * @returns EdgePath definition for loop edges
 */
export function pathLoop(options?: LoopPathOptions): EdgePath {
  const { segments = 32 } = options ?? {};

  // language=GLSL
  const glsl = /*glsl*/ `
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic Bézier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the Bézier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`;

  return {
    name: "loop",
    segments,
    glsl,
    needsNodeSize: true,
    uniforms: [],
    attributes: [
      { name: "loopRadius", size: 1, type: WebGL2RenderingContext.FLOAT },
      { name: "loopAngle", size: 1, type: WebGL2RenderingContext.FLOAT },
      { name: "loopSpread", size: 1, type: WebGL2RenderingContext.FLOAT },
      { name: "loopFixedOrientation", size: 1, type: WebGL2RenderingContext.FLOAT },
    ],
    variables: {
      loopRadius: { type: "number", default: 4 },
      loopAngle: { type: "number", default: Math.PI / 4 },
      loopSpread: { type: "number", default: (80 * Math.PI) / 180 },
      loopFixedOrientation: { type: "number", default: 0 },
    },
    // Stack parallel self-loops concentrically: each gets a larger radius
    spread: {
      variable: "loopRadius",
      compute: (index) => index + 4,
    },
  };
}
