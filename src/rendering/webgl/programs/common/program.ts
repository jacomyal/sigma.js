/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
import type Sigma from "../../../../sigma";
import type { RenderParams } from "../../../../types";
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

function getAttributeItemsCount(attr: ProgramAttributeSpecification): number {
  return attr.normalized ? 1 : attr.size;
}
function getAttributesItemsCount(attrs: ProgramAttributeSpecification[]): number {
  let res = 0;
  attrs.forEach((attr) => (res += getAttributeItemsCount(attr)));
  return res;
}

export interface ProgramAttributeSpecification {
  name: string;
  size: number;
  type: number;
  normalized?: boolean;
}

export interface ProgramDefinition<Uniform extends string = string> {
  VERTICES: number;
  VERTEX_SHADER_SOURCE: string;
  FRAGMENT_SHADER_SOURCE: string;
  UNIFORMS: ReadonlyArray<Uniform>;
  ATTRIBUTES: Array<ProgramAttributeSpecification>;
}

export interface InstancedProgramDefinition<Uniform extends string = string>
  extends Omit<ProgramDefinition<Uniform>, "CONSTANT_DATA" | "CONSTANT_ATTRIBUTES"> {
  CONSTANT_ATTRIBUTES: Array<ProgramAttributeSpecification>;
  CONSTANT_DATA: number[];
}

export abstract class AbstractProgram {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_gl: WebGLRenderingContext, _renderer: Sigma) {}
  abstract reallocate(capacity: number): void;
  abstract render(params: RenderParams): void;
}

export abstract class Program<Uniform extends string = string> implements AbstractProgram, ProgramDefinition {
  VERTICES: number;
  VERTEX_SHADER_SOURCE: string;
  FRAGMENT_SHADER_SOURCE: string;
  UNIFORMS: ReadonlyArray<Uniform>;
  ATTRIBUTES: Array<ProgramAttributeSpecification>;
  ATTRIBUTES_ITEMS_COUNT: number;
  CONSTANT_ATTRIBUTES: Array<ProgramAttributeSpecification>;
  CONSTANT_DATA: Float32Array = new Float32Array();
  STRIDE: number;

  renderer: Sigma;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  buffer: WebGLBuffer;
  array: Float32Array = new Float32Array();
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniformLocations = {} as Record<Uniform, WebGLUniformLocation>;
  attributeLocations: Record<string, GLint> = {};
  capacity = 0;
  verticesCount = 0;

  isInstanced: boolean;
  constantBuffer: WebGLBuffer = {} as WebGLBuffer;

