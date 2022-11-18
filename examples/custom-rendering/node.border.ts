/**
 * This class copies sigma/rendering/webgl/programs/node.circle, but with a tiny
 * difference: The fragment shader ("./node.border.frag.glsl") draws a white
 * disc with a colored border.
 */
/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 * @module
 */
import { NodeDisplayData, RenderParams } from "sigma/types";
import { floatColor } from "sigma/utils";
import { NodeProgram } from "sigma/rendering/webgl/programs/common/node";
import VERTEX_SHADER_SOURCE from "!raw-loader!./node.border.vert.glsl";
import FRAGMENT_SHADER_SOURCE from "!raw-loader!./node.border.frag.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_sizeRatio", "u_pixelRatio", "u_matrix"] as const;

export default class NodeBorderProgram extends NodeProgram<typeof UNIFORMS[number]> {
  getDefinition() {
    return {
      VERTICES: 1,
      ARRAY_ITEMS_PER_VERTEX: 4,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_size", size: 1, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
    };
  }

  processVisibleItem(i: number, data: NodeDisplayData) {
    const array = this.array;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = floatColor(data.color);
  }

  draw(params: RenderParams): void {
    const gl = this.gl;

    const { u_sizeRatio, u_pixelRatio, u_matrix } = this.uniformLocations;

    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_pixelRatio, params.pixelRatio);
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.verticesCount);
  }
}
