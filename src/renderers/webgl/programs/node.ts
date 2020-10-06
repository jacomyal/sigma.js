/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes as discs, shaped by triangles using the
 * `gl.TRIANGLES` display mode. So, to draw one node, it will need to store
 * three times the center of the node, with the color, the size and an angle
 * indicating which "corner" of the triangle to draw.
 */
import Program, { RenderParams, ProcessData } from "./program";
import { floatColor } from "../utils";
import vertexShaderSource from "../shaders/node.vert.glsl";
import fragmentShaderSource from "../shaders/node.frag.glsl";

const ANGLE_1 = 0,
  ANGLE_2 = (2 * Math.PI) / 3,
  ANGLE_3 = (4 * Math.PI) / 3;

const POINTS = 3,
  ATTRIBUTES = 5;

export default class NodeProgram extends Program {
  positionLocation: GLint;
  sizeLocation: GLint;
  colorLocation: GLint;
  angleLocation: GLint;
  resolutionLocation: WebGLUniformLocation;
  matrixLocation: WebGLUniformLocation;
  ratioLocation: WebGLUniformLocation;
  scaleLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.sizeLocation = gl.getAttribLocation(this.program, "a_size");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.angleLocation = gl.getAttribLocation(this.program, "a_angle");

    const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    if (resolutionLocation === null)
      throw new Error("sigma/renderers/webgl/program/node.NodeProgram: error while getting resolutionLocation");
    this.resolutionLocation = resolutionLocation;

    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null)
      throw new Error("sigma/renderers/webgl/program/node.NodeProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const ratioLocation = gl.getUniformLocation(this.program, "u_ratio");
    if (ratioLocation === null)
      throw new Error("sigma/renderers/webgl/program/node.NodeProgram: error while getting ratioLocation");
    this.ratioLocation = ratioLocation;

    const scaleLocation = gl.getUniformLocation(this.program, "u_scale");
    if (scaleLocation === null)
      throw new Error("sigma/renderers/webgl/program/node.NodeProgram: error while getting scaleLocation");
    this.scaleLocation = scaleLocation;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.sizeLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.angleLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
    gl.vertexAttribPointer(this.angleLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
  }

  allocate(capacity: number): void {
    this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
  }

  process(data: ProcessData, offset: number): void {
    const color = floatColor(data.color);

    let i = offset * POINTS * ATTRIBUTES;

    const array = this.array;
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

  computeIndices(): void {
    // nothing todo ?
  }

  bufferData(): void {
    const gl = this.gl;

    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  render(params: RenderParams): void {
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
