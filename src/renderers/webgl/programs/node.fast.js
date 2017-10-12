/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 */
import Program from './program';
import {floatColor} from '../utils';
import vertexShaderSource from '../shaders/node.fast.vert.glsl';
import fragmentShaderSource from '../shaders/node.fast.frag.glsl';

export default class NodeProgramFast extends Program {
  constructor(gl) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Initializing buffers
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const program = this.program;

    // Locations
    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.sizeLocation = gl.getAttribLocation(program, 'a_size');
    this.colorLocation = gl.getAttribLocation(program, 'a_color');
    this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
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
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      this.sizeLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(
      this.colorLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );
  }

  process(array, data, i) {
    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
  }

  bufferData(gl, array) {
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
  }

  render(gl, array, params) {
    const program = this.program;
    gl.useProgram(program);

    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniform1f(
      this.ratioLocation,
      1 / Math.pow(params.ratio, params.nodesPowRatio)
    );
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(
      gl.POINTS,
      0,
      array.length / NodeProgramFast.ATTRIBUTES
    );
  }
}

NodeProgramFast.POINTS = 1;
NodeProgramFast.ATTRIBUTES = 4;
