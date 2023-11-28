/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import Sigma from "../../../../sigma";
import { AbstractProgram, Program } from "./program";
import { NodeDisplayData, EdgeDisplayData, RenderParams } from "../../../../types";
import { EdgeLabelDrawingFunction } from "../../../../utils/edge-labels";
import { indexToColor } from "../../../../utils";

export abstract class AbstractEdgeProgram extends AbstractProgram {
  abstract process(
    edgeIndex: number,
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void;

  abstract drawLabel: EdgeLabelDrawingFunction;
}

export abstract class EdgeProgram<Uniform extends string = string>
  extends Program<Uniform>
  implements AbstractEdgeProgram
{
  process(
    edgeIndex: number,
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.hidden || sourceData.hidden || targetData.hidden) {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.array[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data);
  }

  abstract processVisibleItem(
    edgeIndex: number,
    startIndex: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void;

  abstract drawLabel: EdgeLabelDrawingFunction;
}

export interface EdgeProgramConstructor {
  new (gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma): AbstractEdgeProgram;
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

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, pickingBuffer, renderer);
      });
    }

    reallocate(capacity: number): void {
      this.programs.forEach((program) => program.reallocate(capacity));
    }

    process(
      edgeIndex: number,
      offset: number,
      sourceData: NodeDisplayData,
      targetData: NodeDisplayData,
      data: EdgeDisplayData,
    ): void {
      this.programs.forEach((program) => program.process(edgeIndex, offset, sourceData, targetData, data));
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => program.render(params));
    }

    drawLabel(...args: Parameters<EdgeLabelDrawingFunction>) {
      return this.programs[0].drawLabel(...args);
    }
  };
}
