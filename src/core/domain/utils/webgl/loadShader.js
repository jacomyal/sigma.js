/**
 * Loads a WebGL shader and returns it.
 *
 * @param  {WebGLContext}           gl           The WebGLContext to use.
 * @param  {string}                 shaderSource The shader source.
 * @param  {number}                 shaderType   The type of shader.
 * @param  {function(string): void} error        Callback for errors.
 * @return {WebGLShader}                         The created shader.
 */
export default function loadShader(gl, shaderSource, shaderType, error) {
  const shader = gl.createShader(shaderType);

  // Load the shader source
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  // If something went wrong:
  if (!compiled) {
    if (error) {
      error(
        `Error compiling shader "${shader}":${gl.getShaderInfoLog(shader)}`
      );
    }

    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
