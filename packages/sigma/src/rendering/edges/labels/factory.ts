/**
 * Sigma.js Edge Label Program Factory
 * ====================================
 *
 * Factory function that creates an EdgeLabelProgram class for rendering
 * edge labels along edge paths using WebGL SDF text rendering.
 *
 * ## Architecture
 *
 * Edge labels are rendered character-by-character along the edge path:
 * 1. CPU writes all characters to the GPU buffer (including glyph metrics)
 * 2. GPU computes edge body bounds (accounting for node shapes and extremities)
 * 3. GPU positions each character at the correct arc distance along the path
 * 4. GPU rotates each character to align with the path tangent
 * 5. GPU truncates characters that don't fit within the body
 *
 * @module
 */
import { Attributes } from "graphology-types";

import { DEFAULT_SDF_ATLAS_OPTIONS, GlyphMetrics, SDFAtlasManager } from "../../../core/sdf-atlas";
import type Sigma from "../../../sigma";
import type { EdgeLabelDisplayData, EdgeLabelPosition, RenderParams } from "../../../types";
import { floatColor } from "../../../utils";
import {
  AttrDescriptor,
  ItemAttributeTexture,
  buildAttrDescriptors,
  computeAttributeLayout,
  packAttributes,
} from "../../data-texture";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { layerPlain } from "../layers";
import { EDGE_ATTRIBUTE_TEXTURE_UNIT } from "../path-attribute-texture";
import type { EdgeLabelOptions, EdgePath } from "../types";
import { EdgeLabelProgram, resolveEdgeLabelShaderConfig } from "./base";
import type { EdgeLabelProgramType } from "./base";
import { GeneratedEdgeLabelShaders, generateEdgeLabelShaders } from "./generator";

// Path attributes carry no layer lifecycle hooks; packAttributes still needs a map.
const NO_LIFECYCLES = new Map();

/**
 * Converts edge label position string to numeric mode for GPU.
 * - 0: "over" (centered on path)
 * - 1: "above" (positive perpendicular offset)
 * - 2: "below" (negative perpendicular offset)
 * - 3: "auto" (GPU determines based on screen positions)
 */
function positionToMode(position: EdgeLabelPosition): number {
  switch (position) {
    case "over":
      return 0;
    case "above":
      return 1;
    case "below":
      return 2;
    case "auto":
      return 3;
    default:
      return 0;
  }
}

// ============================================================================
// Types
// ============================================================================

/**
 * Options for creating an edge label program.
 * Extends EdgeLabelOptions with program-specific options (paths, extremity ratios).
 */
export interface CreateEdgeLabelProgramOptions extends EdgeLabelOptions {
  /**
   * The path types for positioning labels along edges (supports multi-path).
   * Must match the paths used by the corresponding edge program.
   */
  paths: EdgePath[];

  /**
   * Head extremity length ratio (length / thickness).
   * Default: 0 (no head extremity)
   */
  headLengthRatio?: number;

  /**
   * Tail extremity length ratio (length / thickness).
   * Default: 0 (no tail extremity)
   */
  tailLengthRatio?: number;
}

/**
 * Cached glyph layout data for a single edge label.
 */
