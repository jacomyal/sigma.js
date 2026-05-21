import Sigma from "sigma";
import type { ExtractDepthLayersFromPrimitives, PrimitivesDeclaration } from "sigma/types";

import { WebGLLayerProgramType } from "./webgl-layer-program";

// Counter for ids generated when bindWebGLLayer is called without an explicit one.
let autoLayerId = 0;

/**
 * Binds a custom WebGL layer program to a Sigma instance.
 *
 * - `depth` is the depth layer to render at; it must be one of the renderer's
 *   declared `depthLayers`. Several layers may share the same depth.
 * - `id` optionally identifies the layer. When omitted, a unique id is
 *   generated. Pass an explicit id to make repeated calls replace the layer
 *   instead of stacking new ones (e.g. when re-binding on every data change).
 *
 * Returns a cleanup function that removes this layer.
 */
export default function bindWebGLLayer<P extends PrimitivesDeclaration>(
  depth: ExtractDepthLayersFromPrimitives<P>,
  // Custom node/edge/graph state doesn't affect layer binding, so any Sigma is accepted:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: Sigma<any, any, any, any, any, any, P>,
  ProgramClass: WebGLLayerProgramType,
  id: string = `webgl-layer-${autoLayerId++}`,
): () => void {
  const gl = renderer.getWebGLContext();
  const program = new ProgramClass(gl, null, renderer);
  renderer.addCustomLayerProgram(id, depth, program);

  return () => renderer.removeCustomLayerProgram(id);
}
