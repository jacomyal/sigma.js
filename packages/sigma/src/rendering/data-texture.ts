/**
 * Sigma.js Data Texture Base Class
 * =================================
 *
 * Abstract base class for GPU textures that store item data (nodes, edges, etc.).
 * Provides shared infrastructure for:
 * - 2D RGBA32F texture management
 * - Free-list index allocation
 * - Dirty range tracking for efficient uploads
 * - Automatic resizing
 *
 * @module
 */
import { colorToArray } from "../utils";

const INITIAL_CAPACITY = 1024;
const GROWTH_FACTOR = 1.5;
// Maximum texture width to stay within WebGL limits (4096 is widely supported)
const MAX_TEXTURE_WIDTH = 4096;

/**
 * Sentinel written to `a_nodeIndex` / `a_edgeIndex` for hidden items.
 *
 * Programs zero out a hidden item's whole vertex buffer slot, but 0 is a *valid*
 * texture row, so a zeroed slot is indistinguishable from "item at row 0" — the
 * shader would happily render the hidden instance using item 0's geometry and
 * attributes. Flagging the row with a negative value lets the vertex shader
 * detect the case and discard the primitive instead.
 */
export const HIDDEN_ITEM_INDEX = -1;

/**
 * Base class for GPU data textures.
 *
 * The texture is a 2D RGBA32F texture where each item uses TEXELS_PER_ITEM texels.
 * The texture uses a 2D layout (width × height) to stay within WebGL maximum
 * texture dimension limits.
 *
 * Item indices are allocated via a free-list strategy for efficient
 * add/remove operations without compaction.
 */
export class DataTexture {
  protected readonly TEXELS_PER_ITEM: number;

  protected gl: WebGL2RenderingContext;
  protected texture: WebGLTexture | null = null;
  protected data: Float32Array;
  protected capacity: number;
  protected textureWidth: number;
  protected textureHeight: number;
  protected dirty: boolean = false;
  protected dirtyRangeStart: number = Infinity;
  protected dirtyRangeEnd: number = -1;

  // Item key -> texture index mapping
  protected indexMap: Map<string | number, number> = new Map();
  // Free list for recycling indices when items are removed
  protected freeIndices: number[] = [];
  // Next index to allocate if free list is empty
  protected nextIndex: number = 0;

  constructor(gl: WebGL2RenderingContext, texelsPerItem: number, initialCapacity: number = INITIAL_CAPACITY) {
    this.gl = gl;
    this.TEXELS_PER_ITEM = texelsPerItem;
    this.capacity = this.roundUpToPowerOfTwo(initialCapacity);
    const dims = this.computeTextureDimensions(this.capacity);
    this.textureWidth = dims.width;
    this.textureHeight = dims.height;
    this.data = new Float32Array(this.textureWidth * this.textureHeight * 4);
    this.createTexture();
  }

  /**
   * Computes 2D texture dimensions for a given item capacity.
   * Width is capped at MAX_TEXTURE_WIDTH, height grows as needed.
   */
  protected computeTextureDimensions(itemCapacity: number): { width: number; height: number } {
    const totalTexels = itemCapacity * this.TEXELS_PER_ITEM;
    const width = Math.min(totalTexels, MAX_TEXTURE_WIDTH);
    const height = Math.ceil(totalTexels / width);
    return { width, height };
  }

