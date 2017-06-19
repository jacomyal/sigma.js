/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 */
import Program from './program';
import {floatColor} from '../utils';
import vertexShaderSource from '../shaders/edge.vert.glsl';
import fragmentShaderSource from '../shaders/edge.frag.glsl';

export default class EdgeProgram extends Program {
  constructor() {
    super();

    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
  }

  process(array, sourceData, targetData, data, i) {

    if (sourceData.hidden || targetData.hidden || data.hidden) {
      for (let l = i + EdgeProgram.POINTS * EdgeProgram.ATTRIBUTES; i < l; i++)
        array[i] = 0;
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

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = n1;
    array[i++] = n2;
    array[i++] = thickness;
    array[i++] = color;

    // First point flipped
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = color;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = n1;
    array[i++] = n2;
    array[i++] = thickness;
    array[i++] = color;

    // Second point flipped
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = color;
  }

  computeIndices(array) {
    const l = array.length / EdgeProgram.ATTRIBUTES;

    const size = l + (l / 2);

    const indices = new Uint16Array(size);

    for (let i = 0, c = 0; i < size; i += 4) {
      indices[c++] = i;
      indices[c++] = i + 1;
      indices[c++] = i + 2;
      indices[c++] = i + 2;
      indices[c++] = i + 1;
      indices[c++] = i + 3;
    }

    return indices;
  }

  render(gl, array, params) {
    const program = this.program;
    gl.useProgram(program);

    // Attribute locations
    const positionLocation = gl.getAttribLocation(program, 'a_position'),
          normalLocation = gl.getAttribLocation(program, 'a_normal'),
          thicknessLocation = gl.getAttribLocation(program, 'a_thickness'),
          colorLocation = gl.getAttribLocation(program, 'a_color'),
          resolutionLocation = gl.getUniformLocation(program, 'u_resolution'),
          ratioLocation = gl.getUniformLocation(program, 'u_ratio'),
          matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    // Creating buffer:
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);

    // Binding uniforms
    gl.uniform2f(resolutionLocation, params.width, params.height);
    gl.uniform1f(
      ratioLocation,
      params.ratio / Math.pow(params.ratio, params.edgesPowRatio)
    );

    gl.uniformMatrix3fv(matrixLocation, false, params.matrix);

    // Binding attributes:
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(normalLocation);
    gl.enableVertexAttribArray(thicknessLocation);
    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(positionLocation,
      2,
      gl.FLOAT,
      false,
      EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(normalLocation,
      2,
      gl.FLOAT,
      false,
      EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(thicknessLocation,
      1,
      gl.FLOAT,
      false,
      EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      16
    );
    gl.vertexAttribPointer(colorLocation,
      1,
      gl.FLOAT,
      false,
      EdgeProgram.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      20
    );

    // Creating indices buffer:
    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, params.indices, gl.STATIC_DRAW);

    // Drawing:
    gl.drawElements(
      gl.TRIANGLES,
      params.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}

EdgeProgram.POINTS = 4;
EdgeProgram.ATTRIBUTES = 6;
