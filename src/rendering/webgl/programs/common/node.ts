/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import Sigma from "../../../../sigma";
import { AbstractProgram, Program } from "./program";
import { NodeDisplayData, RenderParams } from "../../../../types";

export abstract class AbstractNodeProgram extends AbstractProgram {
  abstract process(offset: number, data: NodeDisplayData): void;
}

export abstract class NodeProgram<Uniform extends string = string>
  extends Program<Uniform>
  implements AbstractNodeProgram
{
  process(offset: number, data: NodeDisplayData): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.hidden) {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.array[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(i, data);
  }
  abstract processVisibleItem(i: number, data: NodeDisplayData): void;
}

export interface NodeProgramConstructor {
  new (gl: WebGLRenderingContext, renderer: Sigma): AbstractNodeProgram;
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
  return class NodeCompoundProgram implements AbstractNodeProgram {
    programs: Array<AbstractNodeProgram>;

    constructor(gl: WebGLRenderingContext, renderer: Sigma) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, renderer);
      });
    }

    reallocate(capacity: number): void {
      this.programs.forEach((program) => program.reallocate(capacity));
    }

    process(offset: number, data: NodeDisplayData): void {
      this.programs.forEach((program) => program.process(offset, data));
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => program.render(params));
    }
  };
}
