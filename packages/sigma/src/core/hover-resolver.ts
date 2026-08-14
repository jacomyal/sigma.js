/**
 * Sigma.js Hover Resolver
 * =======================
 *
 * Resolves what sits under the pointer, with asynchronous picking reads
 * (PIXEL_PACK_BUFFER + fence). Runs on pointer moves and after renders, so
 * hover tracks items moving under a still cursor, without readPixels stalls.
 *
 * @module
 */
import { MouseCoords } from "../types";
import { colorToIndex, pickingPixelCoords } from "../utils";

export interface HoverResolverOptions {
  gl: WebGL2RenderingContext;
  getFrameBuffer(): WebGLFramebuffer | null;
  getPixelRatio(): number;
  getDownSizingRatio(): number;
  onIndex(pickingId: number, event: MouseCoords): void;
}

export class HoverResolver {
  private options: HoverResolverOptions;
  private readBuffer: WebGLBuffer | null = null;
  private fence: WebGLSync | null = null;
  private result = new Uint8Array(4);

  // Bumped when picking IDs are reallocated: a read started before the bump
  // would resolve stale pixels through the new lookup, so its result is
  // dropped (the post-render re-read replaces it).
  private generation = 0;
  private readGeneration = 0;

  // Latest pointer event, used as read position and event payload
  private lastEvent: MouseCoords | null = null;
  // No reads while the pointer is off the stage
  private active = false;
  // A request arrived while a read was in flight
  private dirty = false;
  private rafId: number | null = null;
  private killed = false;

  constructor(options: HoverResolverOptions) {
    this.options = options;
  }

  /** The pointer moved (mouse or touch): remember where, and re-resolve. */
  pointerMoved(event: MouseCoords): void {
    this.lastEvent = event;
    this.active = true;
    this.request();
  }

  /** The pointer left the stage: stop resolving until it comes back. */
  pointerLeft(): void {
    this.active = false;
    this.dirty = false;
  }

  /** A frame was rendered: the picking buffer changed, re-resolve. */
  frameRendered(): void {
    this.request();
  }

  /** Picking IDs were reallocated: in-flight reads are meaningless. */
  invalidate(): void {
    this.generation++;
  }

  private request(): void {
    if (this.killed || !this.active || !this.lastEvent) return;
    if (this.fence) {
      this.dirty = true;
      return;
    }
    this.startRead();
  }

  private startRead(): void {
    const { gl, getFrameBuffer, getPixelRatio, getDownSizingRatio } = this.options;
    this.readGeneration = this.generation;
    const event = this.lastEvent!;
    const [bufferX, bufferY] = pickingPixelCoords(gl, event.x, event.y, getPixelRatio(), getDownSizingRatio());

    if (!this.readBuffer) this.readBuffer = gl.createBuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, getFrameBuffer());
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.readBuffer);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, 4, gl.STREAM_READ);
    // With a PIXEL_PACK_BUFFER bound, readPixels does not wait for the GPU
    gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    this.schedulePoll(event);
  }

  private schedulePoll(event: MouseCoords): void {
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.poll(event);
    });
  }

  private poll(event: MouseCoords): void {
    const { gl, onIndex } = this.options;
    if (this.killed || !this.fence) return;

    const status = gl.clientWaitSync(this.fence, 0, 0);
    if (status === gl.TIMEOUT_EXPIRED) {
      this.schedulePoll(event);
      return;
    }

    gl.deleteSync(this.fence);
    this.fence = null;

    if (status !== gl.WAIT_FAILED && this.readGeneration === this.generation) {
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.readBuffer);
      gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.result);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

      const [r, g, b, a] = this.result;
      // The pointer may have left the stage during the read
      if (this.active) onIndex(colorToIndex(r, g, b, a), event);
    }

    if (this.dirty) {
      this.dirty = false;
      if (this.active && this.lastEvent) this.startRead();
    }
  }

  kill(): void {
    this.killed = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    const { gl } = this.options;
    if (this.fence) gl.deleteSync(this.fence);
    this.fence = null;
    if (this.readBuffer) gl.deleteBuffer(this.readBuffer);
    this.readBuffer = null;
  }
}
