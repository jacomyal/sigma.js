/**
 * Sigma.js WebGL Renderer Triangle Edge Program
 * ==============================================
 *
 * Program rendering directed edges as a single anti-aliased triangle.
 * @module
 */
import { EdgeAttributes, NodeAttributes } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/edge.triangle.vert.glsl";
import fragmentShaderSource from "../shaders/edge.triangle.frag.glsl";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";

const POINTS = 3,
  ATTRIBUTES = 9;

export default class EdgeTriangleProgram extends AbstractEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  normalLocation: GLint;
  thicknessLocation: GLint;
  barycentricLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  resolutionLocation: WebGLUniformLocation;
  ratioLocation: WebGLUniformLocation;
  scaleLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.normalLocation = gl.getAttribLocation(this.program, "a_normal");
    this.thicknessLocation = gl.getAttribLocation(this.program, "a_thickness");
    this.barycentricLocation = gl.getAttribLocation(this.program, "a_barycentric");

    // Uniform locations
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeTriangleProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    if (resolutionLocation === null) throw new Error("EdgeTriangleProgram: error while getting resolutionLocation");
    this.resolutionLocation = resolutionLocation;

    const ratioLocation = gl.getUniformLocation(this.program, "u_ratio");
    if (ratioLocation === null) throw new Error("EdgeTriangleProgram: error while getting ratioLocation");
    this.ratioLocation = ratioLocation;

    const scaleLocation = gl.getUniformLocation(this.program, "u_scale");
    if (scaleLocation === null) throw new Error("EdgeTriangleProgram: error while getting scaleLocation");
    this.scaleLocation = scaleLocation;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.normalLocation);
    gl.enableVertexAttribArray(this.thicknessLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.barycentricLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    gl.vertexAttribPointer(
      this.barycentricLocation,
      3,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      24,
    );
  }

  process(
    sourceData: NodeAttributes,
    targetData: NodeAttributes,
    data: EdgeAttributes,
    hidden: boolean,
    offset: number,
  ): void {
    let i = 0;
    if (hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) this.array[i] = 0;
    }

    const thickness = data.size || 1,
      x1 = sourceData.x,
      y1 = sourceData.y,
      x2 = targetData.x,
      y2 = targetData.y,
      color = floatColor(data.color);

    // Computing normals
    const dx = x2 - x1,
      dy = y2 - y1;

    let len = dx * dx + dy * dy,
      n1 = 0,
      n2 = 0;

    if (len) {
      len = 1 / Math.sqrt(len);

      n1 = -dy * len;
      n2 = dx * len;
    }

    i = POINTS * ATTRIBUTES * offset;

    const array = this.array;

    // TODO: I guess it's not necessary to pass normals to the shader here

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = n1;
    array[i++] = n2;
    array[i++] = thickness;
    array[i++] = color;
    array[i++] = 1;
    array[i++] = 0;
    array[i++] = 0;

    // Second point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = color;
    array[i++] = 0;
    array[i++] = 1;
    array[i++] = 0;

    // Third point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = 0;
    array[i++] = 0;
    array[i++] = 0;
    array[i++] = color;
    array[i++] = 0;
    array[i++] = 0;
    array[i] = 20;
  }

  computeIndices(): void {
    // nothing todo ?
  }

  render(params: RenderEdgeParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    // Binding uniforms
    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniform1f(this.ratioLocation, params.ratio / Math.pow(params.ratio, params.edgesPowRatio));

    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.uniform1f(this.scaleLocation, params.ratio);

    // Drawing:
    gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
  }
}
