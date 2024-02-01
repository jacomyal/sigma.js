/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import Sigma from "../sigma";
import { AbstractProgram, Program } from "./program";
import { NodeDisplayData, NonEmptyArray, RenderParams } from "../types";
import { NodeLabelDrawingFunction } from "./node-labels";
import { NodeHoverDrawingFunction } from "./node-hover";
import { indexToColor } from "../utils";

export abstract class AbstractNodeProgram extends AbstractProgram {
  static drawLabel: NodeLabelDrawingFunction | undefined;
  static drawHover: NodeHoverDrawingFunction | undefined;
  abstract process(nodeIndex: number, offset: number, data: NodeDisplayData): void;
}

export abstract class NodeProgram<Uniform extends string = string>
  extends Program<Uniform>
  implements AbstractNodeProgram
{
  static drawLabel: NodeLabelDrawingFunction | undefined = undefined;
  static drawHover: NodeHoverDrawingFunction | undefined = undefined;

  kill(): void {
    return undefined;
  }

  process(nodeIndex: number, offset: number, data: NodeDisplayData): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.hidden) {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.array[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(indexToColor(nodeIndex), i, data);
  }

  abstract processVisibleItem(nodeIndex: number, i: number, data: NodeDisplayData): void;
}

class NodeImageClass implements AbstractNodeProgram {
  static drawLabel: NodeLabelDrawingFunction | undefined = undefined;
  static drawHover: NodeHoverDrawingFunction | undefined = undefined;

  constructor(_gl: WebGLRenderingContext, _pickingBuffer: WebGLFramebuffer | null, _renderer: Sigma) {
    return this;
  }
  kill(): void {
    return undefined;
  }
  reallocate(_capacity: number): void {
    return undefined;
  }
  process(_nodeIndex: number, _offset: number, _data: NodeDisplayData): void {
    return undefined;
  }
  render(_params: RenderParams): void {
    return undefined;
  }
}
export type NodeProgramType = typeof NodeImageClass;

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @param  {function} drawLabel - An optional node "draw label" function.
 * @param  {function} drawHover - An optional node "draw hover" function.
 * @return {function}
 */
export function createNodeCompoundProgram(
  programClasses: NonEmptyArray<NodeProgramType>,
  drawLabel?: NodeLabelDrawingFunction,
  drawHover?: NodeLabelDrawingFunction,
): NodeProgramType {
  return class NodeCompoundProgram implements AbstractNodeProgram {
    static drawLabel = drawLabel;
    static drawHover = drawHover;

    programs: NonEmptyArray<AbstractNodeProgram>;

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, pickingBuffer, renderer);
      }) as unknown as NonEmptyArray<AbstractNodeProgram>;
    }

    reallocate(capacity: number): void {
      this.programs.forEach((program) => program.reallocate(capacity));
    }

    process(nodeIndex: number, offset: number, data: NodeDisplayData): void {
      this.programs.forEach((program) => program.process(nodeIndex, offset, data));
    }

    render(params: RenderParams): void {
      this.programs.forEach((program) => program.render(params));
    }

    kill(): void {
      this.programs.forEach((program) => program.kill());
    }
  };
}
