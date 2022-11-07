/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 * @module
 */
import { NodeDisplayData, EdgeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram } from "./common/edge";
import { RenderParams } from "./common/program";
import vertexShaderSource from "../shaders/edge.line.vert.glsl";
import fragmentShaderSource from "../shaders/edge.line.frag.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_matrix"] as const;

export default class EdgeLineProgram extends EdgeProgram<typeof UNIFORMS[number]> {
  readonly VERTICES = 2;
  readonly ARRAY_ITEMS_PER_VERTEX = 3;
  readonly VERTEX_SHADER_SOURCE = vertexShaderSource;
  readonly FRAGMENT_SHADER_SOURCE = fragmentShaderSource;
  readonly UNIFORMS = UNIFORMS;
  readonly ATTRIBUTES = [
    { name: "a_position", size: 2, type: FLOAT },
    { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
  ];

  processShownItem(i: number, sourceData: NodeDisplayData, targetData: NodeDisplayData, data: EdgeDisplayData) {
    const array = this.array;

    const x1 = sourceData.x;
    const y1 = sourceData.y;
    const x2 = targetData.x;
    const y2 = targetData.y;
    const color = floatColor(data.color);

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i] = color;
  }

  setUniforms(params: RenderParams): void {
    const gl = this.gl;

    const { u_matrix } = this.uniformLocations;

    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
  }

  draw(_params: RenderParams): void {
    const gl = this.gl;

    gl.drawArrays(gl.LINES, 0, this.verticesCount);
  }
}