interface EdgeLabelGlyphCache {
  /** Glyph metrics for each character (undefined if glyph not found) */
  glyphs: (GlyphMetrics | undefined)[];
  /** Cumulative X offset for each character (in atlas font size pixels) */
  xOffsets: number[];
  /** Total label width (in atlas font size pixels) */
  totalWidth: number;
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Creates an edge label program for a specific path type.
 *
 * The resulting program renders text labels along edge paths using SDF
 * (Signed Distance Field) atlas for crisp text at any zoom level.
 *
 * @param options Configuration for the edge label program
 * @returns An EdgeLabelProgram class constructor
 *
 * @example
 * ```typescript
 * const LineEdgeLabelProgram = createEdgeLabelProgram({
 *   paths: [pathLine(), pathCurved()],
 * });
 *
 * // Attach to edge program
 * ComposedEdgeLineProgram.LabelProgram = LineEdgeLabelProgram;
 * ```
 */
export function createEdgeLabelProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options: CreateEdgeLabelProgramOptions): EdgeLabelProgramType<N, E, G> {
  const { color: labelColor, margin: labelMargin, textBorder } = options;
  const labelShaderConfig = resolveEdgeLabelShaderConfig(options);
  const { paths, fontSizeMode, minVisibilityThreshold, fullVisibilityThreshold } = labelShaderConfig;

  const hasBorder = !!textBorder;

  // Shaders are generated lazily on first instantiation.
  // This ensures all node shapes are registered before edge label shaders are compiled,
  // since generateShapeSelectorGLSL() reads from the shape registry.
  let generated: GeneratedEdgeLabelShaders | null = null;

  // Uniform type for TypeScript
  // Note: We use `string` as a fallback to allow path-specific uniforms that aren't known at compile time.
  // The explicit union members serve as documentation of the standard uniforms used by edge labels.
  type EdgeLabelUniform = string;

  // -------------------------------------------------------------------------
  // Return the EdgeLabelProgram class
  // -------------------------------------------------------------------------
  return class GeneratedEdgeLabelProgram extends EdgeLabelProgram<EdgeLabelUniform, N, E, G> {
    /** Static reference to the options used to create this program */
    static readonly programOptions = options;

    /** Static getter for generated shader code (lazy generation) */
    static get generatedShaders() {
      if (!generated) {
        generated = generateEdgeLabelShaders({
          paths,
          hasBorder,
          fontSizeMode,
          minVisibilityThreshold,
          fullVisibilityThreshold,
        });
      }
      return generated;
    }

    /** Label styling statics read by the renderer to override data-supplied values. */
    static readonly labelColor = labelColor;
    static readonly labelMargin = labelMargin;

    // -----------------------------------------------------------------------
    // Instance Properties
    // -----------------------------------------------------------------------

    /** Manages SDF glyph generation and atlas packing */
    private atlasManager: SDFAtlasManager;

    /** WebGL texture containing the glyph atlas */
    private atlasTexture: WebGLTexture | null = null;

    /** Gamma value for SDF edge sharpness */
    private gamma: number;

    /** SDF buffer/cutoff value from atlas options */
    private sdfBuffer: number;

    /** Flag indicating the atlas texture needs to be uploaded to GPU */
    private atlasNeedsUpdate = false;

    /** Cache of pre-computed glyph layout data per label */
    private labelGlyphCache: Map<string, EdgeLabelGlyphCache> = new Map();

    /** Default font key */
    private defaultFontKey: string;

    /** Edge path attribute texture for curvature and other path attributes */
    private edgeAttributeTexture: ItemAttributeTexture | null = null;

    /** Packed attribute data buffer for reuse */
    private packedAttributeData: Float32Array;

    /** Layout describing attribute positions in the texture */
    private attributeLayout: ReturnType<typeof computeAttributeLayout>;

    /** Descriptors for packing path attributes — mirrors the edge body program. */
    private attrDescriptors: AttrDescriptor[];

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      // Generate shaders on first instantiation (after node shapes are registered)
      if (!generated) {
        generated = generateEdgeLabelShaders({
          paths,
          hasBorder,
          fontSizeMode,
          minVisibilityThreshold,
          fullVisibilityThreshold,
        });
      }

      super(gl, pickingBuffer, renderer);

      // Initialize edge attribute texture for path attributes (curvature, loop geometry, …).
      const layer = layerPlain();
      this.attributeLayout = computeAttributeLayout([...paths, layer]);
      this.attrDescriptors = buildAttrDescriptors([...paths, layer], this.attributeLayout);
      this.edgeAttributeTexture = new ItemAttributeTexture(gl, this.attributeLayout);
      this.packedAttributeData = new Float32Array(this.attributeLayout.floatsPerItem);

      // Initialize SDF atlas manager for glyph generation
      this.atlasManager = new SDFAtlasManager();
      // Base gamma for SDF anti-aliasing, scaled by fontScale in the shader
      this.gamma = 0.025;
      this.sdfBuffer = DEFAULT_SDF_ATLAS_OPTIONS.cutoff;

      // Create and configure WebGL texture for glyph atlas
      this.atlasTexture = gl.createTexture();
      if (!this.atlasTexture) {
        throw new Error("EdgeLabelProgram: failed to create atlas texture");
      }

      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Subscribe to atlas updates
      this.atlasManager.on(SDFAtlasManager.ATLAS_UPDATED_EVENT, () => {
        this.atlasNeedsUpdate = true;
        // Trigger re-render to update vertex data with new glyph metrics
        // Use setTimeout to defer refresh to next tick, avoiding interference with ongoing render
        setTimeout(() => this.renderer.refresh(), 0);
      });

      // Register the default font
      // TODO: Font configuration should come from styles
      const fontConfig = {
        family: "sans-serif",
        weight: "normal" as const,
        style: "normal" as const,
      };
      this.defaultFontKey = this.atlasManager.registerFont(fontConfig);
    }

    // -----------------------------------------------------------------------
    // Program Definition
    // -----------------------------------------------------------------------

    getDefinition(): InstancedProgramDefinition<EdgeLabelUniform> {
      const { FLOAT, UNSIGNED_BYTE, TRIANGLE_STRIP } = WebGL2RenderingContext;

      // Build path-specific attributes (collect unique attributes from all paths)
      const seenAttributes = new Set<string>();
      const pathAttributes: { name: string; size: number; type: number }[] = [];
      for (const p of paths) {
        for (const attr of p.attributes) {
          const name = attr.name.startsWith("a_") ? attr.name : `a_${attr.name}`;
          if (!seenAttributes.has(name)) {
            seenAttributes.add(name);
            pathAttributes.push({ name, size: attr.size, type: attr.type });
          }
        }
      }

      return {
        VERTICES: 4, // Quad for each character
        VERTEX_SHADER_SOURCE: generated!.vertexShader,
        FRAGMENT_SHADER_SOURCE: generated!.fragmentShader,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: generated!.uniforms as EdgeLabelUniform[],
        ATTRIBUTES: [
          // Edge indices for texture lookup
          { name: "a_edgeIndex", size: 1, type: FLOAT }, // Index into edge data texture (node positions, thickness, etc.)
          { name: "a_edgeAttrIndex", size: 1, type: FLOAT }, // Index into edge attribute texture (curvature, etc.)
          { name: "a_baseFontSize", size: 1, type: FLOAT }, // Base font size in pixels (per-label)

          // Character metrics (packed)
          { name: "a_charMetrics", size: 4, type: FLOAT }, // (charTextOffset, charAdvance, totalTextWidth, positionMode)
          { name: "a_charDims", size: 4, type: FLOAT }, // (charSize.x, charSize.y, charOffset.x, charOffset.y)

          // Atlas texture coordinates and margin
          { name: "a_texCoords", size: 4, type: FLOAT }, // (x, y, width, height)
          { name: "a_labelParams", size: 2, type: FLOAT }, // (margin, unused)

          // Appearance
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          ...(hasBorder ? [{ name: "a_borderColor", size: 4, type: UNSIGNED_BYTE, normalized: true }] : []),

          // Path-specific attributes (except those now in edge texture)
          ...pathAttributes.filter((attr) => !["a_curvature", "curvature"].includes(attr.name)),
        ],
        // Quad corners (same for all characters)
        CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: FLOAT }],
        CONSTANT_DATA: [
          [0, 0], // Bottom-left
          [1, 0], // Bottom-right
          [0, 1], // Top-left
          [1, 1], // Top-right
        ],
      };
    }

    // -----------------------------------------------------------------------
    // Glyph Preparation
    // -----------------------------------------------------------------------

    /**
     * Pre-computes glyph layout data for a label and caches it.
     */
    private prepareLabelGlyphs(labelKey: string, data: EdgeLabelDisplayData): void {
      if (data.hidden || !data.text) {
        this.labelGlyphCache.delete(labelKey);
        return;
      }

      const text = data.text;
      const fontKey = data.fontKey || this.defaultFontKey;

      // Ensure all glyphs exist in the atlas
      this.atlasManager.ensureGlyphs(text, fontKey);

      // Build glyph metrics and offset arrays
      const glyphs: (GlyphMetrics | undefined)[] = [];
      const xOffsets: number[] = [];
      let xOffset = 0;

      for (const char of text) {
        const charCode = char.codePointAt(0);
        if (charCode === undefined) {
          glyphs.push(undefined);
          xOffsets.push(xOffset);
          continue;
        }

        const glyph = this.atlasManager.getGlyph(charCode, fontKey);
        glyphs.push(glyph);
        xOffsets.push(xOffset);

        if (glyph) {
          xOffset += glyph.advance;
        }
      }

      this.labelGlyphCache.set(labelKey, {
        glyphs,
        xOffsets,
        totalWidth: xOffset,
      });
    }

    // -----------------------------------------------------------------------
    // Character Processing
    // -----------------------------------------------------------------------

    /**
     * Processes a single character and writes its vertex data to the buffer.
     *
     * ## Attribute Layout (must match getDefinition)
     *
     * Edge geometry (fetched from textures via indices):
     * - a_edgeIndex (1): Index into edge data texture (node positions, thickness, etc.)
     * - a_edgeAttrIndex (1): Index into edge attribute texture (curvature, etc.)
     * - a_baseFontSize (1): Base font size in pixels
     *
     * Character metrics:
     * - a_charMetrics (4): Text offset, advance, total width, position mode
     * - a_charDims (4): Character size and offset
     *
     * Atlas:
     * - a_texCoords (4): Texture coordinates
     * - a_labelParams (2): Margin, unused
     *
     * Appearance:
     * - a_color (1): Packed RGBA color
     */
    protected processCharacter(index: number, labelData: EdgeLabelDisplayData, _char: string, charIndex: number): void {
      const { floats } = this;
      const stride = this.STRIDE;
      const startIndex = index * stride;

      // Retrieve cached glyph data
      const cache = this.labelGlyphCache.get(labelData.parentKey);

      if (!cache || !cache.glyphs[charIndex]) {
        // No glyph data available - write zeros to skip this character
        for (let i = 0; i < stride; i++) {
          floats[startIndex + i] = 0;
        }
        return;
      }

      const glyph = cache.glyphs[charIndex]!;
      const xOffset = cache.xOffsets[charIndex];

      // Compute effective color: program-level override takes precedence
      // Program-level color can specify { color: "#xxx" } or { attribute: "attrName" }
      // For simplicity, we only support fixed color override at program level
      const programColor = GeneratedEdgeLabelProgram.labelColor;
      const effectiveColor =
        programColor && typeof programColor === "object" && "color" in programColor && programColor.color
          ? programColor.color
          : labelData.color;
      const color = floatColor(effectiveColor);
      let i = startIndex;

      // a_edgeIndex: Index into edge data texture (contains node indices, thickness, head/tail ratios)
      floats[i++] = labelData.edgeIndex;

      // a_edgeAttrIndex: Index into edge attribute texture (contains curvature and other path-specific attributes)
      floats[i++] = this.edgeAttributeTexture?.getIndex(labelData.parentKey) ?? 0;

      // a_baseFontSize: Base font size in pixels
      floats[i++] = labelData.size;

      // a_charMetrics: (charTextOffset, charAdvance, totalTextWidth, positionMode)
      // Position is resolved by the style system into labelData.position; the
      // background/picking reads the same style, so they can't disagree.
      floats[i++] = xOffset;
      floats[i++] = glyph.advance;
      floats[i++] = cache.totalWidth;
      floats[i++] = positionToMode(labelData.position);

      // a_charDims: (charSize.x, charSize.y, charOffset.x, charOffset.y)
      floats[i++] = glyph.atlasWidth; // includes SDF buffer
      floats[i++] = glyph.atlasHeight; // includes SDF buffer
      floats[i++] = glyph.bearingX;
      floats[i++] = -glyph.bearingY; // flip Y for screen coords

      // a_texCoords: (x, y, width, height)
      floats[i++] = glyph.atlasX;
      floats[i++] = glyph.atlasY;
      floats[i++] = glyph.atlasWidth;
      floats[i++] = glyph.atlasHeight;

      // a_labelParams: (margin, unused)
      // Use program-level margin override if specified, otherwise use labelData.margin
      const effectiveMargin = GeneratedEdgeLabelProgram.labelMargin ?? labelData.margin;
      floats[i++] = effectiveMargin;
      floats[i++] = 0; // unused

      // a_color: packed RGBA
      floats[i++] = color;

      // a_borderColor: packed RGBA (only if border is enabled)
      if (hasBorder && textBorder) {
        // Get border color from ColorSpecification (string | { attribute, color? })
        let borderColorValue: string;
        if (typeof textBorder.color === "string") {
          // Fixed color string
          borderColorValue = textBorder.color;
        } else {
          // Attribute-based color with optional default
          borderColorValue = textBorder.color.color || "#ffffff";
        }
        floats[i++] = floatColor(borderColorValue);
      }

      // Path-specific attributes (except curvature which is now in edge texture)
      // Collect from all paths to ensure consistent attribute layout
      const seenAttrs = new Set<string>();
      for (const p of paths) {
        for (const attr of p.attributes) {
          const attrName = attr.name.startsWith("a_") ? attr.name.slice(2) : attr.name;
          // Skip curvature - it's fetched from edge data texture
          if (attrName === "curvature") {
            continue;
          }
          if (!seenAttrs.has(attrName)) {
            seenAttrs.add(attrName);
            // Unknown attribute - write zeros
            for (let j = 0; j < attr.size; j++) {
              floats[i++] = 0;
            }
          }
        }
      }
    }

    /**
     * Processes an edge label by first preparing its glyph cache
     * and updating the edge attribute texture with path-specific data.
     */
    processEdgeLabel(labelKey: string, offset: number, data: EdgeLabelDisplayData): number {
      this.prepareLabelGlyphs(labelKey, data);

      // Pack every path attribute (curvature, loop geometry, …) into the
      // attribute texture, exactly as the edge body program does — so the label
      // shader samples the same path the edge is drawn on.
      if (this.edgeAttributeTexture && !data.hidden && data.text) {
        this.edgeAttributeTexture.allocate(labelKey);
        const packed = this.packedAttributeData;
        packAttributes(this.attrDescriptors, data.edgeAttributes, packed, "", 1, NO_LIFECYCLES, 0);
        this.edgeAttributeTexture.updateAllAttributes(labelKey, packed);
      }

      return super.processEdgeLabel(labelKey, offset, data);
    }

    // -----------------------------------------------------------------------
    // Atlas Texture Management
    // -----------------------------------------------------------------------

    /**
     * Uploads the atlas texture to the GPU if it has changed.
     */
    private updateAtlasTexture(): void {
      if (!this.atlasNeedsUpdate) return;

      const gl = this.normalProgram.gl;
      const textures = this.atlasManager.getTextures();

      if (textures.length === 0) return;

      const imageData = textures[0];

      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        imageData.width,
        imageData.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageData.data,
      );
      gl.bindTexture(gl.TEXTURE_2D, null);

      this.atlasNeedsUpdate = false;
    }

    // -----------------------------------------------------------------------
    // Uniform Setting
    // -----------------------------------------------------------------------

    /**
     * Sets all uniforms for the edge label shader.
     */
    setUniforms(params: RenderParams, programInfo: ProgramInfo): void {
      const { gl, uniformLocations } = programInfo;
      const textures = this.atlasManager.getTextures();
      const atlasSize = textures.length > 0 ? [textures[0].width, textures[0].height] : [1, 1];

      // Transform uniforms
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);

      // Size uniforms
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);
      gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);
      gl.uniform1f(uniformLocations.u_sdfBufferPixels, DEFAULT_SDF_ATLAS_OPTIONS.buffer);

      // Resolution
      gl.uniform2f(uniformLocations.u_resolution, params.width, params.height);

      // Atlas uniforms
      gl.uniform2f(uniformLocations.u_atlasSize, atlasSize[0], atlasSize[1]);
      gl.uniform1f(uniformLocations.u_gamma, this.gamma);
      gl.uniform1f(uniformLocations.u_sdfBuffer, this.sdfBuffer);

      // Bind atlas texture to texture unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.uniform1i(uniformLocations.u_atlas, 0);

      // Bind node data texture (already bound by sigma.ts to the designated unit)
      if (uniformLocations.u_nodeDataTexture !== undefined) {
        gl.uniform1i(uniformLocations.u_nodeDataTexture, params.nodeDataTextureUnit);
      }
      if (uniformLocations.u_nodeDataTextureWidth !== undefined) {
        gl.uniform1i(uniformLocations.u_nodeDataTextureWidth, params.nodeDataTextureWidth);
      }

      // Bind edge data texture (already bound by sigma.ts to the designated unit)
      if (uniformLocations.u_edgeDataTexture !== undefined) {
        gl.uniform1i(uniformLocations.u_edgeDataTexture, params.edgeDataTextureUnit);
      }
      if (uniformLocations.u_edgeDataTextureWidth !== undefined) {
        gl.uniform1i(uniformLocations.u_edgeDataTextureWidth, params.edgeDataTextureWidth);
      }

      // Border width uniform (only if border is enabled)
      if (hasBorder && textBorder && uniformLocations.u_borderWidth !== undefined) {
        // Convert border width from pixels to SDF units
        // SDF buffer is typically 8 pixels at 64px atlas size, giving ~0.125 normalized
        // Border width in pixels needs to be converted to the same normalized scale
        const borderWidthNormalized = (textBorder.width / DEFAULT_SDF_ATLAS_OPTIONS.buffer) * this.sdfBuffer;
        gl.uniform1f(uniformLocations.u_borderWidth, borderWidthNormalized);
      }

      // Bind edge attribute texture (curvature and other path-specific attributes)
      if (this.edgeAttributeTexture && uniformLocations.u_edgeAttributeTexture !== undefined) {
        this.edgeAttributeTexture.bind(EDGE_ATTRIBUTE_TEXTURE_UNIT);
        gl.uniform1i(uniformLocations.u_edgeAttributeTexture, EDGE_ATTRIBUTE_TEXTURE_UNIT);
        gl.uniform1i(uniformLocations.u_edgeAttributeTextureWidth, this.edgeAttributeTexture.getTextureWidth());
        gl.uniform1i(uniformLocations.u_edgeAttributeTexelsPerEdge, this.edgeAttributeTexture.getTexelsPerItem());
      }

      // Zoom size ratio uniform (only if scaled font size mode)
      if (fontSizeMode === "scaled" && uniformLocations.u_zoomSizeRatio !== undefined) {
        // zoomRatio is the camera ratio
        // zoomToSizeRatioFunction transforms it to a size multiplier
        // We want labels to scale inversely with this (larger when zoomed in)
        const zoomToSizeRatioFunction = this.renderer.getSetting("zoomToSizeRatioFunction");
        const zoomSizeRatio = 1 / zoomToSizeRatioFunction(params.zoomRatio);
        gl.uniform1f(uniformLocations.u_zoomSizeRatio, zoomSizeRatio);
      }
    }

    // -----------------------------------------------------------------------
    // Rendering
    // -----------------------------------------------------------------------

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo): void {
      // Ensure atlas texture is uploaded
      this.updateAtlasTexture();

      // Flush any pending glyph generation
      if (this.atlasManager.hasPendingGlyphs()) {
        this.atlasManager.flush();
        this.updateAtlasTexture();
      }

      // Upload edge attribute texture (curvature, etc.) to GPU
      if (this.edgeAttributeTexture) {
        this.edgeAttributeTexture.upload();
      }

      super.renderProgram(params, programInfo);
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * Registers a font for use in edge labels.
     */
    registerFont(family: string, weight = "normal", style = "normal"): string {
      return this.atlasManager.registerFont({ family, weight, style });
    }

    /**
     * Returns the SDFAtlasManager for advanced use cases.
     */
    getAtlasManager(): SDFAtlasManager {
      return this.atlasManager;
    }

    /**
     * Pre-generates glyphs for the given texts.
     */
    ensureGlyphsReady(texts: string[], fontKey?: string): void {
      const actualFontKey = fontKey || this.defaultFontKey;

      for (const text of texts) {
        this.atlasManager.ensureGlyphs(text, actualFontKey);
      }

      this.atlasManager.flush();
    }

    /**
     * Measures a label's width in atlas (glyph) units — the unit consumed by
     * the edge label and background shaders for `a_totalTextWidth`.
     */
    measureLabelAtlasWidth(text: string, fontKey?: string): number {
      const actualFontKey = fontKey || this.defaultFontKey;

      this.atlasManager.ensureGlyphs(text, actualFontKey);
      if (this.atlasManager.hasPendingGlyphs()) this.atlasManager.flush();

      let width = 0;
      for (const char of text) {
        const cp = char.codePointAt(0);
        if (cp === undefined) continue;
        const glyph = this.atlasManager.getGlyph(cp, actualFontKey);
        if (glyph) width += glyph.advance;
      }
      return width;
    }

    // -----------------------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------------------

    kill(): void {
      const gl = this.normalProgram.gl;

      if (this.atlasTexture) {
        gl.deleteTexture(this.atlasTexture);
        this.atlasTexture = null;
      }

      if (this.edgeAttributeTexture) {
        this.edgeAttributeTexture.kill();
        this.edgeAttributeTexture = null;
      }

      this.atlasManager.destroy();
      this.labelGlyphCache.clear();

      super.kill();
    }
  };
}
