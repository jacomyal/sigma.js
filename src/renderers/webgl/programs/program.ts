/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 */
import { loadVertexShader, loadFragmentShader, loadProgram } from "../shaders/utils";

interface SomeProgramConstructor {
  new (gl: WebGLRenderingContext): Program;
}
/**
 * Program class.
 *
 * @constructor
 */
export default abstract class Program {
  gl: WebGLRenderingContext;
  array: Float32Array = new Float32Array();
  buffer: WebGLBuffer;
  vertexShaderSource: string;
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  programs: Array<WebGLProgram> = [];

  constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    // Binding context
    this.gl = gl;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    const buffer = gl.createBuffer();
    if (buffer === null)
      throw new Error("sigma/renderers/webgl/program/program.Program: error while creating the buffer");
    this.buffer = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    this.vertexShader = loadVertexShader(gl, this.vertexShaderSource);
    this.fragmentShader = loadFragmentShader(gl, this.fragmentShaderSource);
    this.program = loadProgram(gl, [this.vertexShader, this.fragmentShader]);
  }

  abstract allocate(capacity: any): void;
  abstract process(...args: any): void;
  abstract computeIndices(): void;
  abstract bufferData(): void;
  abstract render(...args: any): void;
}

/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
// TODO: maybe those should handle their own canvases
export function createCompoundProgram(programClasses: Array<SomeProgramConstructor>) {
  return class CompoundProgram {
    programs: Array<Program>;

    constructor(gl: WebGLRenderingContext) {
      this.programs = programClasses.map((ProgramClass) => {
        return new ProgramClass(gl);
      });
    }

    allocate(capacity: number): void {
      this.programs.forEach((program) => program.allocate(capacity));
    }

    process(): void {
      const args = arguments;

      this.programs.forEach((program) => program.process(...args));
    }

    computeIndices(): void {
      this.programs.forEach((program) => {
        if (typeof program.computeIndices === "function") program.computeIndices();
      });
    }

    bufferData(): void {
      this.programs.forEach((program) => program.bufferData());
    }

    render(): void {
      const args = arguments;
      this.programs.forEach((program) => {
        program.bufferData();
        program.render(...args);
      });
    }
  };
}
