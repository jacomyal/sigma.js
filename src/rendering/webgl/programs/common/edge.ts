/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import { AbstractProgram, IProgram, RenderParams } from "./program";
import { EdgeDisplayData, NodeDisplayData } from "../../../../types";
import Sigma from "../../../../sigma";

export interface IEdgeProgram extends IProgram {
  computeIndices(): void;
  process(
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    hidden: boolean,
    offset: number,
  ): void;
  render(params: RenderParams): void;
}

/**
 * Edge Program class.
 *
 * @constructor
 */
export abstract class AbstractEdgeProgram extends AbstractProgram implements IEdgeProgram {
  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    points: number,
    attributes: number,
  ) {
    super(gl, vertexShaderSource, fragmentShaderSource, points, attributes);
  }

  abstract bind(): void;
  abstract computeIndices(): void;
  abstract process(
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    hidden: boolean,
    offset: number,
  ): void;
  abstract render(params: RenderParams): void;
}

export interface EdgeProgramConstructor {
  new (gl: WebGLRenderingContext, renderer: Sigma): IEdgeProgram;
}

export function createEdgeCompoundProgram(programClasses: Array<EdgeProgramConstructor>): EdgeProgramConstructor {
  return class EdgeCompoundProgram implements IEdgeProgram {
    programs: Array<IEdgeProgram>;

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

    computeIndices(): void {
      this.programs.forEach((program) => program.computeIndices());
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => {
        program.bind();
        program.bufferData();
        program.render(params);
      });
    }

    process(
      sourceData: NodeDisplayData,
      targetData: NodeDisplayData,
      data: EdgeDisplayData,
      hidden: boolean,
      offset: number,
    ): void {
      this.programs.forEach((program) => program.process(sourceData, targetData, data, hidden, offset));
    }
  };
}
