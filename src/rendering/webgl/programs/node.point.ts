/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 * @module
 */
import { NodeDisplayData, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import { NodeProgram } from "./common/node";
import VERTEX_SHADER_SOURCE from "../shaders/node.point.vert.glsl";
import FRAGMENT_SHADER_SOURCE from "../shaders/node.point.frag.glsl";
import { checkDiscNodeCollision } from "../../../utils/node-collisions";
import { drawDiscNodeLabel } from "../../../utils/node-labels";
import { drawDiscNodeHover } from "../../../utils/node-hover";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_sizeRatio", "u_pixelRatio", "u_matrix"] as const;

export default class NodePointProgram extends NodeProgram<typeof UNIFORMS[number]> {
  checkCollision = checkDiscNodeCollision;
  drawLabel = drawDiscNodeLabel;
  drawHover = drawDiscNodeHover;

  getDefinition() {
    return {
      VERTICES: 1,
      VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE,
      UNIFORMS,
      ATTRIBUTES: [
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_size", size: 1, type: FLOAT },
        { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
    };
  }

  processVisibleItem(i: number, data: NodeDisplayData) {
    const array = this.array;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = floatColor(data.color);
  }

  draw(params: RenderParams): void {
    const gl = this.gl;

    const { u_sizeRatio, u_pixelRatio, u_matrix } = this.uniformLocations;

    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_pixelRatio, params.pixelRatio);
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);

    this.drawWebGL(gl.POINTS);
  }
}
