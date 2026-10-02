/**
 * Sigma.js SDF Shape - Rectangle
 * ===============================
 *
 * Signed Distance Field for a rectangle shape, fit inside the node's square
 * bounding box to match a given aspect ratio (width / height).
 *
 * @module
 */
import { GLSL_ROTATE_2D } from "../../glsl";
import { numberToGLSLFloat } from "../../utils";
import { SDFShape, UniformSpecification, ValueSource, isAttributeSource } from "../types";

export interface RectangleOptions {
  /**
   * Aspect ratio (width / height): a fixed number, or a node attribute.
   * @default { attribute: "aspectRatio", default: 1 }
   */
  aspectRatio?: ValueSource<number>;
  cornerRadius?: ValueSource<number>;
  rotation?: ValueSource<number>;
}

/**
 * Creates a rectangle SDF shape. Its long side spans the node's full size.
 *
 * @param options - Configuration options for the rectangle
 * @returns Rectangle SDF shape definition
 *
 * @example
 * ```typescript
 * // Same aspect ratio (2:1) for every node:
 * const wide = sdfRectangle({ aspectRatio: 2 });
 *
 * // Aspect ratio read from each node's "aspectRatio" attribute (1 when missing):
 * const perNode = sdfRectangle();
 *
 * // Same, from another attribute:
 * const fromImageRatio = sdfRectangle({ aspectRatio: { attribute: "imageRatio", default: 1 } });
 *
 * // Rounded, rotated rectangle:
 * const styled = sdfRectangle({ cornerRadius: 0.1, rotation: Math.PI / 6 });
 * ```
 */
export function sdfRectangle(options?: RectangleOptions): SDFShape {
  const { aspectRatio = { attribute: "aspectRatio" }, cornerRadius, rotation } = options ?? {};

  // language=GLSL
  const glsl = /*glsl*/ `
${GLSL_ROTATE_2D}
float sdf_rectangle(vec2 uv, float size, float cornerRadius, float rotation, float aspectRatio) {
  // Apply rotation if needed
  vec2 p = uv;
  if (rotation != 0.0) {
    p = rotate2D(rotation) * p;
  }

  vec2 halfExtent = aspectRatio >= 1.0 ? vec2(size, size / aspectRatio) : vec2(size * aspectRatio, size);
  // Keeps thin rectangles from growing past their half extent
  float radius = min(cornerRadius, min(halfExtent.x, halfExtent.y));

  // Based on Inigo Quilez's box SDF: https://iquilezles.org/articles/distfunctions2d/
  vec2 d = abs(p) - (halfExtent - radius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`;

  const uniforms: UniformSpecification[] = [
    { name: "u_cornerRadius", type: "float", value: typeof cornerRadius === "number" ? cornerRadius : 0 },
    { name: "u_rotation", type: "float", value: typeof rotation === "number" ? rotation : 0 },
  ];

  // Square's factor, scaled down by how much thinner the rectangle is. The
  // static inradiusFactor stays the square's, a safe bound for backdrops.
  const inradiusFactorGLSL = (ratio: string) => `0.70710678 / max(${ratio}, 1.0 / ${ratio})`;

  if (!isAttributeSource(aspectRatio)) {
    return {
      name: "rectangle",
      glsl,
      uniforms: [...uniforms, { name: "u_aspectRatio", type: "float", value: aspectRatio }],
      inradiusFactor: Math.SQRT1_2,
      inradiusFactorGLSL: inradiusFactorGLSL(numberToGLSLFloat(aspectRatio)),
    };
  }

  const { attribute: source, default: defaultValue = 1 } = aspectRatio;
  return {
    name: "rectangle",
    glsl,
    uniforms,
    attributes: [{ name: "aspectRatio", size: 1, type: WebGL2RenderingContext.FLOAT, source }],
    variables: { [source]: { type: "number", default: defaultValue } },
    inradiusFactor: Math.SQRT1_2,
    inradiusFactorGLSL: inradiusFactorGLSL("v_aspectRatio"),
  };
}
