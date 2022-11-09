/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
import type Sigma from "../../../../sigma";
import { canUse32BitsIndices } from "../../../../utils";
import { loadVertexShader, loadFragmentShader, loadProgram } from "../../shaders/utils";

export interface RenderParams {
  width: number;
  height: number;
  sizeRatio: number;
  zoomRatio: number;
  pixelRatio: number;
  correctionRatio: number;
  matrix: Float32Array;
}

export interface ProgramAttributeSpecification {
  name: string;
  size: number;
  type: number;
  normalized?: boolean;
}

export abstract class AbstractProgram {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_gl: WebGLRenderingContext, _renderer: Sigma) {}
  abstract reallocate(capacity: number): void;
  abstract render(params: RenderParams): void;
}

export abstract class Program<Uniform extends string = string> implements AbstractProgram {
  abstract VERTICES: number;
  abstract ARRAY_ITEMS_PER_VERTEX: number;
  abstract VERTEX_SHADER_SOURCE: string;
  abstract FRAGMENT_SHADER_SOURCE: string;
  abstract UNIFORMS: ReadonlyArray<Uniform>;
  abstract ATTRIBUTES: Array<ProgramAttributeSpecification>;
  STRIDE = 0;

  renderer: Sigma;
  gl: WebGLRenderingContext;
  canUse32BitsIndices: boolean;
  indicesType: number;
  IndicesArray: Uint16ArrayConstructor | Uint32ArrayConstructor;
  buffer: WebGLBuffer;
  array: Float32Array = new Float32Array();
  indicesArray: Uint16Array | Uint32Array | null = null;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniformLocations = {} as Record<Uniform, WebGLUniformLocation>;
  attributeLocations: Record<string, GLint> = {};
  capacity = 0;
  verticesCount = 0;

  constructor(gl: WebGLRenderingContext, renderer: Sigma) {
    this.gl = gl;
    this.renderer = renderer;

    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the webgl buffer.");
    this.buffer = buffer;

    // Not doing this in the constructor because of abstract members
    const [vertexShader, fragmentShader, program] = this.loadProgram();

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = program;

    this.canUse32BitsIndices = canUse32BitsIndices(this.gl);
    this.indicesType = this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    this.IndicesArray = this.canUse32BitsIndices ? Uint32Array : Uint16Array;

    this.init();
  }

  private loadProgram() {
    const vertexShader = loadVertexShader(this.gl, this.VERTEX_SHADER_SOURCE);
    const fragmentShader = loadFragmentShader(this.gl, this.FRAGMENT_SHADER_SOURCE);
    const program = loadProgram(this.gl, [vertexShader, fragmentShader]);

    return [vertexShader, fragmentShader, program];
  }

  private init() {
    this.STRIDE = this.VERTICES * this.ARRAY_ITEMS_PER_VERTEX;

    this.UNIFORMS.forEach((uniformName) => {
      const location = this.gl.getUniformLocation(this.program, uniformName);
      if (location === null) throw new Error(`Program: error while getting location for uniform "${uniformName}".`);
      this.uniformLocations[uniformName] = location;
    });

    for (const attributeName in this.ATTRIBUTES) {
      const location = this.gl.getAttribLocation(this.program, attributeName);
      if (location === -1) throw new Error(`Program: error while getting location for attribute "${attributeName}".`);
      this.attributeLocations[attributeName] = location;
    }
  }

  private bind(): void {
    const gl = this.gl;

    for (const attributeName in this.ATTRIBUTES) {
      gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
    }

    let offset = 0;

    for (const attributeName in this.ATTRIBUTES) {
      const location = this.attributeLocations[attributeName];
      const attribute = this.ATTRIBUTES[attributeName];

      gl.vertexAttribPointer(
        location,
        attribute.size,
        attribute.type,
        attribute.normalized || false,
        this.ARRAY_ITEMS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT,
        offset,
      );

      if (attribute.type === WebGLRenderingContext.UNSIGNED_BYTE) {
        offset += attribute.size;
      } else if (attribute.type === WebGLRenderingContext.FLOAT) {
        offset += attribute.size * 4;
      } else {
        throw new Error("yet unsupported attribute type");
      }
    }
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

  abstract setUniforms(params: RenderParams): void;
  abstract draw(params: RenderParams): void;

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    this.bind();
    this.bufferData();
    this.gl.useProgram(this.program);
    this.setUniforms(params);
    this.draw(params);
  }
}
