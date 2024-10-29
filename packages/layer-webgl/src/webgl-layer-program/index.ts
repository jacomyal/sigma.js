import { Attributes } from "graphology-types";
import Sigma from "sigma";
import { Program, ProgramDefinition, type ProgramInfo } from "sigma/rendering";
import { RenderParams } from "sigma/types";

import getVertexShader from "./shader-vert";

const QUAD_VERTICES = [-1, 1, 1, 1, -1, -1, 1, -1];

export type WebGLLayerDefinition = {
  FRAGMENT_SHADER_SOURCE: string;
  DATA_UNIFORMS: string[];
  CAMERA_UNIFORMS: string[];
};

/**
 * This program is based on the base Program from Sigma, but instead of using `this.array` to iterate over the vertices,
 * it is bound to some uniform directly for the fragment shader.
 *
 * So, when extending this new CustomLayerProgram abstract class:
 * - Do not implement `getDefinition`, implement `getCustomLayerDefinition` instead
 * - Do not implement `setUniforms`, implement `setCameraUniforms` and `cacheDataUniforms` instead
 */
export abstract class WebGLLayerProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<string, N, E, G> {
  // Methods to implement:
  abstract cacheDataUniforms(programInfo: ProgramInfo): void;
  abstract setCameraUniforms(params: RenderParams, programInfo: ProgramInfo): void;
  abstract getCustomLayerDefinition(): WebGLLayerDefinition;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    pickingBuffer: WebGLFramebuffer | null,
    renderer: Sigma<N, E, G>,
  ) {
    super(gl, pickingBuffer, renderer);
    this.verticesCount = QUAD_VERTICES.length / 2;
  }

  // Internal rendering management overrides:
  getDefinition(): ProgramDefinition<string> {
    const { FRAGMENT_SHADER_SOURCE, CAMERA_UNIFORMS, DATA_UNIFORMS } = this.getCustomLayerDefinition();

    return {
      UNIFORMS: [...CAMERA_UNIFORMS, ...DATA_UNIFORMS],
      FRAGMENT_SHADER_SOURCE,
      VERTEX_SHADER_SOURCE: getVertexShader(),
      VERTICES: 6,
      METHOD: WebGLRenderingContext.TRIANGLE_STRIP,
      ATTRIBUTES: [{ name: "a_position", size: 2, type: WebGLRenderingContext.FLOAT }],
    };
  }
  hasNothingToRender() {
    return false;
  }
  setUniforms(params: RenderParams, programInfo: ProgramInfo) {
    this.setCameraUniforms(params, programInfo);
  }
  protected bindProgram(program: ProgramInfo): void {
    const { gl, buffer } = program;

    // Bind base quad data:
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let offset = 0;
    this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset)));
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(QUAD_VERTICES), gl.STATIC_DRAW);
  }
}

class _WebGLLayerProgramClass<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends WebGLLayerProgram<N, E, G> {
  getCustomLayerDefinition(): WebGLLayerDefinition {
    return {
      FRAGMENT_SHADER_SOURCE: "",
      DATA_UNIFORMS: [],
      CAMERA_UNIFORMS: [],
    };
  }
  setCameraUniforms(_params: RenderParams, _programInfo: ProgramInfo): void {
    return undefined;
  }
  cacheDataUniforms(_programInfo: ProgramInfo): void {
    return undefined;
  }
}
export type WebGLLayerProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = typeof _WebGLLayerProgramClass<N, E, G>;
