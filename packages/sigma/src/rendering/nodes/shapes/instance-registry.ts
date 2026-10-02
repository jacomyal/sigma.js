/**
 * Sigma.js Shape Instance Registry
 * =================================
 *
 * Registry for shape instances used in edge clamping and GLSL generation.
 * Tracks unique shape configurations (with their uniform values) and generates
 * GLSL selector functions for GPU-side shape queries.
 *
 * @module
 */
import { numberToGLSLFloat } from "../../utils";
import { AttributeSpecification, SDFShape, UniformSpecification } from "../types";

interface RegisteredShapeInstance {
  shape: SDFShape;
  uniformValues: Record<string, number>;
  slug: string;
}

const shapeInstanceRegistry = new Map<string, RegisteredShapeInstance>();
const shapeIdMap = new Map<string, number>();
let nextShapeId = 0;

/**
 * Static fallback for a shape attribute, for edge clamping on shapes the edge
 * program's node primitives don't declare.
 */
export function getStaticAttributeDefault(shape: SDFShape, attr: AttributeSpecification): string {
  const declaredDefault = shape.variables?.[attr.source || attr.name.replace(/^a_/, "")]?.default;
  const value =
    typeof declaredDefault === "number"
      ? declaredDefault
      : typeof attr.defaultValue === "number"
        ? attr.defaultValue
        : 0;
  return numberToGLSLFloat(value);
}

/**
 * Builds a `sdf_{name}(...)` call: float uniforms baked as literals, then each
 * attribute as `attributeExpr(attr)` (the `v_<name>` varying by default).
 */
export function generateSDFCall(
  shape: SDFShape,
  uv: string,
  size: string,
  attributeExpr: (attr: AttributeSpecification) => string = (attr) => `v_${attr.name.replace(/^a_/, "")}`,
): string {
  const params = [
    uv,
    size,
    ...shape.uniforms.filter((u) => u.type === "float").map((u) => numberToGLSLFloat((u.value as number) ?? 0)),
    ...(shape.attributes ?? []).map(attributeExpr),
  ];
  return `sdf_${shape.name}(${params.join(", ")})`;
}

function generateShapeSlug(shape: SDFShape): string {
  let slug = shape.name;
  const nonZeroParams = shape.uniforms
    .filter((u) => u.type === "float" && u.value !== undefined && u.value !== 0)
    .map((u) => `${u.name.replace("u_", "")}=${u.value}`)
    .sort();
  // Attribute sources and defaults change the static fallback in querySDF.
  const attributeParams = (shape.attributes ?? []).map(
    (a) => `${a.name}@${a.source ?? ""}=${getStaticAttributeDefault(shape, a)}`,
  );
  const params = [...nonZeroParams, ...attributeParams];
  if (params.length > 0) slug += "#" + params.join("#");
  return slug;
}

// Rotation alignment is no longer baked into the shape: it's a per-node flag in
// the node-data texture, so a shape registers once regardless of orientation.
export function registerShapeInstance(shape: SDFShape): string {
  const slug = generateShapeSlug(shape);
  if (!shapeInstanceRegistry.has(slug)) {
    const uniformValues: Record<string, number> = {};
    for (const u of shape.uniforms) {
      if (u.type === "float" && u.value !== undefined) uniformValues[u.name] = u.value;
    }
    shapeInstanceRegistry.set(slug, { shape, uniformValues, slug });
    shapeIdMap.set(slug, nextShapeId++);
  }
  return slug;
}

export function getRegisteredShapeInstance(slug: string): RegisteredShapeInstance | undefined {
  return shapeInstanceRegistry.get(slug);
}

export function getShapeFromSlug(slug: string): SDFShape | undefined {
  return shapeInstanceRegistry.get(slug)?.shape;
}

export function getShapeId(slug: string): number {
  return shapeIdMap.get(slug) ?? -1;
}

export function getRegisteredShapeSlugs(): string[] {
  return Array.from(shapeInstanceRegistry.keys());
}

export function getShapeGLSL(slug: string): string {
  return shapeInstanceRegistry.get(slug)?.shape.glsl ?? "";
}

