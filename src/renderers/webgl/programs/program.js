/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 */
import {
  loadVertexShader,
  loadFragmentShader,
  loadProgram
} from '../shaders/utils';

/**
 * Program class.
 *
 * @constructor
 */
export default class Program {

  /**
   * Method used to load the program into a webgl context.
   *
   * @param  {WebGLContext} gl - The WebGL context.
   * @return {WebGLProgram}
   */
  load(gl) {
    this.vertexShader = loadVertexShader(gl, this.vertexShaderSource);
    this.fragmentShader = loadFragmentShader(gl, this.fragmentShaderSource);

    this.program = loadProgram(gl, [
      this.vertexShader,
      this.fragmentShader
    ]);

    return this.program;
  }
}
