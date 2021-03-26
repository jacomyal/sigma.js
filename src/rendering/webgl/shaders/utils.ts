/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 * @module
 */

/**
 * Function used to load a shader.
 */
function loadShader(type: string, gl: WebGLRenderingContext, source: string): WebGLShader {
  const glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

  // Creating the shader
  const shader = gl.createShader(glType);
  if (shader === null) {
    throw new Error(`loadShader: error while creating the shader`);
  }

  // Loading source
  gl.shaderSource(shader, source);

  // Compiling the shader
  gl.compileShader(shader);

  // Retrieving compilation status
  const successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  // Throwing if something went awry
  if (!successfullyCompiled) {
    const infoLog = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);
    throw new Error(`loadShader: error while compiling the shader:\n${infoLog}\n${source}`);
  }

  return shader;
}

export function loadVertexShader(gl: WebGLRenderingContext, source: string): WebGLShader {
  return loadShader("VERTEX", gl, source);
}
export function loadFragmentShader(gl: WebGLRenderingContext, source: string): WebGLShader {
  return loadShader("FRAGMENT", gl, source);
}

/**
 * Function used to load a program.
 */
export function loadProgram(gl: WebGLRenderingContext, shaders: Array<WebGLShader>): WebGLProgram {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error("loadProgram: error while creating the program.");
  }

  let i, l;

  // Attaching the shaders
  for (i = 0, l = shaders.length; i < l; i++) gl.attachShader(program, shaders[i]);

  gl.linkProgram(program);

  // Checking status
  const successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!successfullyLinked) {
    gl.deleteProgram(program);
    throw new Error("loadProgram: error while linking the program.");
  }

  return program;
}
