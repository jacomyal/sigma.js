import { Attributes } from "graphology-types";
import { EdgeProgram, ProgramInfo } from "sigma/rendering";
import { EdgeDisplayData, NodeDisplayData, RenderParams } from "sigma/types";
import { floatColor } from "sigma/utils";

import FRAGMENT_SHADER_SOURCE from "./shader-frag";
import VERTEX_SHADER_SOURCE from "./shader-vert";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_matrix", "u_sizeRatio", "u_dimensions", "u_pixelRatio"] as const;

const DEFAULT_EDGE_CURVATURE = 0.25;

export default class EdgeCurveProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends EdgeProgram<(typeof UNIFORMS)[number], N, E, G> {
  getDefinition() {
    return {
      VERTICES: 4,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      METHOD: WebGLRenderingContext.TRIANGLES,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_source", size: 2, type: FLOAT },
        { name: "a_target", size: 2, type: FLOAT },
        { name: "a_thickness", size: 1, type: FLOAT },
        { name: "a_curvature", size: 1, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
      CONSTANT_ATTRIBUTES: [
        { name: "a_current", size: 1, type: FLOAT }, // TODO: could optimize to bool
        { name: "a_direction", size: 1, type: FLOAT }, // TODO: could optimize to byte
      ],
      CONSTANT_DATA: [
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
      ],
    };
  }

  processVisibleItem(
    edgeIndex: number,
    startIndex: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData & { curvature?: number },
  ) {
    const thickness = data.size || 1;
    const x1 = sourceData.x;
    const y1 = sourceData.y;
    const x2 = targetData.x;
    const y2 = targetData.y;
    const color = floatColor(data.color);
    const curvature = typeof data.curvature === "number" ? data.curvature : DEFAULT_EDGE_CURVATURE;

    const array = this.array;

    // First point
    array[startIndex++] = x1;
    array[startIndex++] = y1;
    array[startIndex++] = x2;
    array[startIndex++] = y2;
    array[startIndex++] = thickness;
    array[startIndex++] = curvature;
    array[startIndex++] = color;
    array[startIndex++] = edgeIndex;
  }

  setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    const { u_matrix, u_pixelRatio, u_sizeRatio, u_dimensions } = uniformLocations;

    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
    gl.uniform1f(u_pixelRatio, params.pixelRatio);
    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform2f(u_dimensions, params.width * params.pixelRatio, params.height * params.pixelRatio);
  }
}
