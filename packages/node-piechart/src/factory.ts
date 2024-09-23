import { Attributes } from "graphology-types";
import { NodeProgram, NodeProgramType, ProgramInfo } from "sigma/rendering";
import { NodeDisplayData, PartialButFor, RenderParams } from "sigma/types";
import { colorToArray, floatColor } from "sigma/utils";

import getFragmentShader from "./shader-frag";
import getVertexShader from "./shader-vert";
import { CreateNodePiechartProgramOptions, DEFAULT_COLOR, DEFAULT_CREATE_NODE_PIECHART_OPTIONS } from "./utils";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

export default function createNodePiechartProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions: PartialButFor<CreateNodePiechartProgramOptions<N, E, G>, "slices">): NodeProgramType<N, E, G> {
  const options: CreateNodePiechartProgramOptions<N, E, G> = {
    ...(DEFAULT_CREATE_NODE_PIECHART_OPTIONS as Omit<CreateNodePiechartProgramOptions<N, E, G>, "slices">),
    ...inputOptions,
  };
  const { slices, offset, drawHover, drawLabel } = options;

  const UNIFORMS = [
    "u_sizeRatio",
    "u_correctionRatio",
    "u_cameraAngle",
    "u_matrix",
    "u_defaultColor",
    ...("value" in offset ? ["u_offset"] : []),
    ...slices.flatMap(({ color }, i) => ("value" in color ? [`u_sliceColor_${i + 1}`] : [])),
  ];

  return class NodeBorderProgram extends NodeProgram<(typeof UNIFORMS)[number], N, E, G> {
    static readonly ANGLE_1 = 0;
    static readonly ANGLE_2 = (2 * Math.PI) / 3;
    static readonly ANGLE_3 = (4 * Math.PI) / 3;
    drawLabel = drawLabel;
    drawHover = drawHover;

    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE: getVertexShader(options),
        FRAGMENT_SHADER_SOURCE: getFragmentShader(options),
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [
          { name: "a_position", size: 2, type: FLOAT },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_size", size: 1, type: FLOAT },
          ...("attribute" in offset ? [{ name: "a_offset", size: 1, type: FLOAT }] : []),
          ...slices.flatMap(({ color }, i) =>
            "attribute" in color
              ? [{ name: `a_sliceColor_${i + 1}`, size: 4, type: UNSIGNED_BYTE, normalized: true }]
              : [],
          ),
          ...slices.flatMap(({ value }, i) =>
            "attribute" in value ? [{ name: `a_sliceValue_${i + 1}`, size: 1, type: FLOAT }] : [],
          ),
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_angle", size: 1, type: FLOAT }],
        CONSTANT_DATA: [[NodeBorderProgram.ANGLE_1], [NodeBorderProgram.ANGLE_2], [NodeBorderProgram.ANGLE_3]],
      };
    }

    processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayData) {
      const array = this.array;

      array[startIndex++] = data.x;
      array[startIndex++] = data.y;
      array[startIndex++] = nodeIndex;
      array[startIndex++] = data.size;
      if ("attribute" in offset) {
        array[startIndex++] = data[offset.attribute as "size"] || 0;
      }
      slices.forEach(({ color }) => {
        if ("attribute" in color)
          array[startIndex++] = floatColor(data[color.attribute as "color"] || color.defaultValue || DEFAULT_COLOR);
      });
      slices.forEach(({ value }) => {
        if ("attribute" in value) {
          array[startIndex++] = data[value.attribute as "size"] || 0;
        }
      });
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const { u_sizeRatio, u_correctionRatio, u_cameraAngle, u_matrix, u_defaultColor } = uniformLocations;

      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniform1f(u_cameraAngle, params.cameraAngle);
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);

      if ("value" in offset) gl.uniform1f(uniformLocations.u_offset, offset.value);

      const [r, g, b, a] = colorToArray(options.defaultColor || DEFAULT_COLOR);
      gl.uniform4f(u_defaultColor, r / 255, g / 255, b / 255, a / 255);

      slices.forEach(({ color }, i) => {
        if ("value" in color) {
          const location = uniformLocations[`u_sliceColor_${i + 1}`];
          const [r, g, b, a] = colorToArray(color.value);
          gl.uniform4f(location, r / 255, g / 255, b / 255, a / 255);
        }
      });
    }
  };
}
