/**
 * Sigma.js SDF Atlas Manager
 * ===========================
 *
 * Manages SDF (Signed Distance Field) glyph generation and atlas packing
 * for WebGL text rendering. Supports multiple fonts in the same atlas.
 *
 * The SDF generation is based on the Felzenszwalb & Huttenlocher EDT algorithm
 * (https://cs.brown.edu/~pff/papers/dt-final.pdf), previously provided by
 * @mapbox/tiny-sdf. We inline it here to fix glyph clipping bugs (see
 * https://github.com/mapbox/tiny-sdf/issues/34).
 *
 * @module
 */
import { EventEmitter } from "events";

/**
 * Metrics for a single glyph in the atlas.
 */
export interface GlyphMetrics {
  /** Character code (Unicode code point) */
  charCode: number;
  /** Glyph width in pixels (at base font size) */
  width: number;
  /** Glyph height in pixels (at base font size) */
  height: number;
  /** Horizontal bearing (offset from origin to atlas region left edge, includes SDF buffer) */
  bearingX: number;
  /** Vertical bearing (offset from baseline to atlas region top edge, includes SDF buffer) */
  bearingY: number;
  /** Horizontal advance (distance to next character origin) */
  advance: number;
  /** X position in atlas texture (pixels) */
  atlasX: number;
  /** Y position in atlas texture (pixels) */
  atlasY: number;
  /** Width in atlas texture (pixels, includes SDF buffer) */
  atlasWidth: number;
  /** Height in atlas texture (pixels, includes SDF buffer) */
  atlasHeight: number;
  /** Index of the atlas texture (for multiple texture support) */
  atlasIndex: number;
}

/**
 * Font identifier string, e.g., "Arial-normal-normal" or "Roboto-bold-italic"
 */
export type FontKey = string;

/**
 * Describes a font for SDF generation.
 */
export interface FontDescriptor {
  /** Font family name, e.g., "Arial", "Roboto" */
  family: string;
  /** Font weight, e.g., "normal", "bold", "600" */
  weight: string;
  /** Font style, e.g., "normal", "italic" */
  style: string;
}

/**
 * Options for the SDF atlas manager.
 */
export interface SDFAtlasOptions {
  /** Base font size for SDF generation (default: 24) */
  fontSize: number;
  /** SDF buffer size in pixels (default: 3) */
  buffer: number;
  /** Radius for SDF calculation (default: 8) */
  radius: number;
  /** Cutoff for SDF values (default: 0.25) */
  cutoff: number;
  /** Maximum texture size in pixels (default: 2048) */
  maxTextureSize: number;
  /** Debounce timeout for texture generation in ms (default: 100) */
  debounceTimeout: number | null;
}

/**
 * Default options for SDFAtlasManager.
 */
export const DEFAULT_SDF_ATLAS_OPTIONS: SDFAtlasOptions = {
  fontSize: 64,
  buffer: 8,
  radius: 24,
  cutoff: 0.25,
  maxTextureSize: 2048,
  debounceTimeout: 100,
};

/**
 * Margin between glyphs in the atlas to prevent texture filtering bleeding.
 * Must be at least 2 to avoid LINEAR filtering sampling from adjacent glyphs.
 */
const GLYPH_MARGIN = 2;

const INF = 1e20;

// ============================================================================
// SDF glyph generation
// ============================================================================

/**
 * Result of generating an SDF glyph.
 */
interface SDFGlyph {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  glyphWidth: number;
  glyphHeight: number;
  glyphTop: number;
  glyphLeft: number;
  glyphAdvance: number;
}

/**
 * Per-font state for SDF generation: a canvas context configured for this
 * font, plus reusable scratch arrays for the EDT.
 */
interface SDFGeneratorState {
  ctx: CanvasRenderingContext2D;
  canvasSize: number;
  gridOuter: Float64Array;
  gridInner: Float64Array;
  f: Float64Array;
  z: Float64Array;
  v: Uint16Array;
}

function createSDFGenerator(
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  buffer: number,
): SDFGeneratorState {
  const canvasSize = fontSize + buffer * 4;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "black";

  return {
    ctx,
    canvasSize,
    gridOuter: new Float64Array(canvasSize * canvasSize),
    gridInner: new Float64Array(canvasSize * canvasSize),
    f: new Float64Array(canvasSize),
    z: new Float64Array(canvasSize + 1),
    v: new Uint16Array(canvasSize),
  };
}

