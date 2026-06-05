/**
 * Sigma.js Node Label Frame-Pass
 * ==============================
 *
 * The one place that figures out where each node label sits. Once per frame,
 * it measures, for every displayed label, how far the node's edge is in the
 * label's direction, and writes that into the shared node-frame texture.
 *
 * It's the only place, for the whole nodes rendering, that needs to perform
 * the SDF binary search. The labels, their backgrounds, backdrops and
 * attachments then simply read the node-frame texture (via `readFrameTexel`,
 * reusing `a_nodeIndex` since the texture is sized in lockstep with the
 * node-data texture), and all agree on placement.
 *
 * The stored value is `findEdgeDistance(dir, 1.0)`: unitless and zoom-independent
 * (the texture is R32F, so readers take `.r`). Consumers recover pixels locally
 * via `GLSL_NODE_SIZE_TO_PIXELS` + the margin uniform:
 *   labelStart = nodeRadiusPixels * edgeDist + margin
 *
 * @module
 */
import type { RenderParams } from "../../../types";
import type { FrameTexture } from "../../frame-texture";
import {
  GLSL_GET_LABEL_DIRECTION,
  GLSL_READ_NODE_DATA,
  GLSL_READ_NODE_FLAGS,
  generateFindEdgeDistanceForShapes,
} from "../../glsl";
import { setGLSLUniform } from "../../program";
import { dedupeShapeUniforms, getShapeGLSLForShapes } from "../../shapes";
import { loadFragmentShader, loadProgram, loadVertexShader } from "../../utils";
import { SDFShape, UniformSpecification } from "../types";

export interface NodeLabelFramePassOptions {
  shapes: SDFShape[];
  shapeGlobalIds?: number[];
}

// language=GLSL
const FRAGMENT_SHADER = /*glsl*/ `#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;

function generateVertexShader(shapes: SDFShape[], shapeGlobalIds?: number[]): string {
  const shapeGLSL = getShapeGLSLForShapes(shapes);

  const shapeUniformDeclarations = dedupeShapeUniforms(shapes)
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");

  // The shared boundary query — identical generator to the label/background/
  // attachment programs, so the distance written here is exactly what they used
  // to compute in-shader. Rotation is applied per node below, not baked in.
  const { code: findEdgeDistanceCode, multiShape } = generateFindEdgeDistanceForShapes(shapes, shapeGlobalIds);

  // language=GLSL
  const shader = /*glsl*/ `#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
${shapeUniformDeclarations}

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FLAGS}
${shapeGLSL}
${findEdgeDistanceCode}
${GLSL_GET_LABEL_DIRECTION}

void main() {
  int nodeIdx = int(a_nodeIndex);
  ${
    multiShape
      ? /*glsl*/ `// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`
      : "// Single-shape mode, shape id not needed"
  }

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`;

  return shader;
}

export class NodeLabelFramePass {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private vao: WebGLVertexArrayObject;
  private buffer: WebGLBuffer;
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private shapeUniforms: UniformSpecification[];

  /** Floats per point in the input buffer: nodeIndex, positionMode, labelAngle. */
  static readonly FLOATS_PER_POINT = 3;

  constructor(gl: WebGL2RenderingContext, options: NodeLabelFramePassOptions) {
    const { shapes, shapeGlobalIds } = options;
    if (shapes.length === 0) throw new Error("NodeLabelFramePass: at least one shape must be provided");

    this.gl = gl;
    this.shapeUniforms = dedupeShapeUniforms(shapes);

    this.vertexShader = loadVertexShader(gl, generateVertexShader(shapes, shapeGlobalIds));
    this.fragmentShader = loadFragmentShader(gl, FRAGMENT_SHADER);
    this.program = loadProgram(gl, [this.vertexShader, this.fragmentShader]);

    const uniformNames = [
      "u_cameraAngle",
      "u_nodeDataTexture",
      "u_nodeDataTextureWidth",
      "u_frameTextureWidth",
      "u_frameTextureHeight",
      ...this.shapeUniforms.map((u) => u.name),
    ];
    for (const name of uniformNames) this.uniformLocations[name] = gl.getUniformLocation(this.program, name);

    // One interleaved point buffer: [nodeIndex, positionMode, labelAngle] per label.
    const stride = NodeLabelFramePass.FLOATS_PER_POINT * 4;
    this.vao = gl.createVertexArray()!;
    this.buffer = gl.createBuffer()!;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    for (const [name, offset] of [
      ["a_nodeIndex", 0],
      ["a_positionMode", 4],
      ["a_labelAngle", 8],
    ] as const) {
      const loc = gl.getAttribLocation(this.program, name);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, stride, offset);
      }
    }
    gl.bindVertexArray(null);
  }

  /**
   * Writes the normalized edge distance into `frameTexture` for every label in
   * `pointData` (an interleaved `[nodeIndex, positionMode, labelAngle]` array
   * of `count` points). The per-node rotation alignment is read from the
   * node-data texture (already bound). Leaves the framebuffer/viewport for the
   * caller to restore (the post-offscreen reset).
   */
  run(pointData: Float32Array, count: number, frameTexture: FrameTexture, params: RenderParams): void {
    if (count === 0) return;

    const { gl } = this;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointData.subarray(0, count * NodeLabelFramePass.FLOATS_PER_POINT), gl.DYNAMIC_DRAW);

    const u = this.uniformLocations;
    gl.uniform1f(u.u_cameraAngle, params.cameraAngle);
    gl.uniform1i(u.u_nodeDataTexture, params.nodeDataTextureUnit);
    gl.uniform1i(u.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
    gl.uniform1f(u.u_frameTextureWidth, frameTexture.getTextureWidth());
    gl.uniform1f(u.u_frameTextureHeight, frameTexture.getTextureHeight());

    for (const uniform of this.shapeUniforms) setGLSLUniform(gl, this.uniformLocations[uniform.name], uniform);

    frameTexture.bindAsRenderTarget();
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.POINTS, 0, count);

    // Unbind the render target so the texture can be safely bound for sampling.
    // The caller's post-offscreen reset restores the viewport for the depth loop.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);
  }

  kill(): void {
    const { gl } = this;
    gl.deleteProgram(this.program);
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    gl.deleteBuffer(this.buffer);
    gl.deleteVertexArray(this.vao);
  }
}
