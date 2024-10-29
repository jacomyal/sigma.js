/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../sigma";
import { EdgeDisplayData, NodeDisplayData, RenderParams } from "../types";
import { indexToColor } from "../utils";
import { EdgeLabelDrawingFunction } from "./edge-labels";
import { AbstractProgram, Program } from "./program";

export abstract class AbstractEdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends AbstractProgram<N, E, G> {
  abstract drawLabel: EdgeLabelDrawingFunction<N, E, G> | undefined;

  abstract process(
    edgeIndex: number,
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
  ): void;
}

export abstract class EdgeProgram<
    Uniform extends string = string,
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  >
  extends Program<Uniform, N, E, G>
  implements AbstractEdgeProgram<N, E, G>
{
  drawLabel: EdgeLabelDrawingFunction<N, E, G> | undefined = undefined;

  kill(): void {
    super.kill();
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

class _EdgeProgramClass<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> implements AbstractEdgeProgram<N, E, G>
{
  constructor(_gl: WebGLRenderingContext, _pickingBuffer: WebGLFramebuffer | null, _renderer: Sigma<N, E, G>) {
    return this;
  }

  drawLabel: EdgeLabelDrawingFunction<N, E, G> | undefined = undefined;

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
export type EdgeProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = typeof _EdgeProgramClass<N, E, G>;

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @param  {function} drawLabel - An optional edge "draw label" function.
 * @return {function}
 */
export function createEdgeCompoundProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  programClasses: Array<EdgeProgramType<N, E, G>>,
  drawLabel?: EdgeLabelDrawingFunction<N, E, G>,
): EdgeProgramType<N, E, G> {
  return class EdgeCompoundProgram implements AbstractEdgeProgram<N, E, G> {
    programs: Array<AbstractEdgeProgram<N, E, G>>;

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      this.programs = programClasses.map((Program) => {
        return new Program(gl, pickingBuffer, renderer);
      });
    }

    drawLabel = drawLabel;

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
