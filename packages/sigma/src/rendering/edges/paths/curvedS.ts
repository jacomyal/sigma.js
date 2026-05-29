/**
 * Sigma.js Edge Path - Curved S (S-Curve)
 * =======================================
 *
 * S-curve path using cubic Bézier with two control points.
 * Creates smooth curves with an inflection point, similar to step paths
 * but with smooth transitions instead of sharp corners.
 *
 * @module
 */
import { numberToGLSLFloat } from "../../utils";
import { EdgePath } from "../types";

/**
 * Options for S-curve path creation.
 */
export interface CurvedSPathOptions {
  /**
   * Number of segments for tessellation.
   * Higher values = smoother curve but more vertices.
   * Default: 16
   */
  segments?: number;

  /**
   * Path orientation preference.
   * - "horizontal": Control points extend horizontally (H-like curve)
   * - "vertical": Control points extend vertically (V-like curve)
   * - "automatic": Choose based on which delta is larger (abs(dx) vs abs(dy))
   * - number: Fixed angle in radians for control point direction
   * Default: "automatic"
   */
  orientation?: "horizontal" | "vertical" | "automatic" | number;

  /**
   * Whether edges rotate with camera or stay screen-aligned.
   * - false: Curves stay horizontal/vertical on screen
   * - true: Curves rotate with the graph (world-aligned)
   * Default: false
   */
  rotateWithCamera?: boolean;

  /**
   * How far control points extend from source/target, as a ratio of edge length.
   * Higher values create more pronounced curves.
   * Default: 0.5
   */
  curveOffset?: number;

  /**
   * Position of the inflection point along the curve [0-1].
   * 0.5 = centered S-curve, other values create asymmetric curves.
   * Default: 0.5
   */
  curvePosition?: number;
}

/**
 * Creates an S-curve edge path using cubic Bézier.
 *
 * The path is a cubic Bézier curve with control points positioned to create
 * smooth S-shaped transitions similar to step paths but without sharp corners.
 *
 * @param options - Path configuration
 * @returns EdgePath definition for S-curve paths
 */
export function pathCurvedS(options?: CurvedSPathOptions): EdgePath {
  const {
    segments = 16,
    orientation = "automatic",
    rotateWithCamera = false,
    curveOffset = 0.5,
    curvePosition = 0.5,
  } = options ?? {};

  // Determine orientation mode:
  // 0 = automatic, 1 = horizontal, 2 = vertical, 3 = fixed angle
  let orientationCode: number;
  let fixedAngle = 0;

  if (typeof orientation === "number") {
    orientationCode = 3;
    fixedAngle = orientation;
  } else if (orientation === "horizontal") {
    orientationCode = 1;
  } else if (orientation === "vertical") {
    orientationCode = 2;
  } else {
    orientationCode = 0;
  }

  // language=GLSL
  const glsl = /*glsl*/ `
// S-curve path constants (baked from options)
const int CURVEDS_ORIENTATION = ${orientationCode};
const float CURVEDS_FIXED_ANGLE = ${numberToGLSLFloat(fixedAngle)};
const bool CURVEDS_ROTATE_WITH_CAMERA = ${rotateWithCamera ? "true" : "false"};
const float CURVEDS_OFFSET = ${numberToGLSLFloat(curveOffset)};
const float CURVEDS_POSITION = ${numberToGLSLFloat(curvePosition)};

// ============================================================================
// HELPER: Rotate a 2D vector by angle (counter-clockwise)
// ============================================================================
vec2 curvedS_rotate(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// ============================================================================
// HELPER: Get control point direction based on orientation
// ============================================================================
vec2 getCurvedSControlDirection(vec2 source, vec2 target) {
  vec2 delta = target - source;

  if (CURVEDS_ORIENTATION == 1) {
    // Horizontal: control points extend horizontally
    return vec2(sign(delta.x), 0.0);
  } else if (CURVEDS_ORIENTATION == 2) {
    // Vertical: control points extend vertically
    return vec2(0.0, sign(delta.y));
  } else if (CURVEDS_ORIENTATION == 3) {
    // Fixed angle
    return vec2(cos(CURVEDS_FIXED_ANGLE), sin(CURVEDS_FIXED_ANGLE));
  } else {
    // Automatic: choose based on which delta is larger
    if (abs(delta.x) >= abs(delta.y)) {
      return vec2(sign(delta.x), 0.0);
    } else {
      return vec2(0.0, sign(delta.y));
    }
  }
}

// ============================================================================
// HELPER: Get cubic Bézier control points
// ============================================================================
void getCurvedSControlPoints(vec2 source, vec2 target, out vec2 c1, out vec2 c2) {
  vec2 dir = getCurvedSControlDirection(source, target);
  float dist = length(target - source);

  // Control point distances based on curveOffset
  float offset1 = dist * CURVEDS_OFFSET * CURVEDS_POSITION * 2.0;
  float offset2 = dist * CURVEDS_OFFSET * (1.0 - CURVEDS_POSITION) * 2.0;

  c1 = source + dir * offset1;
  c2 = target - dir * offset2;
}

// ============================================================================
// HELPER: Evaluate cubic Bézier: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
// ============================================================================
vec2 curvedS_cubicBezier(float t, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
  float t2 = t * t;
  float t3 = t2 * t;
  float mt = 1.0 - t;
  float mt2 = mt * mt;
  float mt3 = mt2 * mt;

  return mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
}

// ============================================================================
// HELPER: Evaluate cubic Bézier derivative: B'(t)
// ============================================================================
vec2 curvedS_cubicBezierDerivative(float t, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
  float t2 = t * t;
  float mt = 1.0 - t;
  float mt2 = mt * mt;

  // B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)
  return 3.0 * mt2 * (p1 - p0) + 6.0 * mt * t * (p2 - p1) + 3.0 * t2 * (p3 - p2);
}

// ============================================================================
// POSITION - Core function for vertex placement
// ============================================================================
vec2 path_curvedS_position(float t, vec2 source, vec2 target) {
  // Apply camera rotation if not rotating with camera
  vec2 src = source;
  vec2 tgt = target;
  if (!CURVEDS_ROTATE_WITH_CAMERA) {
    src = curvedS_rotate(source, -u_cameraAngle);
    tgt = curvedS_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Handle degenerate case (very close nodes) -> straight line
  if (length(delta) < 0.0001) {
    vec2 result = mix(src, tgt, t);
    if (!CURVEDS_ROTATE_WITH_CAMERA) {
      result = curvedS_rotate(result, u_cameraAngle);
    }
    return result;
  }

  // Get control points
  vec2 c1, c2;
  getCurvedSControlPoints(src, tgt, c1, c2);

  // Evaluate Bézier
  vec2 result = curvedS_cubicBezier(t, src, c1, c2, tgt);

  // Rotate back to world space if needed
  if (!CURVEDS_ROTATE_WITH_CAMERA) {
    result = curvedS_rotate(result, u_cameraAngle);
  }

  return result;
}
`;

  return {
    name: "curvedS",
    segments,
    minBodyLengthRatio: 0, // No minimum for S-curves
    glsl,
    uniforms: [],
    attributes: [],
  };
}
