/**
 * Sigma.js Edge Shared GLSL Utilities
 * ====================================
 *
 * Common GLSL code generation functions shared between edge shaders and
 * edge label shaders. These functions generate GLSL code for:
 * - Binary search to find where path exits/enters nodes
 * - Numerical tangent/normal computation from position
 * - Auto-generated path functions (length, distance, closest_t, t_at_distance)
 * - 2D rotation helper
 *
 * @module
 */

/**
 * Generates GLSL for finding where the path exits the source node.
 * Uses binary search with node SDF to find the intersection point.
 *
 * Required uniforms: u_correctionRatio, u_sizeRatio
 * Required functions: path_{pathName}_position, path_{pathName}_length, querySDF
 *
 * @param pathName - Name of the path (e.g., "straight", "quadratic")
 * @returns GLSL function definition string
 */
export function generateFindSourceClampT(pathName: string): string {
  return /*glsl*/ `
float findSourceClampT_${pathName}(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${pathName}_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_${pathName}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`;
}

/**
 * Generates GLSL for finding where the path enters the target node.
 * Uses binary search with node SDF to find the intersection point.
 *
 * Required uniforms: u_correctionRatio, u_sizeRatio
 * Required functions: path_{pathName}_position, path_{pathName}_length, querySDF
 *
 * @param pathName - Name of the path (e.g., "straight", "quadratic")
 * @returns GLSL function definition string
 */
export function generateFindTargetClampT(pathName: string): string {
  return /*glsl*/ `
float findTargetClampT_${pathName}(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${pathName}_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_${pathName}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`;
}

/**
 * Generates GLSL code for numerical tangent and normal computation.
 * Uses finite differences on the position function to derive tangent,
 * then perpendicular rotation to derive normal.
 *
 * This allows path authors to only implement the position function,
 * and get tangent/normal for free.
 *
 * @param pathName - Name of the path (e.g., "line", "curved")
 * @returns GLSL function definitions for tangent and normal
 */
export function generateNumericalTangentNormal(pathName: string): string {
  return `
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_${pathName}_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_${pathName}_position(t1, source, target);
  vec2 p2 = path_${pathName}_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_${pathName}_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_${pathName}_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`;
}

/**
 * Generates GLSL code for 2D rotation.
 * This helper is used by step-based paths that need camera rotation handling.
 *
 * @param prefix - Prefix for the function name to avoid conflicts (e.g., "step", "stepC")
 * @returns GLSL function definition for rotation
 */
export function generateRotate2D(prefix: string): string {
  return /*glsl*/ `
// Rotate a 2D vector by angle (counter-clockwise)
vec2 ${prefix}_rotate(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}
`;
}

// ============================================================================
// Auto-generated Path Functions
// ============================================================================
// These functions are generated as fallbacks when paths don't provide their own
// implementations. They work with any path that defines a position function.

/**
 * Generates GLSL for auto-computed path length.
 * Samples the position function 16 times and sums segment lengths.
 *
 * @param pathName - Name of the path
 * @returns GLSL function definition, or empty string if path provides its own
 */
export function generateAutoLength(pathName: string): string {
  return /*glsl*/ `
// Auto-generated path length (samples position 16 times)
float path_${pathName}_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_${pathName}_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_${pathName}_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`;
}

/**
 * Generates GLSL for auto-computed closest_t.
 * Uses coarse sampling (10 points) followed by ternary search refinement.
 *
 * @param pathName - Name of the path
 * @returns GLSL function definition, or empty string if path provides its own
 */
export function generateAutoClosestT(pathName: string): string {
  return /*glsl*/ `
// Auto-generated closest_t (coarse sample + ternary search)
float path_${pathName}_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_${pathName}_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_${pathName}_position(mid1, source, target));
    float d2 = length(p - path_${pathName}_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`;
}

/**
 * Generates GLSL for auto-computed signed distance.
 * Uses closest_t to find nearest point, then computes signed distance via normal.
 *
 * @param pathName - Name of the path
 * @returns GLSL function definition, or empty string if path provides its own
 */
export function generateAutoDistance(pathName: string): string {
  return /*glsl*/ `
// Auto-generated signed distance (via closest_t + normal)
float path_${pathName}_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_${pathName}_closest_t(p, source, target);
  vec2 closest = path_${pathName}_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_${pathName}_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`;
}

/**
 * Generates GLSL for auto-computed t_at_distance.
 * Uses binary search to find the parameter t at a given arc distance.
 *
 * @param pathName - Name of the path
 * @returns GLSL function definition, or empty string if path provides its own
 */
export function generateAutoTAtDistance(pathName: string): string {
  return /*glsl*/ `
// Auto-generated t_at_distance (binary search)
float path_${pathName}_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_${pathName}_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_${pathName}_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_${pathName}_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`;
}

/**
 * Checks if a GLSL string contains a function definition.
 *
 * @param glsl - The GLSL code to search
 * @param functionName - The function name to look for
 * @returns true if the function is defined
 */
export function hasGlslFunction(glsl: string, functionName: string): boolean {
  // Match function definition patterns like:
  // float functionName(
  // vec2 functionName(
  // void functionName(
  const pattern = new RegExp(`\\b(float|vec[234]|void|int|bool)\\s+${functionName}\\s*\\(`);
  return pattern.test(glsl);
}

/**
 * Generates fallback GLSL code for any missing path functions.
 * This allows paths to only define the position function, with all other
 * functions auto-generated from it.
 *
 * The order of generation matters:
 * 1. length - depends only on position
 * 2. closest_t - depends only on position
 * 3. tangent/normal - should be generated separately via generateNumericalTangentNormal
 * 4. distance - depends on closest_t and normal
 * 5. t_at_distance - depends on length and position
 *
 * @param pathName - Name of the path
 * @param pathGlsl - The path's GLSL code (to check for existing functions)
 * @returns GLSL code for any missing functions
 */
export function generatePathFallbacks(pathName: string, pathGlsl: string): string {
  const fallbacks: string[] = [];

  // Generate length if not provided (depends only on position)
  if (!hasGlslFunction(pathGlsl, `path_${pathName}_length`)) {
    fallbacks.push(generateAutoLength(pathName));
  }

  // Generate closest_t if not provided (depends only on position)
  if (!hasGlslFunction(pathGlsl, `path_${pathName}_closest_t`)) {
    fallbacks.push(generateAutoClosestT(pathName));
  }

  // Note: tangent/normal should be generated separately via generateNumericalTangentNormal
  // They are always generated (the path can override with analyticalTangentGlsl)

  // Generate distance if not provided (depends on closest_t and normal)
  if (!hasGlslFunction(pathGlsl, `path_${pathName}_distance`)) {
    fallbacks.push(generateAutoDistance(pathName));
  }

  // Generate t_at_distance if not provided (depends on length and position)
  if (!hasGlslFunction(pathGlsl, `path_${pathName}_t_at_distance`)) {
    fallbacks.push(generateAutoTAtDistance(pathName));
  }

  if (fallbacks.length > 0) {
    return `
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
${fallbacks.join("\n")}`;
  }

  return "";
}
