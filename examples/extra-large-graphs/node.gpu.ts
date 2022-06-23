/**
 * Sigma.js WebGL Renderer Node Program
 * =====================================
 *
 * Simple program rendering nodes using GL_POINTS. This is faster than the
 * three triangle option but has some quirks and is not supported equally by
 * every GPU.
 * @module
 */
import {AbstractNodeProgram} from 'sigma/rendering/webgl/programs/common/node';
import {RenderParams} from 'sigma/rendering/webgl/programs/common/program';

import fragmentShaderSource from './node.fast.frag.glsl';
import vertexShaderSource from './node.fast.vert.glsl';

let POINTS = 1;
const ATTRIBUTES = 4;

export default class NodeGpuProgram extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data, hidden: boolean, offset: number): void {
    this.array = data.buffer.getChild('nodes').toArray();
    POINTS = this.array.length / ATTRIBUTES;
    this.points = POINTS;
  }

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}
