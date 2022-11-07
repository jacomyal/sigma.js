import type Sigma from "../../../../sigma";
import type { NodeDisplayData } from "../../../../types";
import type { RenderParams } from "./program";
import { floatColor, canUse32BitsIndices } from "../../../../utils";
import { loadVertexShader, loadFragmentShader, loadProgram } from "../../shaders/utils";

// ---------------------------------------------------------------------
// Minimum viable class to implement for your program to work with Sigma
// ---------------------------------------------------------------------
export abstract class AbstractNodeProgram {
  constructor(_gl: WebGLRenderingContext, _renderer: Sigma) {}
  abstract reallocate(capacity: number): void;
  abstract process(offset: number, data: NodeDisplayData, hidden?: boolean): void;
  abstract render(params: RenderParams): void;
}

// --------------------------
// Typical Sigma node program
// --------------------------

// TODO: edge vs. node
// TODO: indices

export interface AttributeSpecification {
  name: string;
  size: number;
  type: number;
  normalized?: boolean;
}

export abstract class NodeProgram implements AbstractNodeProgram {
  abstract readonly VERTICES: number;
  abstract readonly ARRAY_ITEMS_PER_VERTEX: number;
  abstract readonly VERTEX_SHADER_SOURCE: string;
  abstract readonly FRAGMENT_SHADER_SOURCE: string;
  abstract readonly UNIFORMS: Array<string>;
  abstract readonly ATTRIBUTES: Array<AttributeSpecification>;
  STRIDE: number = 0;

  renderer: Sigma;
  gl: WebGLRenderingContext;
  canUse32BitsIndices: boolean;
  indicesType: number;
  IndicesArray: Uint16ArrayConstructor | Uint32ArrayConstructor;
  buffer: WebGLBuffer;
  array: Float32Array = new Float32Array();
  indicesArray: Uint16Array | Uint32Array | null = null;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniformLocations: Record<string, WebGLUniformLocation> = {};
  attributeLocations: Record<string, GLint> = {};
  capacity = 0;
  verticesCount = 0;

  constructor(gl: WebGLRenderingContext, renderer: Sigma) {
    this.gl = gl;
    this.renderer = renderer;

    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("Program: error while creating the webgl buffer.");
    this.buffer = buffer;

    // Not doing this in the constructor because of abstract members
    const [vertexShader, fragmentShader, program] = this.loadProgram();

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = program;

    this.canUse32BitsIndices = canUse32BitsIndices(this.gl);
    this.indicesType = this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    this.IndicesArray = this.canUse32BitsIndices ? Uint32Array : Uint16Array;

    this.init();
  }

  private loadProgram() {
    const vertexShader = loadVertexShader(this.gl, this.VERTEX_SHADER_SOURCE);
    const fragmentShader = loadFragmentShader(this.gl, this.FRAGMENT_SHADER_SOURCE);
    const program = loadProgram(this.gl, [this.vertexShader, this.fragmentShader]);

    return [vertexShader, fragmentShader, program];
  }

  private init() {
    this.STRIDE = this.VERTICES * this.ARRAY_ITEMS_PER_VERTEX;

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

  private bind(): void {
    const gl = this.gl;

    for (const attributeName in this.ATTRIBUTES) {
      gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
    }

    let offset = 0;

    for (const attributeName in this.ATTRIBUTES) {
      const location = this.attributeLocations[attributeName];
      const attribute = this.ATTRIBUTES[attributeName];

      gl.vertexAttribPointer(
        location,
        attribute.size,
        attribute.type,
        attribute.normalized || false,
        this.ARRAY_ITEMS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT,
        offset,
      );

      if (attribute.type === WebGLRenderingContext.UNSIGNED_BYTE) {
        offset += attribute.size;
      } else if (attribute.type === WebGLRenderingContext.FLOAT) {
        offset += attribute.size * 4;
      } else {
        throw new Error("yet unsupported attribute type");
      }
    }
  }

  private bufferData(): void {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  // NOTE: implementing `reallocateIndices` is optional
  reallocateIndices(_IndicesArray: Uint16ArrayConstructor | Uint32ArrayConstructor, _capacity: number): void {
    return;
  }

  reallocate(capacity: number): void {
    // NOTE: we should test here capacity changes and assess whether arrays
    // must be dynamically reallocated or not. This makes the keepArrays
    // argument of renderer.process useless and we can drop the
    // soft process vs. hard process difference which should simplify the
    // renderer's lifecycle.

    if (capacity === this.capacity) return;

    this.capacity = capacity;
    this.verticesCount = this.VERTICES * capacity;
    this.array = new Float32Array(this.verticesCount * this.ARRAY_ITEMS_PER_VERTEX);

    if (typeof this.reallocateIndices === "function") this.reallocateIndices(this.IndicesArray, capacity);
  }

  hasNothingToRender(): boolean {
    return this.array.length === 0;
  }

  process(offset: number, data: NodeDisplayData, hidden?: boolean): void {
    let i = offset * this.STRIDE;

    // NOTE: dealing with the hidden issues automatically
    if (!hidden) return this.processShownItem(this.array, i, data);

    for (let l = i + this.STRIDE; i < l; i++) {
      this.array[i] = 0;
    }
  }

  // NOTE: I chose to explicitly pass members of the class to the methods
  // such as this.gl etc. but this could be dropped, I just feel it makes
  // the class easier to implement, regarding our usual practice
  abstract processShownItem(array: Float32Array, i: number, data: NodeDisplayData): void;
  abstract setUniforms(
    gl: WebGLRenderingContext,
    locations: Record<string, WebGLUniformLocation>,
    params: RenderParams,
  ): void;
  abstract draw(gl: WebGLRenderingContext, params: RenderParams): void;

  render(params: RenderParams): void {
    if (this.hasNothingToRender()) return;

    this.bind();
    this.bufferData();
    this.gl.useProgram(this.program);
    this.setUniforms(this.gl, this.uniformLocations, params);
    this.draw(this.gl, params);
  }
}

// -------
// EXAMPLE
// -------
import vertexShaderSource from "../shaders/node.vert.glsl";
import fragmentShaderSource from "../shaders/node.frag.glsl";

const { FLOAT, UNSIGNED_BYTE } = WebGLRenderingContext;

export class NodeFastProgram extends NodeProgram {
  readonly VERTICES = 1;
  readonly ARRAY_ITEMS_PER_VERTEX = 5;
  readonly VERTEX_SHADER_SOURCE = vertexShaderSource;
  readonly FRAGMENT_SHADER_SOURCE = fragmentShaderSource;
  readonly UNIFORMS = ["u_matrix", "u_sqrtZoomRatio", "u_correctionRatio"];
  readonly ATTRIBUTES = [
    { name: "a_position", size: 2, type: FLOAT },
    { name: "a_size", size: 1, type: FLOAT },
    { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
    { name: "a_angle", size: 1, type: FLOAT },
  ];

  processShownItem(array: Float32Array, i: number, data: NodeDisplayData): void {
    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;
  }

  setUniforms(
    gl: WebGLRenderingContext,
    { u_matrix, u_sqrtZoomRatio, u_correctionRatio }: Record<string, WebGLUniformLocation>,
    params: RenderParams,
  ): void {
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
    gl.uniform1f(u_sqrtZoomRatio, Math.sqrt(params.ratio));
    gl.uniform1f(u_correctionRatio, params.correctionRatio);
  }

  draw(gl: WebGLRenderingContext, _params: RenderParams): void {
    gl.drawArrays(gl.TRIANGLES, 0, this.verticesCount);
  }
}
