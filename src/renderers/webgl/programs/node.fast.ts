/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 */
import { RenderParams, ProcessData } from "./common/program";
import { AbstractNodeProgram } from "./common/node";
import { floatColor } from "../utils";
import vertexShaderSource from "../shaders/node.fast.vert.glsl";
import fragmentShaderSource from "../shaders/node.fast.frag.glsl";

const POINTS = 1,
  ATTRIBUTES = 4;

export default class NodeProgramFast extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: ProcessData, offset: number) {
    const color = floatColor(data.color);

    let i = offset * POINTS * ATTRIBUTES;

    const array = this.array;

    if (data.hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;

      return;
    }

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;
  }

  render(params: RenderParams) {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
