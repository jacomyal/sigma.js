/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
import { Attributes } from "graphology-types";

import type Sigma from "../sigma";
import type { RenderParams } from "../types";
import { UniformSpecification } from "./nodes";
import {
  InstancedProgramDefinition,
  ProgramAttributeSpecification,
  ProgramDefinition,
  ProgramInfo,
  getAttributesItemsCount,
  killProgram,
  loadFragmentShader,
  loadProgram,
  loadVertexShader,
} from "./utils";

/**
 * Sets a single typed GLSL uniform from its specification. Sampler uniforms are
 * bound separately, so they're skipped.
 */
export function setGLSLUniform(
  gl: WebGL2RenderingContext,
  location: WebGLUniformLocation | null,
  uniform: UniformSpecification,
): void {
  if (!location || uniform.type === "sampler2D") return;

  switch (uniform.type) {
    case "float":
      gl.uniform1f(location, uniform.value);
      break;
    case "int":
    case "bool":
      gl.uniform1i(location, uniform.value);
      break;
    case "vec2":
      gl.uniform2fv(location, uniform.value);
      break;
    case "vec3":
      gl.uniform3fv(location, uniform.value);
      break;
    case "vec4":
      gl.uniform4fv(location, uniform.value);
      break;
    case "mat3":
      gl.uniformMatrix3fv(location, false, uniform.value);
      break;
    case "mat4":
      gl.uniformMatrix4fv(location, false, uniform.value);
      break;
  }
}

const SIZE_FACTOR_PER_ATTRIBUTE_TYPE: Record<number, number> = {
  [WebGL2RenderingContext.BOOL]: 1,
  [WebGL2RenderingContext.BYTE]: 1,
  [WebGL2RenderingContext.UNSIGNED_BYTE]: 1,
  [WebGL2RenderingContext.SHORT]: 2,
  [WebGL2RenderingContext.UNSIGNED_SHORT]: 2,
  [WebGL2RenderingContext.INT]: 4,
  [WebGL2RenderingContext.UNSIGNED_INT]: 4,
  [WebGL2RenderingContext.FLOAT]: 4,
};

/**
 * Inserts PICKING_MODE define after the #version directive.
 * GLSL requires #version to be the first non-comment line.
 */
