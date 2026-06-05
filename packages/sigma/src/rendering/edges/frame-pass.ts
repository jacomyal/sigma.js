/**
 * Sigma.js Edge Frame-Pass
 * ========================
 *
 * The one place that figures out, for every edge, where its path exits the
 * source node and enters the target node. Once per frame it runs the SDF
 * boundary search per edge and scatters `vec4(tStart, tEnd, straightenFactor,
 * pathLength)` into the shared edge-frame texture.
 *
 * It's the only place, for the whole edge rendering, that performs that
 * search. The edge body, edge labels and label backgrounds then read the
 * edge-frame texture by edge index (via `readFrameTexel`, reusing
 * `a_edgeIndex` since the texture is sized in lockstep with the edge-data
 * texture), and all agree on the geometry.
 *
 * `tStart`/`tEnd` are the ungated source/target boundary clamps: the body
 * program re-applies its extremity gating (running to the node center where an
 * extremity is absent), while labels use them as-is.
 *
 * @module
 */
import type { RenderParams } from "../../types";
import { ItemAttributeTexture, computeAttributeLayout } from "../data-texture";
import type { FrameTexture } from "../frame-texture";
import { setGLSLUniform } from "../program";
import { loadFragmentShader, loadProgram, loadVertexShader } from "../utils";
import { generateEdgeFramePassVertexShader } from "./generator";
import { EDGE_ATTRIBUTE_TEXTURE_UNIT } from "./path-attribute-texture";
import { EdgeExtremity, EdgeLayer, EdgePath, UniformSpecification } from "./types";

export interface EdgeFramePassOptions {
  paths: EdgePath[];
  extremities: EdgeExtremity[];
  layers: EdgeLayer[];
}

// language=GLSL
const FRAGMENT_SHADER = /*glsl*/ `#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`;

export class EdgeFramePass {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private vao: WebGLVertexArrayObject;
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  // Path/extremity custom uniforms set per run (sampler2D ones are skipped).
  private customUniforms: UniformSpecification[];
  private hasAttributeData: boolean;

  constructor(gl: WebGL2RenderingContext, options: EdgeFramePassOptions) {
    const { paths, extremities, layers } = options;
    this.gl = gl;
    this.hasAttributeData = computeAttributeLayout([...paths, ...layers]).floatsPerItem > 0;

    this.vertexShader = loadVertexShader(gl, generateEdgeFramePassVertexShader(paths, extremities, layers));
    this.fragmentShader = loadFragmentShader(gl, FRAGMENT_SHADER);
    this.program = loadProgram(gl, [this.vertexShader, this.fragmentShader]);

    // Dedupe custom uniforms by name (a path and an extremity may share one).
    const seen = new Set<string>();
    this.customUniforms = [];
    for (const source of [...paths, ...extremities]) {
      for (const u of source.uniforms) {
        if (seen.has(u.name)) continue;
        seen.add(u.name);
        this.customUniforms.push(u);
      }
    }

    const uniformNames = [
      "u_sizeRatio",
      "u_correctionRatio",
      "u_cameraAngle",
      "u_minEdgeThickness",
      "u_nodeDataTexture",
      "u_nodeDataTextureWidth",
      "u_edgeDataTexture",
      "u_edgeDataTextureWidth",
      "u_edgeAttributeTexture",
      "u_edgeAttributeTextureWidth",
      "u_edgeAttributeTexelsPerEdge",
      "u_frameTextureWidth",
      "u_frameTextureHeight",
      ...this.customUniforms.map((u) => u.name),
    ];
    for (const name of uniformNames) this.uniformLocations[name] = gl.getUniformLocation(this.program, name);

    // The draw reads no attributes (a_edgeIndex = gl_VertexID), but a clean VAO
    // keeps any previously-bound attribute state from interfering.
    this.vao = gl.createVertexArray()!;
  }

  /**
   * Runs the search for every edge-data row in `[0, edgeCount)` and writes the
   * clamp vec4 into `frameTexture`. The node-data and edge-data textures must
   * already be bound (sigma does this before the depth loop); the body's edge
   * attribute texture is bound here. Leaves the framebuffer/viewport for the
   * caller's post-offscreen reset.
   */
  run(
    params: RenderParams,
    frameTexture: FrameTexture,
    edgeCount: number,
    edgeAttributeTexture: ItemAttributeTexture | null,
  ): void {
    if (edgeCount === 0) return;

    const { gl } = this;
    const u = this.uniformLocations;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    if (u.u_sizeRatio) gl.uniform1f(u.u_sizeRatio, params.sizeRatio);
    if (u.u_correctionRatio) gl.uniform1f(u.u_correctionRatio, params.correctionRatio);
    if (u.u_cameraAngle) gl.uniform1f(u.u_cameraAngle, params.cameraAngle);
    if (u.u_minEdgeThickness) gl.uniform1f(u.u_minEdgeThickness, params.minEdgeThickness);
    if (u.u_nodeDataTexture) gl.uniform1i(u.u_nodeDataTexture, params.nodeDataTextureUnit);
    if (u.u_nodeDataTextureWidth) gl.uniform1i(u.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
    if (u.u_edgeDataTexture) gl.uniform1i(u.u_edgeDataTexture, params.edgeDataTextureUnit);
    if (u.u_edgeDataTextureWidth) gl.uniform1i(u.u_edgeDataTextureWidth, params.edgeDataTextureWidth);
    if (u.u_frameTextureWidth) gl.uniform1f(u.u_frameTextureWidth, frameTexture.getTextureWidth());
    if (u.u_frameTextureHeight) gl.uniform1f(u.u_frameTextureHeight, frameTexture.getTextureHeight());

    if (this.hasAttributeData && edgeAttributeTexture) {
      edgeAttributeTexture.bind(EDGE_ATTRIBUTE_TEXTURE_UNIT);
      if (u.u_edgeAttributeTexture) gl.uniform1i(u.u_edgeAttributeTexture, EDGE_ATTRIBUTE_TEXTURE_UNIT);
      if (u.u_edgeAttributeTextureWidth)
        gl.uniform1i(u.u_edgeAttributeTextureWidth, edgeAttributeTexture.getTextureWidth());
      if (u.u_edgeAttributeTexelsPerEdge)
        gl.uniform1i(u.u_edgeAttributeTexelsPerEdge, edgeAttributeTexture.getTexelsPerItem());
    }

    for (const uniform of this.customUniforms) setGLSLUniform(gl, this.uniformLocations[uniform.name], uniform);

    frameTexture.bindAsRenderTarget();
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.POINTS, 0, edgeCount);

    // Unbind the render target so the texture can be sampled; the caller's
    // post-offscreen reset restores the viewport for the depth loop.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);
  }

  kill(): void {
    const { gl } = this;
    gl.deleteProgram(this.program);
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    gl.deleteVertexArray(this.vao);
  }
}
