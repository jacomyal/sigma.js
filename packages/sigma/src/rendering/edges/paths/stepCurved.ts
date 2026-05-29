/**
 * Sigma.js Edge Path - Step Curved (Orthogonal with Rounded Corners)
 * ==================================================================
 *
 * Step path variant with rounded corners instead of sharp 90° angles.
 * Uses quadratic Bézier curves at corners for smooth transitions.
 *
 * @module
 */
import { numberToGLSLFloat } from "../../utils";
import { generateRotate2D } from "../shared-glsl";
import { EdgePath } from "../types";

/**
 * Options for step curved path creation.
 */
export interface StepCurvedPathOptions {
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
   * Corner radius as fraction of the shortest segment.
   * Clamped to avoid overlapping corners.
   * Default: 0.4
   */
  cornerRadius?: number;
}

/**
 * Creates a step (orthogonal) edge path with rounded corners.
 *
 * The path consists of 3 segments with 2 rounded corners using quadratic
 * Bezier curves, forming a smooth Z-shape or step pattern.
 *
 * @param options - Path configuration
 * @returns EdgePath definition for step curved paths
 */
export function pathStepCurved(options?: StepCurvedPathOptions): EdgePath {
  const { orientation = "automatic", rotateWithCamera = false, offset = 0.5, cornerRadius = 0.4 } = options ?? {};

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
// Step curved path constants (baked from options)
const float STEPC_OFFSET = ${numberToGLSLFloat(offset)};
const int STEPC_ORIENTATION = ${orientationCode};
const float STEPC_FIXED_ANGLE = ${numberToGLSLFloat(fixedAngle)};
const bool STEPC_ROTATE_WITH_CAMERA = ${rotateWithCamera ? "true" : "false"};
const float STEPC_CORNER_RATIO = ${numberToGLSLFloat(cornerRadius)};

${generateRotate2D("stepC")}

// ============================================================================
// HELPER: Get taxi segment points with corner radius info
// ============================================================================
void getStepCSegmentPoints(vec2 source, vec2 target, out vec2 c1, out vec2 c2, out float cornerRadius) {
  vec2 delta = target - source;

  // Determine orientation
  bool horizontalFirst;
  if (STEPC_ORIENTATION == 1) {
    horizontalFirst = true;
  } else if (STEPC_ORIENTATION == 2) {
    horizontalFirst = false;
  } else if (STEPC_ORIENTATION == 3) {
    vec2 dir = vec2(cos(STEPC_FIXED_ANGLE), sin(STEPC_FIXED_ANGLE));
    float projLen = dot(delta, dir) * STEPC_OFFSET;
    c1 = source + dir * projLen;
    c2 = target - dir * (dot(delta, dir) * (1.0 - STEPC_OFFSET));
    float L1 = length(c1 - source);
    float L2 = length(c2 - c1);
    float L3 = length(target - c2);
    cornerRadius = min(min(L1, L2 * 0.5), L3) * STEPC_CORNER_RATIO;
    return;
  } else {
    horizontalFirst = abs(delta.x) >= abs(delta.y);
  }

  if (horizontalFirst) {
    float midX = source.x + delta.x * STEPC_OFFSET;
    c1 = vec2(midX, source.y);
    c2 = vec2(midX, target.y);
  } else {
    float midY = source.y + delta.y * STEPC_OFFSET;
    c1 = vec2(source.x, midY);
    c2 = vec2(target.x, midY);
  }

  // Compute corner radius based on shortest segment
  float L1 = length(c1 - source);
  float L2 = length(c2 - c1);
  float L3 = length(target - c2);
  cornerRadius = min(min(L1, L2 * 0.5), L3) * STEPC_CORNER_RATIO;
}

// ============================================================================
// HELPER: Quadratic bezier evaluation
// ============================================================================
vec2 stepC_bezier(vec2 p0, vec2 p1, vec2 p2, float t) {
  float mt = 1.0 - t;
  return mt * mt * p0 + 2.0 * mt * t * p1 + t * t * p2;
}

vec2 stepC_bezierTangent(vec2 p0, vec2 p1, vec2 p2, float t) {
  return normalize(2.0 * (1.0 - t) * (p1 - p0) + 2.0 * t * (p2 - p1));
}

float stepC_bezierLength(vec2 p0, vec2 p1, vec2 p2) {
  // Approximate length using 8 samples
  float len = 0.0;
  vec2 prev = p0;
  for (int i = 1; i <= 8; i++) {
    float t = float(i) / 8.0;
    vec2 curr = stepC_bezier(p0, p1, p2, t);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}

// ============================================================================
// PATH LENGTH - Total path length with rounded corners
// ============================================================================
float path_stepCurved_length(vec2 source, vec2 target) {
  vec2 src = source;
  vec2 tgt = target;
  if (!STEPC_ROTATE_WITH_CAMERA) {
    src = stepC_rotate(source, -u_cameraAngle);
    tgt = stepC_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    return length(delta);
  }

  vec2 c1, c2;
  float r;
  getStepCSegmentPoints(src, tgt, c1, c2, r);

  // Segment lengths (shortened by corner radius on each end)
  float L1 = max(length(c1 - src) - r, 0.0);
  float L2 = max(length(c2 - c1) - 2.0 * r, 0.0);
  float L3 = max(length(tgt - c2) - r, 0.0);

  // Corner arc lengths
  vec2 dir1 = normalize(c1 - src);
  vec2 dir2 = normalize(c2 - c1);
  vec2 dir3 = normalize(tgt - c2);

  vec2 corner1_start = c1 - dir1 * r;
  vec2 corner1_end = c1 + dir2 * r;
  vec2 corner2_start = c2 - dir2 * r;
  vec2 corner2_end = c2 + dir3 * r;

  float arc1 = stepC_bezierLength(corner1_start, c1, corner1_end);
  float arc2 = stepC_bezierLength(corner2_start, c2, corner2_end);

  return L1 + arc1 + L2 + arc2 + L3;
}

// ============================================================================
// POSITION - Position along rounded path
// ============================================================================
vec2 path_stepCurved_position(float t, vec2 source, vec2 target) {
  vec2 src = source;
  vec2 tgt = target;
  if (!STEPC_ROTATE_WITH_CAMERA) {
    src = stepC_rotate(source, -u_cameraAngle);
    tgt = stepC_rotate(target, -u_cameraAngle);
  }

  vec2 delta = tgt - src;
  if (abs(delta.x) < 0.0001 || abs(delta.y) < 0.0001) {
    vec2 result = mix(src, tgt, t);
    if (!STEPC_ROTATE_WITH_CAMERA) {
      result = stepC_rotate(result, u_cameraAngle);
    }
    return result;
  }

  vec2 c1, c2;
  float r;
  getStepCSegmentPoints(src, tgt, c1, c2, r);

  vec2 dir1 = normalize(c1 - src);
  vec2 dir2 = normalize(c2 - c1);
  vec2 dir3 = normalize(tgt - c2);

  // Key points
  vec2 seg1_end = c1 - dir1 * r;
  vec2 corner1_end = c1 + dir2 * r;
  vec2 seg2_end = c2 - dir2 * r;
  vec2 corner2_end = c2 + dir3 * r;

  // Segment lengths
  float L1 = length(seg1_end - src);
  float arc1 = stepC_bezierLength(seg1_end, c1, corner1_end);
  float L2 = length(seg2_end - corner1_end);
  float arc2 = stepC_bezierLength(seg2_end, c2, corner2_end);
  float L3 = length(tgt - corner2_end);
  float totalLen = L1 + arc1 + L2 + arc2 + L3;

  float dist = t * totalLen;
  vec2 result;

  if (dist <= L1) {
    float localT = dist / max(L1, 0.0001);
    result = mix(src, seg1_end, localT);
  } else if (dist <= L1 + arc1) {
    float localDist = dist - L1;
    float localT = localDist / max(arc1, 0.0001);
    result = stepC_bezier(seg1_end, c1, corner1_end, localT);
  } else if (dist <= L1 + arc1 + L2) {
    float localDist = dist - L1 - arc1;
    float localT = localDist / max(L2, 0.0001);
    result = mix(corner1_end, seg2_end, localT);
  } else if (dist <= L1 + arc1 + L2 + arc2) {
    float localDist = dist - L1 - arc1 - L2;
    float localT = localDist / max(arc2, 0.0001);
    result = stepC_bezier(seg2_end, c2, corner2_end, localT);
  } else {
    float localDist = dist - L1 - arc1 - L2 - arc2;
    float localT = localDist / max(L3, 0.0001);
    result = mix(corner2_end, tgt, localT);
  }

  if (!STEPC_ROTATE_WITH_CAMERA) {
    result = stepC_rotate(result, u_cameraAngle);
  }
  return result;
}
`;

  return {
    name: "stepCurved",
    segments: 32,
    glsl,
    uniforms: [],
    attributes: [],
  };
}
