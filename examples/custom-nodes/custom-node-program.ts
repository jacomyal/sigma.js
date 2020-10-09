/**
 * This program is a copy of src/renderers/webgl/program/node.fast.js, but with
 * a custom fragment shader (./custom-node-fragment-shader.glsl) that will draw
 * a disc inside the nodes.
 */
import { RenderParams } from "../../src/renderers/webgl/programs/common/program";
import { AbstractNodeProgram } from "../../src/renderers/webgl/programs/common/node";
import { NodeAttributes } from "../../src/types";
import { floatColor } from "../../src/renderers/webgl/utils";
import vertexShaderSource from "../../src/renderers/webgl/shaders/node.fast.vert.glsl";
import fragmentShaderSource from "./custom-node-fragment-shader.glsl";

const POINTS = 3,
  ATTRIBUTES = 5;

export default class CustomNodeProgram extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: NodeAttributes, offset: number): void {
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

  render(params: RenderParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
