import { loadVertexShader, loadFragmentShader, loadProgram } from "../../shaders/utils";

export type AttributeSpecification = {
  name: string;
  size: number;
  type: "float" | "unsigned_byte";
};

export abstract class NodeProgram {
  abstract readonly VERTICES: number;
  abstract readonly ARRAY_ITEMS_PER_VERTEX: number;
  abstract readonly VERTEX_SHADER_SOURCE: string;
  abstract readonly FRAGMENT_SHADER_SOURCE: string;
  abstract readonly UNIFORMS: Array<string>;
  abstract readonly ATTRIBUTES: Array<AttributeSpecification>;

  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  array: Float32Array = new Float32Array();
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniformLocations: Record<string, WebGLUniformLocation> = {};
  attributeLocations: Record<string, GLint> = {};
  capacity = 0;
  vertices = 0;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the webgl buffer.");
    this.buffer = buffer;

    // Not doing this in the constructor because of abstract members
    const [vertexShader, fragmentShader, program] = this.loadProgram();

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = program;

    this.initLocations();
    this.bind();
  }

  private loadProgram() {
    const vertexShader = loadVertexShader(this.gl, this.VERTEX_SHADER_SOURCE);
    const fragmentShader = loadFragmentShader(this.gl, this.FRAGMENT_SHADER_SOURCE);
    const program = loadProgram(this.gl, [this.vertexShader, this.fragmentShader]);

    return [vertexShader, fragmentShader, program];
  }

  private initLocations() {
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

  bind(): void {
    const gl = this.gl;

    for (const attributeName in this.ATTRIBUTES) {
      gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
    }

    // TODO: strides
  }

  bufferData(): void {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  allocate(capacity: number): void {
    this.capacity = capacity;
    this.vertices = this.VERTICES * capacity;
    this.array = new Float32Array(this.vertices * this.ARRAY_ITEMS_PER_VERTEX);
  }

  hasNothingToRender(): boolean {
    return this.array.length === 0;
  }

  // TODO: process, processAll, render, draw
}

// -------
// EXAMPLE
// -------
import vertexShaderSource from "../shaders/node.vert.glsl";
import fragmentShaderSource from "../shaders/node.frag.glsl";

export class NodeFastProgram extends NodeProgram {
  readonly VERTICES = 1;
  readonly ARRAY_ITEMS_PER_VERTEX = 5;
  readonly VERTEX_SHADER_SOURCE = vertexShaderSource;
  readonly FRAGMENT_SHADER_SOURCE = fragmentShaderSource;
  readonly UNIFORMS = ["u_matrix", "u_sqrtZoomRatio", "u_correctionRatio"];
  readonly ATTRIBUTES = [
    { name: "a_position", size: 2, type: "float" as const },
    { name: "a_size", size: 1, type: "float" as const },
    { name: "a_color", size: 4, type: "unsigned_byte" as const },
    { name: "a_angle", size: 1, type: "float" as const },
  ];
}
