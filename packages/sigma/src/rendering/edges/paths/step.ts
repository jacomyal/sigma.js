/**
 * Sigma.js Edge Path - Step (Orthogonal)
 * ======================================
 *
 * Step path for edges that renders orthogonal (right-angle) connections.
 * The path connects nodes using only horizontal and vertical segments,
 * forming a stair-step pattern.
 *
 * @module
 */
import { numberToGLSLFloat } from "../../utils";
import { generateRotate2D } from "../shared-glsl";
import { EdgePath } from "../types";

/**
 * Options for step path creation.
 */
export interface StepPathOptions {
  /**
   * Path orientation preference.
   * - "horizontal": Always go horizontal first (H→V→H)
   * - "vertical": Always go vertical first (V→H→V)
   * - "automatic": Choose based on which delta is larger (abs(dx) vs abs(dy))
   * - number: Fixed angle in radians for the first/last segments
   * Default: "automatic"
   */
  orientation?: "horizontal" | "vertical" | "automatic" | number;

  /**
   * Whether edges rotate with camera or stay screen-aligned.
   * - false: Edges stay horizontal/vertical on screen
   * - true: Edges rotate with the graph (world-aligned)
   * Default: false
   */
  rotateWithCamera?: boolean;

  /**
   * Position of the middle segment as ratio [0-1].
   * 0 = at source, 0.5 = centered, 1 = at target.
   * Default: 0.5
   */
  offset?: number;

  /**
   * Skip factor for inner corners when labels are positioned above/below.
   * The gap at inner corners = innerCornerSkipFactor * fontSize (in screen pixels).
   *
   * When a label follows the path around a corner, characters on the inner
   * (concave) side of the bend would normally bunch up and overlap. This
   * factor creates a gap at those corners to prevent overlap.
   *
   * Default: 1.0
   */
  innerCornerSkipFactor?: number;
}

/**
 * Creates a step (orthogonal) edge path with sharp corners.
 *
 * The path consists of 3 segments with 2 90° corners, forming a Z-shape or
 * step pattern depending on the orientation. Corners have perfect miter joins.
 *
 * @param options - Path configuration
 * @returns EdgePath definition for step paths
 */
