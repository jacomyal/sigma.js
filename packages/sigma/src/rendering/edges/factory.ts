/**
 * Sigma.js Edge Program Factory
 * ==============================
 *
 * Factory function that creates an EdgeProgram from paths, extremities, and layers.
 * The resulting program renders edges as composable components with single-pass WebGL.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../../sigma";
import { EdgeDisplayData, NodeDisplayData, RenderParams } from "../../types";
import { colorToArray, floatColor, rgbaToFloat } from "../../utils";
import {
  AttrDescriptor,
  AttributeLayout,
  ItemAttributeTexture,
  buildAttrDescriptors,
  computeAttributeLayout,
  packAttributes,
} from "../data-texture";
import { isAttributeSource } from "../nodes";
import { ProgramInfo, loadFragmentShader, loadTransformFeedbackProgram, loadVertexShader } from "../utils";
import { EdgeProgram as BaseEdgeProgram, EdgeProgramType, ResolvedEdgeIds } from "./base";
import { PREPASS_FLOATS_PER_EDGE, PREPASS_TF_VARYING_NAMES, generateEdgeShaders } from "./generator";
import {
  type EdgeLabelBackgroundProgramType,
  type EdgeLabelProgramType,
  createEdgeLabelBackgroundProgram,
  createEdgeLabelProgram,
  resolveEdgeLabelShaderConfig,
} from "./labels";
import { EDGE_ATTRIBUTE_TEXTURE_UNIT } from "./path-attribute-texture";
import {
  EdgeExtremity,
  EdgeLifecycleContext,
  EdgeLifecycleHooks,
  EdgeProgramOptions,
  GeneratedEdgeShaders,
  normalizeEdgeProgramOptions,
} from "./types";

/**
 * Internal "none" extremity - no decoration at edge endpoint.
 * This is always implicitly available in all edge programs.
 */
function extremityNone(): EdgeExtremity {
  // language=GLSL
  const glsl = /*glsl*/ `
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`;

  return {
    name: "none",
    glsl,
    length: 0,
    widthFactor: 1.0,
    margin: 0,
    uniforms: [],
    attributes: [],
  };
}

/**
 * Creates an edge program from paths, extremities, and layers.
 *
 * @param options - Configuration for the edge program
 * @returns An EdgeProgram class that can be used with Sigma
 *
 * @example
 * ```typescript
 * import { createEdgeProgram, pathLine, pathCurved, extremityArrow, layerPlain } from "sigma/rendering";
 *
 * // Simple line (no extremities needed - "none" is implicit)
 * const EdgeLineProgram = createEdgeProgram({
 *   paths: [pathLine()],
 *   layers: [layerPlain()],
 * });
 *
 * // Arrow at head
 * const EdgeArrowProgram = createEdgeProgram({
 *   paths: [pathLine()],
 *   extremities: [extremityArrow()],
 *   layers: [layerPlain()],
 *   defaultHead: "arrow",
 * });
 *
 * // Multi-path: edges select path/extremity via attributes
 * const MultiEdgeProgram = createEdgeProgram({
 *   paths: [pathLine(), pathCurved()],
 *   extremities: [extremityArrow()],
 *   layers: [layerPlain()],
 * });
 * // Edges select via: { path: "curved", head: "arrow", tail: "none" }
 * ```
 */
