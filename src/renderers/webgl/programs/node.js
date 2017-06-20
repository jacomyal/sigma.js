/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes as discs, shaped by triangles using the
 * `gl.TRIANGLES` display mode. So, to draw one node, it will need to store
 * three times the center of the node, with the color, the size and an angle
 * indicating which "corner" of the triangle to draw.
 */
import Program from './program';
import {floatColor} from '../utils';
import vertexShaderSource from '../shaders/node.vert.glsl';
import fragmentShaderSource from '../shaders/node.frag.glsl';

const ANGLE_1 = 0,
      ANGLE_2 = 2 * Math.PI / 3,
      ANGLE_3 = 4 * Math.PI / 3;

export default class NodeProgram extends Program {
  constructor(gl) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Initializing buffers
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
    this.sizeLocation = gl.getAttribLocation(this.program, 'a_size');
    this.colorLocation = gl.getAttribLocation(this.program, 'a_color');
    this.angleLocation = gl.getAttribLocation(this.program, 'a_angle');
    this.resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.ratioLocation = gl.getUniformLocation(this.program, 'u_ratio');
    this.scaleLocation = gl.getUniformLocation(this.program, 'u_scale');
  }

  process(array, data, i) {
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
    array[i++] = ANGLE_3;
  }

  render(gl, array, params) {
    const program = this.program;
    gl.useProgram(program);

    gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniform1f(
      this.ratioLocation,
      1 / Math.pow(params.ratio, params.nodesPowRatio)
    );
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.sizeLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.angleLocation);

    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      NodeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );

    gl.vertexAttribPointer(
      this.sizeLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );

    gl.vertexAttribPointer(
      this.colorLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );

    gl.vertexAttribPointer(
      this.angleLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      16
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      array.length / NodeProgram.ATTRIBUTES
    );
  }
}

NodeProgram.POINTS = 3;
NodeProgram.ATTRIBUTES = 5;
