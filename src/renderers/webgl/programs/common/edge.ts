import { AbstractProgram, IProgram, RenderParams, ProcessData } from "./program";

export interface RenderEdgeParams extends RenderParams {
  edgesPowRatio: number;
}

export interface IEdgeProgram extends IProgram {
  computeIndices(): void;
  process(sourceData: any, targetData: any, data: ProcessData, offset: number): void;
  render(params: RenderEdgeParams): void;
}

/**
 * Edge Program class.
 *
 * @constructor
 */
export abstract class AbstractEdgeProgram extends AbstractProgram implements IEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  resolutionLocation: WebGLUniformLocation;
  matrixLocation: WebGLUniformLocation;

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
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");

    // Uniform Location
    const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    if (resolutionLocation === null)
      throw new Error("sigma/renderers/webgl/program/common/edge: error while getting resolutionLocation");
    this.resolutionLocation = resolutionLocation;

    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null)
      throw new Error("sigma/renderers/webgl/program/common/edge: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;
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
    gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
  }

  abstract computeIndices(): void;
  abstract process(sourceData: any, targetData: any, data: ProcessData, offset: number): void;
  abstract render(params: RenderEdgeParams): void;
}

export interface EdgeProgramConstructor {
  new (gl: WebGLRenderingContext): IEdgeProgram;
}

export function createEdgeCompoundProgram(programClasses: Array<EdgeProgramConstructor>): EdgeProgramConstructor {
  return class EdgeCompoundProgram implements IEdgeProgram {
    programs: Array<IEdgeProgram>;

    constructor(gl: WebGLRenderingContext) {
      this.programs = programClasses.map((ProgramClass) => new ProgramClass(gl));
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

    computeIndices(): void {
      this.programs.forEach((program) => program.computeIndices());
    }

    render(params: RenderEdgeParams): void {
      this.programs.forEach((program) => program.render(params));
    }

    process(sourceData: any, targetData: any, data: ProcessData, offset: number): void {
      this.programs.forEach((program) => program.process(sourceData, targetData, data, offset));
    }
  };
}
