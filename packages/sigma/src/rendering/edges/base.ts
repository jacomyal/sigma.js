/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../../sigma";
import { EdgeDisplayData, NodeDisplayData } from "../../types";
import { indexToColor } from "../../utils";
import { Program } from "../program";
import { EdgeLabelProgramType } from "./labels";

export interface ResolvedEdgeIds {
  pathId: number;
  headId: number;
  tailId: number;
  headLengthRatio: number;
  tailLengthRatio: number;
}

export abstract class EdgeProgram<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<Uniform, N, E, G> {
  /**
   * Static reference to the associated LabelProgram class.
   * This is set by createEdgeProgram() for programs created via the factory.
   */
  static LabelProgram: EdgeLabelProgramType | undefined;

  /**
   * Resolves path/head/tail indices and length ratios for an edge.
   * Factory-created programs override this with the full resolution logic.
   * The default returns zeros (single path, no extremities).
   */
  resolveEdgeIds(_data: EdgeDisplayData, _isSelfLoop: boolean, _isParallel: boolean): ResolvedEdgeIds {
    return { pathId: 0, headId: 0, tailId: 0, headLengthRatio: 0, tailLengthRatio: 0 };
  }

  process(
    edgeIndex: number,
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    edgeTextureIndex: number,
  ): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.visibility === "hidden" || sourceData.visibility === "hidden" || targetData.visibility === "hidden") {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.floats[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data, edgeTextureIndex);
  }

  abstract processVisibleItem(
    edgeIndex: number,
    startIndex: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    edgeTextureIndex: number,
  ): void;
}

export type EdgeProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = {
  new (
    gl: WebGL2RenderingContext,
    pickingBuffer: WebGLFramebuffer | null,
    renderer: Sigma<N, E, G>,
  ): EdgeProgram<string, N, E, G>;
  LabelProgram?: EdgeLabelProgramType<N, E, G>;
};
