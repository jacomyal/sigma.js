/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 * @module
 */
import { AbstractEdgeProgram }  from "sigma/rendering/webgl/programs/common/edge";
import { RenderParams } from "sigma/rendering/webgl/programs/common/program";

import fragmentShaderSource from "./edge.fast.frag.glsl";
import vertexShaderSource from "./edge.fast.vert.glsl";

let POINTS = 2;
const ATTRIBUTES = 3;

export default class EdgeGpuProgram extends AbstractEdgeProgram {
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
    if (matrixLocation === null) throw new Error("EdgeGpuProgram: error while getting matrixLocation");
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
    sourceData,
    targetData,
    data,
    hidden: boolean,
    offset: number,
  ): void {
    this.array = data.buffer.getChild('edges').toArray();
    POINTS = this.array.length / ATTRIBUTES;
    this.points = POINTS;
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
