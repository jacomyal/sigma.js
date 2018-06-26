/**
 * Sigma.js WebGL Renderer Edge Program
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

const POINTS = 4,
      ATTRIBUTES = 6;

export default class EdgeProgram extends Program {
  constructor(gl) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Binding context
    this.gl = gl;

    // Array data
    this.array = null;
    this.indicesArray = null;

    // Initializing buffers
    this.buffer = gl.createBuffer();
    this.indicesBuffer = gl.createBuffer();

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
    this.normalLocation = gl.getAttribLocation(this.program, 'a_normal');
    this.thicknessLocation = gl.getAttribLocation(this.program, 'a_thickness');
    this.colorLocation = gl.getAttribLocation(this.program, 'a_color');
    this.resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    this.ratioLocation = gl.getUniformLocation(this.program, 'u_ratio');
    this.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.scaleLocation = gl.getUniformLocation(this.program, 'u_scale');

    this.bind();

    // Enabling the OES_element_index_uint extension
    // NOTE: on older GPUs, this means that really large graphs won't
    // have all their edges rendered. But it seems that the
    // `OES_element_index_uint` is quite everywhere so we'll handle
    // the potential issue if it really arises.
    // NOTE: when using webgl2, the extension is enabled by default
    const webgl2 = (
      typeof WebGL2RenderingContext !== 'undefined' &&
      gl instanceof WebGL2RenderingContext
    );

    const extension = webgl2 || gl.getExtension('OES_element_index_uint');

    this.canUse32BitsIndices = !!extension;
    this.IndicesArray = this.canUse32BitsIndices ? Uint32Array : Uint16Array;
    this.indicesType = this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
  }

  bind() {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.normalLocation);
    gl.enableVertexAttribArray(this.thicknessLocation);
    gl.enableVertexAttribArray(this.colorLocation);

    gl.vertexAttribPointer(this.positionLocation,
      2,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.vertexAttribPointer(this.normalLocation,
      2,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8
    );
    gl.vertexAttribPointer(this.thicknessLocation,
      1,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      16
    );
    gl.vertexAttribPointer(this.colorLocation,
      1,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      20
    );
  }

  allocate(capacity) {
    this.array = new Float32Array(POINTS * ATTRIBUTES * capacity);
  }

  process(sourceData, targetData, data, offset) {

    if (sourceData.hidden || targetData.hidden || data.hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++)
        this.array[i] = 0;
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

    let i = POINTS * ATTRIBUTES * offset;

    const array = this.array;

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
    array[i] = color;
  }

  computeIndices() {
    const l = this.array.length / ATTRIBUTES;

    const size = l + (l / 2);

    const indices = new this.IndicesArray(size);

    for (let i = 0, c = 0; i < size; i += 4) {
      indices[c++] = i;
      indices[c++] = i + 1;
      indices[c++] = i + 2;
      indices[c++] = i + 2;
      indices[c++] = i + 1;
      indices[c++] = i + 3;
    }

    this.indicesArray = indices;
  }

  bufferData() {
    const gl = this.gl;

    // Vertices data
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);

    // Indices data
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
  }

  render(params) {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    // Binding uniforms
    // TODO: precise the uniform names
    gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniform1f(
      this.ratioLocation,
      // 1 / Math.pow(params.ratio, params.edgesPowRatio)
      params.ratio
    );

    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.uniform1f(this.scaleLocation, params.scalingRatio);

    // Drawing:
    gl.drawElements(
      gl.TRIANGLES,
      this.indicesArray.length,
      this.indicesType,
      0
    );
  }
}
