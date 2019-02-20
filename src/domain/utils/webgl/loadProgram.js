/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 *
 * @param  {Array.<WebGLShader>}    shaders   The shaders to attach.
 * @param  {Array.<string>}         attribs   The attribs names.
 * @param  {Array.<number>}         locations The locations for the attribs.
 * @param  {function(string): void} error     Callback for errors.
 * @return {WebGLProgram}                     The created program.
 */
export default function loadProgram(gl, shaders, attribs, loc, error) {
  let i;
  const program = gl.createProgram();

  for (i = 0; i < shaders.length; ++i) gl.attachShader(program, shaders[i]);

  if (attribs)
    for (i = 0; i < attribs.length; ++i)
      gl.bindAttribLocation(
        program,
        locations ? locations[i] : i,
        opt_attribs[i]
      );

  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    if (error)
      error(`Error in program linking: ${gl.getProgramInfoLog(program)}`);

    gl.deleteProgram(program);
    return null;
  }

  return program;
}
