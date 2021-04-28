/**
 * This program is a copy of src/renderers/webgl/program/node.fast.js, but with
 * a custom fragment shader (./custom-node-fragment-shader.glsl) that will draw
 * a disc inside the nodes.
 */
import { AbstractNodeProgram, RenderNodeParams } from "../../src/rendering/webgl/programs/common/node";
import { NodeAttributes } from "../../src/types";
import { floatColor } from "../../src/utils";
import vertexShaderSource from "../../src/rendering/webgl/shaders/node.fast.vert.glsl";
import fragmentShaderSource from "./custom-node-fragment-shader.glsl";

const POINTS = 3,
  ATTRIBUTES = 5;

export default class CustomNodeProgram extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: NodeAttributes, hidden: boolean, offset: number): void {
    let i = offset * POINTS * ATTRIBUTES;
    const array = this.array;

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
