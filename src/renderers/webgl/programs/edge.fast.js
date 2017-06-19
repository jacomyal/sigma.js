/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 */
import Program from './program';
import {floatColor} from '../utils';
import vertexShaderSource from '../shaders/edge.fast.vert.glsl';
import fragmentShaderSource from '../shaders/edge.fast.frag.glsl';

export default class EdgeFastProgram extends Program {
  constructor() {
    super();

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
  }

  process(array, sourceData, targetData, data, i) {

    if (sourceData.hidden || targetData.hidden || data.hidden) {
      for (let l = i + EdgeFastProgram.POINTS * EdgeFastProgram.ATTRIBUTES; i < l; i++)
        array[i] = 0;
    }

    const thickness = data.size || 1,
          x1 = sourceData.x,
          y1 = sourceData.y,
          x2 = targetData.x,
          y2 = targetData.y,
          color = floatColor(data.color);

    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;

    array[i++] = x2;
    array[i++] = y2;
    array[i++] = color;
  }

  render(gl, array, params) {
    const program = this.program;
    gl.useProgram(program);

    // Attribute locations
    const colorLocation = gl.getAttribLocation(program, 'a_color'),
          positionLocation = gl.getAttribLocation(program, 'a_position'),
          resolutionLocation = gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

    gl.uniform2f(resolutionLocation, params.width, params.height);
    gl.uniformMatrix3fv(matrixLocation, false, params.matrix);

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(positionLocation,
      2,
      gl.FLOAT,
      false,
      EdgeFastProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(colorLocation,
      1,
      gl.FLOAT,
      false,
      EdgeFastProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );

    // TODO: use gl line thickness
    gl.lineWidth(3);
    gl.drawArrays(
      gl.LINES,
      0,
      array.length / EdgeFastProgram.ATTRIBUTES
    );
  }
}

EdgeFastProgram.POINTS = 2;
EdgeFastProgram.ATTRIBUTES = 3;
