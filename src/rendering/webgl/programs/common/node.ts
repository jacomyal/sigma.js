/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import Sigma from "../../../../sigma";
import { AbstractProgram, Program } from "./program";
import { NodeDisplayData, NonEmptyArray, RenderParams } from "../../../../types";
import { NodeCollisionDetectionFunction } from "../../../../utils/node-collisions";
import { NodeLabelDrawingFunction } from "../../../../utils/node-labels";
import { NodeHoverDrawingFunction } from "../../../../utils/node-hover";

export abstract class AbstractNodeProgram extends AbstractProgram {
  abstract process(offset: number, data: NodeDisplayData): void;
  abstract checkCollision: NodeCollisionDetectionFunction;
  abstract drawLabel: NodeLabelDrawingFunction;
  abstract drawHover: NodeHoverDrawingFunction;
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
  abstract checkCollision: NodeCollisionDetectionFunction;
  abstract drawLabel: NodeLabelDrawingFunction;
  abstract drawHover: NodeHoverDrawingFunction;
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
export function createNodeCompoundProgram(
  programClasses: NonEmptyArray<NodeProgramConstructor>,
): NodeProgramConstructor {
  return class NodeCompoundProgram implements AbstractNodeProgram {
    programs: NonEmptyArray<AbstractNodeProgram>;

    constructor(gl: WebGLRenderingContext, renderer: Sigma) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, renderer);
      }) as NonEmptyArray<AbstractNodeProgram>;
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

    checkCollision(...args: Parameters<NodeCollisionDetectionFunction>): boolean {
      return this.programs.some((program) => program.checkCollision(...args));
    }
    drawLabel(...args: Parameters<NodeLabelDrawingFunction>): void {
      return this.programs[0].drawLabel(...args);
    }
    drawHover(...args: Parameters<NodeHoverDrawingFunction>): void {
      return this.programs[0].drawHover(...args);
    }
  };
}
