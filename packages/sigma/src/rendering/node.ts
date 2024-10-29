/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../sigma";
import { NodeDisplayData, NonEmptyArray, RenderParams } from "../types";
import { indexToColor } from "../utils";
import { NodeHoverDrawingFunction } from "./node-hover";
import { NodeLabelDrawingFunction } from "./node-labels";
import { AbstractProgram, Program } from "./program";

export abstract class AbstractNodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends AbstractProgram<N, E, G> {
  abstract drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  abstract drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;
  abstract process(nodeIndex: number, offset: number, data: NodeDisplayData): void;
}

export abstract class NodeProgram<
    Uniform extends string = string,
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  >
  extends Program<Uniform, N, E, G>
  implements AbstractNodeProgram<N, E, G>
{
  drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;

  kill(): void {
    super.kill();
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

class _NodeProgramClass<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> implements AbstractNodeProgram<N, E, G>
{
  constructor(_gl: WebGLRenderingContext, _pickingBuffer: WebGLFramebuffer | null, _renderer: Sigma<N, E, G>) {
    return this;
  }
  drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;

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
export type NodeProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = typeof _NodeProgramClass<N, E, G>;

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
export function createNodeCompoundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  programClasses: NonEmptyArray<NodeProgramType<N, E, G>>,
  drawLabel?: NodeLabelDrawingFunction<N, E, G>,
  drawHover?: NodeLabelDrawingFunction<N, E, G>,
): NodeProgramType<N, E, G> {
  return class NodeCompoundProgram implements AbstractNodeProgram<N, E, G> {
    programs: NonEmptyArray<AbstractNodeProgram<N, E, G>>;

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, pickingBuffer, renderer);
      }) as unknown as NonEmptyArray<AbstractNodeProgram<N, E, G>>;
    }

    drawLabel = drawLabel;

    drawHover = drawHover;

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
