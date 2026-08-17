/**
 * Sigma.js Attachment Texture Manager
 * ====================================
 *
 * Manages the lifecycle of label attachment textures: invoking user renderers,
 * converting content to canvas (async for SVG/HTML), packing into an atlas
 * texture, and uploading to WebGL.
 *
 * @module
 */
import { LabelAttachmentContext, LabelAttachmentRenderer } from "../../../primitives";
import { AtlasEntry, AtlasLookup, PackableItem, ShelfCursor, packItemsOnPage } from "../../../utils";
import { contentToCanvas } from "./attachment-converter";
import { ATTACHMENT_TEXTURE_UNIT } from "./attachment-program";

const ATLAS_SIZE = 2048;

interface CachedAttachment {
  image: HTMLCanvasElement;
  width: number;
  height: number;
}

export class AttachmentManager {
  private renderers: Record<string, LabelAttachmentRenderer>;
  private scheduleRender: () => void;
  private cache: Map<string, CachedAttachment> = new Map();
  // Keys for in-flight async conversions — prevents duplicate work
  private pending: Set<string> = new Set();
  private atlas: AtlasLookup = {};
  private glTexture: WebGLTexture | null = null;
  private dirty = true;
  private gl: WebGL2RenderingContext;
  private packCanvas: HTMLCanvasElement;
  private packCtx: CanvasRenderingContext2D;

  constructor(
    gl: WebGL2RenderingContext,
    renderers: Record<string, LabelAttachmentRenderer>,
    scheduleRender: () => void,
  ) {
    this.gl = gl;
    this.renderers = renderers;
    this.scheduleRender = scheduleRender;
    this.packCanvas = document.createElement("canvas");
    this.packCanvas.width = ATLAS_SIZE;
    this.packCanvas.height = ATLAS_SIZE;
    this.packCtx = this.packCanvas.getContext("2d")!;
  }

  /**
   * Invokes the renderer for a node attachment if not already cached or pending.
   * Sync content starts an async canvas conversion; async content (Promise) is
   * awaited. In both cases the result is stored when ready and a re-render is
   * scheduled via the callback provided at construction.
   */
  renderAttachment(node: string, attachmentName: string, context: LabelAttachmentContext): void {
    const key = `${node}:${attachmentName}`;
    if (this.cache.has(key) || this.pending.has(key)) return;

    const renderer = this.renderers[attachmentName];
    if (!renderer) return;

    const result = renderer(context);
    if (!result) return;

    this.pending.add(key);

    const { pixelRatio } = context;
    Promise.resolve(result).then(async (content) => {
      // Discard if the node was invalidated while we were waiting
      if (!this.pending.has(key)) return;
      this.pending.delete(key);

      if (!content) return;

      const canvas = await contentToCanvas(content, pixelRatio);
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;

      this.cache.set(key, { image: canvas, width: canvas.width, height: canvas.height });
      this.dirty = true;
      this.scheduleRender();
    });
  }

  /**
   * Packs all cached attachments into atlas textures and uploads to GL.
   * Uploads the canvas directly (preserving premultiplied alpha).
   * No-op when nothing has changed since the last call.
   */
  regenerateAtlas(): void {
    if (!this.dirty) return;
    this.dirty = false;

    const items: PackableItem[] = [];
    this.cache.forEach((cached, key) => {
      items.push({
        key,
        width: cached.width,
        height: cached.height,
        draw: (ctx, destX, destY) => {
          ctx.drawImage(cached.image, destX, destY);
        },
      });
    });

    if (items.length === 0) {
      this.atlas = {};
      this.deleteGLTexture();
      return;
    }

    // Pack items on the canvas
    const cursor: ShelfCursor = { x: 0, y: 0, rowHeight: 0, maxRowWidth: 0 };
    this.packCtx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    const { atlas, remaining } = packItemsOnPage(items, this.packCtx, cursor);
    this.atlas = atlas;

    if (remaining.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `Sigma: ${remaining.length} label attachment(s) could not fit in the ${ATLAS_SIZE}x${ATLAS_SIZE} atlas and will not be rendered.`,
      );
    }

    // Upload the canvas directly, preserving premultiplied alpha to match
    // sigma's blending mode (gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    this.deleteGLTexture();
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + ATTACHMENT_TEXTURE_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.packCanvas);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.glTexture = tex;
  }

  /**
   * Binds the atlas texture to the given WebGL texture unit.
   */
  bindTexture(textureUnit: number): void {
    if (!this.glTexture) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  }

  /**
   * Returns atlas entry for a cached attachment, or null if not packed yet.
   */
  getEntry(node: string, attachmentName: string): AtlasEntry | null {
    const cacheKey = `${node}:${attachmentName}`;
    return this.atlas[cacheKey] || null;
  }

  /**
   * Invalidates cached and in-flight attachments for a node (e.g., on state change).
   */
  invalidateNode(node: string): void {
    const prefix = `${node}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        this.dirty = true;
      }
    }
    // Cancels pending conversions: the guard in renderAttachment checks pending.has(key)
    for (const key of this.pending) {
      if (key.startsWith(prefix)) this.pending.delete(key);
    }
  }

  /** Drops the dead GL texture after a context loss, for the next atlas pass to repack. */
  restore(): void {
    this.glTexture = null;
    this.dirty = true;
  }

  /**
   * Clears all cached data and textures.
   */
  clear(): void {
    this.cache.clear();
    this.pending.clear();
    this.atlas = {};
    this.dirty = true;
    this.deleteGLTexture();
  }

  /**
   * Full cleanup — releases GL resources and drops references for GC.
   */
  kill(): void {
    this.clear();
    this.packCanvas = null as unknown as HTMLCanvasElement;
    this.packCtx = null as unknown as CanvasRenderingContext2D;
    this.gl = null as unknown as WebGL2RenderingContext;
  }

  private deleteGLTexture(): void {
    if (this.glTexture) {
      this.gl.deleteTexture(this.glTexture);
      this.glTexture = null;
    }
  }
}
