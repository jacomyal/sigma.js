import { Attributes } from "graphology-types";

import { EdgeDisplayData, NodeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram, EdgeProgramType } from "../../edge";
import { ProgramInfo } from "../../utils";
import FRAGMENT_SHADER_SOURCE from "./frag.glsl";
import VERTEX_SHADER_SOURCE from "./vert.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGL2RenderingContext;

export type CreateEdgeArrowHeadProgramOptions = {
  lengthToThicknessRatio: number;
  widenessToThicknessRatio: number;
};

export const DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS: CreateEdgeArrowHeadProgramOptions = {
  lengthToThicknessRatio: 2.5,
  widenessToThicknessRatio: 2,
};

const UNIFORMS = [
  "u_matrix",
  "u_sizeRatio",
  "u_correctionRatio",
  "u_minEdgeThickness",
  "u_lengthToThicknessRatio",
  "u_widenessToThicknessRatio",
] as const;

export function createEdgeArrowHeadProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<CreateEdgeArrowHeadProgramOptions>): EdgeProgramType<N, E, G> {
  const options = {
    ...DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS,
    ...(inputOptions || {}),
  };

  return class EdgeArrowHeadProgram<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  > extends EdgeProgram<(typeof UNIFORMS)[number], N, E, G> {
    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
        METHOD: WebGL2RenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [
          { name: "a_position", size: 2, type: FLOAT },
          { name: "a_normal", size: 2, type: FLOAT },
          { name: "a_radius", size: 1, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          ...(this.hasDepth ? [{ name: "a_depth", size: 1, type: FLOAT }] : []),
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_barycentric", size: 3, type: FLOAT }],
        CONSTANT_DATA: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      };
    }

    processVisibleItem(
      edgeIndex: number,
      startIndex: number,
      sourceData: NodeDisplayData,
      targetData: NodeDisplayData,
      data: EdgeDisplayData,
    ) {
      const thickness = data.size || 1;
      const radius = targetData.size || 1;
      const x1 = sourceData.x;
      const y1 = sourceData.y;
      const x2 = targetData.x;
      const y2 = targetData.y;
      const color = floatColor(data.color);

      // Computing normals
      const dx = x2 - x1;
      const dy = y2 - y1;

      let len = dx * dx + dy * dy;
      let n1 = 0;
      let n2 = 0;

      if (len) {
        len = 1 / Math.sqrt(len);

        n1 = -dy * len * thickness;
        n2 = dx * len * thickness;
      }

      const array = this.array;

      array[startIndex++] = x2;
      array[startIndex++] = y2;
      array[startIndex++] = -n1;
      array[startIndex++] = -n2;
      array[startIndex++] = radius;
      array[startIndex++] = color;
      array[startIndex++] = edgeIndex;
      if (this.hasDepth) {
        array[startIndex++] = data.depth;
      }
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const {
        u_matrix,
        u_sizeRatio,
        u_correctionRatio,
        u_minEdgeThickness,
        u_lengthToThicknessRatio,
        u_widenessToThicknessRatio,
      } = uniformLocations;

      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
      gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
      gl.uniform1f(u_widenessToThicknessRatio, options.widenessToThicknessRatio);
    }
  };
}

const EdgeArrowHeadProgram = createEdgeArrowHeadProgram();

export default EdgeArrowHeadProgram;