function generateSDFGlyph(
  gen: SDFGeneratorState,
  char: string,
  buffer: number,
  radius: number,
  cutoff: number,
): SDFGlyph {
  const { ctx, canvasSize } = gen;

  const metrics = ctx.measureText(char);
  const glyphAdvance = metrics.width;
  const { actualBoundingBoxAscent, actualBoundingBoxDescent, actualBoundingBoxLeft, actualBoundingBoxRight } = metrics;

  const glyphTop = Math.ceil(actualBoundingBoxAscent);
  // actualBoundingBoxLeft is positive when the glyph extends LEFT of origin
  const glyphLeft = Math.ceil(actualBoundingBoxLeft);

  const glyphWidth = Math.max(
    0,
    Math.min(canvasSize - buffer, Math.ceil(actualBoundingBoxLeft) + Math.ceil(actualBoundingBoxRight)),
  );
  const glyphHeight = Math.min(canvasSize - buffer, glyphTop + Math.ceil(actualBoundingBoxDescent));

  const width = glyphWidth + 2 * buffer;
  const height = glyphHeight + 2 * buffer;

  const len = Math.max(width * height, 0);
  const data = new Uint8ClampedArray(len);
  const glyph: SDFGlyph = { data, width, height, glyphWidth, glyphHeight, glyphTop, glyphLeft, glyphAdvance };
  if (glyphWidth === 0 || glyphHeight === 0) return glyph;

  const { gridInner, gridOuter } = gen;

  // Draw glyph at (buffer + glyphLeft) so the full extent is captured
  // starting from x=buffer in the image data
  ctx.clearRect(buffer, buffer, glyphWidth, glyphHeight);
  ctx.fillText(char, buffer + glyphLeft, buffer + glyphTop);
  const imgData = ctx.getImageData(buffer, buffer, glyphWidth, glyphHeight);

  // Initialize grids
  gridOuter.fill(INF, 0, len);
  gridInner.fill(0, 0, len);

  for (let y = 0; y < glyphHeight; y++) {
    for (let x = 0; x < glyphWidth; x++) {
      const a = imgData.data[4 * (y * glyphWidth + x) + 3] / 255;
      if (a === 0) continue;

      const j = (y + buffer) * width + x + buffer;

      if (a === 1) {
        gridOuter[j] = 0;
        gridInner[j] = INF;
      } else {
        const d = 0.5 - a;
        gridOuter[j] = d > 0 ? d * d : 0;
        gridInner[j] = d < 0 ? d * d : 0;
      }
    }
  }

  edt(gridOuter, 0, 0, width, height, width, gen.f, gen.v, gen.z);
  edt(gridInner, buffer, buffer, glyphWidth, glyphHeight, width, gen.f, gen.v, gen.z);

  for (let i = 0; i < len; i++) {
    const d = Math.sqrt(gridOuter[i]) - Math.sqrt(gridInner[i]);
    data[i] = Math.round(255 - 255 * (d / radius + cutoff));
  }

  return glyph;
}

// 2D Euclidean squared distance transform (Felzenszwalb & Huttenlocher)
function edt(
  data: Float64Array,
  x0: number,
  y0: number,
  width: number,
  height: number,
  gridSize: number,
  f: Float64Array,
  v: Uint16Array | Float64Array,
  z: Float64Array,
): void {
  for (let x = x0; x < x0 + width; x++) edt1d(data, y0 * gridSize + x, gridSize, height, f, v, z);
  for (let y = y0; y < y0 + height; y++) edt1d(data, y * gridSize + x0, 1, width, f, v, z);
}

// 1D squared distance transform
function edt1d(
  grid: Float64Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  v: Uint16Array | Float64Array,
  z: Float64Array,
): void {
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  f[0] = grid[offset];

  for (let q = 1, k = 0, s = 0; q < length; q++) {
    f[q] = grid[offset + q * stride];
    const q2 = q * q;
    do {
      const r = v[k];
      s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);

    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }

  for (let q = 0, k = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    const qr = q - r;
    grid[offset + q * stride] = f[r] + qr * qr;
  }
}

// ============================================================================
// Atlas manager
// ============================================================================

/**
 * Internal state for a registered font.
 */
interface FontState {
  descriptor: FontDescriptor;
  generator: SDFGeneratorState;
  glyphs: Map<number, GlyphMetrics>;
}

/**
 * Cursor for tracking position when packing glyphs into atlas.
 */
interface AtlasCursor {
  x: number;
  y: number;
  rowHeight: number;
  atlasIndex: number;
}

