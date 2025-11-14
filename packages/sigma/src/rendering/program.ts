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

function pickifyShader(shader: string): string {
  return shader.replace(/\n/, `\n#define PICKING_MODE\n`);
}

function opaquifyShader(shader: string): string {
  return shader.replace(/\n/, `\n#define OPAQUE_PASS\n`);
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

export abstract class AbstractProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  constructor(_gl: WebGL2RenderingContext, _pickGl: WebGL2RenderingContext, _renderer: Sigma<N, E, G>) {}
  abstract reallocate(capacity: number): void;
  abstract render(params: RenderParams, options?: { mode?: "opaque" | "transparent" | "all" }): void;
  abstract kill(): void;
}

export abstract class Program<
    Uniform extends string = string,
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  >
  implements AbstractProgram<N, E, G>, InstancedProgramDefinition
{
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
  array: Float32Array = new Float32Array();
  constantArray: Float32Array = new Float32Array();
  capacity = 0;
  verticesCount = 0;
  layerIndex = 0;

  normalProgram: ProgramInfo;
  opaqueProgram: ProgramInfo; // Opaque variant for two-pass rendering
  pickProgram: ProgramInfo | null;

  isInstanced: boolean;

  abstract getDefinition(): ProgramDefinition<Uniform> | InstancedProgramDefinition<Uniform>;

  constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
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
    this.opaqueProgram = this.getProgramInfo(
      "opaque",
      gl,
      def.VERTEX_SHADER_SOURCE,
      opaquifyShader(def.FRAGMENT_SHADER_SOURCE),
      null,
    );
    this.pickProgram = pickingBuffer
      ? this.getProgramInfo(
          "pick",
          gl,
          pickifyShader(def.VERTEX_SHADER_SOURCE),
          pickifyShader(def.FRAGMENT_SHADER_SOURCE),
          pickingBuffer,
        )
      : null;

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
    killProgram(this.opaqueProgram);

    if (this.pickProgram) {
      killProgram(this.pickProgram);
      this.pickProgram = null;
    }
  }

  protected getProgramInfo(
    name: "normal" | "opaque" | "pick",
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    frameBuffer: WebGLFramebuffer | null,
  ): ProgramInfo {
    const def = this.getDefinition();

    // WebGL buffers
    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the WebGL buffer.");

    // Shaders and program
    const vertexShader = loadVertexShader(gl, vertexShaderSource);
    const fragmentShader = loadFragmentShader(gl, fragmentShaderSource);
    const program = loadProgram(gl, [vertexShader, fragmentShader]);

    // Initializing locations
    const uniformLocations = {} as ProgramInfo["uniformLocations"];
    def.UNIFORMS.forEach((uniformName) => {
      const location = gl.getUniformLocation(program, uniformName);
      if (location) uniformLocations[uniformName] = location;
    });

    const attributeLocations = {} as ProgramInfo["attributeLocations"];
    def.ATTRIBUTES.forEach((attr) => {
      attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
    });

    // For instanced programs:
    let constantBuffer;
    if ("CONSTANT_ATTRIBUTES" in def) {
      def.CONSTANT_ATTRIBUTES.forEach((attr) => {
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
      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    } else {
      // Handle constant data (things that remain unchanged for all items):
      gl.bindBuffer(gl.ARRAY_BUFFER, program.constantBuffer);

      offset = 0;
      this.CONSTANT_ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset, false)));
      gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);

      // Handle "instance specific" data (things that vary for each item):
      gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);

      offset = 0;
      this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, program, offset, true)));
      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
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
    this.array = new Float32Array(
      !this.isInstanced
        ? this.verticesCount * this.ATTRIBUTES_ITEMS_COUNT
        : this.capacity * this.ATTRIBUTES_ITEMS_COUNT,
    );
  }

  hasNothingToRender(): boolean {
    return this.verticesCount === 0;
  }

  abstract setUniforms(params: RenderParams, programInfo: ProgramInfo): void;

  protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
    const { gl, program } = programInfo;

    // Detect if this is picking mode
    const isPicking = programInfo === this.pickProgram;

    // For picking, we need blending disabled to get exact colors
    // For normal rendering, we need blending enabled for transparency
    if (isPicking) {
      gl.disable(gl.BLEND);
    } else {
      gl.enable(gl.BLEND);
    }

    gl.useProgram(program);
    this.setUniforms(params, programInfo);
    this.drawWebGL(this.METHOD, programInfo);
  }

  render(params: RenderParams, options?: { mode?: "opaque" | "transparent" | "all" }): void {
    if (this.hasNothingToRender()) return;

    const mode = options?.mode || "all";

    // For OIT rendering, we need to preserve the framebuffer binding across pick/normal rendering
    const gl = this.normalProgram.gl;
    let savedFramebuffer: WebGLFramebuffer | null = null;

    if (this.pickProgram && mode === "all") {
      // Save the current framebuffer binding (might be OIT framebuffer)
      savedFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;

      // Save current depth test state and depth function
      const depthTestEnabled = gl.getParameter(gl.DEPTH_TEST) as boolean;
      const depthFunc = gl.getParameter(gl.DEPTH_FUNC) as number;

      // Enable depth testing for picking to ensure proper occlusion
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true); // Enable depth writes

      // Use GEQUAL (greater or equal) so higher zIndex values (nodes) appear on top
      // This matches the OIT normalization where higher zIndex = higher value
      gl.depthFunc(gl.GEQUAL);

      this.pickProgram.gl.viewport(
        0,
        0,
        (params.width * params.pixelRatio) / params.downSizingRatio,
        (params.height * params.pixelRatio) / params.downSizingRatio,
      );
      this.bindProgram(this.pickProgram);
      this.renderProgram({ ...params, pixelRatio: params.pixelRatio / params.downSizingRatio }, this.pickProgram);
      this.unbindProgram(this.pickProgram);

      // Restore depth test state
      if (!depthTestEnabled) {
        gl.disable(gl.DEPTH_TEST);
      }

      // Restore depth function
      gl.depthFunc(depthFunc);

      // Restore the saved framebuffer binding for normal rendering
      gl.bindFramebuffer(gl.FRAMEBUFFER, savedFramebuffer);
    }

    // Select the appropriate program based on mode
    const program = mode === "opaque" ? this.opaqueProgram : this.normalProgram;

    // Only render if mode is appropriate (skip normal rendering for "all" mode which is picking-only)
    if (mode === "opaque" || mode === "transparent") {
      program.gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
      this.bindProgram(program);
      this.renderProgram(params, program);
      this.unbindProgram(program);
    }
  }

  drawWebGL(method: number /* GLenum */, { gl, frameBuffer }: ProgramInfo): void {
    // Only bind framebuffer if explicitly set (for picking).
    // If null, use the currently bound framebuffer (for OIT rendering).
    if (frameBuffer !== null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    }

    if (!this.isInstanced) {
      gl.drawArrays(method, 0, this.verticesCount);
    } else {
      gl.drawArraysInstanced(method, 0, this.VERTICES, this.capacity);
    }
  }
}

class _ProgramClass<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<Uniform, N, E, G> {
  getDefinition(): ProgramDefinition<Uniform> | InstancedProgramDefinition<Uniform> {
    return {} as unknown as ProgramDefinition<Uniform>;
  }
  setUniforms(_params: RenderParams, _programInfo: ProgramInfo) {
    return undefined;
  }
}
export type ProgramType<
  Uniform extends string = string,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = typeof _ProgramClass<Uniform, N, E, G>;
