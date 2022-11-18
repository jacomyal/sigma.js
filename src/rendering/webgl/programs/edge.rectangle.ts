/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 * @module
 */
import { NodeDisplayData, EdgeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram } from "./common/edge";
import VERTEX_SHADER_SOURCE from "../shaders/edge.rectangle.vert.glsl";
import FRAGMENT_SHADER_SOURCE from "../shaders/edge.rectangle.frag.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio"] as const;

export default class EdgeRectangleProgram extends EdgeProgram<typeof UNIFORMS[number]> {
  getDefinition() {
    return {
      VERTICES: 4,
      ARRAY_ITEMS_PER_VERTEX: 5,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_normal", size: 2, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
    };
  }

  reallocateIndices() {
    const l = this.verticesCount;
    const size = l + l / 2;
    const indices = new this.IndicesArray(size);

    for (let i = 0, c = 0; i < l; i += 4) {
      indices[c++] = i;
      indices[c++] = i + 1;
      indices[c++] = i + 2;
      indices[c++] = i + 2;
      indices[c++] = i + 1;
      indices[c++] = i + 3;
    }

    this.indicesArray = indices;
  }

  processVisibleItem(i: number, sourceData: NodeDisplayData, targetData: NodeDisplayData, data: EdgeDisplayData) {
    const thickness = data.size || 1;
    const x1 = sourceData.x;
    const y1 = sourceData.y;
    const x2 = targetData.x;
    const y2 = targetData.y;
    const color = floatColor(data.color);

    // Computing normals
    const dx = x2 - x1;
    const dy = y2 - y1;

    let len = dx * dx + dy * dy;
    let n1 = 0;
    let n2 = 0;

    if (len) {
      len = 1 / Math.sqrt(len);

      n1 = -dy * len * thickness;
      n2 = dx * len * thickness;
    }

    const array = this.array;

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = n1;
    array[i++] = n2;
    array[i++] = color;

    // First point flipped
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = color;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = n1;
    array[i++] = n2;
    array[i++] = color;

    // Second point flipped
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i] = color;
  }

  draw(params: RenderParams): void {
    const gl = this.gl;

    const { u_matrix, u_zoomRatio, u_correctionRatio, u_sizeRatio } = this.uniformLocations;

    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
    gl.uniform1f(u_zoomRatio, params.zoomRatio);
    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_correctionRatio, params.correctionRatio);

    if (!this.indicesArray) throw new Error("EdgeRectangleProgram: indicesArray should be allocated when drawing!");

    gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
  }
}
