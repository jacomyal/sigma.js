/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import { AbstractProgram, IProgram, RenderParams } from "./program";
import { NodeDisplayData } from "../../../../types";
import Sigma from "../../../../sigma";

export interface INodeProgram extends IProgram {
  process(data: NodeDisplayData, hidden: boolean, offset: number): void;
  render(params: RenderParams): void;
}

/**
 * Node Program class.
 *
 * @constructor
 */
export abstract class AbstractNodeProgram extends AbstractProgram implements INodeProgram {
  positionLocation: GLint;
  sizeLocation: GLint;
  colorLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  sizeRatioLocation: WebGLUniformLocation;
  pixelRatioLocation: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    points: number,
    attributes: number,
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource, points, attributes);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.sizeLocation = gl.getAttribLocation(this.program, "a_size");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");

    // Uniform Location
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("AbstractNodeProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const sizeRatioLocation = gl.getUniformLocation(this.program, "u_sizeRatio");
    if (sizeRatioLocation === null) throw new Error("AbstractNodeProgram: error while getting sizeRatioLocation");
    this.sizeRatioLocation = sizeRatioLocation;

    const pixelRatioLocation = gl.getUniformLocation(this.program, "u_pixelRatio");
    if (pixelRatioLocation === null) throw new Error("AbstractNodeProgram: error while getting pixelRatioLocation");
    this.pixelRatioLocation = pixelRatioLocation;
  }

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    const gl = this.gl;
    const program = this.program;

    gl.useProgram(program);

    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.uniform1f(this.sizeRatioLocation, params.sizeRatio);
    gl.uniform1f(this.pixelRatioLocation, params.pixelRatio);

    gl.drawArrays(gl.TRIANGLES, 0, this.array.length / this.attributes);
  }

  bind(): void {
    const gl = this.gl;

    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.sizeLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      12,
    );
  }

  abstract process(data: NodeDisplayData, hidden: boolean, offset: number): void;
}

export interface NodeProgramConstructor {
  new (gl: WebGLRenderingContext, renderer: Sigma): INodeProgram;
}

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
export function createNodeCompoundProgram(programClasses: Array<NodeProgramConstructor>): NodeProgramConstructor {
  return class NodeCompoundProgram implements INodeProgram {
    programs: Array<INodeProgram>;

    constructor(gl: WebGLRenderingContext, renderer: Sigma) {
      this.programs = programClasses.map((ProgramClass) => new ProgramClass(gl, renderer));
    }

    bufferData(): void {
      this.programs.forEach((program) => program.bufferData());
    }

    allocate(capacity: number): void {
      this.programs.forEach((program) => program.allocate(capacity));
    }

    bind(): void {
      // nothing todo, it's already done in each program constructor
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => {
        program.bind();
        program.bufferData();
        program.render(params);
      });
    }

    process(data: NodeDisplayData, hidden: boolean, offset: number): void {
      this.programs.forEach((program) => program.process(data, hidden, offset));
    }
  };
}