export function pathStep(options?: StepPathOptions): EdgePath {
  const {
    orientation = "automatic",
    rotateWithCamera = false,
    offset = 0.5,
    innerCornerSkipFactor = 1.0,
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
// Step path constants (baked from options)
const float STEP_OFFSET = ${numberToGLSLFloat(offset)};
const int STEP_ORIENTATION = ${orientationCode};
const float STEP_FIXED_ANGLE = ${numberToGLSLFloat(fixedAngle)};
const bool STEP_ROTATE_WITH_CAMERA = ${rotateWithCamera ? "true" : "false"};

${generateRotate2D("step")}

// ============================================================================
// HELPER: Get step segment points (source, corner1, corner2, target)
// ============================================================================
void getStepSegmentPoints(vec2 source, vec2 target, out vec2 c1, out vec2 c2) {
  vec2 delta = target - source;

  // Determine orientation
  bool horizontalFirst;
  if (STEP_ORIENTATION == 1) {
    horizontalFirst = true;
  } else if (STEP_ORIENTATION == 2) {
    horizontalFirst = false;
  } else if (STEP_ORIENTATION == 3) {
    // Fixed angle mode: first segment goes in fixed direction
    vec2 dir = vec2(cos(STEP_FIXED_ANGLE), sin(STEP_FIXED_ANGLE));
    float projLen = dot(delta, dir) * STEP_OFFSET;
    c1 = source + dir * projLen;
    // Last segment goes in same fixed direction
    c2 = target - dir * (dot(delta, dir) * (1.0 - STEP_OFFSET));
    return;
  } else {
    // Automatic: choose based on which delta is larger
    horizontalFirst = abs(delta.x) >= abs(delta.y);
  }

  if (horizontalFirst) {
    // H→V→H pattern
    float midX = source.x + delta.x * STEP_OFFSET;
    c1 = vec2(midX, source.y);
    c2 = vec2(midX, target.y);
  } else {
    // V→H→V pattern
    float midY = source.y + delta.y * STEP_OFFSET;
    c1 = vec2(source.x, midY);
    c2 = vec2(target.x, midY);
  }
}

// ============================================================================
// POSITION - Core function for vertex placement
// ============================================================================
vec2 path_step_position(float t, vec2 source, vec2 target) {
  // Apply camera rotation if not rotating with camera
  vec2 src = source;
  vec2 tgt = target;
  if (!STEP_ROTATE_WITH_CAMERA) {
    src = step_rotate(source, -u_cameraAngle);
    tgt = step_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Handle degenerate case (aligned nodes) -> straight line
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    vec2 result = mix(src, tgt, t);
    if (!STEP_ROTATE_WITH_CAMERA) {
      result = step_rotate(result, u_cameraAngle);
    }
    return result;
  }

  // Get segment points
  vec2 c1, c2;
  getStepSegmentPoints(src, tgt, c1, c2);

  // Compute segment lengths
  float L1 = length(c1 - src);
  float L2 = length(c2 - c1);
  float L3 = length(tgt - c2);
  float totalLen = L1 + L2 + L3;

  // Find position along path
  float dist = t * totalLen;
  vec2 result;

  if (dist <= L1) {
    float localT = dist / max(L1, 0.0001);
    result = mix(src, c1, localT);
  } else if (dist <= L1 + L2) {
    float localT = (dist - L1) / max(L2, 0.0001);
    result = mix(c1, c2, localT);
  } else {
    float localT = (dist - L1 - L2) / max(L3, 0.0001);
    result = mix(c2, tgt, localT);
  }

  // Rotate back to world space if needed
  if (!STEP_ROTATE_WITH_CAMERA) {
    result = step_rotate(result, u_cameraAngle);
  }

  return result;
}

// ============================================================================
// LENGTH - Total path length
// ============================================================================
float path_step_length(vec2 source, vec2 target) {
  // Apply camera rotation if not rotating with camera
  vec2 src = source;
  vec2 tgt = target;
  if (!STEP_ROTATE_WITH_CAMERA) {
    src = step_rotate(source, -u_cameraAngle);
    tgt = step_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Handle degenerate case
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    return length(delta);
  }

  vec2 c1, c2;
  getStepSegmentPoints(src, tgt, c1, c2);

  return length(c1 - src) + length(c2 - c1) + length(tgt - c2);
}
`;

  // language=GLSL
  const analyticalTangentGlsl = /*glsl*/ `
// ============================================================================
// ANALYTICAL TANGENT - Exact segment direction with narrow blend at corners
// ============================================================================
// This provides precise tangent computation for edge labels, avoiding the
// 45-degree rotation artifacts that numerical differentiation causes at corners.

vec2 path_step_tangent(float t, vec2 source, vec2 target) {
  // Apply camera rotation if not rotating with camera
  vec2 src = source;
  vec2 tgt = target;
  if (!STEP_ROTATE_WITH_CAMERA) {
    src = step_rotate(source, -u_cameraAngle);
    tgt = step_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Handle degenerate case (aligned nodes) -> straight line
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    vec2 dir = length(delta) > 0.0001 ? normalize(delta) : vec2(1.0, 0.0);
    if (!STEP_ROTATE_WITH_CAMERA) {
      dir = step_rotate(dir, u_cameraAngle);
    }
    return dir;
  }

  // Get segment points
  vec2 c1, c2;
  getStepSegmentPoints(src, tgt, c1, c2);

  // Compute segment lengths and corner t values
  float L1 = length(c1 - src);
  float L2 = length(c2 - c1);
  float L3 = length(tgt - c2);
  float totalLen = L1 + L2 + L3;

  float tCorner1 = L1 / totalLen;
  float tCorner2 = (L1 + L2) / totalLen;

  // Segment directions
  vec2 dir1 = normalize(c1 - src);
  vec2 dir2 = normalize(c2 - c1);
  vec2 dir3 = normalize(tgt - c2);

  // Narrow blend zone at corners (2% of total t range)
  // This creates a smooth transition over a few characters at corners
  float blendZone = 0.02;

  vec2 tangent;
  if (t < tCorner1 - blendZone) {
    tangent = dir1;
  } else if (t < tCorner1 + blendZone) {
    float blend = smoothstep(tCorner1 - blendZone, tCorner1 + blendZone, t);
    tangent = normalize(mix(dir1, dir2, blend));
  } else if (t < tCorner2 - blendZone) {
    tangent = dir2;
  } else if (t < tCorner2 + blendZone) {
    float blend = smoothstep(tCorner2 - blendZone, tCorner2 + blendZone, t);
    tangent = normalize(mix(dir2, dir3, blend));
  } else {
    tangent = dir3;
  }

  // Rotate back to world space if needed
  if (!STEP_ROTATE_WITH_CAMERA) {
    tangent = step_rotate(tangent, u_cameraAngle);
  }

  return tangent;
}

// Normal is perpendicular to tangent
vec2 path_step_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_step_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`;

  // language=GLSL
  const cornerSkipGlsl = /*glsl*/ `
// ============================================================================
// CORNER SKIP HELPERS - For above/below label positioning on step edges
// ============================================================================
// When labels are positioned above or below a step edge, characters can
// overlap at "concave" corners (inner side of the bend). These helpers
// detect concave corners and compute skip distances to create gaps.

// Constant for inner corner skip factor (baked from options)
const float STEP_INNER_CORNER_SKIP_FACTOR = ${numberToGLSLFloat(innerCornerSkipFactor)};

// Returns the t values for the two corners of the step path.
// x = t at corner 1 (between segment A and B)
// y = t at corner 2 (between segment B and C)
vec2 path_step_getCornerTs(vec2 source, vec2 target) {
  vec2 src = source;
  vec2 tgt = target;
  if (!STEP_ROTATE_WITH_CAMERA) {
    src = step_rotate(source, -u_cameraAngle);
    tgt = step_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Degenerate case: no real corners
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    return vec2(0.5, 0.5);
  }

  vec2 c1, c2;
  getStepSegmentPoints(src, tgt, c1, c2);

  float L1 = length(c1 - src);
  float L2 = length(c2 - c1);
  float L3 = length(tgt - c2);
  float totalLen = L1 + L2 + L3;

  return vec2(L1 / totalLen, (L1 + L2) / totalLen);
}

// Determines which corners are concave relative to the label position.
// A corner is "concave" for a label if the label is on the inner side of the bend.
//
// perpOffset > 0 means "above" (left side of path direction in screen coords)
// perpOffset < 0 means "below" (right side of path direction)
//
// Returns: x = 1.0 if corner 1 is concave, 0.0 otherwise
//          y = 1.0 if corner 2 is concave, 0.0 otherwise
vec2 path_step_getCornerConcavity(vec2 source, vec2 target, float perpOffset) {
  if (abs(perpOffset) < 0.0001) {
    return vec2(0.0); // Centerline mode - no corners to skip
  }

  vec2 src = source;
  vec2 tgt = target;
  if (!STEP_ROTATE_WITH_CAMERA) {
    src = step_rotate(source, -u_cameraAngle);
    tgt = step_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;

  // Degenerate case: no corners
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    return vec2(0.0);
  }

  vec2 c1, c2;
  getStepSegmentPoints(src, tgt, c1, c2);

  // Segment directions (in rotated space)
  vec2 dir1 = normalize(c1 - src);
  vec2 dir2 = normalize(c2 - c1);
  vec2 dir3 = normalize(tgt - c2);

  // Cross product gives bend direction:
  // Positive = counter-clockwise turn (left turn)
  // Negative = clockwise turn (right turn)
  // cross(a, b) = a.x * b.y - a.y * b.x
  float bend1 = dir1.x * dir2.y - dir1.y * dir2.x;
  float bend2 = dir2.x * dir3.y - dir2.y * dir3.x;

  // A corner is concave for the label if:
  // - The bend goes one way (CW or CCW)
  // - The label is on the same side as the bend (inside the bend)
  //
  // When bend is positive (CCW/left turn) and perpOffset > 0 (above/left side),
  // the label is on the INNER side (concave) - skip needed.
  //
  // When bend is positive (CCW/left turn) and perpOffset < 0 (below/right side),
  // the label is on the OUTER side (convex) - no skip needed.
  //
  // Formula: concave if (bend * perpOffset) > 0
  float concave1 = (bend1 * perpOffset > 0.0) ? 1.0 : 0.0;
  float concave2 = (bend2 * perpOffset > 0.0) ? 1.0 : 0.0;

  return vec2(concave1, concave2);
}
`;

  return {
    name: "step",
    segments: 64,
    minBodyLengthRatio: 2, // Ensure corners stay in body zone
    linearParameterization: true, // t maps linearly to arc distance (piecewise-linear path)
    glsl,
    analyticalTangentGlsl,
    cornerSkipGlsl,
    hasSharpCorners: true,
    innerCornerSkipFactor,
    uniforms: [],
    attributes: [],
  };
}
