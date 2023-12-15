/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 * @module
 */
import { NodeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { NodeProgram } from "../../node";
import VERTEX_SHADER_SOURCE from "./vert.glsl";
import FRAGMENT_SHADER_SOURCE from "./frag.glsl";
import { ProgramInfo } from "../../program";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_sizeRatio", "u_pixelRatio", "u_matrix"] as const;

export default class NodePointProgram extends NodeProgram<(typeof UNIFORMS)[number]> {
  getDefinition() {
    return {
      VERTICES: 1,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      METHOD: WebGLRenderingContext.POINTS,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_size", size: 1, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
    };
  }

  processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayData) {
    const array = this.array;

    array[startIndex++] = data.x;
    array[startIndex++] = data.y;
    array[startIndex++] = data.size;
    array[startIndex++] = floatColor(data.color);
    array[startIndex++] = nodeIndex;
  }

  setUniforms({ sizeRatio, pixelRatio, matrix }: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    const { u_sizeRatio, u_pixelRatio, u_matrix } = uniformLocations;

    gl.uniform1f(u_pixelRatio, pixelRatio);
    gl.uniform1f(u_sizeRatio, sizeRatio);
    gl.uniformMatrix3fv(u_matrix, false, matrix);
  }
}
