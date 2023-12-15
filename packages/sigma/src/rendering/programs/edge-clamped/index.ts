/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines but with a twist: the end of edge
 * does not sit in the middle of target node but instead stays by some margin.
 *
 * This is useful when combined with arrows to draw directed edges.
 * @module
 */
import EdgeRectangleProgram from "../edge-rectangle";
import VERTEX_SHADER_SOURCE from "./vert.glsl";
import { EdgeDisplayData, NodeDisplayData } from "../../../types";
import { floatColor } from "../../../utils";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

export default class EdgeClampedProgram extends EdgeRectangleProgram {
  getDefinition() {
    return {
      ...super.getDefinition(),
      VERTEX_SHADER_SOURCE,
      ATTRIBUTES: [
        { name: "a_positionStart", size: 2, type: FLOAT },
        { name: "a_positionEnd", size: 2, type: FLOAT },
        { name: "a_normal", size: 2, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
        { name: "a_radius", size: 1, type: FLOAT },
      ],
      CONSTANT_ATTRIBUTES: [
        // If 0, then position will be a_positionStart
        // If 1, then position will be a_positionEnd
        { name: "a_positionCoef", size: 1, type: FLOAT },
        { name: "a_normalCoef", size: 1, type: FLOAT },
        { name: "a_radiusCoef", size: 1, type: FLOAT },
      ],
      CONSTANT_DATA: [
        [0, 1, 0],
        [0, -1, 0],
        [1, 1, 1],
        [1, 1, 1],
        [0, -1, 0],
        [1, -1, -1],
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

    const radius = targetData.size || 1;

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
    array[startIndex++] = radius;
  }
}
