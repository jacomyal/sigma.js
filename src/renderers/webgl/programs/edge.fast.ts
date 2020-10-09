/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 */
import { EdgeAttributes, NodeAttributes } from "../../../types";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";
import { floatColor } from "../utils";
import vertexShaderSource from "../shaders/edge.fast.vert.glsl";
import fragmentShaderSource from "../shaders/edge.fast.frag.glsl";

const POINTS = 2,
  ATTRIBUTES = 3;

export default class EdgeFastProgram extends AbstractEdgeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  computeIndices(): void {
    //nothing to do
  }

  process(sourceData: NodeAttributes, targetData: NodeAttributes, data: EdgeAttributes, offset: number): void {
    const array = this.array;

    let i = 0;
    if (sourceData.hidden || targetData.hidden || data.hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) array[i] = 0;
    }

    const x1 = sourceData.x,
      y1 = sourceData.y,
      x2 = targetData.x,
      y2 = targetData.y,
      color = floatColor(data.color);

    i = POINTS * ATTRIBUTES * offset;

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i] = color;
  }

  render(params: RenderEdgeParams): void {
    const gl = this.gl;
    const program = this.program;

    gl.useProgram(program);
    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.drawArrays(gl.LINES, 0, this.array.length / ATTRIBUTES);
  }
}
