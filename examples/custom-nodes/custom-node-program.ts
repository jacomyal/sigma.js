/**
 * This program is a copy of src/renderers/webgl/program/node.fast.js, but with
 * a custom fragment shader (./custom-node-fragment-shader.glsl) that will draw
 * a disc inside the nodes.
 */
import Program from '../../src/renderers/webgl/programs/program';
import {floatColor} from '../../src/renderers/webgl/utils';
import vertexShaderSource from '../../src/renderers/webgl/shaders/node.fast.vert.glsl';
import fragmentShaderSource from './custom-node-fragment-shader.glsl';

const POINTS = 3,
  ATTRIBUTES = 5;

export default class CustomNodeProgram extends Program {
  gl: any;
  array: any;
  buffer: any;
  program: any;
  positionLocation: any;
  sizeLocation: any;
  colorLocation: any;
  matrixLocation: any;
  ratioLocation: any;
  scaleLocation: any;

  constructor(gl) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Binding context
    this.gl = gl;

    // Array data
    this.array = null;

    // Initializing buffers
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const program = this.program;

    // Locations
    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.sizeLocation = gl.getAttribLocation(program, 'a_size');
    this.colorLocation = gl.getAttribLocation(program, 'a_color');
    this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    this.ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    this.scaleLocation = gl.getUniformLocation(program, 'u_scale');

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.sizeLocation);
    gl.enableVertexAttribArray(this.colorLocation);

    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      this.sizeLocation,
      1,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );
  }

  allocate(capacity) {
    this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
  }

  process(data, offset) {
    const color = floatColor(data.color);

    let i = offset * POINTS * ATTRIBUTES;

    const array = this.array;

    if (data.hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;

      return;
    }

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;
  }

  bufferData() {
    const gl = this.gl;

    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  render(params) {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(
      this.ratioLocation,
      1 / Math.pow(params.ratio, params.nodesPowRatio)
    );
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
