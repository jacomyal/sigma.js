/**
 * Sigma.js WebGL Renderer Quadratic Bezier Edge Program
 * ======================================================
 *
 * TODO
 */
import Program from "./program";
import { floatColor } from "../utils";
import vertexShaderSource from "../shaders/edge.quadraticBezier.vert.glsl";
import fragmentShaderSource from "../shaders/edge.quadraticBezier.frag.glsl";

const POINTS = 3,
  ATTRIBUTES = 5;

export default class EdgeQuadraticBezierProgram extends Program {
  positionLocation: GLint;
  colorLocation: GLint;
  coordLocation: GLint;
  resolutionLocation: WebGLUniformLocation;
  ratioLocation: WebGLUniformLocation;
  matrixLocation: WebGLUniformLocation;
  scaleLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    // this.thicknessLocation = gl.getAttribLocation(this.program, 'a_thickness');
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.coordLocation = gl.getAttribLocation(this.program, "a_coord");
    this.resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    this.ratioLocation = gl.getUniformLocation(this.program, "u_ratio");
    this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    this.scaleLocation = gl.getUniformLocation(this.program, "u_scale");

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    // gl.enableVertexAttribArray(this.thicknessLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.coordLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    // gl.vertexAttribPointer(this.thicknessLocation,
    //   1,
    //   gl.FLOAT,
    //   false,
    //   ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
    //   8
    // );
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8,
    );
    gl.vertexAttribPointer(this.coordLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12);
  }

  allocate(capacity) {
    this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
  }

  process(sourceData, targetData, data, offset) {
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

  bufferData() {
    const gl = this.gl;

    // Vertices data
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  render(params) {
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
