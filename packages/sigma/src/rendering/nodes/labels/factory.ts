/**
 * Sigma.js Node Label Program Factory
 * ====================================
 *
 * Builds a node label program instance from an SDF shape definition. The
 * program uses the shape's SDF to compute exact edge positions, so labels
 * sit precisely next to the node's actual shape boundary.
 *
 * ## Overview
 *
 * The program:
 * 1. Renders text using SDF (Signed Distance Field) atlas for crisp text at any zoom
 * 2. Positions labels relative to the node's actual shape boundary (not just center)
 * 3. Supports multiple label positions: right, left, above, below, over
 * 4. Handles camera rotation correctly for both rotating and non-rotating nodes
 *
 * @module
 */
import { Attributes } from "graphology-types";

import { DEFAULT_SDF_ATLAS_OPTIONS, GlyphMetrics, SDFAtlasManager } from "../../../core/sdf-atlas";
import type Sigma from "../../../sigma";
import type { LabelDisplayData, RenderParams } from "../../../types";
import { floatColor, getPixelRatio } from "../../../utils";
// ============================================================================
// Constants
// ============================================================================

import { DEFAULT_LABEL_MARGIN, POSITION_MODE_MAP } from "../../glsl";
import { InstancedProgramDefinition, ProgramInfo } from "../../utils";
import { LabelOptions } from "../types";
import { LabelProgram } from "./base";
import { generateLabelShaders } from "./generator";

// ============================================================================
// Types
// ============================================================================

/**
 * Options for creating a label program.
 */
export interface CreateLabelProgramOptions {
  /**
   * Label styling and behavior options.
   */
  label?: LabelOptions;
}

/**
 * Cached glyph layout data for a single label.
 */