  abstract getDefinition(): ProgramDefinition<Uniform> | InstancedProgramDefinition<Uniform>;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, renderer: Sigma) {
    // Reading program definition
    const definition = this.getDefinition();

    this.isInstanced = false;

    this.VERTICES = definition.VERTICES;
    this.VERTEX_SHADER_SOURCE = definition.VERTEX_SHADER_SOURCE;
    this.FRAGMENT_SHADER_SOURCE = definition.FRAGMENT_SHADER_SOURCE;
    this.UNIFORMS = definition.UNIFORMS;
    this.ATTRIBUTES = definition.ATTRIBUTES;
    this.CONSTANT_ATTRIBUTES = [];
    this.CONSTANT_DATA = new Float32Array();

    // Computing stride
    this.ATTRIBUTES_ITEMS_COUNT = getAttributesItemsCount(this.ATTRIBUTES);
    this.STRIDE = this.VERTICES * this.ATTRIBUTES_ITEMS_COUNT;

    // Members
    this.gl = gl;
    this.renderer = renderer;

    // Webgl buffers
    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the webgl buffer.");
    this.buffer = buffer;

    // Shaders and program
    this.vertexShader = loadVertexShader(this.gl, this.VERTEX_SHADER_SOURCE);
    this.fragmentShader = loadFragmentShader(this.gl, this.FRAGMENT_SHADER_SOURCE);
    this.program = loadProgram(this.gl, [this.vertexShader, this.fragmentShader]);

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

    // For instanced programs:
    if ("CONSTANT_ATTRIBUTES" in definition) {
      this.isInstanced = true;

      const constantAttributesItemsCount = getAttributesItemsCount(definition.CONSTANT_ATTRIBUTES);

      if (definition.CONSTANT_DATA.length !== constantAttributesItemsCount * this.VERTICES)
        throw new Error(
          `Program: error while getting constant data (expected ${
            constantAttributesItemsCount * this.VERTICES
          } items, received ${this.CONSTANT_DATA.length} instead`,
        );

      this.STRIDE = this.ATTRIBUTES_ITEMS_COUNT;
      this.CONSTANT_DATA = new Float32Array(definition.CONSTANT_DATA);
      this.CONSTANT_ATTRIBUTES = definition.CONSTANT_ATTRIBUTES;
      this.CONSTANT_ATTRIBUTES.forEach((attr) => {
        const location = this.gl.getAttribLocation(this.program, attr.name);
        if (location === -1) throw new Error(`Program: error while getting location for attribute "${attr.name}".`);
        this.attributeLocations[attr.name] = location;
      });

      const constantBuffer = gl.createBuffer();
      if (constantBuffer === null) throw new Error("Program: error while creating the webgl constant buffer.");
      this.constantBuffer = constantBuffer;
    }
  }

  protected bind(): void {
    const gl = this.gl;
    let offset = 0;

    if (!this.isInstanced) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      offset = 0;
      this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, offset)));
      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    } else {
      // Handle constant data (things that remain unchanged for all items):
      gl.bindBuffer(gl.ARRAY_BUFFER, this.constantBuffer);

      offset = 0;
      this.CONSTANT_ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, offset, false)));
      gl.bufferData(gl.ARRAY_BUFFER, this.CONSTANT_DATA, gl.DYNAMIC_DRAW);

      // Handle "instance specific" data (things that vary for each item):
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      offset = 0;
      this.ATTRIBUTES.forEach((attr) => (offset += this.bindAttribute(attr, offset, true)));
      gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    }
  }

  private bindAttribute(attr: ProgramAttributeSpecification, offset: number, setDivisor?: boolean): number {
    const gl = this.gl;
    const location = this.attributeLocations[attr.name];

    gl.enableVertexAttribArray(location);

    const stride = !this.isInstanced
      ? getAttributesItemsCount(this.ATTRIBUTES) * Float32Array.BYTES_PER_ELEMENT
      : getAttributesItemsCount(setDivisor ? this.ATTRIBUTES : this.CONSTANT_ATTRIBUTES) *
        Float32Array.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalized || false, stride, offset);

    if (this.isInstanced && setDivisor) {
      if (gl instanceof WebGL2RenderingContext) {
        gl.vertexAttribDivisor(location, 1);
      } else {
        const ext = gl.getExtension("ANGLE_instanced_arrays");
        if (ext) ext.vertexAttribDivisorANGLE(location, 1);
      }
    }

    const sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];
    if (typeof sizeFactor !== "number") throw new Error(`Program.bind: yet unsupported attribute type "${attr.type}"!`);

    return attr.size * sizeFactor;
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
        ? this.verticesCount * getAttributesItemsCount(this.ATTRIBUTES)
        : this.capacity * getAttributesItemsCount(this.ATTRIBUTES),
    );
  }

  hasNothingToRender(): boolean {
    return this.verticesCount === 0;
  }

  abstract draw(params: RenderParams): void;

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    this.bind();
    this.gl.useProgram(this.program);
    this.draw(params);
  }

  drawWebGL(method: GLenum): void {
    const gl = this.gl;

    if (!this.isInstanced) {
      gl.drawArrays(method, 0, this.verticesCount);
    } else {
      if (gl instanceof WebGL2RenderingContext) {
        gl.drawArraysInstanced(method, 0, this.VERTICES, this.capacity);
      } else {
        const ext = gl.getExtension("ANGLE_instanced_arrays");
        if (ext) ext.drawArraysInstancedANGLE(method, 0, this.VERTICES, this.capacity);
      }
    }
  }
}
