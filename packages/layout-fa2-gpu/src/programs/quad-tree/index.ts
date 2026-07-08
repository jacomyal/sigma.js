import { createFloatTexture, createFramebuffer, createProgram } from "../../utils";
import { BoundariesGPU } from "../boundaries";
import { getQuadTreeSplatFragmentShader } from "./fragment-splat";
import { getQuadTreeSplatVertexShader } from "./vertex-splat";

export type QuadTreeGPUSettings = {
  depth: number;
};

/**
 * Returns a depth so that the finest grid has roughly one cell per node
 * (finest grid size is 2^depth, so 4^depth cells).
 */
export function getDefaultQuadTreeDepth(nodesCount: number): number {
  return Math.max(3, Math.min(11, Math.ceil(Math.log2(Math.max(nodesCount, 2)) / 2)));
}

export function getQuadTreeLevelSize(level: number): number {
  return 2 ** (level + 1);
}

/**
 * All levels are stacked vertically in a single atlas texture: level 0 (2x2)
 * starts at row 0, level 1 (4x4) at row 2, level 2 (8x8) at row 6, etc.
 */
export function getQuadTreeLevelRowOffset(level: number): number {
  return 2 ** (level + 1) - 2;
}

export function getQuadTreeAtlasWidth(depth: number): number {
  return 2 ** depth;
}

export function getQuadTreeAtlasHeight(depth: number): number {
  return 2 ** (depth + 1) - 2;
}

/**
 * This class computes a complete quadtree over the nodes, stored as a stack
 * of uniform grids (one per depth):
 * - Each level is a 2^(level+1) x 2^(level+1) grid, covering the square
 *   bounding box of the graph
 * - Each cell accumulates the mass, weighted position sum and count of the
 *   nodes it contains
 * - Cells are filled by drawing all nodes as 1px points with additive
 *   blending (one draw call per level), so there is no sorting and no CPU
 *   readback involved. Additive blending on float textures requires the
 *   EXT_float_blend extension, checked by the layout's constructor.
 */
export class QuadTreeGPU {
  private gl: WebGL2RenderingContext;
  private nodesCount: number;
  private params: QuadTreeGPUSettings;

  // Programs:
  private boundaries: BoundariesGPU;
  private splatProgram: WebGLProgram;
  private splatVAO: WebGLVertexArrayObject;
  private splatUniformLocations: {
    nodesPositionTexture: WebGLUniformLocation | null;
    boundariesTexture: WebGLUniformLocation | null;
    gridSize: WebGLUniformLocation | null;
  };

  // Output:
  private atlasTexture: WebGLTexture;
  private atlasFramebuffer: WebGLFramebuffer;

  constructor(gl: WebGL2RenderingContext, { nodesCount }: { nodesCount: number }, params: QuadTreeGPUSettings) {
    this.gl = gl;
    this.nodesCount = nodesCount;
    this.params = params;

    // Boundaries program (parallel min/max reduction):
    this.boundaries = new BoundariesGPU(gl, { nodesCount });

    // Splat program (points drawing):
    this.splatProgram = createProgram(
      gl,
      getQuadTreeSplatVertexShader({ nodesCount }),
      getQuadTreeSplatFragmentShader(),
      "splat program",
    );
    this.splatUniformLocations = {
      nodesPositionTexture: gl.getUniformLocation(this.splatProgram, "u_nodesPositionTexture"),
      boundariesTexture: gl.getUniformLocation(this.splatProgram, "u_boundariesTexture"),
      gridSize: gl.getUniformLocation(this.splatProgram, "u_gridSize"),
    };

    // The splat program draws points without any attribute (it only uses
    // gl_VertexID), so it gets its own empty VAO:
    this.splatVAO = gl.createVertexArray() as WebGLVertexArrayObject;

    // Atlas texture and framebuffer:
    const { depth } = this.params;
    this.atlasTexture = createFloatTexture(gl, getQuadTreeAtlasWidth(depth), getQuadTreeAtlasHeight(depth));
    this.atlasFramebuffer = createFramebuffer(gl, this.atlasTexture, "QuadTreeGPU atlas framebuffer");
  }

  /**
   * Public API:
   * ***********
   */

  /**
   * Recomputes the boundaries and the whole quadtree atlas from the given
   * nodes position texture.
   */
  public compute(nodesTexture: WebGLTexture) {
    const { gl, boundaries, splatProgram, splatVAO, atlasFramebuffer } = this;
    const { depth } = this.params;

    // 1. Compute boundaries:
    boundaries.compute(nodesTexture);

    // 2. Splat all nodes into each level of the quadtree:
    gl.useProgram(splatProgram);
    gl.bindVertexArray(splatVAO);
    gl.bindFramebuffer(gl.FRAMEBUFFER, atlasFramebuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, nodesTexture);
    gl.uniform1i(this.splatUniformLocations.nodesPositionTexture, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, boundaries.getBoundariesTexture());
    gl.uniform1i(this.splatUniformLocations.boundariesTexture, 1);

    gl.viewport(0, 0, getQuadTreeAtlasWidth(depth), getQuadTreeAtlasHeight(depth));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);

    for (let level = 0; level < depth; level++) {
      const size = getQuadTreeLevelSize(level);
      gl.viewport(0, getQuadTreeLevelRowOffset(level), size, size);
      gl.uniform1f(this.splatUniformLocations.gridSize, size);
      gl.drawArrays(gl.POINTS, 0, this.nodesCount);
    }

    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // These methods are for the WebGL pipelines:
  public getAtlasTexture(): WebGLTexture {
    return this.atlasTexture;
  }
  public getBoundariesTexture(): WebGLTexture {
    return this.boundaries.getBoundariesTexture();
  }
  public getDepth(): number {
    return this.params.depth;
  }

  public kill() {
    const { gl } = this;
    this.boundaries.kill();
    gl.deleteProgram(this.splatProgram);
    gl.deleteVertexArray(this.splatVAO);
    gl.deleteTexture(this.atlasTexture);
    gl.deleteFramebuffer(this.atlasFramebuffer);
  }
}
