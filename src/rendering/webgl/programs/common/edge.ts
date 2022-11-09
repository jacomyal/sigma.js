/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import Sigma from "../../../../sigma";
import { AbstractProgram, Program, RenderParams } from "./program";
import { NodeDisplayData, EdgeDisplayData } from "../../../../types";

export abstract class AbstractEdgeProgram extends AbstractProgram {
  abstract process(
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void;
}

export abstract class EdgeProgram<Uniform extends string = string>
  extends Program<Uniform>
  implements AbstractEdgeProgram
{
  process(offset: number, sourceData: NodeDisplayData, targetData: NodeDisplayData, data: EdgeDisplayData): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.hidden || sourceData.hidden || targetData.hidden) {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.array[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(i, sourceData, targetData, data);
  }
  abstract processVisibleItem(
    i: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void;
}

export interface EdgeProgramConstructor {
  new (gl: WebGLRenderingContext, renderer: Sigma): AbstractEdgeProgram;
}

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
export function createEdgeCompoundProgram(programClasses: Array<EdgeProgramConstructor>): EdgeProgramConstructor {
  return class EdgeCompoundProgram implements AbstractEdgeProgram {
    programs: Array<AbstractEdgeProgram>;

    constructor(gl: WebGLRenderingContext, renderer: Sigma) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, renderer);
      });
    }

    reallocate(capacity: number): void {
      this.programs.forEach((program) => program.reallocate(capacity));
    }

    process(offset: number, sourceData: NodeDisplayData, targetData: NodeDisplayData, data: EdgeDisplayData): void {
      this.programs.forEach((program) => program.process(offset, sourceData, targetData, data));
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => program.render(params));
    }
  };
}