export function createEdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options: EdgeProgramOptions): EdgeProgramType<N, E, G> {
  const normalized = normalizeEdgeProgramOptions(options);
  const { paths, layers, defaultHead, defaultTail } = normalized;

  // Always prepend extremityNone() so "none" is always available at index 0
  const extremities = [extremityNone(), ...normalized.extremities];

  // Build name-to-index mappings
  const pathNameToIndex: Record<string, number> = {};
  const extremityNameToIndex: Record<string, number> = {};

  paths.forEach((p, i) => (pathNameToIndex[p.name] = i));
  extremities.forEach((e, i) => (extremityNameToIndex[e.name] = i));

  // Resolve default indices from names
  const defaultHeadIndex = extremityNameToIndex[defaultHead] ?? 0;
  const defaultTailIndex = extremityNameToIndex[defaultTail] ?? 0;

  // Shaders are generated lazily on first instantiation.
  // This ensures all node shapes are registered before edge shaders are compiled,
  // since generateShapeSelectorGLSL() reads from the shape registry.
  let generated: GeneratedEdgeShaders | null = null;

  // Compute attribute layout once for this program configuration (all layers)
  const attributeLayout: AttributeLayout = computeAttributeLayout([...paths, ...layers]);

  // Create the edge program class
  const EdgeProgramClass = class extends BaseEdgeProgram<string, N, E, G> {
    // Store options with the prepended extremities array (for sigma to look up length ratios)
    static readonly programOptions = { ...options, extremities };
    // Name-to-index mappings (for sigma to look up indices from names)
    static readonly pathNameToIndex = pathNameToIndex;
    static readonly extremityNameToIndex = extremityNameToIndex;
    // Default indices for head/tail when edge doesn't specify
    static readonly defaultHeadIndex = defaultHeadIndex;
    static readonly defaultTailIndex = defaultTailIndex;

    static get generatedShaders() {
      if (!generated) {
        generated = generateEdgeShaders({ paths, extremities, layers });
      }
      return generated;
    }

    // Lifecycle hooks storage for all layers
    private layerLifecycles: Map<number, EdgeLifecycleHooks> = new Map();
    private needsShaderRegeneration = false;
    private _pickingBuffer: WebGLFramebuffer | null;

    // Edge path attribute texture for storing path/layer attributes
    private edgeAttributeTexture: ItemAttributeTexture | null = null;
    private packedAttributeData: Float32Array;
    private readonly layout: AttributeLayout = attributeLayout;

    // Pre-computed attribute descriptors for fast processVisibleItem
    private attrDescriptors: AttrDescriptor[] = [];
    // Offset to subtract from descriptor sourceIndex to get layerLifecycles key
    private readonly lifecycleIndexOffset = paths.length;

    // Pre-pass state (see runPrePass below for what this is for).
    private prePassProgram: WebGLProgram | null = null;
    private prePassOutputBuffer: WebGLBuffer | null = null;
    private prePassTF: WebGLTransformFeedback | null = null;
    private prePassVAO: WebGLVertexArrayObject | null = null;
    private prePassUniformLocations: Record<string, WebGLUniformLocation> = {};
    private prePassInputAttrLoc = -1;
    private prePassLastFrameId = -1;

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      // Generate shaders on first instantiation (after node shapes are registered)
      if (!generated) {
        generated = generateEdgeShaders({ paths, extremities, layers });
      }

      super(gl, pickingBuffer, renderer);
      this._pickingBuffer = pickingBuffer;

      // Create edge attribute texture for path/layer attributes
      this.edgeAttributeTexture = new ItemAttributeTexture(gl, this.layout);
      this.packedAttributeData = new Float32Array(this.layout.floatsPerItem);

      // Initialize layer lifecycles for all layers
      layers.forEach((layer, index) => {
        if (layer.lifecycle) {
          const context: EdgeLifecycleContext = {
            gl,
            renderer: { refresh: () => renderer.refresh() },
            getUniformLocation: (name: string) => {
              return gl.getUniformLocation(this.normalProgram.program, name);
            },
            requestShaderRegeneration: () => {
              this.needsShaderRegeneration = true;
            },
            requestRefresh: () => {
              renderer.refresh();
            },
          };
          this.layerLifecycles.set(index, layer.lifecycle(context));
        }
      });

      // Call init hook for all layers
      this.layerLifecycles.forEach((hooks) => hooks.init?.());

      // Build pre-computed attribute descriptors.
      // Sources are [...paths, ...layers]. Lifecycle hooks are keyed by
      // layer index (0-based within layers), so we shift by paths.length.
      const lifecycleMapForDescriptors = new Map<
        number,
        { getAttributeData?: (data: Record<string, unknown>, sourceName: string) => unknown }
      >();
      this.layerLifecycles.forEach((hooks, layerIndex) => {
        if (hooks.getAttributeData) {
          lifecycleMapForDescriptors.set(
            paths.length + layerIndex,
            hooks as { getAttributeData: (data: Record<string, unknown>, sourceName: string) => unknown },
          );
        }
      });
      this.attrDescriptors = buildAttrDescriptors([...paths, ...layers], this.layout, lifecycleMapForDescriptors);

      this.setupPrePass();
    }

    resolveEdgeIds(data: EdgeDisplayData, isSelfLoop: boolean, isParallel: boolean): ResolvedEdgeIds {
      const edgeData = data as unknown as {
        path?: string;
        selfLoopPath?: string;
        parallelPath?: string;
        head?: string;
        tail?: string;
      };

      let pathId = 0;
      let headId = defaultHeadIndex;
      let tailId = defaultTailIndex;

      const pathName = isSelfLoop
        ? edgeData.selfLoopPath
        : isParallel && edgeData.parallelPath
          ? edgeData.parallelPath
          : edgeData.path;
      if (pathName && pathNameToIndex[pathName] !== undefined) {
        pathId = pathNameToIndex[pathName];
      }

      if (edgeData.head && edgeData.head !== "none" && extremityNameToIndex[edgeData.head] !== undefined) {
        headId = extremityNameToIndex[edgeData.head];
      }
      if (edgeData.tail && edgeData.tail !== "none" && extremityNameToIndex[edgeData.tail] !== undefined) {
        tailId = extremityNameToIndex[edgeData.tail];
      }

      const headExt = extremities[headId];
      const tailExt = extremities[tailId];
      return {
        pathId,
        headId,
        tailId,
        headLengthRatio: !isAttributeSource(headExt.length) ? headExt.length : 0,
        tailLengthRatio: !isAttributeSource(tailExt.length) ? tailExt.length : 0,
      };
    }

    private setupPrePass(): void {
      const gl = this.normalProgram.gl;

      if (!this.prePassTF) this.prePassTF = gl.createTransformFeedback();
      if (!this.prePassOutputBuffer) this.prePassOutputBuffer = gl.createBuffer();
      if (!this.prePassVAO) this.prePassVAO = gl.createVertexArray();

      if (this.prePassProgram) gl.deleteProgram(this.prePassProgram);
      const vs = loadVertexShader(gl, generated!.prePassVertexShader);
      const fs = loadFragmentShader(gl, `#version 300 es\nprecision highp float;\nout vec4 c;\nvoid main(){discard;}`);
      this.prePassProgram = loadTransformFeedbackProgram(gl, vs, fs, PREPASS_TF_VARYING_NAMES);
      gl.deleteShader(vs);
      gl.deleteShader(fs);

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
      ];
      [...paths, ...extremities].forEach((source) => source.uniforms.forEach((u) => uniformNames.push(u.name)));

      this.prePassUniformLocations = {};
      for (const name of new Set(uniformNames)) {
        const loc = gl.getUniformLocation(this.prePassProgram, name);
        if (loc) this.prePassUniformLocations[name] = loc;
      }

      this.prePassInputAttrLoc = gl.getAttribLocation(this.prePassProgram, "a_edgeIndex");

      for (const programInfo of [this.normalProgram, this.pickProgram]) {
        if (!programInfo) continue;
        programInfo.attributeLocations["pre_clamp"] = programInfo.gl.getAttribLocation(
          programInfo.program,
          "pre_clamp",
        );
      }
    }

    /**
     * Pre-pass: a GPU draw run once per edge before the visual draw, to
     * pre-compute one vec4 ("pre_clamp") per edge. Without it, every vertex
     * of the edge triangle strip would redundantly recompute the same
     * per-edge value.
     *
     * The trick: this is a vertex-shader-only draw whose output is captured
     * into a buffer (transform feedback) instead of pixels (rasterizer
     * discarded). The buffer is then bound as a per-instance attribute on
     * the main shader (see bindProgram), so each edge's vertices just read
     * their own precomputed value.
     */
    private runPrePass(params: RenderParams): void {
      if (!this.prePassProgram || !this.prePassOutputBuffer || !this.prePassTF || this.capacity === 0) return;

      const gl = this.normalProgram.gl;
      const locs = this.prePassUniformLocations;

      gl.useProgram(this.prePassProgram);

      if (locs.u_sizeRatio) gl.uniform1f(locs.u_sizeRatio, params.sizeRatio);
      if (locs.u_correctionRatio) gl.uniform1f(locs.u_correctionRatio, params.correctionRatio);
      if (locs.u_cameraAngle) gl.uniform1f(locs.u_cameraAngle, params.cameraAngle);
      if (locs.u_minEdgeThickness) gl.uniform1f(locs.u_minEdgeThickness, params.minEdgeThickness);
      if (locs.u_nodeDataTexture) gl.uniform1i(locs.u_nodeDataTexture, params.nodeDataTextureUnit);
      if (locs.u_nodeDataTextureWidth) gl.uniform1i(locs.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      if (locs.u_edgeDataTexture) gl.uniform1i(locs.u_edgeDataTexture, params.edgeDataTextureUnit);
      if (locs.u_edgeDataTextureWidth) gl.uniform1i(locs.u_edgeDataTextureWidth, params.edgeDataTextureWidth);

      if (this.edgeAttributeTexture && this.layout.floatsPerItem > 0) {
        this.edgeAttributeTexture.bind(EDGE_ATTRIBUTE_TEXTURE_UNIT);
        if (locs.u_edgeAttributeTexture) gl.uniform1i(locs.u_edgeAttributeTexture, EDGE_ATTRIBUTE_TEXTURE_UNIT);
        if (locs.u_edgeAttributeTextureWidth)
          gl.uniform1i(locs.u_edgeAttributeTextureWidth, this.edgeAttributeTexture.getTextureWidth());
        if (locs.u_edgeAttributeTexelsPerEdge)
          gl.uniform1i(locs.u_edgeAttributeTexelsPerEdge, this.edgeAttributeTexture.getTexelsPerItem());
      }

      const processedUniforms = new Set<string>();
      for (const source of [...paths, ...extremities]) {
        for (const uniform of source.uniforms) {
          if (processedUniforms.has(uniform.name) || uniform.type === "sampler2D") continue;
          processedUniforms.add(uniform.name);
          const loc = locs[uniform.name];
          if (!loc) continue;
          switch (uniform.type) {
            case "float":
              gl.uniform1f(loc, uniform.value);
              break;
            case "int":
            case "bool":
              gl.uniform1i(loc, uniform.value);
              break;
            case "vec2":
              gl.uniform2fv(loc, uniform.value);
              break;
            case "vec3":
              gl.uniform3fv(loc, uniform.value);
              break;
            case "vec4":
              gl.uniform4fv(loc, uniform.value);
              break;
            case "mat3":
              gl.uniformMatrix3fv(loc, false, uniform.value);
              break;
            case "mat4":
              gl.uniformMatrix4fv(loc, false, uniform.value);
              break;
          }
        }
      }

      // A VAO bundles "which buffer feeds which shader input". A dedicated
      // one keeps the pre-pass's attribute setup from clobbering the main
      // draw's.
      gl.bindVertexArray(this.prePassVAO);
      if (this.prePassInputAttrLoc >= 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalProgram.buffer);
        gl.enableVertexAttribArray(this.prePassInputAttrLoc);
        gl.vertexAttribPointer(this.prePassInputAttrLoc, 1, gl.FLOAT, false, this.ATTRIBUTES_ITEMS_COUNT * 4, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }

      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.prePassTF);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.prePassOutputBuffer);
      gl.enable(gl.RASTERIZER_DISCARD);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, this.capacity);
      gl.endTransformFeedback();
      gl.disable(gl.RASTERIZER_DISCARD);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

      gl.bindVertexArray(null);
    }

    getDefinition() {
      const { TRIANGLE_STRIP } = WebGL2RenderingContext;

      // All edges use TRIANGLE_STRIP with zone-based geometry
      const method = TRIANGLE_STRIP;

      // generated is guaranteed to be set by constructor before getDefinition is called
      const shaders = generated!;

      return {
        VERTICES: shaders.verticesPerEdge,
        VERTEX_SHADER_SOURCE: shaders.vertexShader,
        FRAGMENT_SHADER_SOURCE: shaders.fragmentShader,
        METHOD: method,
        UNIFORMS: shaders.uniforms,
        ATTRIBUTES: shaders.attributes,
        CONSTANT_ATTRIBUTES: shaders.constantAttributes,
        CONSTANT_DATA: shaders.constantData,
      };
    }

    /**
     * Regenerate shaders if any layer requested it.
     */
    private maybeRegenerateShaders(): void {
      if (!this.needsShaderRegeneration) return;

      this.needsShaderRegeneration = false;

      // Regenerate layers that have regenerate hooks
      const newLayers = layers.map((layer, index) => {
        const hooks = this.layerLifecycles.get(index);
        if (hooks?.regenerate) {
          return hooks.regenerate();
        }
        return layer;
      });

      // Regenerate shaders with potentially updated layers
      generated = generateEdgeShaders({ paths, extremities, layers: newLayers });

      // Rebuild WebGL program
      const gl = this.normalProgram.gl;
      const { program, buffer, vertexShader, fragmentShader } = this.normalProgram;

      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      // Recreate program
      this.normalProgram = this.getProgramInfo(
        "normal",
        gl,
        generated.vertexShader,
        generated.fragmentShader,
        this._pickingBuffer,
      );

      this.setupPrePass();
    }

    processVisibleItem(
      edgeIndex: number,
      startIndex: number,
      _sourceData: NodeDisplayData,
      _targetData: NodeDisplayData,
      data: EdgeDisplayData,
      edgeTextureIndex: number,
    ) {
      const { floats, ints } = this;

      // Core vertex buffer writes
      floats[startIndex++] = edgeTextureIndex;
      const opacity = data.opacity ?? 1;
      if (opacity < 1) {
        const [r, g, b, a] = colorToArray(data.color);
        floats[startIndex++] = rgbaToFloat(r, g, b, (a * opacity) | 0, true);
      } else {
        floats[startIndex++] = floatColor(data.color);
      }
      // a_id is a packed picking ID, it should be stored as an int
      ints[startIndex++] = edgeIndex;

      // Pack attributes into texture via pre-computed descriptors
      const packed = this.packedAttributeData;
      packAttributes(
        this.attrDescriptors,
        data as unknown as Record<string, unknown>,
        packed,
        data.color,
        opacity,
        this.layerLifecycles,
        this.lifecycleIndexOffset,
      );

      // Use numeric key directly — avoids string allocation per edge
      this.edgeAttributeTexture!.updateAllAttributes(edgeTextureIndex, packed);
    }

    setUniforms(params: RenderParams, programInfo: ProgramInfo): void {
      const { gl, uniformLocations } = programInfo;

      // Standard uniforms
      if (uniformLocations.u_matrix) {
        gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      }
      if (uniformLocations.u_sizeRatio) {
        gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      }
      if (uniformLocations.u_correctionRatio) {
        gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      }
      if (uniformLocations.u_zoomRatio) {
        gl.uniform1f(uniformLocations.u_zoomRatio, params.zoomRatio);
      }
      if (uniformLocations.u_pixelRatio) {
        gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      }
      if (uniformLocations.u_cameraAngle) {
        gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      }
      if (uniformLocations.u_feather) {
        gl.uniform1f(uniformLocations.u_feather, params.antiAliasingFeather);
      }
      if (uniformLocations.u_minEdgeThickness) {
        gl.uniform1f(uniformLocations.u_minEdgeThickness, params.minEdgeThickness);
      }
      if (uniformLocations.u_pickingPadding) {
        gl.uniform1f(uniformLocations.u_pickingPadding, params.edgePickingPadding);
      }
      if (uniformLocations.u_nodeDataTexture) {
        gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      }
      if (uniformLocations.u_nodeDataTextureWidth) {
        gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      }
      if (uniformLocations.u_edgeDataTexture) {
        gl.uniform1i(uniformLocations.u_edgeDataTexture, params.edgeDataTextureUnit);
      }
      if (uniformLocations.u_edgeDataTextureWidth) {
        gl.uniform1i(uniformLocations.u_edgeDataTextureWidth, params.edgeDataTextureWidth);
      }

      // Edge path attribute texture
      if (this.edgeAttributeTexture && this.layout.floatsPerItem > 0) {
        this.edgeAttributeTexture.bind(EDGE_ATTRIBUTE_TEXTURE_UNIT);

        if (uniformLocations.u_edgeAttributeTexture) {
          gl.uniform1i(uniformLocations.u_edgeAttributeTexture, EDGE_ATTRIBUTE_TEXTURE_UNIT);
        }
        if (uniformLocations.u_edgeAttributeTextureWidth) {
          gl.uniform1i(uniformLocations.u_edgeAttributeTextureWidth, this.edgeAttributeTexture.getTextureWidth());
        }
        if (uniformLocations.u_edgeAttributeTexelsPerEdge) {
          gl.uniform1i(uniformLocations.u_edgeAttributeTexelsPerEdge, this.edgeAttributeTexture.getTexelsPerItem());
        }
      }

      // Track which uniforms we've already set to avoid duplicates
      const processedUniforms = new Set<string>();

      // Path-specific uniforms
      paths.forEach((p) => {
        p.uniforms.forEach((uniform) => {
          if (processedUniforms.has(uniform.name)) return;
          processedUniforms.add(uniform.name);
          this.setTypedUniform(uniform, programInfo);
        });
      });

      // Extremity uniforms
      extremities.forEach((ext) => {
        ext.uniforms.forEach((uniform) => {
          if (processedUniforms.has(uniform.name)) return;
          processedUniforms.add(uniform.name);
          this.setTypedUniform(uniform, programInfo);
        });
      });

      // Layer uniforms (from all layers)
      layers.forEach((layer) => {
        layer.uniforms.forEach((uniform) => {
          if (processedUniforms.has(uniform.name)) return;
          processedUniforms.add(uniform.name);
          this.setTypedUniform(uniform, programInfo);
        });
      });
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
      this.maybeRegenerateShaders();
      this.layerLifecycles.forEach((hooks) => hooks.beforeRender?.());

      if (!programInfo.isPicking && this.prePassLastFrameId !== params.frameId) {
        this.runPrePass(params);
        this.prePassLastFrameId = params.frameId;
      }

      super.renderProgram(params, programInfo);
    }

    reallocate(capacity: number): void {
      super.reallocate(capacity);

      if (this.prePassOutputBuffer && capacity > 0) {
        const gl = this.normalProgram.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.prePassOutputBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, capacity * PREPASS_FLOATS_PER_EDGE * 4, gl.DYNAMIC_COPY);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    }

    protected bindProgram(programInfo: ProgramInfo): void {
      super.bindProgram(programInfo);

      if (this.prePassOutputBuffer) {
        const gl = programInfo.gl;
        const stride = PREPASS_FLOATS_PER_EDGE * Float32Array.BYTES_PER_ELEMENT;
        const baseOffset = this.renderOffset * stride;
        const location = programInfo.attributeLocations["pre_clamp"];
        if (location !== undefined && location >= 0) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.prePassOutputBuffer);
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, 4, gl.FLOAT, false, stride, baseOffset);
          gl.vertexAttribDivisor(location, 1);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
      }
    }

    protected unbindProgram(programInfo: ProgramInfo): void {
      super.unbindProgram(programInfo);

      const location = programInfo.attributeLocations["pre_clamp"];
      if (location !== undefined && location >= 0) {
        const gl = programInfo.gl;
        gl.disableVertexAttribArray(location);
        gl.vertexAttribDivisor(location, 0);
      }
    }

    /**
     * Uploads the edge path attribute texture to the GPU.
     * Called by sigma before rendering to ensure texture data is current.
     */
    uploadAttributeTexture(): void {
      if (this.edgeAttributeTexture && this.layout.floatsPerItem > 0) {
        this.edgeAttributeTexture.upload();
      }
    }

    kill(): void {
      // Call kill hook for all layers
      this.layerLifecycles.forEach((hooks) => hooks.kill?.());

      // Clean up attribute texture
      if (this.edgeAttributeTexture) {
        this.edgeAttributeTexture.kill();
        this.edgeAttributeTexture = null;
      }

      const gl = this.normalProgram.gl;
      if (this.prePassProgram) gl.deleteProgram(this.prePassProgram);
      if (this.prePassOutputBuffer) gl.deleteBuffer(this.prePassOutputBuffer);
      if (this.prePassTF) gl.deleteTransformFeedback(this.prePassTF);
      if (this.prePassVAO) gl.deleteVertexArray(this.prePassVAO);

      super.kill();
    }
  };

  // Collect the flat options used by both the label factory and the shader
  // config. Single object keeps the two factory calls in lockstep.
  const defaultHeadExtremity = extremities[defaultHeadIndex];
  const defaultTailExtremity = extremities[defaultTailIndex];
  const labelFactoryOptions = {
    paths,
    headLengthRatio: !isAttributeSource(defaultHeadExtremity.length) ? defaultHeadExtremity.length : 0,
    tailLengthRatio: !isAttributeSource(defaultTailExtremity.length) ? defaultTailExtremity.length : 0,
    ...options.label,
  };
  const labelShaderConfig = resolveEdgeLabelShaderConfig(labelFactoryOptions);

  // Create and attach the label program (SDF text along the edge path).
  const LabelProgramClass = createEdgeLabelProgram(labelFactoryOptions);
  (EdgeProgramClass as unknown as { LabelProgram: EdgeLabelProgramType }).LabelProgram = LabelProgramClass;

  // Create and attach the label background program (ribbon behind the text).
  // Both programs consume the same resolved shader config, so the ribbon
  // cannot drift from the text it pairs with.
  const LabelBackgroundProgramClass = createEdgeLabelBackgroundProgram({ shaderConfig: labelShaderConfig });
  (EdgeProgramClass as unknown as { LabelBackgroundProgram: EdgeLabelBackgroundProgramType }).LabelBackgroundProgram =
    LabelBackgroundProgramClass;

  return EdgeProgramClass as unknown as EdgeProgramType<N, E, G>;
}
