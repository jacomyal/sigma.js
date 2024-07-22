/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 * @module
 */
import { Attributes } from "graphology-types";

import { EdgeDisplayData, NodeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram } from "../../edge";
import { ProgramInfo } from "../../utils";
import FRAGMENT_SHADER_SOURCE from "./frag.glsl";
import VERTEX_SHADER_SOURCE from "./vert.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

export default class EdgeLineProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends EdgeProgram<string, N, E, G> {
  getDefinition() {
    return {
      VERTICES: 2,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      METHOD: WebGLRenderingContext.LINES,
      UNIFORMS: ["u_matrix", ...(this.hasDepth ? ["a_maxDepth"] : [])],
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
        ...(this.hasDepth ? [{ name: "a_depth", size: 1, type: FLOAT }] : []),
      ],
    };
  }

  processVisibleItem(
    edgeIndex: number,
    startIndex: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ) {
    const array = this.array;

    const x1 = sourceData.x;
    const y1 = sourceData.y;
    const x2 = targetData.x;
    const y2 = targetData.y;
    const color = floatColor(data.color);

    // First point
    array[startIndex++] = x1;
    array[startIndex++] = y1;
    array[startIndex++] = color;
    array[startIndex++] = edgeIndex;
    if (this.hasDepth) {
      array[startIndex++] = data.depth;
    }

    // Second point
    array[startIndex++] = x2;
    array[startIndex++] = y2;
    array[startIndex++] = color;
    array[startIndex++] = edgeIndex;
    if (this.hasDepth) {
      array[startIndex++] = data.depth;
    }
  }

  setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    const { u_matrix } = uniformLocations;

    gl.uniformMatrix3fv(u_matrix, false, params.matrix);

    if (this.hasDepth) gl.uniform1f(uniformLocations.a_maxDepth, params.maxEdgesDepth);
  }
}
