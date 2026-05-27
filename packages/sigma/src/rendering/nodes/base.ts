/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../../sigma";
import { NodeDisplayData } from "../../types";
import { indexToColor } from "../../utils";
import { Program } from "../program";
import { BackdropProgramType } from "./backdrops";
import { LabelBackgroundProgramType, LabelProgramType } from "./labels";

export abstract class NodeProgram<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<Uniform, N, E, G> {
  // Optional methods for layer attribute texture management.
  // These are implemented by factory-created programs.
  allocateNode?(_nodeKey: string): void;
  freeNode?(_nodeKey: string): void;
  uploadLayerTexture?(): void;

  /**
   * Static reference to the associated LabelProgram class.
   * This is set by createNodeProgram() for programs created via the factory.
   */
  static LabelProgram: LabelProgramType | undefined;

  /**
   * Static reference to the associated BackdropProgram class.
   * This is set by createNodeProgram() for programs created via the factory.
   */
  static BackdropProgram: BackdropProgramType | undefined;

  /**
   * Static reference to the associated LabelBackgroundProgram class.
   * This is set by createNodeProgram() for programs created via the factory.
   */
  static LabelBackgroundProgram: LabelBackgroundProgramType | undefined;

  process(nodeIndex: number, offset: number, data: NodeDisplayData, textureIndex: number, nodeKey: string): void {
    let i = offset * this.STRIDE;
    // NOTE: dealing with hidden items automatically
    if (data.visibility === "hidden") {
      for (let l = i + this.STRIDE; i < l; i++) {
        this.floats[i] = 0;
      }
      return;
    }

    return this.processVisibleItem(indexToColor(nodeIndex), i, data, textureIndex, nodeKey);
  }

  abstract processVisibleItem(
    nodeIndex: number,
    i: number,
    data: NodeDisplayData,
    textureIndex: number,
    nodeKey: string,
  ): void;
}

export type NodeProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = {
  new (
    gl: WebGL2RenderingContext,
    pickingBuffer: WebGLFramebuffer | null,
    renderer: Sigma<N, E, G>,
  ): NodeProgram<string, N, E, G>;
  LabelProgram?: LabelProgramType<N, E, G>;
  BackdropProgram?: BackdropProgramType<N, E, G>;
  LabelBackgroundProgram?: LabelBackgroundProgramType<N, E, G>;
};
