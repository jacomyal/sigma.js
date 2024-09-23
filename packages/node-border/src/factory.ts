import { Attributes } from "graphology-types";
import { NodeProgram, NodeProgramType, ProgramInfo } from "sigma/rendering";
import { NodeDisplayData, RenderParams } from "sigma/types";
import { colorToArray, floatColor } from "sigma/utils";

import getFragmentShader from "./shader-frag";
import getVertexShader from "./shader-vert";
import { CreateNodeBorderProgramOptions, DEFAULT_COLOR, DEFAULT_CREATE_NODE_BORDER_OPTIONS } from "./utils";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

export default function createNodeBorderProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(inputOptions?: Partial<CreateNodeBorderProgramOptions<N, E, G>>): NodeProgramType<N, E, G> {
  const options: CreateNodeBorderProgramOptions<N, E, G> = {
    ...(DEFAULT_CREATE_NODE_BORDER_OPTIONS as CreateNodeBorderProgramOptions<N, E, G>),
    ...(inputOptions || {}),
  };
  const { borders, drawLabel, drawHover } = options;

  const UNIFORMS = [
    "u_sizeRatio",
    "u_correctionRatio",
    "u_matrix",
    ...borders.flatMap(({ color }, i) => ("value" in color ? [`u_borderColor_${i + 1}`] : [])),
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
          ...borders.flatMap(({ color }, i) =>
            "attribute" in color
              ? [{ name: `a_borderColor_${i + 1}`, size: 4, type: UNSIGNED_BYTE, normalized: true }]
              : [],
          ),
          ...borders.flatMap(({ size }, i) =>
            "attribute" in size ? [{ name: `a_borderSize_${i + 1}`, size: 1, type: FLOAT }] : [],
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
      borders.forEach(({ color }) => {
        if ("attribute" in color)
          array[startIndex++] = floatColor(data[color.attribute as "color"] || color.defaultValue || DEFAULT_COLOR);
      });
      borders.forEach(({ size }) => {
        if ("attribute" in size) array[startIndex++] = data[size.attribute as "size"] || size.defaultValue;
      });
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const { u_sizeRatio, u_correctionRatio, u_matrix } = uniformLocations;

      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);

      borders.forEach(({ color }, i) => {
        if ("value" in color) {
          const location = uniformLocations[`u_borderColor_${i + 1}`];
          const [r, g, b, a] = colorToArray(color.value);
          gl.uniform4f(location, r / 255, g / 255, b / 255, a / 255);
        }
      });
    }
  };
}
