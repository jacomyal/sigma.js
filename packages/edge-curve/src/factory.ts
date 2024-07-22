import { Attributes } from "graphology-types";
import { EdgeProgram, EdgeProgramType, ProgramInfo } from "sigma/rendering";
import { EdgeDisplayData, NodeDisplayData, RenderParams } from "sigma/types";
import { floatColor } from "sigma/utils";

import { createDrawCurvedEdgeLabel } from "./edge-labels";
import getFragmentShader from "./shader-frag";
import getVertexShader from "./shader-vert";
import { CreateEdgeCurveProgramOptions, DEFAULT_EDGE_CURVATURE, DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS } from "./utils";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

export default function createEdgeCurveProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<CreateEdgeCurveProgramOptions<N, E, G>>): EdgeProgramType<N, E, G> {
  const options: CreateEdgeCurveProgramOptions = {
    ...DEFAULT_EDGE_CURVE_PROGRAM_OPTIONS,
    ...(inputOptions || {}),
  };
  const { arrowHead, curvatureAttribute, drawLabel } = options as CreateEdgeCurveProgramOptions<N, E, G>;

  return class EdgeCurveProgram extends EdgeProgram<string, N, E, G> {
    drawLabel = drawLabel || createDrawCurvedEdgeLabel<N, E, G>(options);

    getDefinition() {
      return {
        VERTICES: 6,
        VERTEX_SHADER_SOURCE: getVertexShader(options),
        FRAGMENT_SHADER_SOURCE: getFragmentShader(options),
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS: [
          "u_matrix",
          "u_sizeRatio",
          "u_dimensions",
          "u_pixelRatio",
          "u_feather",
          "u_minEdgeThickness",
          ...(arrowHead ? ["u_lengthToThicknessRatio", "u_widenessToThicknessRatio"] : []),
          ...(this.hasDepth ? ["a_maxDepth"] : []),
        ],
        ATTRIBUTES: [
          { name: "a_source", size: 2, type: FLOAT },
          { name: "a_target", size: 2, type: FLOAT },
          ...(arrowHead ? [{ name: "a_targetSize", size: 1, type: FLOAT }] : []),
          { name: "a_thickness", size: 1, type: FLOAT },
          { name: "a_curvature", size: 1, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          ...(this.hasDepth ? [{ name: "a_depth", size: 1, type: FLOAT }] : []),
        ],
        CONSTANT_ATTRIBUTES: [
          { name: "a_current", size: 1, type: FLOAT }, // TODO: could optimize to bool
          { name: "a_direction", size: 1, type: FLOAT }, // TODO: could optimize to byte
        ],
        CONSTANT_DATA: [
          [0, 1],
          [0, -1],
          [1, 1],
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
      data: EdgeDisplayData,
    ) {
      const thickness = data.size || 1;
      const x1 = sourceData.x;
      const y1 = sourceData.y;
      const x2 = targetData.x;
      const y2 = targetData.y;
      const color = floatColor(data.color);
      const curvature = data[curvatureAttribute as "size"] ?? DEFAULT_EDGE_CURVATURE;

      const array = this.array;

      // First point
      array[startIndex++] = x1;
      array[startIndex++] = y1;
      array[startIndex++] = x2;
      array[startIndex++] = y2;
      if (arrowHead) array[startIndex++] = targetData.size;
      array[startIndex++] = thickness;
      array[startIndex++] = curvature;
      array[startIndex++] = color;
      array[startIndex++] = edgeIndex;
      if (this.hasDepth) {
        array[startIndex++] = data.depth;
      }
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const { u_matrix, u_pixelRatio, u_feather, u_sizeRatio, u_dimensions, u_minEdgeThickness } = uniformLocations;

      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1f(u_pixelRatio, params.pixelRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniform1f(u_feather, params.antiAliasingFeather);
      gl.uniform2f(u_dimensions, params.width * params.pixelRatio, params.height * params.pixelRatio);
      gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);

      if (this.hasDepth) gl.uniform1f(uniformLocations.a_maxDepth, params.maxEdgesDepth);

      if (arrowHead) {
        const { u_lengthToThicknessRatio, u_widenessToThicknessRatio } = uniformLocations;

        gl.uniform1f(u_lengthToThicknessRatio, arrowHead.lengthToThicknessRatio);
        gl.uniform1f(u_widenessToThicknessRatio, arrowHead.widenessToThicknessRatio);
      }
    }
  };
}
