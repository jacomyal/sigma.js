/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import Sigma from "../sigma";
import { AbstractProgram, Program } from "./program";
import { NodeDisplayData, EdgeDisplayData, RenderParams } from "../types";
import { EdgeLabelDrawingFunction } from "./edge-labels";
import { indexToColor } from "../utils";

export abstract class AbstractEdgeProgram extends AbstractProgram {
  static drawLabel: EdgeLabelDrawingFunction | undefined;

  abstract process(
    edgeIndex: number,
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
  static drawLabel: EdgeLabelDrawingFunction | undefined = undefined;

  kill(): void {
    return undefined;
  }

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
}

class EdgeImageClass implements AbstractEdgeProgram {
  static drawLabel: EdgeLabelDrawingFunction | undefined = undefined;

  constructor(_gl: WebGLRenderingContext, _pickingBuffer: WebGLFramebuffer | null, _renderer: Sigma) {
    return this;
  }
  kill(): void {
    return undefined;
  }
  reallocate(_capacity: number): void {
    return undefined;
  }
  process(
    _edgeIndex: number,
    _offset: number,
    _sourceData: NodeDisplayData,
    _targetData: NodeDisplayData,
    _data: EdgeDisplayData,
  ): void {
    return undefined;
  }
  render(_params: RenderParams): void {
    return undefined;
  }
}
export type EdgeProgramType = typeof EdgeImageClass;

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @param  {function} drawLabel - An optional edge "draw label" function.
 * @return {function}
 */
export function createEdgeCompoundProgram(
  programClasses: Array<EdgeProgramType>,
  drawLabel?: EdgeLabelDrawingFunction,
): EdgeProgramType {
  return class EdgeCompoundProgram implements AbstractEdgeProgram {
    static drawLabel = drawLabel;

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

    kill(): void {
      this.programs.forEach((program) => program.kill());
    }
  };
}
