import { Attributes } from "graphology-types";

import { EdgeDisplayData, NodeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { EdgeProgram, EdgeProgramType } from "../../edge";
import { ProgramInfo } from "../../utils";
import { CreateEdgeArrowHeadProgramOptions, DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS } from "../edge-arrow-head";
import FRAGMENT_SHADER_SOURCE from "../edge-rectangle/frag.glsl";
import VERTEX_SHADER_SOURCE from "./vert.glsl";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = [
  "u_matrix",
  "u_zoomRatio",
  "u_sizeRatio",
  "u_correctionRatio",
  "u_pixelRatio",
  "u_feather",
  "u_minEdgeThickness",
  "u_lengthToThicknessRatio",
] as const;

export type CreateEdgeDoubleClampedProgramOptions = Pick<CreateEdgeArrowHeadProgramOptions, "lengthToThicknessRatio">;

export const DEFAULT_EDGE_DOUBLE_CLAMPED_PROGRAM_OPTIONS: CreateEdgeDoubleClampedProgramOptions = {
  lengthToThicknessRatio: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS.lengthToThicknessRatio,
};

export function createEdgeDoubleClampedProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<CreateEdgeDoubleClampedProgramOptions>): EdgeProgramType<N, E, G> {
  const options = {
    ...DEFAULT_EDGE_DOUBLE_CLAMPED_PROGRAM_OPTIONS,
    ...(inputOptions || {}),
  };

  return class EdgeDoubleClampedProgram<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  > extends EdgeProgram<(typeof UNIFORMS)[number], N, E, G> {
    getDefinition() {
      return {
        VERTICES: 6,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [
          { name: "a_positionStart", size: 2, type: FLOAT },
          { name: "a_positionEnd", size: 2, type: FLOAT },
          { name: "a_normal", size: 2, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_sourceRadius", size: 1, type: FLOAT },
          { name: "a_targetRadius", size: 1, type: FLOAT },
        ],
        CONSTANT_ATTRIBUTES: [
          // If 0, then position will be a_positionStart
          // If 1, then position will be a_positionEnd
          { name: "a_positionCoef", size: 1, type: FLOAT },
          { name: "a_normalCoef", size: 1, type: FLOAT },
          { name: "a_sourceRadiusCoef", size: 1, type: FLOAT },
          { name: "a_targetRadiusCoef", size: 1, type: FLOAT },
        ],
        CONSTANT_DATA: [
          [0, 1, -1, 0],
          [0, -1, 1, 0],
          [1, 1, 0, 1],
          [1, 1, 0, 1],
          [0, -1, 1, 0],
          [1, -1, 0, -1],
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
      const x1 = sourceData.x;
      const y1 = sourceData.y;
      const x2 = targetData.x;
      const y2 = targetData.y;
      const color = floatColor(data.color);

      // Computing normals
      const dx = x2 - x1;
      const dy = y2 - y1;

      const sourceRadius = sourceData.size || 1;
      const targetRadius = targetData.size || 1;

      let len = dx * dx + dy * dy;
      let n1 = 0;
      let n2 = 0;

      if (len) {
        len = 1 / Math.sqrt(len);

        n1 = -dy * len * thickness;
        n2 = dx * len * thickness;
      }

      const array = this.array;

      array[startIndex++] = x1;
      array[startIndex++] = y1;
      array[startIndex++] = x2;
      array[startIndex++] = y2;
      array[startIndex++] = n1;
      array[startIndex++] = n2;
      array[startIndex++] = color;
      array[startIndex++] = edgeIndex;
      array[startIndex++] = sourceRadius;
      array[startIndex++] = targetRadius;
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const {
        u_matrix,
        u_zoomRatio,
        u_feather,
        u_pixelRatio,
        u_correctionRatio,
        u_sizeRatio,
        u_minEdgeThickness,
        u_lengthToThicknessRatio,
      } = uniformLocations;

      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1f(u_zoomRatio, params.zoomRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_pixelRatio, params.pixelRatio);
      gl.uniform1f(u_feather, params.antiAliasingFeather);
      gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
      gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
    }
  };
}

const EdgeDoubleClampedProgram = createEdgeDoubleClampedProgram();

export default EdgeDoubleClampedProgram;