interface LabelGlyphCache {
  /** Glyph metrics for each character (undefined if glyph not found) */
  glyphs: (GlyphMetrics | undefined)[];
  /** Cumulative X offset for each character (in atlas font size pixels) */
  xOffsets: number[];
  /** Total label width (in atlas font size pixels) */
  totalWidth: number;
  /** Total label height (maxAscent + maxDescent), in atlas font size pixels */
  totalHeight: number;
  /** Vertical center offset from baseline, in atlas font size pixels */
  verticalCenterOffset: number;
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Builds a node label program instance. The program renders text labels,
 * positioning them from the shape-aware edge distance the frame-pass writes to
 * the shared frame texture.
 *
 * `createNodeProgram` calls this internally and exposes the instance in
 * its `labelProgram` field.
 */
export function createLabelProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  gl: WebGL2RenderingContext,
  pickingBuffer: WebGLFramebuffer | null,
  renderer: Sigma<N, E, G>,
  options: CreateLabelProgramOptions,
): LabelProgram<string, N, E, G, LabelDisplayData> {
  const { label: labelOptions = {} } = options;
  const labelMargin = labelOptions.margin ?? DEFAULT_LABEL_MARGIN;
  const zoomToLabelSizeRatioFunction = labelOptions.zoomToLabelSizeRatioFunction ?? (() => 1);

  // Generate shaders at factory creation time (not per-instance). The label text
  // is shape-agnostic now — the shape-aware boundary distance comes from the
  // frame-pass via the shared frame texture.
  const generatedShaders = generateLabelShaders();

  // Uniform type for TypeScript
  type LabelUniform =
    | "u_matrix"
    | "u_sizeRatio"
    | "u_correctionRatio"
    | "u_cameraAngle"
    | "u_resolution"
    | "u_atlasSize"
    | "u_atlas"
    | "u_gamma"
    | "u_sdfBuffer"
    | "u_zoomLabelSizeRatio"
    | string; // Allow shape-specific uniforms

  class NodeLabelProgram extends LabelProgram<LabelUniform, N, E, G, LabelDisplayData> {
    /** Static reference to the label margin */
    static readonly labelMargin = labelMargin;

    /** Static reference to the zoom-to-label-size ratio function */
    static readonly zoomToLabelSizeRatioFunction = zoomToLabelSizeRatioFunction;

    // -----------------------------------------------------------------------
    // Instance Properties
    // -----------------------------------------------------------------------

    /** Manages SDF glyph generation and atlas packing */
    private atlasManager: SDFAtlasManager;

    /** Actual atlas font size (= DEFAULT × pixelRatio), used for scale calculations */
    private atlasFontSize: number;

    /** WebGL texture containing the glyph atlas */
    private atlasTexture: WebGLTexture | null = null;

    /** Gamma value for SDF edge sharpness (√2 works well for most cases) */
    private gamma: number;

    /** SDF buffer/cutoff value from atlas options */
    private sdfBuffer: number;

    /** Flag indicating the atlas texture needs to be uploaded to GPU */
    private atlasNeedsUpdate = false;

    /** Cache of pre-computed glyph layout data per label */
    private labelGlyphCache: Map<string, LabelGlyphCache> = new Map();

    /** Default font key */
    private defaultFontKey: string;

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    constructor(gl: WebGL2RenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      super(gl, pickingBuffer, renderer);

      // Scale the atlas font size by pixelRatio so SDF glyphs have enough detail
      // at the device's native resolution. The shader's v_fontScale is also divided
      // by pixelRatio so the gamma (AA band width) stays desktop-equivalent.
      this.atlasFontSize = DEFAULT_SDF_ATLAS_OPTIONS.fontSize * getPixelRatio();
      this.atlasManager = new SDFAtlasManager({ fontSize: this.atlasFontSize });
      // Base gamma for SDF anti-aliasing, scaled by fontScale in the shader.
      // At a typical 14px label (fontScale ≈ 0.22), effective gamma ≈ 0.11.
      this.gamma = 0.025;
      this.sdfBuffer = DEFAULT_SDF_ATLAS_OPTIONS.cutoff;

      // Create and configure WebGL texture for glyph atlas
      this.atlasTexture = gl.createTexture();
      if (!this.atlasTexture) {
        throw new Error("NodeLabelProgram: failed to create atlas texture");
      }

      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Subscribe to atlas updates to know when to re-upload texture
      this.atlasManager.on(SDFAtlasManager.ATLAS_UPDATED_EVENT, () => {
        this.atlasNeedsUpdate = true;
      });

      // Register the default font (fall back to hardcoded defaults if not specified)
      // TODO: Font configuration should come from styles
      const fontConfig = {
        family: labelOptions.font?.family || "sans-serif",
        weight: labelOptions.font?.weight || ("normal" as const),
        style: labelOptions.font?.style || ("normal" as const),
      };
      this.defaultFontKey = this.atlasManager.registerFont(fontConfig);
    }

    // -----------------------------------------------------------------------
    // Program Definition
    // -----------------------------------------------------------------------

    getDefinition(): InstancedProgramDefinition<LabelUniform> {
      const { FLOAT, UNSIGNED_BYTE, TRIANGLE_STRIP } = WebGL2RenderingContext;

      return {
        VERTICES: 4, // Quad for each character
        VERTEX_SHADER_SOURCE: generatedShaders.vertexShader,
        FRAGMENT_SHADER_SOURCE: generatedShaders.fragmentShader,
        METHOD: TRIANGLE_STRIP,
        UNIFORMS: generatedShaders.uniforms as LabelUniform[],
        ATTRIBUTES: [
          // Per-character instance data
          // Node position and size are fetched from texture via a_nodeIndex
          { name: "a_nodeIndex", size: 1, type: FLOAT },
          { name: "a_charOffset", size: 2, type: FLOAT },
          { name: "a_charSize", size: 2, type: FLOAT },
          { name: "a_texCoords", size: 4, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_margin", size: 1, type: FLOAT },
          { name: "a_positionMode", size: 1, type: FLOAT },
          { name: "a_labelWidth", size: 1, type: FLOAT },
          { name: "a_labelHeight", size: 1, type: FLOAT },
          { name: "a_verticalCenter", size: 1, type: FLOAT },
          { name: "a_textHeight", size: 1, type: FLOAT },
          { name: "a_labelAngle", size: 1, type: FLOAT },
        ],
        // Quad corners (same for all characters)
        CONSTANT_ATTRIBUTES: [{ name: "a_quadCorner", size: 2, type: FLOAT }],
        CONSTANT_DATA: [
          [-1, -1], // Bottom-left
          [1, -1], // Bottom-right
          [-1, 1], // Top-left
          [1, 1], // Top-right
        ],
      };
    }

    // -----------------------------------------------------------------------
    // Glyph Preparation
    // -----------------------------------------------------------------------

    /**
     * Pre-computes glyph layout data for a label and caches it.
     *
     * This method:
     * 1. Ensures all glyphs are in the atlas
     * 2. Computes cumulative X offsets for each character
     * 3. Caches the data for use during character processing
     *
     * @param labelKey Unique identifier for this label
     * @param data Label display data
     */
    private prepareLabelGlyphs(labelKey: string, data: LabelDisplayData): void {
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
      let maxAscent = 0;
      let maxDescent = 0;

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
          maxAscent = Math.max(maxAscent, glyph.bearingY);
          maxDescent = Math.max(maxDescent, glyph.atlasHeight - glyph.bearingY);
        }
      }

      this.labelGlyphCache.set(labelKey, {
        glyphs,
        xOffsets,
        totalWidth: xOffset,
        totalHeight: maxAscent + maxDescent,
        verticalCenterOffset: (maxAscent - maxDescent) / 2,
      });
    }

    // -----------------------------------------------------------------------
    // Character Processing
    // -----------------------------------------------------------------------

    /**
     * Processes a single character and writes its vertex data to the buffer.
     *
     * ## Character Positioning
     *
     * Each character's position is computed as:
     * 1. Start from the label's anchor position (node center)
     * 2. Add position offset (computed in shader using shape SDF)
     * 3. Add character offset within the label
     * 4. Add glyph bearing to align properly
     *
     * ## Coordinate System
     *
     * - `charOffsetX/Y`: Offset from label origin to character's top-left corner
     * - Positive X = rightward, Positive Y = downward (screen coordinates)
     * - The shader will convert to clip space and flip Y
     *
     * @param index Buffer index for this character
     * @param labelData Label display data from sigma
     * @param _char The character (unused, we use charIndex)
     * @param charIndex Index of this character within the label text
     */
    protected processCharacter(index: number, labelData: LabelDisplayData, _char: string, charIndex: number): void {
      const { floats, STRIDE } = this;
      const startIndex = index * STRIDE;

      // Retrieve cached glyph data
      const cache = this.labelGlyphCache.get(labelData.parentKey);

      if (!cache || !cache.glyphs[charIndex]) {
        // No glyph data available - write zeros to skip this character
        for (let i = 0; i < STRIDE; i++) {
          floats[startIndex + i] = 0;
        }
        return;
      }

      const glyph = cache.glyphs[charIndex]!;
      const xOffset = cache.xOffsets[charIndex];

      // Scale factor: atlas glyphs are rendered at atlasFontSize, scale to requested size
      const scale = labelData.size / this.atlasFontSize;

      // -----------------------------------------------------------------------
      // Write vertex attributes to buffer
      // -----------------------------------------------------------------------

      const color = floatColor(labelData.color);
      let i = startIndex;

      // a_nodeIndex: Index into node data texture (for GPU-side position/size lookup)
      floats[i++] = labelData.nodeIndex;

      // a_charOffset: Character position relative to label origin (pixels)
      // bearingX accounts for the SDF buffer: it points to the atlas region's
      // left edge (buffer pixels before the glyph body).
      floats[i++] = (xOffset + glyph.bearingX) * scale;
      floats[i++] = -glyph.bearingY * scale;

      // a_charSize: Character quad dimensions (pixels)
      floats[i++] = glyph.atlasWidth * scale;
      floats[i++] = glyph.atlasHeight * scale;

      // a_texCoords: Glyph location in atlas texture (pixels)
      floats[i++] = glyph.atlasX;
      floats[i++] = glyph.atlasY;
      floats[i++] = glyph.atlasWidth;
      floats[i++] = glyph.atlasHeight;

      // a_color: Packed RGBA color
      floats[i++] = color;

      // a_margin: Gap between node edge and label (pixels)
      floats[i++] = labelData.margin;

      // a_positionMode: Label position mode for shader (from per-node style)
      floats[i++] = POSITION_MODE_MAP[labelData.position];

      // a_labelWidth: Total label width in pixels (for centering/right-alignment)
      floats[i++] = cache.totalWidth * scale;

      // a_labelHeight: Font size in pixels (for SDF anti-aliasing)
      floats[i++] = labelData.size;

      // a_verticalCenter: Pre-computed vertical center offset (pixels)
      floats[i++] = cache.verticalCenterOffset * scale;

      // a_textHeight: Actual text height (maxAscent + maxDescent) in pixels
      floats[i++] = cache.totalHeight * scale;

      // a_labelAngle: Per-node label rotation angle in radians
      floats[i++] = labelData.labelAngle;
    }

    /**
     * Processes a label by first preparing its glyph cache.
     */
    processLabel(labelKey: string, offset: number, data: LabelDisplayData): number {
      this.prepareLabelGlyphs(labelKey, data);
      return super.processLabel(labelKey, offset, data);
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

      // Currently only support single atlas texture
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
     * Sets all uniforms for the label shader.
     */
    setUniforms(params: RenderParams, programInfo: ProgramInfo): void {
      const { gl, uniformLocations } = programInfo;

      // Transform uniforms
      gl.uniformMatrix3fv(uniformLocations.u_matrix, false, params.matrix);
      gl.uniform1f(uniformLocations.u_sizeRatio, params.sizeRatio);
      gl.uniform1f(uniformLocations.u_correctionRatio, params.correctionRatio);
      gl.uniform1f(uniformLocations.u_cameraAngle, params.cameraAngle);

      // Viewport size in physical pixels
      gl.uniform2f(uniformLocations.u_resolution, params.width * params.pixelRatio, params.height * params.pixelRatio);

      // Atlas texture size
      const textures = this.atlasManager.getTextures();
      if (textures.length > 0) {
        gl.uniform2f(uniformLocations.u_atlasSize, textures[0].width, textures[0].height);
      } else {
        gl.uniform2f(uniformLocations.u_atlasSize, 1, 1);
      }

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

      // Shared frame texture (normalized edge distances written by the frame-pass)
      gl.uniform1i(uniformLocations.u_nodeFrameTexture, params.nodeFrameTextureUnit);
      gl.uniform1i(uniformLocations.u_nodeFrameTextureWidth, params.nodeFrameTextureWidth);

      // SDF rendering parameters
      gl.uniform1f(uniformLocations.u_gamma, this.gamma);
      gl.uniform1f(uniformLocations.u_sdfBuffer, this.sdfBuffer);
      gl.uniform1f(uniformLocations.u_pixelRatio, params.pixelRatio);

      // Zoom-dependent label size ratio
      gl.uniform1f(
        uniformLocations.u_zoomLabelSizeRatio,
        1 / NodeLabelProgram.zoomToLabelSizeRatioFunction(params.zoomRatio),
      );
      gl.uniform1f(uniformLocations.u_labelPixelSnapping, params.labelPixelSnapping);
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

      super.renderProgram(params, programInfo);
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * Registers a font for use in labels.
     *
     * @param family Font family name (e.g., "Arial", "sans-serif")
     * @param weight Font weight (e.g., "normal", "bold")
     * @param style Font style (e.g., "normal", "italic")
     * @returns Font key for use in label data
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
     * Measures a label using the same glyph advance metrics as rendering.
     */
    measureLabel(
      text: string,
      fontSize: number,
      fontKey?: string,
    ): { width: number; height: number; textHeight: number } {
      const actualFontKey = fontKey || this.defaultFontKey;

      this.atlasManager.ensureGlyphs(text, actualFontKey);
      if (this.atlasManager.hasPendingGlyphs()) {
        this.atlasManager.flush();
      }

      let totalWidth = 0;
      let maxAscent = 0;
      let maxDescent = 0;
      for (const char of text) {
        const charCode = char.codePointAt(0);
        if (charCode === undefined) continue;
        const glyph = this.atlasManager.getGlyph(charCode, actualFontKey);
        if (glyph) {
          totalWidth += glyph.advance;
          maxAscent = Math.max(maxAscent, glyph.bearingY);
          maxDescent = Math.max(maxDescent, glyph.atlasHeight - glyph.bearingY);
        }
      }

      const scale = fontSize / this.atlasFontSize;

      // - height is the font size (line box)
      // - textHeight is the actual glyph extent (maxAscent + maxDescent), used
      //   to vertically center the label box on text.
      return { width: totalWidth * scale, height: fontSize, textHeight: (maxAscent + maxDescent) * scale };
    }

    /**
     * Pre-generates glyphs for the given texts.
     * Call this before rendering to avoid generation during animation.
     *
     * @param texts Array of text strings to prepare
     * @param fontKey Optional font key (defaults to sans-serif)
     */
    ensureGlyphsReady(texts: string[], fontKey?: string): void {
      const actualFontKey = fontKey || this.defaultFontKey;

      // Queue all glyph requests
      for (const text of texts) {
        this.atlasManager.ensureGlyphs(text, actualFontKey);
      }

      // Flush immediately to generate all glyphs synchronously
      this.atlasManager.flush();
    }

    // -----------------------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------------------

    kill(): void {
      const gl = this.normalProgram.gl;

      // Delete WebGL texture
      if (this.atlasTexture) {
        gl.deleteTexture(this.atlasTexture);
        this.atlasTexture = null;
      }

      // Clean up atlas manager
      this.atlasManager.destroy();

      // Clear caches
      this.labelGlyphCache.clear();

      super.kill();
    }
  }

  return new NodeLabelProgram(gl, pickingBuffer, renderer);
}