/**
 * Manages SDF glyph generation and atlas packing for WebGL text rendering.
 */
export class SDFAtlasManager extends EventEmitter {
  /** Event emitted when atlas textures are updated */
  static ATLAS_UPDATED_EVENT = "atlasUpdated";

  private options: SDFAtlasOptions;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private measureCanvas: HTMLCanvasElement;
  private measureCtx: CanvasRenderingContext2D;

  private fonts: Map<FontKey, FontState> = new Map();
  private textures: ImageData[] = [];
  private cursor: AtlasCursor = { x: 0, y: 0, rowHeight: 0, atlasIndex: 0 };
  private pendingGlyphs: Array<{ fontKey: FontKey; charCode: number }> = [];
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: Partial<SDFAtlasOptions> = {}) {
    super();
    this.options = { ...DEFAULT_SDF_ATLAS_OPTIONS, ...options };

    // Create canvas for atlas texture generation
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.options.maxTextureSize;
    this.canvas.height = this.options.maxTextureSize;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

    // Create canvas for text measurement
    this.measureCanvas = document.createElement("canvas");
    this.measureCtx = this.measureCanvas.getContext("2d") as CanvasRenderingContext2D;

    // Initialize with empty first texture
    this.textures.push(this.ctx.getImageData(0, 0, 1, 1));
  }

  /**
   * Creates a unique font key from a font descriptor.
   */
  getFontKey(font: FontDescriptor): FontKey {
    return `${font.family}-${font.weight}-${font.style}`;
  }

  /**
   * Registers a font for SDF generation.
   */
  registerFont(font: FontDescriptor): FontKey {
    const key = this.getFontKey(font);

    if (this.fonts.has(key)) {
      return key;
    }

    const generator = createSDFGenerator(
      this.options.fontSize,
      font.family,
      font.weight,
      font.style,
      this.options.buffer,
    );

    this.fonts.set(key, {
      descriptor: font,
      generator,
      glyphs: new Map(),
    });

    return key;
  }

  /**
   * Ensures all characters in a string have glyphs in the atlas.
   */
  ensureGlyphs(text: string, fontKey: FontKey): void {
    const fontState = this.fonts.get(fontKey);
    if (!fontState) {
      throw new Error(`Font "${fontKey}" is not registered. Call registerFont() first.`);
    }

    let hasNewGlyphs = false;

    for (const char of text) {
      const charCode = char.codePointAt(0);
      if (charCode === undefined) continue;

      if (!fontState.glyphs.has(charCode)) {
        this.pendingGlyphs.push({ fontKey, charCode });
        hasNewGlyphs = true;
      }
    }

    if (hasNewGlyphs) {
      this.scheduleTextureGeneration();
    }
  }

  /**
   * Measures the width of a text string.
   */
  measureText(text: string, fontKey: FontKey): number {
    const fontState = this.fonts.get(fontKey);
    if (!fontState) {
      throw new Error(`Font "${fontKey}" is not registered.`);
    }

    const { family, weight, style } = fontState.descriptor;
    this.measureCtx.font = `${style} ${weight} ${this.options.fontSize}px ${family}`;

    return this.measureCtx.measureText(text).width;
  }

  /**
   * Gets glyph metrics for a character.
   */
  getGlyph(charCode: number, fontKey: FontKey): GlyphMetrics | undefined {
    const fontState = this.fonts.get(fontKey);
    if (!fontState) return undefined;
    return fontState.glyphs.get(charCode);
  }

  /**
   * Gets all atlas textures.
   */
  getTextures(): ImageData[] {
    return this.textures;
  }

  /**
   * Gets the number of registered fonts.
   */
  getFontCount(): number {
    return this.fonts.size;
  }

  /**
   * Gets the total number of glyphs in the atlas.
   */
  getGlyphCount(): number {
    let count = 0;
    for (const fontState of this.fonts.values()) {
      count += fontState.glyphs.size;
    }
    return count;
  }

  /**
   * Checks if there are pending glyphs to be rendered.
   */
  hasPendingGlyphs(): boolean {
    return this.pendingGlyphs.length > 0;
  }

  /**
   * Forces immediate texture generation (bypasses debounce).
   */
  flush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.generateTextures();
  }

  /**
   * Destroys the atlas manager and releases resources.
   */
  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.fonts.clear();
    this.textures = [];
    this.pendingGlyphs = [];
    this.removeAllListeners();
  }

  /**
   * Schedules texture generation with debouncing.
   */
  private scheduleTextureGeneration(): void {
    if (this.debounceTimer !== null) return;

    if (this.options.debounceTimeout === null) {
      this.generateTextures();
    } else {
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
        this.generateTextures();
      }, this.options.debounceTimeout);
    }
  }

  /**
   * Generates textures for all pending glyphs.
   */
  private generateTextures(): void {
    if (this.pendingGlyphs.length === 0) return;

    const { maxTextureSize, buffer, radius, cutoff } = this.options;

    for (const { fontKey, charCode } of this.pendingGlyphs) {
      const fontState = this.fonts.get(fontKey);
      if (!fontState || fontState.glyphs.has(charCode)) continue;

      const char = String.fromCodePoint(charCode);
      const glyph = generateSDFGlyph(fontState.generator, char, buffer, radius, cutoff);

      const glyphWidth = glyph.width;
      const glyphHeight = glyph.height;

      // Check if glyph fits in current row
      if (this.cursor.x + glyphWidth + GLYPH_MARGIN > maxTextureSize) {
        this.cursor.x = 0;
        this.cursor.y += this.cursor.rowHeight + GLYPH_MARGIN;
        this.cursor.rowHeight = 0;
      }

      // Check if we need a new texture
      if (this.cursor.y + glyphHeight + GLYPH_MARGIN > maxTextureSize) {
        this.finalizeCurrentTexture();
        this.cursor = { x: 0, y: 0, rowHeight: 0, atlasIndex: this.cursor.atlasIndex + 1 };
        this.ctx.clearRect(0, 0, maxTextureSize, maxTextureSize);
      }

      // Convert single-channel SDF data to RGBA for the atlas texture
      const sdfData = glyph.data;
      const rgbaData = new Uint8ClampedArray(glyphWidth * glyphHeight * 4);
      for (let i = 0; i < sdfData.length; i++) {
        const rgbaIndex = i * 4;
        rgbaData[rgbaIndex] = 255;
        rgbaData[rgbaIndex + 1] = 255;
        rgbaData[rgbaIndex + 2] = 255;
        rgbaData[rgbaIndex + 3] = sdfData[i];
      }
      const imageData = new ImageData(rgbaData, glyphWidth, glyphHeight);
      this.ctx.putImageData(imageData, this.cursor.x, this.cursor.y);

      // bearingX/bearingY point to the atlas region's top-left corner relative
      // to the character origin. The atlas region includes the SDF buffer, so
      // the bearing already accounts for it.
      const metrics: GlyphMetrics = {
        charCode,
        width: glyph.glyphWidth,
        height: glyph.glyphHeight,
        bearingX: -glyph.glyphLeft - buffer,
        bearingY: glyph.glyphTop + buffer,
        advance: glyph.glyphAdvance,
        atlasX: this.cursor.x,
        atlasY: this.cursor.y,
        atlasWidth: glyphWidth,
        atlasHeight: glyphHeight,
        atlasIndex: this.cursor.atlasIndex,
      };

      fontState.glyphs.set(charCode, metrics);

      this.cursor.x += glyphWidth + GLYPH_MARGIN;
      this.cursor.rowHeight = Math.max(this.cursor.rowHeight, glyphHeight);
    }

    this.finalizeCurrentTexture();

    this.pendingGlyphs = [];

    this.emit(SDFAtlasManager.ATLAS_UPDATED_EVENT, {
      textures: this.textures,
      glyphCount: this.getGlyphCount(),
    });
  }

  /**
   * Finalizes the current texture by capturing it as ImageData.
   */
  private finalizeCurrentTexture(): void {
    const { maxTextureSize } = this.options;

    // A page that already holds a completed row spans the full width, even when the
    // cursor sits at x = 0: overflow finalizes right after the row wrap reset x and
    // rowHeight, and reading cursor.x alone would then crop the page down to 1px.
    const hasCompletedRow = this.cursor.y > 0 || this.cursor.rowHeight > 0;
    const effectiveWidth = Math.min(maxTextureSize, Math.max(this.cursor.x, hasCompletedRow ? maxTextureSize : 1));
    const effectiveHeight = Math.min(maxTextureSize, this.cursor.y + this.cursor.rowHeight + GLYPH_MARGIN);

    const textureData = this.ctx.getImageData(0, 0, effectiveWidth, effectiveHeight);

    if (this.cursor.atlasIndex >= this.textures.length) {
      this.textures.push(textureData);
    } else {
      this.textures[this.cursor.atlasIndex] = textureData;
    }
  }
}
