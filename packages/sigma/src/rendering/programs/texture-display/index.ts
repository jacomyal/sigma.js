/**
 * Sigma.js Texture Display Program
 * ==================================
 *
 * Simple program that displays a single texture to the screen.
 * Used for debugging purposes (e.g., displaying picking layer).
 * @module
 */
import { Settings } from "../../../settings";
import { loadFragmentShader, loadProgram, loadVertexShader } from "../../utils";
import FRAGMENT_SHADER_SOURCE from "./frag.glsl";
import VERTEX_SHADER_SOURCE from "./vert.glsl";

const { FLOAT } = WebGL2RenderingContext;

export interface TextureDisplayProgramInfo {
  program: WebGLProgram;
  gl: WebGL2RenderingContext;
  uniformLocations: {
    u_texture: WebGLUniformLocation;
    u_downSizingRatio: WebGLUniformLocation;
  };
  attributeLocations: {
    a_position: number;
  };
  buffer: WebGLBuffer;
}

export class TextureDisplayProgram {
  private gl: WebGL2RenderingContext;
  private settings: Settings;
  private programInfo: TextureDisplayProgramInfo | null = null;

  constructor(gl: WebGL2RenderingContext, settings: Settings) {
    this.gl = gl;
    this.settings = settings;
    this.initialize();
  }

  private initialize(): void {
    const gl = this.gl;

    // Create shader program
    const program = loadProgram(gl, [
      loadVertexShader(gl, VERTEX_SHADER_SOURCE),
      loadFragmentShader(gl, FRAGMENT_SHADER_SOURCE),
    ]);

    if (!program) {
      throw new Error("TextureDisplayProgram: failed to create shader program");
    }

    // Validate the program
    gl.validateProgram(program);
    const validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validateStatus) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(`[Texture Display Init] Program validation failed: ${info}`);
    }

    // Get uniform locations
    const u_texture = gl.getUniformLocation(program, "u_texture");
    const u_downSizingRatio = gl.getUniformLocation(program, "u_downSizingRatio");

    if (!u_texture || !u_downSizingRatio) {
      throw new Error("TextureDisplayProgram: failed to get uniform locations");
    }

    // Get attribute locations
    const a_position = gl.getAttribLocation(program, "a_position");

    if (a_position < 0) {
      throw new Error("TextureDisplayProgram: failed to get attribute location for a_position");
    }

    // Create full-screen quad buffer (two triangles)
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("TextureDisplayProgram: failed to create buffer");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // prettier-ignore
    const vertices = new Float32Array([
      -1, -1,  // Bottom-left
       1, -1,  // Bottom-right
      -1,  1,  // Top-left
      -1,  1,  // Top-left
       1, -1,  // Bottom-right
       1,  1,  // Top-right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.programInfo = {
      program,
      gl,
      uniformLocations: {
        u_texture,
        u_downSizingRatio,
      },
      attributeLocations: {
        a_position,
      },
      buffer,
    };
  }

  render(texture: WebGLTexture, downSizingRatio: number): void {
    if (!this.programInfo) {
      throw new Error("TextureDisplayProgram: not initialized");
    }

    const { program, gl, uniformLocations, attributeLocations, buffer } = this.programInfo;

    // Ensure we're rendering to the screen framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Set viewport to full canvas size
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Use the display shader program
    gl.useProgram(program);

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniformLocations.u_texture, 0);

    // Set downsampling ratio
    gl.uniform1f(uniformLocations.u_downSizingRatio, downSizingRatio);

    // Set up vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attributeLocations.a_position);
    gl.vertexAttribPointer(attributeLocations.a_position, 2, FLOAT, false, 0, 0);

    // Disable depth testing and blending for display pass
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    // Render full-screen quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Check for errors
    if (this.settings.DEBUG_checkWebGLErrors) {
      const glError = gl.getError();
      if (glError !== gl.NO_ERROR) {
        throw new Error(`Texture Display: GL error: ${glError} (0x${glError.toString(16)})`);
      }
    }

    // Re-enable depth testing and blending for next frame
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
  }

  kill(): void {
    if (this.programInfo) {
      const { gl, program, buffer } = this.programInfo;
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      this.programInfo = null;
    }
  }
}

export default TextureDisplayProgram;
