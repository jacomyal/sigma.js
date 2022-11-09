/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes as discs, shaped by triangles using the
 * `gl.TRIANGLES` display mode. So, to draw one node, it will need to store
 * three times the center of the node, with the color, the size and an angle
 * indicating which "corner" of the triangle to draw.
 * @module
 */
import { NodeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";
import { NodeProgram } from "./common/node";
import { RenderParams } from "./common/program";
import vertexShaderSource from "../shaders/node.circle.vert.glsl";
import fragmentShaderSource from "../shaders/node.circle.frag.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const ANGLE_1 = 0;
const ANGLE_2 = (2 * Math.PI) / 3;
const ANGLE_3 = (4 * Math.PI) / 3;

const UNIFORMS = ["u_sizeRatio", "u_pixelRatio", "u_matrix"] as const;

export default class NodeCircleProgram extends NodeProgram<typeof UNIFORMS[number]> {
  VERTICES = 3;
  ARRAY_ITEMS_PER_VERTEX = 5;
  VERTEX_SHADER_SOURCE = vertexShaderSource;
  FRAGMENT_SHADER_SOURCE = fragmentShaderSource;
  UNIFORMS = UNIFORMS;
  ATTRIBUTES = [
    { name: "a_position", size: 2, type: FLOAT },
    { name: "a_size", size: 1, type: FLOAT },
    { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
    { name: "a_angle", size: 1, type: FLOAT },
  ];

  processShownItem(i: number, data: NodeDisplayData) {
    const array = this.array;

    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = ANGLE_1;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = ANGLE_2;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i] = ANGLE_3;
  }

  setUniforms(params: RenderParams): void {
    const gl = this.gl;

    const { u_sizeRatio, u_pixelRatio, u_matrix } = this.uniformLocations;

    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_pixelRatio, params.pixelRatio);
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
  }

  draw(_params: RenderParams): void {
    const gl = this.gl;

    gl.drawArrays(gl.TRIANGLES, 0, this.verticesCount);
  }
}
