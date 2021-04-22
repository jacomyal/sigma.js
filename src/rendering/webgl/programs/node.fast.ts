/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 * @module
 */
import { NodeAttributes } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/node.fast.vert.glsl";
import fragmentShaderSource from "../shaders/node.fast.frag.glsl";
import { AbstractNodeProgram, RenderNodeParams } from "./common/node";

const POINTS = 1,
  ATTRIBUTES = 4;

export default class NodeProgramFast extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: NodeAttributes, hidden: boolean, offset: number): void {
    const array = this.array;
    let i = offset * POINTS * ATTRIBUTES;

    if (hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      return;
    }

    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;
  }

  render(params: RenderNodeParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