  /**
   * Rounds up to next power of two for efficient WebGL texture sizing.
   */
  protected roundUpToPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(Math.max(1, n))));
  }

  /**
   * Creates the WebGL texture with appropriate format and filtering.
   */
  protected createTexture(): void {
    const { gl } = this;

    this.texture = gl.createTexture();

    // Bind on scratch unit 0 (all other units hold live textures):
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // RGBA32F format for full float precision, 2D layout
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureWidth, this.textureHeight, 0, gl.RGBA, gl.FLOAT, this.data);

    // No filtering needed - we use texelFetch for exact lookups
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Resizes the texture to accommodate more items.
   */
  protected resize(newCapacity: number): void {
    if (newCapacity <= this.capacity) return;

    const targetCapacity = this.roundUpToPowerOfTwo(Math.ceil(newCapacity * GROWTH_FACTOR));
    const { gl } = this;

    // Compute new 2D dimensions
    const newDims = this.computeTextureDimensions(targetCapacity);

    // Create new data array and copy existing data
    const newData = new Float32Array(newDims.width * newDims.height * 4);
    newData.set(this.data);

    // Delete old texture and create new one
    if (this.texture) {
      gl.deleteTexture(this.texture);
    }

    this.data = newData;
    this.capacity = targetCapacity;
    this.textureWidth = newDims.width;
    this.textureHeight = newDims.height;
    this.createTexture();

    // Mark entire texture as dirty for upload
    this.dirty = true;
    this.dirtyRangeStart = 0;
    this.dirtyRangeEnd = this.nextIndex;
  }

  /**
   * Allocates a texture index for an item.
   * Returns existing index if item already allocated.
   */
  allocate(key: string | number): number {
    // Check if already allocated
    const existing = this.indexMap.get(key);
    if (existing !== undefined) {
      return existing;
    }

    // Get index from free list or allocate new
    let index: number;
    if (this.freeIndices.length > 0) {
      index = this.freeIndices.pop()!;
    } else {
      index = this.nextIndex++;

      // Resize if needed
      if (index >= this.capacity) {
        this.resize(index + 1);
      }
    }

    this.indexMap.set(key, index);
    return index;
  }

  /**
   * Frees an item's texture index for reuse.
   */
  free(key: string | number): void {
    const index = this.indexMap.get(key);
    if (index === undefined) return;

    this.indexMap.delete(key);
    this.freeIndices.push(index);

    // Zero out the data to avoid stale reads
    const texelBase = index * this.TEXELS_PER_ITEM * 4;
    for (let i = 0; i < this.TEXELS_PER_ITEM * 4; i++) {
      this.data[texelBase + i] = 0;
    }

    this.markDirty(index);
  }

  /**
   * Gets the texture index for an item.
   * Returns -1 if item not found.
   */
  getIndex(key: string | number): number {
    return this.indexMap.get(key) ?? -1;
  }

  /**
   * Checks if an item has been allocated.
   */
  has(key: string | number): boolean {
    return this.indexMap.has(key);
  }

  /**
   * Marks an item index as dirty for upload.
   */
  protected markDirty(index: number): void {
    this.dirty = true;
    this.dirtyRangeStart = Math.min(this.dirtyRangeStart, index);
    this.dirtyRangeEnd = Math.max(this.dirtyRangeEnd, index + 1);
  }

  /**
   * Uploads dirty data to the GPU texture.
   * With 2D layout and multiple texels per item, uploads affected rows.
   */
  upload(): void {
    if (!this.dirty || !this.texture) return;

    const { gl, textureWidth } = this;

    // Bind on scratch unit 0 (all other units hold live textures):
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Convert item range to texel range
    const startTexel = this.dirtyRangeStart * this.TEXELS_PER_ITEM;
    const endTexel = Math.min(this.dirtyRangeEnd * this.TEXELS_PER_ITEM, this.capacity * this.TEXELS_PER_ITEM);

    if (startTexel < endTexel) {
      // Calculate affected rows
      const startRow = Math.floor(startTexel / textureWidth);
      const endRow = Math.floor((endTexel - 1) / textureWidth);

      // Upload each affected row
      for (let row = startRow; row <= endRow; row++) {
        const rowStart = row * textureWidth;
        const rowEnd = Math.min(rowStart + textureWidth, this.capacity * this.TEXELS_PER_ITEM);

        // Calculate the actual range within this row that needs updating
        const uploadStart = Math.max(startTexel, rowStart);
        const uploadEnd = Math.min(endTexel, rowEnd);

        if (uploadStart < uploadEnd) {
          const xOffset = uploadStart - rowStart;
          const width = uploadEnd - uploadStart;
          const subData = this.data.subarray(uploadStart * 4, uploadEnd * 4);

          gl.texSubImage2D(gl.TEXTURE_2D, 0, xOffset, row, width, 1, gl.RGBA, gl.FLOAT, subData);
        }
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, null);

    // Reset dirty tracking
    this.dirty = false;
    this.dirtyRangeStart = Infinity;
    this.dirtyRangeEnd = -1;
  }

  /**
   * Binds the texture to a texture unit.
   */
  bind(textureUnit: number): void {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  /**
   * Gets the WebGL texture object.
   */
  getTexture(): WebGLTexture | null {
    return this.texture;
  }

  /**
   * Gets the current capacity (max items).
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Gets the texture width (needed for 2D coordinate calculation in shaders).
   */
  getTextureWidth(): number {
    return this.textureWidth;
  }

  /**
   * Gets the texture height (needed to cover the full texture when rendering
   * into it).
   */
  getTextureHeight(): number {
    return this.textureHeight;
  }

  /**
   * Gets the number of texels per item.
   */
  getTexelsPerItem(): number {
    return this.TEXELS_PER_ITEM;
  }

  /**
   * Gets the number of allocated items.
   */
  getCount(): number {
    return this.indexMap.size;
  }

  /**
   * Highest index ever allocated + 1. Unlike `getCount`, this spans freed
   * holes, so it bounds every live item's row (what a per-row `gl_VertexID`
   * pass must cover).
   */
  getHighWaterMark(): number {
    return this.nextIndex;
  }

  /**
   * Checks if there are pending changes to upload.
   */
  isDirty(): boolean {
    return this.dirty;
  }

  /**
   * Clears all item allocations (but keeps the texture).
   */
  clear(): void {
    this.indexMap.clear();
    this.freeIndices = [];
    this.nextIndex = 0;
    this.data.fill(0);
    this.dirty = true;
    this.dirtyRangeStart = 0;
    this.dirtyRangeEnd = this.capacity;
  }

  /**
   * Destroys the texture and clears all data.
   */
  kill(): void {
    if (this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }
    this.indexMap.clear();
    this.freeIndices = [];
  }
}

// ============================================================================
// Generic Attribute Layout and Texture
// ============================================================================

/**
 * Specification for an attribute to be stored in a texture.
 */
export interface AttributeSpec {
  name: string;
  size: 1 | 2 | 3 | 4;
}

/**
 * Describes the memory layout of attributes in a texture.
 */
export interface AttributeLayout {
  /** Total floats needed per item */
  floatsPerItem: number;
  /** Number of texels (4 floats each) per item */
  texelsPerItem: number;
  /** Map of attribute name (without a_ prefix) to float offset */
  offsets: Record<string, number>;
  /** Map of attribute name (without a_ prefix) to its spec */
  specs: Record<string, AttributeSpec>;
}

/**
 * Computes the memory layout for a collection of attributes.
 * Collects all unique attributes and assigns sequential offsets.
 *
 * @param sources - Array of objects containing attributes arrays
 * @returns Layout describing attribute positions in the texture
 */
export function computeAttributeLayout(sources: Array<{ attributes: AttributeSpec[] }>): AttributeLayout {
  const offsets: Record<string, number> = {};
  const specs: Record<string, AttributeSpec> = {};
  let offset = 0;

  for (const source of sources) {
    for (const attr of source.attributes) {
      const name = attr.name.replace(/^a_/, "");
      if (!(name in offsets)) {
        offsets[name] = offset;
        specs[name] = attr;
        offset += attr.size;
      }
    }
  }

  return {
    floatsPerItem: offset,
    texelsPerItem: Math.max(1, Math.ceil(offset / 4)),
    offsets,
    specs,
  };
}

/**
 * Generic attribute texture for storing per-item attribute data.
 * Used as base for both node layer attributes and edge path attributes.
 */
export class ItemAttributeTexture extends DataTexture {
  protected readonly floatsPerItem: number;

  constructor(gl: WebGL2RenderingContext, layout: AttributeLayout, initialCapacity?: number) {
    super(gl, layout.texelsPerItem, initialCapacity);
    this.floatsPerItem = layout.floatsPerItem;
  }

  /**
   * Updates all attributes for an item at once.
   * The packedData array should contain floatsPerItem values in the order
   * defined by the layout offsets.
   * Auto-allocates the item if not already allocated.
   */
  updateAllAttributes(key: string | number, packedData: ArrayLike<number>): void {
    let index = this.indexMap.get(key);
    if (index === undefined) {
      index = this.allocate(key);
    }

    const baseOffset = index * this.TEXELS_PER_ITEM * 4;
    const length = Math.min(packedData.length, this.floatsPerItem);

    for (let i = 0; i < length; i++) {
      this.data[baseOffset + i] = packedData[i];
    }

    this.markDirty(index);
  }
}

/**
 * Pre-computed descriptor for a single attribute, used to avoid
 * per-item string operations and dynamic dispatch in hot loops.
 */
export interface AttrDescriptor {
  /** Property name to read from display data (pre-stripped of "a_" prefix) */
  sourceKey: string;
  /** Pre-computed offset into the packed Float32Array */
  packedOffset: number;
  /** Attribute component count */
  size: number;
  /** Whether this is a color attribute (size===4 && normalized) */
  isColor: boolean;
  /** Default numeric value (for size===1) */
  defaultNum: number;
  /** Default color string (for color attributes) */
  defaultColor: string;
  /** Index of the source (layer/path) in the original array, for lifecycle hook lookup */
  sourceIndex: number;
  /** Whether this attribute's source has a lifecycle getAttributeData hook */
  hasLifecycleHook: boolean;
}

/** Minimal attribute spec needed by buildAttrDescriptors. */
interface AttrSpec {
  name: string;
  size: number;
  normalized?: boolean;
  source?: string;
  defaultValue?: unknown;
}

/** Minimal lifecycle hook interface needed by buildAttrDescriptors. */
interface AttrLifecycleHooks {
  getAttributeData?: (data: Record<string, unknown>, sourceName: string) => unknown;
}

/**
 * Builds a flat array of AttrDescriptors from paths/layers, pre-computing
 * all the information that processVisibleItem needs per attribute.
 */
export function buildAttrDescriptors(
  sources: Array<{ attributes: AttrSpec[] }>,
  layout: AttributeLayout,
  lifecycleMap?: Map<number, AttrLifecycleHooks>,
): AttrDescriptor[] {
  const descriptors: AttrDescriptor[] = [];
  const seen = new Set<string>();

  for (let srcIdx = 0; srcIdx < sources.length; srcIdx++) {
    const source = sources[srcIdx];
    for (const attr of source.attributes) {
      const name = attr.name.replace(/^a_/, "");
      if (seen.has(name)) continue;
      seen.add(name);

      const offset = layout.offsets[name];
      if (offset === undefined) continue;

      const hooks = lifecycleMap?.get(srcIdx);

      descriptors.push({
        sourceKey: attr.source || name,
        packedOffset: offset,
        size: attr.size,
        isColor: attr.size === 4 && !!attr.normalized,
        defaultNum: typeof attr.defaultValue === "number" ? attr.defaultValue : 0,
        defaultColor: typeof attr.defaultValue === "string" ? attr.defaultValue : "",
        sourceIndex: srcIdx,
        hasLifecycleHook: !!hooks?.getAttributeData,
      });
    }
  }

  return descriptors;
}

/**
 * Packs attribute values into a Float32Array according to pre-computed descriptors.
 * Shared by both node and edge factories.
 */
export function packAttributes(
  descriptors: AttrDescriptor[],
  data: Record<string, unknown>,
  packed: Float32Array,
  color: string,
  opacity: number,
  lifecycles: Map<number, { getAttributeData?: (data: Record<string, unknown>, sourceName: string) => unknown }>,
  lifecycleIndexOffset: number,
): void {
  packed.fill(0);

  for (let di = 0, dl = descriptors.length; di < dl; di++) {
    const d = descriptors[di];
    const off = d.packedOffset;

    let value: unknown;
    if (d.hasLifecycleHook) {
      const hooks = lifecycles.get(d.sourceIndex - lifecycleIndexOffset);
      value = hooks!.getAttributeData!(data, d.sourceKey);
      if (value === null) value = data[d.sourceKey];
    } else {
      value = data[d.sourceKey];
    }

    if (d.isColor) {
      const colorStr = typeof value === "string" ? value : d.defaultColor || color;
      const [r, g, b, a] = colorToArray(colorStr);
      packed[off] = r / 255;
      packed[off + 1] = g / 255;
      packed[off + 2] = b / 255;
      packed[off + 3] = (a / 255) * opacity;
    } else if (d.size === 1) {
      packed[off] = typeof value === "number" ? value : d.defaultNum;
    } else {
      const arr = Array.isArray(value) ? value : null;
      if (arr) {
        for (let i = 0; i < d.size; i++) packed[off + i] = arr[i] ?? 0;
      }
    }
  }
}

// ============================================================================
// Shared Texture Fetch GLSL Generation
// ============================================================================

/**
 * Naming context for generating texture-fetch GLSL code.
 */
export interface TextureFetchNaming {
  /** Prefix for GLSL local variables: e.g. "layer" → layerTexel0, layerCoord0 */
  varPrefix: string;
  /** GLSL expression for the base texel index, e.g. "nodeIdx * u_layerAttributeTexelsPerNode" */
  baseTexelExpr: string;
  /** Uniform name for texture width, e.g. "u_layerAttributeTextureWidth" */
  textureWidthUniform: string;
  /** Uniform name for the texture sampler, e.g. "u_layerAttributeTexture" */
  textureSamplerUniform: string;
}

const COMPONENTS = ["r", "g", "b", "a"];

/**
 * Generates GLSL code to fetch packed attributes from a 2D RGBA32F texture.
 * Used by both node and edge shaders.
 */
export function generateAttributeTextureFetch(
  layout: AttributeLayout,
  naming: TextureFetchNaming,
): { fetchCode: string; varyingAssignments: string } {
  const { offsets, specs, texelsPerItem, floatsPerItem } = layout;
  const attributeNames = Object.keys(offsets);

  if (attributeNames.length === 0 || floatsPerItem === 0) {
    return { fetchCode: "", varyingAssignments: "" };
  }

  const { varPrefix, baseTexelExpr, textureWidthUniform, textureSamplerUniform } = naming;
  const lines: string[] = [];

  // Base texel computation
  lines.push(`  int ${varPrefix}BaseTexel = ${baseTexelExpr};`);
  lines.push("");

  // Fetch all needed texels
  for (let t = 0; t < texelsPerItem; t++) {
    lines.push(
      `  ivec2 ${varPrefix}Coord${t} = ivec2((${varPrefix}BaseTexel + ${t}) % ${textureWidthUniform}, (${varPrefix}BaseTexel + ${t}) / ${textureWidthUniform});`,
    );
    lines.push(`  vec4 ${varPrefix}Texel${t} = texelFetch(${textureSamplerUniform}, ${varPrefix}Coord${t}, 0);`);
  }
  lines.push("");

  // Extract each attribute from texels
  const varyingLines: string[] = [];

  for (const name of attributeNames) {
    const spec = specs[name];
    const offset = offsets[name];
    const texelIndex = Math.floor(offset / 4);
    const component = offset % 4;
    const texel = `${varPrefix}Texel${texelIndex}`;
    const nextTexel = `${varPrefix}Texel${texelIndex + 1}`;

    if (spec.size === 1) {
      lines.push(`  float fetched_${name} = ${texel}.${COMPONENTS[component]};`);
    } else if (spec.size === 4 && component === 0) {
      lines.push(`  vec4 fetched_${name} = ${texel};`);
    } else {
      const endComponent = component + spec.size;
      if (endComponent <= 4) {
        // Fits within one texel
        const glslType = `vec${spec.size}`;
        const swizzle = COMPONENTS.slice(component, endComponent).join("");
        lines.push(`  ${glslType} fetched_${name} = ${texel}.${swizzle};`);
      } else {
        // Spans two texels
        const glslType = spec.size === 4 ? "vec4" : `vec${spec.size}`;
        const firstParts = COMPONENTS.slice(component).map((c) => `${texel}.${c}`);
        const secondParts = COMPONENTS.slice(0, endComponent - 4).map((c) => `${nextTexel}.${c}`);
        const allParts = [...firstParts, ...secondParts].join(", ");
        lines.push(`  ${glslType} fetched_${name} = ${glslType}(${allParts});`);
      }
    }

    varyingLines.push(`  v_${name} = fetched_${name};`);
  }

  return {
    fetchCode: lines.join("\n"),
    varyingAssignments: varyingLines.join("\n"),
  };
}
