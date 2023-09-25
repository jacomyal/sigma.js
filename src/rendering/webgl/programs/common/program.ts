/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
import type Sigma from "../../../../sigma";
import type { RenderParams } from "../../../../types";
import { canUse32BitsIndices } from "../../../../utils";
import { loadVertexShader, loadFragmentShader, loadProgram } from "../../shaders/utils";

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

export interface ProgramAttributeSpecification {
  name: string;
  size: number;
  type: number;
  normalized?: boolean;
}

export interface ProgramDefinition<Uniform extends string = string> {
  VERTICES: number;
  ARRAY_ITEMS_PER_VERTEX: number;
  VERTEX_SHADER_SOURCE: string;
  FRAGMENT_SHADER_SOURCE: string;
  UNIFORMS: ReadonlyArray<Uniform>;
  ATTRIBUTES: Array<ProgramAttributeSpecification>;
}

export abstract class AbstractProgram {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_gl: WebGLRenderingContext, _renderer: Sigma) {}
  abstract reallocate(capacity: number): void;
  abstract render(params: RenderParams): void;
}

export abstract class Program<Uniform extends string = string> implements AbstractProgram, ProgramDefinition {
  VERTICES: number;
  ARRAY_ITEMS_PER_VERTEX: number;
  VERTEX_SHADER_SOURCE: string;
  FRAGMENT_SHADER_SOURCE: string;
  UNIFORMS: ReadonlyArray<Uniform>;
  ATTRIBUTES: Array<ProgramAttributeSpecification>;
  STRIDE: number;

  renderer: Sigma;
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  array: Float32Array = new Float32Array();
  canUse32BitsIndices: boolean;
  indicesType: number;
  indicesBuffer: WebGLBuffer;
  IndicesArray: Uint16ArrayConstructor | Uint32ArrayConstructor;
  indicesArray: Uint16Array | Uint32Array | null = null;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniformLocations = {} as Record<Uniform, WebGLUniformLocation>;
  attributeLocations: Record<string, GLint> = {};
  capacity = 0;
  verticesCount = 0;

  abstract getDefinition(): ProgramDefinition<Uniform>;

  constructor(gl: WebGLRenderingContext, renderer: Sigma) {
    // Reading program definition
    const definition = this.getDefinition();

    this.VERTICES = definition.VERTICES;
    this.ARRAY_ITEMS_PER_VERTEX = definition.ARRAY_ITEMS_PER_VERTEX;
    this.VERTEX_SHADER_SOURCE = definition.VERTEX_SHADER_SOURCE;
    this.FRAGMENT_SHADER_SOURCE = definition.FRAGMENT_SHADER_SOURCE;
    this.UNIFORMS = definition.UNIFORMS;
    this.ATTRIBUTES = definition.ATTRIBUTES;

    // Computing stride
    this.STRIDE = this.VERTICES * this.ARRAY_ITEMS_PER_VERTEX;

    // Members
    this.gl = gl;
    this.renderer = renderer;

    // Webgl buffers
    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the webgl buffer.");
    this.buffer = buffer;

    const indicesBuffer = gl.createBuffer();
    if (indicesBuffer === null) throw new Error("Program: error while creating the webgl indices buffer.");
    this.indicesBuffer = indicesBuffer;

    // Shaders and program
    this.vertexShader = loadVertexShader(this.gl, this.VERTEX_SHADER_SOURCE);
    this.fragmentShader = loadFragmentShader(this.gl, this.FRAGMENT_SHADER_SOURCE);
    this.program = loadProgram(this.gl, [this.vertexShader, this.fragmentShader]);

    // Indices
    this.canUse32BitsIndices = canUse32BitsIndices(this.gl);
    this.indicesType = this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    this.IndicesArray = this.canUse32BitsIndices ? Uint32Array : Uint16Array;

    // Initializing locations
    this.UNIFORMS.forEach((uniformName) => {
      const location = this.gl.getUniformLocation(this.program, uniformName);
      if (location === null) throw new Error(`Program: error while getting location for uniform "${uniformName}".`);
      this.uniformLocations[uniformName] = location;
    });

    this.ATTRIBUTES.forEach((attr) => {
      const location = this.gl.getAttribLocation(this.program, attr.name);
      if (location === -1) throw new Error(`Program: error while getting location for attribute "${attr.name}".`);
      this.attributeLocations[attr.name] = location;
    });
  }

  private bind(): void {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    if (this.indicesArray) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    }

    for (const attributeName in this.attributeLocations) {
      gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
    }

    let offset = 0;

    this.ATTRIBUTES.forEach((attr) => {
      const location = this.attributeLocations[attr.name];

      gl.vertexAttribPointer(
        location,
        attr.size,
        attr.type,
        attr.normalized || false,
        this.ARRAY_ITEMS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT,
        offset,
      );

      const sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];

      if (typeof sizeFactor !== "number")
        throw new Error(`Program.bind: yet unsupported attribute type "${attr.type}"!`);

      offset += attr.size * sizeFactor;
    });
  }

  private bufferData(): void {
    const gl = this.gl;

    this.gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);

    if (this.indicesArray) {
      this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    }
  }

  // NOTE: implementing `reallocateIndices` is optional
  reallocateIndices(): void {
    return;
  }

  reallocate(capacity: number): void {
    // If desired capacity has not changed we do nothing
    // NOTE: it's possible here to implement more subtle reallocation schemes
    // when the number of rendered items increase or decrease
    if (capacity === this.capacity) return;

    this.capacity = capacity;
    this.verticesCount = this.VERTICES * capacity;
    this.array = new Float32Array(this.verticesCount * this.ARRAY_ITEMS_PER_VERTEX);

    if (typeof this.reallocateIndices === "function") this.reallocateIndices();
  }

  hasNothingToRender(): boolean {
    return this.verticesCount === 0;
  }

  abstract draw(params: RenderParams): void;

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    this.bind();
    this.bufferData();
    this.gl.useProgram(this.program);
    this.draw(params);
  }
}