function deduplicateShapeGLSL(shapes: Iterable<SDFShape>): string {
  const glslParts: string[] = [];
  const seenHelpers = new Set<string>();
  const seenShapes = new Set<string>();
  const rotate2DPattern = /mat2 rotate2D\(float angle\)\s*\{[^}]+\}/;

  for (const shape of shapes) {
    if (seenShapes.has(shape.name)) continue;
    seenShapes.add(shape.name);
    let glsl = shape.glsl;
    if (rotate2DPattern.test(glsl)) {
      if (seenHelpers.has("rotate2D")) glsl = glsl.replace(rotate2DPattern, "");
      else seenHelpers.add("rotate2D");
    }
    glslParts.push(glsl);
  }
  return glslParts.join("\n");
}

export function getAllShapeGLSL(): string {
  return deduplicateShapeGLSL(Array.from(shapeInstanceRegistry.values()).map((r) => r.shape));
}

/**
 * Generates the global `querySDF(shapeId, uv, size)` selector, used by edge
 * clamping. Attributes listed in `dynamicAttributeNames` are read from `g_<name>`
 * globals the caller sets; others use their static default.
 *
 * querySDF is rotation-agnostic: callers pre-rotate `uv` per node.
 */
export function generateShapeSelectorGLSL(dynamicAttributeNames?: ReadonlySet<string>): string {
  const shapes = Array.from(shapeInstanceRegistry.entries());
  if (shapes.length === 0) {
    return /*glsl*/ `
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`;
  }

  const cases = shapes
    .map(([slug, { shape }], index) => {
      const sdfCall = generateSDFCall(shape, "uv", "size", (a) => {
        const name = a.name.replace(/^a_/, "");
        return dynamicAttributeNames?.has(name) ? `g_${name}` : getStaticAttributeDefault(shape, a);
      });
      return `    case ${index}: return ${sdfCall}; // ${slug}`;
    })
    .join("\n");

  return /*glsl*/ `
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${cases}
    default: return length(uv) - size;
  }
}
`;
}

export function getShapeGLSLForShapes(shapes: SDFShape[]): string {
  return deduplicateShapeGLSL(shapes);
}

/** Shape uniforms across all shapes, deduplicated by name (first occurrence wins). */
export function dedupeShapeUniforms(shapes: SDFShape[]): UniformSpecification[] {
  return [...new Map(shapes.flatMap((s) => s.uniforms).map((u) => [u.name, u])).values()];
}

export function generateNodeShapeSelectorGLSL(shapes: SDFShape[], shapeGlobalIds?: number[]): string {
  if (shapes.length === 0) {
    return /*glsl*/ `
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;
  }

  const getSdfCall = (shape: SDFShape) => generateSDFCall(shape, "uv", "size");
  const getInradiusFactor = (shape: SDFShape) =>
    shape.inradiusFactorGLSL ?? numberToGLSLFloat(shape.inradiusFactor ?? 1.0);

  if (shapes.length === 1) {
    const shape = shapes[0];
    return /*glsl*/ `
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = ${getSdfCall(shape)};
  context.inradiusFactor = ${getInradiusFactor(shape)};
}
`;
  }

  const cases = shapes
    .map(
      (shape, index) => `    case ${index}: // ${shape.name}
      context.sdf = ${getSdfCall(shape)};
      context.inradiusFactor = ${getInradiusFactor(shape)};
      break;`,
    )
    .join("\n");

  const defaultShape = shapes[0];
  let globalToLocalFunction = "";
  let shapeIdExpr = "shapeId";

  if (shapeGlobalIds && shapeGlobalIds.length > 1) {
    const conversionCases = shapeGlobalIds
      .map((globalId, localIndex) => `    case ${globalId}: return ${localIndex}; // ${shapes[localIndex].name}`)
      .join("\n");
    globalToLocalFunction = /*glsl*/ `
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
${conversionCases}
    default: return 0;
  }
}
`;
    shapeIdExpr = "globalToLocalShapeId(shapeId)";
  }

  return /*glsl*/ `${globalToLocalFunction}
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (${shapeIdExpr}) {
${cases}
    default:
      context.sdf = ${getSdfCall(defaultShape)};
      context.inradiusFactor = ${getInradiusFactor(defaultShape)};
  }
}
`;
}

export function clearShapeInstanceRegistry(): void {
  shapeInstanceRegistry.clear();
  shapeIdMap.clear();
  nextShapeId = 0;
}
