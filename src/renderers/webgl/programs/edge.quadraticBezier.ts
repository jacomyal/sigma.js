/**
 * Sigma.js WebGL Renderer Quadratic Bezier Edge Program
 * ======================================================
 */
import { ProcessData } from "./common/program";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";
import { floatColor } from "../utils";
import vertexShaderSource from "../shaders/edge.quadraticBezier.vert.glsl";
import fragmentShaderSource from "../shaders/edge.quadraticBezier.frag.glsl";

const POINTS = 3,
  ATTRIBUTES = 5;

export default class EdgeQuadraticBezierProgram extends AbstractEdgeProgram {
  coordLocation: GLint;
  ratioLocation: WebGLUniformLocation;
  scaleLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations
    this.coordLocation = gl.getAttribLocation(this.program, "a_coord");

    const ratioLocation = gl.getUniformLocation(this.program, "u_ratio");
    if (ratioLocation === null)
      throw new Error(
        "sigma/renderers/webgl/program/edge.EdgeQuadraticBezierProgram: error while getting ratioLocation",
      );
    this.ratioLocation = ratioLocation;

    const scaleLocation = gl.getUniformLocation(this.program, "u_scale");
    if (scaleLocation === null)
      throw new Error(
        "sigma/renderers/webgl/program/edge.EdgeQuadraticBezierProgram: error while getting scaleLocation",
      );
    this.scaleLocation = scaleLocation;

    this.bind();
  }

  bind(): void {
    super.bind();

    // Bindings
    const gl = this.gl;
    gl.enableVertexAttribArray(this.coordLocation);
    gl.vertexAttribPointer(this.coordLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
  }

  computeIndices(): void {
    // nothing to do
  }

  process(sourceData: any, targetData: any, data: ProcessData, offset: number): void {
    let i = 0;
    if (sourceData.hidden || targetData.hidden || data.hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) this.array[i] = 0;
    }

    const x1 = sourceData.x,
      y1 = sourceData.y,
      x2 = targetData.x,
      y2 = targetData.y,
      color = floatColor(data.color);

    i = POINTS * ATTRIBUTES * offset;

    const array = this.array;

    // Control point
    array[i++] = (x1 + x2) / 2 + (y2 - y1) / 4;
    array[i++] = (y1 + y2) / 2 + (x1 - x2) / 4;

    // array[i++] = thickness;
    array[i++] = color;
    array[i++] = 0.5;
    array[i++] = 0;

    // First point
    array[i++] = x1;
    array[i++] = y1;
    // array[i++] = thickness;
    array[i++] = color;
    array[i++] = 0;
    array[i++] = 0;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    // array[i++] = thickness;
    array[i++] = color;
    array[i++] = 1;
    array[i] = 1;
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
