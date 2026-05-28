/**
 * Sigma.js Node Program Factory
 * ==============================
 *
 * Factory function that builds a node program suite (the node program plus
 * shape-aware label, backdrop, and label-background programs) from SDF
 * shapes and fragment layers.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../../sigma";
import { NodeDisplayData, RenderParams } from "../../types";
import { indexToColor } from "../../utils";
import {
  AttrDescriptor,
  ItemAttributeTexture,
  buildAttrDescriptors,
  computeAttributeLayout,
  packAttributes,
} from "../data-texture";
import { Program } from "../program";
import { getShapeId, registerShapeInstance } from "../shapes";
import { ProgramInfo } from "../utils";
import { createBackdropProgram } from "./backdrops";
import { generateShaders } from "./generator";
import { createLabelBackgroundProgram, createLabelProgram } from "./labels";
import { FragmentLayer, LayerLifecycleContext, LayerLifecycleHooks, NodeProgramOptions } from "./types";

// Texture unit for layer attribute texture (units 0-4 used by sigma, unit 5 for layer attributes)
const LAYER_ATTRIBUTE_TEXTURE_UNIT = 5;

/**
 * Creates a node program suite from SDF shape(s) and fragment layers. The
 * suite is a flat bundle: the node program class plus the matching label,
 * backdrop, and label-background program classes, alongside the shape
 * registry metadata sigma needs for multi-shape programs.
 *
 * Supports two modes:
 * - Single shape: Use `shape` for a program that renders one shape type
 * - Multi-shape: Use `shapes` for a program that can render different shapes per node
 *
 * @param options - Configuration for the node program
 * @returns A bundle `{ program, labelProgram, backdropProgram, labelBackgroundProgram, shapeSlug, shapeNameToIndex, shapeGlobalIds }`
 *
 * @example
 * ```typescript
 * // Single shape (backward compatible)
 * import { createNodeProgram, sdfCircle, layerFill } from "sigma/rendering";
 *
 * const { program: CircleProgram } = createNodeProgram({
 *   shape: sdfCircle(),
 *   layers: [layerFill()],
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Multi-shape program
 * const { program: MultiShapeProgram } = createNodeProgram({
 *   shapes: [sdfCircle(), sdfSquare(), sdfTriangle(), sdfDiamond()],
 *   layers: [layerFill(), layerBorder({ ... })],
 * });
 *
 * // Nodes select their shape via the 'shape' attribute
 * graph.setNodeAttribute(node, 'shape', 'square');
 * ```
 */
