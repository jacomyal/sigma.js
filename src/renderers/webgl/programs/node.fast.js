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
  constructor() {
    super();

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
  }

  process(array, data, i) {
    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
  }

  render(gl, array, params) {
    const program = this.program;
    gl.useProgram(program);

    // Attribute locations
    const positionLocation = gl.getAttribLocation(program, 'a_position'),
          sizeLocation = gl.getAttribLocation(program, 'a_size'),
          colorLocation = gl.getAttribLocation(program, 'a_color'),
          resolutionLocation = gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation = gl.getUniformLocation(program, 'u_matrix'),
          ratioLocation = gl.getUniformLocation(program, 'u_ratio'),
          scaleLocation = gl.getUniformLocation(program, 'u_scale');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

    gl.uniform2f(resolutionLocation, params.width, params.height);
    gl.uniform1f(
      ratioLocation,
      1 / Math.pow(params.ratio, params.nodesPowRatio)
    );
    gl.uniform1f(scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(matrixLocation, false, params.matrix);

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(sizeLocation);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(
      sizeLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(
      colorLocation,
      1,
      gl.FLOAT,
      false,
      NodeProgramFast.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );

    gl.drawArrays(
      gl.POINTS,
      0,
      array.length / NodeProgramFast.ATTRIBUTES
    );
  }
}

NodeProgramFast.POINTS = 1;
NodeProgramFast.ATTRIBUTES = 4;
