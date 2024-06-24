export function getAttributeItemsCount(attr: ProgramAttributeSpecification): number {
  return attr.normalized ? 1 : attr.size;
}
export function getAttributesItemsCount(attrs: ProgramAttributeSpecification[]): number {
  let res = 0;
  attrs.forEach((attr) => (res += getAttributeItemsCount(attr)));
  return res;
}

export interface ProgramInfo<Uniform extends string = string> {
  name: string;
  isPicking: boolean;
  program: WebGLProgram;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  frameBuffer: WebGLFramebuffer | null;
  buffer: WebGLBuffer;
  constantBuffer: WebGLBuffer;
  uniformLocations: Record<Uniform, WebGLUniformLocation>;
  attributeLocations: Record<string, number>; // Record<string, GLint>
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
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
  METHOD: number; // GLenum
}

export interface InstancedProgramDefinition<Uniform extends string = string> extends ProgramDefinition<Uniform> {
  CONSTANT_ATTRIBUTES: Array<ProgramAttributeSpecification>;
  CONSTANT_DATA: number[][];
}

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

export function killProgram({ gl, buffer, program, vertexShader, fragmentShader }: ProgramInfo): void {
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.deleteProgram(program);
  gl.deleteBuffer(buffer);
}

/**
 * Function use to print a float for inserting in a GLSL program.
 */
export function numberToGLSLFloat(n: number): string {
  return n % 1 === 0 ? n.toFixed(1) : n.toString();
}
