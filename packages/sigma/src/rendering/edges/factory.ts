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
import { colorToArray, floatColor, indexToColor, rgbaToFloat } from "../../utils";
import {
  AttrDescriptor,
  AttributeLayout,
  HIDDEN_ITEM_INDEX,
  ItemAttributeTexture,
  buildAttrDescriptors,
  computeAttributeLayout,
  packAttributes,
} from "../data-texture";
import { isAttributeSource } from "../nodes";
import { Program } from "../program";
import { ProgramInfo } from "../utils";
import { EdgeFramePass } from "./frame-pass";
import { generateEdgeShaders } from "./generator";
import {
  type EdgeLabelBackgroundProgram,
  type EdgeLabelProgram,
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
 * Builds an edge program suite from paths, extremities, and layers. The
 * suite is a flat bundle of instances: the edge program plus the matching
 * label and label-background (ribbon) programs.
 *
 * @returns A bundle `{ edgeProgram, labelProgram, labelBackgroundProgram }`
 */
export interface ResolvedEdgeIds {
  pathId: number;
  headId: number;
  tailId: number;
  headLengthRatio: number;
  tailLengthRatio: number;
}

export function createEdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  options: EdgeProgramOptions,
): EdgeProgramBundle<N, E, G> {
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

  // Build the edge program instance
  const EdgeProgramClass = class extends Program<string, N, E, G> {
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
    }

    /** The path-attribute texture the edge frame-pass reads (curvature, etc.). */
    getAttributeTexture(): ItemAttributeTexture | null {
      return this.edgeAttributeTexture;
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
    }

    process(
      edgeIndex: number,
      offset: number,
      sourceData: NodeDisplayData,
      targetData: NodeDisplayData,
      data: EdgeDisplayData,
      edgeTextureIndex: number,
    ): void {
      let i = offset * this.STRIDE;
      // Hidden source/target/edge zero out the slot so the GPU draws nothing,
      // then a_edgeIndex is flagged as HIDDEN_ITEM_INDEX: zero is a *valid*
      // texture row, so leaving it at 0 would make the shader render this
      // instance as a copy of edge 0 (and overwrite its picking ID).
      if (data.visibility === "hidden" || sourceData.visibility === "hidden" || targetData.visibility === "hidden") {
        for (let l = i + this.STRIDE; i < l; i++) {
          this.floats[i] = 0;
        }
        this.floats[offset * this.STRIDE] = HIDDEN_ITEM_INDEX;
        return;
      }
      this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data, edgeTextureIndex);
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

      // The shader reads this texture by edgeIdx, so rows must match
      // EdgeDataTexture rows, while a keyed allocator drifts on hidden edges.
      this.edgeAttributeTexture!.updateAllAttributesAtRow(edgeTextureIndex, packed);
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
      // Edge-frame texture: the per-edge clamp written by the frame-pass (bound by sigma.ts)
      if (uniformLocations.u_edgeFrameTexture) {
        gl.uniform1i(uniformLocations.u_edgeFrameTexture, params.edgeFrameTextureUnit);
      }
      if (uniformLocations.u_edgeFrameTextureWidth) {
        gl.uniform1i(uniformLocations.u_edgeFrameTextureWidth, params.edgeFrameTextureWidth);
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

      super.renderProgram(params, programInfo);
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

  // SDF text along the edge path, and the ribbon behind it. Both programs
  // consume the same resolved shader config, so the ribbon cannot drift
  // from the text it pairs with. The label background gets the picking
  // framebuffer so label events can be wired onto the ribbon.
  const labelProgram = createEdgeLabelProgram(gl, null, renderer, labelFactoryOptions);
  const labelBackgroundProgram = createEdgeLabelBackgroundProgram(gl, pickingBuffer, renderer, {
    shaderConfig: labelShaderConfig,
  });

  // The shape-aware pass that computes every edge's source/target clamp once
  // per frame into the edge-frame texture, which the body, label and background
  // all read by edge index. Built from the same paths/extremities/layers, so
  // its clamp matches what the body draws.
  const framePass = new EdgeFramePass(gl, { paths, extremities, layers });

  return {
    edgeProgram: new EdgeProgramClass(gl, null, renderer),
    labelProgram,
    labelBackgroundProgram,
    framePass,
  };
}

export interface EdgeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Program<string, N, E, G> {
  resolveEdgeIds(data: EdgeDisplayData, isSelfLoop: boolean, isParallel: boolean): ResolvedEdgeIds;
  process(
    edgeIndex: number,
    offset: number,
    sourceData: NodeDisplayData,
    targetData: NodeDisplayData,
    data: EdgeDisplayData,
    edgeTextureIndex: number,
  ): void;
  uploadAttributeTexture(): void;
  /** The path-attribute texture the edge frame-pass reads (curvature, etc.). */
  getAttributeTexture(): ItemAttributeTexture | null;
}

export interface EdgeProgramBundle<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  edgeProgram: EdgeProgram<N, E, G>;
  labelProgram: EdgeLabelProgram<N, E, G>;
  labelBackgroundProgram: EdgeLabelBackgroundProgram<N, E, G>;
  framePass: EdgeFramePass;
}
