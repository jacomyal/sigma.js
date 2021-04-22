/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes as discs, shaped by triangles using the
 * `gl.TRIANGLES` display mode. So, to draw one node, it will need to store
 * three times the center of the node, with the color, the size and an angle
 * indicating which "corner" of the triangle to draw.
 * @module
 */
import { NodeAttributes } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/node.vert.glsl";
import fragmentShaderSource from "../shaders/node.frag.glsl";
import { AbstractNodeProgram, RenderNodeParams } from "./common/node";

const POINTS = 3,
  ATTRIBUTES = 5;

const ANGLE_1 = 0,
  ANGLE_2 = (2 * Math.PI) / 3,
  ANGLE_3 = (4 * Math.PI) / 3;

export default class NodeProgram extends AbstractNodeProgram {
  angleLocation: GLint;
  resolutionLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations
    this.angleLocation = gl.getAttribLocation(this.program, "a_angle");

    // Resolution location
    const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    if (resolutionLocation === null) throw new Error("NodeProgram: error while getting resolutionLocation");
    this.resolutionLocation = resolutionLocation;

    // Bindings
    gl.enableVertexAttribArray(this.angleLocation);
    gl.vertexAttribPointer(
      this.angleLocation,
      1,
      gl.FLOAT,
      false,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      16,
    );

    this.bind();
  }

  process(data: NodeAttributes, hidden: boolean, offset: number): void {
    const array = this.array;
    let i = offset * POINTS * ATTRIBUTES;

    if (hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      return;
    }

    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = ANGLE_1;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = ANGLE_2;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i] = ANGLE_3;
  }

  render(params: RenderNodeParams): void {
    const gl = this.gl;
    const program = this.program;

    gl.useProgram(program);
    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
  }
}
