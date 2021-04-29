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
 * @module
 */
import { floatColor, canUse32BitsIndices } from "../../../utils";
import { EdgeAttributes, NodeAttributes } from "../../../types";
import vertexShaderSource from "../shaders/edge.vert.glsl";
import fragmentShaderSource from "../shaders/edge.frag.glsl";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";

const POINTS = 4,
  ATTRIBUTES = 6,
  STRIDE = POINTS * ATTRIBUTES;

export default class EdgeProgram extends AbstractEdgeProgram {
  IndicesArray: Uint32ArrayConstructor | Uint16ArrayConstructor;
  indicesArray: Uint32Array | Uint16Array;
  indicesBuffer: WebGLBuffer;
  indicesType: GLenum;
  canUse32BitsIndices: boolean;
  positionLocation: GLint;
  colorLocation: GLint;
  normalLocation: GLint;
  thicknessLocation: GLint;
  scaleLocation: WebGLUniformLocation;
  matrixLocation: WebGLUniformLocation;
  cameraRatioLocation: WebGLUniformLocation;
  viewportRatioLocation: WebGLUniformLocation;
  thicknessRatioLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Initializing indices buffer
    const indicesBuffer = gl.createBuffer();
    if (indicesBuffer === null) throw new Error("EdgeProgram: error while getting resolutionLocation");
    this.indicesBuffer = indicesBuffer;

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.normalLocation = gl.getAttribLocation(this.program, "a_normal");
    this.thicknessLocation = gl.getAttribLocation(this.program, "a_thickness");

    // Uniform locations
    const scaleLocation = gl.getUniformLocation(this.program, "u_scale");
    if (scaleLocation === null) throw new Error("EdgeProgram: error while getting scaleLocation");
    this.scaleLocation = scaleLocation;

    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const cameraRatioLocation = gl.getUniformLocation(this.program, "u_cameraRatio");
    if (cameraRatioLocation === null) throw new Error("EdgeProgram: error while getting cameraRatioLocation");
    this.cameraRatioLocation = cameraRatioLocation;

    const viewportRatioLocation = gl.getUniformLocation(this.program, "u_viewportRatio");
    if (viewportRatioLocation === null) throw new Error("EdgeProgram: error while getting viewportRatioLocation");
    this.viewportRatioLocation = viewportRatioLocation;

    const thicknessRatioLocation = gl.getUniformLocation(this.program, "u_thicknessRatio");
    if (thicknessRatioLocation === null) throw new Error("EdgeProgram: error while getting thicknessRatioLocation");
    this.thicknessRatioLocation = thicknessRatioLocation;

    // Enabling the OES_element_index_uint extension
    // NOTE: on older GPUs, this means that really large graphs won't
    // have all their edges rendered. But it seems that the
    // `OES_element_index_uint` is quite everywhere so we'll handle
    // the potential issue if it really arises.
    // NOTE: when using webgl2, the extension is enabled by default
    this.canUse32BitsIndices = canUse32BitsIndices(gl);
    this.IndicesArray = this.canUse32BitsIndices ? Uint32Array : Uint16Array;
    this.indicesArray = new this.IndicesArray();
    this.indicesType = this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.normalLocation);
    gl.enableVertexAttribArray(this.thicknessLocation);
    gl.enableVertexAttribArray(this.colorLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      20,
    );
  }

  computeIndices(): void {
    const l = this.array.length / ATTRIBUTES;
    const size = l + l / 2;
    const indices = new this.IndicesArray(size);

    for (let i = 0, c = 0; i < l; i += 4) {
      indices[c++] = i;
      indices[c++] = i + 1;
      indices[c++] = i + 2;
      indices[c++] = i + 2;
      indices[c++] = i + 1;
      indices[c++] = i + 3;
    }

    this.indicesArray = indices;
  }

  bufferData(): void {
    super.bufferData();

    // Indices data
    const gl = this.gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
  }

  process(
    sourceData: NodeAttributes,
    targetData: NodeAttributes,
    data: EdgeAttributes,
    hidden: boolean,
    offset: number,
  ): void {
    if (hidden) {
      for (let i = offset * STRIDE, l = i + STRIDE; i < l; i++) this.array[i] = 0;
      return;
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

  render(params: RenderEdgeParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    // Binding uniforms
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.uniform1f(this.cameraRatioLocation, params.ratio);
    gl.uniform1f(this.viewportRatioLocation, 1 / Math.min(params.width, params.height));
    gl.uniform1f(this.thicknessRatioLocation, 1 / Math.pow(params.ratio, params.edgesPowRatio));

    // Drawing:
    gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
  }
}
