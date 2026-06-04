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
import { SDFShape, UniformSpecification } from "../types";

interface RegisteredShapeInstance {
  shape: SDFShape;
  uniformValues: Record<string, number>;
  rotatesWithCamera: boolean;
  slug: string;
}

const shapeInstanceRegistry = new Map<string, RegisteredShapeInstance>();
const shapeIdMap = new Map<string, number>();
let nextShapeId = 0;

function generateShapeSlug(shape: SDFShape, rotatesWithCamera: boolean): string {
  let slug = shape.name;
  const nonZeroParams = shape.uniforms
    .filter((u) => u.type === "float" && u.value !== undefined && u.value !== 0)
    .map((u) => `${u.name.replace("u_", "")}=${u.value}`)
    .sort();
  if (nonZeroParams.length > 0) slug += "#" + nonZeroParams.join("#");
  if (rotatesWithCamera) slug += "#rwc";
  return slug;
}

export function registerShapeInstance(shape: SDFShape, rotatesWithCamera = false): string {
  const slug = generateShapeSlug(shape, rotatesWithCamera);
  if (!shapeInstanceRegistry.has(slug)) {
    const uniformValues: Record<string, number> = {};
    for (const u of shape.uniforms) {
      if (u.type === "float" && u.value !== undefined) uniformValues[u.name] = u.value;
    }
    shapeInstanceRegistry.set(slug, { shape, uniformValues, rotatesWithCamera, slug });
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

export function generateShapeSelectorGLSL(): string {
  const shapes = Array.from(shapeInstanceRegistry.entries());
  if (shapes.length === 0) {
    return /*glsl*/ `
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`;
  }

  const cases = shapes
    .map(([slug, registered], index) => {
      const { shape, uniformValues, rotatesWithCamera } = registered;
      const floatUniforms = shape.uniforms.filter((u) => u.type === "float");
      const paramValues = floatUniforms.map((u) => numberToGLSLFloat(uniformValues[u.name] ?? 0));
      const sdfCall =
        paramValues.length === 0
          ? `sdf_${shape.name}(queryUV, size)`
          : `sdf_${shape.name}(queryUV, size, ${paramValues.join(", ")})`;

      if (!rotatesWithCamera) {
        return `    case ${index}: { // ${slug}
      float c = cos(u_cameraAngle), s = sin(u_cameraAngle);
      vec2 queryUV = mat2(c, -s, s, c) * uv;
      return ${sdfCall};
    }`;
      }
      return `    case ${index}: // ${slug}
      return ${sdfCall.replace("queryUV", "uv")};`;
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

export function generateNodeShapeSelectorGLSL(
  shapes: SDFShape[],
  _rotatesWithCamera: boolean,
  shapeGlobalIds?: number[],
): string {
  if (shapes.length === 0) {
    return /*glsl*/ `
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;
  }

  const getSdfCall = (shape: SDFShape) => {
    const floatUniforms = shape.uniforms.filter((u) => u.type === "float") as Array<{
      name: string;
      type: "float";
      value: number;
    }>;
    const paramValues = floatUniforms.map((u) => numberToGLSLFloat(u.value ?? 0));
    return paramValues.length === 0
      ? `sdf_${shape.name}(uv, size)`
      : `sdf_${shape.name}(uv, size, ${paramValues.join(", ")})`;
  };

  if (shapes.length === 1) {
    const shape = shapes[0];
    return /*glsl*/ `
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = ${getSdfCall(shape)};
  context.inradiusFactor = ${numberToGLSLFloat(shape.inradiusFactor ?? 1.0)};
}
`;
  }

  const cases = shapes
    .map(
      (shape, index) => `    case ${index}: // ${shape.name}
      context.sdf = ${getSdfCall(shape)};
      context.inradiusFactor = ${numberToGLSLFloat(shape.inradiusFactor ?? 1.0)};
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
      context.inradiusFactor = ${numberToGLSLFloat(defaultShape.inradiusFactor ?? 1.0)};
  }
}
`;
}

export function clearShapeInstanceRegistry(): void {
  shapeInstanceRegistry.clear();
  shapeIdMap.clear();
  nextShapeId = 0;
}
