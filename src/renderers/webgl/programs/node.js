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
import vertexShaderSource from '../shaders/node.vert';
import fragmentShaderSource from '../shaders/node.frag';

export default class NodeProgram extends Program {
  constructor() {
    super();

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
  }

  process(array, data, i) {
    var color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = 0;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = 2 * Math.PI / 3;

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i++] = color;
    array[i++] = 4 * Math.PI / 3;
  }

  render(gl, array, params) {
    const buffer = gl.createBuffer();

    const program = this.program;

    // Attribute locations
    const positionLocation = gl.getAttribLocation(program, 'a_position'),
          sizeLocation = gl.getAttribLocation(program, 'a_size'),
          colorLocation = gl.getAttribLocation(program, 'a_color'),
          angleLocation = gl.getAttribLocation(program, 'a_angle'),
          resolutionLocation = gl.getUniformLocation(program, 'u_resolution'),
          matrixLocation = gl.getUniformLocation(program, 'u_matrix'),
          ratioLocation = gl.getUniformLocation(program, 'u_ratio'),
          scaleLocation = gl.getUniformLocation(program, 'u_scale');

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
    gl.enableVertexAttribArray(angleLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );

    gl.vertexAttribPointer(
      sizeLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );

    gl.vertexAttribPointer(
      colorLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      12
    );

    gl.vertexAttribPointer(
      angleLocation,
      1,
      gl.FLOAT,
      false,
      this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      16
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      (array.length / NodeProgram.ATTRIBUTES)
    );
  }
}

NodeProgram.POINTS = 3;
NodeProgram.ATTRIBUTES = 5;