export function createNodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options: NodeProgramOptions) {
  const { rotateWithCamera = false, label: labelOptions = {}, shapes } = options;

  if (shapes.length === 0) {
    throw new Error("createNodeProgram: at least one shape must be provided in 'shapes'");
  }

  // Register all shapes in the global registry and build name-to-index mapping.
  // The first shape's slug is used for edge clamping (edges use this to find the shape boundary).
  const shapeNameToIndex: Record<string, number> = {};
  const shapeGlobalIds: number[] = []; // Maps local index to global shape ID
  let primaryShapeSlug: string | undefined;

  shapes.forEach((shape, index) => {
    const slug = registerShapeInstance(shape, rotateWithCamera);
    if (index === 0) primaryShapeSlug = slug;
    // Map shape name to local index for GPU-side shape selection
    shapeNameToIndex[shape.name] = index;
    // Store global shape ID for this local index (used by edge clamping)
    shapeGlobalIds[index] = getShapeId(slug);
  });

  // Mutable layers array - can be regenerated
  let layers = [...options.layers];

  // Generate shaders and collect metadata
  // Pass shapeGlobalIds for multi-shape programs to generate global→local conversion in shader
  let generated = generateShaders({
    shapes,
    layers,
    rotateWithCamera,
    shapeGlobalIds: shapes.length > 1 ? shapeGlobalIds : undefined,
  });

  // Create the label program class with all shapes (for multi-shape support)
  const LabelProgramClass = createLabelProgram({
    shapes,
    rotateWithCamera,
    label: labelOptions,
  });

  // Create the backdrop program class with all shapes (for multi-shape support)
  const BackdropProgramClass = createBackdropProgram({
    shapes,
    rotateWithCamera,
    label: labelOptions,
    shapeGlobalIds: shapes.length > 1 ? shapeGlobalIds : undefined,
  });

  // Create the label background program class (for label picking and optional visual background)
  const LabelBackgroundProgramClass = createLabelBackgroundProgram({
    shapes,
    rotateWithCamera,
    label: labelOptions,
    shapeGlobalIds: shapes.length > 1 ? shapeGlobalIds : undefined,
  });

  // Compute layout once for all instances
  const layerAttributeLayout = computeAttributeLayout(layers);

  // Create the node program class
  const NodeProgramClass = class extends Program<string, N, E, G> {
    // Static shared texture per GL context
    private static layerTextures = new WeakMap<WebGL2RenderingContext, ItemAttributeTexture>();
    private static textureRefCounts = new WeakMap<WebGL2RenderingContext, number>();

    // Lifecycle hooks storage (keyed by layer index for uniqueness)
    private layerLifecycles: Map<number, LayerLifecycleHooks> = new Map();
    private layersNeedingRegeneration: Set<number> = new Set();
    private readonly _pickingBuffer: WebGLFramebuffer | null;

    // Layer attribute texture management (instance references the shared static texture)
    private layerAttributeTexture: ItemAttributeTexture;
    private readonly packedAttributeData: Float32Array;

    // Pre-computed attribute descriptors for fast processVisibleItem
    private attrDescriptors: AttrDescriptor[] = [];

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      super(gl, pickingBuffer, renderer);
      this._pickingBuffer = pickingBuffer;

      // Get or create shared texture for this GL context
      let texture = NodeProgramClass.layerTextures.get(gl);
      if (!texture) {
        texture = new ItemAttributeTexture(gl, layerAttributeLayout);
        NodeProgramClass.layerTextures.set(gl, texture);
      }
      this.layerAttributeTexture = texture;

      // Increment reference count
      const refCount = NodeProgramClass.textureRefCounts.get(gl) || 0;
      NodeProgramClass.textureRefCounts.set(gl, refCount + 1);

      this.packedAttributeData = new Float32Array(layerAttributeLayout.floatsPerItem);

      // Initialize lifecycle hooks for each layer that has them
      layers.forEach((layer, index) => {
        if (layer.lifecycle) {
          const context: LayerLifecycleContext = {
            gl,
            renderer: { refresh: () => renderer.refresh() },
            getUniformLocation: (name: string) => {
              return gl.getUniformLocation(this.normalProgram.program, name);
            },
            requestShaderRegeneration: () => {
              this.layersNeedingRegeneration.add(index);
            },
            requestRefresh: () => {
              renderer.refresh();
            },
          };
          const hooks = layer.lifecycle(context);
          this.layerLifecycles.set(index, hooks);
        }
      });

      // Call init hooks after everything is set up
      this.layerLifecycles.forEach((hooks) => {
        hooks.init?.();
      });

      // Build pre-computed attribute descriptors.
      // For nodes, sources are just layers (no paths).
      const lifecycleMapForDescriptors = new Map<
        number,
        { getAttributeData?: (data: Record<string, unknown>, sourceName: string) => unknown }
      >();
      this.layerLifecycles.forEach((hooks, layerIndex) => {
        if (hooks.getAttributeData) {
          lifecycleMapForDescriptors.set(
            layerIndex,
            hooks as { getAttributeData: (data: Record<string, unknown>, sourceName: string) => unknown },
          );
        }
      });
      this.attrDescriptors = buildAttrDescriptors(layers, layerAttributeLayout, lifecycleMapForDescriptors);
    }

    getDefinition() {
      const { FLOAT, TRIANGLE_STRIP } = WebGL2RenderingContext;

      return {
        // Instanced rendering: 4 vertices for quad, one instance per node
        VERTICES: 4,
        VERTEX_SHADER_SOURCE: generated.vertexShader,
        FRAGMENT_SHADER_SOURCE: generated.fragmentShader,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: generated.uniforms,
        ATTRIBUTES: generated.attributes,
        // Constant attributes define the quad corners
        CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: FLOAT }],
        CONSTANT_DATA: [
          [-1, -1], // Bottom-left
          [1, -1], // Bottom-right
          [-1, 1], // Top-left
          [1, 1], // Top-right
        ],
      };
    }

    /**
     * Regenerate shaders if any layers requested it.
     * This handles dynamic changes like texture count updates.
     */
    private maybeRegenerateShaders(): void {
      if (this.layersNeedingRegeneration.size === 0) return;

      // Regenerate layers that requested it
      layers = layers.map((layer, index): FragmentLayer => {
        if (this.layersNeedingRegeneration.has(index)) {
          const hooks = this.layerLifecycles.get(index);
          if (hooks?.regenerate) {
            const newLayer = hooks.regenerate();
            // Preserve the lifecycle from the original layer
            return { ...newLayer, lifecycle: layer.lifecycle };
          }
        }
        return layer;
      });

      this.layersNeedingRegeneration.clear();

      // Regenerate shaders with updated layers
      generated = generateShaders({
        shapes,
        layers,
        rotateWithCamera,
        shapeGlobalIds: shapes.length > 1 ? shapeGlobalIds : undefined,
      });

      // Rebuild WebGL program
      const gl = this.normalProgram.gl;
      const { program, buffer, vertexShader, fragmentShader } = this.normalProgram;

      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      // Recreate program with new shaders
      this.normalProgram = this.getProgramInfo(
        "normal",
        gl,
        generated.vertexShader,
        generated.fragmentShader,
        this._pickingBuffer,
      );
    }

    /**
     * Allocates a node in the layer attribute texture.
     */
    allocateNode(nodeKey: string): void {
      this.layerAttributeTexture.allocate(nodeKey);
    }

    /**
     * Frees a node from the layer attribute texture.
     */
    freeNode(nodeKey: string): void {
      this.layerAttributeTexture.free(nodeKey);
    }

    /**
     * Uploads the layer attribute texture to the GPU.
     */
    uploadLayerTexture(): void {
      this.layerAttributeTexture.upload();
    }

    process(nodeIndex: number, offset: number, data: NodeDisplayData, textureIndex: number, nodeKey: string): void {
      let i = offset * this.STRIDE;
      // Hidden nodes get zeroed out so the GPU draws nothing for them.
      if (data.visibility === "hidden") {
        for (let l = i + this.STRIDE; i < l; i++) {
          this.floats[i] = 0;
        }
        return;
      }
      this.processVisibleItem(indexToColor(nodeIndex), i, data, textureIndex, nodeKey);
    }

    processVisibleItem(
      nodeIndex: number,
      startIndex: number,
      data: NodeDisplayData,
      textureIndex: number,
      nodeKey: string,
    ) {
      const { floats, ints } = this;

      // Buffer: only a_nodeIndex and a_id
      floats[startIndex++] = textureIndex;
      // a_id is a packed picking ID, it should be stored as an int
      ints[startIndex++] = nodeIndex;

      // Pack layer attributes via pre-computed descriptors
      if (layerAttributeLayout.floatsPerItem === 0) return;

      const packed = this.packedAttributeData;
      packAttributes(
        this.attrDescriptors,
        data as unknown as Record<string, unknown>,
        packed,
        data.color,
        data.opacity ?? 1,
        this.layerLifecycles,
        0,
      );

      this.layerAttributeTexture.updateAllAttributes(nodeKey, packed);
    }

    setUniforms(params: RenderParams, programInfo: ProgramInfo): void {
      const { gl, uniformLocations } = programInfo;

      // Set standard uniforms
      if (uniformLocations.u_matrix) {
        gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      }
      if (uniformLocations.u_sizeRatio) {
        gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      }
      if (uniformLocations.u_correctionRatio) {
        gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      }
      if (uniformLocations.u_pickingPadding) {
        gl.uniform1f(uniformLocations.u_pickingPadding, params.nodePickingPadding);
      }
      if (uniformLocations.u_cameraAngle) {
        gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      }
      if (uniformLocations.u_nodeDataTexture) {
        gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      }
      if (uniformLocations.u_nodeDataTextureWidth) {
        gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      }

      // Bind and set layer attribute texture uniforms
      if (uniformLocations.u_layerAttributeTexture) {
        this.layerAttributeTexture.bind(LAYER_ATTRIBUTE_TEXTURE_UNIT);
        gl.uniform1i(uniformLocations.u_layerAttributeTexture, LAYER_ATTRIBUTE_TEXTURE_UNIT);
      }
      if (uniformLocations.u_layerAttributeTextureWidth) {
        gl.uniform1i(uniformLocations.u_layerAttributeTextureWidth, this.layerAttributeTexture.getTextureWidth());
      }
      if (uniformLocations.u_layerAttributeTexelsPerNode) {
        gl.uniform1i(uniformLocations.u_layerAttributeTexelsPerNode, this.layerAttributeTexture.getTexelsPerItem());
      }

      // Set shape-specific uniforms (from all shapes)
      shapes.forEach((shape) => {
        shape.uniforms.forEach((uniform) => {
          this.setTypedUniform(uniform, programInfo);
        });
      });

      // Set layer-specific uniforms
      layers.forEach((layer) => {
        layer.uniforms.forEach((uniform) => {
          this.setTypedUniform(uniform, programInfo);
        });
      });
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
      // Check for shader regeneration before rendering
      this.maybeRegenerateShaders();

      // Activate the program BEFORE calling beforeRender hooks
      // (hooks may set uniforms which requires an active program)
      const { gl, program } = programInfo;
      gl.useProgram(program);

      // Only call beforeRender hooks for the normal program (not picking)
      // Hooks set uniforms like texture samplers that aren't needed for picking,
      // and getUniformLocation always references normalProgram
      if (programInfo === this.normalProgram) {
        this.layerLifecycles.forEach((hooks) => {
          hooks.beforeRender?.();
        });
      }

      super.renderProgram(params, programInfo);
    }

    kill(): void {
      // Call kill hooks for cleanup
      this.layerLifecycles.forEach((hooks) => {
        hooks.kill?.();
      });
      this.layerLifecycles.clear();

      // Decrement reference count and destroy shared texture if last instance
      const gl = this.normalProgram.gl;
      const refCount = (NodeProgramClass.textureRefCounts.get(gl) || 1) - 1;

      if (refCount <= 0) {
        // Last instance using this texture - destroy it
        this.layerAttributeTexture.kill();
        NodeProgramClass.layerTextures.delete(gl);
        NodeProgramClass.textureRefCounts.delete(gl);
      } else {
        NodeProgramClass.textureRefCounts.set(gl, refCount);
      }

      super.kill();
    }
  };

  return {
    program: NodeProgramClass,
    labelProgram: LabelProgramClass,
    backdropProgram: BackdropProgramClass,
    labelBackgroundProgram: LabelBackgroundProgramClass,
    // Shape registry metadata (consumed by sigma when the program is multi-shape).
    shapeSlug: primaryShapeSlug,
    shapeNameToIndex: shapes.length > 1 ? shapeNameToIndex : undefined,
    shapeGlobalIds: shapes.length > 1 ? shapeGlobalIds : undefined,
  };
}

export type NodeProgramBundle<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = ReturnType<typeof createNodeProgram<N, E, G>>;

export type NodeProgramType<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = NodeProgramBundle<N, E, G>["program"];

export type NodeProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> = InstanceType<NodeProgramType<N, E, G>>;
