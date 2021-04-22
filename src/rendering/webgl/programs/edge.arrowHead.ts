/**
 * Sigma.js WebGL Renderer Arrow Program
 * ======================================
 *
 * Program rendering direction arrows as a simple triangle.
 * @module
 */
import { EdgeAttributes, NodeAttributes } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/edge.arrowHead.vert.glsl";
import fragmentShaderSource from "../shaders/edge.arrowHead.frag.glsl";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";

const POINTS = 3,
  ATTRIBUTES = 10,
  STRIDE = POINTS * ATTRIBUTES;

export default class EdgeArrowHeadProgram extends AbstractEdgeProgram {
  // Locations
  positionLocation: GLint;
  colorLocation: GLint;
  normalLocation: GLint;
  thicknessLocation: GLint;
  radiusLocation: GLint;
  barycentricLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  scaleLocation: WebGLUniformLocation;
  cameraRatioLocation: WebGLUniformLocation;
  viewportRatioLocation: WebGLUniformLocation;
  thicknessRatioLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.normalLocation = gl.getAttribLocation(this.program, "a_normal");
    this.thicknessLocation = gl.getAttribLocation(this.program, "a_thickness");
    this.radiusLocation = gl.getAttribLocation(this.program, "a_radius");
    this.barycentricLocation = gl.getAttribLocation(this.program, "a_barycentric");

    // Uniform locations
    const scaleLocation = gl.getUniformLocation(this.program, "u_scale");
    if (scaleLocation === null) throw new Error("EdgeArrowHeadProgram: error while getting scaleLocation");
    this.scaleLocation = scaleLocation;

    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeArrowHeadProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const cameraRatioLocation = gl.getUniformLocation(this.program, "u_cameraRatio");
    if (cameraRatioLocation === null) throw new Error("EdgeArrowHeadProgram: error while getting cameraRatioLocation");
    this.cameraRatioLocation = cameraRatioLocation;

    const viewportRatioLocation = gl.getUniformLocation(this.program, "u_viewportRatio");
    if (viewportRatioLocation === null)
      throw new Error("EdgeArrowHeadProgram: error while getting viewportRatioLocation");
    this.viewportRatioLocation = viewportRatioLocation;

    const thicknessRatioLocation = gl.getUniformLocation(this.program, "u_thicknessRatio");
    if (thicknessRatioLocation === null)
      throw new Error("EdgeArrowHeadProgram: error while getting thicknessRatioLocation");
    this.thicknessRatioLocation = thicknessRatioLocation;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.normalLocation);
    gl.enableVertexAttribArray(this.thicknessLocation);
    gl.enableVertexAttribArray(this.radiusLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.barycentricLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      24,
    );

    // TODO: maybe we can optimize here by packing this in a bit mask
    gl.vertexAttribPointer(
      this.barycentricLocation,
      3,
      gl.FLOAT,
      false,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      28,
    );
  }

  computeIndices(): void {
    // nothing to do
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
      radius = targetData.size || 1,
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
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = radius;
    array[i++] = color;
    array[i++] = 1;
    array[i++] = 0;
    array[i++] = 0;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = radius;
    array[i++] = color;
    array[i++] = 0;
    array[i++] = 1;
    array[i++] = 0;

    // Third point
    array[i++] = x2;
    array[i++] = y2;
    array[i++] = -n1;
    array[i++] = -n2;
    array[i++] = thickness;
    array[i++] = radius;
    array[i++] = color;
    array[i++] = 0;
    array[i++] = 0;
    array[i] = 1;
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
    gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
  }
}
