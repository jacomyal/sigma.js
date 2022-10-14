/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 * @module
 */
import { EdgeDisplayData, NodeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/edge.fast.vert.glsl";
import fragmentShaderSource from "../shaders/edge.fast.frag.glsl";
import { AbstractEdgeProgram } from "./common/edge";
import { RenderParams } from "./common/program";

const POINTS = 2,
  ATTRIBUTES = 3;

export default class EdgeFastProgram extends AbstractEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  matrixLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations:
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");

    // Uniform locations:
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeFastProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.colorLocation);

    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      8,
    );
  }

  computeIndices(): void {
    //nothing to do
  }

  process(
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    hidden: boolean,
    offset: number,
  ): void {
    const array = this.array;

    let i = 0;
    if (hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) array[i] = 0;
      return;
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

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    const gl = this.gl;
    const program = this.program;

    gl.useProgram(program);

    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.LINES, 0, this.array.length / ATTRIBUTES);
  }
}
