/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 */
import { loadVertexShader, loadFragmentShader, loadProgram } from "../shaders/utils";

/**
 * Program class.
 *
 * @constructor
 */
export default class Program {
  gl: WebGLRenderingContext;
  array: Float32Array = null;
  buffer: WebGLBuffer;
  vertexShaderSource: string;
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  fragmentShader: WebGLShader;
  program: WebGLProgram;

  constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    // Binding context
    this.gl = gl;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    this.load(gl);
  }

  /**
   * Method used to load the program into a webgl context.
   *
   * @param  {WebGLContext} gl - The WebGL context.
   * @return {WebGLProgram}
   */
  load(gl) {
    this.vertexShader = loadVertexShader(gl, this.vertexShaderSource);
    this.fragmentShader = loadFragmentShader(gl, this.fragmentShaderSource);

    this.program = loadProgram(gl, [this.vertexShader, this.fragmentShader]);

    return this.program;
  }
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
export function createCompoundProgram(programClasses) {
  return class CompoundProgram {
    programs: any;
    constructor(gl) {
      this.programs = programClasses.map((ProgramClass) => new ProgramClass(gl));
    }

    allocate(capacity) {
      this.programs.forEach((program) => program.allocate(capacity));
    }

    process() {
      const args = arguments;

      this.programs.forEach((program) => program.process(...args));
    }

    computeIndices() {
      this.programs.forEach((program) => {
        if (typeof program.computeIndices === "function") program.computeIndices();
      });
    }

    bufferData() {
      this.programs.forEach((program) => program.bufferData());
    }

    render() {
      const args = arguments;

      this.programs.forEach((program) => {
        program.bind();
        program.bufferData();
        program.render(...args);
      });
    }
  };
}