function insertPickingModeDefine(shaderSource: string): string {
  // Find the end of the #version line
  const versionMatch = shaderSource.match(/^(#version[^\n]*\n)/);
  if (versionMatch) {
    // Insert #define after #version line
    return versionMatch[1] + "#define PICKING_MODE\n" + shaderSource.slice(versionMatch[1].length);
  }
  // Fallback: prepend if no #version found (shouldn't happen with WebGL2)
  return "#define PICKING_MODE\n" + shaderSource;
}

export abstract class Program<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> implements InstancedProgramDefinition {
  VERTICES: number;
  VERTEX_SHADER_SOURCE: string;
  FRAGMENT_SHADER_SOURCE: string;
  UNIFORMS: ReadonlyArray<Uniform>;
  ATTRIBUTES: Array<ProgramAttributeSpecification>;
  METHOD: number; // GLenum
  CONSTANT_ATTRIBUTES: Array<ProgramAttributeSpecification>;
  CONSTANT_DATA: number[][];

  ATTRIBUTES_ITEMS_COUNT: number;
  STRIDE: number;

  renderer: Sigma<N, E, G>;

  // Two views over the same vertex attribute buffer:
  // - `floats` reads/writes slots as 32-bit floats (the common case)
  // - `ints` reads/writes the same slots as 32-bit unsigned ints (used for
  //   packed picking IDs, which must not pass through a Float32 store)
  // Both are rebuilt by `reallocate()` so they share a single ArrayBuffer
  floats: Float32Array = new Float32Array();
  ints: Uint32Array = new Uint32Array();

  constantArray: Float32Array = new Float32Array();
  capacity = 0;
  verticesCount = 0;
  // Generation counter for buffer invalidation: incremented when array data
  // changes, tracked per GL buffer to know which ones need re-upload.
  private bufferGeneration = 0;
  private uploadedGeneration: Map<WebGLBuffer, number> = new Map();
  private constantBufferGeneration = 0;
  private uploadedConstantGeneration: Map<WebGLBuffer, number> = new Map();

  protected renderOffset = 0;
  protected renderCount = -1;

  normalProgram: ProgramInfo;
  pickProgram: ProgramInfo | null = null;

  isInstanced: boolean;

  abstract getDefinition(): ProgramDefinition<Uniform> | InstancedProgramDefinition<Uniform>;

  constructor(gl: WebGL2RenderingContext, _pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
    // Reading and caching program definition
    const def = this.getDefinition();
    this.VERTICES = def.VERTICES;
    this.VERTEX_SHADER_SOURCE = def.VERTEX_SHADER_SOURCE;
    this.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE;
    this.UNIFORMS = def.UNIFORMS;
    this.ATTRIBUTES = def.ATTRIBUTES;
    this.METHOD = def.METHOD;
    this.CONSTANT_ATTRIBUTES = "CONSTANT_ATTRIBUTES" in def ? def.CONSTANT_ATTRIBUTES : [];
    this.CONSTANT_DATA = "CONSTANT_DATA" in def ? def.CONSTANT_DATA : [];

    this.isInstanced = "CONSTANT_ATTRIBUTES" in def;

    // Computing stride
    this.ATTRIBUTES_ITEMS_COUNT = getAttributesItemsCount(this.ATTRIBUTES);
    this.STRIDE = this.VERTICES * this.ATTRIBUTES_ITEMS_COUNT;

    // Members
    this.renderer = renderer;
    this.normalProgram = this.getProgramInfo("normal", gl, def.VERTEX_SHADER_SOURCE, def.FRAGMENT_SHADER_SOURCE, null);

    // Create picking program with PICKING_MODE define inserted after #version
    // This enables separate rendering pass with blending disabled for picking
    this.pickProgram = this.getProgramInfo(
      "pick",
      gl,
      insertPickingModeDefine(def.VERTEX_SHADER_SOURCE),
      insertPickingModeDefine(def.FRAGMENT_SHADER_SOURCE),
      null,
    );

    // For instanced programs:
    if (this.isInstanced) {
      const constantAttributesItemsCount = getAttributesItemsCount(this.CONSTANT_ATTRIBUTES);

      if (this.CONSTANT_DATA.length !== this.VERTICES)
        throw new Error(
          `Program: error while getting constant data (expected ${this.VERTICES} items, received ${this.CONSTANT_DATA.length} instead)`,
        );

      this.constantArray = new Float32Array(this.CONSTANT_DATA.length * constantAttributesItemsCount);
      for (let i = 0; i < this.CONSTANT_DATA.length; i++) {
        const vector = this.CONSTANT_DATA[i];

        if (vector.length !== constantAttributesItemsCount)
          throw new Error(
            `Program: error while getting constant data (one vector has ${vector.length} items instead of ${constantAttributesItemsCount})`,
          );

        for (let j = 0; j < vector.length; j++) this.constantArray[i * constantAttributesItemsCount + j] = vector[j];
      }

      this.STRIDE = this.ATTRIBUTES_ITEMS_COUNT;
    }
  }

  kill() {
    killProgram(this.normalProgram);
    if (this.pickProgram) killProgram(this.pickProgram);
  }

  protected getProgramInfo(
    name: "normal" | "pick",
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    frameBuffer: WebGLFramebuffer | null,
  ): ProgramInfo {
    // WebGL buffers
    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the WebGL buffer.");

    // Shaders and program
    const vertexShader = loadVertexShader(gl, vertexShaderSource);
    const fragmentShader = loadFragmentShader(gl, fragmentShaderSource);
    const program = loadProgram(gl, [vertexShader, fragmentShader]);

    // Initializing locations
    const uniformLocations = {} as ProgramInfo["uniformLocations"];
    this.UNIFORMS.forEach((uniformName) => {
      const location = gl.getUniformLocation(program, uniformName);
      if (location) uniformLocations[uniformName] = location;
    });

    const attributeLocations = {} as ProgramInfo["attributeLocations"];
    this.ATTRIBUTES.forEach((attr) => {
      attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
    });

    // For instanced programs:
    let constantBuffer;
    if (this.isInstanced) {
      this.CONSTANT_ATTRIBUTES.forEach((attr) => {
        attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
      });

      constantBuffer = gl.createBuffer();
      if (constantBuffer === null) throw new Error("Program: error while creating the WebGL constant buffer.");
    }

    return {
      name,
      program,
      gl,
      frameBuffer,
      buffer,
      constantBuffer: constantBuffer || ({} as WebGLBuffer),
      uniformLocations,
      attributeLocations,
      isPicking: name === "pick",
      vertexShader,
      fragmentShader,
    };
  }

  protected bindProgram(program: ProgramInfo): void {
    let offset = 0;

    const { gl, buffer } = program;
    if (!this.isInstanced) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      offset = 0;
      this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset)));
      if (this.uploadedGeneration.get(buffer) !== this.bufferGeneration) {
        gl.bufferData(gl.ARRAY_BUFFER, this.floats, gl.DYNAMIC_DRAW);
        this.uploadedGeneration.set(buffer, this.bufferGeneration);
      }
    } else {
      // Handle constant data (things that remain unchanged for all items):
      gl.bindBuffer(gl.ARRAY_BUFFER, program.constantBuffer);

      offset = 0;
      this.CONSTANT_ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset, false)));
      if (this.uploadedConstantGeneration.get(program.constantBuffer) !== this.constantBufferGeneration) {
        gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);
        this.uploadedConstantGeneration.set(program.constantBuffer, this.constantBufferGeneration);
      }

      // Handle "instance specific" data (things that vary for each item):
      gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);

      offset = this.renderOffset * this.ATTRIBUTES_ITEMS_COUNT * Float32Array.BYTES_PER_ELEMENT;
      this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset, true)));
      if (this.uploadedGeneration.get(buffer) !== this.bufferGeneration) {
        gl.bufferData(gl.ARRAY_BUFFER, this.floats, gl.DYNAMIC_DRAW);
        this.uploadedGeneration.set(buffer, this.bufferGeneration);
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  protected unbindProgram(program: ProgramInfo): void {
    if (!this.isInstanced) {
      this.ATTRIBUTES.forEach((attr) => this.unbindAttribute(attr, program));
    } else {
      this.CONSTANT_ATTRIBUTES.forEach((attr) => this.unbindAttribute(attr, program, false));
      this.ATTRIBUTES.forEach((attr) => this.unbindAttribute(attr, program, true));
    }
  }

  protected bindAttribute(
    attr: ProgramAttributeSpecification,
    program: ProgramInfo,
    offset: number,
    setDivisor?: boolean,
  ): number {
    const sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];
    if (typeof sizeFactor !== "number") throw new Error(`Program.bind: yet unsupported attribute type "${attr.type}"`);

    const location = program.attributeLocations[attr.name];
    const gl = program.gl;

    if (location !== -1) {
      gl.enableVertexAttribArray(location);

      const stride = !this.isInstanced
        ? this.ATTRIBUTES_ITEMS_COUNT * Float32Array.BYTES_PER_ELEMENT
        : (setDivisor ? this.ATTRIBUTES_ITEMS_COUNT : getAttributesItemsCount(this.CONSTANT_ATTRIBUTES)) *
          Float32Array.BYTES_PER_ELEMENT;

      gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalized || false, stride, offset);

      if (this.isInstanced && setDivisor) {
        gl.vertexAttribDivisor(location, 1);
      }
    }

    return attr.size * sizeFactor;
  }

  protected unbindAttribute(attr: ProgramAttributeSpecification, program: ProgramInfo, unsetDivisor?: boolean) {
    const location = program.attributeLocations[attr.name];
    const gl = program.gl;

    if (location !== -1) {
      gl.disableVertexAttribArray(location);

      if (this.isInstanced && unsetDivisor) {
        gl.vertexAttribDivisor(location, 0);
      }
    }
  }

  reallocate(capacity: number): void {
    // If desired capacity has not changed we do nothing
    // NOTE: it's possible here to implement more subtle reallocation schemes
    // when the number of rendered items increase or decrease
    if (capacity === this.capacity) return;

    this.capacity = capacity;
    this.verticesCount = this.VERTICES * capacity;
    this.floats = new Float32Array(
      !this.isInstanced
        ? this.verticesCount * this.ATTRIBUTES_ITEMS_COUNT
        : this.capacity * this.ATTRIBUTES_ITEMS_COUNT,
    );
    // Same buffer as `floats`, but used to write attributes as packed integers
    this.ints = new Uint32Array(this.floats.buffer);
    this.invalidateBuffers();
  }

  /**
   * Mark GPU buffers as needing re-upload. Call this after modifying
   * the array data outside of reallocate.
   */
  invalidateBuffers(): void {
    this.bufferGeneration++;
    this.constantBufferGeneration++;
  }

  hasNothingToRender(): boolean {
    return this.verticesCount === 0;
  }

  protected setTypedUniform(uniform: UniformSpecification, programInfo: ProgramInfo): void {
    setGLSLUniform(programInfo.gl, programInfo.uniformLocations[uniform.name] ?? null, uniform);
  }

  abstract setUniforms(params: RenderParams, programInfo: ProgramInfo): void;

  protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
    const { gl, program, isPicking } = programInfo;

    // Disable blending for picking pass (critical for performance!)
    // Enable blending for normal pass (needed for anti-aliasing)
    if (isPicking) {
      gl.disable(gl.BLEND);
    } else {
      gl.enable(gl.BLEND);
    }

    gl.useProgram(program);
    this.setUniforms(params, programInfo);
    this.drawWebGL(this.METHOD, programInfo);
  }

  render(params: RenderParams, offset?: number, count?: number): void {
    if (this.hasNothingToRender()) return;

    this.renderOffset = offset ?? 0;
    this.renderCount = count ?? -1;

    const gl = this.normalProgram.gl;

    // Pass 1: Render to screen (with blending enabled).
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
    this.bindProgram(this.normalProgram);
    this.renderProgram(params, this.normalProgram);
    this.unbindProgram(this.normalProgram);

    // Pass 2: Render to picking framebuffer (with blending disabled)
    if (this.pickProgram && params.pickingFrameBuffer) {
      const pickingWidth = Math.ceil((params.width * params.pixelRatio) / params.downSizingRatio);
      const pickingHeight = Math.ceil((params.height * params.pixelRatio) / params.downSizingRatio);

      gl.bindFramebuffer(gl.FRAMEBUFFER, params.pickingFrameBuffer);
      gl.viewport(0, 0, pickingWidth, pickingHeight);
      this.bindProgram(this.pickProgram);
      this.renderProgram(params, this.pickProgram);
      this.unbindProgram(this.pickProgram);

      // Restore main framebuffer so callers don't need to rebind
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
    }
  }

  drawWebGL(method: number /* GLenum */, { gl }: ProgramInfo): void {
    // Framebuffer is already bound by render() for either picking or visual pass
    const count = this.renderCount >= 0 ? this.renderCount : this.capacity;
    if (!this.isInstanced) {
      gl.drawArrays(method, this.renderOffset * this.VERTICES, count * this.VERTICES);
    } else {
      gl.drawArraysInstanced(method, 0, this.VERTICES, count);
    }
  }
}

export type ProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = new (
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
) => Program<string, N, E, G>;
