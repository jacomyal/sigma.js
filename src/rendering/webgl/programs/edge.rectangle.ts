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
import { NodeDisplayData, EdgeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram } from "./common/edge";
import { RenderParams } from "./common/program";
import VERTEX_SHADER_SOURCE from "../shaders/edge.rectangle.vert.glsl";
import FRAGMENT_SHADER_SOURCE from "../shaders/edge.rectangle.frag.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_matrix", "u_zoomRatio", "u_dimensions"] as const;

export default class EdgeRectangleProgram extends EdgeProgram<typeof UNIFORMS[number]> {
  getDefinition() {
    return {
      VERTICES: 4,
      ARRAY_ITEMS_PER_VERTEX: 7,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_opposite", size: 2, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_direction", size: 1, type: FLOAT }, // TODO: can be a byte or a bool
        { name: "a_thickness", size: 1, type: FLOAT },
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

    const array = this.array;

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = color;
    array[i++] = 1;
    array[i++] = thickness;

    // First point flipped
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = color;
    array[i++] = -1;
    array[i++] = thickness;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;
    array[i++] = -1;
    array[i++] = thickness;

    // Second point flipped
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;
    array[i++] = 1;
    array[i++] = thickness;
  }

  draw(params: RenderParams): void {
    const gl = this.gl;

    const { u_matrix, u_zoomRatio, u_dimensions } = this.uniformLocations;

    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
    gl.uniform1f(u_zoomRatio, params.zoomRatio);
    gl.uniform2f(u_dimensions, params.width * params.pixelRatio, params.height * params.pixelRatio);

    if (!this.indicesArray) throw new Error("EdgeRectangleProgram: indicesArray should be allocated when drawing!");

    gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
  }
}
